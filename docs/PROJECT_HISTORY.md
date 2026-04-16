# Project History

## 2026-04-16 — Phase 3 Complete: Live API Smoke Test + Idempotency

### Accomplishments

- **promo-rules.yaml filled** — DRI + channel moment timelines defined for all event types (ai-basics, ai-intermediate, ai-advanced, show-dont-tell, she-builds, speaker-event, other)
- **Live API smoke test passed** — 197 real Luma events fetched; `vault/content-calendar.md` and `.html` both rendered correctly
- **Cache-aside layer added** — `luma-client.ts` now caches API responses to `__fixtures__/luma-events-cache.json`; TTL defaults to 1 hour, configurable via `LUMA_CACHE_TTL_MS`; `LUMA_FORCE=true` bypasses cache; cache file gitignored
- **dotenv override chain fixed** — `sync.ts` now loads `.env.local` before `.env` so local secrets win
- **`/plan` workflow updated** — Added "Environment & Secrets Setup" checklist to Infrastructure Safety Checks section

### Key Learnings

- Cache-aside pattern keeps rate-limited API calls safe during dev iteration
- `dotenv/config` only loads `.env` — must call `.env.local` explicitly first
- Environment wiring must be specced alongside the feature, not discovered at smoke test time

### Metrics

- **Tests**: 33 passing, 1 skipped (unchanged — no regressions)
- **Files Modified**: 3 (`luma-client.ts`, `sync.ts`, `.gitignore`)
- **Phase 3 Status**: ✅ Complete

---

## 2026-04-14 — Phase 3 Blocks B & C Complete: HTML Viewer + CC Integration

### Accomplishments

- **HTML Calendar Viewer** — Self-contained `vault/content-calendar.html` with three tabs (By Date, By Event, How to Edit); week-grouped chronological moments with filter chips
- **Promo Rules System** — `promo-rules.yaml` defines per-event-type DRI + channel timeline rules; `overrides.yaml` allows per-event customization
- **Rules Loader** — Synchronous YAML parser with graceful fallback (missing files don't crash); DRY file-load pattern extracted
- **Mapper Enrichment** — Updated `mapLumaEvent()` to accept optional `(rules?, overrides?)` params; priority logic (override > rule > default)
- **Markdown Channel Plan** — Writer renders `PromoMoment[]` as `| Channel | DRI | Date | Moment |` markdown table
- **Sync Orchestration** — `sync.ts` loads both config files and writes both `.md` and `.html` outputs in one run
- **CC Integration** — Promo skills updated to load `content-calendar.md` as context; README shows example prompt
- **Type System** — Added `PromoMoment`, `PromoRules`, `PromoMomentRule`, `OverridesMap` types; extracted shared `PromoMomentRule` to reduce duplication
- **Test Coverage** — 33 tests passing (19 new), 1 skipped (live API gate)

### Key Learnings

- **Type-driven refactoring** — Extracting `PromoMomentRule` eliminated DRY violation in EventTypeRule/EventOverride definitions
- **Stateful generators** — `_uid` counter for HTML IDs works for single-run generation; acceptable for this use case with `resetUid()`
- **Multi-output orchestration** — Pure function writers make it trivial to generate multiple output formats from one data shape
- **Date formatting traps** — `fmtDow()` must use two separate `toLocaleDateString()` calls to avoid comma in "Mon, Apr 20" → "Mon Apr 20"

### Metrics

- **Lines of Code**: ~800 (non-test), ~200 (test)
- **Test Coverage**: 33 tests total (32 passing, 1 skipped)
- **Files Created**: 8 (rules-loader, html-writer, YAML configs, test files)
- **Files Modified**: 7 (types, mapper, writer, sync, skills, README, BUGS)
- **Commits**: 8 (including cleanup)

### Deferred to Next Session

- **Fill in `tools/calendar/promo-rules.yaml`** — Use Slack MCP to draft DRI + moments per event type (ai-basics, ai-intermediate, ai-advanced, show-dont-tell, she-builds, speaker-event)
- **Live API smoke test** — Run `LUMA_API_KEY=<key> npm run calendar:sync` and verify HTML viewer displays real events

---

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
