# WDAI Marketing Vault

> This repository is the context vault and tooling layer for WDAI's marketing team. Everything Claude Code needs to do marketing work — brand identity, leader voices, promo workflows, content infrastructure — lives here.

This is the **single source of truth** for how WDAI communicates. When starting a marketing task in Claude Code, load the relevant context from this vault first.

---

## Quick Start

**For a new cohort launch (programmatic course):**
```
Load vault context in this order:
1. /vault/brand-guidelines.md
2. /skills/wdai-brand/SKILL.md
3. /skills/wdai-promo-programmatic/SKILL.md
4. /skills/wdai-promo-programmatic/ai-foundations.md (if AI Foundations cohort)
5. /skills/wdai-promo-programmatic/show-dont-tell.md (if Show Don't Tell event)
```

**For event/milestone promotion (ad-hoc):**
```
Load vault context in this order:
1. /vault/brand-guidelines.md
2. /skills/wdai-brand/SKILL.md
3. /skills/wdai-promo-adhoc/SKILL.md
4. /vault/linkedin-voice.md
5. /vault/helen-voice.md (for Helen's posts)
```

**For leadership content (bylined article, speaker bio):**
```
Load vault context in this order:
1. /vault/brand-guidelines.md
2. /skills/wdai-brand/SKILL.md (foundation)
3. /skills/voice-[name]/SKILL.md (their personal voice)
4. /vault/decision-log.md (optional: for context on WDAI's approach)
```

**For any marketing task:**
```
Always load these three:
1. /vault/brand-guidelines.md (mission, audience, visual identity)
2. /skills/wdai-brand/SKILL.md (voice + tone)
3. /vault/decision-log.md (context on why decisions were made)
```

---

## Repository Structure

```
/vault/                      # Brand identity, shared references, and decisions
  brand-guidelines.md       # WDAI mission, vision, values, audience, visual identity, tone
  decision-log.md           # Running log of "why we did it this way"
  content-calendar.md       # (Phase 3 TBD) source of truth for scheduled content
  linkedin-voice.md         # WDAI LinkedIn-specific voice + real post examples
  helen-voice.md            # Helen's personal Slack voice patterns
  email-templates.md        # (Pending) subject line formulas, body structures, CTA patterns

/skills/
  /wdai-brand/
    SKILL.md                # WDAI brand voice — baseline for all WDAI content
  /wdai-visual/
    SKILL.md                # WDAI visual identity (colors, typography, logo, patterns)
  /wdai-promo-programmatic/
    SKILL.md                # AI Basics / Intermediate / Advanced cohort launch workflows
    ai-foundations.md       # Timeline, owners, Advanced tier opt-in, email templates
    show-dont-tell.md       # SDT monthly cadence, Carolyn's voice, post-session loop
  /wdai-promo-adhoc/
    SKILL.md                # Event / speaker / milestone / membership drive promotion
  /content-activator/
    SKILL.md                # Raw content signal → activation plan + Google Sheet brief
  /monthly-review/
    SKILL.md                # Monthly marketing performance dashboard + analysis
    dashboard-spec.md       # Full HTML/CSS/JS for the interactive dashboard
    data-collection.md      # Chrome navigation + Slack/Google Calendar MCP steps
  /voice-sandhya/
    SKILL.md                # Sandhya's personal writing voice
  /voice-[name]/            # (Pending) One file per leader voice
    SKILL.md

/tools/
  /calendar/
    sync.ts                 # CLI entry point: fetch → map → render → write
    luma-client.ts          # Luma API client with mock mode
    mapper.ts               # LumaEvent → CalendarEntry transformer
    writer.ts               # CalendarEntry[] → markdown generator
    types.ts                # Type definitions for Luma and calendar entries
    __fixtures__/
      luma-events.json      # Mock fixture for local testing
    __tests__/              # Full test coverage (vitest)
  /daily-content-scout/
    README.md               # How the React app works
    app.jsx                 # React app: 7 Slack passes → ideas channel

/meeting-minutes/
  /raw/                     # (Future) Granola transcript exports (archive)
  /summaries/               # (Future) Distilled decision entries
```

---

## Skills Overview

| Skill | Use For | Input | Output |
|---|---|---|---|
| **wdai-brand** | Any WDAI-attributed content (announcements, email, social, web) | Topic + context | Draft copy in WDAI voice |
| **wdai-visual** | Design + image generation for presentations, web, docs, graphics | Format type (HTML/PPT/Word/social/image) + brief | Design spec + image prompts |
| **wdai-promo-programmatic** | AI Basics / Intermediate / Advanced cohort launches | Cohort brief (dates, audience, hooks, email CTA) | 4-phase multi-channel promo plan |
| **wdai-promo-adhoc** | Speaker events, She Builds, IWD, milestones, membership drives | Event brief (date, speaker, type, Luma link) | 2-phase multi-channel promo plan |
| **content-activator** | Turn raw content signals → structured activation plan | Slack paste, scout result, or member story | Activation plan + Google Sheet brief |
| **monthly-review** | Monthly marketing dashboard + KPI analysis | Data collection (step-by-step from skills) | Interactive HTML dashboard report |
| **voice-[name]** | Bylined content in a specific leader's voice | Topic + context | Draft copy in that leader's voice |

### Phase Status

**✅ Phase 1 Complete** — Identity Layer
- brand-guidelines.md: mission, vision, values, audience, visual identity
- wdai-brand skill: 8 voice characteristics, anti-patterns, format-specific rules
- decision-log.md: documented rationale for vault approach

**✅ Phase 2 Complete** — Promo Infrastructure
- Two separate promo skills: programmatic (cohorts) + ad-hoc (events/speakers)
- wdai-visual skill: colors, typography, logo, patterns, image generation guidance
- content-activator: raw signal → activation plan + Google Sheet brief
- monthly-review: dashboard + data collection walkthrough
- daily-content-scout: React app (7 Slack passes → ideas channel)
- *Pending:* `vault/email-templates.md` (seeded in promo skills, to be formalized)

**✅ Phase 3 Complete (2026-04-14)** — Content Calendar System
- **Block A**: Luma Calendar Sync
  - TypeScript CLI script fetches WDAI events from Luma API → `vault/content-calendar.md`
  - Mock mode works locally; real API mode gated by LUMA_API_KEY secret
  - Daily GitHub Actions cron (6am UTC) auto-syncs calendar if events change
  - TDD coverage: 32 tests passing, 1 skipped (live API gated)
- **Block B**: HTML Viewer + Promo Rules System
  - Self-contained `vault/content-calendar.html` with three-tab viewer (By Date, By Event, How to Edit)
  - `promo-rules.yaml` defines per-event-type DRI + channel timeline rules
  - `overrides.yaml` allows per-event customization without overwriting rules
  - Mapper enriches calendar entries with DRI and structured channel moments
  - Rules-loader with graceful fallback for missing config files
- **Block C**: CC Integration
  - Promo skills updated to load `content-calendar.md` as context
  - README shows how to reference calendar in prompts
- **Open items (start next session)**: Fill in `promo-rules.yaml`, run live API smoke test

**🔲 Phase 4 Pending** — Vault Go-Live
- Slack integration: which channels CC monitors for context
- Leader voice skills rollout: email template to Lauren, Helen, Madina, Sheena
- End-to-end test: intake form → calendar → promo plan → draft → meeting minutes

**🔲 Phase 5 Pending** — Copy Status Workflow
- Copy status field (Not started → In progress → Approved → Sent) in calendar
- Promo status dashboard

**🔲 Phase 6 Pending** — Advanced Features (TBD)
- Automated email generation, optional Slack posting, analytics integration

**🔲 Phase 7 Pending** — Team Onboarding & Handoff
- Documentation, voice skill templates, maintenance runbook

---

## Content Calendar

**Status:** Live (Phase 3 Block A)

`/vault/content-calendar.md` is the single source of truth for:
- Program dates and cohort launches
- Event types (AI Basics, AI Intermediate, AI Advanced, Show Don't Tell, etc.)
- DRI (directly responsible individual) for each initiative
- Promo window opens (14 days before event start, by default)
- Copy status tracking (Not started → In progress → Approved → Sent)

**How it's generated:**
```bash
npm run calendar:sync:mock          # Local: uses mock fixture
LUMA_API_KEY=<key> npm run calendar:sync  # Live: fetches from Luma API
```

**Automation:**
Daily GitHub Actions workflow (6am UTC) syncs real WDAI events from Luma → commits updated calendar if changed.

**Usage in Claude Code:**
Load this when planning content sprints or responding to "what should we announce when?" questions.
See Phase 4 for promo timeline generation from calendar entries.

---

## Decision Log

`/vault/decision-log.md` tracks the **why** behind how WDAI does marketing. Every major decision about voice, process, tools, or structural choices gets an entry.

**When to read it:** If you're wondering "why do we do it this way?" or if a request seems to conflict with established practice, check the decision log first.

**Format:**
```
## [YYYY-MM-DD] Decision Title

**Decision:** What was decided

**Rationale:** Why (constraints, context, business goals)

**Affects:** Which skills, files, or processes this touches

**Who:** Who was in the room or responsible

**Status:** Current progress
```

---

## Meeting Minutes

Raw Granola transcripts live in `/meeting-minutes/raw/` (archived for reference only; CC does not read these).

Summarized decision entries live in `/meeting-minutes/summaries/` (distilled to decision log format). After any meeting where a strategic decision is made, someone on the team is responsible for adding a summary entry.

**The rule:** If a decision isn't in the log or a summary, it doesn't exist as far as the vault is concerned.

---

## Onboarding a New Team Member

1. **Read the README** (this file) to understand structure
2. **Skim `/vault/brand-guidelines.md`** to understand WDAI's mission, vision, and tone principles
3. **Read `/skills/wdai-brand/SKILL.md`** — this is the practical encoding of how to write like WDAI
4. **Scan `/vault/decision-log.md`** to see what decisions have been made and why
5. **If you're a leader:** Create your voice skill by copying `/skills/voice-sandhya/SKILL.md` as a template and filling it out

---

## Adding a New Leader Voice Skill

1. **Copy the template:**
   ```
   /skills/voice-sandhya/SKILL.md → /skills/voice-[name]/SKILL.md
   ```

2. **Self-author it** following the template prompts (30–45 minutes)

3. **Test it** by asking Claude Code to draft a LinkedIn post in your voice using only this skill as context. If it doesn't sound like you, iterate before committing.

4. **Notify Sandhya** when it's ready so it can be added to the skills reference above.

---

## Keeping the Vault Current

The vault degrades if it isn't maintained.

| Asset | Owner | Update Trigger |
|---|---|---|
| `brand-guidelines.md` | Sandhya | Any brand refresh or audience shift |
| `wdai-brand` skill | Sandhya | After brand guidelines update |
| `wdai-promo-planner` skill | [Cohort ops DRI] | After any promo process change |
| `wdai-email-template` skill | [Comms DRI] | After any email template change |
| `decision-log.md` | Whoever made the decision | After any structural change |
| `content-calendar.md` | [Content stream lead] | Rolling — updated as programs are confirmed |
| Leader voice skills | Each leader individually | Self-maintained as their voice evolves |

---

## Using the Vault with Claude Code

**Minimal context load (most tasks):**
```
Use the following vault context:
- Brand voice: /wdai-marketing/skills/wdai-brand/SKILL.md
- Brand guidelines: /wdai-marketing/vault/brand-guidelines.md
- Decision log: /wdai-marketing/vault/decision-log.md
```

**For promo or content tasks:**
```
Use the following vault context:
- Brand voice: /wdai-marketing/skills/wdai-brand/SKILL.md
- Promo planner: /wdai-marketing/skills/wdai-promo-programmatic/SKILL.md (or wdai-promo-adhoc)
- Content calendar: /wdai-marketing/vault/content-calendar.md  ← load this for real event dates + channel plans
- Brand guidelines: /wdai-marketing/vault/brand-guidelines.md
- Decision log: /wdai-marketing/vault/decision-log.md
```

**For content in a leader's voice:**
```
Use the following vault context:
- Brand voice: /wdai-marketing/skills/wdai-brand/SKILL.md
- [Name]'s voice: /wdai-marketing/skills/voice-[name]/SKILL.md
- Brand guidelines: /wdai-marketing/vault/brand-guidelines.md
```

**Pro tip:** CC will do best if you're explicit about *which* context you're using. It helps CC understand the scope and avoid overgeneralizing.

---

## Reference: Skills Index

| Skill | Purpose | Status |
|---|---|---|
| `wdai-brand` | All WDAI-attributed content; baseline voice | ✅ Live |
| `wdai-promo-planner-programmatic` | AI Basics / Intermediate / Advanced cohort launches | ✅ Live |
| `wdai-promo-planner-adhoc` | Workshops, masterclasses, events, milestones | ✅ Live |
| `wdai-email-template` | Structured email templates for outreach | 🔲 In design |
| `leader-voices/sandhya` | Sandhya's personal voice for bylined work | ✅ Live |
| `leader-voices/[lauren]` | Lauren's personal voice | 🔲 Pending |
| `leader-voices/[helen]` | Helen's personal voice | 🔲 Pending |
| `leader-voices/[madina]` | Madina's personal voice | 🔲 Pending |
| `leader-voices/[sheena]` | Sheena's personal voice | 🔲 Pending |

---

## Questions?

- **How do I draft something in WDAI's voice?** Load `wdai-brand` skill + `brand-guidelines.md`
- **How do I know if my content is on-brand?** Check against the anti-patterns and voice checklist in `wdai-brand` skill
- **Why do we do X this way?** Check `/vault/decision-log.md`
- **When should we announce Y?** Check `/vault/content-calendar.md` (when live)

---

*Last updated: 2026-04-14 (Phase 3 Block A complete) by Sandhya Simhan*
