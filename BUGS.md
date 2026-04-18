# Bugs & Technical Debt

_All items resolved as of 2026-04-18._

## Resolved

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
