# WDAI Content Calendar — Operations Runbook

This runbook is for the WDAI marketing team to operate the automated content calendar system.

---

## System Overview

**The system automatically:**
1. Syncs events from Luma each morning (6am UTC)
2. Posts a Slack notification with the event details and promo plan
3. Generates AI copy drafts after you approve the plan
4. DMs each responsible leader for copy approval
5. Publishes approved copy to LinkedIn and Mailchimp (once Vercel is live)

**Your jobs:**
- Approve the event promo plan in Slack (1 click: ✅ Approve)
- Review copy drafts in Slack DMs and approve or request edits (1 click: ✅ Approve)

---

## Before Starting

Make sure you have:
- **Slack** access to `#team-marketing-workstream2-content-ideas` (where notifications post)
- **Slack** DM ability to receive copy review requests from the calendar bot
- **Mailchimp** account access (for final publishing, once live)

---

## Daily Workflow

### 1. Event Created in Luma

When someone creates an event in Luma (e.g., AI Basics cohort launch), nothing happens yet. The sync runs at **6am UTC** (2am ET / 11pm PT previous day).

### 2. Sync Notification → Slack

At 6am UTC, the calendar syncs and posts a message in `#team-marketing-workstream2-content-ideas`:

```
🗓️ New Event: AI Basics W27 — Cohort Launch (May 4)

DRI: Sandhya
Promo Plan:
  • Mon Apr 20 — LinkedIn announcement (Sandhya)
  • Thu Apr 24 — Slack #general (Sandhya)
  • Sun Apr 27 — Email outreach (Sandhya)

[✅ Approve] [✏️ Edit]
```

**Your action:** Click `✅ Approve` to confirm the promo plan.

If the plan looks wrong (e.g., wrong DRI, wrong dates), click `✏️ Edit` and describe what needs to change. (This updates the event's promo rules for future use.)

### 3. Plan Approved → Copy Generation

Once you approve, the system generates AI copy drafts for each channel (LinkedIn, Slack, Email).

### 4. Copy DM → Slack DM

The person responsible for each channel gets a Slack DM:

```
📝 Copy ready for review: AI Basics W27

Channel: LinkedIn announcement
Date: Mon Apr 20
Copy:

  We're launching AI Basics W27 in May—a 3-week cohort for busy professionals.
  If you're curious about practical AI, this is for you.
  [more copy...]

[✅ Approve] [✏️ Edit]
```

**Your action (if you're the DRI):** Review the copy. Click `✅ Approve` if it's good. If you want changes, click `✏️ Edit` and type your feedback.

### 5. Copy Approved → Publishes

Once you approve the copy, it automatically publishes to:
- **LinkedIn:** posted to the WDAI org page
- **Mailchimp:** saved as a draft campaign (you can send it manually or set it to auto-send)

---

## Common Tasks

### Check the Full Calendar

Visit `vault/content-calendar.html` (once Vercel deployment is live):
- **By Date** — see all upcoming moments chronologically
- **By Event** — group moments by event
- **How to Edit** — learn how to customize the promo rules

Or view the markdown version: `vault/content-calendar.md`

### Override Promo Rules for One Event

If you want to change the plan for *just one event* (not the whole event type), the calendar will support event-level overrides. Contact the engineering team for help editing `tools/calendar/overrides.yaml`.

### Change Promo Rules for an Event Type

To change the default promo plan for all future AI Basics cohorts:
1. Open `tools/calendar/promo-rules.yaml`
2. Find the event type (e.g., `ai-basics`)
3. Update the moments or DRI
4. Save and push to git
5. The next sync will use the new rules

### View Approval Status

The calendar shows a badge for each event:
- ⏳ **Pending** — waiting for plan approval
- ✅ **Approved** — plan is approved
- ✏️ **Changes Requested** — you asked for edits

---

## Troubleshooting

### I didn't see the Slack notification

**Check:**
1. Are you in `#team-marketing-workstream2-content-ideas`?
2. Did the sync run? Check GitHub Actions → Calendar Sync workflow for logs.
3. Did the event actually change? The sync only posts if something is new or changed.

**Try:**
- Force a manual sync: Ask the engineering team to run `npm run calendar:sync` in the repo.

### I didn't get the copy review DM

**Check:**
1. Is your name spelled correctly as the DRI in the event?
2. Is your Slack user ID set in `tools/calendar/team.yaml`? (Contact engineering if not set.)
3. Did copy generation work? Check the calendar—if copy shows "🔲 Not started", generation may have failed.

**Try:**
- The engineering team can manually regenerate copy: `npm run calendar:generate -- --event <event-id>`

### Copy looks bad / needs edits

**If you see bad copy in your Slack DM:**
1. Click `✏️ Edit` and describe the issue
2. The system will re-generate copy based on your feedback (manual process until Vercel is live)
3. Or, edit the copy directly in `vault/promos/<event-id>/<channel>.yaml` and push to git

### An event's promo plan is wrong

**If the plan shows the wrong DRI or missing channels:**
1. Check if the event type is correct in Luma (look at event tags)
2. Check `tools/calendar/promo-rules.yaml` for that event type
3. If the rule is wrong, update it and re-sync
4. If *just this event* is wrong, ask engineering to add an override in `tools/calendar/overrides.yaml`

### Mailchimp draft didn't create

This feature isn't live yet. You'll see a status badge 📤 (Published) once it goes live.

---

## For the Engineering Team

### Daily Maintenance

- Monitor GitHub Actions `Calendar Sync` for errors
- Respond to Slack `✏️ Edit` requests from the team
- Update `team.yaml` when team members change roles

### One-Off Commands

Generate copy manually:
```bash
npm run calendar:generate -- --event evt-uHbvwZ9hHgHHqds --notify
```

Sync from Luma (testing):
```bash
npm run calendar:sync:mock  # test with fixture data
npm run calendar:sync      # live Luma API
```

View calendar HTML locally:
```bash
npm run vault:serve  # opens http://localhost:8000
```

---

## FAQ

**Q: What happens to old events?**
A: The calendar shows past events grayed out by default. Click "Show past events" to see them.

**Q: Can we customize the copy?**
A: Yes! The copy generation uses your voice guides (`vault/brand-guidelines.md`, `vault/linkedin-voice.md`, etc.). Update those files to change the tone.

**Q: Can personal leaders (Helen, etc.) post from their own LinkedIn?**
A: Not yet. Phase 7 will add personal OAuth flows. For now, copy posts to the WDAI org page.

**Q: What if we want to auto-send Mailchimp emails instead of drafts?**
A: The system supports it. Use the `--schedule` flag in the publish command (once Vercel is live).

**Q: How do we undo a publish?**
A: Contact the engineering team. The published status is tracked in `vault/publishing/` and can be rolled back.

---

**Last updated: 2026-04-18**  
**Maintained by:** WDAI Engineering  
**Contact:** Questions? Slack the #team-marketing-workstream2-content-ideas channel
