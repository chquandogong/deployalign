import { ThinkingLevel } from '@google/genai'
import { describe, expect, it } from 'vitest'
import { DEMO_ARTIFACTS } from '../src/domain/demo'
import { DEFAULT_GEMINI_MODEL, thinkingConfigFor, validateGeminiPayload } from './gemini'

const validPayload = () => ({
  classifiedStatements: [
    {
      artifactId: 'SRC-CUSTOMER-01',
      quote: 'identify all chemical leaks',
      type: 'CustomerObjective',
      confidence: 0.9,
    },
    {
      artifactId: 'SRC-SALES-02',
      quote: 'cover the entire facility',
      type: 'SalesCommitment',
      confidence: 0.95,
    },
    {
      artifactId: 'SRC-ENGINEERING-03',
      quote: 'five named analytes under controlled conditions',
      type: 'EngineeringConstraint',
      confidence: 1,
    },
  ],
  patchRationale: 'Bound the promise to the five-analyte evidence envelope.',
})

describe('Gemini model configuration', () => {
  it('defaults to a generally available Gemini 3 Flash model', () => {
    expect(DEFAULT_GEMINI_MODEL).toBe('gemini-3.7-flash')
  })

  it('uses the lowest thinking level for Gemini 3 models by default', () => {
    expect(thinkingConfigFor('gemini-3.7-flash')).toEqual({ thinkingLevel: ThinkingLevel.LOW })
    expect(thinkingConfigFor('gemini-3-flash-preview')).toEqual({
      thinkingLevel: ThinkingLevel.LOW,
    })
  })

  it('honours a valid GEMINI_THINKING_LEVEL override on Gemini 3 models', () => {
    expect(thinkingConfigFor('gemini-3.7-flash', 'HIGH')).toEqual({
      thinkingLevel: ThinkingLevel.HIGH,
    })
    expect(thinkingConfigFor('gemini-3.7-flash', ' medium ')).toEqual({
      thinkingLevel: ThinkingLevel.MEDIUM,
    })
    expect(thinkingConfigFor('gemini-3.7-flash', 'turbo')).toEqual({
      thinkingLevel: ThinkingLevel.LOW,
    })
  })

  it('keeps thinking disabled through a numeric budget on Gemini 2.5 models', () => {
    expect(thinkingConfigFor('gemini-2.5-flash')).toEqual({ thinkingBudget: 0 })
    expect(thinkingConfigFor('gemini-2.5-flash', 'high')).toEqual({ thinkingBudget: 0 })
  })
})

describe('Gemini payload validation', () => {
  it('accepts three grounded, typed, bounded statements and a rationale', () => {
    const validated = validateGeminiPayload(validPayload(), DEMO_ARTIFACTS)

    expect(validated.statements).toHaveLength(3)
    expect(validated.statements.map((item) => item.artifactId)).toEqual([
      'SRC-CUSTOMER-01',
      'SRC-SALES-02',
      'SRC-ENGINEERING-03',
    ])
    expect(validated.rationale).toBe('Bound the promise to the five-analyte evidence envelope.')
  })

  it('rejects a quote that is not an exact substring of its artifact', () => {
    const payload = validPayload()
    payload.classifiedStatements[0]!.quote = 'identify every chemical leak'

    expect(() => validateGeminiPayload(payload, DEMO_ARTIFACTS)).toThrow(
      'failed source-map validation',
    )
  })

  it('rejects a disallowed semantic type', () => {
    const payload = validPayload()
    payload.classifiedStatements[1]!.type = 'PricingPromise'

    expect(() => validateGeminiPayload(payload, DEMO_ARTIFACTS)).toThrow(
      'failed source-map validation',
    )
  })

  it('rejects confidence outside [0, 1]', () => {
    const payload = validPayload()
    payload.classifiedStatements[2]!.confidence = 1.2

    expect(() => validateGeminiPayload(payload, DEMO_ARTIFACTS)).toThrow(
      'failed source-map validation',
    )
  })

  it('requires every artifact to be covered after de-duplication', () => {
    const payload = validPayload()
    payload.classifiedStatements[2] = { ...payload.classifiedStatements[0]! }

    expect(() => validateGeminiPayload(payload, DEMO_ARTIFACTS)).toThrow(
      'failed source-map validation',
    )
  })

  it('rejects a missing or oversized rationale', () => {
    const missing = validPayload()
    missing.patchRationale = '   '
    expect(() => validateGeminiPayload(missing, DEMO_ARTIFACTS)).toThrow(
      'rationale failed validation',
    )

    const oversized = validPayload()
    oversized.patchRationale = 'x'.repeat(1_001)
    expect(() => validateGeminiPayload(oversized, DEMO_ARTIFACTS)).toThrow(
      'rationale failed validation',
    )
  })

  it('rejects an empty payload', () => {
    expect(() => validateGeminiPayload({}, DEMO_ARTIFACTS)).toThrow(
      'failed source-map validation',
    )
  })
})
