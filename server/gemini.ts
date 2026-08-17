import { GoogleGenAI } from '@google/genai'
import type {
  AiClassifiedStatement,
  AiExtractionEvidence,
  CommitmentNodeType,
  SourceArtifact,
} from '../src/domain/types'

const MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'
const ALLOWED_TYPES: CommitmentNodeType[] = [
  'CustomerObjective',
  'CustomerPreference',
  'SalesCommitment',
  'EngineeringConstraint',
  'SiteClaim',
  'Assumption',
  'Evidence',
  'Decision',
  'DeploymentGate',
  'VerificationTest',
  'ScopeClause',
]

interface GeminiPayload {
  classifiedStatements?: Array<{
    artifactId?: string
    quote?: string
    type?: string
    confidence?: number
  }>
  patchRationale?: string
}

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY
  if (apiKey) {
    return {
      client: new GoogleGenAI({
        apiKey,
        apiVersion: 'v1beta',
        httpOptions: { timeout: 20_000, retryOptions: { attempts: 1 } },
      }),
      provider: 'gemini-api' as const,
    }
  }

  const project = process.env.GOOGLE_CLOUD_PROJECT
  if (project) {
    return {
      client: new GoogleGenAI({
        vertexai: true,
        project,
        location: process.env.GOOGLE_CLOUD_LOCATION ?? 'global',
        apiVersion: 'v1',
        httpOptions: { timeout: 20_000, retryOptions: { attempts: 1 } },
      }),
      provider: 'gemini-vertex' as const,
    }
  }

  return undefined
}

const promptFor = (artifacts: SourceArtifact[]) => `
You are the compiler front-end for DeployAlign, a robotics deployment review tool.
This is a SYNTHETIC demonstration. Extract atomic source statements and classify each one.

Allowed semantic types:
${ALLOWED_TYPES.join(', ')}

Rules:
- quote must be an exact substring of the supplied artifact.
- Return exactly three classifiedStatements: one representative quote from each artifact.
- Preserve preference, commitment, constraint, site claim, assumption, and evidence as different types.
- Do not invent measurements, costs, dates, performance, or evidence.
- Produce a concise patchRationale for the minimum reviewable scope patch from
  "all materials / every area / fully autonomous" to
  "five named analytes / 12 mapped critical AOIs / supervised Phase 1".
- patchRationale must be one sentence and no more than 300 characters.
- The rationale is a candidate only; deterministic checks and a human approval gate control the result.

Artifacts:
${artifacts
  .map(
    (artifact) =>
      `\n[${artifact.id} | ${artifact.role} | ${artifact.title}]\n${artifact.content.slice(0, 4_000)}`,
  )
  .join('\n')}
`

export const extractWithGemini = async (
  artifacts: SourceArtifact[],
): Promise<AiExtractionEvidence | undefined> => {
  if (process.env.ALLOW_LIVE_GEMINI !== 'true') return undefined

  const configured = getClient()
  if (!configured) return undefined

  const started = Date.now()
  const response = await configured.client.models.generateContent({
    model: MODEL,
    contents: promptFor(artifacts),
    config: {
      temperature: 0.1,
      maxOutputTokens: 1_600,
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: 'application/json',
      responseJsonSchema: {
        type: 'object',
        required: ['classifiedStatements', 'patchRationale'],
        properties: {
          classifiedStatements: {
            type: 'array',
            minItems: 3,
            maxItems: 3,
            items: {
              type: 'object',
              required: ['artifactId', 'quote', 'type', 'confidence'],
              properties: {
                artifactId: { type: 'string' },
                quote: { type: 'string' },
                type: { type: 'string', enum: ALLOWED_TYPES },
                confidence: { type: 'number', minimum: 0, maximum: 1 },
              },
            },
          },
          patchRationale: { type: 'string' },
        },
      },
    },
  })

  const payload = JSON.parse(response.text ?? '{}') as GeminiPayload
  const validStatements = (payload.classifiedStatements ?? []).filter((statement) => {
    const artifact = artifacts.find((candidate) => candidate.id === statement.artifactId)
    return Boolean(
      artifact &&
        statement.quote &&
        artifact.content.includes(statement.quote) &&
        statement.type &&
        ALLOWED_TYPES.includes(statement.type as CommitmentNodeType) &&
        typeof statement.confidence === 'number' &&
        Number.isFinite(statement.confidence) &&
        statement.confidence >= 0 &&
        statement.confidence <= 1,
    )
  })

  const uniqueStatements = Array.from(
    new Map(
      validStatements.map((statement) => [
        `${statement.artifactId}:${statement.type}:${statement.quote}`,
        statement,
      ]),
    ).values(),
  )

  const coveredArtifacts = new Set(uniqueStatements.map((statement) => statement.artifactId))
  if (uniqueStatements.length < 3 || artifacts.some((artifact) => !coveredArtifacts.has(artifact.id))) {
    throw new Error('Gemini extraction failed source-map validation.')
  }

  const rationale = payload.patchRationale?.trim()
  if (!rationale || rationale.length > 1_000) {
    throw new Error('Gemini patch rationale failed validation.')
  }

  return {
    provider: configured.provider,
    model: MODEL,
    statementCount: uniqueStatements.length,
    classifiedStatements: uniqueStatements.map(
      (statement): AiClassifiedStatement => ({
        artifactId: statement.artifactId as string,
        quote: statement.quote as string,
        type: statement.type as CommitmentNodeType,
        confidence: statement.confidence as number,
      }),
    ),
    rawSummary: rationale,
    durationMs: Date.now() - started,
  }
}
