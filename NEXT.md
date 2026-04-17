# Next Steps

**Nothing is buildable right now** — all remaining work is blocked on two external setups: Slack app approval and Vercel org connection. This file tells you exactly what to do the moment each blocker is resolved.

---

## When Slack app is approved

Follow the setup steps in [Phase 4 plan → "Slack App Setup"](docs/plans/2026-04-16-phase-4-vercel-slack.md#slack-app-setup-pending-admin-approval--2026-04-17).

**Step-by-step:**
1. Go to https://api.slack.com/apps → open the pending app
2. Incoming Webhooks → Add webhook → channel: `#team-marketing-workstream2-content-ideas` → copy URL
3. OAuth & Permissions → Bot Token Scopes: `chat:write`, `im:write` → Install → copy `xoxb-...` token
4. Basic Information → copy Signing Secret
5. Add to `.env.local`: `SLACK_WEBHOOK_URL`, `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`
6. Add `SLACK_WEBHOOK_URL` to GitHub Actions secrets (repo Settings → Secrets → Actions)
7. Trigger the sync manually to test the webhook: GitHub Actions → Calendar Sync → Run workflow

**Then build (in order):**
- Phase 5 Block D — Slack DM copy review
  - `slack-dm.ts` — Bot DM client (`sendCopyReviewDM`)
  - `slack-dm.ts` — `formatCopyReviewMessage()` Block Kit formatter
  - `copy-review.ts` — dispatch DMs + `--notify` flag on `generate.ts`
  - See [Phase 5 plan → Block D](docs/plans/2026-04-16-phase-5-copy-generation.md) for full spec

---

## When Vercel is set up

Follow [Phase 4 plan → "Chunk C1"](docs/plans/2026-04-16-phase-4-vercel-slack.md#chunk-c1-vercel-project-setup-1-hour-mostly-manual) (manual steps in browser).

**Step-by-step:**
1. Connect this repo to a Vercel project (Framework: Other, Output Dir: `vault`)
2. Enable Vercel Authentication → add team email addresses
3. Push `vercel.json` (already in the plan) → verify deployment
4. Add env vars to Vercel: `SLACK_SIGNING_SECRET`, `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`
5. Set Interactivity URL in Slack app: `https://<vercel-url>/api/slack/interactions`

**Then build (in order):**
- Phase 4 Block D2 — serverless `approve_plan` endpoint wired to Vercel (handler already built at `api/slack/interactions.ts`)
- Phase 5 Block E remainder — `approve_copy` + `edit_copy` handlers, edit modal
  - See [Phase 5 plan → Block E](docs/plans/2026-04-16-phase-5-copy-generation.md) for full spec

---

## What's done

| Area | Status |
|------|--------|
| Sync pipeline (Luma → calendar files) | ✅ |
| Change detection | ✅ |
| Slack channel notifications (webhook + Block Kit) | ✅ |
| Approval status tracking + calendar badges | ✅ |
| Interactive Approve/Edit buttons on Slack messages | ✅ |
| Copy data model + flat-file storage | ✅ |
| AI copy generation (voice guides, prompt builder, Claude API, CLI) | ✅ |
| Copy display in calendar viewer (HTML badges + copy panels) | ✅ |
| Slack interaction endpoint — signature verification + `approve_plan` | ✅ |

## What's left

| Area | Blocked on |
|------|-----------|
| Slack webhook live + GitHub Actions secret set | Slack app approval |
| Phase 5 Block D — Slack DM copy review to leaders | Slack app approval |
| Vercel deployment + team auth | Vercel org setup |
| Phase 5 Block E — `approve_copy`, `edit_copy`, edit modal | Vercel live |

---

## Overall roadmap

- **Phase 4** — Vercel + Slack Approval Loop: ✅ Blocks A/B/D1 · ⏳ Blocks C/D2
- **Phase 5** — AI Copy Generation + Per-Leader Approval: ✅ Blocks A/B/C · ⏳ Blocks D/E
- **Phase 6** — Auto-Publishing (LinkedIn org page, Mailchimp drafts)
- **Phase 7** — Leader onboarding, personal LinkedIn OAuth, voice calibration per leader
