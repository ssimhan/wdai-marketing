# BUGS & TECHNICAL DEBT

| ID | Description | Severity | Active | Note |
|----|-------------|----------|--------|------|
| DEBT-001 | `FIXTURE_PATH` in `luma-client.ts` (line 5) is relative to CWD. Works via `npm run` from repo root; would break if module is imported from a different working directory. Fix: use `new URL('../__fixtures__/luma-events.json', import.meta.url)` to resolve relative to module. | Low | Yes | Phase 3 |
| DEBT-002 | Pagination in `luma-client.ts` (line 38) exits if `next_cursor` is null even when `has_more` is true. Should assert or warn if `has_more && !next_cursor`. | Low | Yes | Phase 3 |
| DEBT-003 | `renderCalendar` in `writer.ts` — `summaryRow()` and `detailBlock()` mix date formatting with markdown structure. If date format or field set changes, both functions must change in sync. Consider a structured field-list approach. | Low | Yes | Phase 3 |
