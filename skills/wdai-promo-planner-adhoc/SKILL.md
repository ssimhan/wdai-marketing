---
name: wdai-event-promoter
description: "Executes a phased promotion campaign for any WDAI event outside the recurring programming calendar — guest speakers, chapter events, She Builds, IWD, community milestones, membership drives, partnerships, and any ad hoc event with a confirmed date. Use whenever Sheena, Sandhya, Helen, or any WDAI team member says 'promote this event', 'build posts for [event]', 'help me promote [speaker]', 'we're promoting this', or shares an event that is NOT an AI Foundations cohort or Show Don't Tell (use program-promotion-planner for those). Always ingests scout output, presents the phase plan before drafting, and requires a voice pass for any member-attributed post. Covers Slack (seed + day-before), LinkedIn (WDAI org + member), email (milestones and membership drives), and member outreach DM asks. Does NOT auto-post — all drafts surface for human review."
---

# WDAI Event Promoter

Executes a complete promotion campaign for any WDAI event outside the recurring programming calendar. This includes guest speaker sessions, chapter events, She Builds, IWD activations, community milestones, membership drives, external partnerships, and any other ad hoc event with a confirmed date and Luma link.

**Not for recurring programs.** AI Foundations cohorts (Basics, Intermediate, Advanced) and Show Don't Tell run on a fixed schedule — use `program-promotion-planner` for those.

**What this skill produces:**
- A confirmed 3-phase plan (channels, dates, who posts) presented BEFORE any drafting
- Phase 1 (Seed): Internal Slack posts to warm the community
- Phase 2 (Build): LinkedIn posts (WDAI org + community member) + Slack registration nudge
- Phase 3 (Close): LinkedIn speaker spotlight + day-before Slack reminder
- Email announcement (milestones and membership drives only — see guidance below)
- Member outreach DM drafts for any community-attributed posts
- Content calendar brief formatted for manual entry into the WDAI Google Sheet

**What this skill does NOT do:**
- Post anything automatically — all content surfaces as drafts for human review
- Write directly to Google Sheets (outputs a structured brief instead)
- Build a plan from scratch without event details confirmed

---

## Step 0: Ingest Scout Output

Before anything else, check whether the daily content scout has run recently. Search `#team-marketing-workstream2-content-ideas` (channel ID: `C0AKR6N50T0`) for scout posts from the last 7 days.

If found, read them and note any items that could serve as hooks for this event — member stories, builds, or conversations that connect to the event topic. These organic hooks are often stronger than anything we'd invent. Keep them available throughout the drafting process; don't treat this as a checkbox.

---

## Step 1: Gather Event Details

Confirm the following before building the phase plan. If anything is missing, ask.

- **Event type**: guest speaker / chapter event / She Builds / IWD / milestone / membership drive / partnership / other
- **Event date and time** (with timezone)
- **Speaker name** and their LinkedIn URL or title (if applicable)
- **Organization / benchmark / tool** being featured (if applicable)
- **What's counterintuitive or surprising** about their work — this is the hook
- **Luma registration link** (if applicable)
- **Members-only or open?**
- **Who is organizing** (usually Helen)
- **Any community member** who has already posted about a related topic in Slack (potential hook or outreach candidate)

**Event-type notes:**
- **Milestones** (member count, partnerships, awards): no Luma link needed; email is a primary channel alongside LinkedIn
- **Membership drives**: email is a primary channel; include open/close dates and any seasonal hook
- **She Builds / IWD**: confirm whether there's a submission component or just an attendance CTA

---

## Step 2: Build the Phase Plan — Present BEFORE Drafting

Build the phase plan and present it to the user for approval. Do not start drafting posts until the plan is confirmed.

**Standard 3-phase structure** (adjust dates based on actual event date):

| Phase | Window | Channels | Purpose |
|-------|--------|----------|---------|
| Phase 1: Seed | 2–3 weeks before | Slack #general, relevant topic channel | Warm community organically; no hard sell |
| Phase 2: Build | 1–2 weeks before | LinkedIn (WDAI org + community member), Slack #general nudge | Drive awareness and registrations |
| Phase 3: Close | Week of event | LinkedIn speaker spotlight, Slack day-before reminder | Convert stragglers; build anticipation |

**Milestone and membership drive adjustments:**
- Milestones: no phases needed — single announcement across LinkedIn + email + Slack simultaneously
- Membership drives: extend Phase 2 through the close date; add a midpoint reminder and a close reminder

For each post in the plan, specify:
- Platform and channel
- Who is posting (WDAI org, Helen, or named community member)
- Approximate go-live date
- Hook angle (one sentence)

Present as a table. Wait for the user to approve or adjust before moving to Step 3.

---

## Step 3: Research Before Drafting

### Voice research for member-attributed posts (non-negotiable)

For every post attributed to a named community member — LinkedIn or Slack — search their Slack history before writing a single word:

```
from:<@UserID> [search their posts]
```

Read 10–15 of their recent messages and note:
- How they open messages (casual vs. formal, emoji use)
- Sentence length and rhythm (punchy vs. flowing)
- Personal identifiers they use (job title, "mom of X", "solo practitioner", etc.)
- What they genuinely care about (their actual interests, not their job description)
- How they close — soft invite, link drop, direct ask
- Emoji use (which ones, how often)

Write these patterns down explicitly before drafting their post. Never write "in someone's voice" from a description alone — always from their actual words.

See `references/helen-voice.md` for Helen's captured voice patterns (verified from her actual Slack posts).

### Channel research for Slack hooks

For any Phase 1 post tied to a Slack channel, search that channel to find recent activity:
- Look for conversations within the last 2–3 weeks (nothing older — stale hooks feel forced)
- In higher-traffic channels, stick closer to 2 weeks; in quieter channels, 3 weeks is the outer limit
- If the channel is quiet, acknowledge it honestly: "This channel has been a bit quiet but I didn't want anyone to miss this"
- If another team member has already dropped the Luma link in a relevant thread, do not add to that thread — it's overkill

---

## Step 4: Draft Posts Phase by Phase

Surface one phase at a time for review before moving to the next.

### Phase 1: Seed Posts (Slack)

**Helen's #general post** — always the Phase 1 anchor. See `references/helen-voice.md` for her full voice profile.

Key things to get right:
- Resurfacing a past post she made is her natural framing: "Resurfacing something I shared in #channel a few weeks back..."
- She connects the event to a personal moment with her kids — specific detail, specific age
- She names why she's excited in her own casual way, then drops the link without ceremony
- She tags the relevant community member in a follow-up message (not in the main post)
- She always closes with 💜

**Topical channel post** — search the most relevant topic channel for a recent hook. Write from whoever is posting (usually a marketing team member — verify their actual role and don't position them as something they're not).

**What to avoid in Phase 1:**
- Reviving posts or threads older than 6 months as hooks
- Adding the Luma link to a thread where it's already been dropped
- Announcing the event with a structured bullet-point format — these posts should feel organic, not promotional

---

### Phase 2: Build Posts (LinkedIn)

All WDAI LinkedIn posts follow the voice principles in `references/wdai-linkedin-voice.md`. Read that file before drafting any LinkedIn post.

**WDAI org post:**
- Open with the unanswered question the community is already circling — not the event logistics
- Use the contrast structure: "This isn't just [X]. It's [Y]."
- Name the speaker with their LinkedIn tag — not their Slack handle
- Reveal the counterintuitive finding as the payoff
- CTA: Luma link for members, womendefiningai.org for non-members
- End with a soft, inviting close — never "don't miss this" urgency

**Community member LinkedIn post:**
- Always research their voice first (Step 3)
- Frame from their genuine personal experience — not a first-person rewrite of the WDAI org post
- Lower the barrier explicitly: "no credentials required", "wherever you are in your journey"
- Soft CTA — a genuine invite, not a conversion push

**Slack registration nudge:**
- Short (3 sentences max), from a named community leader (Sandhya, Madina, etc.)
- Personal tie to the event topic — why does *this person* care?
- Do voice research before writing (Step 3 applies here too)
- Not a copy of the LinkedIn post

---

### Phase 3: Close Posts

**LinkedIn speaker spotlight (WDAI org, ~1 week before):**
- Shift from "here's the event" to "here's who you're learning from"
- Lead with what makes this speaker's work distinctive — not their credentials
- You may need 1–2 sentences of speaker background from the organizer (flag this if missing)
- Reveal or reinforce the counterintuitive finding
- Soft CTA to register — "Members: come ready" not "Last chance"

**Day-before Slack reminder (Helen or WDAI):**
- One sentence. Tomorrow + time + speaker + Luma link. That's it.
- Example: "Tomorrow at 9am PT — [Speaker] from [Org] joins us. Register if you haven't: [link] 💜"
- Do not rewrite the Phase 1 post. This is a tap on the shoulder, not a pitch.

---

### Email Announcements (Milestones and Membership Drives)

Email is not a default channel for ad-hoc events — use it only for milestones and membership drives where it carries genuine weight.

**Milestone email:**
```
Subject: [Number/achievement] — a note from us
Preview: [One warm sentence about what this milestone means]

Body:
[Warm, brief reflection on reaching this milestone — personal, not corporate]
[What it represents for the mission]
[One member quote or specific moment that captures the community's spirit]
[Soft close — gratitude, not CTA]

Women Defining AI 💜
```

**Membership drive email:**
```
Subject: Doors open: join WDAI [Season]
Preview: [One-line hook about what's happening in the community right now]

Body:
[Lead with what's live in the community right now — specific programs, events, or member builds]
[2–3 sentences on what membership includes. Concrete over abstract.]
[Price + "bring a friend" angle]
[Single CTA]
[Button: "Join WDAI →"]
[Link]

Women Defining AI 💜
```

**Tone for both:** Peer-to-peer. No "We're thrilled to share." No corporate softening.

---

## Step 5: Member Outreach DM Drafts

For any post attributed to a community member, also draft the DM Sheena will send to ask them. The DM should:
- Open with a warm, specific reference to something they actually said or did in the community (from the voice research in Step 3)
- Briefly explain what's being promoted and why they came to mind
- Paste the draft post inline
- Make clear they can edit as much as they want or pass entirely
- End without pressure

Sheena sends these DMs directly — do not send them automatically.

---

## Step 6: Content Calendar Brief

After all posts are drafted and approved, output a structured brief for manual entry into the WDAI Google Sheet (`WDAI_Content_Calendar` — Google Sheets, not writable directly).

**LinkedIn Content Planner tab** — one row per LinkedIn post:

| Field | Notes |
|-------|-------|
| POST DATE | Planned go-live date |
| SUBJECT / TOPIC | Short topic label |
| HOOK | First 1–3 lines of post |
| FULL POST DRAFT | Full copy |
| CALL TO ACTION | CTA text + link |
| HASHTAGS | 3–5 hashtags |
| POSTED BY | @WDAI org or member name |
| STATUS | Draft / Pending info / Ready |

**Master Overview tab** — one row per planned post:

| Field | Notes |
|-------|-------|
| MONTH | Month of post |
| DATE | Day number |
| DAY | Day of week |
| EVENT / MILESTONE | Short label + phase |
| EVENT DETAILS | Date, time, link |
| LINKEDIN POST SUBJECT | Topic label |
| LINKEDIN GIST | 1-sentence bullet summary |
| LINKEDIN STATUS | Draft / Ready |
| CONTENT STATUS | In Progress / Complete |

Format as two separate tables the user can copy-paste directly.

---

## Promo Anti-Patterns

- Never lead with "We're excited to announce..." — lead with the event or the insight
- Don't use "you don't want to miss this" — let the content earn the RSVP
- Don't call every event "incredible" or "game-changing" — specificity builds more credibility
- Don't write a speaker bio in the post — one credibility anchor is enough
- For milestone posts: don't be corporate or triumphalist — be warm and specific
- Don't add the Luma link to a thread where it's already been posted

---

## Constants

```
CONTENT_IDEAS_CHANNEL_ID = C0AKR6N50T0
LUMA_CALENDAR_ID = ednnph5j2tft0a8qahllu39ua0v174nc@import.calendar.google.com
GENERAL_CHANNEL_ID = C05EVMG7CRG
SHARE_DEMOS_CHANNEL_ID = C05HM9DB7BL
SHARE_ARTICLES_CHANNEL_ID = C05G7AZFQ4E
TOPIC_EDUCATION_CHANNEL_ID = C05H61KL397
```

---

## Watchdog Note

This skill handles promotion for confirmed events. A separate lightweight daily scheduled task scans the Luma calendar for events within the next 21 days and flags any that don't yet have a promotion plan started. If you're running this skill, someone has already decided to promote the event — you don't need to find it.
