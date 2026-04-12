# Daily Content Scout

A React app that runs 7 Slack keyword passes across the WDAI workspace, cross-references results against the Luma event calendar, and posts tagged content opportunities to `#team-marketing-workstream2-content-ideas`.

**This is not a Claude Code skill** — it's a standalone application with its own UI. It requires Slack MCP and Google Calendar MCP connections.

## What it does

1. On Monday: searches 72h (Fri–Mon). All other days: 24h.
2. Runs 7 keyword passes (shipping, demos, tools, journey, feedback, topic channels, session-inspired)
3. Fetches upcoming WDAI events (next 14 days) from the Luma calendar
4. Claude analyzes results and tags each opportunity [Internal], [External], or [Both]
5. Posts formatted results to `#team-marketing-workstream2-content-ideas`

## Output format

Each opportunity includes:
- What was built / what's happening
- Source channel
- Content angle
- `→ Push to` (required for Internal/Both — who's missing this and where they live)
- `→ Tied to` (if calendar connection exists)
- Urgency (High / Medium / Low)

## Running it

This app is designed to run in Claude's artifact environment (React + fetch access to Anthropic API). Deploy or run via the CC artifacts panel.

**Optional focus note**: Enter a focus for today's scout (e.g. "Module 2 launching next week — flag SheBuilds IWD stories") before running.

## System prompt + search passes

The core logic (system prompt and keyword passes) is in `app.jsx`. To update what the scout looks for, edit `SEARCH_PASSES`. To change how it classifies results, edit the `SYSTEM_PROMPT` constant.

## Constants

```
CONTENT_IDEAS_CHANNEL_ID = C0AKR6N50T0
LUMA_CALENDAR_ID = ednnph5j2tft0a8qahllu39ua0v174nc@import.calendar.google.com
MODEL = claude-sonnet-4-20250514
```

## Related

- `skills/adhoc-content-activator/` — takes a scout result and turns it into a ready-to-execute activation plan
- `skills/wdai-promo-planner-programmatic/` — reads from the ideas channel at Step 2
- `skills/wdai-promo-planner-adhoc/` — reads from the ideas channel at Step 0
