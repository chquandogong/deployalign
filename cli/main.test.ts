import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { main } from './main'

const run = async (argv: string[]) => {
  let out = ''
  let err = ''
  const code = await main(argv, { out: (t) => { out += t }, err: (t) => { err += t }, now: () => '2026-08-26T06:00:00.000Z' })
  return { code, out, err }
}

const corpusDir = () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'deployalign-cli-'))
  writeFileSync(path.join(dir, 'customer-note.txt'), 'We need leak detection across the plant. The main corridor is about 900 mm wide.')
  writeFileSync(path.join(dir, 'sales-proposal.md'), 'The system will detect any leaked material in every zone of the plant autonomously. Acceptance is full coverage.')
  writeFileSync(path.join(dir, 'engineering-review.md'), 'Lab evidence covers three named analytes. Eight critical zones are mapped. Recommend supervised operation and a blind analyte test before any gate.')
  return dir
}

describe('deployalign CLI', () => {
  it('prints usage and version', async () => {
    expect((await run([])).out).toContain('Usage:')
    expect((await run(['--version'])).out).toMatch(/^\d+\.\d+\.\d+/)
    const bad = await run(['frobnicate'])
    expect(bad.code).toBe(1)
    expect(bad.err).toContain('Unknown command')
  })

  it('compiles a directory by file-name role, writes outputs, and fails the verdict on blockers', async () => {
    const dir = corpusDir()
    const out = path.join(dir, 'out')
    const result = await run(['compile', dir, '--out', out])
    expect(result.code).toBe(2)
    expect(result.out).toContain('gate HOLD')
    expect(result.out).toContain('✗ DA-001 UNBOUNDED_SCOPE')
    expect(result.out).toContain('analyte scope: any leaked material → three named analytes')
    expect(result.out).toContain('verdict: FAIL (--fail-on blocker)')
    for (const file of ['result.json', 'report.md', 'customer-decision-memo.md', 'sales-sow.md', 'engineering-test-manifest.md']) {
      expect(existsSync(path.join(out, file)), file).toBe(true)
    }
    const json = JSON.parse(readFileSync(path.join(out, 'result.json'), 'utf8')) as { mode: string; executionOrigin: string; artifacts: Array<{ id: string; title: string }> }
    expect(json.mode).toBe('custom')
    expect(json.executionOrigin).toBe('cli')
    expect(json.artifacts.map((a) => a.title)).toEqual(['customer-note.txt', 'sales-proposal.md', 'engineering-review.md'])
    expect(readFileSync(path.join(out, 'sales-sow.md'), 'utf8')).toContain('## SOW-3.2 · Scope clause')
  })

  it('honours --fail-on and --approved', async () => {
    const dir = corpusDir()
    expect((await run(['compile', dir, '--fail-on', 'none', '--quiet'])).code).toBe(0)
    const approved = await run(['compile', dir, '--approved', '--fail-on', 'warning'])
    expect(approved.code).toBe(2) // DA-004 warning and DA-006 blocker stay open after review
    expect(approved.out).toContain('gate CONDITIONAL PILOT')
    expect(approved.out).toContain('nothing was recorded anywhere')
  })

  it('accepts explicit role files and an artifacts JSON', async () => {
    const dir = corpusDir()
    const explicit = await run(['compile', '--customer', path.join(dir, 'customer-note.txt'), '--sales', path.join(dir, 'sales-proposal.md'), '--engineering', path.join(dir, 'engineering-review.md'), '--json', '--fail-on', 'none'])
    expect(explicit.code).toBe(0)
    expect(JSON.parse(explicit.out).diagnostics.map((d: { code: string }) => d.code)).toContain('DA-002')

    const jsonFile = path.join(dir, 'artifacts.json')
    writeFileSync(jsonFile, JSON.stringify([
      { role: 'customer', content: 'We need leak detection across the plant. The main corridor is about 900 mm wide.' },
      { role: 'sales', content: 'Phase 1 covers eight mapped zones with three named analytes in supervised operation. Acceptance is detection of all three analytes at 95% recall in a blind test.' },
      { role: 'engineering', content: 'Lab evidence covers three named analytes. Eight critical zones are mapped. The corridor was measured at 900 mm.' },
    ]))
    const bounded = await run(['compile', '--artifacts', jsonFile])
    expect(bounded.code).toBe(0)
    expect(bounded.out).toContain('0 open blocker(s)')
  })

  it('reports missing roles and short files as input errors', async () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'deployalign-cli-'))
    writeFileSync(path.join(dir, 'customer.txt'), 'Only one document here, which is not enough.')
    const missing = await run(['compile', dir])
    expect(missing.code).toBe(1)
    expect(missing.err).toContain('Missing sales, engineering')
    writeFileSync(path.join(dir, 'sales.txt'), 'short')
    writeFileSync(path.join(dir, 'engineering.txt'), 'Recommend supervised operation and a blind test before any gate.')
    const short = await run(['compile', dir])
    expect(short.code).toBe(1)
    expect(short.err).toContain('at least 20 characters')
  })

  it('compiles the synthetic fixture with `demo`', async () => {
    const demo = await run(['demo'])
    expect(demo.code).toBe(2)
    expect(demo.out).toContain('Sub-fab Raman Inspection Pilot')
    expect(demo.out).toContain('fixture mode')
  })
})
