# Plan: Phase 3, Block A — Luma Calendar Sync

**Date:** 2026-04-12
**Status:** Approved — ready to build

---

## Header

**Goal:** Build a TypeScript CLI script that fetches WDAI events from the Luma API and writes a structured `vault/content-calendar.md`, runnable locally and via a daily GitHub Actions cron job.

**Architecture:** Single-responsibility modules — a Luma client (fetch + paginate), a mapper (LumaEvent → CalendarEntry), and a markdown writer (CalendarEntry[] → markdown). Mock mode is a first-class flag so the full pipeline runs without a live API key. The script is invoked via `npx tsx tools/calendar/sync.ts`.

**Design Patterns:**
- **Adapter** — `LumaClient` wraps the external API; the rest of the code never touches raw Luma shapes
- **Mapper** — pure function transforms LumaEvent → CalendarEntry; testable in isolation
- **Template Method** — markdown writer takes entries and renders a fixed schema; easy to extend columns later

**Tech Stack:** TypeScript, `tsx` (run TS directly), `vitest` (testing), Node 18+ native `fetch`, `dotenv` (env loading). No framework.

---

## Constraints

- `fetch` is native in Node 18+ — no `axios` or `node-fetch`
- All types live in `tools/calendar/types.ts` — no inline type definitions in logic files
- Mock data lives in `tools/calendar/__fixtures__/luma-events.json` — never hardcoded in logic
- `.env.local` is gitignored; `.env.example` is committed
- The markdown writer must be **idempotent** — running sync twice produces the same file
- Promo window = `start_at` minus 14 days (default; overridable per entry in future)
- Tag `ai-basics`, `ai-intermediate`, `ai-advanced`, `show-dont-tell`, `she-builds` → event type classification

---

## Block 1: Project Scaffolding

**Goal:** TypeScript project with test runner ready. `npx tsx` and `npx vitest` both work.

**Success Criteria:**
- [ ] `npm test` runs and reports 0 tests (empty suite passes)
- [ ] `npx tsx --version` works
- [ ] `tsconfig.json` resolves imports from `tools/` correctly
- [ ] `.gitignore` covers `node_modules`, `.env.local`, `dist`

### Chunk 1.1 — package.json + tsconfig + .gitignore (1h)

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Modify: `.gitignore` (append entries)
- Create: `.env.example`
- Create: `tools/calendar/__tests__/setup.test.ts` (smoke test)

**Step 1 — Write failing test:**
```typescript
// tools/calendar/__tests__/setup.test.ts
import { describe, it, expect } from 'vitest'

describe('setup', () => {
  it('TypeScript resolves', () => {
    const x: number = 1
    expect(x).toBe(1)
  })
})
```

**Step 2 — Verify failure:**
```bash
npx vitest run
# Expected: "Cannot find module 'vitest'" or similar — no package.json yet
```

**Step 3 — Implement:**

`package.json`:
```json
{
  "name": "wdai-marketing",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "calendar:sync": "npx tsx tools/calendar/sync.ts",
    "calendar:sync:mock": "LUMA_MOCK=true npx tsx tools/calendar/sync.ts"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "tsx": "^4.7.0",
    "vitest": "^1.4.0"
  },
  "dependencies": {
    "dotenv": "^16.4.0"
  }
}
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "."
  },
  "include": ["tools/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

`.env.example`:
```
# Luma API key — get from lu.ma/home/settings/integrations (requires Luma Plus)
LUMA_API_KEY=

# Set to "true" to run sync with mock data (no API key needed)
LUMA_MOCK=false
```

**Step 4 — Verify pass:**
```bash
npm install && npm test
# Expected: "1 passed"
```

**Step 5 — Commit:**
```bash
git add package.json tsconfig.json .env.example tools/calendar/__tests__/setup.test.ts
git commit -m "chore: scaffold TypeScript project with vitest"
```

---

## Block 2: Types + Mock Fixture

**Goal:** All data shapes defined. Mock fixture matches real Luma API shape. Zero ambiguity about what fields exist.

**Success Criteria:**
- [ ] `LumaEvent` type matches the real Luma API response shape exactly
- [ ] `CalendarEntry` type includes all Luma-derived + WDAI-added fields
- [ ] Mock fixture passes type validation
- [ ] Mapper types are tested in isolation

### Chunk 2.1 — Type definitions (1h)

**Files:**
- Create: `tools/calendar/types.ts`
- Create: `tools/calendar/__tests__/types.test.ts`

**Step 1 — Write failing test:**
```typescript
// tools/calendar/__tests__/types.test.ts
import { describe, it, expectTypeOf } from 'vitest'
import type { LumaEvent, CalendarEntry } from '../types.js'

describe('types', () => {
  it('LumaEvent has required fields', () => {
    expectTypeOf<LumaEvent>().toHaveProperty('event_id')
    expectTypeOf<LumaEvent>().toHaveProperty('name')
    expectTypeOf<LumaEvent>().toHaveProperty('start_at')
    expectTypeOf<LumaEvent>().toHaveProperty('end_at')
  })

  it('CalendarEntry has WDAI-added fields', () => {
    expectTypeOf<CalendarEntry>().toHaveProperty('promo_window_start')
    expectTypeOf<CalendarEntry>().toHaveProperty('copy_status')
    expectTypeOf<CalendarEntry>().toHaveProperty('dri')
  })
})
```

**Step 2 — Verify failure:**
```bash
npm test
# Expected: "Cannot find module '../types.js'"
```

**Step 3 — Implement `tools/calendar/types.ts`:**
```typescript
// Luma API response shape (from public-api.luma.com)
export interface LumaEvent {
  api_id: string
  event: {
    api_id: string
    name: string
    description_md: string | null
    start_at: string        // ISO 8601
    end_at: string          // ISO 8601
    timezone: string        // IANA e.g. "America/New_York"
    slug: string
    url: string
    cover_url: string | null
    meeting_url: string | null
    visibility: 'public' | 'private' | 'members-only'
    geo_address_json: Record<string, unknown> | null
  }
  tags: string[]
}

export interface LumaListResponse {
  entries: LumaEvent[]
  has_more: boolean
  next_cursor: string | null
}

// WDAI content calendar entry (Luma-derived + WDAI-added fields)
export type EventType =
  | 'ai-basics'
  | 'ai-intermediate'
  | 'ai-advanced'
  | 'show-dont-tell'
  | 'she-builds'
  | 'speaker-event'
  | 'other'

export type CopyStatus =
  | '🔲 Not started'
  | '🟡 In progress'
  | '✅ Approved'
  | '📤 Sent'

export interface CalendarEntry {
  // From Luma
  luma_id: string
  name: string
  event_type: EventType
  start_at: string          // ISO 8601
  end_at: string            // ISO 8601
  timezone: string
  luma_url: string
  meeting_url: string | null
  visibility: string
  tags: string[]

  // WDAI-added (computed or manually set)
  promo_window_start: string  // ISO 8601 — default: start_at minus 14 days
  dri: string                 // Directly Responsible Individual — default: ""
  copy_status: CopyStatus
  channel_plan: string        // Free text; populated by promo planner in Phase 4
  notes: string               // From Luma description_md, truncated
}
```

**Step 4 — Verify pass:**
```bash
npm test
# Expected: "2 passed"
```

**Step 5 — Commit:**
```bash
git add tools/calendar/types.ts tools/calendar/__tests__/types.test.ts
git commit -m "feat(calendar): define LumaEvent and CalendarEntry types"
```

---

### Chunk 2.2 — Mock fixture (30min)

**Files:**
- Create: `tools/calendar/__fixtures__/luma-events.json`
- Create: `tools/calendar/__tests__/fixture.test.ts`

**Step 1 — Write failing test:**
```typescript
// tools/calendar/__tests__/fixture.test.ts
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
```

**Step 2 — Verify failure:**
```bash
npm test
# Expected: "ENOENT: no such file or directory"
```

**Step 3 — Implement `tools/calendar/__fixtures__/luma-events.json`:**
```json
{
  "entries": [
    {
      "api_id": "entry-mock-001",
      "event": {
        "api_id": "evt-mock-001",
        "name": "AI Basics W27 — Cohort Launch",
        "description_md": "A 6-week cohort for professionals learning to apply AI in their work.",
        "start_at": "2026-05-04T17:00:00Z",
        "end_at": "2026-06-13T18:00:00Z",
        "timezone": "America/New_York",
        "slug": "ai-basics-w27",
        "url": "https://lu.ma/ai-basics-w27",
        "cover_url": null,
        "meeting_url": "https://meet.google.com/mock-link",
        "visibility": "public",
        "geo_address_json": null
      },
      "tags": ["ai-basics", "cohort"]
    },
    {
      "api_id": "entry-mock-002",
      "event": {
        "api_id": "evt-mock-002",
        "name": "Show Don't Tell — May Session",
        "description_md": "Monthly storytelling workshop with Carolyn Roth.",
        "start_at": "2026-05-15T18:00:00Z",
        "end_at": "2026-05-15T19:30:00Z",
        "timezone": "America/New_York",
        "slug": "show-dont-tell-may",
        "url": "https://lu.ma/show-dont-tell-may",
        "cover_url": null,
        "meeting_url": "https://meet.google.com/mock-link-2",
        "visibility": "public",
        "geo_address_json": null
      },
      "tags": ["show-dont-tell"]
    }
  ],
  "has_more": false,
  "next_cursor": null
}
```

**Step 4 — Verify pass:**
```bash
npm test
# Expected: "3 passed"
```

**Step 5 — Commit:**
```bash
git add tools/calendar/__fixtures__/luma-events.json tools/calendar/__tests__/fixture.test.ts
git commit -m "feat(calendar): add mock Luma fixture with 2 WDAI event types"
```

---

## Block 3: Core Logic

**Goal:** Mapper and markdown writer are pure, tested functions. No side effects. No API calls.

**Success Criteria:**
- [ ] `mapLumaEvent()` correctly classifies event type from tags
- [ ] `mapLumaEvent()` correctly computes `promo_window_start` as start_at minus 14 days
- [ ] `renderCalendar()` produces valid markdown with summary table + per-event detail blocks
- [ ] Running `renderCalendar()` twice with the same input produces identical output (idempotent)

### Chunk 3.1 — Mapper (1h)

**Files:**
- Create: `tools/calendar/mapper.ts`
- Create: `tools/calendar/__tests__/mapper.test.ts`

**Step 1 — Write failing test:**
```typescript
// tools/calendar/__tests__/mapper.test.ts
import { describe, it, expect } from 'vitest'
import { mapLumaEvent } from '../mapper.js'
import type { LumaEvent } from '../types.js'

const mockEvent: LumaEvent = {
  api_id: 'entry-001',
  event: {
    api_id: 'evt-001',
    name: 'AI Basics W27 — Cohort Launch',
    description_md: 'A cohort for professionals.',
    start_at: '2026-05-04T17:00:00Z',
    end_at: '2026-06-13T18:00:00Z',
    timezone: 'America/New_York',
    slug: 'ai-basics-w27',
    url: 'https://lu.ma/ai-basics-w27',
    cover_url: null,
    meeting_url: 'https://meet.google.com/mock',
    visibility: 'public',
    geo_address_json: null,
  },
  tags: ['ai-basics', 'cohort'],
}

describe('mapLumaEvent', () => {
  it('maps core fields correctly', () => {
    const entry = mapLumaEvent(mockEvent)
    expect(entry.luma_id).toBe('evt-001')
    expect(entry.name).toBe('AI Basics W27 — Cohort Launch')
    expect(entry.luma_url).toBe('https://lu.ma/ai-basics-w27')
  })

  it('classifies event type from tags', () => {
    const entry = mapLumaEvent(mockEvent)
    expect(entry.event_type).toBe('ai-basics')
  })

  it('classifies unknown tags as "other"', () => {
    const entry = mapLumaEvent({ ...mockEvent, tags: ['unknown-tag'] })
    expect(entry.event_type).toBe('other')
  })

  it('computes promo_window_start as 14 days before start_at', () => {
    const entry = mapLumaEvent(mockEvent)
    expect(entry.promo_window_start).toBe('2026-04-20T17:00:00Z')
  })

  it('sets default copy_status to Not started', () => {
    const entry = mapLumaEvent(mockEvent)
    expect(entry.copy_status).toBe('🔲 Not started')
  })
})
```

**Step 2 — Verify failure:**
```bash
npm test
# Expected: "Cannot find module '../mapper.js'"
```

**Step 3 — Implement `tools/calendar/mapper.ts`:**
```typescript
import type { LumaEvent, CalendarEntry, EventType } from './types.js'

const TAG_TO_TYPE: Record<string, EventType> = {
  'ai-basics': 'ai-basics',
  'ai-intermediate': 'ai-intermediate',
  'ai-advanced': 'ai-advanced',
  'show-dont-tell': 'show-dont-tell',
  'she-builds': 'she-builds',
  'speaker-event': 'speaker-event',
}

function classifyEventType(tags: string[]): EventType {
  for (const tag of tags) {
    if (tag in TAG_TO_TYPE) return TAG_TO_TYPE[tag]
  }
  return 'other'
}

function subtractDays(isoDate: string, days: number): string {
  const d = new Date(isoDate)
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString()
}

export function mapLumaEvent(raw: LumaEvent): CalendarEntry {
  const { event, tags } = raw
  return {
    luma_id: event.api_id,
    name: event.name,
    event_type: classifyEventType(tags),
    start_at: event.start_at,
    end_at: event.end_at,
    timezone: event.timezone,
    luma_url: event.url,
    meeting_url: event.meeting_url,
    visibility: event.visibility,
    tags,
    promo_window_start: subtractDays(event.start_at, 14),
    dri: '',
    copy_status: '🔲 Not started',
    channel_plan: '',
    notes: event.description_md?.slice(0, 200) ?? '',
  }
}
```

**Step 4 — Verify pass:**
```bash
npm test
# Expected: "8 passed"
```

**Step 5 — Commit:**
```bash
git add tools/calendar/mapper.ts tools/calendar/__tests__/mapper.test.ts
git commit -m "feat(calendar): implement LumaEvent → CalendarEntry mapper"
```

---

### Chunk 3.2 — Markdown writer (1h)

**Files:**
- Create: `tools/calendar/writer.ts`
- Create: `tools/calendar/__tests__/writer.test.ts`

**Step 1 — Write failing test:**
```typescript
// tools/calendar/__tests__/writer.test.ts
import { describe, it, expect } from 'vitest'
import { renderCalendar } from '../writer.js'
import type { CalendarEntry } from '../types.js'

const entry: CalendarEntry = {
  luma_id: 'evt-001',
  name: 'AI Basics W27',
  event_type: 'ai-basics',
  start_at: '2026-05-04T17:00:00Z',
  end_at: '2026-06-13T18:00:00Z',
  timezone: 'America/New_York',
  luma_url: 'https://lu.ma/ai-basics-w27',
  meeting_url: 'https://meet.google.com/mock',
  visibility: 'public',
  tags: ['ai-basics'],
  promo_window_start: '2026-04-20T17:00:00Z',
  dri: 'Sheena',
  copy_status: '🔲 Not started',
  channel_plan: '',
  notes: 'A 6-week cohort.',
}

describe('renderCalendar', () => {
  it('includes a summary table', () => {
    const md = renderCalendar([entry], '2026-04-12T10:00:00Z')
    expect(md).toContain('| Event |')
    expect(md).toContain('AI Basics W27')
  })

  it('includes per-event detail block', () => {
    const md = renderCalendar([entry], '2026-04-12T10:00:00Z')
    expect(md).toContain('## AI Basics W27')
    expect(md).toContain('evt-001')
    expect(md).toContain('Sheena')
  })

  it('is idempotent — same input produces same output', () => {
    const a = renderCalendar([entry], '2026-04-12T10:00:00Z')
    const b = renderCalendar([entry], '2026-04-12T10:00:00Z')
    expect(a).toBe(b)
  })

  it('includes last synced timestamp', () => {
    const md = renderCalendar([entry], '2026-04-12T10:00:00Z')
    expect(md).toContain('2026-04-12')
  })
})
```

**Step 2 — Verify failure:**
```bash
npm test
# Expected: "Cannot find module '../writer.js'"
```

**Step 3 — Implement `tools/calendar/writer.ts`:**
```typescript
import type { CalendarEntry } from './types.js'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
}

function summaryRow(e: CalendarEntry): string {
  return `| [${e.name}](#${e.luma_id}) | ${e.event_type} | ${formatDate(e.start_at)} | ${formatDate(e.promo_window_start)} | ${e.dri || '—'} | ${e.copy_status} |`
}

function detailBlock(e: CalendarEntry): string {
  return [
    `## ${e.name}`,
    '',
    `**Luma ID:** ${e.luma_id}`,
    `**Type:** ${e.event_type}`,
    `**Dates:** ${formatDate(e.start_at)} – ${formatDate(e.end_at)}`,
    `**Timezone:** ${e.timezone}`,
    `**Registration:** ${e.luma_url}`,
    e.meeting_url ? `**Meeting URL:** ${e.meeting_url}` : null,
    `**Promo Window Opens:** ${formatDate(e.promo_window_start)}`,
    `**DRI:** ${e.dri || '—'}`,
    `**Copy Status:** ${e.copy_status}`,
    '',
    '### Channel Plan',
    e.channel_plan || '*(Generated by promo planner — Phase 4)*',
    '',
    '### Notes',
    e.notes || '*(No description)*',
    '',
    '---',
  ].filter(line => line !== null).join('\n')
}

export function renderCalendar(entries: CalendarEntry[], syncedAt: string): string {
  const header = [
    '# WDAI Content Calendar',
    '',
    `> Last synced from Luma: ${formatDate(syncedAt)}`,
    '',
    '---',
    '',
    '## Upcoming Events',
    '',
    '| Event | Type | Start | Promo Window | DRI | Copy Status |',
    '|-------|------|-------|--------------|-----|-------------|',
    ...entries.map(summaryRow),
    '',
    '---',
    '',
  ].join('\n')

  const details = entries.map(detailBlock).join('\n\n')

  return header + details + '\n'
}
```

**Step 4 — Verify pass:**
```bash
npm test
# Expected: "12 passed"
```

**Step 5 — Commit:**
```bash
git add tools/calendar/writer.ts tools/calendar/__tests__/writer.test.ts
git commit -m "feat(calendar): implement markdown calendar writer"
```

---

## Block 4: CLI Entry Point + Luma Client

**Goal:** `npm run calendar:sync:mock` writes a valid `vault/content-calendar.md`. `npm run calendar:sync` runs against the real API when `LUMA_API_KEY` is set.

**Success Criteria:**
- [ ] `LUMA_MOCK=true npx tsx tools/calendar/sync.ts` writes `vault/content-calendar.md`
- [ ] Running it twice produces the same file (idempotent)
- [ ] Real API path is wired but gated behind `process.env.LUMA_API_KEY`
- [ ] Missing API key in non-mock mode exits with a clear error message

### Chunk 4.1 — Luma client (1h)

**Files:**
- Create: `tools/calendar/luma-client.ts`
- Create: `tools/calendar/__tests__/luma-client.test.ts`

**Step 1 — Write failing test:**
```typescript
// tools/calendar/__tests__/luma-client.test.ts
import { describe, it, expect, vi } from 'vitest'
import { fetchAllEvents } from '../luma-client.js'

// Gate all tests behind flag — no live API calls in CI
const RUN_LIVE = process.env.LUMA_LIVE_TEST === 'true'

describe('fetchAllEvents (mock mode)', () => {
  it('returns entries from mock fixture when LUMA_MOCK=true', async () => {
    process.env.LUMA_MOCK = 'true'
    const entries = await fetchAllEvents()
    expect(entries.length).toBeGreaterThan(0)
    expect(entries[0].event.name).toBeTruthy()
    delete process.env.LUMA_MOCK
  })
})

describe.skipIf(!RUN_LIVE)('fetchAllEvents (live API)', () => {
  it('returns entries from real Luma API', async () => {
    const entries = await fetchAllEvents()
    expect(entries).toBeInstanceOf(Array)
  })
})
```

**Step 2 — Verify failure:**
```bash
npm test
# Expected: "Cannot find module '../luma-client.js'"
```

**Step 3 — Implement `tools/calendar/luma-client.ts`:**
```typescript
import { readFileSync } from 'fs'
import { createRequire } from 'module'
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
```

**Step 4 — Verify pass:**
```bash
npm test
# Expected: "13 passed" (live test skipped)
```

**Step 5 — Commit:**
```bash
git add tools/calendar/luma-client.ts tools/calendar/__tests__/luma-client.test.ts
git commit -m "feat(calendar): implement Luma client with mock + real API modes"
```

---

### Chunk 4.2 — sync.ts entry point (1h)

**Files:**
- Create: `tools/calendar/sync.ts`

No unit test for this chunk — it's a thin orchestration layer. Verified by running it.

**Step 3 — Implement `tools/calendar/sync.ts`:**
```typescript
import 'dotenv/config'
import { writeFileSync } from 'fs'
import { fetchAllEvents } from './luma-client.js'
import { mapLumaEvent } from './mapper.js'
import { renderCalendar } from './writer.js'

const OUTPUT_PATH = 'vault/content-calendar.md'

async function main() {
  const isMock = process.env.LUMA_MOCK === 'true'
  console.log(`Running calendar sync (${isMock ? 'mock' : 'live'} mode)...`)

  const rawEvents = await fetchAllEvents()
  console.log(`  Fetched ${rawEvents.length} events from Luma`)

  const entries = rawEvents.map(mapLumaEvent)
  const markdown = renderCalendar(entries, new Date().toISOString())

  writeFileSync(OUTPUT_PATH, markdown, 'utf-8')
  console.log(`  Written to ${OUTPUT_PATH}`)
  console.log('Done.')
}

main().catch(err => {
  console.error('Calendar sync failed:', err.message)
  process.exit(1)
})
```

**Step 4 — Verify pass:**
```bash
npm run calendar:sync:mock
# Expected:
# Running calendar sync (mock mode)...
#   Fetched 2 events from Luma
#   Written to vault/content-calendar.md
# Done.

cat vault/content-calendar.md
# Expected: valid markdown with summary table + 2 event detail blocks
```

**Step 5 — Commit:**
```bash
git add tools/calendar/sync.ts vault/content-calendar.md
git commit -m "feat(calendar): add sync entry point; write initial content-calendar.md"
```

---

## Block 5: GitHub Actions Cron

**Goal:** Daily automated sync runs in CI, commits updated `vault/content-calendar.md` if changes exist.

**Success Criteria:**
- [ ] Workflow file is valid YAML (passes `actionlint` or manual review)
- [ ] Cron runs daily at 6am UTC
- [ ] Uses `LUMA_API_KEY` from GitHub Secrets
- [ ] Only commits if `content-calendar.md` changed (no noise commits)
- [ ] Can be manually triggered via `workflow_dispatch`

### Chunk 5.1 — GitHub Actions workflow (1h)

**Files:**
- Create: `.github/workflows/calendar-sync.yml`

**Step 3 — Implement:**
```yaml
name: Calendar Sync

on:
  schedule:
    - cron: '0 6 * * *'   # Daily at 6am UTC
  workflow_dispatch:        # Manual trigger

permissions:
  contents: write           # Needed to commit updated calendar

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run calendar sync
        env:
          LUMA_API_KEY: ${{ secrets.LUMA_API_KEY }}
        run: npm run calendar:sync

      - name: Commit if changed
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add vault/content-calendar.md
          git diff --cached --quiet || git commit -m "chore(calendar): sync from Luma [skip ci]"
          git push
```

**Step 4 — Verify:**
- Push to GitHub, go to Actions tab, trigger manually via `workflow_dispatch`
- Confirm: workflow runs, exits cleanly (will use mock or fail gracefully without API key)

**Step 5 — Commit:**
```bash
git add .github/workflows/calendar-sync.yml
git commit -m "ci: add daily Luma calendar sync GitHub Action"
```

---

## Technical Debt

| Item | Severity | Notes |
|------|----------|-------|
| `promo_window_start` hardcoded at 14 days | Low | Fine for Phase 3; Phase 4 will let promo planner override per event type |
| `dri` field defaults to empty string | Low | Will be set manually or inferred from event type in Phase 4 |
| No deduplication on re-sync | Low | Idempotent writer overwrites cleanly; not a problem until Phase 4 adds manual overrides |
| Luma fixture only has 2 events | Low | Sufficient for testing; expand when real API access is available |

---

## Production Standards

- **Timeouts:** `fetch` uses `AbortSignal.timeout(10_000)` — all Luma API calls timeout at 10s
- **Error handling:** `main()` catches and exits with code 1 + message; CI surface via workflow failure
- **Live test gate:** `fetchAllEvents` live test gated behind `LUMA_LIVE_TEST=true` env var
- **Idempotency:** `renderCalendar` is a pure function; same input always produces same output
- **No secrets in repo:** `.env.local` gitignored; API key only in GitHub Secrets + local `.env.local`

---

## Secret Hygiene Checklist

Before testing the live API path:
- [ ] Add `LUMA_API_KEY` to GitHub → Settings → Secrets → Actions
- [ ] Add `LUMA_API_KEY=<value>` to `.env.local` (gitignored)
- [ ] Confirm `.env.local` is in `.gitignore`

---

*Ready to build? Use `/build`.*
