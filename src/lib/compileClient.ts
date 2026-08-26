import { compileDemo } from '../domain/compiler'
import { DEMO_ARTIFACTS } from '../domain/demo'
import type { CompileResult, SourceArtifact } from '../domain/types'

const REQUEST_TIMEOUT_MS = 60_000
const sourceArtifactKeys = ['id', 'role', 'title', 'owner', 'updatedAt', 'content'] as const

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const isExactDemoFixture = (artifacts: SourceArtifact[]) =>
  artifacts.length === DEMO_ARTIFACTS.length &&
  artifacts.every((artifact, index) => {
    const demo = DEMO_ARTIFACTS[index]
    return (
      demo !== undefined &&
      Object.keys(artifact).length === sourceArtifactKeys.length &&
      sourceArtifactKeys.every((key) => Object.hasOwn(artifact, key)) &&
      artifact.id === demo.id &&
      artifact.role === demo.role &&
      artifact.title === demo.title &&
      artifact.owner === demo.owner &&
      artifact.updatedAt === demo.updatedAt &&
      artifact.content === demo.content
    )
  })

const isNetworkFailure = (error: unknown) =>
  error instanceof TypeError && !(error instanceof ApiError)

const postJson = async <T>(path: string, body: unknown): Promise<T> => {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    if (!response.ok) {
      let detail = `Request failed with ${response.status}`
      try {
        const body = (await response.json()) as { error?: string }
        if (body.error) detail = body.error
      } catch {
        // Keep the status-based detail when the error body is not JSON.
      }
      throw new ApiError(response.status, detail)
    }

    return (await response.json()) as T
  } finally {
    window.clearTimeout(timeout)
  }
}

export const compileProject = async (
  artifacts?: SourceArtifact[],
): Promise<CompileResult> => {
  const sourceArtifacts = artifacts ?? DEMO_ARTIFACTS
  try {
    return await postJson<CompileResult>('/api/compile', {
      artifacts: sourceArtifacts,
    })
  } catch (error) {
    if (isNetworkFailure(error) && isExactDemoFixture(sourceArtifacts)) {
      return compileDemo({ artifacts: sourceArtifacts, executionOrigin: 'browser' })
    }
    throw error
  }
}

export const approveProject = async (
  current: CompileResult,
): Promise<CompileResult> => {
  try {
    return await postJson<CompileResult>('/api/approve', {
      version: current.version,
      patchId: current.patch.id,
      compileToken: current.compileToken,
    })
  } catch (error) {
    if (
      isNetworkFailure(error) &&
      current.provider === 'deterministic-demo' &&
      isExactDemoFixture(current.artifacts)
    ) {
      return compileDemo({ approved: true, artifacts: current.artifacts, executionOrigin: 'browser' })
    }
    throw error
  }
}
