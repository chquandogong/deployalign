import type { SourceArtifact } from './types'

export const DEMO_PROJECT = {
  id: 'rsi-042',
  name: 'Sub-fab Raman Inspection Pilot',
  decisionId: 'DEC-014',
} as const

export const DEMO_ARTIFACTS: SourceArtifact[] = [
  {
    id: 'SRC-CUSTOMER-01',
    role: 'customer',
    title: 'Customer discovery email',
    owner: 'Facilities process owner',
    updatedAt: '2026-08-14T09:20:00.000Z',
    content:
      'We need a four-legged, four-wheeled robot that can identify all chemical leaks in every area of the sub-fab, fully autonomously. The narrowest aisle is about 800 mm. We want the pilot to prove the whole concept.',
  },
  {
    id: 'SRC-SALES-02',
    role: 'sales',
    title: 'Draft commercial proposal',
    owner: 'Solutions sales',
    updatedAt: '2026-08-15T02:10:00.000Z',
    content:
      'The Phase 1 deployment will cover the entire facility and autonomously identify any leaked material using Raman sensing. A quadruped-wheel platform will be delivered as the mandatory configuration. Acceptance is successful autonomous coverage.',
  },
  {
    id: 'SRC-ENGINEERING-03',
    role: 'engineering',
    title: 'Application engineering review',
    owner: 'Robotics application engineer',
    updatedAt: '2026-08-15T06:45:00.000Z',
    content:
      'Current Raman evidence covers five named analytes under controlled conditions. Probe working distance is 10 mm. Twelve critical AOIs are mapped; full-area access is unmeasured. The 800 mm aisle width is customer-reported, not surveyed. Recommend supervised Phase 1 and a blind five-analyte test before any pilot gate.',
  },
]
