# Agent Gotchas

Patterns that have caused silent bugs, wrong assumptions, or wasted build cycles in this project. Updated after each `/fix` or `/audit` session.

---

## Pattern: Duplicate infrastructure, not logic

**Tell:** You're building a second file that does the same external call (Slack, GitHub, Luma) as an existing file.

**Wrong:**
```ts
// slack-notifier.ts
const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), 10000)
// ... fetch ...
clearTimeout(timeoutId)

// slack-dm.ts — same pattern copied
const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), 10000)
// ... fetch ...
clearTimeout(timeoutId)
```

**Right:**
```ts
// slack-utils.ts — single source
export async function slackPost(url, headers, body): Promise<Response> { ... }

// both callers import and use slackPost
```

**How to apply:** Before writing a second Slack/HTTP sender, read the existing one. Extract the shared timeout/error pattern to a utility first, then build both callers on top of it.

---

## Pattern: Encoder without a decoder

**Tell:** You write a data format into a button value or URL param that another file will need to parse — but only write the encoder.

**Wrong:**
```ts
// formatter encodes
value: `${draft.luma_id}|${draft.channel}`

// handler parses ad-hoc, no shared constant
const [lumaId, channel] = action.value.split('|')
```

**Right:**
```ts
// slack-utils.ts — paired and documented
export function encodeButtonValue(lumaId: string, channel: string): string {
  return `${lumaId}|${channel}`
}
export function decodeButtonValue(value: string): { lumaId: string; channel: string } {
  const [lumaId, channel] = value.split('|')
  return { lumaId, channel }
}
```

**How to apply:** Whenever you define a serialization format that another module will parse, write both functions in the same file before using either one.

---

## Pattern: Self-referencing CSS variables

**Tell:** You see a CSS var defined as `--varname: var(--varname)` or with no fallback value.

**Wrong:**
```css
:root {
  --pink-tint: var(--pink-tint);
  --lavender-tint: var(--lavender-tint);
}

.hover { background: var(--pink-tint); } /* Invisible — var resolves to nothing */
```

**Right:**
```css
:root {
  --pink: #e93583;
  --pink-tint: rgba(233, 53, 131, 0.07);
  --lavender-tint: rgba(134, 88, 157, 0.07);
}
```

**How to apply:** In `/audit` → P0 Standards, add CSS validation: `grep -n "var(--[a-z-]*): *var(--[a-z-]*)" *.html *.css`. Any hit is invisible UI — fix before testing.

---

## Pattern: Fragile CLI entry point detection

**Tell:** A tool uses `process.argv[1]?.includes('filename')` or `process.argv[1].startsWith()` to detect if it's the main module.

**Wrong:**
```ts
if (process.argv[1]?.includes('publisher')) {
  main()
}
// Breaks if file is renamed, run via wrapper, or symlinked
```

**Right:**
```ts
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
if (process.argv[1] === __filename) {
  main()
}
```

**How to apply:** In `/audit` → P0 Standards, check CLI entry points: for each `main()` or entry handler, verify it uses ESM-safe (`fileURLToPath + exact match`) or CommonJS-safe (`require.main === module`), not substring matching.

---

## Pattern: Audit subagent over-escalates severity

**Tell:** The subagent marks something "Blocking" but the failing scenario is a deferred block (Block E, Vercel, etc.) — not a current test.

**Wrong:**
> "This encoding is undocumented — BLOCKING because the handler needs it."

**Right:**
> "The handler doesn't exist yet (deferred). This is Improvement — document the format now so Block E has a contract to implement against."

**How to apply:** Re-triage every "Blocking" finding with: *"Does this break the current test suite?"* If no — downgrade to Improvement. Document the expectation as a code comment or shared utility instead.

---

_Last updated: 2026-04-18 (Phase 6 + Design System closeout)_
