# Lessons Learned

## 2026-04-16 — Phase 3 Closeout: Live API Smoke Test + Idempotency

### Architectural Insights

**Cache-Aside Pattern for External APIs**
When calling a rate-limited API, write results to a local cache file after the first fetch. On subsequent runs, check the cache first (respecting a TTL). This makes repeated dev/debug runs free and safe. The escape hatch (`LUMA_FORCE=true`) ensures you can always get fresh data when needed. This pattern is called **cache-aside** — the caller manages the cache, the API stays unaware.

**Override Chain for Environment Files**
Load `.env.local` before `.env` so local secrets take precedence over shared defaults. This is called an **override chain** — more specific sources win. `dotenv/config` only loads `.env` by default; you must call `dotenv.config({ path: '.env.local' })` explicitly first.

### Spec-Crafting for AI Agents

**Environment wiring is part of the feature, not an afterthought.** If you don't specify which file loads secrets, the agent will assume `.env`. Next time, say: *"Load `.env.local` first, then `.env`, so local secrets override shared defaults."*

**Define idempotency strategy upfront for any external API call.** Next time, say: *"After fetching from the live API, cache to a local file. Use the cache on re-runs if it's less than 1 hour old. Add a `FORCE` escape hatch. Gitignore the cache file."*

### What Went Well

- Smoke test passed first run after env fix — 197 real Luma events fetched cleanly
- Cache implementation required zero changes to sync.ts or any other module — luma-client.ts was the only file touched (adapter pattern paying off)

---

## 2026-04-14 — Phase 3 Block A: Luma Calendar Sync

### Architectural Insights

**The Adapter Pattern for External APIs**
When integrating third-party APIs, use a single adapter module (`luma-client.ts`) that is the *only* place in the codebase that touches the external data shape. All other modules work with your internal `CalendarEntry` type. This keeps refactoring isolated — if the Luma API changes, only one file changes.

**Pure Functions as Recipe Cards**
Build mapper and writer functions as pure functions (input → output, no side effects, no API calls). This makes them trivial to test in isolation and easy to reason about. `mapLumaEvent()` and `renderCalendar()` have zero dependencies on each other or the CLI layer.

**Idempotency is Safety**
Writing to the same output file every time (idempotent) is safer than appending. It ensures a daily cron job doesn't accumulate garbage, and each run produces the same result.

### Spec-Crafting for AI Agents

**Date/String Assertions Need Runtime Verification**
When writing test assertions for formatted strings (dates, locale output), the plan author must verify the exact runtime format *before* committing the assertion. Two failures occurred:
- `Date.toISOString()` always includes milliseconds (`.000Z`), not just `Z`
- `toLocaleDateString()` renders locale format (`'Apr 12, 2026'`), not ISO format

**Next time:** Include in the plan: "Confirm the exact runtime output format for all `.toBe()` or `.toContain()` assertions on dates or formatted strings before writing the test."

### Test Infrastructure Discipline

**Environment Variable Cleanup Must Be Deterministic**
The test for mock mode set `process.env.LUMA_MOCK = 'true'` and then deleted it. If an assertion threw before the delete line, the env var remained dirty, breaking subsequent tests. Always use `afterEach` to guarantee cleanup, not manual deletion at the end of a test.

### What Went Well

- TDD caught two plan issues (date formats) early — no runtime bugs
- Modular architecture (client, mapper, writer) made each block independently testable
- Mock mode gated via `LUMA_MOCK` flag + fixture file meant full pipeline works without API access
- `npm run calendar:sync:mock` verified idempotency instantly (run twice, same output)

### What to Improve

- Date timezone handling is correct but confusing — document assumptions in code comments
- Pagination logic is fragile (assumes `has_more` and `next_cursor` stay in sync) — add assertions
- Relative fixture path (`tools/calendar/__fixtures__/luma-events.json`) works via `npm run` but breaks in other contexts — use `import.meta.url`

---

## References

- **Plan**: `docs/plans/2026-04-12-calendar-sync.md`
- **Audit findings**: `docs/BUGS.md` (3 low-severity debt items)
- **Code**: `tools/calendar/` (types, mapper, writer, client, sync entry point)
- **Tests**: 14 passing, 1 skipped (live API gated)
