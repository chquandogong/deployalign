import { once } from 'node:events'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { DEMO_ARTIFACTS } from '../src/domain/demo'
import type { CompileResult } from '../src/domain/types'
import { createApp, MAX_COMPILES_PER_WINDOW } from './app'

const testSecret = 'deployalign-test-secret-with-at-least-32-bytes'

const startServer = async (options: { allowCustomArtifacts?: boolean } = {}) => {
  const server = createApp({
    compileTokenSecret: testSecret,
    liveGemini: false,
    logger: () => {},
    ...options,
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
    expect(body.customArtifacts).toBe(false)
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

const customArtifacts = [
  {
    id: 'CUS-A',
    role: 'customer',
    title: 'Customer note',
    owner: 'Plant manager',
    updatedAt: '2026-08-20T00:00:00.000Z',
    content: 'We need leak detection across the plant. The main corridor is about 900 mm wide.',
  },
  {
    id: 'SAL-B',
    role: 'sales',
    title: 'Proposal',
    owner: 'Account executive',
    updatedAt: '2026-08-21T00:00:00.000Z',
    content: 'The system will detect any leaked material in every zone of the plant autonomously. Acceptance is full coverage.',
  },
  {
    id: 'ENG-C',
    role: 'engineering',
    title: 'Engineering review',
    owner: 'Application engineer',
    updatedAt: '2026-08-22T00:00:00.000Z',
    content: 'Lab evidence covers three named analytes. Eight critical zones are mapped. Recommend supervised operation and a blind analyte test before any gate.',
  },
]

describe('DeployAlign API custom-artifact mode', () => {
  let server: Server
  let baseUrl: string

  beforeAll(async () => {
    ;({ server, baseUrl } = await startServer({ allowCustomArtifacts: true }))
  })

  afterAll(async () => {
    await stopServer(server)
  })

  it('advertises custom mode on health and still compiles the fixture canonically', async () => {
    const health = (await (await fetch(`${baseUrl}/api/health`)).json()) as Record<string, unknown>
    expect(health.customArtifacts).toBe(true)

    const fixture = (await (await postJson(baseUrl, '/api/compile', { artifacts: DEMO_ARTIFACTS })).json()) as CompileResult
    expect(fixture.mode).toBe('fixture')
    expect(fixture.decisionId).toBe('DEC-014')
  })

  it('compiles user-supplied artifacts through the general path with a bound token', async () => {
    const response = await postJson(baseUrl, '/api/compile', { artifacts: customArtifacts })
    const result = (await response.json()) as CompileResult

    expect(response.status).toBe(200)
    expect(result.mode).toBe('custom')
    expect(result.synthetic).toBe(false)
    expect(result.executionOrigin).toBe('server')
    expect(result.gate).toBe('HOLD')
    expect(result.diagnostics.map((d) => d.code)).toEqual(['DA-001', 'DA-002', 'DA-004', 'DA-005', 'DA-006'])
    expect(result.patch.changes.map((c) => c.field)).toEqual(['analyte scope', 'coverage', 'operating mode'])
    expect(result.patch.changes.map((c) => c.after)).toEqual(['three named analytes', 'Eight critical zones', 'supervised operation'])
    expect(result.compileToken?.split('.')).toHaveLength(2)
  })

  it('reviews custom artifacts only when the same artifacts are resubmitted', async () => {
    const compile = (await (await postJson(baseUrl, '/api/compile', { artifacts: customArtifacts })).json()) as CompileResult

    const missing = await postJson(baseUrl, '/api/approve', { version: 1, patchId: compile.patch.id, compileToken: compile.compileToken })
    expect(missing.status).toBe(409)
    expect(await missing.json()).toEqual({ error: 'Custom review must resubmit the compiled artifacts.' })

    const altered = customArtifacts.map((artifact, index) =>
      index === 1 ? { ...artifact, content: `${artifact.content} Also every valve.` } : artifact,
    )
    const mismatch = await postJson(baseUrl, '/api/approve', { version: 1, patchId: compile.patch.id, compileToken: compile.compileToken, artifacts: altered })
    expect(mismatch.status).toBe(409)
    expect(await mismatch.json()).toEqual({ error: 'Artifacts do not match the compiled baseline.' })

    const wrongPatch = await postJson(baseUrl, '/api/approve', { version: 1, patchId: 'PATCH-014-A', compileToken: compile.compileToken, artifacts: customArtifacts })
    expect(wrongPatch.status).toBe(409)

    const approved = await postJson(baseUrl, '/api/approve', { version: 1, patchId: compile.patch.id, compileToken: compile.compileToken, artifacts: customArtifacts })
    const result = (await approved.json()) as CompileResult
    expect(approved.status).toBe(200)
    expect(result.mode).toBe('custom')
    expect(result.version).toBe(2)
    expect(result.gate).toBe('CONDITIONAL PILOT')
    expect(result.diagnostics.find((d) => d.code === 'DA-001')?.resolved).toBe(true)
    expect(result.diagnostics.find((d) => d.code === 'DA-006')?.resolved).toBe(false)
    expect(result.nodes.find((n) => n.id === 'SCOPE-001')).toBeDefined()
  })

  it('rejects custom artifact sets that are not one document per role or are too short', async () => {
    const twoCustomers = customArtifacts.map((artifact, index) => (index === 1 ? { ...artifact, role: 'customer' } : artifact))
    const roles = await postJson(baseUrl, '/api/compile', { artifacts: twoCustomers })
    expect(roles.status).toBe(400)
    expect(((await roles.json()) as { error: string }).error).toContain('exactly one customer, one sales, and one engineering')

    const short = customArtifacts.map((artifact, index) => (index === 2 ? { ...artifact, content: 'n/a' } : artifact))
    const tooShort = await postJson(baseUrl, '/api/compile', { artifacts: short })
    expect(tooShort.status).toBe(400)
    expect(((await tooShort.json()) as { error: string }).error).toContain('at least 20 characters')
  })

  it('drops unknown artifact keys before compiling', async () => {
    const withExtra = customArtifacts.map((artifact) => ({ ...artifact, hidden: 'ignore me' }))
    const response = await postJson(baseUrl, '/api/compile', { artifacts: withExtra })
    const result = (await response.json()) as CompileResult
    expect(response.status).toBe(200)
    expect(Object.keys(result.artifacts[0]!)).toEqual(['id', 'role', 'title', 'owner', 'updatedAt', 'content'])
  })
})
