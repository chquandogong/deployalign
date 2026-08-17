import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { compileDemo, isDemoFixture } from '../src/domain/compiler'
import { DEMO_ARTIFACTS } from '../src/domain/demo'
import type { ApprovalRequest, CompileRequest, SourceArtifact } from '../src/domain/types'
import { extractWithGemini } from './gemini'

const app = express()
const port = Number(process.env.PORT ?? 8080)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const rateWindowMs = 10 * 60 * 1_000
const maxCompilesPerWindow = 6
const compileAttempts = new Map<string, number[]>()

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

const boundedArtifacts = (request: CompileRequest): SourceArtifact[] => {
  const artifacts = request.artifacts ?? DEMO_ARTIFACTS
  if (artifacts.length !== 3) throw new Error('Exactly three source artifacts are required.')
  if (artifacts.some((artifact) => artifact.content.length > 8_000)) {
    throw new Error('Each artifact must be 8,000 characters or fewer.')
  }
  const normalized = artifacts.map((artifact) => ({ ...artifact, content: artifact.content.trim() }))
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
  return true
}

app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(express.json({ limit: '64kb' }))
app.use((_request, response, next) => {
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('Referrer-Policy', 'no-referrer')
  response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
  next()
})

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, service: 'deployalign', liveGemini: process.env.ALLOW_LIVE_GEMINI === 'true' })
})

app.post('/api/compile', async (request, response) => {
  const clientKey = request.ip ?? 'unknown'
  if (!consumeCompileAllowance(clientKey)) {
    response.status(429).json({ error: 'Compile limit reached. Try again later.' })
    return
  }

  try {
    const artifacts = boundedArtifacts(request.body as CompileRequest)
    let aiEvidence: Awaited<ReturnType<typeof extractWithGemini>>
    try {
      aiEvidence = await extractWithGemini(artifacts)
    } catch (error) {
      log('gemini_extraction_rejected', {
        reason: error instanceof Error ? error.message : 'unknown',
      })
    }

    const result = compileDemo({ artifacts, aiEvidence })
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
  const payload = request.body as ApprovalRequest
  if (payload.version !== 1 || payload.patchId !== 'PATCH-014-A') {
    response.status(409).json({ error: 'Patch or baseline version does not match.' })
    return
  }

  const result = compileDemo({ approved: true })
  log('patch_approved', {
    decisionId: result.decisionId,
    version: result.version,
    recompiledSections: result.impact.recompiled.length,
    unchangedSections: result.impact.unchanged.length,
  })
  response.json(result)
})

app.use(express.static(dist, { maxAge: process.env.NODE_ENV === 'production' ? '1h' : 0 }))
app.get('*splat', (_request, response) => {
  response.sendFile(path.join(dist, 'index.html'))
})

app.listen(port, '0.0.0.0', () => {
  log('service_started', {
    port,
    mode: process.env.NODE_ENV ?? 'development',
    liveGemini: process.env.ALLOW_LIVE_GEMINI === 'true',
  })
})
