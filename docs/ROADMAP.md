# WDAI Marketing Automation — Roadmap

## Vision

**Fully automated marketing pipeline:** Events from Luma → calendar sync → Slack approval → AI copy generation → per-leader approval → auto-publish to LinkedIn and Mailchimp.

**Why:** Sandhya and the team want a system where the only manual steps are approval gates in Slack. Everything before and after is automated.

**Target:** System fully operational by **May 1, 2026**. Phases 4–5 are hard deadline. Phases 6–7 are stretch.

---

## Phase Status Summary

| Phase | Goal | Status | Blocks |
|-------|------|--------|--------|
| **Phase 3** | Content Calendar (Luma sync + change detection) | ✅ Complete (2026-04-16) | None |
| **Phase 4** | Vercel + Slack Approval Loop | ✅ A/B/D1 done · ⏳ C/D2 pending | Vercel org setup |
| **Phase 5** | AI Copy Generation + Per-Leader Approval | ✅ A/B/C/D done · ⏳ E pending | Vercel org setup |
| **Phase 6** | Auto-Publishing (LinkedIn + Mailchimp) | ✅ Complete (2026-04-18) | None |
| **Phase C** | Design System Integration | ✅ Complete (2026-04-18) | None |
| **Phase 7** | Leader Onboarding + Personal OAuth | 📋 Design phase | Phases 4/5/6 complete |

---

## ✅ Completed Phases

### Phase 3: Content Calendar System (2026-04-16)
**Goal:** Sync Luma events → calendar markdown + HTML, detect changes, notify team.

**Delivered:**
- Luma API client with mock mode
- Event mapper (Luma → WDAI calendar entry)
- Calendar markdown + HTML writers
- Change detection + diff reporting
- GitHub Actions sync (daily, 6am UTC)
- 74 unit tests (vitest)

**Files:** `tools/calendar/` (sync.ts, luma-client.ts, mapper.ts, writer.ts, html-writer.ts, diff.ts, status.ts)

---

### Phase 4: Vercel + Slack Approval Loop (Partial)
**Goal:** Slack notifications + approval buttons → approve promo plan before copy generation.

**Blocks Done:**
- **A** — Slack webhook notification client + Block Kit formatting (`slack-notifier.ts`)
- **B** — Approval status tracking + calendar badges (`status.ts`)
- **D1** — Slack interaction endpoint signature verification + `approve_plan` handler (`api/slack/interactions.ts`)

**Blocks Pending:**
- **C** — Vercel project setup + team authentication (manual, Helen's access needed)
- **D2** — Wire `approve_plan` handler to Vercel (blocked on C)

**Plan:** [`docs/plans/2026-04-16-phase-4-vercel-slack.md`](plans/2026-04-16-phase-4-vercel-slack.md)

---

### Phase 5: AI Copy Generation + Per-Leader Approval (Partial)
**Goal:** After plan approval, generate channel-specific copy using Claude; DM leaders for approval.

**Blocks Done:**
- **A** — Copy data model + flat-file storage in `vault/promos/` (`copy-store.ts`)
- **B** — Copy generator (prompt builder + Claude API calls) (`copy-generator.ts`, `prompt-builder.ts`)
- **C** — Copy display in calendar viewer (HTML badges + modal panels) (`html-writer.ts`)
- **D** — Slack DM dispatcher + leader approval buttons (`slack-dm.ts`, `copy-review.ts`) ✅ Live

**Blocks Pending:**
- **E** — Slack interaction handlers for `approve_copy`, `edit_copy`, edit modal (blocked on Vercel)

**Plan:** [`docs/plans/2026-04-16-phase-5-copy-generation.md`](plans/2026-04-16-phase-5-copy-generation.md)

**Current State:** Leaders receive Slack DMs with copy drafts and Approve/Edit buttons (UI-only, no backend yet).

---

### Phase 6: Auto-Publishing (LinkedIn + Mailchimp) (2026-04-18)
**Goal:** Read `status: 'approved'` copy drafts and publish them — LinkedIn org page API, Mailchimp campaign drafts.

**Delivered:**
- **A1** — Publisher scaffold (`publisher.ts`, `runPublish()`, dry-run + channel filter)
- **A2** — LinkedIn API client (`linkedin-client.ts`, UGC Posts endpoint, 15s timeout)
- **A3** — Mailchimp API client (`mailchimp-client.ts`, campaigns + content endpoints, Basic auth)
- **A4** — CLI entry point + env var documentation (`.env.example`)

**New npm script:** `calendar:publish -- --event <id> [--all] [--dry-run] [--channel <channel>]`

**New env vars documented:**
```
LINKEDIN_ACCESS_TOKEN
LINKEDIN_ORGANIZATION_ID
MAILCHIMP_API_KEY
MAILCHIMP_SERVER_PREFIX
MAILCHIMP_AUDIENCE_ID
```

**Tests:** 6 new tests, all passing. Full suite: 179/179 passing.

**Files:** `tools/calendar/{publisher,linkedin-client,mailchimp-client,http-utils}.ts`

---

### Phase C: Design System Integration (2026-04-18)
**Goal:** Commit the existing `skills/wdai-design-system/` skill (SKILL.md already complete) and apply brand tokens + Figtree font to calendar HTML.

**Delivered:**
- **C1** — Design system skill committed + SKILL.md complete
- **C2** — Figtree font loaded from Google Fonts, brand color tokens applied to `vault/content-calendar.html` (pink, orange, navy, lavender, tints)
- Fixed self-referencing CSS variable bug (`--pink-tint: var(--pink-tint)` → `rgba(233,53,131,0.07)`)

**Design system contents:**
- `colors_and_type.css` — 40+ CSS custom properties
- `slides/` — 12 responsive HTML slide templates
- `ui_kits/microsite/` — React lesson hub + slide deck components
- `preview/` — 24 component demo pages
- `SKILL.md` — complete (no changes needed)

**Changes:** Only CSS const in `vault/content-calendar.html`. Calendar HTML is regenerated on every sync.

**Tests:** 179/179 passing (no regressions).

**Files:** `vault/content-calendar.html`, `skills/wdai-design-system/` (untracked → committed)

---

## 🔒 Blocked on External Gates

### Vercel Org Setup (Blocks Phase 4 Block C, Phase 5 Block E)

**Current state:** Manual setup needed in Vercel admin. Helen's access grant pending.

**What's needed:**
1. Connect repo to Vercel project (Framework: Other, Output Dir: `vault`)
2. Enable Vercel Authentication, add team emails
3. Push `vercel.json` config (already in Phase 4 plan)
4. Set env vars in Vercel dashboard
5. Update Slack app Interactivity URL to point to Vercel deployment

**Once live, build in order:**
1. Phase 4 Block D2 — `approve_plan` handler wired to Vercel
2. Phase 5 Block E — `approve_copy`, `edit_copy` handlers + edit modal UI

**Plan reference:** [Phase 4 Block C](plans/2026-04-16-phase-4-vercel-slack.md#chunk-c1-vercel-project-setup-1-hour-mostly-manual)

---

### Slack App Admin Approval (Blocks team-wide deployment)

**Current state:** App submitted for admin approval on 2026-04-17.

**What's pending:** Org admin review before app can be installed to the workspace.

**Impact:** The Slack bot for notifications and interactions needs org admin sign-off. Until approved, only Sandhya's workspace has it running.

---

## 📋 Future Phases (Stretch)

### Phase 7: Leader Onboarding + Personal LinkedIn OAuth
**Goal:** Enable each leader to post copy to their personal LinkedIn profile (not just org page). Collect voice profiles per leader.

**Features:**
- OAuth flow per leader to capture personal LinkedIn tokens
- Per-leader voice calibration guides
- Team training + ops runbook
- Docs + maintenance procedures

**When:** After Phases 4–5 are 100% complete. Leadership approval on scope.

**Plan:** To be designed. References:
- [`TEAM_TRAINING.md`](TEAM_TRAINING.md) — draft training materials
- [`RUNBOOK.md`](RUNBOOK.md) — operational procedures

---

## Completed Work Summary

| Capability | Status | Where |
|------------|--------|-------|
| Sync pipeline (Luma → calendar files) | ✅ | Phase 3 |
| Change detection + diff reporting | ✅ | Phase 3 |
| Slack channel notifications (webhook) | ✅ | Phase 4 |
| Approval status tracking + calendar badges | ✅ | Phase 4 |
| Copy data model + flat-file storage | ✅ | Phase 5 |
| AI copy generation (Claude + voice guides) | ✅ | Phase 5 |
| Copy display in calendar viewer | ✅ | Phase 5 |
| Slack DM copy review (dispatch + buttons) | ✅ | Phase 5 |
| Slack interaction endpoint + signature verification | ✅ | Phase 4 |
| **Auto-publishing (LinkedIn + Mailchimp)** | 🚀 Ready | Phase 6 |
| **Design system integration** | 🚀 Ready | Phase C |

---

## Implementation Timeline

```
TODAY (2026-04-18)
  Phase 6: 1 day (auto-publishing)
  Phase C: 2 hours (design system)
  
2026-04-19
  Phase 6 + C: Complete ✅
  
2026-04-20–30
  Waiting: Vercel setup
  
May 1, 2026 (Target)
  Phase 4 Block D2 + Phase 5 Block E: Live (copy approval UI)
  System: Fully operational
```

---

## Related Docs

- **[NEXT.md](../NEXT.md)** — Quick reference for what's ready to build
- **[PROJECT_HISTORY.md](PROJECT_HISTORY.md)** — Decision log + rationale
- **[TEAM_TRAINING.md](TEAM_TRAINING.md)** — How to use the system (ops perspective)
- **[RUNBOOK.md](RUNBOOK.md)** — Maintenance + troubleshooting
- **[BUGS.md](BUGS.md)** — Active issues (currently empty)

---

## Plans Index

| Date | Phase | Title | Status |
|------|-------|-------|--------|
| 2026-04-12 | 3 | [Calendar Sync](plans/2026-04-12-calendar-sync.md) | ✅ Shipped |
| 2026-04-14 | 3b/3c | [Phase 3b+3c](plans/2026-04-14-phase-3b-3c.md) | ✅ Shipped |
| 2026-04-14 | Design | [Promo Planner Design](plans/2026-04-14-promo-planner-design.md) | 📋 Design |
| 2026-04-16 | 4 | [Phase 4: Vercel + Slack](plans/2026-04-16-phase-4-vercel-slack.md) | ✅ Partial |
| 2026-04-16 | 5 | [Phase 5: Copy Generation](plans/2026-04-16-phase-5-copy-generation.md) | ✅ Partial |
| 2026-04-18 | 6 + C | [Phase 6: Publishing + Design](plans/2026-04-18-phase-6-publish.md) | 🚀 Ready |
