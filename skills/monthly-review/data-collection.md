# Data Collection Guide

Step-by-step Chrome navigation for each data source.

---

## LinkedIn Analytics

You must be logged in as a WDAI content admin. If redirected to a login page, note it and skip LinkedIn data.

### Step 1: Content Analytics

Navigate to:
```
https://www.linkedin.com/company/women-defining-ai/admin/analytics/content/
```

1. Set the date range dropdown to match the reporting period (top of the page, next to the date picker)
2. Wait for the page to load the Highlights section
3. Capture from the **Highlights** row:
   - Impressions (number + % change arrow/color)
   - Reactions (number + % change)
   - Comments (number + % change)
   - Reposts (number + % change)
4. Note the exact period shown under "Data for [date] - [date]" to confirm it matches

### Step 2: Follower Analytics

Navigate to:
```
https://www.linkedin.com/company/women-defining-ai/admin/analytics/followers/
```

1. Set date range to match reporting period
2. Capture:
   - Total followers (shown in the left sidebar or page header)
   - Net new followers in the period (shown in Highlights if available)
   - Any visible breakdown (top industries, locations, seniority) — take a screenshot or note the top 3 in each if visible, but don't spend time digging

### Step 3: Individual Post Performance

Navigate to:
```
https://www.linkedin.com/company/women-defining-ai/admin/page-posts/
```

1. Filter to the reporting period if a date filter is available
2. For each post visible in the period, capture:
   - Post date
   - First 80 characters of the post text (enough to identify it)
   - Reactions count (the ♡ number under the post)
   - Comments count
   - Reposts count
   - Click on the post's analytics icon (chart icon) if available to see impressions for that post
3. Scroll to capture all posts from the period — don't stop at the first page

**What we're looking for**: Which posts drove the most engagement? Was it event promos, member spotlights, or thought leadership?

---

## Mailchimp

Navigate to:
```
https://login.mailchimp.com/
```

If already logged in, you'll land on the dashboard. If not, note it and skip newsletter data.

### Campaigns View

1. Click **Campaigns** in the left nav
2. Filter by date range (look for a "Sent" filter or sort by date)
3. For each campaign sent in the reporting period, click into it to see:
   - Campaign name
   - Send date
   - List / audience size
   - **Open rate** (%) — the primary signal
   - **Click rate** (%) — secondary signal
   - Unsubscribes count (if visible)

4. If there are multiple campaigns (e.g., newsletter + promotional email), capture each separately

**What we're looking for**: Are people opening? Are they clicking through to Luma links? Is there a pattern in which subject lines or sends performed better?

**Benchmarks for context** (industry averages for nonprofits/communities):
- Open rate: 25–35% is healthy for a community list
- Click rate: 2–5% is solid
- Anything above these is a signal to study what worked

---

## Luma (Manual / Paste-in)

Luma MCP is not yet configured. To include registration data:

**Option A — Paste in**:
Ask the user: "Can you or a Luma admin share the registration counts for each event this month?"
Accept any format — a list, a table, a screenshot description.

**Option B — Future**:
When `github.com/montaguegabe/luma-events-mcp` is configured as a connector, registration data will pull automatically in Step 6.

**What to capture if provided**:
- Event name
- Registration count
- Attendance count (if available)
- Registration source breakdown (if Luma shows it: direct link, newsletter, social, etc.)

---

## Data Quality Notes

- LinkedIn's % change is vs. the prior equivalent period — useful context but don't over-index on it
- Mailchimp click rate counts unique clicks per unique recipient — not total clicks
- Slack reaction counts are a proxy for "did this land?" — they're directional, not precise
- If any source is unavailable (not logged in, permission error), note it clearly in the dashboard and add "Data unavailable — [reason]" to that section's summary card. Don't skip the section entirely.
