# Project History

## 2026-04-14 — Phase 3 Block A Complete: Luma Calendar Sync

### Accomplishments

- **TypeScript Project Scaffolding** — package.json, tsconfig.json, vitest setup, .gitignore configured
- **Type System** — LumaEvent and CalendarEntry types defined; LumaListResponse for pagination
- **Mock Fixture** — Created `tools/calendar/__fixtures__/luma-events.json` with 2 sample events (AI Basics, Show Don't Tell)
- **Core Logic** — Implemented mapLumaEvent() (classification, date math) and renderCalendar() (summary table + detail blocks) as pure functions
- **Luma Client** — Async fetcher with mock mode (LUMA_MOCK=true) and real API support; handles pagination
- **CLI Entry Point** — sync.ts orchestrates fetch → map → render → write pipeline
- **GitHub Actions** — Daily cron workflow (6am UTC) to sync `vault/content-calendar.md`
- **Test Coverage** — 14 tests passing, 1 live API test gated behind LUMA_LIVE_TEST flag

### Key Learnings

- **Adapter Pattern** — Isolate external API integration in one module; all other code works with internal types
- **Pure Functions** — Mapper and writer have zero side effects, making them trivial to test
- **Test Cleanup** — Use `afterEach` for env var cleanup, not manual deletion at test end
- **Spec-Crafting** — Date/string assertion formats must be verified at runtime before committing to plan

### Metrics

- **Lines of Code**: 330 (non-test), 315 (test)
- **Test Coverage**: 15 tests total (14 passing, 1 skipped)
- **Files Created**: 17 (types, logic, tests, fixtures, config, workflow, docs)
- **Commits**: 6

### Deferred / Next Phase

- **Real API Smoke Test** — Requires live LUMA_API_KEY; user will test before marking phase complete
- **Promo Planner Integration** — Phase 4 will ingest calendar entries and generate promotion timelines
- **Schema Evolution** — Phase 4 will add DRI inference, copy status workflow, channel planning UI

### Known Technical Debt

- DEBT-001: Fixture path relative to CWD (Low) — use `import.meta.url`
- DEBT-002: Pagination fragile if `has_more !== !!next_cursor` (Low) — add assertion
- DEBT-003: Writer markdown generation mixes date formatting with structure (Low) — refactor to field list
