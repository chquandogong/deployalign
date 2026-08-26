import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { EXAMPLE_PRESETS } from './examples'
import { compileGeneral } from './general/compile'

const root = path.resolve(__dirname, '..', '..')

describe('example presets', () => {
  it('mirror the files under examples/ exactly', () => {
    for (const preset of EXAMPLE_PRESETS) {
      preset.files.forEach((file, index) => {
        const onDisk = readFileSync(path.join(root, 'examples', preset.folder, file), 'utf8').trim()
        expect(preset.artifacts[index]!.content, `${preset.folder}/${file}`).toBe(onDisk)
      })
    }
  })

  it('compile to the documented verdicts', () => {
    for (const preset of EXAMPLE_PRESETS) {
      const result = compileGeneral({ artifacts: preset.artifacts, now: '2026-08-26T06:00:00.000Z' })
      expect(result.mode).toBe('custom')
      expect(result.diagnostics.map((d) => d.code), preset.id).toEqual(preset.expected.codes)
      const blockers = result.diagnostics.filter((d) => d.severity === 'BLOCKER' && !d.resolved).length
      expect(blockers > 0 ? 'FAIL' : 'PASS', preset.id).toBe(preset.expected.verdict)
    }
  })

  it('use ids that can never collide with the synthetic fixture', () => {
    const ids = EXAMPLE_PRESETS.flatMap((p) => p.artifacts.map((a) => a.id))
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.every((id) => id.startsWith('EX-'))).toBe(true)
  })
})
