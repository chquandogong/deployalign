import express, { type ErrorRequestHandler } from 'express'
import path from 'node:path'
import { createHmac, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { compileDemo, isDemoFixture } from '../src/domain/compiler'
import { DEMO_ARTIFACTS } from '../src/domain/demo'
import type {
  AiExtractionEvidence,
  ApprovalRequest,
  CompileRequest,
  SourceArtifact,
} from '../src/domain/types'
import { extractWithGemini } from './gemini'

const app = express()
const port = Number(process.env.PORT ?? 8080)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const rateWindowMs = 10 * 60 * 1_000
const maxCompilesPerWindow = 6
const compileAttempts = new Map<string, number[]>()
const configuredCompileTokenSecret = process.env.COMPILE_TOKEN_SECRET
if (
  (configuredCompileTokenSecret && Buffer.byteLength(configuredCompileTokenSecret, 'utf8') < 32) ||
  (process.env.NODE_ENV === 'production' && !configuredCompileTokenSecret)
) {
  throw new Error(
    'COMPILE_TOKEN_SECRET must be configured with at least 32 bytes in production.',
  )
}
const compileTokenSecret =
  configuredCompileTokenSecret ?? randomBytes(32).toString('base64url')

interface CompileTokenPayload {
  version: 1
  expiresAt: number
  aiEvidence?: AiExtractionEvidence
}

const issueCompileToken = (aiEvidence?: AiExtractionEvidence) => {
  const payload: CompileTokenPayload = {
    version: 1,
    expiresAt: Date.now() + 60 * 60 * 1_000,
    aiEvidence,
  }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = createHmac('sha256', compileTokenSecret).update(encoded).digest('base64url')
  return `${encoded}.${signature}`
}

const verifyCompileToken = (token: string): AiExtractionEvidence | undefined => {
  const parts = token.split('.')
  if (parts.length !== 2) throw new Error('Compile provenance token is missing or malformed.')
  const [encoded, suppliedSignature] = parts
  if (!encoded || !suppliedSignature) throw new Error('Compile provenance token is missing or malformed.')
  const expectedSignature = createHmac('sha256', compileTokenSecret)
    .update(encoded)
    .digest('base64url')
  const expected = Buffer.from(expectedSignature)
  const supplied = Buffer.from(suppliedSignature)
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
    throw new Error('Compile provenance token signature is invalid.')
  }
  const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as CompileTokenPayload
  if (payload.version !== 1 || !Number.isFinite(payload.expiresAt) || payload.expiresAt < Date.now()) {
    throw new Error('Compile provenance token has expired.')
  }
  return payload.aiEvidence
}

const log = (event: string, details: Record<string, unknown> = {}) => {
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

const boundedArtifacts = (body: unknown): SourceArtifact[] => {
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
  const normalized = artifacts.map((artifact) => ({ ...artifact }))
  if (!isDemoFixture(normalized)) {
    throw new Error('This public prototype only accepts the disclosed synthetic Raman fixture.')
  }
  return normalized
}

const consumeCompileAllowance = (key: string) => {
  const now = Date.now()
  const recent = (compileAttempts.get(key) ?? []).filter((attempt) => now - attempt < rateWindowMs)
  if (recent.length >= maxCompilesPerWindow) return false
  compileAttempts.set(key, [...recent, now])
  if (compileAttempts.size > 1_000) {
    for (const [candidate, attempts] of compileAttempts) {
      if (attempts.every((attempt) => now - attempt >= rateWindowMs)) compileAttempts.delete(candidate)
    }
  }
  return true
}

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
  response.json({ ok: true, service: 'deployalign', liveGemini: process.env.ALLOW_LIVE_GEMINI === 'true' })
})

app.post('/api/compile', async (request, response) => {
  const clientKey = request.ip ?? 'unknown'
  if (!consumeCompileAllowance(clientKey)) {
    response.setHeader('Retry-After', String(Math.ceil(rateWindowMs / 1_000)))
    response.status(429).json({ error: 'Compile limit reached. Try again later.' })
    return
  }

  try {
    const artifacts = boundedArtifacts(request.body)
    let aiEvidence: Awaited<ReturnType<typeof extractWithGemini>>
    try {
      aiEvidence = await extractWithGemini(artifacts)
    } catch (error) {
      log('gemini_extraction_rejected', {
        reason: error instanceof Error ? error.message : 'unknown',
      })
    }

    const result = compileDemo({ artifacts, aiEvidence, runId: `RUN-${randomUUID()}` })
    result.compileToken = issueCompileToken(aiEvidence)
    log('compile_completed', {
      traceId: result.receipts[0]?.id,
      version: result.version,
      provider: result.provider,
      unresolvedDiagnostics: result.diagnostics.filter((item) => !item.resolved).length,
    })
    response.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Compile failed.'
    log('compile_failed', { message })
    response.status(400).json({ error: message })
  }
})

app.post('/api/approve', (request, response) => {
  const payload = request.body as Partial<ApprovalRequest> | undefined
  if (
    payload?.version !== 1 ||
    payload?.patchId !== 'PATCH-014-A' ||
    typeof payload.compileToken !== 'string'
  ) {
    response.status(409).json({ error: 'Patch or baseline version does not match.' })
    return
  }

  let aiEvidence: AiExtractionEvidence | undefined
  try {
    aiEvidence = verifyCompileToken(payload.compileToken)
  } catch (error) {
    response.status(409).json({
      error: error instanceof Error ? error.message : 'Compile provenance token is invalid.',
    })
    return
  }

  const result = compileDemo({ approved: true, aiEvidence, runId: `RUN-${randomUUID()}` })
  result.compileToken = issueCompileToken(aiEvidence)
  log('patch_approved', {
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
    immutable: process.env.NODE_ENV === 'production',
    maxAge: process.env.NODE_ENV === 'production' ? '1y' : 0,
  }),
)
app.use(express.static(dist, { index: false, maxAge: 0 }))
app.get('*splat', (_request, response) => {
  response.setHeader('Cache-Control', 'no-store')
  response.sendFile(path.join(dist, 'index.html'))
})

const server = app.listen(port, '0.0.0.0', () => {
  log('service_started', {
    port,
    mode: process.env.NODE_ENV ?? 'development',
    liveGemini: process.env.ALLOW_LIVE_GEMINI === 'true',
  })
})

process.on('SIGTERM', () => {
  log('service_stopping')
  server.close(() => process.exit(0))
})
