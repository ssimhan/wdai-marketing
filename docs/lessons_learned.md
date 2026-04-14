# Lessons Learned

## 2026-04-14 — Phase 3 Block A: Luma Calendar Sync

### Architectural Insights

**The Adapter Pattern for External APIs**
When integrating third-party APIs, use a single adapter module (`luma-client.ts`) that is the *only* place in the codebase that touches the external data shape. All other modules work with your internal `CalendarEntry` type. This keeps refactoring isolated — if the Luma API changes, only one file changes.

**Pure Functions as Recipe Cards**
Build mapper and writer functions as pure functions (input → output, no side effects, no API calls). This makes them trivial to test in isolation and easy to reason about. `mapLumaEvent()` and `renderCalendar()` have zero dependencies on each other or the CLI layer.

**Idempotency is Safety**
Writing to the same output file every time (idempotent) is safer than appending. It ensures a daily cron job doesn't accumulate garbage, and each run produces the same result.

### Spec-Crafting for AI Agents

**Date/String Assertions Need Runtime Verification**
When writing test assertions for formatted strings (dates, locale output), the plan author must verify the exact runtime format *before* committing the assertion. Two failures occurred:
- `Date.toISOString()` always includes milliseconds (`.000Z`), not just `Z`
- `toLocaleDateString()` renders locale format (`'Apr 12, 2026'`), not ISO format

**Next time:** Include in the plan: "Confirm the exact runtime output format for all `.toBe()` or `.toContain()` assertions on dates or formatted strings before writing the test."

### Test Infrastructure Discipline

**Environment Variable Cleanup Must Be Deterministic**
The test for mock mode set `process.env.LUMA_MOCK = 'true'` and then deleted it. If an assertion threw before the delete line, the env var remained dirty, breaking subsequent tests. Always use `afterEach` to guarantee cleanup, not manual deletion at the end of a test.

### What Went Well

- TDD caught two plan issues (date formats) early — no runtime bugs
- Modular architecture (client, mapper, writer) made each block independently testable
- Mock mode gated via `LUMA_MOCK` flag + fixture file meant full pipeline works without API access
- `npm run calendar:sync:mock` verified idempotency instantly (run twice, same output)

### What to Improve

- Date timezone handling is correct but confusing — document assumptions in code comments
- Pagination logic is fragile (assumes `has_more` and `next_cursor` stay in sync) — add assertions
- Relative fixture path (`tools/calendar/__fixtures__/luma-events.json`) works via `npm run` but breaks in other contexts — use `import.meta.url`

---

## References

- **Plan**: `docs/plans/2026-04-12-calendar-sync.md`
- **Audit findings**: `docs/BUGS.md` (3 low-severity debt items)
- **Code**: `tools/calendar/` (types, mapper, writer, client, sync entry point)
- **Tests**: 14 passing, 1 skipped (live API gated)
