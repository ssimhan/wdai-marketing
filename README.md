# WDAI Marketing Vault

> This repository is the context vault and tooling layer for WDAI's marketing team. Everything Claude Code needs to do marketing work — brand identity, leader voices, promo workflows, content infrastructure — lives here.

This is the **single source of truth** for how WDAI communicates. When starting a marketing task in Claude Code, load the relevant context from this vault first.

---

## Quick Start

**For a new cohort launch:**
```
Use vault context:
- Brand voice: /skills/wdai-brand/SKILL.md
- Promo planner: /skills/wdai-promo-planner/SKILL.md
- Brand guidelines: /vault/brand-guidelines.md
- Decision log: /vault/decision-log.md
```

**For leadership content in a specific voice:**
```
Use vault context:
- Brand voice: /skills/wdai-brand/SKILL.md
- [Name]'s voice: /skills/leader-voices/[name]/SKILL.md
- Brand guidelines: /vault/brand-guidelines.md
```

**For any marketing task:**
```
Always start with:
- Brand voice: /skills/wdai-brand/SKILL.md
- Brand guidelines: /vault/brand-guidelines.md
- Decision log: /vault/decision-log.md (if you need context on *why* something works a certain way)
```

---

## Repository Structure

```
/vault/
  brand-guidelines.md       # WDAI mission, vision, values, audience, visual identity, tone
  decision-log.md           # Running log of "why did we do it this way"
  content-calendar.md       # (Coming soon) source of truth for scheduled content

/skills/
  /wdai-brand/
    SKILL.md                # WDAI brand voice — use for all WDAI-attributed content
  /wdai-promo-planner/
    SKILL.md                # (Coming soon) multi-channel promo copy from cohort brief
  /wdai-email-template/
    SKILL.md                # (Coming soon) email structure for outreach & campaigns
  /leader-voices/
    /sandhya/
      SKILL.md              # Sandhya's personal writing voice
    /[name]/
      SKILL.md              # One folder per leader

/meeting-minutes/
  /raw/                     # Granola transcript exports (archive, CC does not read)
  /summaries/               # Distilled decision entries (this is what CC reads)
```

---

## How Each Skill Is Used

### `wdai-brand`
Use for any content published under WDAI's name or the platform as a whole: website copy, email campaigns, cohort announcements, social posts, guides, landing pages. This is the **baseline voice**—all other skills build on top of it.

**When you need this:** Always. It's the foundation.

### `wdai-promo-planner` (Phase 2)
Use when launching a cohort, workshop, or event. Inputs a cohort brief (dates, audience, program name, key hooks). Outputs multi-channel promo copy for LinkedIn (WDAI page + individual leaders), email, and Slack.

**When you need this:** Cohort launch planning, event promotion, campaign rollout.

### `wdai-email-template` (Phase 2)
Use for structured outreach emails: cohort invitations, announcements, follow-ups. Takes the same cohort brief format as the promo planner.

**When you need this:** Any email campaign or outreach that needs consistent structure.

### Leader Voice Skills (`/leader-voices/[name]/SKILL.md`)
Use when drafting content in a specific leader's voice — LinkedIn posts, speaker bios, personal announcements, bylined articles. Each skill is self-authored by the leader and reflects their actual voice, style, and preferences.

**When you need this:** Content attributed to a specific leader by name.

---

## Content Calendar (Coming Soon)

`/vault/content-calendar.md` will be the single source of truth for:
- Program dates and cohort launches
- Promo timelines and platform cadences
- Key announcements and milestone dates
- DRI (directly responsible individual) for each initiative

Once live, you'll load this context when planning content sprints or responding to "what should we announce when?" questions.

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
5. **If you're a leader:** Create your voice skill by copying `/skills/leader-voices/sandhya/SKILL.md` as a template and filling it out

---

## Adding a New Leader Voice Skill

1. **Copy the template:**
   ```
   /skills/leader-voices/SKILL-TEMPLATE.md → /skills/leader-voices/[name]/SKILL.md
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
- Promo planner: /wdai-marketing/skills/wdai-promo-planner/SKILL.md
- Content calendar: /wdai-marketing/vault/content-calendar.md
- Brand guidelines: /wdai-marketing/vault/brand-guidelines.md
- Decision log: /wdai-marketing/vault/decision-log.md
```

**For content in a leader's voice:**
```
Use the following vault context:
- Brand voice: /wdai-marketing/skills/wdai-brand/SKILL.md
- [Name]'s voice: /wdai-marketing/skills/leader-voices/[name]/SKILL.md
- Brand guidelines: /wdai-marketing/vault/brand-guidelines.md
```

**Pro tip:** CC will do best if you're explicit about *which* context you're using. It helps CC understand the scope and avoid overgeneralizing.

---

## Reference: Skills Index

| Skill | Purpose | Status |
|---|---|---|
| `wdai-brand` | All WDAI-attributed content; baseline voice | ✅ Live |
| `wdai-promo-planner` | Multi-channel cohort launch campaigns | 🔲 In design |
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

*Last updated: April 2026 by Sandhya Simhan*
