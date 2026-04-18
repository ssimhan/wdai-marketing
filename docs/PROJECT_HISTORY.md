# Project History

## 2026-04-18 — Phase 6 + Design System Planning Session

### Accomplishments

- **Phase 6 fully planned** — Auto-publishing to LinkedIn (org page API) and Mailchimp (v3 direct API). Four blocks (A1–A4) with TDD-first chunks. No external blockers; all APIs can be mocked.
- **Design System integration planned** — Commit untracked `skills/wdai-design-system/` skill and apply Figtree font + brand color tokens to calendar HTML viewer. Two blocks (C1–C2), ~2 hours.
- **Documentation restructured** — Created `docs/ROADMAP.md` (full system timeline + phase status), `docs/plans/README.md` (plans navigator with status labels), refactored `NEXT.md` to quick reference. Clear entry points for different use cases (quick status, full roadmap, specific phase).
- **Plans folder organized** — All 6 plans (Phase 3, 4, 5, 6+C) indexed by status (🚀 ⏳ ✅ 🔒). Dated filenames + structure explained in README.
- **Environment variables documented** — Phase 6 requires 5 new env vars (LinkedIn token + org ID, Mailchimp key + server + audience).

### Key Learnings

- Multi-phase planning works well if phases are orthogonal (zero dependencies) — parallel exploration 2x faster
- Reuse existing patterns (readEventCopy, writeCopyDraft) before designing new infrastructure
- Design system integration is trivial if the system already exists — commit + apply, not design + build
- Ask trade-off questions upfront (direct API vs. subprocess, commit-only vs. apply-to-HTML) before writing pseudo-code
- Merge tactical docs into strategic docs, use status labels on plans instead of date-based sorting

### Plans Approved & Documented

- [`docs/plans/2026-04-18-phase-6-publish.md`](docs/plans/2026-04-18-phase-6-publish.md) — Phase 6 (A1–A4) + Phase C (C1–C2)

### Next Steps

- Build Phase 6 (auto-publishing) — 1 day, no blockers
- Build Phase C (design system integration) — 2 hours, no blockers
- Wait on Vercel access for Phase 4 Block D2 + Phase 5 Block E

---

## 2026-04-16 — Strategy Session: Architecture Clarification + Documentation Consolidation

### Accomplishments

- **Architecture decision locked** — System is an autonomous pipeline (GitHub Actions + Anthropic SDK + Vercel), not a Claude Code harness. CC is the build tool; the pipeline calls the Anthropic API directly at runtime.
- **README restructured** — Replaced "Quick Start" (human-centric CC loading instructions) with "How It Works" (pipeline diagram with automated stages and two human touchpoints). Added Vision section. Separated ad-hoc CC usage as a clearly labeled secondary mode.
- **Vault/skills dual-purpose documented** — Voice guides and brand context serve both the automated pipeline (loaded as text at runtime) and humans doing manual CC tasks. This distinction is now explicit.
- **Documentation consolidated** — Archived `WDAI_MARKETING_VAULT_IMPLEMENTATION_PLAN.md` (old build doc with conflicting phase numbering). Updated `PROJECT_ROADMAP.md` Phase 4 to show block-level completion status (A/B/D1 ✅, C/D2 deferred with reasons).
- **V1 scope clarified for Phase 5** — Copy generation runs via GitHub Actions with `ANTHROPIC_API_KEY` in GitHub Secrets — no separate server deployment required.

### Key Learnings

- CC is a build tool, not a runtime — autonomous pipelines call `@anthropic-ai/sdk` directly from GitHub Actions
- Vault files serve two audiences (pipeline + ad-hoc humans); document this dual-purpose explicitly
- READMEs that straddle two mental models confuse everyone — pick one primary model, label the secondary
- Superseded plans with conflicting numbering should be archived immediately, not updated in place

## 2026-04-16 — Phase 4 Complete: Slack Notifications + Approval Status Tracking

### Accomplishments

- **Slack Message Formatter** — `formatSlackMessage()` converts calendar entries to Block Kit JSON with event details, channel plan, and interactive buttons
- **Change Detection** — `detectChanges()` identifies new and modified events between syncs; compares luma_id and key fields (dates, DRI, channel_plan)
- **Webhook Integration** — `sendSlackNotification()` POSTs formatted messages to Slack webhook with 10s timeout; graceful error handling logs warnings without crashing sync
- **GitHub Actions Sync** — Calendar sync workflow passes `SLACK_WEBHOOK_URL` secret; adds HTML output to git commits
- **Approval Status Tracking** — Flat-file YAML storage in `vault/status/<luma_id>.yaml`; `readAllStatuses()` and `writeStatus()` with auto-directory creation
- **Calendar Viewer Integration** — Approval badges displayed in HTML viewer (⏳ Pending, ✅ Approved, ✏️ Changes Requested) and markdown table
- **Interactive Slack Buttons** — Action buttons (✅ Approve, ✏️ Edit Plan) on every event; luma_id passed as value for serverless handler
- **Code Quality Fix** — Unified channel label mapping to single `CHANNEL_LABELS` constant (eliminated DRY violation)

### Key Learnings

- **Snapshot-based change detection** — Persisting previous state as JSON snapshot (`vault/.calendar-snapshot.json`, gitignored) enables cheap diff comparisons without database
- **Slack Block Kit composition** — Message formatting is pure function with zero API calls; all complexity handled at composition time, not at send time
- **Flat-file status as append-only log** — YAML files keyed by event ID act as a simple audit trail; persists across syncs without conflicts
- **Approval state lifecycle** — Separating status from calendar entry (read from external file) allows approval to persist independently of event changes

### Deferred

- **Block C (Vercel Deployment)** — Requires manual Vercel org setup and authentication configuration; deferred to Phase 4 Phase 2
- **Block D2 (Serverless Handler)** — Slack button click handler needs Vercel project running; deferred pending C completion

### Metrics

- **Tests**: 74 passing, 1 skipped (7 new modules, comprehensive coverage)
- **New Modules**: slack-notifier.ts, diff.ts, status.ts (plus tests)
- **Modified Modules**: types.ts, sync.ts, mapper.ts, html-writer.ts, writer.ts
- **Files Modified**: 15 total (4 new test files, 3 new source files, 8 documentation/config updates)
- **Commits**: 13 (including audit fix)
- **Phase 4 Status**: ✅ Blocks A, B, D1 Complete; Blocks C, D2 Deferred

---

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
