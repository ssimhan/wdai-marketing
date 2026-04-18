# WDAI Content Calendar — Team Training Guide

Welcome to the WDAI Content Calendar! This guide helps the marketing team understand and use the system.

---

## System Overview (5 min read)

**What it does:**
The content calendar automatically coordinates event promotion across LinkedIn, Slack, and Mailchimp. It syncs events from Luma each morning, routes them through approval gates, generates AI copy, and publishes to all channels.

**Why we built it:**
- **Before:** Sandhya manually drafted copy for each event and channel. Takes 2–3 hours per event.
- **After:** AI drafts copy, the team approves in Slack (2 clicks), and it publishes automatically.

**Who uses it:**
- **Event creators** — create events in Luma (no special action needed)
- **Plan approvers** — Sandhya or Sheena, approve the promo plan in Slack
- **Copy approvers** — DRI for each channel (e.g., Helen for Slack posts), approve copy in Slack DM
- **Publishers** — system publishes automatically to LinkedIn, Mailchimp (once live)

---

## The Approval Workflow

```
[Luma Event Created]
         ↓
    [6am UTC Sync]
         ↓
[Slack Notification: Plan + Approve Button]
         ↓
   [Sandhya or Sheena Approves]
         ↓
    [AI Generates Copy]
         ↓
[Slack DMs to DRIs: Copy + Approve Button]
         ↓
 [Each DRI Approves Their Copy]
         ↓
[Auto-Publish to LinkedIn + Mailchimp]
```

**Two approval gates:**
1. **Plan approval** (1 click) — "Does this event get announced on LinkedIn, Slack, Email?"
2. **Copy approval** (1 click per channel) — "Does this copy sound right?"

**Key insight:** The system handles the 80% (copy generation, scheduling, publishing). The team handles the 20% (approvals, quality control).

---

## Roles & Responsibilities

### Plan Approver
- **Who:** Sandhya or Sheena (depends on event type)
- **What:** Approve the event promo plan in Slack
- **When:** Within 24 hours of sync (morning of event creation)
- **How:** Click `✅ Approve` in Slack notification, or `✏️ Edit` if plan needs changes

### Copy Approver (DRI)
- **Who:** Sandhya, Helen, Carolyn, or other assigned DRI
- **What:** Approve copy for your assigned channel
- **When:** Within 24 hours of copy generation
- **How:** Click `✅ Approve` in Slack DM, or `✏️ Edit` to request changes

### Publisher (System)
- **Who:** Automated via Vercel (no human action needed)
- **What:** Post approved copy to LinkedIn and Mailchimp
- **When:** Immediately after last DRI approves their copy
- **How:** Automatic (already built in)

---

## Timeline Example

For an AI Basics cohort launching **May 4**, here's the expected timeline:

| Date | Time | Event | Action |
|------|------|-------|--------|
| Apr 20 | 6am UTC | Calendar syncs | Slack notification posts |
| Apr 20 | 9am UTC | Plan in Slack | Sandhya clicks ✅ Approve |
| Apr 20 | 10am UTC | Copy generated | Helen, Sandhya get Slack DMs |
| Apr 20 | 3pm UTC | Copy review | All DRIs click ✅ Approve |
| Apr 20 | 3:15pm UTC | Publishing | LinkedIn post goes live, Mailchimp draft created |
| May 4 | Event day | (No action) | Emails already sent, Slack announced, etc. |

**Pro tip:** The system works best when plan approval happens the same day as sync. Copy approval should happen within a few hours of generation.

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    LUMA (Event Source)                      │
└────────────────────────┬────────────────────────────────────┘
                         │ (Daily sync, 6am UTC)
                         ↓
            ┌────────────────────────────┐
            │   Calendar Data Model      │
            │  (event + promo plan)      │
            └────────┬───────────────────┘
                     │
        ┌────────────┴────────────┬─────────────┐
        ↓                         ↓             ↓
    [Slack]                   [Slack]       [HTML]
    Notify Plan               DM Copy      Viewer
    + Approve                 + Approve    (Reference)
        │                         │
        ↓                         ↓
  ┌──────────┐            ┌──────────┐
  │ Approved │            │ Approved │
  │  Plan    │            │  Copy    │
  └─────┬────┘            └────┬─────┘
        │                       │
        ├───────────┬───────────┤
        ↓           ↓           ↓
    [LinkedIn]  [Slack]   [Mailchimp]
    (Auto-post) (Future) (Draft/Auto-send)
```

---

## Copy Generation (How AI Works)

When you approve the plan, the system:

1. **Reads your voice guides** — brand-guidelines.md, helen-voice.md, etc.
2. **Builds a prompt** — "Write a LinkedIn post for this event, matching WDAI's voice"
3. **Calls Claude API** — generates unique copy for that channel
4. **Stores in vault** — saves as a draft for your approval

**The copy is customized by:**
- **Event details** — name, dates, registration link
- **Channel** — different tone for LinkedIn vs Slack vs Email
- **DRI's voice** — if Helen is posting, copy sounds like Helen

**If the copy is bad:**
- Click `✏️ Edit` in Slack and describe what's wrong
- The engineering team will regenerate it
- Or edit directly in vault and push to git

---

## Calendar Status Badges

When you check the calendar (once Vercel is live), you'll see status badges:

### Approval Status (Event level)
- **⏳ Pending** — waiting for plan approval
- **✅ Approved** — plan is approved, ready for copy generation
- **✏️ Changes Requested** — you asked for edits to the plan

### Copy Status (Channel level)
- **🔲 Not started** — no copy generated yet
- **🟡 In progress** — copy generated, waiting for DRI approval
- **✅ Approved** — copy approved, ready to publish
- **📤 Published** — copy published to the channel (LinkedIn, Mailchimp, etc.)

---

## Common Questions

**Q: What if I want to change the promo plan for all future AI Basics cohorts?**
A: That's a promo rule. Contact engineering to update `tools/calendar/promo-rules.yaml`.

**Q: What if the plan is wrong for just this one event?**
A: Click `✏️ Edit` in the Slack notification and describe what needs to change. Engineering can add an event-level override.

**Q: Can personal leaders post from their own LinkedIn?**
A: Not yet. Currently everything posts from the WDAI org page. Phase 7 will add personal OAuth (later in 2026).

**Q: What if I miss the Slack DM?**
A: Check the calendar directly: `vault/content-calendar.html` or `vault/content-calendar.md`. You can also manually trigger a DM: ask engineering to re-run copy generation.

**Q: Can we preview copy before it's live?**
A: Yes! The system shows copy drafts in Slack before you approve. If you want to preview different versions, ask engineering to regenerate with a different prompt.

**Q: What if a Mailchimp email fails to send?**
A: The publishing status is tracked in vault. Engineering can retry from there.

---

## Key Principles

1. **Automation over manual labor** — The system handles everything it can, you handle approvals.
2. **Multiple checkpoints** — Plan approval + copy approval means bad content can't slip through.
3. **Clear ownership** — Each channel has a DRI (Directly Responsible Individual) who approves the copy.
4. **Voice-guided generation** — AI copy is shaped by your voice guides, so it's on-brand from the start.
5. **Git-tracked content** — Everything is in the repo with history, so changes are auditable.

---

## Next Steps

1. **Read the Runbook** (`docs/RUNBOOK.md`) — step-by-step how to use the system
2. **Check your Slack permissions** — make sure you're in `#team-marketing-workstream2-content-ideas`
3. **Review the voice guides** (`vault/brand-guidelines.md`, etc.) — understand how copy is generated
4. **Ask questions** — Slack the #team-marketing-workstream2-content-ideas channel

---

## For Questions or Issues

- **System not working?** Post in `#team-marketing-workstream2-content-ideas` with a screenshot
- **Want to change rules?** Bring it to the weekly marketing sync
- **Found a bug?** Contact the engineering team with exact steps to reproduce

---

**Last updated: 2026-04-18**  
**Questions?** Reach out in Slack or contact the WDAI Engineering team.
