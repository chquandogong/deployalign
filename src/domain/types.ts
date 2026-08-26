export type ArtifactRole = 'customer' | 'sales' | 'engineering'

export interface SourceArtifact {
  id: string
  role: ArtifactRole
  title: string
  owner: string
  updatedAt: string
  content: string
}

export type CommitmentNodeType =
  | 'CustomerObjective'
  | 'CustomerPreference'
  | 'SalesCommitment'
  | 'EngineeringConstraint'
  | 'SiteClaim'
  | 'Assumption'
  | 'Evidence'
  | 'Decision'
  | 'DeploymentGate'
  | 'VerificationTest'
  | 'ScopeClause'

export type NodeStatus = 'SOURCE' | 'AI_DRAFT' | 'APPROVED' | 'INVALIDATED' | 'OPEN' | 'PASS'

export interface SourceReference {
  artifactId: string
  quote: string
  line: number
}

export interface CommitmentNode {
  id: string
  type: CommitmentNodeType
  label: string
  value: string
  status: NodeStatus
  sources: SourceReference[]
  confidence?: number
}

export type EdgeType =
  | 'EXTRACTED_FROM'
  | 'CONFLICTS_WITH'
  | 'SUPPORTED_BY'
  | 'ASSUMES'
  | 'REQUIRES_TEST'
  | 'GENERATES'
  | 'INVALIDATED_BY'

export interface GraphEdge {
  from: string
  to: string
  type: EdgeType
}

export type DiagnosticSeverity = 'BLOCKER' | 'WARNING'

export interface CompilerDiagnostic {
  code: string
  title: string
  severity: DiagnosticSeverity
  message: string
  nodeIds: string[]
  sourceRefs: SourceReference[]
  resolved: boolean
}

export interface SemanticChange {
  nodeId: string
  field: string
  before: string
  after: string
}

export interface SemanticPatch {
  id: string
  decisionId: string
  title: string
  rationale: string
  changes: SemanticChange[]
  resolves: string[]
  retains: string[]
  status: 'PROPOSED' | 'APPROVED' | 'REJECTED'
}

export type TargetKind =
  | 'customer-decision-memo'
  | 'sales-sow'
  | 'engineering-test-manifest'

export interface CompiledSection {
  id: string
  heading: string
  body: string
  decisionIds: string[]
  sourceNodeIds: string[]
  hash: string
  changed: boolean
}

export interface CompiledTarget {
  id: string
  kind: TargetKind
  title: string
  audience: string
  status: 'DRAFT — REVIEW REQUIRED' | 'APPROVED BASELINE'
  sections: CompiledSection[]
}

export interface CompileImpact {
  changed: string[]
  invalidated: string[]
  recompiled: string[]
  unchanged: string[]
}

export type ReceiptStage =
  | 'ingest'
  | 'gemini-extract'
  | 'type-check'
  | 'patch-plan'
  | 'human-approval'
  | 'incremental-build'

export interface ExecutionReceipt {
  id: string
  stage: ReceiptStage
  actor: 'Gemini' | 'Deterministic rule engine' | 'Human reviewer' | 'Build engine'
  status: 'SUCCESS' | 'ATTENTION' | 'SKIPPED'
  at: string
  durationMs: number
  summary: string
  evidence?: string
}

/**
 * Where a CompileResult object was computed. Only the compiler API process may
 * label a result `server`; anything built inside the browser (initial preview or
 * the exact-fixture network-failure fallback) is `browser`; the command-line
 * compiler labels its results `cli`.
 */
export type ExecutionOrigin = 'server' | 'browser' | 'cli'

/** Which compile path produced a result. */
export type CompileMode = 'fixture' | 'custom'

export interface CompileResult {
  projectId: string
  projectName: string
  version: number
  decisionId: string
  gate: 'HOLD' | 'CONDITIONAL PILOT'
  provider: 'gemini-vertex' | 'gemini-api' | 'deterministic-demo'
  executionOrigin: ExecutionOrigin
  /** `fixture`: the bundled synthetic case through the canonical compiler; `custom`: user-supplied artifacts through the general compiler. */
  mode: CompileMode
  synthetic: boolean
  artifacts: SourceArtifact[]
  aiCandidates: CommitmentNode[]
  nodes: CommitmentNode[]
  edges: GraphEdge[]
  diagnostics: CompilerDiagnostic[]
  patch: SemanticPatch
  targets: CompiledTarget[]
  impact: CompileImpact
  receipts: ExecutionReceipt[]
  generatedAt: string
  compileToken?: string
}

export interface CompileRequest {
  artifacts?: SourceArtifact[]
}

export interface ApprovalRequest {
  version: number
  patchId: string
  compileToken?: string
  /** Required for custom-mode review: the server is stateless and recompiles the same artifacts. */
  artifacts?: SourceArtifact[]
}

export interface AiExtractionEvidence {
  provider: 'gemini-vertex' | 'gemini-api'
  model: string
  statementCount: number
  classifiedStatements: AiClassifiedStatement[]
  rawSummary: string
  durationMs: number
}

export interface AiClassifiedStatement {
  artifactId: string
  quote: string
  type: CommitmentNodeType
  confidence: number
}
