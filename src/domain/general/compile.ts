import { compactHash, section } from '../fingerprint'
import type {
  AiExtractionEvidence,
  CommitmentNode,
  CommitmentNodeType,
  CompileImpact,
  CompileResult,
  CompiledSection,
  CompiledTarget,
  ExecutionOrigin,
  ExecutionReceipt,
  GraphEdge,
  SemanticPatch,
  SourceArtifact,
} from '../types'
import { classifyStatements, type TypedStatement } from './classify'
import { detect, GATE_ID, refOf, type GraphNode } from './detect'
import { extractStatements } from './extract'
import { truncate } from './text'

const ID_PREFIX: Record<CommitmentNodeType, string> = {
  CustomerObjective: 'OBJ',
  CustomerPreference: 'PREF',
  SalesCommitment: 'COM',
  EngineeringConstraint: 'CON',
  SiteClaim: 'SITE',
  Assumption: 'ASM',
  Evidence: 'EVD',
  Decision: 'DEC',
  DeploymentGate: 'GATE',
  VerificationTest: 'TEST',
  ScopeClause: 'SCOPE',
}

const LABELS: Record<CommitmentNodeType, string> = {
  CustomerObjective: 'Customer objective',
  CustomerPreference: 'Customer preference',
  SalesCommitment: 'Sales commitment',
  EngineeringConstraint: 'Engineering constraint',
  SiteClaim: 'Site claim',
  Assumption: 'Assumption',
  Evidence: 'Evidence',
  Decision: 'Decision',
  DeploymentGate: 'Deployment gate',
  VerificationTest: 'Verification test',
  ScopeClause: 'Scope clause',
}

const SCOPE_ID = 'SCOPE-001'

/** Stable fingerprint of the artifact set; part of every custom-mode identifier. */
export const artifactsFingerprint = (artifacts: SourceArtifact[]) =>
  compactHash(
    JSON.stringify(
      artifacts.map((a) => [a.id, a.role, a.title, a.owner, a.updatedAt, a.content]),
    ),
  ).replace('fnv1a32-', '')

const statusFor = (typed: TypedStatement): CommitmentNode['status'] => {
  switch (typed.type) {
    case 'SiteClaim':
      return typed.flags.hedged || typed.flags.unverified ? 'OPEN' : 'SOURCE'
    case 'Assumption':
      return 'OPEN'
    case 'VerificationTest':
      return typed.flags.completedTest ? 'PASS' : 'OPEN'
    default:
      return 'SOURCE'
  }
}

const buildGraph = (artifacts: SourceArtifact[]): GraphNode[] => {
  const counters = new Map<string, number>()
  return classifyStatements(extractStatements(artifacts)).map((typed) => {
    const prefix = ID_PREFIX[typed.type]
    const count = (counters.get(prefix) ?? 0) + 1
    counters.set(prefix, count)
    const node: CommitmentNode = {
      id: `${prefix}-${String(count).padStart(3, '0')}`,
      type: typed.type,
      label: `${LABELS[typed.type]} · ${typed.statement.id}`,
      value: truncate(typed.quote),
      status: statusFor(typed),
      confidence: typed.confidence,
      sources: [
        { artifactId: typed.statement.artifactId, quote: typed.quote, line: typed.statement.line },
      ],
    }
    return { node, typed }
  })
}

export interface GeneralCompileOptions {
  artifacts: SourceArtifact[]
  approved?: boolean
  aiEvidence?: AiExtractionEvidence
  now?: string
  runId?: string
  executionOrigin?: ExecutionOrigin
}

/**
 * Compiles three user-supplied artifacts through the general path: clause
 * extraction → lexical typing → detectors → evidence-derived patch → targets.
 * Deterministic for a given input; Gemini candidates, when present, are shown
 * separately and never change the graph, the gate or the patch.
 */
export const compileGeneral = (options: GeneralCompileOptions): CompileResult => {
  const { artifacts } = options
  const approved = options.approved ?? false
  const generatedAt = options.now ?? new Date().toISOString()
  const fingerprint = artifactsFingerprint(artifacts)
  const decisionId = `DEC-${fingerprint.slice(0, 6).toUpperCase()}`
  const runId = options.runId ?? (approved ? 'CUSTOM-V2' : 'CUSTOM-V1')

  const graph = buildGraph(artifacts)
  const detection = detect(graph, approved)
  const byId = new Map(graph.map((g) => [g.node.id, g]))
  const primaryId = detection.unboundedCommitmentIds[0]
  const primary = primaryId ? byId.get(primaryId) : undefined
  const patchResolvesScope = approved && detection.resolves.includes('DA-001')

  // ---- gate node ------------------------------------------------------
  const gateSource =
    graph.find((g) => g.typed.flags.mentionsGate) ??
    graph.find((g) => g.node.type === 'VerificationTest') ??
    graph.find((g) => g.node.type === 'EngineeringConstraint')
  const openBlockers = detection.diagnostics.filter((d) => d.severity === 'BLOCKER' && !d.resolved).length
  const gateNode: CommitmentNode = {
    id: GATE_ID,
    type: 'DeploymentGate',
    label: 'Deployment gate',
    value: approved
      ? `CONDITIONAL PILOT: ${detection.retains.length > 0 ? `${detection.retains.length} evidence item(s) remain open` : 'no open evidence items'}.`
      : `HOLD while ${openBlockers} blocker${openBlockers === 1 ? '' : 's'} remain unresolved.`,
    status: approved ? 'APPROVED' : 'OPEN',
    confidence: 1,
    sources: gateSource ? [refOf(gateSource)] : [],
  }

  // ---- nodes ----------------------------------------------------------
  const nodes: CommitmentNode[] = graph.map(({ node }) => {
    if (approved && patchResolvesScope && detection.unboundedCommitmentIds.includes(node.id)) {
      return { ...node, status: 'INVALIDATED' as const, sources: node.sources.map((s) => ({ ...s })) }
    }
    return { ...node, sources: node.sources.map((s) => ({ ...s })) }
  })
  nodes.push(gateNode)

  const afterValues = detection.replacements.map((r) => r.after)
  if (approved && detection.changes.length > 0) {
    const evidenceRefs = detection.replacements
      .map((r) => byId.get(r.evidenceId))
      .filter((g): g is GraphNode => g !== undefined)
      .map(refOf)
    nodes.push({
      id: SCOPE_ID,
      type: 'ScopeClause',
      label: 'Approved bounded scope',
      value: afterValues.length > 0 ? `Bounded to: ${afterValues.join('; ')}.` : 'Commercial language re-scoped to stated customer preferences.',
      status: 'APPROVED',
      confidence: 1,
      sources: evidenceRefs.length > 0 ? evidenceRefs : primary ? [refOf(primary)] : [],
    })
    nodes.push({
      id: decisionId,
      type: 'Decision',
      label: 'Bound deployment scope',
      value: 'Adopt the evidence-supported scope patch; defer every unbounded commitment until evidence exists.',
      status: 'APPROVED',
      confidence: 1,
      sources: [...(primary ? [refOf(primary)] : []), ...evidenceRefs.slice(0, 2)],
    })
  }

  const edges: GraphEdge[] = detection.edges.map((edge) => ({ ...edge }))
  if (approved && detection.changes.length > 0) {
    edges.push({ from: decisionId, to: 'SOW-3.2', type: 'GENERATES' })
    for (const testId of detection.openTestIds) edges.push({ from: decisionId, to: testId, type: 'GENERATES' })
  }
  // Edges may only point at nodes that exist in this compile.
  const nodeIds = new Set(nodes.map((n) => n.id))
  const validEdges = edges.filter((edge) => nodeIds.has(edge.from) && (nodeIds.has(edge.to) || edge.to === 'SOW-3.2' || detection.openTestIds.includes(edge.to)))

  // ---- patch ----------------------------------------------------------
  const patch: SemanticPatch = {
    id: 'PATCH-001-A',
    decisionId,
    title: detection.changes.length > 0 ? 'Bound the commercial promise to the evidence envelope' : 'No evidence-supported patch available',
    rationale:
      detection.changes.length > 0
        ? 'The smallest scope change the supplied evidence supports: every replacement value is copied from an engineering statement; unverified claims and open tests stay explicit.'
        : detection.unboundedCommitmentIds.length > 0
          ? 'Unbounded commitments were found, but no engineering statement supplies a bounded value to replace them with. Add measured evidence or narrow the promise manually.'
          : 'No unbounded commercial commitment was detected in the supplied artifacts.',
    changes: detection.changes,
    resolves: detection.resolves,
    retains: detection.retains,
    status: approved ? 'APPROVED' : 'PROPOSED',
  }

  // ---- targets --------------------------------------------------------
  const objectives = graph.filter((g) => g.node.type === 'CustomerObjective')
  const assumptions = graph.filter((g) => g.node.type === 'Assumption')
  const constraints = graph.filter((g) => g.node.type === 'EngineeringConstraint' || g.node.type === 'Evidence')
  const tests = graph.filter((g) => g.node.type === 'VerificationTest')
  const flaggedSites = graph.filter((g) => detection.flaggedSiteIds.includes(g.node.id))
  const commitmentText = primary ? primary.typed.quote : (graph.find((g) => g.node.type === 'SalesCommitment')?.typed.quote ?? 'No commercial commitment was stated.')
  const draftScope = `Draft scope: ${commitmentText}`
  const approvedScope =
    afterValues.length > 0
      ? `Phase scope bounded to ${afterValues.join(', ')}.`
      : `Scope re-stated without unverified commitments.`
  const openItems = detection.retains.length > 0 ? detection.retains.join('; ') : 'none recorded'
  const rebuilt = approved && detection.changes.length > 0

  const customerSections: CompiledSection[] = [
    section('CDM-1', 'Decision required', `${rebuilt ? approvedScope : draftScope} Decision: ${decisionId}.`, [decisionId], [...objectives.map((g) => g.node.id), rebuilt ? SCOPE_ID : primary?.node.id ?? GATE_ID].filter(Boolean), rebuilt),
    section('CDM-2', 'What remains open', rebuilt ? `Conditional pilot: complete before field authorization — ${openItems}.` : `HOLD: ${openBlockers} blocker(s) and ${detection.diagnostics.filter((d) => d.severity === 'WARNING' && !d.resolved).length} warning(s) open.`, [decisionId], [...detection.openTestIds, ...detection.flaggedSiteIds], rebuilt),
    section('CDM-3', 'Business objective', objectives[0]?.typed.quote ?? 'Not stated in the customer artifact.', [], objectives.slice(0, 1).map((g) => g.node.id), false),
  ]
  const salesSections: CompiledSection[] = [
    section('SOW-3.2', 'Scope clause', `${rebuilt ? approvedScope : draftScope} Ref: ${decisionId}.`, [decisionId], rebuilt ? [SCOPE_ID] : primary ? [primary.node.id] : [], rebuilt),
    section('SOW-4.1', 'Assumptions & exclusions', rebuilt ? `Excluded from this phase: ${detection.changes.map((c) => c.before).join(', ') || 'nothing'}. Assumptions to verify: ${assumptions.map((g) => g.typed.quote).join(' ') || 'none recorded'}.` : `Assumptions carried by the draft: ${assumptions.map((g) => g.typed.quote).join(' ') || 'none recorded'}.`, [decisionId], assumptions.map((g) => g.node.id), rebuilt),
    section('SOW-7.1', 'Commercial terms', 'Commercial pricing and schedule are intentionally not generated by the compiler.', [], [], false),
  ]
  const engineeringSections: CompiledSection[] = [
    ...tests.map((g, index) =>
      section(`TEST-${String(index + 1).padStart(3, '0')}`, `Verification test ${index + 1}`, `${rebuilt ? 'Execute before field authorization' : 'Open'}: ${g.typed.quote}`, [decisionId], [g.node.id], rebuilt),
    ),
    ...flaggedSites.map((g, index) =>
      section(`SITE-${String(index + 1).padStart(3, '0')}`, `Site verification ${index + 1}`, `Measure and verify: ${g.typed.quote}`, [decisionId], [g.node.id], rebuilt),
    ),
    ...(tests.length === 0 && flaggedSites.length === 0
      ? [section('ENG-ACCEPT', 'Acceptance basis', 'No verification test or unverified site claim was identified; define measurable acceptance before any gate.', [decisionId], [], rebuilt)]
      : []),
    section('ENG-CONST', 'Unchanged constraints', constraints.length > 0 ? constraints.map((g) => g.typed.quote).join(' ') : 'No engineering constraint statements were identified.', [], constraints.map((g) => g.node.id), false),
  ]

  const targets: CompiledTarget[] = [
    { id: 'TARGET-CUSTOMER', kind: 'customer-decision-memo', title: 'Customer Decision Memo', audience: artifacts.find((a) => a.role === 'customer')?.owner ?? 'Customer', status: rebuilt ? 'APPROVED BASELINE' : 'DRAFT — REVIEW REQUIRED', sections: customerSections },
    { id: 'TARGET-SALES', kind: 'sales-sow', title: 'Sales SOW', audience: artifacts.find((a) => a.role === 'sales')?.owner ?? 'Sales', status: rebuilt ? 'APPROVED BASELINE' : 'DRAFT — REVIEW REQUIRED', sections: salesSections },
    { id: 'TARGET-ENGINEERING', kind: 'engineering-test-manifest', title: 'Engineering Test Manifest', audience: artifacts.find((a) => a.role === 'engineering')?.owner ?? 'Engineering', status: rebuilt ? 'APPROVED BASELINE' : 'DRAFT — REVIEW REQUIRED', sections: engineeringSections },
  ]
  const allSections = targets.flatMap((t) => t.sections)
  const decisionLinked = allSections.filter((s) => s.decisionIds.includes(decisionId)).map((s) => s.id)
  const unlinked = allSections.filter((s) => !s.decisionIds.includes(decisionId)).map((s) => s.id)

  const impact: CompileImpact = rebuilt
    ? {
        changed: [...detection.unboundedCommitmentIds.map((id) => `${id} → ${SCOPE_ID}`), GATE_ID],
        invalidated: detection.unboundedCommitmentIds.map((id) => `Original ${id} unbounded commitment`),
        recompiled: decisionLinked,
        unchanged: unlinked,
      }
    : {
        changed: [],
        invalidated: [`${GATE_ID} pilot readiness`],
        recompiled: [],
        unchanged: ['All baseline target sections'],
      }

  // ---- receipts -------------------------------------------------------
  const receipts: ExecutionReceipt[] = [
    { id: `${runId}-INGEST`, stage: 'ingest', actor: 'Build engine', status: 'SUCCESS', at: generatedAt, durationMs: 0, summary: `Three user-supplied artifacts normalized into ${graph.length} typed statements locally; text leaves this machine only when live Gemini is enabled.` },
    { id: `${runId}-AI`, stage: 'gemini-extract', actor: 'Gemini', status: options.aiEvidence ? 'SUCCESS' : 'SKIPPED', at: generatedAt, durationMs: options.aiEvidence?.durationMs ?? 0, summary: options.aiEvidence ? `${options.aiEvidence.model} classified ${options.aiEvidence.statementCount} source statements as separate candidates.` : 'Live Gemini not used; lexical typing only.', evidence: options.aiEvidence?.rawSummary },
    { id: `${runId}-CHECK`, stage: 'type-check', actor: 'Deterministic rule engine', status: detection.diagnostics.length > 0 ? 'ATTENTION' : 'SUCCESS', at: generatedAt, durationMs: 0, summary: approved ? `${detection.diagnostics.filter((d) => d.resolved).length} diagnostic(s) resolved by the approved patch; ${detection.diagnostics.filter((d) => !d.resolved).length} remain open.` : `${detection.diagnostics.filter((d) => d.severity === 'BLOCKER').length} blocker(s) and ${detection.diagnostics.filter((d) => d.severity === 'WARNING').length} warning(s) emitted with source maps.` },
    { id: `${runId}-PATCH`, stage: 'patch-plan', actor: 'Deterministic rule engine', status: detection.changes.length > 0 ? 'SUCCESS' : 'ATTENTION', at: generatedAt, durationMs: 0, summary: detection.changes.length > 0 ? `${detection.changes.length}-field scope patch derived from engineering statements; no costs, dates, or measurements invented.` : 'No evidence-supported patch could be derived.' },
    ...(approved
      ? [
          { id: `${runId}-APPROVE`, stage: 'human-approval' as const, actor: 'Human reviewer' as const, status: 'SUCCESS' as const, at: generatedAt, durationMs: 0, summary: `${decisionId} reviewed; graph baseline advanced to v2.` },
          { id: `${runId}-BUILD`, stage: 'incremental-build' as const, actor: 'Build engine' as const, status: 'SUCCESS' as const, at: generatedAt, durationMs: 0, summary: `${impact.recompiled.length} decision-linked section(s) rebuilt; ${impact.unchanged.length} unrelated section(s) reused without reconstruction.` },
        ]
      : []),
  ]

  const aiCandidates: CommitmentNode[] =
    options.aiEvidence?.classifiedStatements.map((statement, index) => ({
      id: `AI-CANDIDATE-${String(index + 1).padStart(2, '0')}`,
      type: statement.type,
      label: `Gemini candidate · ${statement.type}`,
      value: statement.quote,
      status: 'AI_DRAFT',
      confidence: statement.confidence,
      sources: [{ artifactId: statement.artifactId, quote: statement.quote, line: 1 }],
    })) ?? []

  return {
    projectId: `custom-${fingerprint}`,
    projectName: `Custom review · ${fingerprint}`,
    version: approved ? 2 : 1,
    decisionId,
    gate: approved ? 'CONDITIONAL PILOT' : 'HOLD',
    provider: options.aiEvidence?.provider ?? 'deterministic-demo',
    executionOrigin: options.executionOrigin ?? 'browser',
    mode: 'custom',
    synthetic: false,
    artifacts: artifacts.map((artifact) => ({ ...artifact })),
    aiCandidates,
    nodes,
    edges: validEdges,
    diagnostics: detection.diagnostics,
    patch,
    targets,
    impact,
    receipts,
    generatedAt,
  }
}
