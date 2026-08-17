import { DEMO_ARTIFACTS, DEMO_PROJECT } from './demo'
import type {
  AiExtractionEvidence,
  CommitmentNode,
  CompileImpact,
  CompileResult,
  CompiledSection,
  CompiledTarget,
  CompilerDiagnostic,
  ExecutionReceipt,
  GraphEdge,
  SemanticPatch,
  SourceArtifact,
  SourceReference,
} from './types'

const source = (artifactId: string, quote: string, line = 1): SourceReference => ({
  artifactId,
  quote,
  line,
})

const compactHash = (value: string) => {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return `sha-${(hash >>> 0).toString(16).padStart(8, '0')}`
}

const section = (
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

const baseNodes = (): CommitmentNode[] => [
  {
    id: 'OBJ-001',
    type: 'CustomerObjective',
    label: 'Detect hazardous leaks',
    value: 'Reduce human exposure during sub-fab leak inspection.',
    status: 'SOURCE',
    confidence: 0.96,
    sources: [source('SRC-CUSTOMER-01', 'identify all chemical leaks')],
  },
  {
    id: 'PREF-003',
    type: 'CustomerPreference',
    label: 'Preferred mobility platform',
    value: 'Four-legged, four-wheeled robot.',
    status: 'AI_DRAFT',
    confidence: 0.91,
    sources: [source('SRC-CUSTOMER-01', 'four-legged, four-wheeled robot')],
  },
  {
    id: 'COM-006',
    type: 'SalesCommitment',
    label: 'Unbounded coverage commitment',
    value: 'All materials, every area, fully autonomous operation.',
    status: 'AI_DRAFT',
    confidence: 0.98,
    sources: [
      source('SRC-CUSTOMER-01', 'all chemical leaks in every area'),
      source('SRC-SALES-02', 'cover the entire facility and autonomously identify any leaked material'),
    ],
  },
  {
    id: 'CON-011',
    type: 'EngineeringConstraint',
    label: 'Raman evidence envelope',
    value: 'Five named analytes under controlled conditions; 10 mm probe distance.',
    status: 'SOURCE',
    confidence: 0.99,
    sources: [
      source('SRC-ENGINEERING-03', 'five named analytes under controlled conditions'),
      source('SRC-ENGINEERING-03', 'Probe working distance is 10 mm'),
    ],
  },
  {
    id: 'SITE-008',
    type: 'SiteClaim',
    label: 'Reported minimum aisle',
    value: 'Approximately 800 mm; not yet surveyed.',
    status: 'OPEN',
    confidence: 0.78,
    sources: [
      source('SRC-CUSTOMER-01', 'narrowest aisle is about 800 mm'),
      source('SRC-ENGINEERING-03', 'customer-reported, not surveyed'),
    ],
  },
  {
    id: 'EVD-021',
    type: 'Evidence',
    label: 'Current Raman validation',
    value: 'Controlled-condition evidence for five named analytes.',
    status: 'SOURCE',
    confidence: 1,
    sources: [source('SRC-ENGINEERING-03', 'Current Raman evidence covers five named analytes')],
  },
  {
    id: 'ASM-017',
    type: 'Assumption',
    label: 'Full-area physical access',
    value: 'All target areas are reachable without a completed survey.',
    status: 'OPEN',
    confidence: 0.61,
    sources: [source('SRC-ENGINEERING-03', 'full-area access is unmeasured')],
  },
  {
    id: 'TEST-021',
    type: 'VerificationTest',
    label: 'Five-analyte blind test',
    value: 'Open critical test before supervised pilot.',
    status: 'OPEN',
    confidence: 1,
    sources: [source('SRC-ENGINEERING-03', 'blind five-analyte test before any pilot gate')],
  },
  {
    id: 'GATE-001',
    type: 'DeploymentGate',
    label: 'Phase 1 gate',
    value: 'HOLD while scope is unbounded and critical test is open.',
    status: 'OPEN',
    confidence: 1,
    sources: [source('SRC-ENGINEERING-03', 'Recommend supervised Phase 1')],
  },
]

const approvedNodes = (): CommitmentNode[] => [
  ...baseNodes().map((node) => {
    if (node.id === 'COM-006') {
      return {
        ...node,
        status: 'INVALIDATED' as const,
      }
    }
    if (node.id === 'GATE-001') {
      return {
        ...node,
        value: 'CONDITIONAL PILOT after blind analyte test and physical aisle survey.',
        status: 'APPROVED' as const,
      }
    }
    return node
  }),
  {
    id: 'SCOPE-014',
    type: 'ScopeClause',
    label: 'Approved Phase 1 scope',
    value: 'Five named analytes at 12 mapped critical AOIs with supervised operation.',
    status: 'APPROVED',
    confidence: 1,
    sources: [
      source('SRC-ENGINEERING-03', 'five named analytes under controlled conditions'),
      source('SRC-ENGINEERING-03', 'Twelve critical AOIs are mapped'),
      source('SRC-ENGINEERING-03', 'Recommend supervised Phase 1'),
    ],
  },
  {
    id: DEMO_PROJECT.decisionId,
    type: 'Decision',
    label: 'Bound Phase 1 deployment scope',
    value: 'Adopt minimum safe scope patch; defer full autonomy and full-area coverage.',
    status: 'APPROVED',
    confidence: 1,
    sources: [
      source('SRC-CUSTOMER-01', 'pilot to prove the whole concept'),
      source('SRC-ENGINEERING-03', 'Recommend supervised Phase 1'),
    ],
  },
]

const edges = (approved: boolean): GraphEdge[] => [
  { from: 'COM-006', to: 'CON-011', type: 'CONFLICTS_WITH' },
  { from: 'COM-006', to: 'EVD-021', type: 'SUPPORTED_BY' },
  { from: 'COM-006', to: 'ASM-017', type: 'ASSUMES' },
  { from: approved ? 'SCOPE-014' : 'COM-006', to: 'TEST-021', type: 'REQUIRES_TEST' },
  { from: 'TEST-021', to: 'GATE-001', type: 'INVALIDATED_BY' },
  ...(approved
    ? [
        { from: DEMO_PROJECT.decisionId, to: 'SOW-3.2', type: 'GENERATES' as const },
        { from: DEMO_PROJECT.decisionId, to: 'TEST-MANIFEST-1', type: 'GENERATES' as const },
      ]
    : []),
]

const diagnostics = (approved: boolean): CompilerDiagnostic[] => {
  const items: CompilerDiagnostic[] = [
    {
      code: 'DA-001',
      title: 'UNBOUNDED_SCOPE',
      severity: 'BLOCKER',
      message: '“All materials” and “entire facility” have no bounded enumeration or measurable acceptance condition.',
      nodeIds: ['COM-006'],
      sourceRefs: [source('SRC-SALES-02', 'cover the entire facility and autonomously identify any leaked material')],
      resolved: approved,
    },
    {
      code: 'DA-002',
      title: 'COMMITMENT_WITHOUT_EVIDENCE',
      severity: 'BLOCKER',
      message: 'The commercial promise exceeds the five-analyte Raman evidence envelope.',
      nodeIds: ['COM-006', 'EVD-021'],
      sourceRefs: [source('SRC-ENGINEERING-03', 'evidence covers five named analytes')],
      resolved: approved,
    },
    {
      code: 'DA-003',
      title: 'PREFERENCE_CAST_AS_CONSTRAINT',
      severity: 'WARNING',
      message: 'A preferred quadruped-wheel platform was made mandatory before mobility evidence exists.',
      nodeIds: ['PREF-003', 'COM-006'],
      sourceRefs: [source('SRC-SALES-02', 'mandatory configuration')],
      resolved: approved,
    },
    {
      code: 'DA-004',
      title: 'SITE_CLAIM_CAST_AS_FACT',
      severity: 'WARNING',
      message: 'The 800 mm aisle statement is customer-reported and cannot be used as a measured constraint yet.',
      nodeIds: ['SITE-008'],
      sourceRefs: [source('SRC-ENGINEERING-03', 'customer-reported, not surveyed')],
      resolved: false,
    },
    {
      code: 'DA-005',
      title: 'MISSING_ACCEPTANCE_CRITERION',
      severity: 'BLOCKER',
      message: '“Successful autonomous coverage” is not an objective, repeatable acceptance criterion.',
      nodeIds: ['COM-006'],
      sourceRefs: [source('SRC-SALES-02', 'Acceptance is successful autonomous coverage')],
      resolved: approved,
    },
    {
      code: 'DA-006',
      title: 'OPEN_CRITICAL_TEST_BLOCKS_GATE',
      severity: 'BLOCKER',
      message: 'The blind five-analyte test remains open, so the gate cannot become an unconditional PASS.',
      nodeIds: ['TEST-021', 'GATE-001'],
      sourceRefs: [source('SRC-ENGINEERING-03', 'blind five-analyte test before any pilot gate')],
      resolved: false,
    },
  ]
  return items
}

const patch = (approved: boolean): SemanticPatch => ({
  id: 'PATCH-014-A',
  decisionId: DEMO_PROJECT.decisionId,
  title: 'Bound the Phase 1 evidence envelope',
  rationale:
    'This is the smallest scope change supported by current evidence. It preserves the customer objective while deferring unverified autonomy and facility-wide coverage.',
  changes: [
    { nodeId: 'COM-006', field: 'analyte scope', before: 'all materials', after: 'five named analytes' },
    { nodeId: 'COM-006', field: 'coverage', before: 'every area', after: '12 mapped critical AOIs' },
    { nodeId: 'COM-006', field: 'operating mode', before: 'fully autonomous', after: 'supervised Phase 1' },
  ],
  resolves: ['DA-001', 'DA-002', 'DA-003', 'DA-005'],
  retains: ['TEST-021 blind analyte test', 'SITE-008 physical aisle survey'],
  status: approved ? 'APPROVED' : 'PROPOSED',
})

const targets = (approved: boolean): CompiledTarget[] => {
  const scope = approved
    ? 'Phase 1 evaluates five named analytes at 12 mapped critical AOIs in supervised operation.'
    : 'Draft scope requests all-material, facility-wide, fully autonomous inspection.'
  const gate = approved
    ? 'Conditional pilot: execute TEST-021 and survey SITE-008 before field authorization.'
    : 'HOLD: unsupported scope and open critical evidence.'

  return [
    {
      id: 'TARGET-CUSTOMER',
      kind: 'customer-decision-memo',
      title: 'Customer Decision Memo',
      audience: 'Facilities process owner',
      status: approved ? 'APPROVED BASELINE' : 'DRAFT — REVIEW REQUIRED',
      sections: [
        section('CDM-1', 'Decision required', `${scope} Decision: ${DEMO_PROJECT.decisionId}.`, [DEMO_PROJECT.decisionId], ['OBJ-001', approved ? 'SCOPE-014' : 'COM-006'], approved),
        section('CDM-2', 'What remains open', gate, [DEMO_PROJECT.decisionId], ['TEST-021', 'SITE-008'], approved),
        section('CDM-3', 'Business objective', 'Reduce human exposure during sub-fab leak inspection.', [], ['OBJ-001'], false),
      ],
    },
    {
      id: 'TARGET-SALES',
      kind: 'sales-sow',
      title: 'Sales SOW',
      audience: 'Solutions sales',
      status: approved ? 'APPROVED BASELINE' : 'DRAFT — REVIEW REQUIRED',
      sections: [
        section('SOW-3.2', 'Scope clause', `${scope} Ref: ${DEMO_PROJECT.decisionId}.`, [DEMO_PROJECT.decisionId], [approved ? 'SCOPE-014' : 'COM-006'], approved),
        section('SOW-4.1', 'Assumptions & exclusions', 'Full autonomy, unknown materials, and non-mapped areas are excluded from Phase 1.', [DEMO_PROJECT.decisionId], ['ASM-017'], approved),
        section('SOW-7.1', 'Commercial terms', 'Commercial pricing and schedule are intentionally not generated by the model.', [], [], false),
      ],
    },
    {
      id: 'TARGET-ENGINEERING',
      kind: 'engineering-test-manifest',
      title: 'Engineering Test Manifest',
      audience: 'Application engineering',
      status: approved ? 'APPROVED BASELINE' : 'DRAFT — REVIEW REQUIRED',
      sections: [
        section('TEST-021', 'Raman blind test', 'Run a blinded test for the five named analytes under the defined probe-distance envelope.', [DEMO_PROJECT.decisionId], ['TEST-021', 'CON-011'], approved),
        section('SITE-008', 'Physical access survey', 'Measure the minimum aisle and all 12 critical AOIs before field authorization.', [DEMO_PROJECT.decisionId], ['SITE-008'], approved),
        section('SYS-009', 'Network & charging', 'Network and charging requirements are unchanged by this scope decision.', [], [], false),
      ],
    },
  ]
}

const impact = (approved: boolean): CompileImpact =>
  approved
    ? {
        changed: ['COM-006 → SCOPE-014', 'GATE-001'],
        invalidated: ['Original COM-006 facility-wide commitment'],
        recompiled: ['CDM-1', 'CDM-2', 'SOW-3.2', 'SOW-4.1', 'TEST-021', 'SITE-008'],
        unchanged: ['CDM-3', 'SOW-7.1', 'SYS-009'],
      }
    : {
        changed: [],
        invalidated: ['GATE-001 pilot readiness'],
        recompiled: [],
        unchanged: ['All baseline target sections'],
      }

const receipts = (
  approved: boolean,
  generatedAt: string,
  aiEvidence?: AiExtractionEvidence,
): ExecutionReceipt[] => [
  {
    id: 'RUN-INGEST-001',
    stage: 'ingest',
    actor: 'Build engine',
    status: 'SUCCESS',
    at: generatedAt,
    durationMs: 18,
    summary: 'Three synthetic source artifacts normalized; no customer data transmitted.',
  },
  {
    id: 'RUN-AI-002',
    stage: 'gemini-extract',
    actor: 'Gemini',
    status: aiEvidence ? 'SUCCESS' : 'SKIPPED',
    at: generatedAt,
    durationMs: aiEvidence?.durationMs ?? 0,
    summary: aiEvidence
      ? `${aiEvidence.model} classified ${aiEvidence.statementCount} source statements.`
      : 'Local evidence-safe fallback used. Configure Vertex AI or GEMINI_API_KEY for a live Gemini call.',
    evidence: aiEvidence?.rawSummary,
  },
  {
    id: 'RUN-CHECK-003',
    stage: 'type-check',
    actor: 'Deterministic rule engine',
    status: 'ATTENTION',
    at: generatedAt,
    durationMs: 7,
    summary: approved ? 'Four diagnostics resolved; two evidence gates remain open.' : 'Four blockers and two warnings emitted with source maps.',
  },
  {
    id: 'RUN-PATCH-004',
    stage: 'patch-plan',
    actor: 'Gemini',
    status: 'SUCCESS',
    at: generatedAt,
    durationMs: aiEvidence ? 31 : 4,
    summary: 'Minimum three-field scope patch proposed; no costs, dates, or measurements invented.',
  },
  ...(approved
    ? [
        {
          id: 'RUN-APPROVE-005',
          stage: 'human-approval' as const,
          actor: 'Human reviewer' as const,
          status: 'SUCCESS' as const,
          at: generatedAt,
          durationMs: 0,
          summary: `${DEMO_PROJECT.decisionId} approved; graph baseline advanced to v2.`,
        },
        {
          id: 'RUN-BUILD-006',
          stage: 'incremental-build' as const,
          actor: 'Build engine' as const,
          status: 'SUCCESS' as const,
          at: generatedAt,
          durationMs: 12,
          summary: 'Six affected sections rebuilt; three unrelated section hashes preserved.',
        },
      ]
    : []),
]

export const compileDemo = (options?: {
  approved?: boolean
  artifacts?: SourceArtifact[]
  aiEvidence?: AiExtractionEvidence
  now?: string
}): CompileResult => {
  if (options?.artifacts && !isDemoFixture(options.artifacts)) {
    throw new Error('This prototype only compiles the disclosed synthetic Raman fixture.')
  }
  const approved = options?.approved ?? false
  const generatedAt = options?.now ?? new Date().toISOString()
  const provider = options?.aiEvidence?.provider ?? 'deterministic-demo'
  const semanticPatch = patch(approved)
  if (options?.aiEvidence?.rawSummary) {
    semanticPatch.rationale = options.aiEvidence.rawSummary
  }

  return {
    projectId: DEMO_PROJECT.id,
    projectName: DEMO_PROJECT.name,
    version: approved ? 2 : 1,
    decisionId: DEMO_PROJECT.decisionId,
    gate: approved ? 'CONDITIONAL PILOT' : 'HOLD',
    provider,
    synthetic: true,
    artifacts: options?.artifacts ?? DEMO_ARTIFACTS,
    nodes: approved ? approvedNodes() : baseNodes(),
    edges: edges(approved),
    diagnostics: diagnostics(approved),
    patch: semanticPatch,
    targets: targets(approved),
    impact: impact(approved),
    receipts: receipts(approved, generatedAt, options?.aiEvidence),
    generatedAt,
  }
}

export const isDemoFixture = (artifacts: SourceArtifact[]) =>
  artifacts.length === DEMO_ARTIFACTS.length &&
  artifacts.every((artifact, index) => {
    const expected = DEMO_ARTIFACTS[index]
    return Boolean(
      expected &&
        artifact.id === expected.id &&
        artifact.role === expected.role &&
        artifact.content.trim() === expected.content.trim(),
    )
  })

export const unresolvedBlockerCount = (result: CompileResult) =>
  result.diagnostics.filter((item) => item.severity === 'BLOCKER' && !item.resolved).length

export const changedSectionCount = (result: CompileResult) =>
  result.targets.flatMap((target) => target.sections).filter((item) => item.changed).length
