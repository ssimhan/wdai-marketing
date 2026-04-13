import { readFileSync } from 'fs'
import type { LumaEvent, LumaListResponse } from './types.js'

const BASE_URL = 'https://public-api.luma.com'
const FIXTURE_PATH = 'tools/calendar/__fixtures__/luma-events.json'

async function fetchPage(apiKey: string, cursor?: string): Promise<LumaListResponse> {
  const params = new URLSearchParams({ sort_direction: 'asc' })
  if (cursor) params.set('pagination_cursor', cursor)

  const res = await fetch(`${BASE_URL}/v1/calendar/list-events?${params}`, {
    headers: { 'x-luma-api-key': apiKey },
    signal: AbortSignal.timeout(10_000),
  })

  if (!res.ok) throw new Error(`Luma API error: ${res.status} ${res.statusText}`)
  return res.json() as Promise<LumaListResponse>
}

export async function fetchAllEvents(): Promise<LumaEvent[]> {
  // Mock mode — use fixture
  if (process.env.LUMA_MOCK === 'true') {
    const raw = readFileSync(FIXTURE_PATH, 'utf-8')
    const data = JSON.parse(raw) as LumaListResponse
    return data.entries
  }

  // Real API mode
  const apiKey = process.env.LUMA_API_KEY
  if (!apiKey) throw new Error('LUMA_API_KEY is not set. Use LUMA_MOCK=true for local runs.')

  const all: LumaEvent[] = []
  let cursor: string | undefined

  do {
    const page = await fetchPage(apiKey, cursor)
    all.push(...page.entries)
    cursor = page.next_cursor ?? undefined
  } while (cursor)

  return all
}
