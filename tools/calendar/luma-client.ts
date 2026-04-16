import { readFileSync, writeFileSync, existsSync, statSync } from 'fs'
import type { LumaEvent, LumaListResponse } from './types.js'

const BASE_URL    = 'https://public-api.luma.com'
const FIXTURE_PATH = 'tools/calendar/__fixtures__/luma-events.json'
const CACHE_PATH   = 'tools/calendar/__fixtures__/luma-events-cache.json'

/** Cache TTL in milliseconds (default: 1 hour). Override via LUMA_CACHE_TTL_MS env var. */
const CACHE_TTL_MS = Number(process.env.LUMA_CACHE_TTL_MS ?? 60 * 60 * 1000)

interface CacheFile {
  fetchedAt: string
  entries: LumaEvent[]
}

function readCache(): LumaEvent[] | null {
  if (!existsSync(CACHE_PATH)) return null
  const ageMs = Date.now() - statSync(CACHE_PATH).mtimeMs
  if (ageMs > CACHE_TTL_MS) return null
  const data = JSON.parse(readFileSync(CACHE_PATH, 'utf-8')) as CacheFile
  return data.entries
}

function writeCache(entries: LumaEvent[]): void {
  const payload: CacheFile = { fetchedAt: new Date().toISOString(), entries }
  writeFileSync(CACHE_PATH, JSON.stringify(payload, null, 2), 'utf-8')
}

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

export async function fetchAllEvents(opts: { force?: boolean } = {}): Promise<LumaEvent[]> {
  // Mock mode — use fixture
  if (process.env.LUMA_MOCK === 'true') {
    const raw = readFileSync(FIXTURE_PATH, 'utf-8')
    const data = JSON.parse(raw) as LumaListResponse
    return data.entries
  }

  // Cache hit (skipped if --force or LUMA_FORCE=true)
  const forceRefresh = opts.force ?? process.env.LUMA_FORCE === 'true'
  if (!forceRefresh) {
    const cached = readCache()
    if (cached) {
      console.log(`  Using cached Luma data from ${CACHE_PATH} (set LUMA_FORCE=true to bypass)`)
      return cached
    }
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

  writeCache(all)
  return all
}
