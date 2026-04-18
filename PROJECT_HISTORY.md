# WDAI Marketing Project History

## 2026-04-18 — Phase 5B: Slack DM Copy Review + Shared Slack Utilities

**Completed:**
- `slack-dm.ts`: `sendCopyReviewDM` (Bot token, chat.postMessage, 10s timeout) + `formatCopyReviewMessage` (Block Kit with header, event context, copy text, Approve/Edit buttons)
- `copy-review.ts`: `dispatchCopyReviews` — routes to moment DRI (not event DRI), skips approved/published
- `generate.ts`: `--notify` flag triggers DM dispatch after copy generation
- `team.yaml`: DRI name → Slack user ID config (placeholders; fill in during Phase 7 onboarding)
- `slack-utils.ts`: shared `slackPost()`, `encodeButtonValue()`, `decodeButtonValue()`, `getMoment()` — extracted from audit debt items
- Resolved DEBT-001 (timeout pattern duplication), DEBT-002 (undocumented button encoding), DEBT-003 (moment lookup duplication)
- 154 total tests passing (up from 145); zero technical debt

**Key Learnings:**
- Extract shared infrastructure before building a second consumer — audit will catch it but it's cheaper upfront
- Button value encoding is a micro-protocol; always pair encode() with decode() in the same file
- DM routing must target the moment's DRI, not the event's top-level DRI
- Audit subagents over-escalate severity without knowing which blocks are deferred — re-triage every "Blocking" flag with "does this break current tests?"

**What's Deferred:**
- Phase 5 Block E: `approve_copy`, `edit_copy` handlers + Slack edit modal (blocked: Vercel)
- Vercel deployment: blocked pending Helen's org access
- `SLACK_BOT_TOKEN` + `SLACK_SIGNING_SECRET`: not yet added to GitHub Secrets (needs Vercel URL first)
- `team.yaml` Slack user IDs: placeholders — fill in during Phase 7 onboarding

---

## 2026-04-16 — Phase 5 Closeout: AI Copy Generation + Slack Interactions

**Completed:**
- Copy data model (CopyDraft, CopyStatus enum) with flat-file YAML serialization in `vault/promos/<event-id>/`
- Voice guides loader (`voice-loader.ts`) reads brand-guidelines, LinkedIn voice, Helen voice from vault
- Prompt builder (`prompt-builder.ts`) composes system + user prompts with channel-specific voice injection
- Copy generator (`copy-generator.ts`) calls Anthropic API with 60s timeout + single retry, stores drafts
- CLI command: `npm run calendar:generate -- --event <id> [--channel <channel>] [--dry-run]` with full flag support
- HTML viewer integration: copy status badges + excerpt display in channel plan table
- Vercel serverless endpoint (`api/slack/interactions.ts`) for Slack button callbacks with timing-safe HMAC-SHA256 signature verification
- Slack approval action handler: fetches status file from GitHub, parses YAML, updates approval field, PUTs back with Base64 encoding
- `vercel.json` config: static vault deployment, X-Robots-Tag noindex header, Node runtime for api/**/*.ts
- 35+ new production files, 11 new test files, 129 passing tests

**Key Learnings:**
- **Composable voice guidance architecture:** Load brand guidelines and channel-specific voices separately, inject at prompt-build time (not at render time). Allows same event to generate different copy per channel without reloading files.
- **GitHub Contents API integration:** Base64 encoding for PUT operations is non-negotiable; use `Buffer.from(content, 'utf8').toString('base64')` and `Buffer.from(base64, 'base64').toString('utf8')` for round-tripping. SHA tracking required for conditional updates (`sha` field prevents overwriting concurrent changes).
- **Slack signature verification:** Use `crypto.timingSafeEqual()` to prevent timing attacks — never use `===` for secret comparisons. Verify both signature and timestamp (15-minute window) for security.
- **Approval state persistence:** Store approval status separately from generated copy. Approved copy persists even if event details change; generation skips moments with existing approved/published copy to prevent overwriting.
- **Timeout resilience:** 60-second generation timeout with single retry catches transient API failures; beyond that, fail gracefully and let the human re-run the generation.

**Code Quality:**
- Zero technical debt: fixed DEBT-011 (formatDate duplication), DEBT-012 (magic 14), DEBT-013 (global _uid state)
- All tests passing, 2 skipped (live API, skipped copy-generator live call)
- No premature abstractions: each module (voice-loader, prompt-builder, copy-generator, copy-store) has single responsibility
- TDD caught integration issue early: copy YAML sha tracking required for GitHub API idempotency

**What's Deferred:**
- Phase 4 Block C (Vercel auth-gated site deployment) — requires manual org setup, functionality already in place
- Phase 5 Block G (Slack DMs to DRI with copy drafts) — requires SLACK_BOT_TOKEN, deferred to Phase 5B
- Phase 5 Block H (Edit modal for copy revisions) — requires additional serverless handlers, deferred to Phase 5B

**Next Phase (Phase 6):** Auto-publishing to LinkedIn + Mailchimp (scheduled for Phase 6, not Phase 5B)

---

## 2026-04-16 — Phase 4 Closeout: Slack Integration + Approval Status

**Completed:**
- Slack Block Kit message formatter (pure function, no external calls)
- Change detection between syncs (detectChanges function comparing event lists)
- Approval status persistence in `vault/status/<luma_id>.yaml` flat files with YAML serialization
- Status badges in HTML calendar viewer (⏳ Pending / ✅ Approved / ✏️ Changes Requested)
- Slack notifications posted after sync if changes detected
- Approval status integrated into mapper + HTML writer
- Interactive Approve/Edit action buttons on Slack Block Kit messages
- 8 new test files, 52 passing tests for Slack + status functionality
- Consolidated channel label mapping (DEBT-007) into single source of truth

**Key Learnings:**
- **Snapshot-based change detection:** For flat-file systems, persist previous state as JSON snapshot. On next run, compare current state to snapshot. Cheap, git-friendly, works offline. Cost is losing history — mitigated by separate approval status files keyed by event ID.
- **Orthogonal state concerns:** Store approval status separately from calendar entries. Allows status to persist across event changes (date move, DRI update) without interference. Non-destructive merges during sync.
- **Block Kit as pure function:** Slack message formatting is a pure function (entries → Block Kit JSON). Enables easy testing, decoupling from network, reusability, and inspection.
- **Status lifecycle clarity:** Approval status has clear state machine (pending → approved / rejected → ready to publish). Once set, persists across syncs unless explicitly changed.

**Code Quality:**
- DRY principle maintained: unified channel labels across slack-notifier and html-writer
- Error handling robust: timeouts on webhooks, graceful logging, no crashes on Slack failures
- No premature abstractions: each module has single job (formatter, differ, status reader/writer, sender)

---

## 2026-04-16 — Phase 3 Closeout: Content Calendar System

**Completed:**
- Luma API client with pagination, mock mode (fixture-driven), cache-aside pattern (1-hour TTL), LUMA_FORCE escape hatch
- TypeScript type system: LumaEvent, CalendarEntry, EventType, PromoRules, OverridesMap, CopyStatus
- Event classification: 6 event types (ai-basics, ai-intermediate, ai-advanced, show-dont-tell, she-builds, speaker-event, other)
- Mapper: pure function transforming LumaEvents → CalendarEntries with type classification, promo window math, DRI + channel plan enrichment
- Markdown writer: summary table (4 events) + detail blocks (6 fields per event) + channel plan table (moment schedule + copy status)
- HTML viewer: three tabs (By Date / By Event / How to Edit), fully self-contained, works offline
- CLI entry point (`sync.ts`): integrates all components, supports --mock flag, environment-driven
- GitHub Actions daily cron (6am UTC): auto-syncs Luma → vault/content-calendar.{md,html}
- Test coverage: 74 tests, 1 skipped (live Luma API), 100% pass rate

**Key Learnings:**
- **Adapter pattern for external APIs:** Single module (`luma-client.ts`) is the only place touching external data shape. All other modules work with internal types. Refactoring is isolated — API changes only touch one file.
- **Cache-aside for rate-limited APIs:** After first fetch, write to cache file. Check cache on re-runs if less than 1 hour old. LUMA_FORCE escape hatch allows fresh data when needed. Pattern is cheap, safe, offline-friendly.
- **Override chain for env files:** Load `.env.local` before `.env` so local secrets take precedence. Requires explicit `dotenv.config({ path: '.env.local' })` call first — `dotenv/config` only loads `.env` by default.
- **Pure functions as recipe cards:** Mapper and writer are pure functions (input → output, no side effects, no API calls). Easy to test in isolation, easy to reason about.
- **Idempotency is safety:** Writing to same output file every time ensures daily cron doesn't accumulate garbage. Each run produces same result.

**Code Quality:**
- TDD caught date format issues early (ISO vs. locale, milliseconds included)
- Modular architecture (client, mapper, writer) made each block independently testable
- Mock mode works offline: full pipeline verification without API access
- Environment variable cleanup used `afterEach` hook for determinism

**What was Deferred:**
- Promo rules and overrides YAML files created but not deeply integrated into mapper (defer to Phase 4)
- Promo window calculation simple (14 days) — per-event override support added, but not extensively tested

---

## 2026-04-14 — Phase 3 Block A: Content Calendar Sync Foundation

**Completed:**
- TypeScript scaffolding with vitest, type definitions (LumaEvent, CalendarEntry, EventType)
- Mock fixture with 2 sample Luma events (AI Basics + Speaker Event)
- Luma API client with pagination support (has_more + next_cursor)
- Event type classifier (tags → EventType enum)
- CalendarEntry mapper with date arithmetic (promo window start = event start - 14 days)
- Markdown writer: summary table + detail blocks
- CLI sync script with --mock flag support
- 15 unit tests (11 sync tests, 2 mapper tests, 2 writer tests)

**Key Insights:**
- Pagination must handle edge case: `has_more=true` but `next_cursor=null` (added console.warn)
- Date math in UTC: `new Date().toISOString()` and `Date.setUTCDate()` prevent timezone surprises
- Relative fixture paths break outside npm context: use `new URL('./__fixtures__/...', import.meta.url).pathname`

---

## Summary by Phase

| Phase | Status | Key Deliverable | Test Count |
|-------|--------|-----------------|-----------|
| 1 | ✅ | Brand identity + voice skills | N/A |
| 2 | ✅ | Promo infrastructure (skills) | N/A |
| 3 | ✅ | Content calendar sync system | 74 tests |
| 4 | ✅ | Slack notifications + approval tracking | 52 tests |
| 5 | ✅ | Copy generation + Vercel interactions | 67 tests |
| 6 | 🔲 | Auto-publishing (LinkedIn + Mailchimp) | Planned |
| 7 | 🔲 | Leader onboarding + handoff | Planned |

**Total Tests:** 129 passing, 2 skipped, 0 failing
**Total Production Files:** 75+ (types, clients, mappers, writers, generators, endpoints, configs)
**Total Test Files:** 22+
**Technical Debt:** 0 active items (DEBT-001 through DEBT-013 resolved)

---

*Last Updated: 2026-04-16 — All work logged in git history and documented in PROJECT_ROADMAP.md*
