---
name: wdai-promo-planner-programmatic
description: "Use for standard WDAI cohort launches: AI Basics (15 lessons, 3 weeks), AI Intermediate (10 lessons, 2 weeks), AI Advanced (15 lessons, 3 weeks, M/W/F office hours). Input a cohort brief → output multi-channel promo copy: WDAI LinkedIn post, leader LinkedIn post template, email announcement, and Slack announcement. Always pair with wdai-brand skill for voice."
---

# Promo Planner — Programmatic Cohorts

Use this skill when launching a new cohort of AI Basics, AI Intermediate, or AI Advanced.

---

## Required Input: Cohort Brief

When invoking this skill, provide the following:

```
course: "AI Basics" | "AI Intermediate" | "AI Advanced"
cohort_name: e.g. "Summer 2026" or "S26"
cohort_number: e.g. 7          # total number of cohorts run for this course
kickoff_date: e.g. "Monday, June 9"
live_session_schedule: e.g. "M/Th 10am PT for 3 weeks"
live_session_time: e.g. "10:00 AM PT / 1:00 PM ET"
luma_url: e.g. "https://lu.ma/..."
key_hooks: [optional list of 1–3 things that make this cohort notable]
enrollment_open: true | false   # whether enrollment is still open
audience_context: [optional — e.g. "targeted at existing members" or "open to public"]
```

---

## Output: Four Pieces of Copy

For each cohort, produce all four in order. Label each section clearly.

---

### 1. WDAI LinkedIn Post (Brand Account)

**When:** 1–2 weeks before kickoff.

**Structure:**
- Line 1: The announcement, specific and direct. Course name, season/cohort, kickoff date.
- Lines 2–4: What this cohort covers or what members will walk away with. Concrete.
- Line 5: One proof point — community stat, member outcome, or previous cohort result.
- Final line: CTA + Luma link.

**Tone:** WDAI brand voice — conviction, specificity, peer-to-peer. No generic opener.

**Format:** Short paragraphs, 1–3 lines each. No bullet lists. End with link.

**Cohort-specific hooks:**
- **AI Basics:** "zero to experimenting" arc, no technical background needed, the 15-lesson daily email format, live sessions included
- **AI Intermediate:** Custom AI assistant build, 10 days, hands-on throughout
- **AI Advanced:** Office hours format (M/W/F), Claude Code focus, for members who've completed Basics or Intermediate

**Example (AI Basics):**

> AI Basics Summer 2026 kicks off June 9th.
>
> Over 3 weeks, you'll go from "I've heard of ChatGPT" to comparing models, going multimodal, working with data, and actually understanding what AI can and can't do—one lesson a day, delivered to your inbox.
>
> The last cohort had 200+ members ship their first AI project. Some went from curious to using AI daily at work. A few changed roles.
>
> Enrollment is open now. Spots fill fast.
> 👉 [luma link]

---

### 2. Leader LinkedIn Post Template

**When:** Same window as WDAI post, or staggered by 2–3 days.

**Purpose:** Personal, first-person post from a WDAI leader promoting the cohort in their own voice. Output a *template* with `[BRACKETS]` for the leader to personalize.

**Structure:**
- Line 1: Personal hook — what this course meant to the leader, a member they remember, or a moment that stands out.
- Lines 2–3: What the course is (briefly) + what surprised them or what they're proud of.
- Line 4: Who this is for (specific, not vague).
- Final line: CTA + Luma link.

**Tone:** Warm, personal, peer-to-peer. Not a corporate announcement — sounds like a text from someone who's actually excited.

**Note to user:** Pair this template with the leader's voice skill (`/skills/leader-voices/[name]/SKILL.md`) to rewrite in their specific voice before sending.

**Example template (AI Basics):**

> [What made you start WDAI / what you were seeing when you decided to run this course — 1–2 sentences of personal context.]
>
> AI Basics [Season] starts [date]. It's 15 daily emails over 3 weeks — no technical background needed, just curiosity and 10–15 minutes a day. Live sessions on [days] at [time].
>
> [One thing you've seen members do after completing the course — specific, not vague.]
>
> If you've been wanting to actually learn this stuff — not just read about it — this is the one.
> 👉 [luma link]

---

### 3. Email Announcement

**When:** 1–2 weeks before kickoff. Sent to existing Mailchimp audience (non-enrolled members, lapsed members, prospective subscribers).

**Structure:**

```
Subject line: [AI [Course]] [Season] cohort kicks off [date] — enrollment open
Preview text: [One-line hook about what they'll walk away with]

Body:

[Greeting — warm, first-name if personalized]

[Course] [Season] starts [date].

[2–3 sentences on what the cohort covers and what members walk away with. Specific.]

[1 sentence on the community piece — live sessions, Slack, peer learning.]

[Optional: one member outcome or quote from a previous cohort.]

[CTA — single, clear]
[Button: "Reserve your spot →" or "Join [Course] [Season] →"]
[Luma URL]

[Sign-off — warm, from the team]
Women Defining AI 💜
```

**Subject line formulas by course:**
- Basics: `[AI Basics] [Season] starts [date] — enrollment open`
- Intermediate: `[AI Intermediate] [Season]: 10 days to build your custom AI assistant`
- Advanced: `[AI Advanced] [Season] kicks off [date] — office hours format`

**Tone:** Peer-to-peer. Lead with the news. No preamble, no "We're so excited to announce."

---

### 4. Slack Announcement

**When:** 1–2 weeks before kickoff. Post in `#announcements` (or equivalent cohort channel).

**Structure:**
- Line 1: Bold announcement. Course, season, kickoff date.
- Line 2–3: What it is + who it's for.
- Line 4: Live session schedule (specific days/times).
- Line 5: CTA + link.

**Tone:** Warm community voice. Can use emoji naturally. Shorter than LinkedIn — Slack readers scan.

**Example (AI Intermediate):**

> 📣 **AI Intermediate S26 kicks off Monday, March 9.**
>
> 10 daily lessons on building your own custom AI assistant — from personalizing an LLM to adding knowledge, tools, and getting user feedback.
>
> For members who've completed AI Basics or have equivalent hands-on experience.
>
> Live sessions Mon 3/9, Thu 3/12, Mon 3/16, Thu 3/19 at 10am PT / 1pm ET.
>
> Enrollment → [luma link]

---

## Course Quick-Reference

| Course | Length | Format | Live sessions | Key outcome |
|--------|--------|--------|--------------|-------------|
| AI Basics | 15 lessons / 3 weeks | Daily email M–F | M/Th | Go from zero to experimenting across models, modalities, data |
| AI Intermediate | 10 lessons / 2 weeks | Daily email M–F | M/Th | Build a custom AI assistant end-to-end |
| AI Advanced | 15 lessons / 3 weeks | Daily email M/W/F | M/W/F (office hours) | Claude Code, agents, advanced prompting |

---

## Promo Timeline (Standard)

| When | What |
|------|------|
| 2 weeks before kickoff | WDAI LinkedIn post + email announcement |
| 10 days before | Leader LinkedIn post |
| 1 week before | Slack announcement to existing community |
| 2 days before | Email reminder (subject: "Starting Monday — [Course] [Season]") |
| Day of kickoff | Slack reminder: "We're live today!" |

---

## Anti-Patterns for Cohort Promo

- Never open with "We're so excited to announce..." — lead with the fact
- Never say "Join our community" as the CTA — say what they're joining and when
- Don't say "limited spots" unless it's actually true
- Don't describe the course as "immersive" or "transformative" — show outcomes instead
- Don't use bullet lists on LinkedIn — kills the scroll

---

*Pair with: `wdai-brand` skill for voice, leader voice skill for personalized leader posts.*
*Last updated: April 2026*
