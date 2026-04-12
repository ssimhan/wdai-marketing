# Decision Log

A running record of structural and strategic decisions that shape how WDAI does marketing. When in doubt about how something works, start here.

---

## [2026-04-12] Flatten Vault Directory Structure

**Decision:** Move from nested `skill/references/` subdirectories to a flat `references/` at the top level. Skill-specific reference files stay in their skill folder; shared files live at `references/`.

**Rationale:**
- Clarity: two-level max nesting is easier for both agents and humans to navigate
- Disambiguates shared vs. skill-only content — simple rule: "Is this used by >1 skill? Move to `references/`"
- Reduces duplication: captured Helen's voice and LinkedIn voice as shared references (not embedded in each promo skill)
- Removes visual noise: skill folders are now compact and focused

**What Changed:**
- `wdai-promo-planner-programmatic/` → `wdai-promo-programmatic/` (shorter, consistent naming)
- `wdai-promo-planner-adhoc/` → `wdai-promo-adhoc/`
- `leader-voices/sandhya/` → `voice-sandhya/` (drop grouping folder; future voices follow same flat pattern)
- `monthly-marketing-review/` → `monthly-review/`
- `adhoc-content-activator/` → `content-activator/`
- Skill-specific ref files moved out of `references/` subdirs into skill folders directly:
  - `ai-foundations.md`, `show-dont-tell.md`, `dashboard-spec.md`, `data-collection.md`
- Shared ref files promoted to top-level `references/`:
  - `helen-voice.md`, `linkedin-voice.md`, `email-templates.md` (to build)
- Removed duplicate LinkedIn post writing section from `wdai-visual/SKILL.md`; pointed to shared `references/linkedin-voice.md`

**Affects:**
- Vault maintainability (new skills added following flat pattern, not nested)
- Onboarding clarity (structure is visibly obvious to new team members and agents)
- Reference file discovery (shared content not hidden inside skill folders)
- Internal path references in all 5 promo/monthly/content activator skills (updated)

**Who:** Claude Code

**Status:** ✅ Complete. Structure now flat, all paths updated, MEMORY.md refreshed.

---

## [2026-04-12] Build a Marketing Context Vault

**Decision:** Create a centralized, version-controlled vault of WDAI's brand identity, voice, and marketing infrastructure. This serves as the single source of truth for Claude Code and the team on how to do marketing work at WDAI.

**Rationale:**
- WDAI's marketing work is currently scattered across Slack conversations, docs, and individual writer knowledge
- Without a structured context system, Claude Code lacks the information needed to produce on-brand content
- A vault approach (vs. inline instructions) scales: one source of truth, reusable across multiple tasks, versioned and auditable
- Modeled on successful pattern used by other organizations (e.g., Anthropic's Claude Code vaults)

**What This Includes:**
- `brand-guidelines.md` — mission, vision, values, audience, visual identity, tone principles
- `wdai-brand` voice skill — detailed encoding of WDAI's distinctive voice and anti-patterns
- `wdai-promo-planner` and `wdai-email-template` skills — reusable workflows for cohort launches and outreach
- Leader voice skills — personal voice profiles for Helen, Lauren, Madina, Sheena (collected asynchronously)
- `decision-log.md` — this file; why decisions were made
- `meeting-minutes/` — summaries of all strategic decisions (raw transcripts archived separately)

**Affects:**
- How Claude Code handles all WDAI marketing requests
- How team members onboard to marketing workflows
- How consistency is maintained across channels (email, social, web, announcements)
- Where leadership should update their voice profiles when brand or personal voice evolves

**Who:** Sandhya (led vault design + Phase 1 build), with input from Helen, Lauren, Sheena (voice profiles), Madina (if in scope)

**Status:** ✅ Phase 1 + Phase 2 substantially complete; restructured in Phase 2b

Phase 1 (Identity Layer):
- ✅ Repo structure created (and later flattened for clarity)
- ✅ Brand guidelines drafted (from foundation-platform copy)
- ✅ WDAI brand skill written (modeled on actual WDAI voice)
- ✅ Sandhya voice skill built (`skills/voice-sandhya/SKILL.md`)
- ✅ Decision log created with entries

Phase 2 (Promo Infrastructure):
- ✅ Promo planners reconciled → two separate skills (programmatic + ad-hoc)
- ✅ wdai-visual skill + linkedin-voice reference created
- ✅ Ad-hoc content activator skill created
- ✅ Monthly marketing review skill + dashboard spec + data collection guide created
- ✅ Daily content scout (React app) created in `tools/`
- 🔲 Email templates reference doc — seeded in promo skills, to be formalized in `references/email-templates.md`

**Next Decision Points:**
- Which system of record for content calendar: Notion / Airtable / Google Sheet?
- When to collect leader voice skills (immediate or staggered)? → Recommend staggered after Phase 3 kicks off
- Whether to integrate Slack announcements or keep vault URL-only?

---

*More entries to follow as decisions are made.*
