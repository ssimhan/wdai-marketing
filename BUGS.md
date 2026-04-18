# Bugs & Technical Debt

## Low Priority (DEBT)

### DEBT-001: Slack timeout pattern duplicated
**Files:** `tools/calendar/slack-notifier.ts:4,88-114` and `tools/calendar/slack-dm.ts:4,6-34`  
Both define `SLACK_TIMEOUT_MS = 10000` and the identical `AbortController` + `clearTimeout` pattern. If timeout behavior needs to change, both must be updated.  
**Fix:** Extract a shared `slackFetch(url, options)` helper to `tools/calendar/slack-utils.ts`. Update imports in both files.  
**When:** If a third Slack call is added, or if timeout behavior diverges.

### DEBT-002: `luma_id|channel` button value encoding is undocumented
**File:** `tools/calendar/slack-dm.ts:47`  
The pipe-delimited encoding `${draft.luma_id}|${draft.channel}` in button values has no shared constant or comment. The parser in `api/slack/interactions.ts` (Block E, not yet built) will need to match this exactly.  
**Fix:** Add a comment at the encoding site, or extract `encodeButtonValue(lumaId, channel)` / `decodeButtonValue(value)` helpers when Block E is built.  
**When:** Before implementing `approve_copy` / `edit_copy` handlers.

### DEBT-003: Moment lookup duplicated in slack-dm and copy-review
**Files:** `tools/calendar/slack-dm.ts:42-45` and `tools/calendar/copy-review.ts:21-22`  
Both use `event.channel_plan.find(m => m.channel === draft.channel)` to look up the DRI for a moment. Adding a third caller would be a third copy.  
**Fix:** Extract `getMomentDri(event, channel)` to `tools/calendar/copy-review.ts` or a shared util. Update both callers.  
**When:** If a third caller needs this lookup.
