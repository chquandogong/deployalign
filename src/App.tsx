import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  Braces,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  FileCheck2,
  FileText,
  Fingerprint,
  GitCompareArrows,
  GitMerge,
  Info,
  Layers3,
  Link2,
  LoaderCircle,
  LockKeyhole,
  Network,
  Play,
  ShieldAlert,
  ShieldCheck,
  TerminalSquare,
  Undo2,
  UserCheck,
  Waypoints,
  X,
  XCircle,
} from 'lucide-react'
import './App.css'
import { changedSectionCount, compileDemo, unresolvedBlockerCount } from './domain/compiler'
import { DEMO_ARTIFACTS, DEMO_PROJECT } from './domain/demo'
import type {
  CommitmentNode,
  CompileResult,
  CompiledTarget,
  CompilerDiagnostic,
  ExecutionReceipt,
  SourceArtifact,
} from './domain/types'
import { ApiError, approveProject, compileProject } from './lib/compileClient'

type BusyAction = 'compile' | 'approve' | null
type ReviewState = 'pending' | 'approved' | 'rejected'
type TraceTab = 'sources' | 'receipts'

const pause = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration))

const roleMeta: Record<
  SourceArtifact['role'],
  { label: string; short: string; tone: string }
> = {
  customer: { label: 'Customer intent', short: 'CUSTOMER', tone: 'cyan' },
  sales: { label: 'Sales promise', short: 'SALES', tone: 'amber' },
  engineering: { label: 'Engineering reality', short: 'ENGINEERING', tone: 'blue' },
}

const formatTimestamp = (value: string) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value))

const providerLabel = (result: CompileResult) => {
  if (result.provider === 'deterministic-demo') return 'Deterministic fixture fallback'
  if (result.provider === 'gemini-vertex') return 'Gemini via Vertex AI'
  return 'Gemini API'
}

const errorMessage = (error: unknown) => {
  if (error instanceof ApiError) return `Compiler API ${error.status}: ${error.message}`
  if (error instanceof DOMException && error.name === 'AbortError') {
    return 'The compiler timed out. Nothing was changed.'
  }
  return 'The compiler could not be reached. Nothing was changed.'
}

const nodeState = (node: CommitmentNode, diagnostics: CompilerDiagnostic[]) => {
  const hasBlocker = diagnostics.some(
    (item) =>
      !item.resolved && item.severity === 'BLOCKER' && item.nodeIds.includes(node.id),
  )
  const hasWarning = diagnostics.some(
    (item) =>
      !item.resolved && item.severity === 'WARNING' && item.nodeIds.includes(node.id),
  )
  if (node.status === 'INVALIDATED') return 'invalidated'
  if (hasBlocker) return 'blocked'
  if (hasWarning || node.status === 'OPEN') return 'attention'
  if (node.status === 'APPROVED' || node.status === 'PASS') return 'approved'
  return 'grounded'
}

function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  )
}

function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  aside,
}: {
  index: string
  eyebrow: string
  title: string
  description: string
  aside?: React.ReactNode
}) {
  return (
    <div className="section-heading">
      <div className="section-index">{index}</div>
      <div className="section-heading-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {aside ? <div className="section-aside">{aside}</div> : null}
    </div>
  )
}

function SourceCard({ artifact }: { artifact: SourceArtifact }) {
  const meta = roleMeta[artifact.role]
  return (
    <article className="source-card" data-tone={meta.tone}>
      <div className="source-card-top">
        <div className="source-icon">
          <FileText size={17} />
        </div>
        <div>
          <span className="micro-label">{meta.short} / SYNTHETIC</span>
          <h3>{meta.label}</h3>
        </div>
        <CheckCircle2 className="source-check" size={17} aria-label="Loaded" />
      </div>
      <blockquote>“{artifact.content}”</blockquote>
      <div className="source-card-meta">
        <span>{artifact.title}</span>
        <span>{formatTimestamp(artifact.updatedAt)}</span>
      </div>
      <div className="source-card-footer">
        <span>{artifact.owner}</span>
        <span className="id-chip">{artifact.id}</span>
      </div>
    </article>
  )
}

function NodeCard({
  node,
  diagnostics,
  active,
  onSelect,
}: {
  node: CommitmentNode
  diagnostics: CompilerDiagnostic[]
  active: boolean
  onSelect: () => void
}) {
  const state = nodeState(node, diagnostics)
  return (
    <button
      type="button"
      className={`graph-node ${active ? 'is-active' : ''}`}
      data-state={state}
      onClick={onSelect}
      aria-pressed={active}
    >
      <span className="node-topline">
        <span className="node-type">{node.type}</span>
        <span className="node-id">{node.id}</span>
      </span>
      <strong>{node.label}</strong>
      <span className="node-value">{node.value}</span>
      <span className="node-status">
        <CircleDot size={11} /> {node.status.replace('_', ' ')}
      </span>
    </button>
  )
}

function DiagnosticCard({
  item,
  active,
  onSelect,
}: {
  item: CompilerDiagnostic
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      className={`diagnostic-card ${active ? 'is-active' : ''}`}
      data-severity={item.severity.toLowerCase()}
      data-resolved={item.resolved}
      onClick={onSelect}
      aria-pressed={active}
    >
      <span className="diagnostic-icon">
        {item.resolved ? <Check size={15} /> : <AlertTriangle size={15} />}
      </span>
      <span className="diagnostic-content">
        <span className="diagnostic-code">
          {item.code} · {item.severity} {item.resolved ? '· RESOLVED' : ''}
        </span>
        <strong>{item.title}</strong>
        <span>{item.message}</span>
        <span className="diagnostic-link">
          <Link2 size={12} /> {item.nodeIds.join(' + ')}
        </span>
      </span>
      <ChevronRight size={15} className="diagnostic-chevron" />
    </button>
  )
}

function ReceiptRow({ receipt, synthetic }: { receipt: ExecutionReceipt; synthetic: boolean }) {
  const aiInFixture = synthetic && receipt.actor === 'Gemini'
  return (
    <div className="receipt-row">
      <div className="receipt-rail">
        <span data-status={receipt.status.toLowerCase()} />
      </div>
      <div className="receipt-main">
        <div className="receipt-heading">
          <span className="id-chip">{receipt.id}</span>
          <strong>{receipt.actor}</strong>
          <span className="receipt-status">{receipt.status}</span>
        </div>
        <p>{receipt.summary}</p>
        {receipt.evidence ? <code>{receipt.evidence}</code> : null}
        <div className="receipt-meta">
          <span>{receipt.stage}</span>
          <span>{receipt.durationMs} ms</span>
          {aiInFixture ? <span>synthetic fixture context</span> : null}
        </div>
      </div>
    </div>
  )
}

function TargetDocument({ target, decisionId, version }: {
  target: CompiledTarget
  decisionId: string
  version: number
}) {
  return (
    <article className="target-document">
      <header className="document-header">
        <div>
          <span className="micro-label">COMPILED TARGET / BASELINE V{version}</span>
          <h3>{target.title}</h3>
          <p>Audience: {target.audience}</p>
        </div>
        <div className="document-stamp">
          <Fingerprint size={16} />
          <span>Decision ID</span>
          <strong>{decisionId}</strong>
        </div>
      </header>
      <div className="document-status-row">
        <span>{target.status}</span>
        <span>{target.sections.length} sections</span>
        <span>Source-linked</span>
      </div>
      <div className="document-body">
        {target.sections.map((section) => (
          <section key={section.id} className="document-section" data-changed={section.changed}>
            <div className="document-section-index">{section.id}</div>
            <div>
              <div className="document-section-title">
                <h4>{section.heading}</h4>
                <span className={section.changed ? 'changed' : 'unchanged'}>
                  {section.changed ? 'RECOMPILED' : 'UNCHANGED'}
                </span>
              </div>
              <p>{section.body}</p>
              <div className="document-section-meta">
                <span>change fingerprint {section.hash}</span>
                {section.decisionIds.map((id) => (
                  <span key={id}>{id}</span>
                ))}
                {section.sourceNodeIds.map((id) => (
                  <span key={id}>{id}</span>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}

function App() {
  const [result, setResult] = useState<CompileResult>(() => compileDemo())
  const [busy, setBusy] = useState<BusyAction>(null)
  const [review, setReview] = useState<ReviewState>('pending')
  const [selectedNodeId, setSelectedNodeId] = useState('COM-006')
  const [selectedDiagnostic, setSelectedDiagnostic] = useState('DA-001')
  const [activeTargetId, setActiveTargetId] = useState('TARGET-SALES')
  const [traceTab, setTraceTab] = useState<TraceTab>('sources')
  const [notice, setNotice] = useState<string | null>(null)

  const selectedNode =
    result.nodes.find((node) => node.id === selectedNodeId) ?? result.nodes[0]
  const selectedTarget =
    result.targets.find((target) => target.id === activeTargetId) ?? result.targets[0]
  const selectedEdges = useMemo(
    () =>
      selectedNode
        ? result.edges.filter(
            (edge) => edge.from === selectedNode.id || edge.to === selectedNode.id,
          )
        : [],
    [result, selectedNode],
  )
  const blockers = unresolvedBlockerCount(result)
  const resolvedCount = result.diagnostics.filter((item) => item.resolved).length

  const graphGroups = useMemo(
    () => [
      {
        label: 'Intent & promise',
        nodes: result.nodes.filter((node) =>
          ['CustomerObjective', 'CustomerPreference', 'SalesCommitment'].includes(node.type),
        ),
      },
      {
        label: 'Constraint & evidence',
        nodes: result.nodes.filter((node) =>
          ['EngineeringConstraint', 'SiteClaim', 'Assumption', 'Evidence'].includes(node.type),
        ),
      },
      {
        label: 'Test, decision & gate',
        nodes: result.nodes.filter((node) =>
          ['VerificationTest', 'ScopeClause', 'Decision', 'DeploymentGate'].includes(node.type),
        ),
      },
    ],
    [result],
  )

  const impactRows = useMemo(() => {
    const baseline = result.version === 1 ? result : compileDemo({ artifacts: result.artifacts })
    const approved =
      result.version > 1 ? result : compileDemo({ approved: true, artifacts: result.artifacts })
    const rows = approved.targets.flatMap((target) =>
      target.sections.map((section) => {
        const before = baseline.targets
          .find((item) => item.id === target.id)
          ?.sections.find((item) => item.id === section.id)
        const state = approved.impact.recompiled.includes(section.id)
          ? 'recompiled'
          : approved.impact.unchanged.includes(section.id)
            ? 'unchanged'
            : section.changed
              ? 'changed'
              : 'unchanged'
        return {
          target: target.title,
          section: `${section.id} · ${section.heading}`,
          state,
          beforeHash: before?.hash ?? '—',
          afterHash: section.hash,
        }
      }),
    )
    return [
      ...approved.impact.changed.map((item) => ({
        target: 'Canonical graph',
        section: item,
        state: 'changed',
        beforeHash: 'graph.v1',
        afterHash: 'graph.v2',
      })),
      ...approved.impact.invalidated.map((item) => ({
        target: 'Prior baseline',
        section: item,
        state: 'invalidated',
        beforeHash: 'active',
        afterHash: 'invalid',
      })),
      ...rows,
    ]
  }, [result])

  const runCompile = async () => {
    setBusy('compile')
    setNotice(null)
    try {
      const [next] = await Promise.all([compileProject(DEMO_ARTIFACTS), pause(650)])
      setResult(next)
      setReview(next.patch.status === 'APPROVED' ? 'approved' : 'pending')
      setSelectedNodeId(next.nodes.find((node) => node.type === 'SalesCommitment')?.id ?? next.nodes[0]?.id ?? '')
      setSelectedDiagnostic(next.diagnostics[0]?.code ?? '')
      setNotice(
        next.provider === 'deterministic-demo'
          ? 'Compiled with the deterministic fixed-fixture path. No external data or systems changed.'
          : `Compile complete using ${providerLabel(next)}.`,
      )
    } catch (error) {
      setNotice(errorMessage(error))
    } finally {
      setBusy(null)
    }
  }

  const approve = async () => {
    setBusy('approve')
    setNotice(null)
    try {
      const [next] = await Promise.all([approveProject(result), pause(750)])
      setResult(next)
      setReview('approved')
      setSelectedNodeId(next.nodes.find((node) => node.type === 'ScopeClause')?.id ?? next.nodes[0]?.id ?? '')
      setNotice(
        'Demo approval recorded. The baseline advanced; no document was published or external system updated.',
      )
    } catch (error) {
      setNotice(errorMessage(error))
    } finally {
      setBusy(null)
    }
  }

  const reject = () => {
    setReview('rejected')
    setNotice('Patch rejected in this demo session. The canonical graph and target baseline remain unchanged.')
  }

  return (
    <div className="app-shell">
      <div className="honesty-strip" role="note">
        <Info size={14} />
        <strong>SYNTHETIC DEMO</strong>
        <span>
          Fictional sub-fab Raman case. No real customer, revenue, production deployment, or field-performance claim.
        </span>
      </div>

      <header className="topbar">
        <a href="#top" className="brand" aria-label="DeployAlign home">
          <BrandMark />
          <span className="brand-full">DEPLOY<span className="brand-slash">//</span>ALIGN</span>
          <span className="brand-short" aria-hidden="true">D<span className="brand-slash">//</span>A</span>
        </a>
        <div className="topbar-project">
          <span className="status-light" />
          <span>{DEMO_PROJECT.name}</span>
          <span className="topbar-divider" />
          <span>BASELINE V{result.version}</span>
        </div>
        <div className="topbar-actions">
          <span className="synthetic-chip">
            <ShieldCheck size={12} />
            <span className="synthetic-label">SYNTHETIC</span>
            <span className="synthetic-short" aria-hidden="true">SYN</span>
          </span>
          <span className="provider-badge" title={providerLabel(result)}>
            <TerminalSquare size={13} />
            <span className="provider-label">{providerLabel(result)}</span>
            <span className="provider-short">
              {result.provider === 'deterministic-demo' ? 'FALLBACK' : 'GEMINI'}
            </span>
            <span className="provider-micro" aria-hidden="true">
              {result.provider === 'deterministic-demo' ? 'DET' : 'AI'}
            </span>
          </span>
          <button className="button button-primary button-compact" type="button" onClick={runCompile} disabled={busy !== null}>
            {busy === 'compile' ? <LoaderCircle className="spin" size={15} /> : <Play size={15} fill="currentColor" />}
            {busy === 'compile' ? 'Compiling…' : 'Compile sources'}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="signal-bars" aria-hidden="true"><i /><i /><i /></span>
              Decision compiler for robotics deployment
            </div>
            <h1>Compile scattered promises into <em>testable commitments.</em></h1>
            <p className="hero-description">
              DeployAlign type-checks customer intent, sales promises, and engineering constraints—then proposes the smallest evidence-gated scope patch for a person to approve.
            </p>
            <div className="hero-actions">
              <button className="button button-primary button-large" type="button" onClick={runCompile} disabled={busy !== null}>
                {busy === 'compile' ? <LoaderCircle className="spin" size={17} /> : <Play size={17} fill="currentColor" />}
                {busy === 'compile' ? 'Running compiler…' : 'Run the synthetic case'}
              </button>
              <span><Clock3 size={14} /> Fixed fixture · no upload required</span>
            </div>
          </div>

          <aside className="gate-console" aria-label="Deployment gate status">
            <div className="console-header">
              <span><Activity size={14} /> PILOT GATE</span>
              <span className="live-indicator"><i /> EVALUATED</span>
            </div>
            <div className="gate-readout" data-gate={result.gate === 'HOLD' ? 'hold' : 'conditional'}>
              <span>CURRENT STATE</span>
              <strong>{result.gate}</strong>
              <p>{result.gate === 'HOLD' ? 'Human decision required' : 'Evidence gates remain explicit'}</p>
            </div>
            <div className="gate-transition">
              <span className={result.gate === 'HOLD' ? 'current' : 'complete'}>HOLD</span>
              <div className="transition-line"><ArrowRight size={15} /></div>
              <span className={result.gate === 'CONDITIONAL PILOT' ? 'current' : ''}>CONDITIONAL PILOT</span>
            </div>
            <div className="console-metrics">
              <div><strong>{blockers}</strong><span>open blockers</span></div>
              <div><strong>{result.nodes.length}</strong><span>typed nodes</span></div>
              <div><strong>{result.targets.length}</strong><span>synced targets</span></div>
            </div>
            <div className="decision-readout"><Fingerprint size={14} /><span>Decision ID</span><strong>{result.decisionId}</strong></div>
          </aside>
        </section>

        <div className="pipeline" aria-label="DeployAlign pipeline">
          {[
            ['01', '3 sources'],
            ['02', 'Typed graph'],
            ['03', 'Deterministic checks'],
            ['04', 'Semantic patch'],
            ['05', 'Human approval'],
            ['06', '3 targets'],
          ].map(([step, label], index) => (
            <div className="pipeline-step" key={step}>
              <span>{step}</span><strong>{label}</strong>{index < 5 ? <ChevronRight size={14} /> : null}
            </div>
          ))}
        </div>

        {notice ? (
          <div className="notice" role="status" aria-live="polite">
            <Info size={15} /><span>{notice}</span><button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message"><X size={14} /></button>
          </div>
        ) : null}

        <section className="content-section sources-section">
          <SectionHeading
            index="01"
            eyebrow="Source stack"
            title="Three truths enter the compiler."
            description="The demo fixture preserves each artifact verbatim, with role and provenance intact."
            aside={<span className="section-badge"><ShieldCheck size={14} /> FIXED SYNTHETIC INPUT</span>}
          />
          <div className="source-grid">
            {result.artifacts.map((artifact) => <SourceCard artifact={artifact} key={artifact.id} />)}
          </div>
        </section>

        <section className="content-section compiler-section" id="compiler-workbench">
          <SectionHeading
            index="02"
            eyebrow="Compiler workbench"
            title="Typed graph. Deterministic diagnostics."
            description="AI may structure source statements; explicit rules decide what blocks the deployment gate."
            aside={<span className="section-badge"><Braces size={14} /> {result.edges.length} TYPED EDGES</span>}
          />
          <div className="workbench-grid">
            <div className="graph-panel panel">
              <div className="panel-header">
                <div><Network size={15} /><span>COMMITMENT GRAPH</span></div>
                <span>SELECT A NODE TO TRACE</span>
              </div>
              <div className="graph-canvas">
                {graphGroups.map((group, groupIndex) => (
                  <div className="graph-column" key={group.label}>
                    <div className="graph-column-label"><span>0{groupIndex + 1}</span>{group.label}</div>
                    <div className="graph-node-stack">
                      {group.nodes.map((node) => (
                        <NodeCard
                          key={node.id}
                          node={node}
                          diagnostics={result.diagnostics}
                          active={selectedNode?.id === node.id}
                          onSelect={() => setSelectedNodeId(node.id)}
                        />
                      ))}
                    </div>
                    {groupIndex < graphGroups.length - 1 ? <div className="graph-connector" aria-hidden="true"><ArrowRight size={16} /></div> : null}
                  </div>
                ))}
              </div>
              {selectedNode ? (
                <div className="node-inspector">
                  <div className="inspector-title"><Waypoints size={15} /><span>NODE INSPECTOR</span><strong>{selectedNode.id}</strong></div>
                  <div className="inspector-grid">
                    <div><span>TYPE</span><strong>{selectedNode.type}</strong></div>
                    <div><span>STATUS</span><strong>{selectedNode.status}</strong></div>
                    <div><span>CONFIDENCE</span><strong>{selectedNode.confidence === undefined ? 'N/A' : selectedNode.confidence.toFixed(2)}</strong></div>
                    <div><span>SOURCES</span><strong>{selectedNode.sources.length}</strong></div>
                  </div>
                  <p>{selectedNode.value}</p>
                  {selectedNode.sources.map((source) => (
                    <button
                      type="button"
                      className="source-trace-link"
                      key={`${selectedNode.id}-${source.artifactId}-${source.quote}`}
                      onClick={() => {
                        setTraceTab('sources')
                        window.requestAnimationFrame(() =>
                          document
                            .getElementById('provenance')
                            ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
                        )
                      }}
                    >
                      <Link2 size={12} /> {source.artifactId} · L{source.line} · “{source.quote}”
                    </button>
                  ))}
                  <div className="inspector-relations" aria-label={`Typed relations for ${selectedNode.id}`}>
                    <span>RELATED TYPED EDGES</span>
                    {selectedEdges.length > 0 ? (
                      selectedEdges.map((edge) => {
                        const outbound = edge.from === selectedNode.id
                        return (
                          <div key={`${edge.from}-${edge.type}-${edge.to}`}>
                            <code>{outbound ? 'OUT' : 'IN'}</code>
                            <strong>{edge.type}</strong>
                            <span>{outbound ? edge.to : edge.from}</span>
                          </div>
                        )
                      })
                    ) : (
                      <small>No typed relations for this node.</small>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="diagnostics-panel panel">
              <div className="panel-header diagnostics-header">
                <div><ShieldAlert size={15} /><span>COMPILER DIAGNOSTICS</span></div>
                <span data-clear={blockers === 0}>{blockers === 0 ? `${resolvedCount} RESOLVED` : `BUILD BLOCKED · ${blockers}`}</span>
              </div>
              <div className="determinism-note"><GitMerge size={13} /> Same normalized graph → same codes and affected nodes.</div>
              <div className="diagnostic-list">
                {result.diagnostics.map((item) => (
                  <DiagnosticCard
                    key={item.code}
                    item={item}
                    active={selectedDiagnostic === item.code}
                    onSelect={() => {
                      setSelectedDiagnostic(item.code)
                      if (item.nodeIds[0]) setSelectedNodeId(item.nodeIds[0])
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="content-section patch-section">
          <SectionHeading
            index="03"
            eyebrow="Semantic patch"
            title="Shrink the promise to the evidence."
            description={result.patch.rationale}
            aside={<span className="section-badge"><GitCompareArrows size={14} /> {result.patch.id}</span>}
          />
          <div className="patch-grid">
            <div className="diff-panel panel">
              <div className="panel-header">
                <div><GitCompareArrows size={15} /><span>PROPOSED SEMANTIC DIFF</span></div>
                <span className={`patch-status ${review}`}>{review === 'approved' ? 'APPROVED · APPLIED' : review === 'rejected' ? 'REJECTED · NOT APPLIED' : 'CANDIDATE · NOT APPLIED'}</span>
              </div>
              <div className="diff-table" role="table" aria-label="Proposed semantic changes">
                <div className="diff-head" role="row">
                  <span role="columnheader">FIELD</span>
                  <span role="columnheader">BEFORE</span>
                  <span role="columnheader">AFTER</span>
                </div>
                {result.patch.changes.map((change) => (
                  <div className="diff-row" role="row" key={change.field}>
                    <strong role="cell" data-label="Field">{change.field}</strong>
                    <span role="cell" data-label="Before" className="diff-before"><i>−</i>{change.before}</span>
                    <span role="cell" data-label="After" className="diff-after"><i>+</i>{change.after}</span>
                  </div>
                ))}
              </div>
              <div className="patch-guardrail">
                <ShieldCheck size={16} />
                <div><strong>Conservative by construction</strong><span>No costs, dates, measurements, or performance thresholds invented.</span></div>
              </div>
              <div className="patch-meta">
                <span>Resolves <strong>{result.patch.resolves.length}</strong></span>
                <span>Retains <strong>{result.patch.retains.length}</strong> evidence gates</span>
                <span>Decision <strong>{result.patch.decisionId}</strong></span>
              </div>
            </div>

            <aside className={`approval-boundary panel ${review}`}>
              <div className="approval-lock"><LockKeyhole size={20} /></div>
              <span className="micro-label">HUMAN APPROVAL BOUNDARY</span>
              <h3>{review === 'approved' ? 'Demo approval recorded.' : review === 'rejected' ? 'Patch rejected. Baseline preserved.' : 'AI stops here.'}</h3>
              <p>
                {review === 'approved'
                  ? `Canonical graph advanced to baseline v${result.version}. No artifact was published.`
                  : review === 'rejected'
                    ? 'The candidate was not applied. Return it to review or compile the source stack again.'
                    : 'AI may propose this patch and preview impact. It cannot update the canonical graph or publish target documents.'}
              </p>
              <div className="approval-transition">
                <span data-state={result.gate === 'HOLD' ? 'active' : 'complete'}>HOLD</span><ArrowRight size={16} /><span data-state={result.gate === 'CONDITIONAL PILOT' ? 'active' : 'preview'}>CONDITIONAL PILOT</span>
              </div>
              {review === 'pending' ? (
                <div className="approval-actions">
                  <button className="button button-ghost" type="button" onClick={reject} disabled={busy !== null}><XCircle size={16} /> Reject patch</button>
                  <button className="button button-approve" type="button" onClick={approve} disabled={busy !== null}>
                    {busy === 'approve' ? <LoaderCircle className="spin" size={16} /> : <UserCheck size={16} />}
                    {busy === 'approve' ? 'Recording approval…' : 'Simulate approval & recompile'}
                  </button>
                </div>
              ) : review === 'rejected' ? (
                <button className="button button-ghost button-full" type="button" onClick={() => setReview('pending')}><Undo2 size={16} /> Return to review</button>
              ) : (
                <div className="approval-record"><CheckCircle2 size={17} /><span>HUMAN RECEIPT</span><strong>{result.decisionId} · BASELINE V{result.version}</strong></div>
              )}
              <small>Demo only: no person is contacted and nothing is published.</small>
            </aside>
          </div>
        </section>

        <section className="content-section impact-section">
          <SectionHeading
            index="04"
            eyebrow="Incremental build"
            title="Only affected sections move."
            description="Non-cryptographic change fingerprints (FNV-1a32) make selective invalidation and recompilation inspectable—not a narrative claim."
            aside={<span className="section-badge"><Layers3 size={14} /> {result.version > 1 ? changedSectionCount(result) : 'PREVIEW'} RECOMPILED</span>}
          />
          <div className="impact-legend" aria-label="Impact legend">
            <span data-state="changed"><i />Changed <small>canonical value updated</small></span>
            <span data-state="invalidated"><i />Invalidated <small>prior value no longer valid</small></span>
            <span data-state="recompiled"><i />Recompiled <small>dependent section rebuilt</small></span>
            <span data-state="unchanged"><i />Unchanged <small>fingerprint preserved</small></span>
            <strong>{result.version > 1 ? 'APPLIED IMPACT' : 'DETERMINISTIC PREVIEW'}</strong>
          </div>
          <div className="impact-table panel" role="table" aria-label="Incremental compile impact">
            <div className="impact-row impact-head" role="row">
              <span role="columnheader">TARGET</span>
              <span role="columnheader">SECTION / NODE</span>
              <span role="columnheader">IMPACT</span>
              <span role="columnheader">BEFORE</span>
              <span role="columnheader">AFTER</span>
            </div>
            {impactRows.map((row, index) => (
              <div className="impact-row" role="row" key={`${row.target}-${row.section}-${index}`}>
                <strong role="cell" data-label="Target">{row.target}</strong>
                <span role="cell" data-label="Section or node">{row.section}</span>
                <span role="cell" data-label="Impact" className="impact-chip" data-state={row.state}><i />{row.state}</span>
                <code role="cell" data-label="Before">{row.beforeHash}</code>
                <code role="cell" data-label="After">{row.afterHash}</code>
              </div>
            ))}
          </div>
        </section>

        <section className="content-section targets-section">
          <SectionHeading
            index="05"
            eyebrow="Synchronized targets"
            title="One decision. Three audience-specific views."
            description="Every compiled target carries the same stable Decision ID and traces back to typed source nodes."
            aside={<span className="decision-badge"><Fingerprint size={14} /> {result.decisionId}</span>}
          />
          <div className="target-tabs" role="group" aria-label="Compiled target documents">
            {result.targets.map((target) => (
              <button key={target.id} type="button" aria-pressed={selectedTarget?.id === target.id} onClick={() => setActiveTargetId(target.id)}>
                {target.kind === 'customer-decision-memo' ? <FileCheck2 size={16} /> : target.kind === 'sales-sow' ? <FileText size={16} /> : <ShieldCheck size={16} />}
                <span><strong>{target.title}</strong><small>{target.audience}</small></span>
                <span className="target-state">{target.status.startsWith('APPROVED') ? 'BASELINE' : 'DRAFT'}</span>
              </button>
            ))}
          </div>
          <div className="cross-target-strip">
            <CheckCircle2 size={15} />
            <strong>{result.version > 1 ? 'SHARED DECISION BASELINE' : 'SHARED DRAFT DECISION'}</strong>
            <span>All 3 targets reference {result.decisionId}</span>
            <span>Baseline v{result.version}</span>
          </div>
          {selectedTarget ? <TargetDocument target={selectedTarget} decisionId={result.decisionId} version={result.version} /> : null}
        </section>

        <section className="content-section provenance-section" id="provenance">
          <SectionHeading
            index="06"
            eyebrow="Provenance"
            title="Trace every claim and every action."
            description="Source maps show where commitments came from. Receipts separate AI proposals, rule checks, and human authority."
            aside={<span className="section-badge"><Fingerprint size={14} /> AUDITABLE DEMO RUN</span>}
          />
          <div className="trace-tabs" role="group" aria-label="Provenance view">
            <button type="button" aria-pressed={traceTab === 'sources'} onClick={() => setTraceTab('sources')}><Link2 size={15} /> Source map <span>{result.nodes.flatMap((node) => node.sources).length}</span></button>
            <button type="button" aria-pressed={traceTab === 'receipts'} onClick={() => setTraceTab('receipts')}><Bot size={15} /> AI / agent receipts <span>{result.receipts.length}</span></button>
          </div>
          <div className="trace-panel panel">
            {traceTab === 'sources' ? (
              <div className="source-map" role="group" aria-label="Node source traces">
                <div className="trace-table-head" aria-hidden="true">
                  <span>GRAPH NODE</span>
                  <span>SOURCE ARTIFACT</span>
                  <span>VERBATIM SOURCE SPAN</span>
                  <span>STATE</span>
                </div>
                {result.nodes.flatMap((node) =>
                  node.sources.map((source) => (
                    <button
                      type="button"
                      className="trace-row"
                      aria-pressed={selectedNodeId === node.id}
                      aria-label={`Trace ${node.id}, ${node.type}, to ${source.artifactId}, line ${source.line}. Source quote: ${source.quote}. Node status: ${node.status}.`}
                      key={`${node.id}-${source.artifactId}-${source.quote}`}
                      onClick={() => {
                        setSelectedNodeId(node.id)
                        window.requestAnimationFrame(() =>
                          document
                            .getElementById('compiler-workbench')
                            ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
                        )
                      }}
                    >
                      <span data-label="Graph node"><strong>{node.id}</strong><small>{node.type}</small></span>
                      <span data-label="Source artifact"><strong>{source.artifactId}</strong><small>line {source.line}</small></span>
                      <q data-label="Verbatim source span">{source.quote}</q>
                      <span data-label="State" className="trace-state"><i />{node.status}</span>
                    </button>
                  )),
                )}
              </div>
            ) : (
              <div className="receipts-list">
                <div className="receipt-context">
                  <Bot size={16} />
                  <div><strong>{providerLabel(result)}</strong><span>{result.provider === 'deterministic-demo' ? 'AI extraction was not called for this run. Displayed records are the compiler’s synthetic fixture receipts.' : 'AI-assisted extraction completed; deterministic rules and the human boundary remain separate.'}</span></div>
                </div>
                {result.receipts.map((receipt) => <ReceiptRow key={receipt.id} receipt={receipt} synthetic={result.provider === 'deterministic-demo'} />)}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand"><BrandMark /><strong>DEPLOY//ALIGN</strong><span>Evidence-gated presales compiler</span></div>
        <div className="footer-note"><ShieldCheck size={14} /> Synthetic run · local demo data · no external systems changed</div>
        <div className="footer-meta"><span>{result.decisionId}</span><span>BASELINE V{result.version}</span><span>{result.provider}</span></div>
      </footer>
    </div>
  )
}

export default App
