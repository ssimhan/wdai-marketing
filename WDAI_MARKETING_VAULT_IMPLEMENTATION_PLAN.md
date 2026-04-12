# WDAI Marketing Vault — Implementation Plan

> This is Sandhya's build doc. It tracks the sequence, owners, dependencies, and open decisions for standing up the vault. The README tells the team how to use the system; this doc tracks how we're building it.

---

## Build Sequence

### Phase 1 · Foundation — Identity Layer
**Goal:** Lock who WDAI is and how it sounds. Nothing else is buildable without this.

**Tasks:**

- [ ] Draft `brand-guidelines.md`
  - Mission statement (current, agreed-upon version)
  - Audience definition — who WDAI serves, who the marketing is talking to
  - Visual identity — colors (hex), typography, approved asset inventory or links
  - Tone principles — 3–5 short rules that CC can apply without needing a full voice skill

- [ ] Build `wdai-brand` voice skill
  - Based on brand guidelines above
  - Model: follow the structure of `sandhya-voice` SKILL.md — voice characteristics, anti-patterns, format by content type
  - Test: draft a cohort announcement using only this skill. If it sounds generically corporate, iterate.

- [ ] Initialize repo structure
  - Create all folders per the README structure (even if empty)
  - Write the first version of `README.md`
  - Write the first entry in `decision-log.md` — document the decision to build this vault and why

**Phase 1 is done when:** CC can draft an on-brand WDAI announcement with no additional briefing beyond the brand skill.

---

### Phase 2 · Promo Infrastructure — Operations Layer
**Dependency:** Phase 1 complete.

**Tasks:**

- [ ] Reconcile promo planner skills
  - Review `wdai-promo-planner` (current version) against Sheena's version
  - Decision: one canonical skill with stream-aware logic, or two separate skills (programmatic / ad-hoc)?
  - Log the decision in `decision-log.md`
  - Ship the reconciled skill to `/skills/wdai-promo-planner/SKILL.md`

- [ ] Build `wdai-email-template` skill
  - Input format: cohort brief (name, dates, audience, key hooks, CTA)
  - Output format: subject line + preview text + body structure (greeting, context, program details, CTA, sign-off)
  - Test with a real cohort brief before committing

- [ ] Define decision log + meeting minutes format
  - Confirm format (already in README — validate it works in practice)
  - Create `/meeting-minutes/raw/` and `/meeting-minutes/summaries/` folders
  - Backfill: add summary entries for any decisions already made about the vault build itself

**Phase 2 is done when:** A cohort brief goes in, multi-channel promo copy comes out, with no manual formatting work.

---

### Phase 3 · Content Calendar System — Operations Layer
**Dependency:** Phase 2 complete.

**Tasks:**

- [ ] Choose system of record
  - Options: Notion, Airtable, Google Sheet
  - Criteria: has a named owner, simple intake form, queryable by CC, low maintenance overhead
  - **Open decision** — needs a call or async decision with the team

- [ ] Define calendar schema
  - Required inputs per entry: program name, cohort dates, speaker confirmations, platform cadence (LinkedIn / email / Slack), promo window start date
  - Optional: notes, linked decision log entry, assigned DRI

- [ ] Build intake form or template
  - The thing that gets filled out when a new program is confirmed — feeds directly into the calendar

- [ ] Connect calendar to promo planner
  - Document how CC should query the calendar as context input for the promo skill
  - Add example prompt to README

**Phase 3 is done when:** A new cohort enters the intake form and the promo plan is generatable with only that input + the vault skills.

---

### Phase 4 · Vault Go-Live — Tools Layer
**Dependency:** Phases 1–3 complete.

**Tasks:**

- [ ] Slack integration
  - Connect vault to WDAI workspace
  - Document which channels CC should be aware of for context (e.g. #marketing, #cohort-ops, #announcements)
  - Test: CC drafts a Slack announcement into the right channel with correct tone

- [ ] Leader voice skills rollout
  - Send `SKILL-TEMPLATE.md` to all leaders with instructions (see rollout plan below)
  - Track completion status in this doc (table below)
  - Set a deadline — skills not submitted by [date TBD] default to brand voice only

- [ ] README final review
  - Confirm all paths in the README match actual repo structure
  - Confirm skills reference table is complete
  - Confirm decision log has entries covering all major vault decisions

- [ ] End-to-end test
  - New cohort → intake form → calendar entry → promo plan generated → copy drafted in brand voice + leader voice → meeting minutes logged
  - If any step breaks, fix before calling Phase 4 done

**Phase 4 is done when:** A new volunteer can onboard using only the README and vault contents, no handoff call needed.

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
| Content calendar system of record | Notion / Airtable / Google Sheet | 🔲 Not decided |
| Promo planner: one skill or two? | Canonical split vs. stream-aware logic | 🔲 Pending Sheena review |
| Meeting minutes summarizer | Manual (someone on team) vs. CC-assisted | 🔲 Not decided |
| Leader voice skill deadline | [Date TBD] | 🔲 Not set |

---

## Dependencies Map

```
Phase 1 (Identity)
  └── Phase 2 (Promo Infrastructure)
        └── Phase 3 (Content Calendar)
              └── Phase 4 (Go-Live)
                    ├── Slack integration
                    └── Leader voice skills (can run parallel to Phases 2–3)
```

Leader voice skills can be collected in parallel — don't wait for Phase 4 to send the template out.

---

*Owner: Sandhya Simhan*
*Last updated: April 2026*
