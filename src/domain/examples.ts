import type { SourceArtifact } from './types'

/**
 * The bundled example document sets, mirrored from `examples/` (a test asserts the
 * two stay identical). All content is synthetic. They load into the local-mode editor
 * so a pilot session can start from a known case before pasting real documents.
 */
export interface ExamplePreset {
  id: string
  label: string
  language: 'en' | 'ko'
  folder: string
  /** File names inside `examples/<folder>/`, in customer / sales / engineering order. */
  files: [string, string, string]
  expected: { verdict: 'FAIL' | 'PASS'; codes: string[] }
  artifacts: SourceArtifact[]
}

const at = '2026-08-26T00:00:00.000Z'

const set = (
  id: string,
  label: string,
  language: 'en' | 'ko',
  folder: string,
  files: [string, string, string],
  owners: [string, string, string],
  texts: [string, string, string],
  expected: ExamplePreset['expected'],
): ExamplePreset => ({
  id,
  label,
  language,
  folder,
  files,
  expected,
  artifacts: (['customer', 'sales', 'engineering'] as const).map((role, index) => ({
    id: `EX-${id.toUpperCase()}-${role.toUpperCase()}`,
    role,
    title: files[index],
    owner: owners[index],
    updatedAt: at,
    content: texts[index],
  })),
})

export const EXAMPLE_PRESETS: ExamplePreset[] = [
  set(
    'hospital',
    'Hospital delivery robot (EN · fails)',
    'en',
    'hospital-delivery-robot',
    ['customer-note.md', 'sales-proposal.md', 'engineering-review.md'],
    ['Nursing operations lead', 'Account executive', 'Deployment engineer'],
    [
      'We would like the robot to serve every ward on its own. Lift doors are roughly 900 mm wide.',
      'The delivery robot will serve every ward autonomously across the whole hospital. Delivery success is the acceptance criterion.',
      'Six wards are mapped and validated. Lift door width is customer-reported, not measured. Recommend attended operation for the first month and a route validation trial before go-live.',
    ],
    { verdict: 'FAIL', codes: ['DA-001', 'DA-002', 'DA-004', 'DA-005', 'DA-006'] },
  ),
  set(
    'warehouse',
    'Warehouse AMR fleet (EN · passes)',
    'en',
    'warehouse-amr',
    ['customer-note.md', 'sales-proposal.md', 'engineering-review.md'],
    ['Logistics manager', 'Solutions sales', 'Fleet engineer'],
    [
      'We want the AMR fleet to move pallets between dock 3 and the two staging lanes. The dock door is 2400 mm wide, measured on 2026-05-02. Peak demand is 40 pallets per hour.',
      'Phase 1 covers dock 3 and two staging lanes with three AMRs in supervised operation. Acceptance is 40 pallets per hour sustained for 2 hours with zero safety stops. Pricing follows the attached schedule.',
      'Fleet tests achieved 42 pallets per hour over 3 hours on the same route. Door width was measured at 2400 mm. Supervised operation is recommended for the first two weeks. The route survey was completed on 2026-05-02.',
    ],
    { verdict: 'PASS', codes: [] },
  ),
  set(
    'raman-ko',
    '서브팹 라만 검사 파일럿 (KO · 실패)',
    'ko',
    'sub-fab-raman-ko',
    ['고객-메모.md', '영업-제안서.md', '엔지니어링-리뷰.md'],
    ['설비 공정 책임자', '솔루션 영업', '로봇 응용 엔지니어'],
    [
      '서브팹의 모든 구역에서 모든 화학 누출을 완전 자율로 식별하는 사족 사륜 로봇이 필요합니다. 가장 좁은 통로는 약 800 mm입니다. 파일럿으로 전체 개념을 증명하기를 원합니다.',
      '1단계 배포는 시설 전체를 커버하고 라만 센싱으로 모든 누출 물질을 자율적으로 식별합니다. 사족 사륜 플랫폼은 필수 구성으로 납품됩니다. 인수 기준은 성공적인 자율 커버리지입니다.',
      '현재 라만 근거는 통제된 조건에서 다섯 가지 명명된 분석 물질을 커버합니다. 프로브 작동 거리는 10 mm입니다. 12곳의 핵심 구역이 매핑되었습니다. 전 구역 접근은 미실측입니다. 800 mm 통로 폭은 고객 진술이며 실측되지 않았습니다. 감독 하의 1단계 운영과 파일럿 게이트 전 블라인드 5종 분석 테스트를 권고합니다.',
    ],
    { verdict: 'FAIL', codes: ['DA-001', 'DA-002', 'DA-003', 'DA-004', 'DA-005', 'DA-006'] },
  ),
]
