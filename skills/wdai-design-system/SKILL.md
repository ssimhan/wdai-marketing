---
name: wdai-design
description: "Apply this skill for ALL Women Defining AI visual work — HTML/React interfaces, presentation slides, PowerPoint decks, Word documents, social media graphics, and any WDAI-branded asset. This is the single source of truth for WDAI visual identity: colors, typography, patterns, logo usage, and design tokens. NOT for writing voice — use wdai-brand for that. MANDATORY TRIGGERS: WDAI design, WDAI brand colors, WDAI visual, WDAI style, create a WDAI-branded [artifact], slide deck, presentation, social graphic."
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files (`colors_and_type.css`, `assets/`, `preview/`, `slides/`, `ui_kits/`, `formats.md`).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out of this skill folder and create static HTML files for the user to view. Import `colors_and_type.css` at the top of each HTML file and apply `class="wdai"` to `<body>` or the root to inherit defaults.

If creating non-HTML artifacts (PowerPoint, Word, social media graphics), read `formats.md` for format-specific rules.

If working on production code, read the rules in `README.md` and the tokens in `colors_and_type.css` to become an expert in designing with this brand. The token names (`--wdai-pink`, `--grad-hero`, `--glow-pink`, etc.) should be lifted directly into the codebase.

If the user invokes this skill without any other guidance, ask them what they want to build or design (slide deck? microsite page? marketing landing? PowerPoint? social graphic?), ask some questions about audience and tone, and act as an expert designer who outputs HTML artifacts, production code, or format-specific guidance depending on the need.

**Strict brand rules to never break:**
- Palette is strict — no pastels, neon, cyan, or teal.
- Magenta glow `#8b2fa6` is **atmospheric only** — never a fill.
- Never render text *inside* illustrations. Text lives in HTML/React.
- ~35 words per slide maximum.
- Avoid the words *genuinely, honestly, straightforward, simply*.
- Never infantilize; never default to "guys".
