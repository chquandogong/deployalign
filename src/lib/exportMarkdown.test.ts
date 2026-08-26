import { describe, expect, it } from 'vitest'
import { compileDemo } from '../domain/compiler'
import { resultToMarkdown, safeFilename } from './exportMarkdown'

describe('Markdown export', () => {
  it('renders gate, diagnostics, patch, targets and source map', () => {
    const markdown = resultToMarkdown(compileDemo({ approved: true, now: '2026-08-26T06:00:00.000Z' }))
    expect(markdown).toContain('# Sub-fab Raman Inspection Pilot — baseline v2')
    expect(markdown).toContain('Gate: **CONDITIONAL PILOT**')
    expect(markdown).toContain('**DA-006 OPEN_CRITICAL_TEST_BLOCKS_GATE** (BLOCKER)')
    expect(markdown).toContain('| analyte scope | all materials | five named analytes |')
    expect(markdown).toContain('### SOW-3.2 · Scope clause (recompiled)')
    expect(markdown).toContain('| COM-006 | SalesCommitment | INVALIDATED | SRC-SALES-02 |')
    expect(markdown).toContain('Synthetic demonstration data.')
  })

  it('builds safe file names', () => {
    expect(safeFilename('Custom review · a1b2c3d4', 'md')).toBe('custom-review-a1b2c3d4.md')
    expect(safeFilename('///', 'json')).toBe('deployalign.json')
  })
})
