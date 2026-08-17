import { describe, expect, it } from 'vitest'
import { changedSectionCount, compileDemo, unresolvedBlockerCount } from './compiler'

const fixedNow = '2026-08-17T06:00:00.000Z'

describe('DeployAlign deterministic compiler', () => {
  it('emits the expected blockers before approval', () => {
    const result = compileDemo({ now: fixedNow })

    expect(result.gate).toBe('HOLD')
    expect(unresolvedBlockerCount(result)).toBe(4)
    expect(result.diagnostics.map((item) => item.code)).toEqual([
      'DA-001',
      'DA-002',
      'DA-003',
      'DA-004',
      'DA-005',
      'DA-006',
    ])
  })

  it('keeps every diagnostic source quote grounded in an input artifact', () => {
    const result = compileDemo({ now: fixedNow })

    for (const diagnostic of result.diagnostics) {
      for (const reference of diagnostic.sourceRefs) {
        const artifact = result.artifacts.find((item) => item.id === reference.artifactId)
        expect(artifact, reference.artifactId).toBeDefined()
        expect(artifact?.content).toContain(reference.quote)
      }
    }
  })

  it('proposes only the three bounded scope changes', () => {
    const result = compileDemo({ now: fixedNow })

    expect(result.patch.status).toBe('PROPOSED')
    expect(result.patch.changes).toHaveLength(3)
    expect(result.patch.changes.map((change) => change.field)).toEqual([
      'analyte scope',
      'coverage',
      'operating mode',
    ])
  })

  it('requires human approval before advancing the baseline', () => {
    const before = compileDemo({ now: fixedNow })
    const after = compileDemo({ approved: true, now: fixedNow })

    expect(before.version).toBe(1)
    expect(before.patch.status).toBe('PROPOSED')
    expect(after.version).toBe(2)
    expect(after.patch.status).toBe('APPROVED')
    expect(after.gate).toBe('CONDITIONAL PILOT')
    expect(after.gate).not.toBe('PASS')
    expect(after.diagnostics.find((item) => item.code === 'DA-006')?.resolved).toBe(false)
  })

  it('recompiles affected sections while preserving unrelated hashes', () => {
    const before = compileDemo({ now: fixedNow })
    const after = compileDemo({ approved: true, now: fixedNow })
    const sectionsBefore = new Map(
      before.targets.flatMap((target) => target.sections).map((item) => [item.id, item]),
    )

    expect(changedSectionCount(after)).toBe(6)
    expect(after.impact.unchanged).toEqual(['CDM-3', 'SOW-7.1', 'SYS-009'])
    for (const id of after.impact.unchanged) {
      const sectionAfter = after.targets.flatMap((target) => target.sections).find((item) => item.id === id)
      expect(sectionAfter?.hash).toBe(sectionsBefore.get(id)?.hash)
      expect(sectionAfter?.changed).toBe(false)
    }
  })

  it('uses the same stable decision id across every affected target', () => {
    const result = compileDemo({ approved: true, now: fixedNow })

    for (const target of result.targets) {
      const changed = target.sections.filter((item) => item.changed)
      expect(changed.length).toBeGreaterThan(0)
      expect(changed.every((item) => item.decisionIds.includes(result.decisionId))).toBe(true)
    }
  })
})
