# Vault Build Decisions — April 2026

Summary of key decisions made during Phase 1 and Phase 2 of the vault build. No single meeting; decisions were made asynchronously by Sandhya as the vault was constructed.

---

## Build a Marketing Context Vault

**Decision:** Create a centralized, version-controlled vault of WDAI brand identity, voice, and marketing infrastructure as the single source of truth for Claude Code and the team.

**Rationale:** Marketing work was scattered across Slack, docs, and individual knowledge. Without a structured context system, Claude Code can't produce on-brand content reliably. A vault approach scales: one source of truth, reusable across tasks, versioned and auditable.

**Affects:** All marketing content generation; team onboarding; brand consistency across channels.

**Who:** Sandhya

**Status:** ✅ Phase 1 + Phase 2 substantially complete.

---

## Two Promo Planner Skills (Programmatic + Ad-Hoc)

**Decision:** Split into two separate skills — `wdai-promo-programmatic` and `wdai-promo-adhoc` — rather than one combined skill.

**Rationale:** Token-efficient; use case is obvious at invocation time (cohort launch vs. reactive post). Sheena's existing workflow used as base; email sections and anti-patterns added.

**Affects:** `skills/wdai-promo-programmatic/`, `skills/wdai-promo-adhoc/`

**Who:** Sandhya (reconciled with Sheena's version)

**Status:** ✅ Complete.

---

## Email Templates as Shared Reference

**Decision:** Email template guidance lives in `references/email-templates.md` rather than embedded in each promo skill.

**Rationale:** Both promo planners use email copy; a shared reference avoids duplication and keeps a single source of truth.

**Affects:** `references/email-templates.md` (to be formalized), both promo planner skills.

**Who:** Sandhya

**Status:** 🔲 Seeded in promo skills; formal doc deferred pending email content confirmation from Sheena.

---

## Flat Vault Directory Structure

**Decision:** Flat `references/` at the root level (not nested inside skills). Two-level max nesting throughout.

**Rationale:** Easier to navigate for both agents and humans. Clear rule: "used by >1 skill → `references/`; skill-specific → skill folder."

**Affects:** Vault structure, all internal skill path references.

**Who:** Claude Code (Sandhya approved)

**Status:** ✅ Complete.
