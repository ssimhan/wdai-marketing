import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import type { LumaListResponse } from '../types.js'

describe('mock fixture', () => {
  it('fixture is valid LumaListResponse shape', () => {
    const raw = readFileSync('tools/calendar/__fixtures__/luma-events.json', 'utf-8')
    const data = JSON.parse(raw) as LumaListResponse
    expect(data.entries).toBeInstanceOf(Array)
    expect(data.entries.length).toBeGreaterThan(0)
    expect(data.entries[0].event.name).toBeTruthy()
    expect(data.entries[0].event.start_at).toMatch(/^\d{4}-\d{2}-\d{2}/)
  })
})
