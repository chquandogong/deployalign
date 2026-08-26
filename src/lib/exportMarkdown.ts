import type { CompileResult } from '../domain/types'

/** Renders a compile result as a reviewable Markdown document. Pure; no I/O. */
export const resultToMarkdown = (result: CompileResult): string => {
  const lines: string[] = []
  lines.push(`# ${result.projectName} — baseline v${result.version}`)
  lines.push('')
  lines.push(
    `> Gate: **${result.gate}** · Decision: \`${result.decisionId}\` · Provider: \`${result.provider}\` · Origin: \`${result.executionOrigin}\` · Mode: \`${result.mode}\` · Generated: ${result.generatedAt}`,
  )
  lines.push('')
  lines.push(
    result.synthetic
      ? '> Synthetic demonstration data. No customer, revenue, production or field-outcome claim.'
      : '> Heuristic review of user-supplied text. Every finding quotes its source; none is a safety, legal or contractual conclusion.',
  )
  lines.push('')
  lines.push('## Diagnostics')
  lines.push('')
  if (result.diagnostics.length === 0) lines.push('_No diagnostics._')
  for (const diagnostic of result.diagnostics) {
    lines.push(
      `- **${diagnostic.code} ${diagnostic.title}** (${diagnostic.severity}${diagnostic.resolved ? ', resolved' : ''}) — ${diagnostic.message}`,
    )
    for (const reference of diagnostic.sourceRefs) {
      lines.push(`  - ${reference.artifactId} L${reference.line}: “${reference.quote}”`)
    }
  }
  lines.push('')
  lines.push(`## Patch ${result.patch.id} (${result.patch.status})`)
  lines.push('')
  lines.push(result.patch.rationale)
  lines.push('')
  if (result.patch.changes.length > 0) {
    lines.push('| Field | Before | After |')
    lines.push('| --- | --- | --- |')
    for (const change of result.patch.changes) {
      lines.push(`| ${change.field} | ${change.before} | ${change.after} |`)
    }
    lines.push('')
  }
  if (result.patch.retains.length > 0) {
    lines.push(`Retained evidence gates: ${result.patch.retains.join('; ')}`)
    lines.push('')
  }
  for (const target of result.targets) {
    lines.push(`## ${target.title}`)
    lines.push('')
    lines.push(`_Audience: ${target.audience} · ${target.status}_`)
    lines.push('')
    for (const section of target.sections) {
      lines.push(`### ${section.id} · ${section.heading}${section.changed ? ' (recompiled)' : ''}`)
      lines.push('')
      lines.push(section.body)
      lines.push('')
      lines.push(
        `<sub>fingerprint ${section.hash}${section.decisionIds.length ? ` · decisions ${section.decisionIds.join(', ')}` : ''}${section.sourceNodeIds.length ? ` · sources ${section.sourceNodeIds.join(', ')}` : ''}</sub>`,
      )
      lines.push('')
    }
  }
  lines.push('## Source map')
  lines.push('')
  lines.push('| Node | Type | Status | Artifact | Line | Quote |')
  lines.push('| --- | --- | --- | --- | --- | --- |')
  for (const node of result.nodes) {
    for (const reference of node.sources) {
      lines.push(
        `| ${node.id} | ${node.type} | ${node.status} | ${reference.artifactId} | ${reference.line} | ${reference.quote.replace(/\|/g, '\\|')} |`,
      )
    }
  }
  lines.push('')
  return lines.join('\n')
}

export const safeFilename = (base: string, extension: string) =>
  `${base.replace(/[^a-z0-9-]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'deployalign'}.${extension}`
