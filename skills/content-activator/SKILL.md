---
name: adhoc-content-activator
description: "Turns a raw content signal — a member story, a scout result, a speaker confirmation, a Slack moment, or anything Sandhya or Sheena flags — into a ready-to-execute activation plan with draft copy and a Google Sheet content brief. Use this skill whenever Sheena or Sandhya says 'activate this story', 'build a post for this', 'Sandhya flagged this', 'turn this into content', 'what do we do with this', 'can we use this', or pastes a Slack message/link and wants to know how to use it. Also triggers when the daily content scout surfaces something worth acting on immediately. This is the fast, reactive track — not the planned programmatic track."
---

# Ad Hoc Content Activator

Turns any raw content signal into a lightweight, ready-to-execute activation plan. Designed for Sheena and Sandhya — fast, reactive, minimal overhead.

## What this skill does

1. Takes whatever signal you throw at it (Slack paste, link, scout result, description, Sandhya's note)
2. Identifies the content type and best angle
3. Cross-references the WDAI calendar — is there an upcoming event to tie this to?
4. Generates draft copy for each relevant channel
5. Tags it [Internal], [External], or [Both]
6. Pushes a content brief to the Google Sheet
7. Posts draft + brief to `#team-marketing-workstream2-content-ideas` for review

---

## Step 0 — Accept the signal

The input can be any of the following — accept whatever form it comes in:

- A pasted Slack message or thread
- A Slack message link
- A result from the daily content scout
- A description of something a member built or shared
- A speaker or guest confirmation ("we got [name] for Build Together")
- A Sandhya note or flag ("use this somehow")
- A trending conversation in a WDAI channel

If the input is vague, ask one clarifying question only: "What's the raw material — can you paste the message or describe what happened?"

---

## Step 1 — Classify the signal

Determine which content type this is:

| Type | Description | Default tag |
|------|-------------|-------------|
| **Member build** | Someone shipped, launched, or deployed something | [Both] |
| **Session-inspired story** | A member did something because of a WDAI program | [Both] — highest value |
| **Speaker/guest confirmation** | A guest is confirmed for an upcoming event | [External] or [Both] |
| **Topic channel moment** | A conversation that would pull others into a channel | [Internal] |
| **Professional application** | Member using AI in their job in a specific role | [Both] |
| **Community reaction** | Enthusiasm or gratitude that shows the community working | [Internal] only if tied to an action |

Apply the same tagging logic as the daily scout:
- **[External]** — great for LinkedIn, attracts new members
- **[Internal]** — only if there's a specific action an existing member can take because of it
- **[Both]** — strong enough for both; use when the story works externally AND has a clear internal hook

---

## Step 2 — Cross-reference the calendar

Use Google Calendar MCP (`https://gcal.mcp.claude.com/mcp`) to check for WDAI events in the next 14 days.

LUMA_CALENDAR_ID: `ednnph5j2tft0a8qahllu39ua0v174nc@import.calendar.google.com`

If a relevant event is found:
- Note it in the activation plan
- Adjust urgency accordingly (≤3 days = High, ≤7 days = Medium bump)
- Weave the event tie-in into the draft copy where natural

If no calendar connection: base urgency on story recency and strength alone.

---

## Step 3 — Generate the activation plan

Output a lightweight plan — not a full multi-week campaign. This is the fast track.

```
## Activation Plan — [Member Name or Story Hook]
**Signal type:** [content type from Step 1]
**Tag:** [Internal] / [External] / [Both]
**Urgency:** [High / Medium / Low] — [one-line reason]
**Tied to:** [event name + date, or "no calendar connection"]

---

### LinkedIn Post
**Go-live:** [recommended date/timing]
**Draft:**
[copy here — WDAI voice, building-is-the-ethos tone]

---

### Internal Slack Message
**Channel:** [specific channel — never the origin channel]
**→ Push to:** [who is missing this + where they live]
**Go-live:** [recommended date/timing]
**Draft:**
[copy here — conversational, specific next action]

---

### Newsletter Blurb (include only if [Internal] or [Both] AND there's an upcoming newsletter)
**Draft:**
[1–2 sentences max — push to LinkedIn post or event, don't recap]

---
**Notes:** [anything the person executing needs to know — image direction, tag the member, get their approval first, etc.]
```

Only include the channels that actually make sense for this signal. Don't force all three if two will do.

---

## Step 4 — Push to Google Sheet

Append a content brief row to the WDAI Content Calendar Google Sheet.

**Columns to write:**
- Date (recommended go-live)
- Channel
- Content Type
- Draft Copy (truncated to first 100 chars + "see Slack for full draft")
- Owner (default: Sheena or Sandhya — whoever triggered this)
- Status (default: Draft)
- Source/Signal (brief description of where the story came from)

If sheet ID is unknown, ask the user. Default sheet name: `WDAI Content Calendar`

---

## Step 5 — Post to Slack for review

Post to `#team-marketing-workstream2-content-ideas` (channel ID: `C0AKR6N50T0`):

```
⚡ *Ad Hoc Activation — [Story Hook]*
_[Tag] | Urgency: [level]_

[1-sentence summary of the story/signal]

**Drafts ready for:**
• [Channel 1] — [go-live date]
• [Channel 2] — [go-live date]
[if calendar tie-in]: 📅 Tied to: [Event] on [Date]

Full drafts below 👇

[paste full activation plan]

📊 Brief added to WDAI Content Calendar.
_Review drafts above — reply with edits or ✅ to approve._
```

---

## Important rules

**Never post directly to public channels.** This skill drafts and posts to the internal ideas channel only. Sheena or Sandhya approves before anything goes to #announcements, LinkedIn, or anywhere member-facing.

**Always get member approval before featuring them.** If the activation plan involves a specific member's build or story, include a note to confirm with the member before going live.

**The "Push to" rule from the scout applies here too.** For [Internal] content, never push back to the origin channel. Always identify a different audience who'd benefit.

---

## Constants

```
CONTENT_IDEAS_CHANNEL_ID = "C0AKR6N50T0"
SLACK_MCP_URL = "https://mcp.slack.com/mcp"
GCAL_MCP_URL = "https://gcal.mcp.claude.com/mcp"
LUMA_CALENDAR_ID = "ednnph5j2tft0a8qahllu39ua0v174nc@import.calendar.google.com"
MODEL = "claude-sonnet-4-20250514"
```
