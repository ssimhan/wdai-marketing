# Phase 5: AI Copy Generation + Per-Leader Approval

**Goal:** After a promo plan is approved, the system generates channel-specific marketing copy using Claude, stores it in the vault, displays it in the calendar viewer, and DMs the responsible leader in Slack for approval.

**Architecture:** The pipeline gains three new stages: (1) a copy generator that reads voice guides + event context and calls Claude to draft per-channel copy, (2) flat-file copy storage in `vault/promos/<luma_id>/`, and (3) a Slack DM flow that sends copy drafts to the DRI for approval. Data stays in flat files — no database.

**Design Patterns:** Strategy (per-channel prompt variation), Repository (copy reader/writer), Template Method (shared prompt structure with channel-specific inserts).

**Tech Stack:** TypeScript, `@anthropic-ai/sdk`, Slack Web API (`chat.postMessage`), vitest.

**Key Insight:** Three voice guides already exist in the vault — `brand-guidelines.md` (150 lines), `linkedin-voice.md` (72 lines), `helen-voice.md` (68 lines). These are the raw material for channel-specific prompts. The copy generator loads them at generation time, not at build time.

---

## Conventions (carried from Phase 4)

- **Test style:** vitest, `describe`/`it`/`expect`, mock data inline, `__tests__/` directories
- **File patterns:** ES module imports, named exports, types in `types.ts`
- **Error handling:** `console.warn` for non-fatal, `throw` for fatal, `process.exit(1)` in CLI
- **Live service tests:** gated behind `describe.skipIf(!process.env.FLAG)`
- **Reuse:**
  - `readAllStatuses()` / `writeStatus()` in `status.ts` — adapt pattern for copy storage
  - `formatSlackMessage()` / `sendSlackNotification()` — adapt for DM messages
  - `CalendarEntry.channel_plan` has all context needed per moment (channel, dri, label, date)
  - Voice guides in `vault/` are loaded as raw text at generation time

## Environment & Secrets

- [ ] `ANTHROPIC_API_KEY` — Claude API key for copy generation (`.env.local` + GitHub Secrets)
- [ ] `SLACK_BOT_TOKEN` — Slack Bot OAuth token for DMs (`.env.local` + GitHub Secrets)
- [ ] Load order: `.env.local` first, then `.env` (established pattern)
- [ ] All secret-holding files confirmed in `.gitignore`
- [ ] Idempotency: copy generation skips moments that already have approved drafts

## Timeout Mapping

| Call | Timeout | Notes |
|------|---------|-------|
| Claude API (Messages) | 60s | Long generation; single retry on timeout |
| Slack Web API (postMessage) | 10s | For DMs; log + continue on failure |

## Live-Service Test Gates

| Service | Env Flag | Used In |
|---------|----------|---------|
| Claude API | `ANTHROPIC_LIVE_TEST=true` | `copy-generator.test.ts` |
| Slack Bot API | `SLACK_LIVE_TEST=true` | `slack-dm.test.ts` |

---

## Block A: Copy Data Model + Storage (no external deps) ✅ COMPLETE

**Goal:** Define how copy drafts are stored and tracked. Flat-file YAML in `vault/promos/`.

**Success Criteria:**
- [x] `CopyDraft` type defined with channel, content, status, metadata
- [x] `readEventCopy(lumaId)` returns all drafts for an event
- [x] `writeCopyDraft(lumaId, draft)` writes a per-channel YAML file
- [x] Missing directory returns empty (graceful fallback)
- [x] All unit tests pass

### Chunk A1: Copy Types + Storage Reader/Writer (~1.5 hours)

**Files:**
- Modify: `tools/calendar/types.ts` (add `CopyDraft`, `CopyDraftStatus` types)
- Create: `tools/calendar/copy-store.ts`
- Create: `tools/calendar/__tests__/copy-store.test.ts`

**What to build:**
1. Add types:
   ```typescript
   type CopyDraftStatus = 'draft' | 'pending_review' | 'approved' | 'published'

   interface CopyDraft {
     luma_id: string
     channel: PromoChannel
     label: string           // from PromoMoment.label
     content: string         // the generated copy text
     status: CopyDraftStatus
     generated_at: string    // ISO 8601
     generated_by: string    // 'claude' or 'manual'
     approved_by?: string
     approved_at?: string
     revised_content?: string  // if leader edits before approving
   }
   ```
2. Write test: `readEventCopy('nonexistent')` returns empty array
3. Write test: `writeCopyDraft('evt-001', draft)` creates `vault/promos/evt-001/linkedin-wdai.yaml`
4. Write test: `readEventCopy('evt-001')` returns array of CopyDraft from all YAML files in that event dir
5. Write test: writing to same channel overwrites (idempotent)
6. Write test: `readEventCopy` ignores non-YAML files
7. Implement using the `status.ts` reader/writer pattern
8. Storage layout: `vault/promos/<luma_id>/<channel>.yaml`
9. Verify: `npm test`
10. Commit: `feat(copy): add CopyDraft types and flat-file storage`

### Chunk A2: Copy Lifecycle Integration (~1.5 hours)

**Files:**
- Modify: `tools/calendar/types.ts` (update `CopyStatus` type, add `copy_drafts` to `CalendarEntry`)
- Modify: `tools/calendar/mapper.ts` (accept optional copy drafts)
- Modify: `tools/calendar/sync.ts` (load copy drafts during sync)
- Modify: `tools/calendar/__tests__/mapper.test.ts` (test copy draft loading)

**What to build:**
1. Add optional `copy_drafts: CopyDraft[]` field to `CalendarEntry`
2. Update `mapLumaEvent()` to accept optional `copyMap: Map<string, CopyDraft[]>` — looks up by luma_id
3. Update `sync.ts` to load all copy from `vault/promos/` and pass to mapper
4. Derive `copy_status` from copy drafts:
   - No drafts → `'🔲 Not started'`
   - All drafts approved → `'✅ Approved'`
   - Any draft pending → `'🟡 In progress'`
   - All published → `'📤 Sent'`
5. Tests for status derivation logic
6. Verify: `npm test` + `npm run calendar:sync:mock`
7. Commit: `feat(copy): integrate copy draft lifecycle into sync pipeline`

---

## Block B: AI Copy Generation (needs ANTHROPIC_API_KEY) ✅ COMPLETE

**Goal:** Generate channel-specific marketing copy using Claude, informed by voice guides and event context.

**Success Criteria:**
- [x] Voice guides loaded from vault at generation time
- [x] Per-channel prompt templates produce appropriate tone/style
- [x] `generateCopy(event, moment)` returns a CopyDraft
- [x] Batch generation skips moments with approved copy
- [x] CLI command: `calendar generate-copy --event <id>`
- [x] All unit tests pass; live Claude test gated behind env flag

### Chunk B1: Voice Guide Loader + Prompt Builder (~2 hours)

**Files:**
- Create: `tools/calendar/voice-loader.ts`
- Create: `tools/calendar/prompt-builder.ts`
- Create: `tools/calendar/__tests__/voice-loader.test.ts`
- Create: `tools/calendar/__tests__/prompt-builder.test.ts`

**What to build:**
1. `loadVoiceGuides()` reads all `vault/*.md` voice/brand files, returns a map:
   ```typescript
   interface VoiceGuides {
     brand: string       // vault/brand-guidelines.md
     linkedin: string    // vault/linkedin-voice.md
     slack: string       // vault/helen-voice.md (Helen's Slack voice)
   }
   ```
2. Write test: `loadVoiceGuides()` returns content from all three files
3. Write test: graceful fallback if a voice file is missing (warn, use empty string)
4. `buildPrompt(event, moment, voiceGuides)` returns a structured prompt:
   - **System prompt:** Brand guidelines + channel-specific voice guide
   - **User prompt:** Event name, type, dates, registration URL, moment label, channel, DRI
5. Write test: LinkedIn prompt includes `linkedin-voice.md` content, NOT `helen-voice.md`
6. Write test: Slack prompt includes `helen-voice.md` content, NOT `linkedin-voice.md`
7. Write test: Email prompt includes brand guidelines but no channel-specific voice (generic)
8. Channel → voice guide mapping:
   - `linkedin-wdai` → `vault/linkedin-voice.md`
   - `linkedin-personal` → `vault/linkedin-voice.md`
   - `slack` → `vault/helen-voice.md`
   - `email` → brand guidelines only (no specific voice guide yet)
9. Verify: `npm test`
10. Commit: `feat(copy): voice guide loader and per-channel prompt builder`

**Prompt structure (target):**
```
System: You are a marketing copywriter for Women Defining AI. Write a {channel} post
for the following event. Match the voice and style guide exactly.

=== BRAND GUIDELINES ===
{brand-guidelines.md content}

=== VOICE GUIDE ({channel}) ===
{channel-specific voice guide content}

User: Write a {label} for this event:
- Event: {name}
- Type: {event_type}
- Dates: {start_at} - {end_at}
- Registration: {luma_url}
- Channel: {channel}
- Tone: {derived from voice guide}

Output just the post copy. No preamble, no explanation.
```

### Chunk B2: Claude API Client + Single-Channel Generator (~1.5 hours)

**Files:**
- Create: `tools/calendar/copy-generator.ts`
- Create: `tools/calendar/__tests__/copy-generator.test.ts`
- Modify: `package.json` (add `@anthropic-ai/sdk`)

**What to build:**
1. `npm install @anthropic-ai/sdk`
2. Create `generateCopy(event: CalendarEntry, moment: PromoMoment, voiceGuides: VoiceGuides): Promise<CopyDraft>`
   - Calls `buildPrompt()` to construct the prompt
   - Calls Claude API with `claude-haiku-4-5-20251001` (fast, cheap for drafts)
   - 60s timeout, single retry on timeout
   - Returns a `CopyDraft` with `status: 'draft'`
3. Write test (mocked API): `generateCopy()` returns a CopyDraft with expected fields
4. Write test (mocked API): returns draft with `generated_by: 'claude'` and timestamp
5. Write test: throws on API error after retry
6. Write live test (gated): `generateCopy()` calls real Claude API and returns non-empty content
7. Verify: `npm test`
8. Commit: `feat(copy): Claude API client for single-channel copy generation`

### Chunk B3: Batch Generation CLI Command (~2 hours)

**Files:**
- Create: `tools/calendar/generate.ts` (CLI entry point)
- Modify: `package.json` (add `calendar:generate` script)
- Create: `tools/calendar/__tests__/generate.test.ts`

**What to build:**
1. CLI command: `npx tsx tools/calendar/generate.ts --event <luma_id>`
   - Loads event from latest sync snapshot (vault/.calendar-snapshot.json)
   - Loads voice guides
   - For each moment in channel_plan where no approved copy exists:
     - Calls `generateCopy()` to get a draft
     - Calls `writeCopyDraft()` to save it
   - Prints summary: N moments generated, M skipped (already approved)
2. Add `--all` flag to generate for all events with approved promo plans
3. Add `--dry-run` flag to show what would be generated without calling API
4. Add `--channel <channel>` flag to regenerate a specific channel only
5. Add `--model <model>` flag to override the default model (e.g., `claude-sonnet-4-6` for higher quality)
6. Add `calendar:generate` npm script
7. Write test: dry-run mode does not call API or write files
8. Write test: skips moments with existing approved copy
9. Write test: generates for all un-drafted moments
10. Verify: `npm test` + manual test with `--dry-run`
11. Commit: `feat(copy): batch generation CLI with dry-run and channel filter`

---

## Block C: Copy in Calendar Viewer (no external deps) ✅ COMPLETE

**Goal:** Display generated copy in the HTML calendar viewer and markdown output.

**Success Criteria:**
- [x] Copy panels show generated text instead of placeholder
- [x] Per-moment copy status badge visible
- [x] Markdown includes copy excerpts in detail blocks
- [x] Empty copy shows "Generate with `npm run calendar:generate`" prompt

### Chunk C1: HTML Viewer Copy Display (~2 hours)

**Files:**
- Modify: `tools/calendar/html-writer.ts` (render copy in `.copy-panel` and `.plan-copy-inner`)
- Modify: `tools/calendar/writer.ts` (add copy excerpts to markdown detail blocks)
- Modify: `tools/calendar/__tests__/html-writer.test.ts` (test copy rendering)
- Modify: `tools/calendar/__tests__/writer.test.ts` (test copy in markdown)

**What to build:**
1. Update Date View `.copy-panel`: if copy exists for that moment, show the text; if not, show "*(Run `npm run calendar:generate` to draft copy)*"
2. Update Event View `.plan-copy-inner`: same logic for the expandable copy panel per channel row
3. Add copy status badge per moment row:
   - `draft` → gray "Draft" pill
   - `pending_review` → yellow "Pending Review" pill
   - `approved` → green "Approved" pill
   - `published` → blue "Published" pill
4. Update `renderCalendar()` in writer.ts: add copy excerpt (first 100 chars) under each moment in the channel plan table
5. Tests: copy present → renders content; copy absent → renders prompt
6. Tests: copy status badge renders correct class
7. Verify: `npm test` + `npm run calendar:sync:mock` + open HTML
8. Commit: `feat(copy): display generated copy in calendar viewer`

---

## Block D: Slack DM Copy Review (needs SLACK_BOT_TOKEN)

**Goal:** After copy is generated, send each draft to the responsible leader via Slack DM for approval.

**Success Criteria:**
- [ ] `sendCopyReviewDM(userId, draft, event)` sends a formatted DM
- [ ] DM includes copy text, event context, and approve/edit buttons
- [ ] Batch DM flow sends one DM per unapproved draft
- [ ] Duplicate DMs prevented (track sent status)
- [ ] All unit tests pass; live Slack test gated behind env flag

### Chunk D1: Slack Bot DM Client (~1.5 hours)

**Files:**
- Create: `tools/calendar/slack-dm.ts`
- Create: `tools/calendar/__tests__/slack-dm.test.ts`
- Modify: `.env.example` (add `SLACK_BOT_TOKEN`)

**What to build:**
1. `sendCopyReviewDM(botToken, userId, blocks)` — calls `chat.postMessage` via Slack Web API
   - POST to `https://slack.com/api/chat.postMessage`
   - Headers: `Authorization: Bearer ${botToken}`, `Content-Type: application/json`
   - Body: `{ channel: userId, blocks }`
   - 10s timeout, logs warning on failure (doesn't crash)
2. Write test (mocked fetch): calls correct endpoint with auth header
3. Write test (mocked fetch): catches and logs errors without throwing
4. Add `SLACK_BOT_TOKEN` to `.env.example`
5. Verify: `npm test`
6. Commit: `feat(slack): Slack Bot DM client for copy review`

### Chunk D2: Copy Review Message Formatter (~1.5 hours)

**Files:**
- Modify: `tools/calendar/slack-dm.ts` (add `formatCopyReviewMessage()`)
- Modify: `tools/calendar/__tests__/slack-dm.test.ts` (add formatter tests)

**What to build:**
1. `formatCopyReviewMessage(event, draft)` returns Block Kit JSON:
   ```json
   {
     "blocks": [
       { "type": "header", "text": { "type": "plain_text", "text": "Copy Draft for Review" } },
       { "type": "section", "text": { "type": "mrkdwn", "text": "*AI Basics W27*\nChannel: `linkedin-wdai` | Moment: Announce open enrollment\nScheduled: Apr 20" } },
       { "type": "divider" },
       { "type": "section", "text": { "type": "mrkdwn", "text": "<actual copy text here>" } },
       { "type": "divider" },
       { "type": "actions", "elements": [
         { "type": "button", "text": { "type": "plain_text", "text": "Approve" }, "style": "primary", "action_id": "approve_copy", "value": "<luma_id>|<channel>" },
         { "type": "button", "text": { "type": "plain_text", "text": "Edit" }, "action_id": "edit_copy", "value": "<luma_id>|<channel>" }
       ]}
     ]
   }
   ```
2. Write test: message includes event name and channel
3. Write test: message includes full copy text
4. Write test: buttons encode luma_id and channel in value
5. Verify: `npm test`
6. Commit: `feat(slack): copy review DM message formatter`

### Chunk D3: DM Dispatch + CLI Integration (~2 hours)

**Files:**
- Create: `tools/calendar/copy-review.ts` (orchestrates sending DMs)
- Modify: `tools/calendar/generate.ts` (add `--notify` flag)
- Modify: `tools/calendar/__tests__/copy-review.test.ts`

**What to build:**
1. `dispatchCopyReviews(event, drafts, driSlackMap)` — for each draft in `pending_review` status:
   - Look up DRI's Slack user ID from `driSlackMap` (config: `tools/calendar/team.yaml`)
   - Format review message
   - Send DM
   - Update draft status to `pending_review`
2. `team.yaml` config maps DRI names to Slack user IDs:
   ```yaml
   team:
     Sandhya: U0123456789
     Sheena: U0123456790
     Helen: U0123456791
   ```
3. Add `--notify` flag to `generate.ts`: after generating, dispatch review DMs
4. Write test: dispatches DM for each pending draft
5. Write test: skips already-approved drafts
6. Write test: logs warning if DRI not found in team.yaml
7. Write test: `--notify` without `SLACK_BOT_TOKEN` logs warning and skips
8. Verify: `npm test`
9. Commit: `feat(copy): dispatch review DMs to leaders after generation`

---

## Block E: Interactive Copy Approval (needs server endpoint) — PARTIAL

**Goal:** Handle Slack button clicks for copy approval/editing. This block also completes Phase 4 deferred work (Vercel setup + plan approval handler).

**Dependency:** Requires a running server to receive Slack interaction payloads. Options: Vercel serverless, or a lightweight alternative (ngrok for dev, Railway/Fly.io for prod).

**Success Criteria:**
- [ ] Slack button clicks reach the handler endpoint
- [ ] `approve_copy` updates draft status to `approved`
- [ ] `edit_copy` opens a Slack modal with the copy text
- [ ] Modal submission updates copy content and status
- [x] Plan approval (`approve_plan` from Phase 4) also handled

**Status:** `api/slack/interactions.ts` built with signature verification + `handleApprovePlan`. Missing: `approve_copy`, `edit_copy` handlers, Slack modal, `vercel.json`.

### Chunk E1: Interaction Endpoint + Signature Verification (~2 hours)

**Files:**
- Create: `api/slack/interactions.ts` (Vercel serverless function)
- Create: `tools/calendar/__tests__/interactions-handler.test.ts`
- Create: `vercel.json`

**What to build:**
1. Create `vercel.json` (static site config for vault + API routes)
2. Create `api/slack/interactions.ts`:
   - Verify Slack request signature using `SLACK_SIGNING_SECRET`
   - Parse `payload` from form-encoded body
   - Route by `action_id`: `approve_plan`, `approve_copy`, `edit_copy`
   - Return 200 with ephemeral acknowledgment
3. Signature verification helper (extract to testable function)
4. Write test: valid signature passes verification
5. Write test: invalid signature returns 401
6. Write test: routes to correct handler based on action_id
7. Verify: `npm test`
8. Commit: `feat(api): Slack interaction endpoint with signature verification`

### Chunk E2: Copy Approval + Plan Approval Handlers (~1.5 hours)

**Files:**
- Modify: `api/slack/interactions.ts` (add handler implementations)
- Modify: `tools/calendar/__tests__/interactions-handler.test.ts`

**What to build:**
1. `handleApprovePlan(lumaId, userId)`:
   - Update `vault/status/<luma_id>.yaml` via GitHub Contents API
   - Set `approval_status: 'approved'`, `approved_by`, `approved_at`
   - Return ephemeral "Plan approved!" response
2. `handleApproveCopy(lumaId, channel, userId)`:
   - Update `vault/promos/<luma_id>/<channel>.yaml` via GitHub Contents API
   - Set `status: 'approved'`, `approved_by`, `approved_at`
   - Return ephemeral "Copy approved for {channel}!"
3. Both handlers use GitHub API: `PUT /repos/{owner}/{repo}/contents/{path}`
4. Write test: approve_plan updates status file content
5. Write test: approve_copy updates copy file content
6. Write test: returns correct ephemeral message
7. Add `GITHUB_TOKEN`, `SLACK_SIGNING_SECRET` to Vercel env vars list
8. Verify: `npm test`
9. Commit: `feat(api): plan and copy approval handlers via GitHub API`

### Chunk E3: Edit Modal for Copy Revisions (~2 hours)

**Files:**
- Modify: `api/slack/interactions.ts` (add modal open + submission handling)
- Create: `tools/calendar/slack-modal.ts` (modal builder)
- Create: `tools/calendar/__tests__/slack-modal.test.ts`

**What to build:**
1. `buildCopyEditModal(lumaId, channel, currentCopy)` returns Slack modal view JSON:
   - Title: "Edit Copy — {channel}"
   - Text input block pre-filled with current copy
   - Submit button: "Save & Approve"
   - Private metadata: `{ luma_id, channel }` (for submission routing)
2. `handleEditCopy(lumaId, channel, triggerId)`:
   - Load current copy from GitHub API
   - Call `slack.views.open()` with the modal
   - Requires `SLACK_BOT_TOKEN` for views.open
3. Handle `view_submission` callback:
   - Extract edited text from submission values
   - Update copy file via GitHub API (set `revised_content`, `status: 'approved'`)
   - Send confirmation DM: "Copy updated and approved for {channel}"
4. Write test: modal includes current copy in text input
5. Write test: submission updates copy file with revised content
6. Write test: private_metadata correctly encodes luma_id + channel
7. Verify: `npm test`
8. Commit: `feat(slack): edit modal for copy revisions with save-and-approve`

---

## Technical Debt Strategy

| Item | Description | Deferred? |
|------|-------------|-----------|
| Voice guide per leader | Each leader should have their own voice file (not just Helen) | Yes — Phase 7 |
| Copy versioning | No history of previous drafts; overwrite only | Yes — acceptable for MVP |
| Slack user ID discovery | team.yaml is manually maintained | Yes — Phase 7 onboarding |
| Email copy template | No email-specific voice guide yet | Yes — use brand guidelines for now |
| Rate limiting | No retry/backoff on Claude API rate limits | Evaluate during B2 |
| Copy length validation | No guardrails on generated copy length per channel | Log to BUGS.md if it becomes an issue |

---

## Execution Order

**Can do right now (no external dependencies):**
1. Chunk A1 — Copy types + storage
2. Chunk A2 — Copy lifecycle integration
3. Chunk B1 — Voice guide loader + prompt builder

**Can do after `npm install @anthropic-ai/sdk` + API key:**
4. Chunk B2 — Claude API client
5. Chunk B3 — Batch generation CLI

**Can do after copy generation works:**
6. Chunk C1 — Copy in calendar viewer

**Can do after creating Slack Bot app:**
7. Chunk D1 — Slack Bot DM client
8. Chunk D2 — Copy review message formatter
9. Chunk D3 — DM dispatch + CLI integration

**Needs Vercel or alternative server:**
10. Chunk E1 — Interaction endpoint
11. Chunk E2 — Copy + plan approval handlers
12. Chunk E3 — Edit modal

---

## Estimated Effort

| Block | Chunks | Total Hours |
|-------|--------|-------------|
| A: Copy Data Model | A1, A2 | ~3h |
| B: AI Copy Generation | B1, B2, B3 | ~5.5h |
| C: Calendar Viewer | C1 | ~2h |
| D: Slack DM Review | D1, D2, D3 | ~5h |
| E: Interactive Approval | E1, E2, E3 | ~5.5h |
| **Total** | **12 chunks** | **~21h** |
