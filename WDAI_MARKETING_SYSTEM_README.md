# WDAI Marketing System — README

> This repo is the context vault and tooling layer for WDAI's marketing team. Everything Claude Code needs to do marketing work — brand identity, leader voices, promo skills, content infrastructure — lives here. If you're starting a task in CC, this is where you orient first.

---

## Repo Structure

```
/vault
  brand-guidelines.md         # WDAI identity: mission, audience, visual standards
  decision-log.md             # Running log of decisions made + rationale
  content-calendar.md         # Source of truth for scheduled content + inputs

/skills
  /wdai-brand
    SKILL.md                  # Brand voice skill — use for any WDAI-attributed content
  /wdai-promo-planner
    SKILL.md                  # Promo skill — takes a cohort brief, outputs multi-channel copy
  /wdai-email-template
    SKILL.md                  # Email skill — structured output for outbound comms
  /leader-voices
    SKILL-TEMPLATE.md         # Template for building a personal voice skill
    /lauren
      SKILL.md
    /helen
      SKILL.md
    /madina
      SKILL.md
    /[name]
      SKILL.md                # One folder per leader

/meeting-minutes
  /raw                        # Granola transcript exports — archive only, CC does not read these
  /summaries                  # Distilled decision entries — this is what CC reads
```

---

## How to Use This Repo with Claude Code

At the start of any marketing task, load the relevant context explicitly. CC has no memory between sessions — the vault only works if you reference it.

**Minimal context load (most tasks):**
```
Use the following vault context:
- Brand voice: /skills/wdai-brand/SKILL.md
- Decision log: /vault/decision-log.md
```

**For promo or content tasks:**
```
Use the following vault context:
- Brand voice: /skills/wdai-brand/SKILL.md
- Promo planner: /skills/wdai-promo-planner/SKILL.md
- Content calendar: /vault/content-calendar.md
- Decision log: /vault/decision-log.md
```

**For content written in a specific leader's voice:**
```
Use the following vault context:
- Brand voice: /skills/wdai-brand/SKILL.md
- [Name]'s voice: /skills/leader-voices/[name]/SKILL.md
```

**Rule of thumb:** if CC produces something off-brand or off-tone, the first question is whether the right skills were loaded. Check context before re-prompting.

---

## Skills Reference

### `wdai-brand`
Use for any content published under the WDAI brand — social posts, program announcements, newsletters, event copy. This is the floor: all other skills build on top of it.

### `wdai-promo-planner`
Use when launching a cohort, workshop, or event. Input: a cohort brief (dates, audience, program name, key hooks). Output: multi-channel promo copy for LinkedIn (WDAI page + individual leaders), email, and Slack.

### `wdai-email-template`
Use for structured outbound emails — invitations, cohort announcements, follow-ups. Takes the same cohort brief format as the promo planner.

### Leader voice skills (`/skills/leader-voices/[name]/SKILL.md`)
Use when drafting content in a specific leader's voice — LinkedIn posts, speaker bios, personal announcements. Each skill is self-authored by the leader using the template at `/skills/leader-voices/SKILL-TEMPLATE.md`. If a skill doesn't exist yet for a leader, use the brand skill and flag it for the leader to set up.

---

## Decision Log

`/vault/decision-log.md` is the canonical "why did we do it this way" reference. Every structural decision — a skill change, a platform choice, a process shift — should have an entry.

**Entry format:**
```
## [YYYY-MM-DD] [Short decision title]
**Decision:** What was decided
**Rationale:** Why
**Affects:** Which skills, files, or processes this touches
**Who:** Who was in the room
```

If you're reading a skill or a process and wondering why it works the way it does, the decision log is where you look.

---

## Meeting Minutes

Raw Granola transcripts live in `/meeting-minutes/raw/` — these are archived for reference but CC does not read them directly.

Summarized decision entries live in `/meeting-minutes/summaries/` — distilled to what matters, in the decision log format above. After any meeting where a structural decision is made, someone on the team is responsible for adding a summary entry.

**The rule:** if a decision isn't in the log, it doesn't exist as far as the vault is concerned.

---

## Adding a New Leader Voice Skill

1. Copy `/skills/leader-voices/SKILL-TEMPLATE.md` into a new folder: `/skills/leader-voices/[name]/SKILL.md`
2. Follow the template instructions — it's designed to be self-serve. Expect 30–45 minutes to complete it well.
3. Test it: ask CC to draft a LinkedIn post in your voice using only the skill as context. If the output doesn't sound like you, iterate on the skill before using it in production.
4. Notify the marketing lead when your skill is ready so it can be added to the skills reference above.

---

## Keeping the Vault Current

The vault degrades if it isn't maintained. Ownership:

| Asset | Owner | Update trigger |
|---|---|---|
| `brand-guidelines.md` | Marketing lead | Any brand refresh or audience shift |
| `wdai-brand` skill | Marketing lead | After brand guidelines update |
| `wdai-promo-planner` skill | Programmatic stream lead | After any promo process change |
| `decision-log.md` | Whoever made the decision | After any structural change |
| `content-calendar.md` | Content stream lead | Rolling — updated as programs are confirmed |
| Leader voice skills | Each leader individually | Self-maintained |

---

*Last updated: April 2026*
