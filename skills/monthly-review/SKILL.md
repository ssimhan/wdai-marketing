---
name: monthly-marketing-review
description: "Runs WDAI's monthly marketing performance review and outputs a branded interactive HTML dashboard for the team meeting. Gathers LinkedIn analytics (impressions, engagement, follower growth via Chrome), Mailchimp newsletter stats (via Chrome), Slack promo engagement (MCP), Google Calendar events (MCP), and content pipeline activity. Dashboard has a consolidated KPI view with drill-down sections and a Claude recommendations section. Use whenever Sheena or Sandhya says 'run the marketing review', 'build the dashboard', 'prep for the team meeting', 'how did our posts do this month', 'marketing report', or 'monthly metrics'. Run 1–2 days before the monthly team marketing meeting. Outputs a standalone WDAI-branded HTML file."
---

# Monthly Marketing Review

Gathers data from every WDAI marketing channel and produces a standalone interactive HTML dashboard — one file, shareable with the team, ready for the monthly marketing meeting.

**Read `data-collection.md` before starting data collection.**
**Read `dashboard-spec.md` before generating the HTML.**

---

## Step 0 — Establish the reporting period

Ask if not already provided. Default: the previous complete calendar month (e.g., if today is March 21, default is February 1–28).

Confirm:
- **Reporting period**: start date → end date
- **Optional Luma data**: "Do you have registration counts from Luma to paste in? If not, we'll skip that section or mark it as pending."

---

## Step 1 — LinkedIn: Collect analytics via Chrome

Read `data-collection.md` → LinkedIn section for exact navigation steps and what to capture at each URL.

**Collect:**

**A. Content Highlights** (Analytics → Content tab)
- Total impressions for the period
- Total reactions, comments, reposts
- % change vs. prior period for each (shown by LinkedIn automatically)
- Set date range to match the reporting period before reading numbers

**B. Individual post performance** (Page posts)
- For each post published in the reporting period:
  - Post date
  - First ~80 characters of post text (to identify it)
  - Reactions, comments, reposts visible on each post
  - Impressions if shown in the post card

**C. Follower growth** (Analytics → Followers tab)
- Total followers (current)
- Net new followers gained in the period (if shown)
- Any demographic data visible (industry, seniority, location) — optional, capture if easily accessible

Log all captured data before moving to the next step. If LinkedIn is not accessible or logged out, note it and proceed — mark that section as "data unavailable."

---

## Step 2 — Newsletter: Collect Mailchimp data via Chrome

Read `data-collection.md` → Mailchimp section.

**Collect for each campaign sent in the reporting period:**
- Campaign name and send date
- Audience / list size
- Open rate (%)
- Click rate (%)
- Unsubscribes (if visible)

If multiple campaigns were sent, capture each one separately. If zero campaigns were sent in the period, note it explicitly.

---

## Step 3 — Slack: Promo post engagement

Use Slack MCP to find promotional posts from the reporting period.

**Search #general** (C05EVMG7CRG) — filter to date range. Look for:
- Event announcements with Luma links
- Cohort registration posts
- Program reminders and day-before nudges
- SDT session posts

**Search program channels** (AI Foundations basics C06MN2ZSNTH, intermediate C06S3P1P6TS, advanced C09H9NS3CNB) for in-channel announcements.

For each promotional post found, capture:
- Channel
- Date
- Author
- First ~100 characters of post text
- Reaction count (total emoji reactions)
- Thread reply count

Sort by reaction count descending. This tells us which promos actually landed.

---

## Step 4 — Calendar: Events that ran

Use Google Calendar MCP to list all WDAI events in the reporting period.

Pull from both:
- Primary WDAI calendar
- `LUMA_CALENDAR_ID: ednnph5j2tft0a8qahllu39ua0v174nc@import.calendar.google.com`

For each event: name, date, type (infer from name: cohort session, SDT, guest event, Build Together, etc.).

This is the "Programs" section baseline — what actually ran in the period.

---

## Step 5 — Content pipeline: Scout activity

Use Slack MCP to check `#team-marketing-workstream2-content-ideas` (C0AKR6N50T0) for the reporting period.

Count:
- Total scout output messages posted (messages from the daily-content-scout bot)
- How many were tagged [Internal] vs. [External] vs. [Both]
- How many had follow-up thread replies (signal that something was acted on)

This tells us how healthy the content engine is — are we finding opportunities and doing something with them?

---

## Step 6 — Optional Luma registration data

If the user provided Luma data (paste-in or file), map each event's registration count to the calendar events from Step 4.

If no Luma data is available, mark the registration column in the Programs section as "—" and add a note: *"Registration data requires Luma admin access. Paste in counts or configure Luma MCP to populate automatically."*

> **Future integration**: A community Luma MCP server exists (github.com/montaguegabe/luma-events-mcp). When configured as a connector, this step can pull registration data automatically.

---

## Step 7 — Synthesize and identify patterns

Before writing the HTML, take a pass across all the data and identify:

1. **Top performer**: Which LinkedIn post had the highest engagement? What was it about?
2. **Slack signal**: Which promo post got the most reactions? What made it land?
3. **Newsletter trend**: Open rate vs. prior month (if you have prior month data)?
4. **Pipeline health**: Is the activation rate (acted-on / total scout flags) above or below 30%?
5. **Member growth**: Followers gained this period — notable or flat?
6. **Events run**: Did every planned event run? Any gaps?

Write 3–5 recommendations based on actual patterns in the data. Label them clearly as **Claude's Analysis** in the dashboard. These are observations and hypotheses, not directives — the team will review and decide.

---

## Step 8 — Generate the HTML dashboard

Read `dashboard-spec.md` for the full HTML structure, WDAI brand styles, Chart.js patterns, and the collapsible drill-down component.

The dashboard must:
- Be a single standalone `.html` file (all CSS and JS inline or from CDN)
- Use WDAI brand colors (navy #332961, pink #e93583, orange #ee8933, lavender #86589d)
- Have a **top KPI row** (5 cards: Impressions, Engagement Rate, Follower Growth, Newsletter Open Rate, Slack Reactions)
- Have **6 collapsible sections** (LinkedIn, Newsletter, Slack Promo, Programs, Content Pipeline, Recommendations)
- Each section: collapsed by default, shows a 1-line summary, expands to full detail on click
- Chart.js bar chart for LinkedIn post-by-post performance (load from cdnjs.cloudflare.com)
- Recommendations section: labeled **"Claude's Analysis"** with a brief disclaimer — clearly not human-authored, clearly Claude's interpretation of the data
- Footer: report period, generated date, "Powered by Claude"

Save the file as: `wdai-marketing-report-[YYYY-MM].html`
Deliver to `/sessions/amazing-kind-feynman/mnt/outputs/`

---

## Rules

- Never post, send, or share anything automatically. This skill is read-only + generate.
- If a data source is inaccessible (logged out, no permission), note it in the dashboard and proceed — don't abort the whole run.
- All data is from the specified reporting period. Don't pull data from outside the range.
- Recommendations are labeled as Claude's analysis. They are a starting point for team discussion, not conclusions.

---

## Constants

```
GENERAL              = C05EVMG7CRG
CONTENT_IDEAS        = C0AKR6N50T0
AIF_BASICS           = C06MN2ZSNTH
AIF_INTERMEDIATE     = C06S3P1P6TS
AIF_ADVANCED         = C09H9NS3CNB
LUMA_CALENDAR_ID     = ednnph5j2tft0a8qahllu39ua0v174nc@import.calendar.google.com
LINKEDIN_ANALYTICS   = https://www.linkedin.com/company/women-defining-ai/admin/analytics/content/
LINKEDIN_FOLLOWERS   = https://www.linkedin.com/company/women-defining-ai/admin/analytics/followers/
LINKEDIN_POSTS       = https://www.linkedin.com/company/women-defining-ai/admin/page-posts/
MAILCHIMP            = https://login.mailchimp.com/
```
