# Decision Log

A running record of structural and strategic decisions that shape how WDAI does marketing. When in doubt about how something works, start here.

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

**Status:** Phase 1 (Identity Layer) in progress
- ✅ Repo structure created
- ✅ Brand guidelines drafted (from foundation-platform copy)
- ✅ WDAI brand skill written (modeled on actual WDAI voice)
- 🔲 Sandhya voice skill moved to `/skills/leader-voices/sandhya/`
- 🔲 First decision log entry written (this one)

**Next Decision Points:**
- Should promo planner be one skill or split by cohort stream (programmatic/ad-hoc)?
- Which system of record for content calendar (Notion/Airtable/Google Sheet)?
- When to collect leader voice skills (immediate or staggered)?
- Whether to integrate Slack announcements or keep vault URL-only

---

*More entries to follow as decisions are made.*
