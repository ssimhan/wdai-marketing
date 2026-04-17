# Phase 4: Vercel + Slack Approval Loop

**Goal:** When a Luma event syncs, the system notifies Slack with a promo plan and captures approval — all viewable on a Vercel-hosted content calendar with magic-link auth.

**Architecture:** The sync pipeline gains two new stages: (1) a Slack notifier that posts new/changed events as Block Kit messages with interactive buttons, and (2) a Vercel-hosted calendar app with a serverless endpoint that receives Slack button clicks and updates approval status in the repo. Data stays in flat files — no database.

**Design Patterns:** Observer (sync triggers notification), Adapter (Slack Block Kit formatter), Repository (status reader/writer for flat-file storage).

**Tech Stack:** TypeScript, Slack Block Kit, Slack Web API, Vercel (static site + serverless functions), GitHub API, vitest.

**PRD Reference:** Based on interview session 2026-04-16 — see conversation history for full vision statement.

---

## Conventions (from codebase audit)

- **Test style:** vitest, `describe`/`it`/`expect`, mock data inline, `__tests__/` directories
- **File patterns:** ES module imports, named exports, types in `types.ts`
- **Error handling:** `console.warn` for non-fatal, `throw` for fatal, `process.exit(1)` in CLI
- **Live service tests:** gated behind `describe.skipIf(!process.env.FLAG)`
- **Reuse:**
  - `loadYaml()` in `rules-loader.ts` — reuse for any new YAML config loading
  - `CalendarEntry` already has `copy_status`, `channel_plan`, `dri` — these are the fields needed for Slack messages
  - `mapLumaEvent()` already computes the full promo plan
  - GitHub Actions workflow already has sync + commit pattern

## Slack App Setup (pending admin approval — 2026-04-17)

App creation submitted to Slack workspace admin. Once approved:

1. Go to **https://api.slack.com/apps** → open the pending app
2. **Incoming Webhooks** → toggle ON → "Add New Webhook to Workspace"
   - Channel: **`#team-marketing-workstream2-content-ideas`**
   - Copy the webhook URL → `SLACK_WEBHOOK_URL`
3. **Interactivity & Shortcuts** → toggle ON (can be done now, even before Vercel)
   - Request URL: `https://<vercel-url>/api/slack/interactions` (fill in after Vercel deploy)
   - Copy **Signing Secret** from "Basic Information" → `SLACK_SIGNING_SECRET`
4. **OAuth & Permissions** → Bot Token Scopes: add `chat:write`, `im:write`
   - Install to Workspace → copy `xoxb-...` token → `SLACK_BOT_TOKEN`
5. Add to `.env.local` for local testing
6. Add `SLACK_WEBHOOK_URL` to GitHub Actions secrets (repo Settings → Secrets → Actions)
   - `SLACK_SIGNING_SECRET` and `SLACK_BOT_TOKEN` when Vercel is ready

## Environment & Secrets

- [ ] `SLACK_WEBHOOK_URL` — Slack incoming webhook for notifications (GitHub Secrets + `.env.local`)
- [ ] `SLACK_BOT_TOKEN` — Slack Bot OAuth token for interactive messages (GitHub Secrets + `.env.local`)
- [ ] `SLACK_SIGNING_SECRET` — Vercel uses this to verify Slack requests
- [ ] Load order: `.env.local` first, then `.env` (established pattern in `sync.ts`)
- [ ] All secret-holding files confirmed in `.gitignore`
- [ ] Idempotency: Slack notifications include event `luma_id` — duplicate syncs don't produce duplicate messages (dedup by checking status file)

## Timeout Mapping

| Call | Timeout | Notes |
|------|---------|-------|
| Slack Incoming Webhook POST | 10s | Fire-and-forget; sync continues on failure |
| Slack Web API (postMessage) | 10s | For interactive messages with buttons |
| GitHub API (update file) | 10s | From Vercel serverless, updates status |
| Luma API (existing) | 10s | Already set in `luma-client.ts` |

## Live-Service Test Gates

| Service | Env Flag | Used In |
|---------|----------|---------|
| Slack API | `SLACK_LIVE_TEST=true` | `slack-notifier.test.ts` |
| Luma API | `LUMA_LIVE_TEST=true` | `luma-client.test.ts` (existing) |

---

## Block A: Slack Notification Pipeline (no Vercel needed)

**Goal:** After each calendar sync, post a formatted summary of new/changed events to a Slack channel.

**Success Criteria:**
- [x] `formatSlackMessage(entries)` returns valid Slack Block Kit JSON
- [x] `detectChanges(previous, current)` identifies new and changed events
- [x] `sendSlackNotification(url, blocks)` POSTs to a webhook
- [x] Sync pipeline calls notifier after writing calendar files
- [ ] GitHub Actions workflow includes Slack notification step
- [x] All unit tests pass; live Slack test gated behind env flag
- [x] Duplicate syncs with no changes produce no Slack message

### Chunk A1: Slack Message Formatter (~1.5 hours) ✅

**Files:**
- Create: `tools/calendar/slack-notifier.ts` ✅
- Create: `tools/calendar/__tests__/slack-notifier.test.ts` ✅
- Modify: `tools/calendar/types.ts` (add `SlackBlock` type alias) ✅

**What to build:**
1. Write test: `formatSlackMessage([mockEntry])` returns Block Kit JSON with event name, type, dates, DRI, channel plan as a bulleted list ✅
2. Write test: `formatSlackMessage([])` returns null (nothing to notify) ✅
3. Implement `formatSlackMessage()` — pure function, no network calls ✅
4. Verify: `npm test` ✅
5. Commit: `feat(slack): add Block Kit message formatter for calendar notifications` ✅

**Block Kit structure (target output):**
```json
{
  "blocks": [
    { "type": "header", "text": { "type": "plain_text", "text": "📅 Content Calendar Update" } },
    { "type": "section", "text": { "type": "mrkdwn", "text": "*AI Basics W27*\nType: `ai-basics` | Start: May 4\nDRI: Sheena" } },
    { "type": "section", "text": { "type": "mrkdwn", "text": "*Channel Plan:*\n• LinkedIn (WDAI) — Apr 20 — Announce open enrollment\n• Email — Apr 27 — Member invite" } },
    { "type": "divider" }
  ]
}
```

### Chunk A2: Change Detection (~1.5 hours) ✅

**Files:**
- Create: `tools/calendar/diff.ts` ✅
- Create: `tools/calendar/__tests__/diff.test.ts` ✅

**What to build:**
1. Write test: `detectChanges([], currentEntries)` → all entries are "new" ✅
2. Write test: `detectChanges(previousEntries, sameEntries)` → empty result (no changes) ✅
3. Write test: `detectChanges(previousEntries, updatedEntries)` → detects changed event (date moved, DRI changed, etc.) ✅
4. Implement `detectChanges(previous: CalendarEntry[], current: CalendarEntry[]): { added: CalendarEntry[], changed: CalendarEntry[] }` ✅
5. Strategy: compare by `luma_id`, detect changes by comparing a hash of key fields (start_at, end_at, dri, channel_plan length) ✅
6. Persist previous state: save `vault/.calendar-snapshot.json` after each sync (gitignored) — *deferred to A3*
7. Verify: `npm test` ✅
8. Commit: `feat(diff): detect new and changed events between syncs` ✅

### Chunk A3: Webhook Sender + Sync Integration (~1 hour) ✅

**Files:**
- Modify: `tools/calendar/slack-notifier.ts` (add `sendSlackNotification()`) ✅
- Modify: `tools/calendar/sync.ts` (call notifier after writing files) ✅
- Modify: `tools/calendar/__tests__/slack-notifier.test.ts` (add send test) ✅

**What to build:**
1. Write test: `sendSlackNotification(mockUrl, blocks)` calls `fetch` with correct headers/body (mock `fetch`) ✅
2. Implement `sendSlackNotification(webhookUrl: string, blocks: SlackBlock[])` — POST with 10s timeout, catches errors (logs warning, doesn't crash sync) ✅
3. Update `sync.ts`: ✅
   - After writing md/html files, load previous snapshot ✅
   - Run `detectChanges(previous, current)` ✅
   - If changes exist, call `formatSlackMessage()` → `sendSlackNotification()` ✅
   - Save new snapshot ✅
4. Add `SLACK_WEBHOOK_URL` to `.env.example` ✅
5. Verify: `npm test` + manual `npm run calendar:sync:mock` (should skip notification if no webhook URL) ✅
6. Commit: `feat(slack): integrate webhook notification into sync pipeline` ✅

### Chunk A4: GitHub Actions Update (~30 min) ✅

**Files:**
- Modify: `.github/workflows/calendar-sync.yml` ✅

**What to build:**
1. Add `SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}` to the sync step's env ✅
2. Update the commit step to also `git add vault/.calendar-snapshot.json` (if not gitignored) or add it to `.gitignore` ✅ (added to .gitignore)
3. Also `git add vault/content-calendar.html` (currently only adding `.md`) ✅
4. Verify: review diff manually (no test for this — it's a config file) ✅
5. Commit: `ci(calendar): add Slack webhook and HTML to sync workflow` ✅

---

## Block B: Approval Status Tracking (no Vercel needed)

**Goal:** Track per-event approval status in flat files. Calendar viewer shows status badges.

**Success Criteria:**
- [x] Status YAML file per event stores approval state + history
- [x] `readStatus()` / `writeStatus()` functions with tests
- [x] `CalendarEntry` gains `approval_status` field
- [x] HTML viewer shows "Pending" / "Approved" badges
- [x] Status persists across syncs (not overwritten)

### Chunk B1: Status Data Model + Reader/Writer (~1.5 hours) ✅

**Files:**
- Modify: `tools/calendar/types.ts` (add `ApprovalStatus`, `PromoStatus` types) ✅
- Create: `tools/calendar/status.ts` ✅
- Create: `tools/calendar/__tests__/status.test.ts` ✅

**What to build:**
1. Add types: ✅
   ```typescript
   type ApprovalStatus = 'pending' | 'approved' | 'changes_requested'
   interface PromoStatus {
     luma_id: string
     approval_status: ApprovalStatus
     approved_by?: string
     approved_at?: string
     notes?: string
   }
   ```
2. Write test: `readAllStatuses('path/to/dir')` returns `Map<string, PromoStatus>` from YAML files ✅
3. Write test: `writeStatus('path/to/dir', status)` writes a YAML file named `<luma_id>.yaml` ✅
4. Write test: missing status dir returns empty map (graceful fallback) ✅
5. Implement using `loadYaml` pattern from `rules-loader.ts` ✅
6. Status files live in `vault/status/` directory ✅
7. Verify: `npm test` ✅
8. Commit: `feat(status): approval status model with flat-file reader/writer` ✅

### Chunk B2: Status Integration into Pipeline + Viewer (~2 hours) ✅

**Files:**
- Modify: `tools/calendar/types.ts` (add `approval_status` to `CalendarEntry`) ✅
- Modify: `tools/calendar/sync.ts` (load statuses, pass to mapper) ✅
- Modify: `tools/calendar/mapper.ts` (accept optional status) ✅
- Modify: `tools/calendar/html-writer.ts` (render status badges) ✅
- Modify: `tools/calendar/__tests__/mapper.test.ts` (test with status) ✅
- Modify: `tools/calendar/__tests__/html-writer.test.ts` (test badge rendering) ✅

**What to build:**
1. Add `approval_status: ApprovalStatus` to `CalendarEntry` (default: `'pending'`) ✅
2. Update `mapLumaEvent()` to accept optional `statuses: Map<string, PromoStatus>` — looks up status by `luma_id` ✅
3. Update `sync.ts` to load statuses from `vault/status/` and pass to mapper ✅
4. Update `renderEventView()` in html-writer to show status badge next to event name: ✅
   - `pending` → yellow "⏳ Pending" pill ✅
   - `approved` → green "✅ Approved" pill ✅
   - `changes_requested` → orange "✏️ Changes Requested" pill ✅
5. Update writer.ts `summaryRow()` to include status in markdown table ✅
6. Tests for each change ✅
7. Verify: `npm test` + `npm run calendar:sync:mock` + check HTML ✅
8. Commit: `feat(status): integrate approval badges into calendar viewer` ✅

---

## Block C: Vercel Deployment + Auth (needs Vercel access) — DEFERRED

**Goal:** Content calendar live on the web, gated by magic-link auth for the team.

**Success Criteria:**
- [ ] `vault/content-calendar.html` accessible at a Vercel URL
- [ ] Vercel Authentication enabled with whitelisted team emails
- [ ] Auto-redeploys on push to `main`
- [ ] `vercel.json` configures the project correctly

**Status:** Deferred until Phase 4 Phase 2 — requires manual Vercel setup (org connection, auth config)

### Chunk C1: Vercel Project Setup (~1 hour, mostly manual)

**Files:**
- Create: `vercel.json`

**What to build:**
1. Create `vercel.json`:
   ```json
   {
     "outputDirectory": "vault",
     "cleanUrls": true,
     "headers": [
       { "source": "/(.*)", "headers": [{ "key": "X-Robots-Tag", "value": "noindex" }] }
     ]
   }
   ```
2. Manual steps (in browser):
   - Connect repo to Vercel project
   - Set Framework Preset to "Other"
   - Set Output Directory to `vault`
   - No build command needed (static files)
   - Enable Vercel Authentication → add team email addresses
3. Push `vercel.json` → verify deployment works
4. Test: open URL → magic link email → calendar loads
5. Commit: `ci(vercel): add project config for static vault deployment`

---

## Block D: Slack Interactive Approval (needs Vercel live) — PARTIAL

**Goal:** Approve/Edit buttons on Slack messages. Button clicks update status in the repo.

**Success Criteria:**
- [x] Slack messages include "Approve" and "Edit Plan" buttons (D1 ✅)
- [ ] Button clicks hit Vercel serverless endpoint (D2 — deferred)
- [ ] Endpoint verifies Slack signature, updates status file via GitHub API (D2 — deferred)
- [ ] Git push triggers redeploy → calendar shows updated status (D2 — deferred)

**Status:** D1 (buttons) complete. D2 (serverless handler) deferred until Vercel setup.

### Chunk D1: Interactive Buttons in Messages (~1 hour) ✅

**Files:**
- Modify: `tools/calendar/slack-notifier.ts` (add action buttons to Block Kit) ✅
- Modify: `tools/calendar/__tests__/slack-notifier.test.ts` ✅

**What to build:**
1. Update `formatSlackMessage()` to append an `actions` block per event: ✅
   ```json
   {
     "type": "actions",
     "elements": [
       { "type": "button", "text": { "type": "plain_text", "text": "✅ Approve" }, "action_id": "approve_plan", "value": "<luma_id>" },
       { "type": "button", "text": { "type": "plain_text", "text": "✏️ Edit Plan" }, "action_id": "edit_plan", "value": "<luma_id>" }
     ]
   }
   ```
2. Test: formatted message includes actions block with correct `value` fields ✅
3. Verify: `npm test` ✅
4. Commit: `feat(slack): add Approve/Edit buttons to notification messages` ✅

### Chunk D2: Vercel Serverless Endpoint (~2 hours)

**Files:**
- Create: `api/slack/approve.ts` (Vercel serverless function)
- Create: `tools/calendar/__tests__/approve-handler.test.ts`

**What to build:**
1. Create `api/slack/approve.ts`:
   - Verify Slack request signature (using `SLACK_SIGNING_SECRET`)
   - Parse `action_id` and `value` (luma_id) from payload
   - If `approve_plan`: update status file in repo via GitHub API (Contents API — `PUT /repos/{owner}/{repo}/contents/vault/status/{luma_id}.yaml`)
   - If `edit_plan`: respond with Slack modal (stretch — can defer to Phase 5)
   - Return 200 with ephemeral "Plan approved!" response
2. Write unit test for the handler logic (mock GitHub API + Slack signature)
3. Add `GITHUB_TOKEN`, `SLACK_SIGNING_SECRET` to Vercel env vars
4. Verify: deploy to Vercel, test with Slack button click
5. Commit: `feat(slack): Vercel serverless endpoint for plan approval`

---

## Technical Debt Strategy

| Item | Description | Deferred? |
|------|-------------|-----------|
| Edit modal | "Edit Plan" button should open a Slack modal — defer to Phase 5 when copy editing is built | Yes |
| Snapshot file location | `.calendar-snapshot.json` in vault/ may cause noise in git — may need to gitignore | Evaluate during A2 |
| Slack rate limits | No retry/backoff on Slack webhook failures | Acceptable for MVP — events are low volume |
| GitHub API token scope | Vercel endpoint needs a fine-grained token with `contents:write` on this repo only | Set up during D2 |

---

## Execution Order (COMPLETED — Session 2026-04-16)

**Completed (no external dependencies):**
1. ✅ Chunk A1 — Slack message formatter
2. ✅ Chunk A2 — Change detection
3. ✅ Chunk B1 — Status data model

**Completed (Slack webhook ready):**
4. ✅ Chunk A3 — Webhook sender + sync integration
5. ✅ Chunk A4 — GitHub Actions update

**Completed (status tracking):**
6. ✅ Chunk B2 — Status integration into viewer
7. ✅ Chunk D1 — Interactive buttons in messages

**Deferred (Vercel setup required):**
8. ⏳ Chunk C1 — Vercel project setup
9. ⏳ Chunk D2 — Serverless endpoint for approval

---

## Updated Roadmap (Phases 4–7)

### Phase 4: Vercel + Slack Approval Loop (target: May 1)
- ✅ Blocks A, B, D1 — **COMPLETED** (Session 2026-04-16)
  - Slack notifications with change detection ✅
  - Approval status tracking with visual badges ✅
  - Interactive buttons on Slack messages ✅
- ⏳ Blocks C, D2 — **DEFERRED** (requires Vercel setup and manual configuration)

### Phase 5: Copy Generation + Per-Leader Approval
- AI drafts copy per channel using existing skills
- Slack DMs to responsible leaders
- Leader approves via emoji or replies with edits
- Approved copy stored in `vault/promos/<event-id>/copy/`
- "Edit Plan" Slack modal built here

### Phase 6: Auto-Publishing (org channels only)
- WDAI LinkedIn auto-post (org page API token)
- Mailchimp draft creation (hooks into existing `wdai-mc` system)
- Mailchimp auto-send (optional, behind a flag)
- Publishing status tracked in vault

### Phase 7: Leader Onboarding + Handoff
- Personal LinkedIn OAuth flow per leader
- Voice skill calibration per leader
- Docs, maintenance runbook
- Team training on the content calendar
