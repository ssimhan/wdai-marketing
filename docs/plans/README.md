# Implementation Plans

Detailed, bite-sized implementation plans for each phase of the WDAI marketing automation system.

---

## How to Use

1. **Find your phase** in the list below
2. **Read the plan** to understand the architecture and block structure
3. **Use `/build`** to execute the plan
4. **Use `/audit`** after building to verify quality
5. **Use `/closeout`** to commit and document

---

## Plans by Status

### 🚀 Ready to Build (No Blockers)

| Date | Phase | Title | Est. Time |
|------|-------|-------|-----------|
| **2026-04-18** | **Phase 6 + C** | [**Phase 6: Publishing + Design System**](2026-04-18-phase-6-publish.md) | 1 day + 2 hrs |

**What:** Auto-publish approved copy to LinkedIn (org page) and Mailchimp (campaign drafts). Commit design system skill and apply brand tokens to calendar HTML.

**Blocks:** Phase 6 (A1–A4), Phase C (C1–C2)

**Start here:** See [Part A](2026-04-18-phase-6-publish.md#part-a-phase-6--auto-publishing) for Phase 6 and [Part C](2026-04-18-phase-6-publish.md#part-c-design-system-integration) for Design System.

---

### ✅ Completed

| Date | Phase | Title | Status |
|------|-------|-------|--------|
| 2026-04-16 | Phase 3 | [Calendar Sync](2026-04-12-calendar-sync.md) | Shipped |
| 2026-04-16 | Phase 4 (partial) | [Vercel + Slack Approval Loop](2026-04-16-phase-4-vercel-slack.md) | ✅ A/B/D1 · ⏳ C/D2 |
| 2026-04-16 | Phase 5 (partial) | [AI Copy Generation + Per-Leader Approval](2026-04-16-phase-5-copy-generation.md) | ✅ A/B/C/D · ⏳ E |

---

### ⏳ Blocked (Awaiting Vercel Setup)

| Date | Phase | Title | Blocks |
|------|-------|-------|--------|
| 2026-04-16 | Phase 4 (remainder) | [Vercel + Slack Approval Loop](2026-04-16-phase-4-vercel-slack.md#block-c-vercel-project-setup) | **Block C:** Vercel setup (Helen's access) · **Block D2:** Wire handlers |
| 2026-04-16 | Phase 5 (remainder) | [AI Copy Generation + Per-Leader Approval](2026-04-16-phase-5-copy-generation.md#block-e-slack-interaction-handlers) | **Block E:** Slack modal UI for copy approval (Vercel dependent) |

**To unblock:** Helen grants Vercel org access, follow [Phase 4 Block C setup steps](2026-04-16-phase-4-vercel-slack.md#chunk-c1-vercel-project-setup-1-hour-mostly-manual).

---

### 📋 Design Phase (Sketch Phase, Not Yet Planned)

| Phase | Title | Notes |
|-------|-------|-------|
| Phase 7 | Leader Onboarding + Personal LinkedIn OAuth | To be designed after Phases 4–5 complete |

---

## Plan Structure

Each plan follows this format:

- **Context:** Why this phase, what it builds on
- **Goal & Architecture:** One-sentence goal, architectural approach
- **Design Patterns:** Patterns used (Factory, Repository, Strategy, etc.)
- **Tech Stack:** Dependencies and libraries
- **Blocks:** Logical groupings of work (e.g., Block A, Block B)
  - **Success Criteria:** Checkboxes for what must be true
  - **Files:** What gets created/modified
  - **Chunks:** Bite-sized TDD cycles (RED-GREEN-REFACTOR-COMMIT)
- **Technical Debt:** Known shortcuts for future cleanup
- **Verification:** How to test end-to-end

---

## Quick Navigation

**I want to build Phase 6 (publishing):**
→ Start with [`2026-04-18-phase-6-publish.md`](2026-04-18-phase-6-publish.md), Part A (Blocks A1–A4)

**I want to integrate the design system:**
→ Start with [`2026-04-18-phase-6-publish.md`](2026-04-18-phase-6-publish.md), Part C (Blocks C1–C2)

**I need to understand Phase 5 (copy generation):**
→ Read [`2026-04-16-phase-5-copy-generation.md`](2026-04-16-phase-5-copy-generation.md) — the hard part is done, just Block E (Slack UI) remains

**I'm waiting on Vercel for Phase 4/5 handlers:**
→ See [ROADMAP.md → Blocked on External Gates](../ROADMAP.md#-blocked-on-external-gates)

---

## Legend

- ✅ **Complete** — shipped and working
- 🚀 **Ready to Build** — designed, no blockers
- ⏳ **In Progress** — partially done, remaining blocks planned
- 🔒 **Blocked** — waiting on external dependency
- 📋 **Design Phase** — needs initial design before detailed planning

---

## Related Documents

- [ROADMAP.md](../ROADMAP.md) — Full system roadmap with phase status
- [NEXT.md](../../NEXT.md) — Quick reference for what's ready to build
- [PROJECT_HISTORY.md](../PROJECT_HISTORY.md) — Decision log and historical context
