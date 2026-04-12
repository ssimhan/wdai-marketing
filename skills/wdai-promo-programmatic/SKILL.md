---
name: program-promotion-planner
description: "Builds a full multi-channel promotion plan for a scheduled WDAI recurring program — AI Foundations cohorts (4–6 week runway) or Show Don't Tell (2–3 week runway). Use this skill whenever Sheena, Sandhya, Carolyn Roth, or any WDAI team member says 'create a promotion plan', 'plan this cohort', 'build the promo for AI Foundations', 'promote Show Don't Tell', 'set up the marketing for [program name]', or any time a cohort start date or SDT session date is known and content needs to be planned. Always ingests scout output, presents the phase plan before drafting, requires a voice pass for any member-attributed post, and never auto-posts. For ad hoc events outside recurring programs (guest speakers, She Builds, chapter events), use wdai-event-promoter instead."
---

# Program Promotion Planner

Builds a phased, multi-channel promotion plan for WDAI recurring programs. Covers **AI Foundations cohorts** (4–6 week runway, multi-channel) and **Show Don't Tell** (2–3 week runway, mostly Slack). The plan always comes first — drafting happens only after the timeline is confirmed.

---

## Step 0 — Identify program type and collect inputs

Ask for any details not already provided:

- **Program type**: `AI Foundations cohort` or `Show Don't Tell`
- **Session/start date**
- **Special context**: guest presenter names (SDT), cohort number, topic focus, anything unusual

If program type is ambiguous, ask. The timing logic, channels, and copy tone differ significantly between types.

Then read the relevant reference file for program-specific details before proceeding:
- AI Foundations → `ai-foundations.md`
- Show Don't Tell → `show-dont-tell.md`

---

## Step 1 — Confirm calendar timing

Use the Google Calendar MCP to:
- Confirm the event date and pull full details (description, host)
- Calculate **days until event** from today
- Check for other WDAI events in the surrounding 2 weeks (avoid scheduling conflicts)

`LUMA_CALENDAR_ID: ednnph5j2tft0a8qahllu39ua0v174nc@import.calendar.google.com`

---

## Step 2 — Ingest scout output (required, not optional)

Search `#team-marketing-workstream2-content-ideas` (channel ID: `C0AKR6N50T0`) for stories the daily content scout has already flagged in the last 30 days that are relevant to this program.

Search terms to try:
- For AI Foundations: "cohort", "foundations", "basics", "intermediate", "advanced", "AI tool", "built", "learned"
- For SDT: "show don't tell", "demo", "presented", "built", presenter names if known

Pull up to 5 strong supporting stories or member quotes. These anchor the promotion — without them, we're promoting a program in the abstract. With them, we're promoting proof.

---

## Step 3 — Check for social proof from previous cycle (conditional)

Search Slack broadly for signals from the most recent completed cycle:

**AI Foundations**: Search for graduation messages, member reflections ("finished the cohort", "what I built", "because of foundations"), or testimonials in the cohort channels (`C06MN2ZSNTH`, `C06S3P1P6TS`, `C09H9NS3CNB`).

**SDT**: Search for reactions, shares, or follow-up conversations about the most recent session. Check #general and #programs-buildtogether for any spillover discussion.

If you find strong social proof (testimonials, build announcements, excited reactions), flag them as potential hooks for the early-phase posts. If nothing surfaces, note it and proceed — the plan can still be built without it.

> Social proof from previous cycles is the highest-converting asset in WDAI promotion. A real quote from a real member beats any copy we write.

---

## Step 4 — Build the phase plan

Refer to the relevant reference file for the full phase-by-phase timeline, channel breakdown, and copy guidelines.

**Present the phase plan to the user BEFORE drafting any copy.** The plan table should show:

| Week | Phase | Touchpoint | Channel | Owner | Notes |
|------|-------|------------|---------|-------|-------|

Wait for the user to confirm or adjust the plan. Only move to drafting after the plan is approved. This prevents us from writing copy for phases the user wants to cut or rearrange.

---

## Step 5 — Voice passes (required for any member-attributed post)

Before drafting any post attributed to a named member:

1. Search their Slack message history (use their name as search query, look for 15–20 recent messages)
2. Note: sentence structure, vocabulary, use of emoji, how they talk about their work, what they never say
3. Draft the post in their voice
4. Flag it clearly: *"This draft is written in [Name]'s voice based on [N] Slack messages reviewed."*

This rule applies to everyone — Helen, Sandhya, Carolyn, any community member. No exceptions. Never write in someone's voice without doing the search first.

**Hook age rule**: Hooks and references from Slack must be no older than 2–3 weeks. High-traffic channels (#general, cohort channels): max 2 weeks. Quieter channels: max 3 weeks.

---

## Step 6 — Draft all content

Draft in phase order, one touchpoint at a time. For each piece:
- Label clearly: channel, date/timing, and who executes it
- For Slack posts: include the message text formatted for Slack markdown
- For LinkedIn: follow the WDAI LinkedIn voice (read `vault/linkedin-voice.md`; key traits: community-first, mission-rooted, contrast structure, story-driven, soft CTA, 3–5 hashtags)
- For newsletter: brief, campaign-framed, "bring a friend" angle
- For email: see **Email Announcement** guidance below

For AI Foundations, Advanced tier requires its own separate CTA in the relevant phase (see `ai-foundations.md`). It's a different action (separate Luma opt-in), so it needs its own prompt.

### Email Announcement (AI Foundations only)

Include an email announcement as part of the Phase 1 and/or Phase 4 (final push) touchpoints. Email is distribution, not destination — keep it short, link to Luma.

**Structure:**
```
Subject line: [see formulas below]
Preview text: [one-line hook — the most compelling specific detail]

Body:
[Warm greeting]

[Course] [Season] starts [date].

[2–3 sentences on what the cohort covers and what members walk away with. Specific over vague.]

[1 sentence on the community piece — live sessions, Slack, peer learning.]

[Optional: one member outcome or quote from a previous cohort — from scout/social proof research above.]

[Single CTA]
[Button: "Reserve your spot →" or "Join [Course] [Season] →"]
[Luma URL]

Women Defining AI 💜
```

**Subject line formulas by course:**

| Course | Subject |
|--------|---------|
| AI Basics | `[AI Basics] [Season] starts [date] — enrollment open` |
| AI Intermediate | `[AI Intermediate] [Season]: 10 days to build your custom AI assistant` |
| AI Advanced | `[AI Advanced] [Season] kicks off [date] — office hours format` |

**Tone:** Peer-to-peer. Lead with the news. No "We're so excited to announce."

---

## Step 7 — SDT: Post-session feedback loop (SDT only)

After the session, Carolyn drops a structured recap into a Slack thread. This feeds the adhoc-content-activator for follow-on content.

Include this template in the SDT plan output for Carolyn to fill in post-session:

```
📝 SDT Session Recap — [Date]

Presenters & what they built:
1. [Name] — [one-line description of their build/demo]
2. [Name] — [one-line description of their build/demo]
3. [Name] — [one-line description of their build/demo]

Standout moment or quote (optional):

Any member reactions worth capturing (optional):

Next steps / who to follow up with (optional):
```

Remind Carolyn: this recap is what makes it possible to turn the session into lasting content. The adhoc-content-activator can turn it into LinkedIn posts, internal spotlights, or newsletter features — but only if we capture it while it's fresh.

---

## Step 8 — Present all drafts for review

Surface all drafts to the user. Never post anything automatically. Present in phase order with clear labels.

For each draft, note:
- What editing is needed before sending
- Whether a voice pass was done (and for whose voice)
- Whether the user needs to tag someone, add a Luma link, or confirm registration details

---

## Rules (always apply)

- Phase plan **before** drafting. Always.
- Voice pass **before** any member-attributed post. Always.
- Hooks no older than 2–3 weeks. If nothing recent exists, write fresh.
- Never auto-post. All drafts are for human review.
- Ingest scout output in Step 2. It's not optional.
- For SDT: always include the post-session recap template in the output.

---

## Promo Anti-Patterns

- Never open with "We're so excited to announce..." — lead with the fact
- Never say "Join our community" as the CTA — say what they're joining and when
- Don't say "limited spots" unless it's actually true
- Don't describe the course as "immersive" or "transformative" — show outcomes instead
- Don't use bullet lists on LinkedIn — kills the scroll
- Don't front-load urgency into the launch announcement — save strongest social proof and CTAs for Phases 3–4

---

## Channel IDs

```
GENERAL              = C05EVMG7CRG
CONTENT_IDEAS        = C0AKR6N50T0   ← scout output lives here
AIF_BASICS           = C06MN2ZSNTH
AIF_INTERMEDIATE     = C06S3P1P6TS
AIF_ADVANCED         = C09H9NS3CNB
AIF_MENTORS          = C09J5AV8WFN
GTMOPS_LINKEDIN      = C0884K20BGE
GTMOPS_NEWSLETTER    = C08901A3Y80
LUMA_CALENDAR_ID     = ednnph5j2tft0a8qahllu39ua0v174nc@import.calendar.google.com
```
