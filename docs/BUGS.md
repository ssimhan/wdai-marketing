# BUGS & TECHNICAL DEBT

| ID | Description | Severity | Active | Note |
|----|-------------|----------|--------|------|

## Resolved

| ID | Description | Resolution |
|----|-------------|-----------|
| DEBT-011 | `formatDate` duplicated in `writer.ts` and `html-writer.ts` | Extracted to `tools/calendar/date-utils.ts`; both files now import from there |
| DEBT-012 | Magic `14` in `mapper.ts` | Extracted as `PROMO_WINDOW_DAYS = 14` with explanatory comment |
| DEBT-013 | Global `_uid` / `resetUid()` in `html-writer.ts` | Replaced with `makeUidGen()` closure; generator passed into `renderDateView`/`renderEventView` |

---

## Previously Resolved

| ID | Description | Resolution |
|----|-------------|-----------|
| DEBT-001 | `FIXTURE_PATH` relative to CWD | Changed to `new URL('./__fixtures__/...', import.meta.url).pathname` — resolves relative to module file. |
| DEBT-002 | Pagination exits when `has_more=true` but `next_cursor=null` | Added `console.warn` when this inconsistency is detected. |
| DEBT-003 | `summaryRow()`/`detailBlock()` coupling | Added comment documenting the coupling so future editors know to update both. |
| DEBT-007 | Four separate record maps for channels/types | Consolidated into `CHANNEL_META` and `TYPE_META` objects — add new channels/types in one place. |
| DEBT-008 | Data transformation mixed into render functions | Extracted `groupMomentsByWeek()` and `eventDateRange()` as pure helpers. |
| DEBT-009 | Sync functions wrapped in misleading `Promise.resolve()` | Replaced `Promise.all` with sequential calls — matches actual synchronous nature of loaders. |
| DEBT-010 | `vault/content-calendar.html` CORS issue on `file://` | Added `npm run vault:serve` script (http-server on :8000). Updated MANUAL_TESTS.md to document. |
