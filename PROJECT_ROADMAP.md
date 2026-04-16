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

## Phase 4: Vault Go-Live
- [ ] Slack integration (which channels CC monitors for context)
- [ ] Leader voice skills rollout (email template to Lauren, Helen, Madina, Sheena)
- [ ] End-to-end test (intake form → calendar → promo plan → draft → meeting minutes)

## Phase 5: Copy Status Workflow
- [ ] Copy status field (Not started → In progress → Approved → Sent) tracked in calendar
- [ ] Promo status dashboard (what's drafted, what's approved, what ships when)

## Phase 6: Advanced Features (TBD)
- [ ] Automated email generation from promo rules
- [ ] Slack posting automation (optional, deferred)
- [ ] Analytics integration (post reach, conversion tracking)

## Phase 7: Team Onboarding & Handoff
- [ ] Documentation for new team members
- [ ] Voice skill templates for leaders
- [ ] Maintenance runbook

---

## Next Up: Phase 4 — Vault Go-Live
