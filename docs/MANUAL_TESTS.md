# Manual Tests — Phase 3 Verification

Run these tests after merging Phase 3 to `main` to verify end-to-end functionality.

## Test 1: Mock Sync (No API Key Required)

```bash
npm run calendar:sync:mock
```

**Expected Output:**
- `Running calendar sync (mock mode)...`
- `Fetched 2 events from Luma`
- `Written to vault/content-calendar.md`
- `Written to vault/content-calendar.html`
- `Done.`
- Exit code: 0

**What It Tests:**
- Mock fixture loads correctly
- Mapper processes events without crashes
- Both markdown and HTML writers work
- No dependencies on `LUMA_API_KEY` or network

---

## Test 2: HTML Viewer Opens + All Tabs Work

First, start the dev server (required to avoid CORS issues with `file://` protocol):
```bash
npm run vault:serve
```

Then open in your browser:
```bash
open http://localhost:8000/content-calendar.html
```

**Expected UI:**
- Page title shows "WDAI Content Calendar"
- Header displays a sync timestamp (e.g., "Synced: 2026-04-16T20:21:13.847Z")
- Three tabs visible: "By Date", "By Event", "How to Edit"
- **By Date tab:** Events grouped by week, displayed in a table with columns: Date, Channel, DRI, Moment
- **By Event tab:** Events grouped by event name (e.g., "ai-basics Cohort"), each with promo moments listed
- **How to Edit tab:** Plain text instructions visible

**Interaction Test:**
- Click each tab header — content changes without page reload
- Scroll through events — no layout breaks

**What It Tests:**
- HTML generation is valid and parseable
- Tab switching works (vanilla JS, no framework)
- Data is rendered without formatting errors

---

## Test 3: Promo Rules Are Applied

**Setup:** In `tools/calendar/promo-rules.yaml`, confirm at least one event type has a non-empty DRI and moments array (e.g., `ai-basics`).

**Test:**
1. Run `npm run calendar:sync:mock` (or live sync if you have a key)
2. Open `vault/content-calendar.html`
3. Find an event that matches the event type you filled in (search by event name)
4. In the **By Event** tab, locate that event

**Expected:**
- DRI field is populated (not blank, shows the name you entered in YAML)
- Promo moments appear under that event with correct labels (e.g., "14 days before: Announce open enrollment")
- Days count matches what you entered in `promo-rules.yaml`

**What It Tests:**
- YAML parsing works
- Promo rule matching logic (event type → moments) works
- Mapper correctly enriches events with rules

---

## Test 4: Cache Behavior

**Setup:** You have `LUMA_API_KEY` set in `.env.local`.

```bash
# First run — should hit Luma API
LUMA_API_KEY=<your-key> npm run calendar:sync

# Check the cache file was written
ls -la tools/calendar/__fixtures__/luma-events-cache.json

# Second run — should use cache (immediate, no API call)
npm run calendar:sync
```

**Expected Output on Second Run:**
- Console logs: `Using cached Luma data from tools/calendar/__fixtures__/luma-events-cache.json (set LUMA_FORCE=true to bypass)`
- Completes within 1-2 seconds (much faster than first run)
- No errors

**Cache File Check:**
- File exists at `tools/calendar/__fixtures__/luma-events-cache.json`
- Contains JSON with keys: `fetchedAt` (ISO timestamp), `entries` (array of event objects)
- File timestamp is recent (within last few minutes)

**What It Tests:**
- Cache write works after live fetch
- Cache read works on subsequent runs
- TTL logic prevents stale data (default 1 hour)

---

## Test 5: Force Refresh Bypass Cache

**Setup:** You have `LUMA_API_KEY` set.

```bash
# Force refresh — should ignore cache and hit API
LUMA_FORCE=true LUMA_API_KEY=<your-key> npm run calendar:sync
```

**Expected:**
- No "Using cached" message
- Console logs fetch activity (pages of events being fetched)
- Completes successfully
- Cache file timestamp updates

**What It Tests:**
- `LUMA_FORCE` env var bypasses cache correctly
- Live API fetch still works after cache was populated

---

## Test 6: Test Suite Clean on Main

```bash
npm test
```

**Expected Output:**
```
Test Files  8 passed (8)
     Tests  33 passed | 1 skipped (34)
```

Exit code: 0, no failures, no warnings.

**What It Tests:**
- All unit tests pass on main branch
- No regressions from Phase 3 work
- Mock fixtures are valid
- Test infrastructure is stable

---

## Test 7: Environment Variable Priority (Optional Deep Dive)

**Setup:** Create two env files:
- `.env` with `LUMA_API_KEY=wrong-key`
- `.env.local` with `LUMA_API_KEY=correct-key`

```bash
npm run calendar:sync:mock  # Uses mock, ignores both keys
```

Then with a real key in `.env.local`:
```bash
# Should use the key from .env.local, not .env
LUMA_API_KEY=<correct-key> npm run calendar:sync
```

**Expected:**
- Sync succeeds (uses correct key from `.env.local`)
- No "API key not set" error

**What It Tests:**
- dotenv override chain loads `.env.local` first
- Local secrets take precedence over shared defaults

---

## Summary of Coverage

| Test | Coverage |
|------|----------|
| 1 | Mock fixture integrity, writer functions |
| 2 | HTML generation, DOM structure, tab switching |
| 3 | YAML parsing, rule matching, data enrichment |
| 4 | Cache write/read, TTL enforcement |
| 5 | `LUMA_FORCE` escape hatch |
| 6 | All unit tests, no regressions |
| 7 | dotenv precedence (optional) |
