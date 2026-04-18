# WDAI Marketing Vault — 7-Phase Roadmap

## Phase 1: Identity Layer ✅
- [x] brand-guidelines.md (mission, vision, values, audience, visual identity)
- [x] wdai-brand skill (voice characteristics, anti-patterns, format-specific rules)
- [x] decision-log.md

## Phase 2: Promo Infrastructure ✅
- [x] wdai-promo-programmatic skill (AI Basics, Intermediate, Advanced cohort launches)
- [x] wdai-promo-adhoc skill (events, speakers, milestones, membership drives)
- [x] wdai-visual skill (colors, typography, logo, patterns, image generation)
- [x] content-activator skill (raw signal → activation plan + Google Sheet brief)
- [x] monthly-review skill (dashboard + data collection)
- [x] daily-content-scout (React app: 7 Slack passes → ideas channel)
- [x] email-templates.md (seeded in promo skills)

## Phase 3: Content Calendar System ✅

### Block A: Luma Calendar Sync ✅
- [x] TypeScript project scaffolding
- [x] Type system (LumaEvent, CalendarEntry, LumaListResponse)
- [x] Mock fixture (2 sample events)
- [x] Luma client (fetch with pagination, mock + live modes)
- [x] Mapper (classification, date math, pure functions)
- [x] Markdown writer (summary table + detail blocks)
- [x] CLI sync script (fetch → map → render → write)
- [x] GitHub Actions daily cron
- [x] Test coverage (15 tests, 1 skipped)

### Block B: HTML Viewer + Promo Rules ✅
- [x] PromoMoment, PromoRules, OverridesMap types
- [x] promo-rules.yaml + overrides.yaml configs (filled with real DRI + moments)
- [x] rules-loader (graceful file-load with YAML parse)
- [x] Mapper enrichment (rules + overrides priority logic)
- [x] Markdown channel plan table renderer
- [x] HTML viewer (three-tab: By Date, By Event, How to Edit)
- [x] Sync orchestration (load rules, write both .md + .html)
- [x] CC integration (promo skills + README updated)
- [x] Cache-aside layer (TTL cache, LUMA_FORCE bypass, gitignored)
- [x] Live API smoke test passed (197 real events)
- [x] Test coverage (33 tests, 1 skipped)

### Block C: CC Integration ✅
- [x] Update promo-programmatic skill with calendar context
- [x] Update promo-adhoc skill with calendar context
- [x] README shows how to load content-calendar.md as CC context

## Phase 4: Vercel + Slack Approval Loop ✅
### Block A: Slack Notification Pipeline ✅
- [x] Slack Block Kit message formatter (pure function)
- [x] Change detection (new/changed events between syncs)
- [x] Webhook sender + sync integration
- [x] GitHub Actions: Slack notification after sync

### Block B: Approval Status Tracking ✅
- [x] Status data model (ApprovalStatus type, flat-file reader/writer)
- [x] Status integration into pipeline + HTML viewer badges

### Block C: Vercel Deployment + Auth ⏳ deferred
- [ ] Deploy vault/ as static site, vercel.json config
- [ ] Vercel Authentication (magic links, whitelisted team emails)

### Block D: Slack Interactive Approval ✅
- [x] Approve/Edit buttons on Slack messages (D1)
- [x] Vercel serverless endpoint for button callbacks → updates status via GitHub API (D2 — completed as part of Phase 5)

## Phase 5: Copy Generation + Per-Leader Approval ✅
### Block A: Copy Data Model ✅
- [x] Copy data model + flat-file storage (vault/promos/<event-id>/)
- [x] CopyDraft, CopyStatus types with approval workflow fields
- [x] copy-store.ts: read/write YAML for per-event copy

### Block B: Voice Guides ✅
- [x] voice-loader.ts loads brand, LinkedIn, Helen voice guides from vault
- [x] Graceful fallback for missing files (returns empty string)

### Block C: Prompt Building ✅
- [x] prompt-builder.ts combines event + moment + voice guides into system/user prompts
- [x] Channel-specific voice injection (LinkedIn, Slack, email)

### Block D: Copy Generation (partial) ✅
- [x] copy-generator.ts calls Anthropic API (claude-haiku-4-5-20251001)
- [x] generate.ts CLI: `calendar generate-copy --event <id> --channel <channel>`
- [x] Timeout + retry logic (60s, single retry)
- [x] Skips moments with existing approved copy

### Block E: HTML Viewer Integration ✅
- [x] Copy display in calendar HTML viewer (status badges, copy panels)
- [x] renderChannelPlanMd() shows copy excerpt alongside moment plan
- [x] copyStatusBadge() shows 🔲/🟡/✅/📤 status

### Block F: Slack Interactions ✅
- [x] Vercel serverless endpoint (api/slack/interactions.ts)
- [x] Slack signature verification (timing-safe HMAC-SHA256)
- [x] Handle "approve" action: fetch status file, update, PUT via GitHub API
- [x] vercel.json routing + environment variable configuration
- [x] 11 comprehensive unit tests for signature, GitHub ops, routing

### Block G: Slack DM Copy Review ✅ (2026-04-18)
- [x] `slack-dm.ts`: `sendCopyReviewDM` (Bot token, chat.postMessage, 10s timeout)
- [x] `slack-dm.ts`: `formatCopyReviewMessage` Block Kit (header, event context, copy, Approve/Edit buttons)
- [x] `copy-review.ts`: `dispatchCopyReviews` — routes to moment DRI, skips approved/published
- [x] `generate.ts`: `--notify` flag triggers DM dispatch after generation
- [x] `team.yaml`: DRI name → Slack user ID map
- [x] `slack-utils.ts`: `slackPost`, `encodeButtonValue`, `decodeButtonValue`, `getMoment` (shared utilities)
- [x] 25 new tests; 154 total passing

## HTML Viewer UX Improvements ✅ (2026-04-18)
- [x] Hide past events by default in By Date and By Event tabs; add "Show past events" toggle button to reveal them
- [x] Slack moments already show specific WDAI Slack channel (e.g. #general) and DRI name before approving the plan

## Phase 5B: Leader Voice Integration ✅ (2026-04-18)
- [x] Load DRI's personal voice skill (vault/skills/voice-helen/) during copy generation
- [x] Inject personal voice into prompt after brand + channel guides
- [x] Graceful fallback if skill doesn't exist

## Phase 6: Auto-Publishing (org channels only)
- [ ] WDAI LinkedIn auto-post (org page API token)
- [ ] Mailchimp draft creation (hooks into existing wdai-mc system)
- [ ] Mailchimp auto-send (optional, behind a flag)
- [ ] Publishing status tracked in vault

## Phase 7: Leader Onboarding + Handoff (Partial ✅ 2026-04-18)
- [x] Maintenance runbook (docs/RUNBOOK.md)
- [x] Team training guide (docs/TEAM_TRAINING.md)
- [ ] Voice skill calibration per leader (Helen, Lauren, Madina, Sheena)
- [ ] Personal LinkedIn OAuth flow per leader

---

## Next Up: Phase 5 Block A — Copy Data Model + Storage
