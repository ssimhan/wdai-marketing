# Phase 6 + Design System Integration Plan

## Context

Phases 4–5 built the full pipeline through copy generation and Slack DM review. Approved copy now sits in `vault/promos/<luma_id>/<channel>.yaml` with `status: 'approved'`. Phase 6 closes the loop by auto-publishing that approved copy to LinkedIn (org page) and Mailchimp (campaign draft). The design system integration (Phase C) commits the existing untracked `skills/wdai-design-system/` and applies its brand tokens to the calendar HTML viewer.

---

## Part A: Phase 6 — Auto-Publishing

**Goal:** Read approved copy drafts from vault and publish them — LinkedIn org page via API, Mailchimp via direct API creating a draft campaign.

**Architecture:** New module `tools/calendar/publisher.ts` mirrors the `generate.ts` pattern: exports `runPublish(event, promosDir, options)` for testing + a `main()` for CLI use. Two new API clients handle the external calls. Dry-run mode is mandatory.

**Design patterns:** Strategy (per-channel publisher), Repository (reads from copy-store), Command (CLI entry point)

**Tech stack:** TypeScript, native `fetch`, vitest

**New env vars needed:**
- `LINKEDIN_ACCESS_TOKEN` — org page OAuth token
- `LINKEDIN_ORGANIZATION_ID` — numeric org ID (for `urn:li:organization:<id>`)
- `MAILCHIMP_API_KEY` — Mailchimp v3 API key
- `MAILCHIMP_SERVER_PREFIX` — e.g. `us1`
- `MAILCHIMP_AUDIENCE_ID` — list ID for the marketing audience

---

### Block A1: Types + Core Publisher Module

**Success criteria:**
- [x] `CopyDraft` has `published_at?: string` field
- [x] `runPublish` returns `{ published, skipped, errors }` counts
- [x] Dry-run mode logs what would be published without calling any API
- [x] Only `status === 'approved'` drafts are processed
- [x] After success, draft is updated to `status: 'published'` with `published_at` timestamp
- [x] `calendar:publish` script registered in `package.json`

**Files:**
- Modify: `tools/calendar/types.ts` — add `published_at?: string` to `CopyDraft`
- Create: `tools/calendar/publisher.ts`
- Create: `tools/calendar/__tests__/publisher.test.ts`
- Modify: `package.json` — add `"calendar:publish": "npx tsx tools/calendar/publisher.ts"`
- Modify: `.env.example` — add the 5 new env vars with comments

**Chunk A1.1 — Extend types + scaffold publisher**

1. Add `published_at?: string` after `approved_at?` in `CopyDraft` interface in `tools/calendar/types.ts`
2. Write failing tests in `publisher.test.ts`:
   - `runPublish` with no approved drafts returns `{ published: 0, skipped: 1, errors: 0 }`
   - `runPublish` with `dryRun: true` returns preview list, calls no external functions
   - `runPublish` with approved draft calls channel publisher once (mock)
3. Implement `publisher.ts` scaffold:
   ```ts
   export interface PublishOptions { dryRun?: boolean; channel?: PromoChannel }
   export interface PublishResult  { published: number; skipped: number; errors: number; dryRunPreviews?: string[] }
   export async function runPublish(event, promosDir, options): Promise<PublishResult>
   ```
   - Read drafts via `readEventCopy(promosDir, event.luma_id)`
   - Filter to `status === 'approved'`
   - In dry-run: collect preview strings, return early
   - For each approved draft: call `publishToChannel(draft)`, on success call `writeCopyDraft` with `status: 'published'` + `published_at: new Date().toISOString()`
4. Verify: `npm test`
5. Commit: `feat(publish): scaffold publisher module + extend CopyDraft with published_at`

---

### Block A2: LinkedIn Publisher

**Success criteria:**
- [x] `postToLinkedIn(content, orgId, token)` makes correct API call
- [x] Uses `draft.revised_content ?? draft.content`
- [x] Times out after 15s; throws on non-2xx
- [x] Fully mocked in unit tests (no live API calls without `LINKEDIN_LIVE_TEST=true`)

**Files:**
- Create: `tools/calendar/linkedin-client.ts`
- Modify: `tools/calendar/__tests__/publisher.test.ts` — add LinkedIn channel test
- Modify: `tools/calendar/publisher.ts` — wire in LinkedIn client

**Chunk A2.1 — LinkedIn client**

1. Write failing test: `postToLinkedIn` calls `fetch` with correct URL + body shape (`urn:li:organization:<id>`, `lifecycleState: 'PUBLISHED'`, correct share text)
2. Implement `tools/calendar/linkedin-client.ts`:
   ```ts
   export async function postToLinkedIn(content: string, orgId: string, token: string): Promise<void>
   ```
   - `POST https://api.linkedin.com/v2/ugcPosts`
   - Headers: `Authorization: Bearer <token>`, `X-Restli-Protocol-Version: 2.0.0`, `Content-Type: application/json`
   - Body: `{ author: "urn:li:organization:<orgId>", lifecycleState: "PUBLISHED", specificContent: { "com.linkedin.ugc.ShareContent": { shareCommentary: { text: content }, shareMediaCategory: "NONE" } }, visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" } }`
   - Timeout: 15s via `AbortController`
   - Throw on non-2xx: include status code in message
3. Wire into `publisher.ts`: channel `'linkedin-wdai'` → `postToLinkedIn(draft.revised_content ?? draft.content, LINKEDIN_ORGANIZATION_ID, LINKEDIN_ACCESS_TOKEN)`
4. Gate live test: `describe.skipIf(!process.env.LINKEDIN_LIVE_TEST)(...)`
5. Verify: `npm test`
6. Commit: `feat(publish): add LinkedIn org page publisher`

---

### Block A3: Mailchimp Publisher

**Success criteria:**
- [x] `createMailchimpDraft(subject, content, audienceId, apiKey, server)` creates a campaign and sets HTML content
- [x] Campaign is created as a draft (no schedule, no send)
- [x] Returns campaign ID for logging
- [x] Subject line derived from `event.title` + `moment.label`
- [x] Fully mocked in unit tests

**Files:**
- Create: `tools/calendar/mailchimp-client.ts`
- Modify: `tools/calendar/__tests__/publisher.test.ts` — add email channel test
- Modify: `tools/calendar/publisher.ts` — wire in Mailchimp client

**Chunk A3.1 — Mailchimp client**

1. Write failing tests:
   - `createMailchimpDraft` calls `POST /campaigns` with correct body (type: `regular`, list_id, subject_line, from_name)
   - Then calls `PUT /campaigns/<id>/content` with `{ html: <wrapped content> }`
   - Returns the campaign ID
2. Implement `tools/calendar/mailchimp-client.ts`:
   ```ts
   export async function createMailchimpDraft(
     subject: string,
     content: string,
     audienceId: string,
     apiKey: string,
     server: string,
   ): Promise<string> // returns campaign ID
   ```
   - Base URL: `https://${server}.api.mailchimp.com/3.0`
   - Auth: Basic `anystring:<apiKey>` (base64)
   - Step 1: `POST /campaigns` body: `{ type: "regular", recipients: { list_id: audienceId }, settings: { subject_line: subject, from_name: "Women Defining AI", reply_to: "team@womendefiningai.org" } }`
   - Step 2: `PUT /campaigns/<id>/content` body: `{ html: \`<html><body><pre style="font-family:sans-serif">${content}</pre></body></html>\` }`
   - Timeout: 15s
3. Wire into `publisher.ts`: channel `'email'` → `createMailchimpDraft(subject, content, ...)`
   - Subject: `[WDAI] ${event.title} — ${moment.label}`
4. Gate live test: `describe.skipIf(!process.env.MAILCHIMP_LIVE_TEST)`
5. Verify: `npm test`
6. Commit: `feat(publish): add Mailchimp draft creator for email channel`

---

### Block A4: CLI Entry Point + .env.example

**Success criteria:**
- [x] `npm run calendar:publish -- --event <id>` works end-to-end
- [x] `--dry-run` flag shows what would be published
- [x] `--channel linkedin-wdai` flag restricts to one channel
- [x] `.env.example` has all 5 new vars with comments
- [x] `NEXT.md` updated: Phase 6 status

**Chunk A4.1 — Wire CLI**

1. Add `main()` to `publisher.ts` with flags: `--event <luma_id>` | `--all`, `--dry-run`, `--channel <channel>`
2. Guard: `if (process.argv[1]?.includes('publisher')) { main().catch(...) }`
3. Update `.env.example` — add section:
   ```
   # Phase 6: Publishing
   LINKEDIN_ACCESS_TOKEN=     # org page OAuth token
   LINKEDIN_ORGANIZATION_ID=  # numeric org ID
   MAILCHIMP_API_KEY=         # v3 API key
   MAILCHIMP_SERVER_PREFIX=   # e.g. us1
   MAILCHIMP_AUDIENCE_ID=     # marketing list ID
   ```
4. Update `NEXT.md` to mark Phase 6 ✅ once complete
5. Commit: `feat(publish): CLI entry point + env vars for publishing`

---

## Part C: Design System Integration

**Goal:** Commit the existing design system skill + apply its brand tokens and Figtree typeface to the calendar HTML viewer.

**Architecture:** The calendar HTML is generated from `html-writer.ts:~306`. Only that file needs to change — the `.html` output is regenerated on every sync. The design system is dark-mode-first; the calendar is light-mode. Strategy: alias only the 4 brand accent colors and adopt the `Figtree` font. Keep local `:root` vars for surface/bg/border since they're intentionally different (light mode vs dark mode).

---

### Block C1: Commit Design System

**Success criteria:**
- [x] `skills/wdai-design-system/` tracked in git
- [x] README.md skills table includes wdai-design-system entry

**Chunk C1.1 — Commit + document**

1. Stage all files in `skills/wdai-design-system/`
2. Add row to README.md skills table:
   ```
   | **wdai-design-system** | Visual identity tokens for HTML, slides, and microsite components | Design artifact format + brief | Brand-compliant HTML/CSS output |
   ```
3. Commit: `feat(vault): add wdai-design-system skill — tokens, slides, microsite UI kit`

---

### Block C2: Apply Brand Tokens to Calendar HTML

**Success criteria:**
- [x] Calendar HTML uses Figtree font (loaded from Google Fonts in `<head>`)
- [x] The 4 brand accent variables match design system token values exactly
- [x] All 4 scattered hardcoded hex brand colors replaced with `:root` variables
- [x] Light-mode surface/bg/border colors unchanged
- [x] `npm run calendar:sync` regenerates HTML; output visually matches before (structure unchanged, only fonts/colors tightened)
- [x] All existing tests pass

**Files:**
- Modify: `tools/calendar/html-writer.ts` — update CSS const (~line 306) + add Google Fonts to `<head>`

**Chunk C2.1 — Figtree font**

1. In `html-writer.ts`, find the `<head>` template literal (search for `<meta charset`). Add before `<style>`:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">
   ```
2. In the `CSS` const, update `body { font-family: ... }` to:
   ```css
   font-family: 'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
   ```
3. Write test: snapshot test that generated HTML `<head>` includes the Google Fonts `<link>` (or just verify `npm test` still passes)
4. Commit: `feat(calendar): apply Figtree typeface from design system`

**Chunk C2.2 — Brand color token alignment**

1. In the `CSS` const's `:root` block, update the 4 accent variable VALUES to match design system (they already match, but make the alignment explicit via comment):
   ```css
   :root {
     /* Brand tokens — aligned with skills/wdai-design-system/colors_and_type.css */
     --pink: #e93583;      /* --wdai-pink */
     --orange: #ee8933;    /* --wdai-coral */
     --navy: #332961;      /* --warm-deep-indigo */
     --lavender: #86589d;  /* --wdai-lavender */
     /* Light-mode surface tokens (intentionally differ from dark-mode design system) */
     --bg: #f5f5f7;
     ...
   }
   ```
2. Audit the CSS const for any brand color hex values that appear OUTSIDE `:root` without a variable reference. Replace each with the appropriate `var(--pink)` / `var(--orange)` etc:
   - `#e93583` → `var(--pink)` (anywhere it appears outside `:root`)
   - `#ee8933` → `var(--orange)`
   - `#332961` → `var(--navy)`
   - `#86589d` → `var(--lavender)`
   - `#fdf4f8` (pink tint for hover/expand states) → `var(--pink-tint)` — add `--pink-tint: #fdf4f8` to `:root`
   - `#f0eef8` (lavender tint for hover/active states) → `var(--lavender-tint)` — add `--lavender-tint: #f0eef8` to `:root`
3. Run `npm run calendar:sync` to regenerate `.html` and spot-check in browser
4. Verify: `npm test`
5. Commit: `feat(calendar): align brand color variables with design system tokens`

---

## Technical Debt

None introduced. Both `linkedin-personal` (Phase 7) and Mailchimp auto-send (behind `--schedule` flag) are explicitly out of scope and will be tracked in `NEXT.md` when Phase 6 is closed out.

## Verification (end-to-end)

**Phase 6:**
```bash
# Dry run against a real event with approved drafts
npm run calendar:publish -- --event evt-uHbvwZ9hHgHHqds --dry-run

# Live test LinkedIn (requires token)
LINKEDIN_LIVE_TEST=true npm test -- publisher

# All tests pass
npm test
```

**Design system:**
```bash
# Regenerate and visually inspect
npm run calendar:sync
open vault/content-calendar.html
# Confirm: Figtree font loads, colors unchanged, layout intact
npm test
```
