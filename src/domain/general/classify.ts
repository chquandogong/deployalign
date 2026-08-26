import type { CommitmentNodeType } from '../types'
import {
  ACCEPTANCE_CUES,
  EVIDENCE_CUES,
  GATE_CUES,
  HEDGES,
  MANDATORY_CUES,
  PREFERENCE_CUES,
  RECOMMENDATION_CUES,
  SUPERVISED_CUES,
  TEST_COMPLETED_CUES,
  TEST_CUES,
  THRESHOLD_CUES,
  UNVERIFIED_CUES,
} from './lexicon'
import type { Statement } from './extract'
import {
  hasCue,
  isEnumeration,
  isThreshold,
  keywordsOf,
  quantitiesIn,
  unboundedPhrases,
  type Quantity,
  type QuantifiedPhrase,
} from './text'

export interface StatementFlags {
  acceptance: boolean
  mandatory: boolean
  hedged: boolean
  unverified: boolean
  openTest: boolean
  completedTest: boolean
  preference: boolean
  recommendation: boolean
  evidence: boolean
  supervised: boolean
  mentionsGate: boolean
  hasThreshold: boolean
}

export interface TypedStatement {
  statement: Statement
  type: CommitmentNodeType
  confidence: number
  /** Exact substring of the artifact used as the node quote (may be narrower than the clause). */
  quote: string
  flags: StatementFlags
  quantities: Quantity[]
  enumerations: Quantity[]
  unbounded: QuantifiedPhrase[]
  keywords: Set<string>
}

const flagsFor = (text: string, quantities: Quantity[]): StatementFlags => {
  const openTestCue = hasCue(text, TEST_CUES)
  const completed = hasCue(text, TEST_COMPLETED_CUES)
  return {
    acceptance: hasCue(text, ACCEPTANCE_CUES),
    mandatory: hasCue(text, MANDATORY_CUES),
    hedged: hasCue(text, HEDGES),
    unverified: hasCue(text, UNVERIFIED_CUES),
    openTest: openTestCue && !completed,
    completedTest: openTestCue && completed,
    preference: hasCue(text, PREFERENCE_CUES),
    recommendation: hasCue(text, RECOMMENDATION_CUES),
    evidence: hasCue(text, EVIDENCE_CUES),
    supervised: hasCue(text, SUPERVISED_CUES),
    mentionsGate: hasCue(text, GATE_CUES),
    hasThreshold: quantities.some(isThreshold) || hasCue(text, THRESHOLD_CUES),
  }
}

const PREFERENCE_OBJECT = /(?:need|want|would like|'d like|prefer)\s+(?:a|an)\s+(.+?)(?=\s+(?:that|which|to|for|so|with|and)\b|[.;]|$)/i

const build = (
  statement: Statement,
  type: CommitmentNodeType,
  confidence: number,
  flags: StatementFlags,
  quantities: Quantity[],
  quote = statement.text,
): TypedStatement => ({
  statement,
  type,
  confidence,
  quote,
  flags,
  quantities,
  enumerations: quantities.filter(isEnumeration),
  unbounded: unboundedPhrases(statement.text),
  // Keywords follow the quote so a narrowed preference ("four-wheeled robot")
  // links on its own terms rather than on the whole sentence.
  keywords: keywordsOf(quote),
})

/**
 * Role-aware lexical typing. A clause may yield two nodes when it carries two
 * separable claims (a customer objective plus a platform preference, or an
 * engineering recommendation plus an open test).
 */
export const classifyStatement = (statement: Statement): TypedStatement[] => {
  const text = statement.text
  const quantities = quantitiesIn(text)
  const flags = flagsFor(text, quantities)
  const measurement = quantities.some(isThreshold)

  switch (statement.role) {
    case 'customer': {
      if (flags.acceptance) return [build(statement, 'CustomerObjective', 0.8, flags, quantities)]
      if (measurement && (flags.hedged || flags.unverified)) {
        return [build(statement, 'SiteClaim', 0.85, flags, quantities)]
      }
      if (measurement) return [build(statement, 'SiteClaim', 0.7, flags, quantities)]
      const preferenceObject = PREFERENCE_OBJECT.exec(text)
      const hasObjective = unboundedPhrases(text).length > 0
      if (preferenceObject && hasObjective) {
        return [
          build(statement, 'CustomerObjective', 0.8, flags, quantities),
          build(statement, 'CustomerPreference', 0.8, flags, quantities, preferenceObject[1]!.trim()),
        ]
      }
      if (flags.preference) {
        return [
          build(
            statement,
            'CustomerPreference',
            0.8,
            flags,
            quantities,
            preferenceObject ? preferenceObject[1]!.trim() : statement.text,
          ),
        ]
      }
      return [build(statement, 'CustomerObjective', 0.75, flags, quantities)]
    }
    case 'sales': {
      if (flags.acceptance) return [build(statement, 'SalesCommitment', 0.9, flags, quantities)]
      if (flags.mandatory) return [build(statement, 'SalesCommitment', 0.85, flags, quantities)]
      return [build(statement, 'SalesCommitment', 0.8, flags, quantities)]
    }
    case 'engineering': {
      if (flags.acceptance) return [build(statement, 'EngineeringConstraint', 0.8, flags, quantities)]
      if (flags.openTest || flags.completedTest) {
        const nodes = [build(statement, 'VerificationTest', 0.85, flags, quantities)]
        if (flags.recommendation || flags.supervised) {
          nodes.push(build(statement, 'EngineeringConstraint', 0.75, flags, quantities))
        }
        return nodes
      }
      if (flags.unverified) {
        return [build(statement, measurement ? 'SiteClaim' : 'Assumption', 0.85, flags, quantities)]
      }
      if (flags.evidence) return [build(statement, 'Evidence', 0.85, flags, quantities)]
      return [build(statement, 'EngineeringConstraint', flags.recommendation || measurement ? 0.8 : 0.65, flags, quantities)]
    }
    default:
      return [build(statement, 'Assumption', 0.5, flags, quantities)]
  }
}

export const classifyStatements = (statements: Statement[]): TypedStatement[] =>
  statements.flatMap(classifyStatement)
