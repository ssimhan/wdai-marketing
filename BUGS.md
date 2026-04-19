# Bugs & Technical Debt

_Last updated: 2026-04-18 (Phase 6 + Design System audit)._

## Open

_None._

---

## Resolved

### DEBT-004: Timeout/AbortController pattern duplicated across HTTP clients ✅ FIXED
**Files:** `tools/calendar/linkedin-client.ts:2-3` and `tools/calendar/mailchimp-client.ts:7-8`
Both implemented identical 15s `AbortController` + `clearTimeout` timeout logic inline.
**Fix:** Extracted to shared `httpFetch()` utility in `tools/calendar/http-utils.ts`. Both `linkedin-client.ts` and `mailchimp-client.ts` now import and delegate to it. Tests still passing (12/12 in client tests, 179/179 overall).

### DEBT-005: Entry point guard in publisher.ts is fragile ✅ FIXED
**File:** `tools/calendar/publisher.ts:150`
Used fragile substring match `process.argv[1]?.includes('publisher')`.
**Fix:** Replaced with ESM-safe path comparison: `import { fileURLToPath } from 'url'` + `const __filename = fileURLToPath(import.meta.url)` + `if (process.argv[1] === __filename)`. Tests passing (6/6 publisher tests, 179/179 overall).

### DEBT-001: Slack timeout pattern duplicated ✅ FIXED
**Files:** `tools/calendar/slack-notifier.ts:4,88-114` and `tools/calendar/slack-dm.ts:4,6-34`  
Both define `SLACK_TIMEOUT_MS = 10000` and the identical `AbortController` + `clearTimeout` pattern. If timeout behavior needs to change, both must be updated.  
**Fix:** Extracted `slackPost()` to `tools/calendar/slack-utils.ts`. Both `slack-notifier.ts` and `slack-dm.ts` now delegate to it.

### DEBT-002: `luma_id|channel` button value encoding is undocumented ✅ FIXED
**File:** `tools/calendar/slack-dm.ts:47`  
The pipe-delimited encoding `${draft.luma_id}|${draft.channel}` in button values has no shared constant or comment. The parser in `api/slack/interactions.ts` (Block E, not yet built) will need to match this exactly.  
**Fix:** Extracted `encodeButtonValue()` and `decodeButtonValue()` to `slack-utils.ts` with JSDoc. `formatCopyReviewMessage` now uses `encodeButtonValue`. Handler (Block E) can import `decodeButtonValue` when built.

### DEBT-003: Moment lookup duplicated in slack-dm and copy-review ✅ FIXED
**Files:** `tools/calendar/slack-dm.ts:42-45` and `tools/calendar/copy-review.ts:21-22`  
Both use `event.channel_plan.find(m => m.channel === draft.channel)` to look up the DRI for a moment. Adding a third caller would be a third copy.  
**Fix:** Extracted `getMoment(event, channel)` to `slack-utils.ts`. Both `slack-dm.ts` and `copy-review.ts` now import and use it.
