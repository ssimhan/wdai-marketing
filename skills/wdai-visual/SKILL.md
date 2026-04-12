---
name: wdai-visual
description: "Women Defining AI visual identity for all designed content formats — colors, typography, patterns, logo usage, and image generation. Apply when creating: (1) HTML/React web pages, presentations, or artifacts, (2) PowerPoint presentations, (3) Word documents, (4) Social media graphics, (5) Any content requiring WDAI visual branding. NOT for writing voice — use wdai-brand for that. MANDATORY TRIGGERS: WDAI design, WDAI brand colors, WDAI visual, WDAI style, create a WDAI-branded [artifact]"
---

# Women Defining AI Brand Skill

Apply consistent Women Defining AI branding across all content formats.

## Brand Identity Summary

**Organization:** Women Defining AI (WDAI) - empowering women in artificial intelligence

**Visual Personality:** Bold, vibrant, tech-forward, empowering, innovative, professional

**Core Elements:**
- Geometric parallelogram/chevron patterns
- Vibrant multi-color gradients
- Stylized female figures with flowing colorful hair (for illustrations)
- Circuit/tech integration motifs
- High contrast, modern aesthetic

## Color Palette

### Primary Colors (Use Exact Hex Codes)

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Vibrant Pink** | `#e93583` | 233, 53, 131 | Primary brand, logos, headlines, CTAs, "WOMEN" in wordmark |
| **Warm Orange** | `#ee8933` | 238, 137, 51 | Secondary accent, gradients, energy/creativity elements |
| **Deep Navy** | `#332961` | 51, 41, 97 | Primary dark backgrounds, text, professional anchoring |
| **Soft Lavender** | `#86589d` | 134, 88, 157 | Accent color, gradients, softer elements, logo "i" stroke |
| **Pure White** | `#ffffff` | 255, 255, 255 | Backgrounds, text on dark, negative space |
| **Pure Black** | `#000000` | 0, 0, 0 | Text, contrast, illustration backgrounds |

### Secondary/Gradient Colors

- **Golden Yellow** `#f5b041` - Warm, optimistic accents
- **Coral/Salmon** `#f28b82` - Bridge between pink and orange
- **Hot Pink/Magenta** `#d63384` - Intensified pink tones
- **Cyan/Turquoise** `#00bcd4` - Tech/futuristic illustrations, skin tones in art

### CSS Variables Template

```css
:root {
  /* Primary */
  --wdai-pink: #e93583;
  --wdai-orange: #ee8933;
  --wdai-navy: #332961;
  --wdai-lavender: #86589d;

  /* Neutrals */
  --wdai-white: #ffffff;
  --wdai-black: #000000;

  /* Secondary */
  --wdai-yellow: #f5b041;
  --wdai-coral: #f28b82;
  --wdai-cyan: #00bcd4;

  /* Semantic */
  --wdai-bg-dark: #332961;
  --wdai-bg-light: #ffffff;
  --wdai-text-dark: #332961;
  --wdai-text-light: #ffffff;
  --wdai-accent-primary: #e93583;
  --wdai-accent-secondary: #ee8933;
}
```

## Typography

### Font Choices

**Primary Display Font:** Wide, bold sans-serif (Montserrat ExtraBold, Poppins Bold, or similar geometric sans)
- Use for headlines, titles, "WOMEN DEFINING AI" wordmark
- ALL CAPS for primary headlines
- Weight: 700-900

**Body Font:** Clean sans-serif (Montserrat, Poppins, Open Sans)
- Use for body text, descriptions
- Weight: 400-500

**Accent/Tech Font:** Monospace (JetBrains Mono, Fira Code) for tech-themed elements

### Text Hierarchy

| Level | Style | Color Options |
|-------|-------|---------------|
| H1/Title | ALL CAPS, Bold (700-900), 2.5-4rem | White on dark, Pink on light |
| H2 | ALL CAPS or Title Case, Bold, 1.5-2rem | Navy, White, or Pink |
| H3 | Title Case, SemiBold, 1.2-1.5rem | Navy or Lavender |
| Body | Regular (400), 1rem | Navy on light, White on dark |
| Accent | Bold, any size | Pink or Orange |

### Wordmark Treatment

"WOMEN DEFINING AI" uses two-color split:
- "WOMEN" = Vibrant Pink (#e93583)
- "DEFINING AI" = White (#ffffff) on dark backgrounds

## Format-Specific Guidelines

Select the appropriate reference file based on output format:

| Format | Reference File | When to Use |
|--------|---------------|-------------|
| HTML/React/Web | [references/web-html.md](references/web-html.md) | Websites, landing pages, HTML artifacts, React components |
| PowerPoint | [references/powerpoint.md](references/powerpoint.md) | .pptx presentations, slide decks |
| Word Documents | [references/word-docs.md](references/word-docs.md) | .docx reports, letters, formal documents |
| Social Media | [references/social-media.md](references/social-media.md) | Social graphics, banners, posts |
| AI Image Generation (Manual) | [references/ai-image-generation.md](references/ai-image-generation.md) | Prompts for Imagen, DALL-E, Midjourney, Stable Diffusion |
| **AI Image Generation (Automated)** | [references/chrome-mcp-image-generation.md](references/chrome-mcp-image-generation.md) | **Hands-free image generation via Chrome MCP + Google AI Studio** |

**Always read the relevant reference file before creating content in that format.**

## Automated Image Generation (Chrome MCP)

When Claude has Chrome MCP enabled, it can automatically generate WDAI-branded images using Google AI Studio's free Nano Banana model.

### When to Use Automated Generation

- Creating presentations, websites, or documents that need custom WDAI visuals
- User requests on-brand images without providing existing assets
- Need for hero illustrations, icons, backgrounds, or patterns
- Any time custom WDAI imagery would enhance the deliverable

### Quick Workflow

1. **Navigate:** Go to aistudio.google.com via Chrome MCP
2. **Select:** Choose Images tab → Nano Banana model (free)
3. **Prompt:** Use prompts from `references/chrome-mcp-image-generation.md`
4. **Generate:** Click Run, wait ~7 seconds
5. **Download:** Save to workspace folder
6. **Integrate:** Add to presentation/document/website

### Example Automation Trigger

When building WDAI content, include this in requests:
```
Generate WDAI hero image using Chrome MCP before creating the presentation
```

See [references/chrome-mcp-image-generation.md](references/chrome-mcp-image-generation.md) for full prompt library and workflow details.

## Logo Usage

### Logo Mark ("Wi" Icon)

The WDAI icon features stylized "Wi" letterforms with parallelograms:
- Left stroke: White parallelogram
- Middle: Pink (#e93583) parallelogram with orange gradient
- Right: Lavender (#86589d) parallelogram
- Dot: Two small pink parallelograms

**Placement:** Top-left corner (primary), bottom-left (alternate), or centered for title slides

**Clear space:** Maintain padding equal to the height of the "i" dot around the logo

### Logo Files

- Icon only: `assets/wdai-mark.png`
- Full logo (icon + wordmark): `assets/wdai-logo.png`
- Text only: `assets/wdai-text-logo.png`

## Background Treatments

### Pattern: Navy Chevron (Primary)

Deep navy (#332961) with subtle tonal chevron/diamond pattern
- Use for: Professional slides, headers, formal documents
- Creates depth without distraction

### Pattern: Orange Chevron

Warm orange (#ee8933) with diagonal chevron pattern
- Use for: Energy, creativity, highlights, section dividers

### Pattern: Pink Diamond

Vibrant pink (#e93583) with diamond geometric pattern
- Use for: CTAs, accent sections, social media

### Gradient: Radial Burst

Soft radial gradient from white/cream center to pink/orange edges
- Use for: Quotes, testimonials, inspirational content, warm approachable sections

### Gradient: Cool Depth

Navy to purple/pink gradient (top-left to bottom-right)
- Use for: Modern, tech-forward sections, dramatic headers

### Solid Dark

Pure black (#000000) background
- Use for: Hero sections with illustrations, maximum contrast

## Brand Voice in Visuals

Every WDAI asset should convey:

- **Empowerment:** Strong, confident compositions
- **Innovation:** Modern, tech-forward design elements
- **Diversity:** Varied representations, vibrant colors
- **Professionalism:** Clean layouts, readable typography
- **Energy:** Dynamic shapes, bold colors, sense of movement
- **Community:** Inclusive imagery, approachable aesthetics

## Design Rules

### DO:
- Use exact hex color codes provided
- Incorporate geometric patterns (diamonds, chevrons, parallelograms)
- Use bold, sans-serif typography in ALL CAPS for headlines
- Create high contrast between text and backgrounds
- Include tech/AI symbolic elements where appropriate
- Maintain clean, modern aesthetic
- Use gradients for depth and dimension

### DON'T:
- Use pastel or muted versions of brand colors
- Add rounded, soft shapes (keep geometric and angular)
- Use script or serif fonts for primary headings
- Overcrowd designs - maintain breathing room
- Use low-contrast color combinations
- Mix too many patterns in one design
- Stray from the established color palette

## Quick Reference: Color Combos

| Background | Text | Accent |
|------------|------|--------|
| Navy (#332961) | White | Pink (#e93583) |
| Black (#000000) | White | Pink + Orange gradient |
| White (#ffffff) | Navy (#332961) | Pink (#e93583) |
| Pink (#e93583) | White | Navy (#332961) |
| Lavender (#86589d) | White | Pink (#e93583) |

## Contact Information (for footers/headers)

- **Website:** www.womendefiningai.org
- **Email:** info@womendefiningai.org

---

## LinkedIn Post Writing (WDAI Company Page)

When writing LinkedIn posts for the WDAI company page, apply these principles to ensure posts feel celebratory, authentic, and mission-driven — not corporate or stale.

### Voice & Tone

- **Lead with energy**: Open with a bold, declarative statement that celebrates what women can do or what WDAI stands for. Avoid soft, neutral openers.
  - Strong: "Women don't just deserve a seat at the table. They build the table."
  - Weak: "We're excited to share that member X built something amazing..."
- **Celebratory, not promotional**: Posts should feel like a genuine celebration, not a press release.
- **Conversational and human**: Write like a person, not a brand.
- **Mission-first**: Every post should connect back to what WDAI champions — women building with AI, learning by doing, and enabling each other.

### Structure for Member Spotlight Posts

1. **Bold opening** — A mission-driven statement about women, AI, or WDAI's purpose
2. **What the member built/did** — Concrete and specific, with their name tagged (@Name)
3. **The "give back" moment** — If the member contributed back to the community, let them say it in their own words (direct quote)
4. **What WDAI makes possible** — One or two sentences connecting the moment to the broader mission
5. **Member quote as CTA** — Use their own words to invite others in (e.g., "come join us")
6. **Content CTA** — Direct viewers to the attached video/demo/content
7. **Website link** — www.womendefiningai.org for the external audience
8. **Hashtags** — #WomenDefiningAI + relevant event/topic hashtags

### Using Direct Quotes

Always prefer direct quotes from the member over paraphrasing. Quotes feel authentic, carry more emotional weight, and let the member's voice come through. They are especially powerful for:
- The "why I gave back" moment
- The "what would you say to other women" closing invitation

When introducing a quote as a response to a question, frame it naturally:
- "When we asked [Name] what she would say to other women who haven't gotten started yet:"
- Not: "In [Name]'s words:" (too generic)

### Internal vs. External Audiences

WDAI posts are public. When a project or resource is **internal-only** (e.g., a member showcase, Slack channel, internal tool):
- Do NOT link to the internal resource
- Direct external viewers to join WDAI at www.womendefiningai.org
- Frame the internal resource as a benefit of membership: something they'll get access to when they join

### Framing Attached Content Accurately

Be precise about what is attached — accuracy builds trust:
- A **demo video** → "Watch the demo below" (not "Watch her story")
- A **personal story video** → "Watch her story below"
- A **presentation** → "See the slides below"

### Example Post Structure

```
[Bold mission-driven opening statement] 🛠️

[Event context], member @[Name] [built/created/launched] [what they made] — [brief description of what it does and why it matters].

[Transition sentence revealing what this moment says about the community.]

"[Direct quote from member: why they gave back / what motivated them]"

[1–2 sentences on what WDAI makes possible — connect to mission.]

When we asked [Name] what she would say to [relevant audience]:

"[Direct quote inviting others in — ideally ending with encouragement to begin]"

Watch the [demo/video] below. 👇

🔗 www.womendefiningai.org

#WomenDefiningAI #[EventHashtag] #WomenInAI #LearningByDoing
```

### Hashtag Guidelines

Always include:
- `#WomenDefiningAI` (every post)
- `#WomenInAI` (member content)
- Event-specific tags (e.g., `#SheBuilds`, `#InternationalWomensDay`)
- Topic tags (e.g., `#LearningByDoing`, `#AI`)

Limit to 4–5 hashtags total.
