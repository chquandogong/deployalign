import { describe, expect, it } from 'vitest'
import type { SourceArtifact } from '../types'
import { compileGeneral } from './compile'
import { extractStatements } from './extract'
import { classifyStatements } from './classify'
import { unboundedPhrases } from './text'

const fixedNow = '2026-08-26T06:00:00.000Z'
const artifact = (role: SourceArtifact['role'], content: string): SourceArtifact => ({
  id: `SRC-${role.toUpperCase()}`,
  role,
  title: `${role} document`,
  owner: role,
  updatedAt: '2026-08-20T00:00:00.000Z',
  content,
})

const grounded = (result: ReturnType<typeof compileGeneral>) => {
  for (const node of result.nodes) {
    for (const ref of node.sources) {
      expect(result.artifacts.find((a) => a.id === ref.artifactId)?.content, node.id).toContain(ref.quote)
    }
  }
  for (const d of result.diagnostics) {
    for (const ref of d.sourceRefs) {
      expect(result.artifacts.find((a) => a.id === ref.artifactId)?.content, d.code).toContain(ref.quote)
    }
  }
}

describe('corpus · drone inspection (bounded lists, stage labels, thresholds)', () => {
  const corpus = [
    artifact('customer', 'We want the drone to inspect all five flare stacks on the north site. The tallest stack is 42 m, per the 2024 survey.'),
    artifact('sales', 'Phase 2 covers all five flare stacks with two flights per week. Acceptance is detection of corrosion patches no smaller than 10 cm at 95% recall in a blind trial.'),
    artifact('engineering', 'Flight tests achieved 96% recall on 10 cm patches across the five stacks. Wind above 12 m/s grounds the drone. The 2024 stack survey was completed by the site team.'),
  ]
  const result = compileGeneral({ artifacts: corpus, now: fixedNow })

  it('does not treat "all five" or "Phase 2" as unbounded scope', () => {
    expect(unboundedPhrases('Phase 2 covers all five flare stacks with two flights per week.')).toEqual([])
    expect(result.diagnostics.find((d) => d.code === 'DA-001')).toBeUndefined()
    expect(result.diagnostics.find((d) => d.code === 'DA-002')).toBeUndefined()
  })

  it('accepts a measurable acceptance criterion and completed tests', () => {
    expect(result.diagnostics.find((d) => d.code === 'DA-005')).toBeUndefined()
    expect(result.diagnostics.find((d) => d.code === 'DA-006')).toBeUndefined()
    expect(result.diagnostics.map((d) => d.code)).toEqual([])
    grounded(result)
  })
})

describe('corpus · hospital delivery robot (unbounded coverage, hedged site claim)', () => {
  const corpus = [
    artifact('customer', 'We would like the robot to serve every ward on its own. Lift doors are roughly 900 mm wide.'),
    artifact('sales', 'The delivery robot will serve every ward autonomously across the whole hospital. Delivery success is the acceptance criterion.'),
    artifact('engineering', 'Six wards are mapped and validated. Lift door width is customer-reported, not measured. Recommend attended operation for the first month and a route validation trial before go-live.'),
  ]
  const result = compileGeneral({ artifacts: corpus, now: fixedNow })

  it('raises the full set and derives coverage and operating-mode replacements', () => {
    expect(result.diagnostics.map((d) => d.code)).toEqual(['DA-001', 'DA-002', 'DA-004', 'DA-005', 'DA-006'])
    const fields = Object.fromEntries(result.patch.changes.map((c) => [c.field, c.after]))
    expect(fields['coverage']).toBe('Six wards')
    expect(fields['operating mode']).toBe('attended operation')
    grounded(result)
  })

  it('keeps the hedged and customer-reported door width as one open site claim cluster', () => {
    const da004 = result.diagnostics.find((d) => d.code === 'DA-004')!
    expect(da004.nodeIds).toHaveLength(2)
    expect(da004.sourceRefs.map((r) => r.quote)).toEqual(['Lift door width is customer-reported, not measured.'])
  })
})

describe('corpus · Korean sub-fab Raman pilot (first-pass Korean cues)', () => {
  const corpus = [
    artifact('customer', '서브팹의 모든 구역에서 모든 화학 누출을 완전 자율로 식별하는 사족 사륜 로봇이 필요합니다. 가장 좁은 통로는 약 800 mm입니다. 파일럿으로 전체 개념을 증명하기를 원합니다.'),
    artifact('sales', '1단계 배포는 시설 전체를 커버하고 라만 센싱으로 모든 누출 물질을 자율적으로 식별합니다. 사족 사륜 플랫폼은 필수 구성으로 납품됩니다. 인수 기준은 성공적인 자율 커버리지입니다.'),
    artifact('engineering', '현재 라만 근거는 통제된 조건에서 다섯 가지 명명된 분석 물질을 커버합니다. 프로브 작동 거리는 10 mm입니다. 12곳의 핵심 구역이 매핑되었습니다. 전 구역 접근은 미실측입니다. 800 mm 통로 폭은 고객 진술이며 실측되지 않았습니다. 감독 하의 1단계 운영과 파일럿 게이트 전 블라인드 5종 분석 테스트를 권고합니다.'),
  ]
  const typed = classifyStatements(extractStatements(corpus))
  const result = compileGeneral({ artifacts: corpus, now: fixedNow })

  it('narrows the Korean platform preference to the wanted thing', () => {
    const customer = typed.filter((t) => t.statement.role === 'customer')
    expect(customer[0]).toMatchObject({ type: 'CustomerObjective' })
    expect(customer[1]).toMatchObject({ type: 'CustomerPreference', quote: '사족 사륜 로봇' })
  })

  it('splits Korean sentences and types them by role', () => {
    expect(extractStatements(corpus).filter((s) => s.role === 'engineering')).toHaveLength(6)
    const sales = typed.filter((t) => t.statement.role === 'sales')
    expect(sales[0]?.unbounded.map((p) => p.category).sort()).toEqual(['autonomy', 'coverage', 'scope'])
    expect(sales[0]?.unbounded.map((p) => p.phrase)).toEqual(['시설 전체', '모든 누출 물질', '자율적으로'])
    expect(sales[1]).toMatchObject({ type: 'SalesCommitment', flags: { mandatory: true } })
    expect(sales[2]).toMatchObject({ type: 'SalesCommitment', flags: { acceptance: true, hasThreshold: false } })
    const eng = typed.filter((t) => t.statement.role === 'engineering')
    expect(eng.map((t) => t.type)).toEqual(['Evidence', 'EngineeringConstraint', 'Evidence', 'Assumption', 'SiteClaim', 'VerificationTest', 'EngineeringConstraint'])
    expect(eng[0]?.enumerations[0]).toMatchObject({ value: 5, noun: '가지' })
    expect(eng[2]?.enumerations[0]).toMatchObject({ value: 12, noun: '곳' })
  })

  it('reproduces the six diagnostics and a verbatim Korean patch', () => {
    expect(result.diagnostics.map((d) => [d.code, d.severity])).toEqual([
      ['DA-001', 'BLOCKER'],
      ['DA-002', 'BLOCKER'],
      ['DA-003', 'WARNING'],
      ['DA-004', 'WARNING'],
      ['DA-005', 'BLOCKER'],
      ['DA-006', 'BLOCKER'],
    ])
    const fields = Object.fromEntries(result.patch.changes.map((c) => [c.field, c]))
    expect(fields['coverage']).toMatchObject({ before: '시설 전체', after: '12곳의 핵심 구역' })
    expect(fields['operating mode']).toMatchObject({ before: '자율적으로', after: '감독 하의 1단계 운영' })
    expect(Object.keys(fields).find((f) => f.endsWith(' scope'))).toBeDefined()
    expect(fields[Object.keys(fields).find((f) => f.endsWith(' scope'))!]?.after).toBe('다섯 가지 명명된 분석 물질')
    grounded(result)
    const approved = compileGeneral({ artifacts: corpus, approved: true, now: fixedNow })
    expect(approved.gate).toBe('CONDITIONAL PILOT')
    expect(approved.diagnostics.find((d) => d.code === 'DA-001')?.resolved).toBe(true)
    expect(approved.diagnostics.find((d) => d.code === 'DA-006')?.resolved).toBe(false)
  })
})

describe('corpus · negated quantifiers are bounded, not unbounded', () => {
  it('ignores "not every" and Korean clause-final negation', () => {
    expect(unboundedPhrases('We will not cover every ward in Phase 1; coverage is limited to six mapped wards.')).toEqual([])
    expect(unboundedPhrases('The robot does not serve all wards at night.')).toEqual([])
    expect(unboundedPhrases('1단계에서는 모든 구역을 커버하지 않습니다.')).toEqual([])
    expect(unboundedPhrases('The robot serves every ward.')).toHaveLength(1)
    expect(unboundedPhrases('1단계는 시설 전체를 커버합니다.')).toHaveLength(1)
  })

  it('raises nothing on a proposal that explicitly bounds its own scope', () => {
    const result = compileGeneral({
      artifacts: [
        artifact('customer', 'We would like the robot to serve the surgical wing first. Lift doors were measured at 900 mm by our facilities team.'),
        artifact('sales', 'Phase 1 will not cover every ward; it serves the six mapped surgical wards in attended operation. Acceptance is 95% on-time delivery over two weeks.'),
        artifact('engineering', 'Six wards are mapped and validated. Lift door width was measured at 900 mm. The route validation trial was completed on 2026-08-10.'),
      ],
      now: fixedNow,
    })
    expect(result.diagnostics.map((d) => d.code)).toEqual([])
  })
})
