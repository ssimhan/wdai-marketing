import { describe, it, expect } from 'vitest'
import { loadPromoRules, loadOverrides } from '../rules-loader.js'

describe('loadPromoRules', () => {
  it('returns empty object for a non-existent file', () => {
    const rules = loadPromoRules('tools/calendar/__fixtures__/nonexistent.yaml')
    expect(rules).toEqual({})
  })

  it('parses a valid rules file', () => {
    const rules = loadPromoRules('tools/calendar/__fixtures__/test-rules.yaml')
    expect(rules['ai-basics']?.dri).toBe('Sheena')
    expect(rules['ai-basics']?.moments[0].channel).toBe('linkedin-wdai')
    expect(rules['ai-basics']?.moments[0].days_before).toBe(14)
  })
})

describe('loadOverrides', () => {
  it('returns empty object for a non-existent file', () => {
    expect(loadOverrides('tools/calendar/__fixtures__/nonexistent.yaml')).toEqual({})
  })

  it('parses a valid overrides file', () => {
    const ov = loadOverrides('tools/calendar/__fixtures__/test-overrides.yaml')
    expect(ov['evt-001']?.dri).toBe('Helen')
  })
})
