import { once } from 'node:events'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { DEMO_ARTIFACTS } from '../src/domain/demo'
import type { CompileResult } from '../src/domain/types'
import { createApp, MAX_COMPILES_PER_WINDOW } from './app'

const testSecret = 'deployalign-test-secret-with-at-least-32-bytes'

const startServer = async () => {
  const server = createApp({
    compileTokenSecret: testSecret,
    liveGemini: false,
    logger: () => {},
  }).listen(0)
  await once(server, 'listening')
  const { port } = server.address() as AddressInfo
  return { server, baseUrl: `http://127.0.0.1:${port}` }
}

const stopServer = (server: Server) =>
  new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))

const postJson = (baseUrl: string, path: string, body: unknown) =>
  fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })

describe('DeployAlign API contract', () => {
  let server: Server
  let baseUrl: string

  beforeAll(async () => {
    ;({ server, baseUrl } = await startServer())
  })

  afterAll(async () => {
    await stopServer(server)
  })

  it('reports service identity, version, model, and live-model state on /api/health', async () => {
    const response = await fetch(`${baseUrl}/api/health`)
    const body = (await response.json()) as Record<string, unknown>

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.service).toBe('deployalign')
    expect(body.liveGemini).toBe(false)
    expect(body.version).toMatch(/^\d+\.\d+\.\d+/)
    expect(body.model).toMatch(/^gemini-/)
  })

  it('compiles the synthetic fixture server-side with a signed provenance token', async () => {
    const response = await postJson(baseUrl, '/api/compile', { artifacts: DEMO_ARTIFACTS })
    const result = (await response.json()) as CompileResult

    expect(response.status).toBe(200)
    expect(result.synthetic).toBe(true)
    expect(result.version).toBe(1)
    expect(result.gate).toBe('HOLD')
    expect(result.provider).toBe('deterministic-demo')
    expect(result.executionOrigin).toBe('server')
    expect(result.compileToken?.split('.')).toHaveLength(2)
    expect(result.receipts[0]?.id).toMatch(/^RUN-[0-9a-f-]{36}-INGEST$/)
    expect(response.headers.get('content-security-policy')).toContain("default-src 'self'")
  })

  it('compiles the default fixture when no body is supplied', async () => {
    const response = await postJson(baseUrl, '/api/compile', {})
    const result = (await response.json()) as CompileResult

    expect(response.status).toBe(200)
    expect(result.artifacts.map((item) => item.id)).toEqual(DEMO_ARTIFACTS.map((item) => item.id))
  })

  it('rejects the wrong artifact count before compiling', async () => {
    const response = await postJson(baseUrl, '/api/compile', {
      artifacts: DEMO_ARTIFACTS.slice(0, 2),
    })

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'Exactly three source artifacts are required.' })
  })

  it('rejects non-fixture content rather than compiling ungrounded output', async () => {
    const custom = DEMO_ARTIFACTS.map((artifact, index) =>
      index === 0 ? { ...artifact, content: 'A real customer document must not enter this demo.' } : artifact,
    )
    const response = await postJson(baseUrl, '/api/compile', { artifacts: custom })
    const body = (await response.json()) as { error: string }

    expect(response.status).toBe(400)
    expect(body.error).toContain('only accepts the disclosed synthetic Raman fixture')
  })

  it('rejects malformed JSON with a bounded message', async () => {
    const response = await postJson(baseUrl, '/api/compile', '{"artifacts": [')

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'Malformed JSON request body.' })
  })

  it('refuses review without a matching baseline and token', async () => {
    const response = await postJson(baseUrl, '/api/approve', { version: 1, patchId: 'PATCH-014-A' })

    expect(response.status).toBe(409)
    expect(await response.json()).toEqual({ error: 'Patch or baseline version does not match.' })
  })

  it('refuses a tampered provenance token', async () => {
    const compile = (await (
      await postJson(baseUrl, '/api/compile', { artifacts: DEMO_ARTIFACTS })
    ).json()) as CompileResult
    const [encoded, signature] = compile.compileToken!.split('.')
    const tampered = `${encoded}.${signature!.slice(0, -2)}xx`

    const response = await postJson(baseUrl, '/api/approve', {
      version: 1,
      patchId: 'PATCH-014-A',
      compileToken: tampered,
    })

    expect(response.status).toBe(409)
    expect(await response.json()).toEqual({ error: 'Compile provenance token signature is invalid.' })
  })

  it('advances to a conditional pilot after a valid review round trip', async () => {
    const compile = (await (
      await postJson(baseUrl, '/api/compile', { artifacts: DEMO_ARTIFACTS })
    ).json()) as CompileResult
    const response = await postJson(baseUrl, '/api/approve', {
      version: compile.version,
      patchId: compile.patch.id,
      compileToken: compile.compileToken,
    })
    const approved = (await response.json()) as CompileResult

    expect(response.status).toBe(200)
    expect(approved.version).toBe(2)
    expect(approved.gate).toBe('CONDITIONAL PILOT')
    expect(approved.patch.status).toBe('APPROVED')
    expect(approved.executionOrigin).toBe('server')
    expect(approved.impact.recompiled).toHaveLength(6)
    expect(approved.impact.unchanged).toEqual(['CDM-3', 'SOW-7.1', 'SYS-009'])
    expect(approved.compileToken).not.toBe(compile.compileToken)
  })

  it('returns JSON 404 for unknown API routes', async () => {
    const response = await fetch(`${baseUrl}/api/nope`)

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: 'API route not found.' })
  })
})

describe('DeployAlign API limits and startup guards', () => {
  it('rate-limits compile attempts per client within the window', async () => {
    const { server, baseUrl } = await startServer()
    try {
      for (let attempt = 0; attempt < MAX_COMPILES_PER_WINDOW; attempt += 1) {
        const response = await postJson(baseUrl, '/api/compile', {})
        expect(response.status).toBe(200)
      }
      const limited = await postJson(baseUrl, '/api/compile', {})

      expect(limited.status).toBe(429)
      expect(limited.headers.get('retry-after')).toBe('600')
      expect(await limited.json()).toEqual({ error: 'Compile limit reached. Try again later.' })
    } finally {
      await stopServer(server)
    }
  })

  it('refuses to start in production without a stable secret', () => {
    expect(() => createApp({ nodeEnv: 'production', compileTokenSecret: '' })).toThrow(
      'COMPILE_TOKEN_SECRET must be configured',
    )
  })

  it('refuses a short secret in any mode', () => {
    expect(() => createApp({ nodeEnv: 'development', compileTokenSecret: 'too-short' })).toThrow(
      'at least 32 bytes',
    )
  })
})
