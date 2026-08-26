import express, { type ErrorRequestHandler, type Express } from 'express'
import { createHash, createHmac, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { compileDemo, isDemoFixture } from '../src/domain/compiler'
import { DEMO_ARTIFACTS } from '../src/domain/demo'
import { compileGeneral } from '../src/domain/general/compile'
import type {
  AiExtractionEvidence,
  ApprovalRequest,
  CompileRequest,
  CompileResult,
  SourceArtifact,
} from '../src/domain/types'
import { extractWithGemini, GEMINI_MODEL } from './gemini'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const { version: serviceVersion } = createRequire(import.meta.url)('../package.json') as {
  version: string
}

export const RATE_WINDOW_MS = 10 * 60 * 1_000
export const MAX_COMPILES_PER_WINDOW = 6
const COMPILE_TOKEN_TTL_MS = 60 * 60 * 1_000
const MIN_SECRET_BYTES = 32

export type Logger = (event: string, details?: Record<string, unknown>) => void

export const log: Logger = (event, details = {}) => {
  console.log(
    JSON.stringify({
      severity: 'INFO',
      service: 'deployalign',
      event,
      at: new Date().toISOString(),
      ...details,
    }),
  )
}

interface CompileTokenPayload {
  version: 1
  expiresAt: number
  aiEvidence?: AiExtractionEvidence
  /** `fixture` or `custom`; custom review must resubmit the same artifacts. */
  mode: 'fixture' | 'custom'
  patchId: string
  artifactsHash: string
}

const FIXTURE_PATCH_ID = 'PATCH-014-A'
const CUSTOM_PATCH_ID = 'PATCH-001-A'
const ROLES = ['customer', 'sales', 'engineering'] as const

const artifactsHash = (artifacts: SourceArtifact[]) =>
  createHash('sha256')
    .update(JSON.stringify(artifacts.map((a) => [a.id, a.role, a.title, a.owner, a.updatedAt, a.content])))
    .digest('base64url')

export interface AppOptions {
  /** HMAC secret for compile provenance tokens; defaults to COMPILE_TOKEN_SECRET. */
  compileTokenSecret?: string
  /** Runtime mode; defaults to NODE_ENV. Production refuses to start without a stable secret. */
  nodeEnv?: string
  /** Directory holding the Vite build; defaults to `<repo>/dist`. */
  distDir?: string
  /** Whether the live model may be attempted; defaults to ALLOW_LIVE_GEMINI === 'true'. */
  liveGemini?: boolean
  /** Structured event sink; defaults to JSON lines on stdout. */
  logger?: Logger
  /**
   * Accept user-supplied artifacts through the general compiler; defaults to
   * ALLOW_CUSTOM_ARTIFACTS === 'true'. Keep this off on any public deployment:
   * with live Gemini enabled it sends the submitted text to the model.
   */
  allowCustomArtifacts?: boolean
}

const boundedArtifacts = (body: unknown, allowCustom: boolean): SourceArtifact[] => {
  if (body !== undefined && (typeof body !== 'object' || body === null || Array.isArray(body))) {
    throw new Error('Request body must be a JSON object.')
  }
  const rawArtifacts = (body as CompileRequest | undefined)?.artifacts
  if (rawArtifacts !== undefined && !Array.isArray(rawArtifacts)) {
    throw new Error('Artifacts must be an array.')
  }
  const artifacts = rawArtifacts ?? DEMO_ARTIFACTS
  if (artifacts.length !== 3) throw new Error('Exactly three source artifacts are required.')
  if (
    !artifacts.every(
      (artifact) =>
        artifact &&
        typeof artifact.id === 'string' &&
        typeof artifact.role === 'string' &&
        typeof artifact.title === 'string' &&
        typeof artifact.owner === 'string' &&
        typeof artifact.updatedAt === 'string' &&
        typeof artifact.content === 'string',
    )
  ) {
    throw new Error('Every artifact field must be a string.')
  }
  if (artifacts.some((artifact) => artifact.content.length > 8_000)) {
    throw new Error('Each artifact must be 8,000 characters or fewer.')
  }
  const normalized = artifacts.map((artifact) => ({
    id: artifact.id,
    role: artifact.role,
    title: artifact.title,
    owner: artifact.owner,
    updatedAt: artifact.updatedAt,
    content: artifact.content,
  }))
  if (isDemoFixture(normalized)) return normalized
  if (!allowCustom) {
    throw new Error('This public prototype only accepts the disclosed synthetic Raman fixture.')
  }
  validateCustomArtifacts(normalized)
  return normalized
}

const validateCustomArtifacts = (artifacts: SourceArtifact[]) => {
  const roles = artifacts.map((artifact) => artifact.role)
  if (ROLES.some((role) => roles.filter((candidate) => candidate === role).length !== 1)) {
    throw new Error('Custom artifacts must include exactly one customer, one sales, and one engineering document.')
  }
  if (new Set(artifacts.map((artifact) => artifact.id)).size !== artifacts.length) {
    throw new Error('Artifact ids must be unique.')
  }
  for (const artifact of artifacts) {
    if (artifact.content.trim().length < 20) {
      throw new Error(`Artifact ${artifact.id} needs at least 20 characters of text.`)
    }
    if (
      [artifact.id, artifact.updatedAt].some((field) => field.length > 64) ||
      [artifact.title, artifact.owner].some((field) => field.length > 200)
    ) {
      throw new Error('Artifact metadata fields are too long.')
    }
  }
}

/**
 * Builds the DeployAlign API + static server. Everything stateful (rate-limit
 * map, token secret) lives inside this closure so tests can create isolated
 * instances; `server/index.ts` is the only caller that listens on a port.
 */
export const createApp = (options: AppOptions = {}): Express => {
  const nodeEnv = options.nodeEnv ?? process.env.NODE_ENV
  const configuredSecret = options.compileTokenSecret ?? process.env.COMPILE_TOKEN_SECRET
  if (
    (configuredSecret && Buffer.byteLength(configuredSecret, 'utf8') < MIN_SECRET_BYTES) ||
    (nodeEnv === 'production' && !configuredSecret)
  ) {
    throw new Error(
      `COMPILE_TOKEN_SECRET must be configured with at least ${MIN_SECRET_BYTES} bytes in production.`,
    )
  }
  const compileTokenSecret = configuredSecret ?? randomBytes(32).toString('base64url')
  const liveGemini = options.liveGemini ?? process.env.ALLOW_LIVE_GEMINI === 'true'
  const allowCustom = options.allowCustomArtifacts ?? process.env.ALLOW_CUSTOM_ARTIFACTS === 'true'
  const dist = options.distDir ?? path.join(root, 'dist')
  const emit = options.logger ?? log
  const compileAttempts = new Map<string, number[]>()

  const issueCompileToken = (
    mode: CompileTokenPayload['mode'],
    artifacts: SourceArtifact[],
    aiEvidence?: AiExtractionEvidence,
  ) => {
    const payload: CompileTokenPayload = {
      version: 1,
      expiresAt: Date.now() + COMPILE_TOKEN_TTL_MS,
      aiEvidence,
      mode,
      patchId: mode === 'fixture' ? FIXTURE_PATCH_ID : CUSTOM_PATCH_ID,
      artifactsHash: artifactsHash(artifacts),
    }
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
    const signature = createHmac('sha256', compileTokenSecret).update(encoded).digest('base64url')
    return `${encoded}.${signature}`
  }

  const verifyCompileToken = (token: string): CompileTokenPayload => {
    const parts = token.split('.')
    if (parts.length !== 2) throw new Error('Compile provenance token is missing or malformed.')
    const [encoded, suppliedSignature] = parts
    if (!encoded || !suppliedSignature) {
      throw new Error('Compile provenance token is missing or malformed.')
    }
    const expectedSignature = createHmac('sha256', compileTokenSecret)
      .update(encoded)
      .digest('base64url')
    const expected = Buffer.from(expectedSignature)
    const supplied = Buffer.from(suppliedSignature)
    if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
      throw new Error('Compile provenance token signature is invalid.')
    }
    const payload = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8'),
    ) as CompileTokenPayload
    if (
      payload.version !== 1 ||
      !Number.isFinite(payload.expiresAt) ||
      payload.expiresAt < Date.now()
    ) {
      throw new Error('Compile provenance token has expired.')
    }
    if ((payload.mode !== 'fixture' && payload.mode !== 'custom') || typeof payload.artifactsHash !== 'string') {
      throw new Error('Compile provenance token is missing or malformed.')
    }
    return payload
  }

  const consumeCompileAllowance = (key: string) => {
    const now = Date.now()
    const recent = (compileAttempts.get(key) ?? []).filter(
      (attempt) => now - attempt < RATE_WINDOW_MS,
    )
    if (recent.length >= MAX_COMPILES_PER_WINDOW) return false
    compileAttempts.set(key, [...recent, now])
    if (compileAttempts.size > 1_000) {
      for (const [candidate, attempts] of compileAttempts) {
        if (attempts.every((attempt) => now - attempt >= RATE_WINDOW_MS)) {
          compileAttempts.delete(candidate)
        }
      }
    }
    return true
  }

  const app = express()
  app.disable('x-powered-by')
  app.set('trust proxy', 1)
  app.use(express.json({ limit: '64kb' }))
  const jsonErrorHandler: ErrorRequestHandler = (error, _request, response, next) => {
    if (error instanceof SyntaxError) {
      response.status(400).json({ error: 'Malformed JSON request body.' })
      return
    }
    next(error)
  }
  app.use(jsonErrorHandler)
  app.use((_request, response, next) => {
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.setHeader('Referrer-Policy', 'no-referrer')
    response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    response.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
    response.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
    )
    next()
  })

  app.get('/api/health', (_request, response) => {
    response.json({
      ok: true,
      service: 'deployalign',
      version: serviceVersion,
      liveGemini,
      model: GEMINI_MODEL,
      customArtifacts: allowCustom,
    })
  })

  app.post('/api/compile', async (request, response) => {
    const clientKey = request.ip ?? 'unknown'
    if (!consumeCompileAllowance(clientKey)) {
      response.setHeader('Retry-After', String(Math.ceil(RATE_WINDOW_MS / 1_000)))
      response.status(429).json({ error: 'Compile limit reached. Try again later.' })
      return
    }

    try {
      const artifacts = boundedArtifacts(request.body, allowCustom)
      const fixture = isDemoFixture(artifacts)
      let aiEvidence: AiExtractionEvidence | undefined
      if (liveGemini) {
        try {
          aiEvidence = await extractWithGemini(artifacts, { synthetic: fixture })
        } catch (error) {
          emit('gemini_extraction_rejected', {
            reason: error instanceof Error ? error.message : 'unknown',
          })
        }
      }

      const shared = { artifacts, aiEvidence, runId: `RUN-${randomUUID()}`, executionOrigin: 'server' as const }
      const result = fixture ? compileDemo(shared) : compileGeneral(shared)
      result.compileToken = issueCompileToken(fixture ? 'fixture' : 'custom', artifacts, aiEvidence)
      emit('compile_completed', {
        mode: result.mode,
        traceId: result.receipts[0]?.id,
        version: result.version,
        provider: result.provider,
        unresolvedDiagnostics: result.diagnostics.filter((item) => !item.resolved).length,
      })
      response.json(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Compile failed.'
      emit('compile_failed', { message })
      response.status(400).json({ error: message })
    }
  })

  app.post('/api/approve', (request, response) => {
    const payload = request.body as Partial<ApprovalRequest> | undefined
    if (payload?.version !== 1 || typeof payload.patchId !== 'string' || typeof payload.compileToken !== 'string') {
      response.status(409).json({ error: 'Patch or baseline version does not match.' })
      return
    }

    let token: CompileTokenPayload
    try {
      token = verifyCompileToken(payload.compileToken)
    } catch (error) {
      response.status(409).json({
        error: error instanceof Error ? error.message : 'Compile provenance token is invalid.',
      })
      return
    }
    if (payload.patchId !== token.patchId) {
      response.status(409).json({ error: 'Patch or baseline version does not match.' })
      return
    }

    let result: CompileResult
    if (token.mode === 'custom') {
      let artifacts: SourceArtifact[]
      try {
        if (!Array.isArray(payload.artifacts)) throw new Error('Custom review must resubmit the compiled artifacts.')
        artifacts = boundedArtifacts({ artifacts: payload.artifacts }, allowCustom)
      } catch (error) {
        response.status(409).json({ error: error instanceof Error ? error.message : 'Artifacts are invalid.' })
        return
      }
      if (artifactsHash(artifacts) !== token.artifactsHash) {
        response.status(409).json({ error: 'Artifacts do not match the compiled baseline.' })
        return
      }
      result = compileGeneral({
        artifacts,
        approved: true,
        aiEvidence: token.aiEvidence,
        runId: `RUN-${randomUUID()}`,
        executionOrigin: 'server',
      })
      result.compileToken = issueCompileToken('custom', artifacts, token.aiEvidence)
    } else {
      result = compileDemo({
        approved: true,
        aiEvidence: token.aiEvidence,
        runId: `RUN-${randomUUID()}`,
        executionOrigin: 'server',
      })
      result.compileToken = issueCompileToken('fixture', DEMO_ARTIFACTS, token.aiEvidence)
    }
    emit('patch_approved', {
      mode: result.mode,
      decisionId: result.decisionId,
      version: result.version,
      recompiledSections: result.impact.recompiled.length,
      unchangedSections: result.impact.unchanged.length,
    })
    response.json(result)
  })

  app.use('/api', (_request, response) => {
    response.status(404).json({ error: 'API route not found.' })
  })

  app.use(
    '/assets',
    express.static(path.join(dist, 'assets'), {
      immutable: nodeEnv === 'production',
      maxAge: nodeEnv === 'production' ? '1y' : 0,
    }),
  )
  app.use(express.static(dist, { index: false, maxAge: 0 }))
  app.get('*splat', (_request, response) => {
    response.setHeader('Cache-Control', 'no-store')
    response.sendFile(path.join(dist, 'index.html'))
  })

  return app
}
