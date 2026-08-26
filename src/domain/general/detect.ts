import type {
  CommitmentNode,
  CompilerDiagnostic,
  GraphEdge,
  SemanticChange,
  SourceReference,
} from '../types'
import type { TypedStatement } from './classify'
import { AREA_NOUNS, MANDATORY_CUES } from './lexicon'
import {
  enumerationPhrase,
  isEnumeration,
  matchAnyCue,
  sharedKeywords,
  stem,
  type Quantity,
  type ScopeCategory,
} from './text'

export interface GraphNode {
  node: CommitmentNode
  typed: TypedStatement
}

export interface Replacement {
  category: ScopeCategory
  field: string
  before: string
  after: string
  commitmentId: string
  evidenceId: string
}

export interface Detection {
  diagnostics: CompilerDiagnostic[]
  edges: GraphEdge[]
  changes: SemanticChange[]
  replacements: Replacement[]
  resolves: string[]
  retains: string[]
  unboundedCommitmentIds: string[]
  openTestIds: string[]
  flaggedSiteIds: string[]
  evidenceIds: string[]
}

export const GATE_ID = 'GATE-001'

export const refOf = (g: GraphNode): SourceReference => ({
  artifactId: g.typed.statement.artifactId,
  quote: g.typed.quote,
  line: g.typed.statement.line,
})

const isArea = (noun: string | undefined) =>
  noun !== undefined && (AREA_NOUNS.includes(noun) || AREA_NOUNS.includes(stem(noun)))

/** "Twelve critical AOIs" is coverage because its head noun is an area noun. */
const enumerationCategory = (text: string, quantity: Quantity): ScopeCategory =>
  enumerationPhrase(text, quantity)
    .split(/\s+/)
    .slice(1)
    .some((word) => isArea(word.toLowerCase().replace(/[^a-z-]/g, '')))
    ? 'coverage'
    : 'scope'

const relatedBy = (a: GraphNode, b: GraphNode) => sharedKeywords(a.typed.keywords, b.typed.keywords)

const categoriesOf = (g: GraphNode): Set<ScopeCategory> =>
  new Set(g.typed.unbounded.map((phrase) => phrase.category))

const evidenceCategories = (g: GraphNode): Set<ScopeCategory> => {
  const categories = new Set<ScopeCategory>()
  for (const quantity of g.typed.enumerations) categories.add(enumerationCategory(g.typed.statement.text, quantity))
  if (g.typed.flags.supervised) categories.add('autonomy')
  return categories
}

const intersects = <T>(a: Set<T>, b: Set<T>) => [...a].some((item) => b.has(item))

const quoteList = (nodes: GraphNode[]) => nodes.map((g) => `“${g.typed.quote}”`).join(', ')

const SUPERVISED_PHRASE =
  /(supervised|attended|teleoperated|assisted|human-in-the-loop|operator-supervised|manual)(?:\s+[A-Za-z0-9-]+){0,3}?(?=\s+(?:and|with|before|or|until)\b|[,.;]|$)/i

const singular = (noun: string) => (noun.endsWith('s') && !noun.endsWith('ss') ? noun.slice(0, -1) : noun)

/**
 * Runs the six diagnostics as detectors over the typed graph, derives the
 * minimum evidence-supported patch, and returns the typed edges.
 */
export const detect = (graph: GraphNode[], approved: boolean): Detection => {
  const byType = (type: CommitmentNode['type']) => graph.filter((g) => g.node.type === type)
  const commitments = byType('SalesCommitment').filter((g) => !g.typed.flags.acceptance)
  const acceptance = graph.filter((g) => g.typed.flags.acceptance)
  const preferences = byType('CustomerPreference')
  // Completed tests are evidence of capability too.
  const evidence = [
    ...byType('Evidence'),
    ...byType('EngineeringConstraint'),
    ...byType('VerificationTest').filter((g) => g.typed.flags.completedTest),
  ]
  const assumptions = byType('Assumption')
  const sites = byType('SiteClaim')
  const tests = byType('VerificationTest')
  const openTests = tests.filter((g) => g.typed.flags.openTest)

  const diagnostics: CompilerDiagnostic[] = []
  const edges: GraphEdge[] = []
  const replacements: Replacement[] = []
  const changes: SemanticChange[] = []
  const resolves: string[] = []
  const retains: string[] = []

  // ---- relations -------------------------------------------------------
  const unbounded = commitments.filter((g) => g.typed.unbounded.length > 0)
  const relatedEvidence = new Map<string, GraphNode[]>()
  for (const commitment of commitments) {
    const categories = categoriesOf(commitment)
    const related = evidence.filter(
      (candidate) =>
        relatedBy(commitment, candidate).length > 0 || intersects(categories, evidenceCategories(candidate)),
    )
    relatedEvidence.set(commitment.node.id, related)
    for (const candidate of related) {
      const bounded = candidate.typed.enumerations.length > 0 || candidate.typed.flags.supervised
      edges.push({
        from: commitment.node.id,
        to: candidate.node.id,
        type: bounded && commitment.typed.unbounded.length > 0 ? 'CONFLICTS_WITH' : 'SUPPORTED_BY',
      })
    }
    for (const assumption of assumptions) {
      const assumptionCategories = new Set<ScopeCategory>()
      if ([...assumption.typed.keywords].some((keyword) => AREA_NOUNS.includes(keyword) || keyword === 'access' || keyword === 'coverage')) {
        assumptionCategories.add('coverage')
      }
      if (relatedBy(commitment, assumption).length > 0 || intersects(categories, assumptionCategories)) {
        edges.push({ from: commitment.node.id, to: assumption.node.id, type: 'ASSUMES' })
      }
    }
  }

  // ---- DA-001 unbounded scope -----------------------------------------
  if (unbounded.length > 0) {
    const phrases = unbounded.flatMap((g) => g.typed.unbounded.map((phrase) => `“${phrase.phrase}”`))
    diagnostics.push({
      code: 'DA-001',
      title: 'UNBOUNDED_SCOPE',
      severity: 'BLOCKER',
      message: `${phrases.join(', ')} ${phrases.length > 1 ? 'have' : 'has'} no bounded enumeration or measurable acceptance condition.`,
      nodeIds: unbounded.map((g) => g.node.id),
      sourceRefs: unbounded.map(refOf),
      resolved: false,
    })
  }

  // ---- DA-002 commitment without evidence ------------------------------
  if (unbounded.length > 0) {
    const boundedRelated = unbounded.flatMap((g) =>
      (relatedEvidence.get(g.node.id) ?? []).filter((e) => e.typed.enumerations.length > 0),
    )
    const anyRelated = unbounded.some((g) => (relatedEvidence.get(g.node.id) ?? []).length > 0)
    const envelope = boundedRelated.flatMap((e) =>
      e.typed.enumerations.map((quantity) => `“${enumerationPhrase(e.typed.statement.text, quantity)}”`),
    )
    diagnostics.push({
      code: 'DA-002',
      title: 'COMMITMENT_WITHOUT_EVIDENCE',
      severity: 'BLOCKER',
      message:
        envelope.length > 0
          ? `The commercial promise exceeds the evidence envelope: ${[...new Set(envelope)].join(', ')}.`
          : anyRelated
            ? 'Related engineering statements do not bound the commercial promise with any measured quantity.'
            : 'No engineering evidence statement relates to the commercial promise.',
      nodeIds: [...unbounded.map((g) => g.node.id), ...new Set(boundedRelated.map((g) => g.node.id))],
      sourceRefs: boundedRelated.length > 0 ? [...new Set(boundedRelated)].map(refOf) : unbounded.map(refOf),
      resolved: false,
    })
  }

  // ---- DA-003 preference cast as constraint ----------------------------
  const mandatory = byType('SalesCommitment').filter((g) => g.typed.flags.mandatory)
  const castPairs: Array<[GraphNode, GraphNode]> = []
  for (const preference of preferences) {
    for (const commitment of mandatory) {
      if (relatedBy(preference, commitment).length > 0) castPairs.push([preference, commitment])
    }
  }
  if (castPairs.length > 0) {
    diagnostics.push({
      code: 'DA-003',
      title: 'PREFERENCE_CAST_AS_CONSTRAINT',
      severity: 'WARNING',
      message: `A customer preference (${quoteList(castPairs.map(([p]) => p))}) is restated as mandatory in the commercial proposal before evidence exists.`,
      nodeIds: [...new Set(castPairs.flatMap(([p, c]) => [p.node.id, c.node.id]))],
      sourceRefs: [...new Set(castPairs.map(([, c]) => c))].map(refOf),
      resolved: false,
    })
  }

  // ---- DA-004 site claim cast as fact ----------------------------------
  const clusters = new Map<string, GraphNode[]>()
  for (const site of sites) {
    const measurement = site.typed.quantities.find((q) => q.unit !== undefined || q.percent)
    const key = measurement ? `${measurement.value}${measurement.unit ?? '%'}` : site.node.id
    clusters.set(key, [...(clusters.get(key) ?? []), site])
  }
  const flaggedClusters = [...clusters.values()].filter((cluster) =>
    cluster.some((g) => g.typed.flags.hedged || g.typed.flags.unverified),
  )
  const flaggedSites = flaggedClusters.flat()
  if (flaggedSites.length > 0) {
    const unverifiedRefs = flaggedSites.filter((g) => g.typed.flags.unverified).map(refOf)
    const measurements = flaggedClusters.map((cluster) => {
      const q = cluster.flatMap((g) => g.typed.quantities).find((quantity) => quantity.unit || quantity.percent)
      return q ? `${q.raw}${q.unit ? ` ${q.unit}` : q.percent ? '%' : ''}` : cluster[0]!.typed.quote
    })
    diagnostics.push({
      code: 'DA-004',
      title: 'SITE_CLAIM_CAST_AS_FACT',
      severity: 'WARNING',
      message: `${measurements.map((m) => `“${m}”`).join(', ')} ${measurements.length > 1 ? 'are' : 'is'} customer-reported or approximate and cannot be used as a measured constraint yet.`,
      nodeIds: flaggedSites.map((g) => g.node.id),
      sourceRefs: unverifiedRefs.length > 0 ? unverifiedRefs : flaggedSites.map(refOf),
      resolved: false,
    })
  }

  // ---- DA-005 missing acceptance criterion -----------------------------
  const vague = acceptance.filter((g) => !g.typed.flags.hasThreshold)
  if (vague.length > 0) {
    diagnostics.push({
      code: 'DA-005',
      title: 'MISSING_ACCEPTANCE_CRITERION',
      severity: 'BLOCKER',
      message: `${quoteList(vague)} ${vague.length > 1 ? 'are' : 'is'} not an objective, repeatable acceptance criterion: no threshold, count or method is stated.`,
      nodeIds: vague.map((g) => g.node.id),
      sourceRefs: vague.map(refOf),
      resolved: false,
    })
  }

  // ---- DA-006 open critical test blocks gate ---------------------------
  if (openTests.length > 0) {
    diagnostics.push({
      code: 'DA-006',
      title: 'OPEN_CRITICAL_TEST_BLOCKS_GATE',
      severity: 'BLOCKER',
      message: `${openTests.length} verification ${openTests.length > 1 ? 'tests remain' : 'test remains'} open, so the gate cannot become an unconditional PASS.`,
      nodeIds: [...openTests.map((g) => g.node.id), GATE_ID],
      sourceRefs: openTests.map(refOf),
      resolved: false,
    })
  }

  // ---- patch synthesis -------------------------------------------------
  for (const commitment of unbounded) {
    const related = relatedEvidence.get(commitment.node.id) ?? []
    const pool = related.length > 0 ? related : evidence
    for (const phrase of commitment.typed.unbounded) {
      if (replacements.some((r) => r.category === phrase.category)) continue
      if (phrase.category === 'autonomy') {
        const source = [...pool, ...evidence].find((g) => g.typed.flags.supervised)
        const match = source ? SUPERVISED_PHRASE.exec(source.typed.statement.text) : null
        if (source && match) {
          replacements.push({
            category: 'autonomy',
            field: 'operating mode',
            before: phrase.phrase,
            after: match[0].trim(),
            commitmentId: commitment.node.id,
            evidenceId: source.node.id,
          })
        }
        continue
      }
      const candidates = [...pool, ...evidence].flatMap((g) =>
        g.typed.enumerations
          .filter((q) => isEnumeration(q) && enumerationCategory(g.typed.statement.text, q) === phrase.category)
          .map((q) => ({ g, q })),
      )
      const pick = candidates[0]
      if (!pick) continue
      // Replacement values are copied verbatim from the engineering statement.
      const phraseText = enumerationPhrase(pick.g.typed.statement.text, pick.q)
      const after = phraseText
      const headNoun = phraseText.split(/\s+/).pop()?.toLowerCase() ?? 'item'
      replacements.push({
        category: phrase.category,
        field: phrase.category === 'coverage' ? 'coverage' : `${singular(headNoun)} scope`,
        before: phrase.phrase,
        after,
        commitmentId: commitment.node.id,
        evidenceId: pick.g.node.id,
      })
    }
  }
  for (const replacement of replacements) {
    changes.push({
      nodeId: replacement.commitmentId,
      field: replacement.field,
      before: replacement.before,
      after: replacement.after,
    })
  }
  if (castPairs.length > 0) {
    const [preference, commitment] = castPairs[0]!
    const cue = matchAnyCue(commitment.typed.statement.text, MANDATORY_CUES)
    const before = cue
      ? commitment.typed.statement.text.slice(cue.start).split(/[.;,]/)[0]!.trim()
      : 'mandatory configuration'
    changes.push({
      nodeId: commitment.node.id,
      field: 'platform requirement',
      before,
      after: `customer preference (${preference.typed.quote}) pending mobility evidence`,
    })
  }

  const fullyBounded = unbounded.every((commitment) =>
    [...categoriesOf(commitment)].every((category) => replacements.some((r) => r.category === category)),
  )
  if (unbounded.length > 0 && fullyBounded && replacements.length > 0) resolves.push('DA-001', 'DA-002')
  if (castPairs.length > 0) resolves.push('DA-003')
  if (vague.length > 0 && changes.length > 0 && tests.length > 0) resolves.push('DA-005')
  for (const test of openTests) retains.push(`${test.node.id} ${test.node.label}`)
  for (const site of flaggedSites) retains.push(`${site.node.id} ${site.node.label}`)

  // ---- test / gate edges ---------------------------------------------
  const primary = unbounded[0] ?? commitments[0]
  for (const test of openTests) {
    if (primary) edges.push({ from: approved && resolves.includes('DA-001') ? 'SCOPE-001' : primary.node.id, to: test.node.id, type: 'REQUIRES_TEST' })
    edges.push({ from: test.node.id, to: GATE_ID, type: 'INVALIDATED_BY' })
  }

  for (const diagnostic of diagnostics) {
    diagnostic.resolved = approved && resolves.includes(diagnostic.code)
  }

  return {
    diagnostics,
    edges,
    changes,
    replacements,
    resolves,
    retains,
    unboundedCommitmentIds: unbounded.map((g) => g.node.id),
    openTestIds: openTests.map((g) => g.node.id),
    flaggedSiteIds: flaggedSites.map((g) => g.node.id),
    evidenceIds: evidence.map((g) => g.node.id),
  }
}
