# Women Defining AI — Design System

A design system for **Women Defining AI (WDAI)**, a non-profit community of women learning, building, and leading in AI. This system powers presentation slides (lesson decks, conference talks, workshop facilitator decks) and microsites that host them (`curriculum.helenleekupp.com`, future `hub.helenleekupp.com`).

## Products represented

- **Curriculum microsite** — Vite + React app at `curriculum.helenleekupp.com`. Keyboard-driven slide decks for AI Foundations, Intermediate, Advanced tracks. Each lesson is a deck of 3–5 slides; each track has 15 days.
- **Workshop facilitator decks** — HBS Exec, charter cohorts, conference keynotes. Same visual system, occasionally with on-slide facilitator notes.
- **Conference talk decks** — 15–30 slide one-offs, higher polish.
- **Marketing microsites** — future cohort signups, charter pages, program landing pages.

## Sources & provenance

- **Logo**: `assets/wdai-logo.png`. Bold "AI" monogram; "A" in pink→coral gradient, "I" in pink→coral gradient, with a translucent purple overlay forming a shared inner counter.
- **Brand brief**: Palette, typography, voice, and signature visual moves were provided directly in the intake conversation (see bottom of this file for full notes).
- No codebase, no Figma file, and no existing slide decks were attached — visual foundations are reconstructed from the written brief. **If a codebase or Figma becomes available, pass it to me and I'll sharpen the UI kit pixel-for-pixel.**

---

## Content fundamentals

Voice is **warm, confident, feminine-but-not-cute** — think *The Atlantic* feature writer crossed with a startup pitch deck. Write to a sophisticated professional audience. Never infantilize.

**Sentence shape.** Claim-first: load-bearing point at the front. Short paragraphs, one idea per paragraph. No em-dashes as sentence substitutes.

**Banned words.** Avoid *genuinely, honestly, straightforward, simply*. They flatten the voice.

**Pronouns.** Inclusive and specific. Never "guys," never default-male assumptions. "You" when addressing the reader directly, "we" when speaking as WDAI.

**Casing.** Sentence case for slide titles and UI. Title Case reserved for proper program names (*AI Foundations, Rung 2, Charter Cohort*). Never ALL CAPS except for tiny metadata labels (≤ 10px) or code.

**Emoji.** Used sparingly, for levity — one giant emoji on the occasional "emoji hero" slide. Never for decoration, bullet points, or on section dividers.

**Density.** Slides hold ~35 words max. Microsite body copy stays under 3 short paragraphs per section.

**Examples of on-voice copy**
- *"Large language models predict the next token. That prediction is most of what feels like intelligence."*
- *"You don't need to write code to reason about AI. You need to notice when a model is guessing."*
- *"Rung 2 — where the math stops hiding."*

**Examples of off-voice copy** *(do not write like this)*
- "Honestly, AI is simply the future!" (banned words, sycophantic)
- "Hey guys, let's dive in 🚀✨" (infantilizing, emoji slop)
- "AI — it's everywhere — and it's here to stay." (em-dashes as filler)

---

## Visual foundations

**Palette — strict.** Do not drift into pastels, neon, or stock-illustration cyan/teal.
- `#1b0f3d` deep indigo — primary background
- `#2a1a52` mid purple — gradient middle tone, card background
- `#332961` OG brand deep indigo — print, surfaces needing more depth
- `#86589d` lavender — mid-purple accent
- `#e93583` hot pink — primary accent, buttons, badges, gradient start
- `#ee8933` coral orange — secondary accent, tags, gradient end
- `#fbd03b` yellow — reserved for occasional celebratory / emphasis
- `#fff4e4` cream — skin tones in illustrations, highlight text on dark

**Secondary / warm palette** (tags, data viz, small surfaces only): gold `#ecc364`, coral `#e8754f`, raspberry `#b93d73`, dusty lavender `#a684b8`, mauve `#6e4a82`.

Most surfaces sit on the dark purple gradient base. Light or white backgrounds are rare and only for hubs or marketing contexts.

**Typography.**
- Display: **Instrument Serif** 400 (regular + italic), letter-spacing `-0.005em`. Italic reserved for emphasized words in headlines.
- Body: **Figtree** 400–700. Humanist sans that stays warm at small sizes.
- Accent / handwritten: **Homemade Apple**, used sparingly (1–5 words max). Real cursive, not a script-sans.
- Mono: **JetBrains Mono** for code, slide numbers, metadata.

All four fonts load from Google Fonts in `colors_and_type.css`.

**Signature visual moves.**
1. **WDAI hero gradient** — radial magenta glow (ellipse at 85% 50%, `hsl(295 75% 40% / 0.55)` → transparent at 55%) over a diagonal `#1b0f3d → #2a1a52` base. Use on most slides.
2. **Pink→orange text gradient** (`90deg #e93583 → #ee8933`) with `-webkit-background-clip: text` on highlight keywords.
3. **Subtle dot pattern** — white at 6% opacity, 28px grid — as texture on large empty areas.
4. **12px border radius** — canonical for cards, buttons, badges. 8px for small chips, 16–24px for hero panels.
5. **Soft drop shadows**, never harsh. Glow effects (`--glow-pink`, `--glow-coral`) for focal elements.

**Layout.** Slides are a fixed 1920×1080 canvas then scaled. Standard gutter: 96px (or 64px for tight layouts). Full-bleed backgrounds preferred over framed content. Use CSS grid; resist the urge to center everything.

**Backgrounds.** Dark gradient dominant. Occasionally full-bleed photography for team, student, and event moments. The chevron pattern marks territorial moments (covers, section dividers, closings) under strict rules — see below.

**Diagrams, not illustrations.** This system does not use branded illustration art. When a concept needs a visual, draw a **diagram** — thin line work, rounded caps, labels in JetBrains Mono, accent colors for flow. See `preview/diagrams.html` for house style.

**Borders.** Minimal. When used, `rgba(255,255,255,0.10)` for subtle structure on dark, or a 1px `--accent` hairline under focal text.

**Shadow system.**
- `--shadow-1` — subtle lift (1px, 2px blur)
- `--shadow-2` — cards (6px, 18px blur)
- `--shadow-3` — modals / hero panels (18px, 48px blur)
- `--glow-pink` / `--glow-coral` / `--glow-soft` — focal elements only

**Corner radii.** 12px canonical. 8px chips, 16px large cards, 24px hero panels, `999px` pills only for status badges.

**Cards.** Purple `#2a1a52` fill or `rgba(255,255,255,0.04)` surface, 12–16px radius, no border or a 1px `rgba(255,255,255,0.10)` border, `--shadow-2`. Never a colored left-border accent.

**Hover / press.**
- Hover: 1.02× scale OR brightness 1.10, transition `220ms var(--ease-out)`.
- Press: 0.98× scale, 140ms.
- Links: underline on hover, pink→orange gradient on active.

**Animation.** Fades and gentle rises dominate. Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out) for entrances, `cubic-bezier(0.65, 0, 0.35, 1)` (ease-in-out) for continuous motion. Durations: 140 / 220 / 420ms. No bounces. No parallax. No spinners that spin forever — use a pink→orange progress bar.

**Transparency & blur.** Backdrop-blur used sparingly on sticky nav only. Card surfaces prefer flat `--bg-elevated` over glassmorphism.

**Imagery vibe.** Warm. Photography over illustration. Diverse representation (age, ethnicity, body type, gender). No grain, no b&w unless editorial intent. No stock-illustration robots, brains, or abstract AI tropes.

---

## Iconography

**Default set: Lucide (CDN).** Stroke-based, 1.75px weight, rounded joins. Linked directly from CDN in `ui_kits/microsite/index.html`:

```html
<script src="https://unpkg.com/lucide@latest"></script>
```

Common uses: `arrow-right`, `sparkles`, `book-open`, `message-circle`, `chevron-right`, `play`, `pause`, `check`, `x`, `menu`.

**No icon font or SVG sprite was shipped with the brief** — Lucide was chosen as the closest match to the brand's clean, modern feel. **Flag to user:** if the microsite codebase ships a custom icon set, replace Lucide with it.

**Emoji.** Used sparingly, only as a full-bleed "emoji hero" slide focal point. Never as bullets or decoration.

**Unicode as icons.** Rarely — the numeral characters in JetBrains Mono (for slide numbers like `01 / 24`) and arrows like `→` in body copy are fine.

**Brand monogram.** The WDAI "AI" logo lives at `assets/wdai-logo.png`. Use at a minimum of 48px; pair with a "Women Defining AI" wordmark in Instrument Serif italic next to it on marketing surfaces.

---

## Chevron pattern — rules for use

The woven chevron is the brand's territorial marker. It carries symbolic weight ("women weaving the future of technology"). Treat it as a reserved asset, not a texture.

**Where it belongs**
- Cover slides (restrained — one edge, faded)
- Section dividers (rung breaks)
- Closing / thank-you slides
- Print headers + footers, certificates, email banners

**Where it does NOT belong**
- Content slides — dot texture is the workhorse there
- UI chrome, buttons, badges, cards
- Microsite lesson hub or any scannable grid
- Anywhere the user reads dense information

**Rules**
1. **One chevron per slide, one color.** Pick `chevron-pink.png`, `chevron-purple.png`, or `chevron-orange.png` — never mix on the same surface. Mixing reads as corporate-template pattern.
2. **Opacity 0.25–0.45.** Or mask with a gradient. It should read as *architectural* (wall texture), not *applied* (sticker).
3. **Bleed off an edge. Never center.** Right third, top band, bottom band. Centering makes the pattern the subject; bleeding makes it environment.
4. **Never stack with dot texture.** Chevron = section marker energy. Dots = content density energy. Pick one per slide.
5. **Never under type at high opacity.** If chevron and type overlap, fade the chevron further or add a gradient veil (`rgba(27,15,61,0.85)` works).

**Tonal choice by moment**
- **Purple** (`chevron-purple.png`) — default; calm, structural. Use on section dividers and covers.
- **Pink** (`chevron-pink.png`) — celebratory; closings, certificates, "you did it" moments.
- **Orange** (`chevron-orange.png`) — warmth accent; small surfaces only (print footer, email banner), not full slides.

---

## Index of files

- `README.md` — this file
- `SKILL.md` — Agent Skill frontmatter for use in Claude Code
- `colors_and_type.css` — design tokens (palette, type scale, spacing, radii, shadows, motion)
- `assets/` — brand assets
  - `wdai-logo.png` — AI monogram (4698×3312, transparent)
- `preview/` — Design System tab cards (color swatches, type specimens, components)
- `slides/` — slide archetypes rendered as 1920×1080 HTML
  - `index.html` — all archetypes on one canvas
  - individual `.html` files per archetype
- `ui_kits/microsite/` — curriculum microsite recreation
  - `index.html` — interactive click-thru
  - `README.md` — what's included
  - component JSX files

## Original brief

The WDAI brief provided: palette and typography (later refined to Instrument Serif / Figtree / Homemade Apple based on brand direction); 12 slide archetypes (cover, quote, section divider, definition, list, probability/data, photo-split, hero-focal alternatives, code/prompt, feedback, team grid, closing); signature visual moves; chevron pattern rules; voice and tone guardrails. All captured above.
