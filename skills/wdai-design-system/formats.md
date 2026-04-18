# WDAI Format-Specific Visual Guidelines

Supplement to `README.md`. Apply these rules when producing non-HTML output formats.

---

## PowerPoint Presentations (.pptx)

**Slide dimensions:** 16:9 widescreen (33.87 cm × 19.05 cm / 1920×1080 equivalent)

**Background:** Deep indigo `#1b0f3d` is default. Use `#332961` for surfaces needing more depth.

**Typography:**
- Headlines: Montserrat ExtraBold or Poppins Bold, ALL CAPS, white or pink on dark backgrounds
- Body: Montserrat or Poppins Regular (400–500 weight)
- If Google Fonts unavailable, substitute: Arial Bold for headlines, Arial for body

**Color application:**
- Primary accent: `#e93583` (pink) for headlines, CTAs, key data points
- Secondary accent: `#ee8933` (orange) for supporting emphasis, gradients
- Never use cyan, teal, or pastels — palette is strict

**Logo placement:** Top-left corner (standard), centered for title/cover slides. Maintain clear space equal to the height of the "i" dot around the logo.

**Slide density:** ~35 words maximum per slide. Claim-first structure. No bullet-point walls.

**Chevron pattern:** Use `assets/chevron-purple.png` on cover and section divider slides only. Bleed off one edge, opacity 0.25–0.45. Never on content slides.

---

## Word Documents (.docx)

**Page setup:** White background (`#ffffff`). Navy (`#332961`) for body text.

**Header treatment:** Deep navy or pink banner with white text. Logo top-left.

**Typography:**
- Headings: Montserrat Bold or Poppins Bold, Title Case
- Body: Montserrat Regular or Poppins Regular, 11–12pt, navy on white
- Accent callouts: pink `#e93583` left-border boxes or highlighted text

**Color use:** Restrained compared to slides. Pink and orange for accents/callouts only. Avoid dark backgrounds in print documents unless explicitly decorative (e.g., cover page).

**Footer:** `womendefiningai.org` in small Montserrat, navy or lavender.

---

## Social Media Graphics

**Standard dimensions:**
- Instagram post: 1080×1080px (square)
- Instagram story / LinkedIn story: 1080×1920px
- LinkedIn banner: 1584×396px
- LinkedIn post graphic: 1200×627px
- Twitter/X header: 1500×500px

**Visual treatment:**
- Dark backgrounds (`#1b0f3d` or `#332961`) preferred for impact
- Pink→orange gradient text (`90deg #e93583 → #ee8933`) for headline keywords
- Dot texture overlay (white at 6% opacity) for depth on empty areas
- Chevron pattern only on announcement/launch graphics — bleed off edge, never centered

**Typography:**
- Headline: ALL CAPS, bold (700–900 weight), 1–2 lines max
- Supporting text: sentence case, 400 weight, minimal
- "WOMEN" in pink `#e93583` / "DEFINING AI" in white — maintain wordmark split

**Logo:** Always present. Top-left or centered depending on composition. Never scale below 48px.

**Imagery:** Diverse, warm photography over illustration. No stock AI tropes (robots, glowing brains).

---

## Automated Image Generation (Chrome MCP)

When Claude has Chrome MCP enabled, WDAI-branded images can be generated automatically via Google AI Studio.

**When to use:**
- Presentations, websites, or documents needing custom WDAI hero visuals
- Social media graphics requiring on-brand imagery
- Any deliverable where custom WDAI imagery would enhance the output

**Quick workflow:**
1. Navigate to aistudio.google.com via Chrome MCP
2. Select Images tab → Nano Banana model (free tier)
3. Craft a prompt using WDAI brand language: deep indigo/purple backgrounds, pink→orange gradients, geometric chevron patterns, diverse women in tech contexts, no cyan/teal
4. Click Run, wait ~7 seconds
5. Download and integrate into the deliverable

**Prompt formula:**
```
WDAI-branded [image type]: [description]. Style: deep navy/indigo background (#1b0f3d), 
vibrant pink (#e93583) and orange (#ee8933) accents, geometric chevron/diamond patterns, 
bold modern aesthetic, diverse women, tech-forward. No cyan, no pastels, no teal.
```

---

## Logo File Reference

- Icon + wordmark: `assets/wdai-logo.png`
- Icon mark only: use the "AI" monogram from `assets/wdai-logo.png` (crop as needed)
- Minimum size: 48px height
- Clear space: padding equal to the height of the "i" dot on all sides
- On dark backgrounds: full color logo. On light backgrounds: use navy or pink version if available.
