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

## Phase 4: Vercel + Slack Approval Loop ✅ (Blocks A/B/D1 complete; C/D2 deferred)

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

### Block D: Slack Interactive Approval (D1 complete; D2 deferred)
- [x] Approve/Edit buttons on Slack messages (D1 ✅)
- [ ] Vercel serverless endpoint for button callbacks → updates status via GitHub API (D2 — needs Vercel live)

## Phase 5: Copy Generation + Per-Leader Approval
See `docs/plans/2026-04-16-phase-5-copy-generation.md` for full plan.
- [ ] Copy data model + flat-file storage (vault/promos/<event-id>/)
- [ ] AI drafts copy per channel using voice guides from vault
- [ ] CLI: `calendar generate-copy --event <id>`
- [ ] Copy displayed in HTML calendar viewer
- [ ] Slack DMs to DRI with approve/edit buttons
- [ ] Edit modal for copy revisions
- [ ] Interaction endpoint (completes Phase 4 C/D2 as part of this block)

## Phase 6: Auto-Publishing (org channels only)
- [ ] WDAI LinkedIn auto-post (org page API token)
- [ ] Mailchimp draft creation (hooks into existing wdai-mc system)
- [ ] Mailchimp auto-send (optional, behind a flag)
- [ ] Publishing status tracked in vault

## Phase 7: Leader Onboarding + Handoff
- [ ] Personal LinkedIn OAuth flow per leader
- [ ] Voice skill calibration per leader
- [ ] Docs, maintenance runbook
- [ ] Team training on the content calendar

---

## Next Up: Phase 5 Block A — Copy Data Model + Storage
