---
name: wdai-promo-planner-adhoc
description: "Use for non-cohort WDAI events and initiatives: workshops, masterclasses, guest speaker sessions, community events, one-off announcements, milestone celebrations. Input an event brief → output multi-channel promo copy: WDAI LinkedIn post, leader LinkedIn post template, email announcement, Slack announcement. Always pair with wdai-brand skill for voice."
---

# Promo Planner — Ad-Hoc Events & Initiatives

Use this skill for anything that isn't a standard AI Basics / Intermediate / Advanced cohort launch. That includes:
- Workshops (single-session, hands-on)
- Masterclasses (guest expert, topic-specific)
- Community events (AMAs, meetups, panels)
- Milestone announcements (member count, partnerships, awards)
- Open enrollment windows or membership drives
- Regional events (UK, other chapters)

---

## Required Input: Event Brief

When invoking this skill, provide the following:

```
event_type: "workshop" | "masterclass" | "ama" | "meetup" | "panel" | "milestone" | "membership_drive" | "other"
event_name: e.g. "Claude Code Masterclass: Build Your First Agent"
date: e.g. "Thursday, April 17"
time: e.g. "11:00 AM PT / 2:00 PM ET"
duration: e.g. "90 minutes"
speaker_or_host: [name + title/org if relevant]
topic_summary: [1–3 sentences on what attendees will learn or experience]
who_it_is_for: [who this is best suited for — specific, not "anyone"]
luma_url or registration_url: [link]
key_hooks: [optional — what's notable, surprising, or timely about this event]
audience_context: [optional — "open to public" | "members only" | "leaders only"]
```

---

## Output: Four Pieces of Copy

For each event, produce all four in order. Label each section clearly.

---

### 1. WDAI LinkedIn Post (Brand Account)

**When:** 1–2 weeks before the event (or immediately for milestone announcements).

**Structure:**
- Line 1: The event, specific and direct. Name, date, what it is.
- Lines 2–3: What attendees will walk away with. Concrete — skill, tool, output, insight.
- Line 4 (optional): Speaker credential or proof point (one sentence, not a bio).
- Final line: CTA + link.

**Tone:** Conviction without hype. No "incredible opportunity" or "you don't want to miss this." Let the content speak.

**Format:** Short paragraphs, 1–3 lines each. No bullet lists. End with link.

**By event type:**

- **Workshops:** Lead with the skill/tool being taught. Specificity is the hook ("You'll leave with a working Claude Code agent" > "You'll learn about AI tools")
- **Masterclasses:** Lead with the speaker's credibility anchor, then the topic. Not a bio — one telling detail.
- **Panels/AMAs:** Lead with the question or tension being explored. Make it feel like a conversation worth being in.
- **Milestones:** Lead with the number or achievement. Brief reflection on what it means. Gratitude, not chest-thumping.
- **Membership drives:** Lead with the "why now" — what's happening in the community that makes this a good moment to join.

**Example (workshop):**

> Claude Code Masterclass: Build Your First Agent — Thursday, April 17.
>
> In 90 minutes, you'll go from zero to a working AI agent: set up Claude Code, write your first prompt chain, and debug it live. No prior coding experience required — just a laptop and curiosity.
>
> Led by [Name], who's been building with Claude Code since its beta launch.
>
> Open to all WDAI members. Spots are limited.
> 👉 [link]

**Example (milestone):**

> 1,000 members.
>
> When we started WDAI in 2023, it was a study group. A few friends figuring out AI together.
>
> A thousand women and nonbinary leaders later — building in public, asking questions without fear, shipping their first agents — we're still figuring it out. Just not alone anymore.
>
> Thank you for being part of this.

---

### 2. Leader LinkedIn Post Template

**When:** Same window as WDAI post or staggered 2–3 days.

**Purpose:** Personal, first-person promotion from a WDAI leader in their own voice. Output a template with `[BRACKETS]` for personalization.

**Structure:**
- Line 1: Personal connection to this topic or event — why the leader cares.
- Lines 2–3: What the event is + the one thing that makes it worth showing up for.
- Line 4: Who should come (specific).
- Final line: CTA + link.

**Note to user:** Pair this template with the leader's voice skill (`/skills/leader-voices/[name]/SKILL.md`) to rewrite in their specific voice before sending.

**Example template (masterclass):**

> [Why this topic matters to you personally — 1–2 sentences. What you've seen, built, or struggled with that makes this feel relevant.]
>
> On [date] we're hosting [event name] with [speaker name]. [One sentence on what attendees will actually do or learn — the concrete thing, not the vibe.]
>
> This is for [specific audience — "members who've completed AI Basics" or "founders building with AI" or "anyone who's been wanting to try Claude Code but hasn't started"].
>
> Come ready to build.
> 👉 [link]

---

### 3. Email Announcement

**When:** 1–2 weeks before event (or immediately for milestone/membership drives).

**Structure:**

```
Subject line: [varies by type — see formulas below]
Preview text: [One-line hook — the most compelling specific detail]

Body:

[Greeting]

[Event name and date — first sentence. No preamble.]

[2–3 sentences on what this is and what attendees walk away with. Specific over vague.]

[Who it's for — 1 sentence. Helps self-select.]

[Optional: speaker credential or community proof point — 1 sentence max.]

[CTA — single, clear]
[Button: "Save your spot →" or "Register →"]
[Link]

[Sign-off]
Women Defining AI 💜
```

**Subject line formulas by event type:**

| Type | Formula |
|------|---------|
| Workshop | `[Workshop] [Topic] — [Date]` |
| Masterclass | `[Name] is joining us: [Topic] — [Date]` |
| Panel/AMA | `Live: [Question or Topic] — [Date]` |
| Milestone | `[Number/achievement]: a note from us` |
| Membership drive | `Doors open: join WDAI [Season]` |

**Tone:** Same as always — lead with the news. No "We're thrilled to invite you" opener.

---

### 4. Slack Announcement

**When:** 1 week before for events; immediately for milestones. Post in `#announcements` or relevant channel.

**Structure:**
- Line 1: Bold announcement. What it is, when.
- Line 2: The one-sentence pitch.
- Line 3 (optional): Who it's for / any requirements.
- Final line: CTA + link.

**Tone:** Community voice. Emoji okay. Keep it short — Slack readers don't read walls of text.

**Example (AMA):**

> 📣 **AMA with [Name] — [Date] at [Time] PT**
>
> [Name] is [one compelling credential]. She's joining us to answer your questions about [topic].
>
> Open to all members. Drop your questions in [#channel] before the session.
>
> 👉 [link]

**Example (milestone):**

> 💜 **1,000 members.**
>
> Thank you for being here. We're celebrating this week — details in #announcements.

---

## Promo Timeline by Event Type

| Event type | Start promo | Reminder |
|------------|------------|---------|
| Workshop | 2 weeks before | 3 days before + day-of Slack |
| Masterclass | 2 weeks before | 1 week + 2 days before |
| Panel/AMA | 1–2 weeks before | Day-of Slack |
| Milestone | Day of | — |
| Membership drive | At open | Midpoint + close reminder |

---

## Anti-Patterns for Ad-Hoc Promo

- Never lead with "We're excited to announce..." — lead with the event or the insight
- Don't use "you don't want to miss this" — let the content earn the RSVP
- Don't call every event "incredible" or "game-changing" — specificity builds more credibility
- Don't write a speaker bio in the post — one credibility anchor is enough
- For milestone posts: don't be corporate or triumphalist — be warm and specific

---

*Pair with: `wdai-brand` skill for voice, leader voice skill for personalized leader posts.*
*Last updated: April 2026*
