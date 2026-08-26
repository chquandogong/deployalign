import { GoogleGenAI, ThinkingLevel } from '@google/genai'
import type {
  AiClassifiedStatement,
  AiExtractionEvidence,
  CommitmentNodeType,
  SourceArtifact,
} from '../src/domain/types'

/**
 * Default extraction model. Gemini 3.7 Flash reached general availability on
 * 2026-08-13; Gemini 2.5 Flash is on a retirement track on Vertex AI, so the
 * default moved off it. Override with GEMINI_MODEL for a pinned deployment.
 */
export const DEFAULT_GEMINI_MODEL = 'gemini-3.7-flash'
export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL

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

const THINKING_LEVELS: Record<string, ThinkingLevel> = {
  minimal: ThinkingLevel.MINIMAL,
  low: ThinkingLevel.LOW,
  medium: ThinkingLevel.MEDIUM,
  high: ThinkingLevel.HIGH,
}

export type ThinkingConfig = { thinkingLevel: ThinkingLevel } | { thinkingBudget: number }

/**
 * Gemini 3.x models take a `thinkingLevel` and cannot switch thinking off;
 * Gemini 2.5 models take a numeric `thinkingBudget`, where 0 disables it.
 * Extraction is a bounded classification task, so the lowest level the model
 * accepts is used unless GEMINI_THINKING_LEVEL (low | medium | high; `minimal`
 * only on the Flash-Lite models) says otherwise. The override is ignored for
 * 2.5 models, which keep thinking disabled.
 */
export const thinkingConfigFor = (model: string, levelOverride?: string): ThinkingConfig => {
  const isGemini3 = /^gemini-3(\.\d+)?-/.test(model)
  if (!isGemini3) return { thinkingBudget: 0 }
  const requested = levelOverride?.trim().toLowerCase()
  return { thinkingLevel: (requested && THINKING_LEVELS[requested]) || ThinkingLevel.LOW }
}

export interface GeminiPayload {
  classifiedStatements?: Array<{
    artifactId?: string
    quote?: string
    type?: string
    confidence?: number
  }>
  patchRationale?: string
}

export interface ValidatedGeminiPayload {
  statements: AiClassifiedStatement[]
  rationale: string
}

/**
 * Pure validation of a model response against the artifacts that were sent.
 * Every kept statement must quote its artifact exactly, use an allowed type and
 * carry a confidence in [0, 1]; at least three unique statements must survive
 * and every artifact must be covered. The rationale must be non-empty and
 * bounded. Anything else is rejected so the deterministic compiler continues
 * without model evidence.
 */
export const validateGeminiPayload = (
  payload: GeminiPayload,
  artifacts: SourceArtifact[],
): ValidatedGeminiPayload => {
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
    statements: uniqueStatements.map(
      (statement): AiClassifiedStatement => ({
        artifactId: statement.artifactId as string,
        quote: statement.quote as string,
        type: statement.type as CommitmentNodeType,
        confidence: statement.confidence as number,
      }),
    ),
    rationale,
  }
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
        // Gemini 3.x Flash models are served from the global endpoint only.
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
    model: GEMINI_MODEL,
    contents: promptFor(artifacts),
    config: {
      temperature: 0.1,
      maxOutputTokens: 1_600,
      thinkingConfig: thinkingConfigFor(GEMINI_MODEL, process.env.GEMINI_THINKING_LEVEL),
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
  const validated = validateGeminiPayload(payload, artifacts)

  return {
    provider: configured.provider,
    model: GEMINI_MODEL,
    statementCount: validated.statements.length,
    classifiedStatements: validated.statements,
    rawSummary: validated.rationale,
    durationMs: Date.now() - started,
  }
}
