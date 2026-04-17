# Next Steps

Pick up here at the start of each session.

## Blocked on External Setup

| # | What | Blocker | Plan |
|---|------|---------|------|
| 1 | Slack webhook → `#team-marketing-workstream2-content-ideas` | Admin approval pending (submitted 2026-04-17) | [Phase 4 plan](docs/plans/2026-04-16-phase-4-vercel-slack.md) → "Slack App Setup" |
| 2 | Vercel project setup (Phase 4 Block C1) | Manual org connection required | [Phase 4 plan](docs/plans/2026-04-16-phase-4-vercel-slack.md) → "Chunk C1" |

## Ready to Build

| # | What | Depends on | Plan |
|---|------|-----------|------|
| 3 | Phase 5 Block D — Slack DM copy review (`slack-dm.ts`, `copy-review.ts`) | Slack Bot app (separate from webhook app) | [Phase 5 plan](docs/plans/2026-04-16-phase-5-copy-generation.md) → "Block D" |
| 4 | Phase 5 Block E completion — `approve_copy` + `edit_copy` handlers, edit modal, `vercel.json` | Vercel live | [Phase 5 plan](docs/plans/2026-04-16-phase-5-copy-generation.md) → "Block E" |

## What's Already Done

- **Phase 4** — Blocks A, B, D1 ✅ (Slack notifier, change detection, interactive buttons, approval badges)
- **Phase 5** — Blocks A, B, C ✅ (copy data model, AI generation, calendar viewer display)
- **Phase 5 Block E** — Partial: signature verification + `approve_plan` handler built; `approve_copy`/`edit_copy` still needed

## Overall Roadmap

- **Phase 4** — Vercel + Slack Approval Loop: Blocks A/B/D1 ✅ · Blocks C/D2 ⏳ (external setup)
- **Phase 5** — AI Copy Generation + Per-Leader Approval: Blocks A/B/C ✅ · Block D ⏳ (needs Slack Bot) · Block E ⏳ (needs Vercel)
- **Phase 6** — Auto-Publishing (LinkedIn, Mailchimp)
- **Phase 7** — Leader Onboarding + Handoff
