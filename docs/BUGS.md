# BUGS & TECHNICAL DEBT

| ID | Description | Severity | Active | Note |
|----|-------------|----------|--------|------|
| DEBT-002 | Pagination in `luma-client.ts` (line 38) exits if `next_cursor` is null even when `has_more` is true. Should assert or warn if `has_more && !next_cursor`. | Low | Yes | Phase 3 |
| DEBT-003 | `renderCalendar` in `writer.ts` — `summaryRow()` and `detailBlock()` mix date formatting with markdown structure. If date format or field set changes, both functions must change in sync. Consider a structured field-list approach. | Low | Yes | Phase 3 |
| DEBT-007 | `html-writer.ts` — `CHANNEL_LABELS`, `CHANNEL_CSS`, `TYPE_DOT_CSS`, `TYPE_PILL_CSS` are four separate record maps for the same two domains (channels + event types). Consolidate into one object per domain (e.g., `CHANNEL_META`, `TYPE_META`) to reduce maintenance surface when adding new channels or types. | Low | Yes | Phase 3 Block B |
| DEBT-008 | `html-writer.ts` — `renderDateView()` and `renderEventView()` each mix data transformation (grouping, flattening, date math) with HTML template generation in one function body. If rendering logic or data structure changes, both concerns must change in sync. | Low | Yes | Phase 3 Block B |
| DEBT-009 | `sync.ts` line 21 — `loadPromoRules` and `loadOverrides` are synchronous but are wrapped in `Promise.resolve()` to fit the `Promise.all` pattern. This is misleading; prefer sequential calls or a comment explaining the pattern. | Low | Yes | Phase 3 Block B |
| DEBT-010 | `vault/content-calendar.html` fails to open via `file://` protocol due to browser CORS restrictions. Solution: serve via HTTP. | Low | No | Phase 3 Closeout |

## Resolved

| ID | Description | Resolution |
|----|-------------|-----------|
| DEBT-001 | `FIXTURE_PATH` relative to CWD | Changed to `new URL('./__fixtures__/luma-events.json', import.meta.url).pathname` — now resolves relative to module file, works from any CWD. |
| DEBT-010 | `vault/content-calendar.html` CORS issue on `file://` | Added `npm run vault:serve` script (http-server on :8000). Updated MANUAL_TESTS.md to document. |
