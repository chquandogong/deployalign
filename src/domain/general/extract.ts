import type { ArtifactRole, SourceArtifact } from '../types'

export interface Statement {
  id: string
  artifactId: string
  role: ArtifactRole
  /** Zero-based clause index within the artifact. */
  ordinal: number
  /** Exact substring of the artifact content. */
  text: string
  /** One-based line number of the clause start. */
  line: number
  /** Character offset of the clause start within the artifact content. */
  offset: number
}

// Sentence ends: terminal punctuation followed by whitespace and an upper-case /
// digit / quote / bracket start. Semicolons and line breaks split clauses too — a
// clause is the unit a reviewer can accept or dispute on its own. Hard-wrapped
// prose therefore yields one clause per line; every clause stays a verbatim quote.
const SPLIT_PATTERN = /(?<=[.!?。])\s+(?=[A-Z0-9"“([가-힣一-鿿])|\s*;\s+|\s*\n+\s*/

const ROLE_PREFIX: Record<ArtifactRole, string> = {
  customer: 'CUS',
  sales: 'SAL',
  engineering: 'ENG',
}

/**
 * Splits each artifact into atomic clauses with exact offsets and line numbers.
 * Every returned `text` is a verbatim substring of `artifact.content`, so any
 * quote derived from it satisfies the grounding contract by construction.
 */
export const extractStatements = (artifacts: SourceArtifact[]): Statement[] => {
  const statements: Statement[] = []
  for (const artifact of artifacts) {
    const content = artifact.content
    let cursor = 0
    let ordinal = 0
    for (const piece of content.split(SPLIT_PATTERN)) {
      const trimmed = piece.trim().replace(/[;]+$/, '').trim()
      if (trimmed.length < 3 || !/[A-Za-z가-힣一-鿿]/.test(trimmed)) {
        cursor += piece.length
        continue
      }
      const offset = content.indexOf(trimmed, cursor)
      if (offset < 0) {
        cursor += piece.length
        continue
      }
      const line = content.slice(0, offset).split('\n').length
      statements.push({
        id: `${ROLE_PREFIX[artifact.role]}-${String(ordinal + 1).padStart(2, '0')}`,
        artifactId: artifact.id,
        role: artifact.role,
        ordinal,
        text: trimmed,
        line,
        offset,
      })
      cursor = offset + trimmed.length
      ordinal += 1
    }
  }
  return statements
}
