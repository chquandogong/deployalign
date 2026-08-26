import type { CompiledSection } from './types'

/** 32-bit FNV-1a change fingerprint. A change detector, not an integrity hash. */
export const compactHash = (value: string) => {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return `fnv1a32-${(hash >>> 0).toString(16).padStart(8, '0')}`
}

export const section = (
  id: string,
  heading: string,
  body: string,
  decisionIds: string[],
  sourceNodeIds: string[],
  changed: boolean,
): CompiledSection => ({
  id,
  heading,
  body,
  decisionIds,
  sourceNodeIds,
  hash: compactHash(`${id}:${body}`),
  changed,
})
