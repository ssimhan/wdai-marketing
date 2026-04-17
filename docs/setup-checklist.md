# Setup Checklist — WDAI Marketing Automation

Work through these in order. Each section's items gate the next section.

---

## Stage 1 — Smoke test (no accounts needed) ✅ Done

These work right now, before any external setup.

- [x] `npm run calendar:sync:mock` — prints "Fetched 2 events, Written to vault/..."
- [x] Open `vault/content-calendar.html` in browser — By Date, By Event, and How to Edit tabs all load
- [x] `npm test` — 129 passed, 2 skipped

---

## Stage 2 — Luma (unlocks live calendar sync) ✅ Done

**What you get:** Real events from lu.ma flow into the calendar instead of mock data.

1. Go to **lu.ma → Settings → Integrations** (requires Luma Plus)
2. Generate an API key
3. Add to `.env.local`:
   ```
   LUMA_API_KEY=luma_...
   ```
4. Add to GitHub repo secrets: **Settings → Secrets → Actions → New secret**
   - Name: `LUMA_API_KEY`, Value: the key
5. Smoke test:
   ```bash
   npm run calendar:sync
   ```
   Expected: real events appear in `vault/content-calendar.md`

> ✅ API key in `.env.local`. Live sync confirmed — 197 real Luma events fetched.

---

## Stage 3 — Anthropic API (unlocks copy generation) ⬜ Not done

**What you get:** `npm run calendar:generate` drafts marketing copy per channel using Claude.

1. Go to **console.anthropic.com → API Keys → Create key**
2. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
3. Smoke test (after Stage 2 so you have a real event snapshot):
   ```bash
   npm run calendar:generate -- --event <luma_id> --dry-run
   # then:
   npm run calendar:generate -- --event <luma_id>
   ```
   Expected: `vault/promos/<luma_id>/linkedin-wdai.yaml` created with generated copy

> No GitHub secret needed yet — copy generation runs locally or via CLI, not in CI.

> ⬜ **To do:** Create an API key at console.anthropic.com. This unlocks the main value of Phase 5.

---

## Stage 4 — Slack App (unlocks notifications + DM review) ⬜ Not done

**What you get:** Calendar sync posts to Slack. Copy drafts DM the responsible leader for approval.

### 4a. Create the Slack App

1. Go to **api.slack.com/apps → Create New App → From scratch**
   - Name: `WDAI Marketing Bot`
   - Workspace: WDAI workspace
2. Under **OAuth & Permissions → Bot Token Scopes**, add:
   - `chat:write` — post messages and DMs
   - `im:write` — open DM channels
   - `views:open` — open modals (needed for Phase 5 copy editing)
3. Under **Incoming Webhooks**, enable and click **Add New Webhook to Workspace**
   - Select the channel for calendar notifications (e.g. `#marketing-ops`)
   - Copy the webhook URL
4. Click **Install to Workspace**
5. Copy the **Bot User OAuth Token** (`xoxb-...`) from OAuth & Permissions

### 4b. Add to your environment

Add to `.env.local`:
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...   # found under App Credentials in Basic Information
```

Add to GitHub repo secrets:
- `SLACK_WEBHOOK_URL`
- `SLACK_BOT_TOKEN`
- `SLACK_SIGNING_SECRET`

### 4c. Find your team's Slack user IDs

For Phase 5 copy review DMs, you need each DRI's Slack user ID:

1. In Slack, click a team member's profile → **⋯ More** → **Copy member ID**
2. Edit `tools/calendar/team.yaml` (create it):
   ```yaml
   team:
     Sandhya: U0123456789
     Sheena:  U0123456790
     Helen:   U0123456791
   ```

### 4d. Smoke test

```bash
npm run calendar:sync
```
Expected: a message appears in your chosen Slack channel with event details and Approve/Edit buttons.

> ⬜ **To do:** Create Slack App at api.slack.com, add scopes, get webhook URL + bot token + signing secret.

---

## Stage 5 — Vercel (unlocks live calendar URL + button approvals) ⬜ Not done

**What you get:** `vault/content-calendar.html` is live on the web (team-only, magic-link auth). Slack Approve buttons update status in the repo.

### 5a. Deploy to Vercel

1. Go to **vercel.com → Add New Project → Import Git Repository**
   - Select `wdai-marketing`
2. Configure:
   - **Framework Preset:** Other
   - **Output Directory:** `vault`
   - **Build Command:** *(leave blank)*
   - **Install Command:** *(leave blank)*
3. Under **Settings → Deployment Protection**:
   - Enable **Vercel Authentication**
   - Add team email addresses (everyone who needs calendar access)
4. Deploy — note the production URL (e.g. `https://wdai-marketing.vercel.app`)

### 5b. Add env vars to Vercel

Go to **Project → Settings → Environment Variables** and add:
```
SLACK_SIGNING_SECRET   = <from Stage 4>
GITHUB_TOKEN           = <personal access token with contents:write on this repo>
GITHUB_OWNER           = womendefiningai          (or your GitHub org)
GITHUB_REPO            = wdai-marketing
```

**To create the GitHub token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained
2. Scope to this repo only, permission: **Contents → Read and write**

### 5c. Set the Slack Interactions URL

Once Vercel is live, go back to your Slack App:

1. **Interactivity & Shortcuts → Enable Interactivity**
2. **Request URL:** `https://<your-vercel-url>/api/slack/interactions`
3. Save

### 5d. Smoke test

1. Run `npm run calendar:sync` — Slack message appears
2. Click **Approve** on a Slack message
3. Check `vault/status/<luma_id>.yaml` in the repo — should show `approval_status: approved`
4. Check the calendar URL — approval badge should update on next sync

> ⬜ **To do:** Requires Stage 4 (Slack signing secret) first. Then deploy project to Vercel, add env vars, set interaction URL in Slack app config.

---

## Stage 6 — GitHub Actions (unlocks automated daily sync) ⬜ Not done

**What you get:** Calendar syncs automatically every day at 6am UTC without anyone running a command.

The workflow (`.github/workflows/calendar-sync.yml`) is already written. You just need the secrets from the stages above in place.

Verify:
1. All these GitHub secrets are set: `LUMA_API_KEY`, `SLACK_WEBHOOK_URL`
2. Go to **Actions → Calendar Sync → Run workflow** to trigger manually
3. Confirm it commits updated calendar files and posts to Slack

> ⬜ **To do:** `LUMA_API_KEY` secret already set. Just needs `SLACK_WEBHOOK_URL` (from Stage 4) to fully activate.

---

## Summary table

| Stage | What you set up | Status | Time estimate |
|-------|----------------|--------|---------------|
| 1 | Local smoke test | ✅ Done | — |
| 2 | Luma API key | ✅ Done | — |
| 3 | Anthropic API key | ⬜ Next up | ~5 min |
| 4 | Slack App + webhook + bot token | ⬜ After 3 | ~20 min |
| 5 | Vercel project + GitHub token + Slack interaction URL | ⬜ After 4 | ~20 min |
| 6 | Verify GitHub Actions automation | ⬜ After 5 | ~5 min |

Stage 3 is independent — do it any time (just needs an Anthropic account).
Stage 4 must come before Stage 5 (need the signing secret to configure Vercel).
Stage 5 must come before the Slack Approve buttons work.

---

## What's Complete (Phase 4-5)

✅ **Phase 4:**
- [x] Slack notifications after sync (change detection)
- [x] Per-event approval status tracking
- [x] Slack Approve/Edit action buttons on messages
- [x] `api/slack/interactions.ts` — serverless endpoint for button clicks
- [x] `vercel.json` — routing config for Vercel deployment

✅ **Phase 5:**
- [x] Copy generation CLI (`npm run calendar:generate`)
- [x] Voice guides loader (brand, LinkedIn, Helen voices)
- [x] AI copy generator (Anthropic Haiku model)
- [x] Copy storage in `vault/promos/<event-id>/`
- [x] Copy display in HTML calendar viewer
- [x] GitHub API integration for status file updates

## What's Deferred (Phase 5B)

The following would complete the workflow but aren't in the critical path:

- [ ] Slack DM to DRI with copy draft + approve button (requires SLACK_BOT_TOKEN setup)
- [ ] Slack edit modal for copy revisions
- [ ] Auto-dispatch of copy review DMs after generation

**These require:** SLACK_BOT_TOKEN setup + team.yaml with Slack user IDs. Implementation code is ready to write.
