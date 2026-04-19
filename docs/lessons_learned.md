# Lessons Learned

## 2026-04-18 — Phase 6 + Design System Build + Audit/Fix: Workflow Improvements

### Code Quality & Testing

**Audit + Fix loop catches debt early, then fixes atomically.** Found DEBT-004 (timeout duplication) and DEBT-005 (fragile entry point) via clean-code subagent review. Both were Low severity, but fixing atomically meant: extract utility → update callers → test. No risk of partial refactoring. Pattern: *"Run `/audit` → let subagent find code-quality issues → triage by severity → fix each in `/fix` loop."*

**Self-referencing CSS variables are a silent P0.** Found `--pink-tint: var(--pink-tint)` which silently resolved to nothing, making all hover states invisible. Audit checklist had no CSS validation. Pattern: *"In `/audit` P0 Standards, add: Grep for self-referencing CSS vars (`var(--varname): var(--varname)`) and undefined fallbacks. Any hit is invisible UI — P0."*

**Entry point guard patterns matter for CLI durability.** DEBT-005: `process.argv[1]?.includes('publisher')` breaks if file is renamed or wrapped. ESM-safe pattern `fileURLToPath(import.meta.url)` + exact match is better. Pattern: *"In `/audit` P0 Standards, add: For any CLI tool, verify entry point uses ESM-safe (`import.meta.url`) or CommonJS-safe (`require.main === module`) detection, not substring matching."*

### Audit Workflow Refinement

**Subagent triage needs explicit symptom patterns.** Clean-code subagent returned 50+ findings; manually categorizing as Blocking/Improvement/Nitpick required understanding what "undocumented" vs. "real DRY issue" means. Pattern: *"In `/audit` Clean Code section, add a symptom-to-bucket mapping table: 'Blocking' = code solving non-existent problem / duplicated 3+ times / doing 2+ jobs; 'Improvement' = undocumented / fragile / magic number; 'Nitpick' = naming / style."*

**NEXT.md staleness goes undetected.** Phase C was marked "Ready to Build" but already complete. Audit should grep for stale status markers. Pattern: *"In `/audit` UX & Aesthetic section, add: Grep `NEXT.md` and `docs/` for 'Ready to Build | In progress | Pending | Blocked'. Cross-check against git history. Any mismatch is debt."*

---

## 2026-04-18 — Phase 6 + Design System Planning: Multi-Phase Design in One Session

### Architectural Insights

**Two unrelated phases can be planned together if they have zero dependencies.** Phase 6 (publishing) and Phase C (design system) are orthogonal — neither blocks the other, neither depends on the other's implementation. Planning both in parallel with two Explore agents was 2x faster than sequentially. Pattern: *"Do they touch the same modules or share dependencies? No → plan in parallel."*

**Reuse existing patterns before designing new infrastructure.** Phase 6 needed to read/write copy drafts — `readEventCopy()` and `writeCopyDraft()` already existed from Phase 5. Pattern: *"Before planning a new module, explore what already exists in similar modules (status.ts, copy-store.ts, etc.) and design your new module to match existing conventions."* This saves architecture debates and test duplication.

**Design system integration is trivial if the system already exists.** The 300+ files in `skills/wdai-design-system/` were already complete and structured. The only work was: (1) commit it, (2) apply tokens to one CSS const. Total time: 2 hours. Pattern: *"If a design system exists but is untracked, the plan is 'commit + apply' not 'design + build'."*

### Spec-Crafting for AI Agents

**Multi-phase exploration with parallel agents saves time on large domains.** Instead of: *"Explore the calendar sync pipeline and design Phase 6"*, split into: *"Agent A: understand copy pipeline + publishing patterns. Agent B: understand design system contents + calendar HTML."* Each agent gets a focused domain; results combine with zero overlap.

**Question the user about trade-offs before planning, not during implementation.** Asked two questions upfront (email via direct API vs. wdai-mc subprocess; design system: commit-only vs. apply-to-calendar). Got clear answers before writing a single line of pseudo-code. Saved a `/fix` round-trip.

### Documentation Insights

**Merge tactical docs (NEXT.md) into strategic docs (ROADMAP.md).** NEXT.md became a quick-ref pointer to ROADMAP.md instead of duplicating status. Created `docs/plans/README.md` as a navigator between the two. New hierarchy: Quick ref (NEXT) → Full roadmap (ROADMAP) → Find phase (plans/README) → Implementation (plans/YYYY-MM-DD-*.md).

**Label plans by status, not by date.** Added status labels to `docs/plans/README.md` (🚀 ⏳ ✅ 🔒 📋). Users now scan by status, not chronologically. Reduces "What should I build?" to 10-second lookup.

---

## 2026-04-18 — Phase 5B+7 Session: Leader Voice Integration + HTML UX + Team Docs

### Architectural Insights

**Load voice guides per-moment, not once per event.** When copy generation happens per-moment (not per-event), load that moment's DRI's voice skill alongside brand/channel guides. This enables personal voice injection without re-architecting the pipeline — just pass the DRI to the loader.

**Test coverage should precede feature flag additions.** Past-events filtering was flagged by audit as YAGNI (rendering all events then hiding). The right pattern: skip rendering unwanted items before they hit HTML, not render-then-hide. Future: validate filtering strategy in /plan before implementation.

### Workflow Insights

**Subagent code review discovers real improvements, not all are blocking.** The clean code audit flagged 4+ improvements (DRY violations, SRP splits, test gaps). Not all must ship — establish triage criteria upfront: "Does this block shipment or create future bugs?" If no, defer to BUGS.md with reasoning.

**Deferred audit findings must be tracked.** When audit discovers improvements you choose not to fix, add them to BUGS.md immediately with deferral rationale. Prevents re-discovery in future phases and creates searchable record for follow-up.

### Spec-Crafting for AI Agents

**"Load per-DRI" beats "load once and cache."** Saying "load voice guides for this moment's DRI" is clearer than "cache voice guides at event level." Removes ambiguity about scope and timing.

---

## 2026-04-18 — Phase 5B Closeout: Slack DM Copy Review + Debt Resolution

### Architectural Insights

**Extract before you duplicate.** When building a second Slack sender, check whether the first one has common logic worth sharing. `slack-notifier.ts` and `slack-dm.ts` both needed AbortController timeout logic. Extracting `slackPost()` to `slack-utils.ts` first eliminates a future divergence risk. The rule: if you're building a second consumer of the same infrastructure, identify what the two share and extract it first.

**Paired encode/decode helpers prevent silent protocol drift.** The `luma_id|channel` button value format is a micro-protocol between the formatter (which writes it) and the handler (which reads it). Defining both `encodeButtonValue()` and `decodeButtonValue()` in `slack-utils.ts` means the format can only change in one place. Without pairing them, the parser can silently drift from the encoder.

**Route DMs to the moment's DRI, not the event's DRI.** An event has a top-level DRI, but each channel moment has its own DRI. Slack DMs for copy review must go to the person who will post on that specific channel — not the event owner. The moment's `dri` field is the right lookup; `event.dri` is a fallback, not the default.

### Spec-Crafting for AI Agents

**"Check for shared logic first" saves a `/fix` round-trip.** Next time, say: *"Before implementing sendCopyReviewDM, read slack-notifier.ts and extract any shared patterns to a new slack-utils.ts. Then build sendCopyReviewDM using that shared utility."*

**Encode/decode pairs should always be specified together.** Instead of: *"button values encode luma_id and channel"*, say: *"create encodeButtonValue(lumaId, channel) and decodeButtonValue(value) in slack-utils.ts so the formatter and handler share the same encoding format — no magic strings."*

### Audit Notes

**Subagents over-escalate "blocking" severity without future-work context.** The clean-code review called improvement items "blocking" because it had no knowledge of deferred blocks. Correct triage question: *"Does this break the current test suite or make existing code unmaintainable?"* If no — it's Improvement, not Blocking.

---

## 2026-04-16 — Strategy Session: Architecture Clarification + Documentation Consolidation

### Architecture Insights

**CC is a build tool, not a runtime.** An autonomous pipeline calls the Anthropic SDK directly (e.g. `@anthropic-ai/sdk` in GitHub Actions), just like any other server-side service. Claude Code is used to *write* that code, not to *run* it. The vault/skills files serve as prompt templates loaded with `fs.readFileSync()` at generation time — not as CC skills that require a human session.

**Vault files serve two audiences.** The same voice guides and brand guidelines are loaded by (1) the automated pipeline at runtime and (2) humans doing ad-hoc CC tasks. Document this dual-purpose explicitly so the distinction is clear — otherwise the README reads as if CC is the primary interface.

**When a README straddles two mental models, it confuses everyone.** The original README implied both "humans load skills into CC" and "autonomous app on Vercel." Picking one primary model (autonomous pipeline) and labeling the secondary use (ad-hoc CC) as supplemental resolved the confusion immediately.

### Doc Hygiene

**Archive superseded implementation plans immediately.** An old plan with conflicting phase numbering (Phase 4 = different thing than current Phase 4) will silently mislead future readers and AI agents. Move to `archive/` with no changes — don't update it.

**Roadmap status needs block-level granularity.** Marking a phase as "pending" when 3 of 4 blocks are done misrepresents the state. Check off individual blocks as they complete, and note deferred items with a reason inline.

## 2026-04-16 — Phase 4 Closeout: Slack Integration + Approval Tracking

### Architectural Insights

**Snapshot-based Change Detection for Flat-File Systems**
When you need to detect changes between runs without a database, persist the previous state as a JSON snapshot. On the next run, compare the current state to the snapshot using a simple comparison function (`detectChanges()`). This is cheap, git-friendly (gitignore the snapshot), and works offline. The cost is losing history — if you need an audit trail, separate the status/approval data into individual files keyed by entity ID.

**Composable Message Formatting as Pure Functions**
Slack message formatting is a pure function that takes a list of entries and returns Block Kit JSON. This allows:
- Easy testing (mock data in, assertion on output)
- Decoupling from network (no API calls inside the formatter)
- Reusability (same JSON can be sent via webhook, stored, or inspected)
Block Kit structure is hierarchical (header → section → section → actions → divider), so building it programmatically is cleaner than string templates.

**Approval State as Orthogonal Concern**
Separate approval status from calendar entries by storing it in external files (`vault/status/<luma_id>.yaml`). This allows:
- Status to persist across event changes (date move, DRI update, etc. don't touch the approval)
- Non-destructive merges during sync (old statuses are simply re-read, not overwritten)
- Independent lifecycle (approval workflow is independent of event workflow)

### Spec-Crafting for AI Agents

**When specifying external integrations, nail down the error handling strategy upfront.** For Slack webhooks: "POST with 10s timeout. If the POST fails, log a warning but don't crash the sync. The sync continues."

**For approval workflows, clarify the state lifecycle.** Next time, say: "Approval status is stored in flat files, keyed by event ID. Once set, status persists across syncs unless explicitly changed. Unsynced events default to 'pending'."

### What Went Well

- TDD caught the DRY violation early (duplicated channel labels) — audit surfaced it, fix was trivial
- Change detection logic is pure and easily testable (10 tests, all passing)
- Flat-file approach means zero infrastructure setup (no database, no microservices)
- Slack notifications integrate seamlessly with existing sync pipeline (single call in sync.ts)

### Code Quality

- DRY principle maintained: unified `CHANNEL_LABELS` across slack-notifier and html-writer
- Error handling is robust: timeouts, graceful failures, proper logging
- No premature abstractions: each module has a single job (formatter, differ, status reader/writer, sender)

---

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
