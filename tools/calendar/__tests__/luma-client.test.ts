import { describe, it, expect, afterEach } from 'vitest'
import { fetchAllEvents } from '../luma-client.js'

// Gate all tests behind flag — no live API calls in CI
const RUN_LIVE = process.env.LUMA_LIVE_TEST === 'true'

describe('fetchAllEvents (mock mode)', () => {
  afterEach(() => {
    delete process.env.LUMA_MOCK
  })

  it('returns entries from mock fixture when LUMA_MOCK=true', async () => {
    process.env.LUMA_MOCK = 'true'
    const entries = await fetchAllEvents()
    expect(entries.length).toBeGreaterThan(0)
    expect(entries[0].event.name).toBeTruthy()
  })
})

describe.skipIf(!RUN_LIVE)('fetchAllEvents (live API)', () => {
  it('returns entries from real Luma API', async () => {
    const entries = await fetchAllEvents()
    expect(entries).toBeInstanceOf(Array)
  })
})
