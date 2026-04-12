# WDAI Marketing Vault — Implementation Plan

> This is Sandhya's build doc. It tracks the sequence, owners, dependencies, and open decisions for standing up the vault. The README tells the team how to use the system; this doc tracks how we're building it.

---

## Build Sequence

### Phase 1 · Foundation — Identity Layer
**Goal:** Lock who WDAI is and how it sounds. Nothing else is buildable without this.

**Tasks:**

- [x] Draft `brand-guidelines.md`
  - ✅ Mission statement (from foundation-platform repo)
  - ✅ Audience definition (from foundation-platform)
  - ✅ Visual identity (colors with hex, typography, asset links)
  - ✅ Tone principles (8 core characteristics + anti-patterns)

- [x] Build `wdai-brand` voice skill
  - ✅ 8 voice characteristics + anti-patterns + format-specific rules
  - ✅ Self-check calibration + quick reference table
  - ✅ Fixed contrast-framing conflict (valid for LinkedIn, marked per platform)

- [x] Initialize repo structure
  - ✅ Folder structure created and organized
  - ✅ README.md built with skills index and onboarding guide
  - ✅ decision-log.md with initial entries documenting build rationale
  - ✅ Vault restructured for clarity: flat references/, consistent skill naming

**Phase 1 is done when:** CC can draft an on-brand WDAI announcement with no additional briefing beyond the brand skill.

---

### Phase 2 · Promo Infrastructure — Operations Layer
**Dependency:** Phase 1 complete.

**Tasks:**

- [x] Reconcile promo planner skills
  - ✅ Compared my version vs. Sheena's; detailed feature matrix created
  - ✅ Decision: two separate skills (Option B) — token-efficient, obvious disambiguation
  - ✅ Logged decision in `decision-log.md`
  - ✅ Shipped: `skills/wdai-promo-programmatic/` + `skills/wdai-promo-adhoc/`
  - ✅ Integrated Sheena's workflow as base; added email sections + anti-patterns

- [x] Build email template guidance
  - Approach: shared reference document (`references/email-templates.md`) rather than standalone skill
  - Rationale: both promo planners reference email copy as part of their workflow; a shared reference avoids duplication and maintains single source of truth
  - Format: subject line formulas, preview text patterns, body structure templates, CTA patterns by event type
  - Status: deferred pending email content confirmation from Sheena; partially seeded in promo planner phases (AI Foundations email subject patterns, membership drive email)

- [x] Define decision log + meeting minutes format
  - ✅ Format confirmed (README documents the pattern)
  - ✅ `/meeting-minutes/raw/` and `/meeting-minutes/summaries/` folders initialized
  - ✅ Backfilled: `meeting-minutes/summaries/2026-04-vault-build-decisions.md`

**Phase 2 is done when:** A cohort brief goes in, multi-channel promo copy comes out, with no manual formatting work.

---

---

## Build Philosophy

Each phase is broken into **blocks** (logical groupings of work) and **chunks** (1–2 hour units of focused work). Never start a chunk without a clear done condition. Never scope a chunk larger than 2 hours — split it instead.

```
Phase → Block → Chunk (1–2h each)
```

---

### Phase 3 · Content Calendar Foundation — *Make It Work*
**Dependency:** Phase 2 complete.
**Decision:** Markdown as source of truth, synced from Luma API. HTML viewer in repo. CC reads markdown as context. Google Calendar sync is a future optional step.

**Block A: Luma Sync Script**
- [ ] Chunk 1: Explore Luma API — authenticate, list events, map fields to calendar schema
- [ ] Chunk 2: Define markdown calendar schema (program name, dates, Luma event ID, type, status, promo window)
- [ ] Chunk 3: CLI script `calendar sync` — fetches Luma events, writes/updates `vault/content-calendar.md`

**Block B: HTML Viewer**
- [ ] Chunk 1: Design viewer layout — timeline view, status badges, channel columns
- [ ] Chunk 2: Build static HTML viewer (`tools/content-calendar/index.html`) that renders from the markdown

**Block C: CC Integration**
- [ ] Chunk 1: Update promo planner skills to accept calendar as context input; add example prompt to README
- [ ] Chunk 2: End-to-end test — sync Luma → read calendar → generate promo plan with no extra input

**Phase 3 is done when:** `calendar sync` runs, markdown updates, HTML renders it, and CC generates a promo plan from calendar context alone.

---

### Phase 4 · Promo Planning Pipeline — *Make It Work → Right*
**Dependency:** Phase 3 complete.

**Block A: Structured Plan Output**
- [ ] Chunk 1: Define plan output schema — channel, moment label, scheduled date, assigned leader/DRI, copy status
- [ ] Chunk 2: Update promo planner skills to emit structured output (not just freeform markdown)

**Block B: Calendar Write-Back**
- [ ] Chunk 1: CLI script `calendar update-plan` — writes approved plan moments back into `content-calendar.md`
- [ ] Chunk 2: Per-moment draft copy stored in repo (`drafts/<event-slug>/<moment-slug>.md`)

**Block C: Vault Cleanup**
- [ ] Chunk 1: Leader voice skills rollout — send template to Lauren, Helen, Madina, Sheena
- [ ] Chunk 2: README final review — confirm all paths, skills index, decision log complete

**Phase 4 is done when:** Promo plan generates → moments written back to calendar → per-moment drafts stored in repo.

---

### Phase 5 · Approval Workflow — *Make It Right*
**Dependency:** Phase 4 complete.
**Decision:** GitHub PRs as the approval mechanism — version-controlled, auditable, leader-accessible without needing CLI access.

**Block A: PR-Based Review**
- [ ] Chunk 1: Script `calendar submit-for-review` — opens a GitHub PR per event with all draft copy files, tagged by channel owner/leader
- [ ] Chunk 2: PR template — structured checklist per channel (Slack ✓, LinkedIn ✓, Email ✓), with leader name in reviewer list
- [ ] Chunk 3: Approval status synced back to `content-calendar.md` when PR is merged

**Block B: Voice Skill Feedback Loop** *(requires leader voice skills from Phase 4)*
- [ ] Chunk 1: When a leader edits copy in a PR, extract the delta — what they changed and why — as a candidate voice skill update
- [ ] Chunk 2: Script to surface suggested voice skill updates for Sandhya to review and merge
- [ ] Note: This block depends on leader voice skills being live. Do not start until at least 2 leader skills are complete.

**Phase 5 is done when:** Draft copy → GitHub PR → leader reviews/edits → merged → calendar marked approved → voice skill updates surfaced.

---

### Phase 6 · Distribution — *Make It Fast*
**Dependency:** Phase 5 complete (approved copy exists).

**Block A: Mailchimp**
- [ ] Chunk 1: Wire approved email drafts from `drafts/` into `mailchimp-cc` pipeline — use existing `campaign update` command
- [ ] Chunk 2: Test end-to-end: approved draft → Mailchimp campaign updated + scheduled

**Block B: LinkedIn**
- [ ] Chunk 1: LinkedIn API integration — authenticate, post on behalf of WDAI org
- [ ] Chunk 2: Script `distribute linkedin` — posts approved LinkedIn drafts at scheduled time

**Block C: Slack**
- [ ] Chunk 1: Slack API integration — authenticate, identify target channels per moment
- [ ] Chunk 2: Script `distribute slack` — posts approved Slack drafts to correct channels

**Phase 6 is done when:** Approved copy auto-posts to Mailchimp, LinkedIn, and Slack at scheduled times.

---

### Phase 7 · Full Automation — *Make It Fast*
**Dependency:** Phase 6 complete.

**Block A: Cron Job**
- [ ] Chunk 1: Cron job — Luma event created/updated → `calendar sync` runs automatically
- [ ] Chunk 2: Cron job — scheduled distribution moments trigger `distribute` commands at correct times

**Block B: Monitoring**
- [ ] Chunk 1: Pipeline status view in HTML viewer — per-event status (synced / planned / drafted / approved / sent)
- [ ] Chunk 2: Failed post alerts — Slack DM to Sandhya if any distribution step fails

**Phase 7 is done when:** Luma event created → calendar syncs → promo plan generated → drafts created → PR opened → approved → posted. Zero manual steps required.

---

## Leader Voice Skills — Rollout Tracker

| Leader | Skill status | Notes |
|---|---|---|
| Lauren | 🔲 Not started | |
| Helen | 🔲 Not started | |
| Madina | 🔲 Not started | |
| Sheena | 🔲 Not started | |
| [Add others] | | |

**Rollout process:**
1. Share `SKILL-TEMPLATE.md` with each leader — include a brief note explaining what it's for and how it will be used
2. Allow 2 weeks for self-serve completion
3. Sandhya spot-checks each skill once submitted — test with a LinkedIn post prompt
4. Merge into repo once validated

**Message to send leaders:**

> Hey [name] — we're building a marketing context vault for WDAI that lets us generate content in each leader's voice using Claude Code. I need you to fill out a voice skill template — it takes about 30–45 minutes and is basically a structured way to capture how you write and communicate. I'll use it to make sure anything drafted for you actually sounds like you. Template is here: [link]. No CC experience needed to fill it out — it's just writing prompts. Let me know if you have questions.

---

## Open Decisions

| Decision | Options | Status |
|---|---|---|
| Content calendar system of record | Notion / Airtable / Google Sheet / Markdown | ✅ Decided: markdown in repo, synced from Luma API |
| Google Calendar sync | Built-in vs. optional later | ✅ Decided: optional future step via `mailchimp-cc` CLI |
| Approval workflow | Slack / GitHub PR / email | ✅ Decided: GitHub PRs — auditable, leader-accessible |
| Voice skill feedback loop | Manual update vs. CC-assisted delta extraction | ✅ Decided: CC-assisted in Phase 5 Block B, after leader skills are live |
| Promo planner: one skill or two? | Canonical split vs. stream-aware logic | ✅ Decided: TWO skills (programmatic + ad-hoc); token-efficient |
| Email template: skill or reference? | Standalone skill vs. shared reference doc | ✅ Decided: shared `vault/email-templates.md` (both planners reference it) |
| Vault folder structure | Nested references/ vs. flat vault/ | ✅ Decided: merged into flat `vault/` — all shared context in one place |
| Meeting minutes summarizer | Manual vs. CC-assisted | 🔲 Not decided |
| Leader voice skill deadline | [Date TBD] | 🔲 Not set |

---

## Dependencies Map

```
Phase 1 (Identity)
  └── Phase 2 (Promo Infrastructure)
        └── Phase 3 (Content Calendar Foundation)   ← current
              └── Phase 4 (Promo Planning Pipeline)
                    └── Phase 5 (Approval Workflow)
                          └── Phase 6 (Distribution)
                                └── Phase 7 (Full Automation)

Leader voice skills — collect in parallel from Phase 4 onward
Voice skill feedback loop (Phase 5 Block B) — requires ≥2 leader skills complete
```

Leader voice skills can be collected in parallel — don't wait for Phase 5 to send the template out.

---

*Owner: Sandhya Simhan*
*Last updated: April 2026 — expanded to 7-phase automation pipeline*
