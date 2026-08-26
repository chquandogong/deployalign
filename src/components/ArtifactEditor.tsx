import { FileText, Play, RotateCcw } from 'lucide-react'
import type { SourceArtifact } from '../domain/types'

const ROLE_COPY: Record<SourceArtifact['role'], { label: string; hint: string; tone: string }> = {
  customer: { label: 'Customer intent', hint: 'What the customer asked for, in their words.', tone: 'cyan' },
  sales: { label: 'Sales promise', hint: 'What the proposal or SOW draft commits to.', tone: 'amber' },
  engineering: { label: 'Engineering reality', hint: 'What evidence, constraints and open tests exist.', tone: 'blue' },
}

export const MAX_ARTIFACT_CHARS = 8_000

export function ArtifactEditor({
  drafts,
  busy,
  onChange,
  onCompile,
  onReset,
}: {
  drafts: SourceArtifact[]
  busy: boolean
  onChange: (index: number, field: 'title' | 'content', value: string) => void
  onCompile: () => void
  onReset: () => void
}) {
  const ready = drafts.every((draft) => draft.content.trim().length >= 20 && draft.content.length <= MAX_ARTIFACT_CHARS)
  return (
    <section className="content-section editor-section" aria-labelledby="editor-title">
      <div className="section-heading">
        <div className="section-index">00</div>
        <div className="section-heading-copy">
          <p className="eyebrow">Your documents · local mode</p>
          <h2 id="editor-title">Paste your own three documents.</h2>
          <p>
            One customer note, one sales proposal, one engineering review. The compiler splits them into clauses,
            types each clause with lexical rules, runs the six diagnostics as detectors and derives a patch only
            from values that appear verbatim in the engineering text. Heuristics, not judgement: review every quote.
          </p>
        </div>
        <div className="section-aside">
          <span className="section-badge">USER-SUPPLIED INPUT · NOT SYNTHETIC</span>
        </div>
      </div>
      <div className="editor-grid">
        {drafts.map((draft, index) => {
          const copy = ROLE_COPY[draft.role]
          const over = draft.content.length > MAX_ARTIFACT_CHARS
          return (
            <article className="editor-card" data-tone={copy.tone} key={draft.id}>
              <div className="source-card-top">
                <div className="source-icon">
                  <FileText size={17} />
                </div>
                <div>
                  <span className="micro-label">{draft.role.toUpperCase()} / {draft.id}</span>
                  <h3>{copy.label}</h3>
                </div>
              </div>
              <label className="editor-field">
                <span>Title</span>
                <input
                  type="text"
                  value={draft.title}
                  maxLength={200}
                  onChange={(event) => onChange(index, 'title', event.target.value)}
                />
              </label>
              <label className="editor-field">
                <span>Text</span>
                <textarea
                  value={draft.content}
                  rows={9}
                  spellCheck={false}
                  placeholder={copy.hint}
                  onChange={(event) => onChange(index, 'content', event.target.value)}
                />
              </label>
              <div className="editor-meta" data-over={over}>
                <span>{copy.hint}</span>
                <span>
                  {draft.content.length.toLocaleString()} / {MAX_ARTIFACT_CHARS.toLocaleString()}
                </span>
              </div>
            </article>
          )
        })}
      </div>
      <div className="editor-actions">
        <button className="button button-ghost" type="button" onClick={onReset} disabled={busy}>
          <RotateCcw size={15} /> Reset to the synthetic case
        </button>
        <button className="button button-primary" type="button" onClick={onCompile} disabled={busy || !ready}>
          <Play size={15} fill="currentColor" /> Compile these documents
        </button>
        <small>
          Text is sent only to your own API process. It reaches Gemini only if that process runs with{' '}
          <code>ALLOW_LIVE_GEMINI=true</code>.
        </small>
      </div>
    </section>
  )
}
