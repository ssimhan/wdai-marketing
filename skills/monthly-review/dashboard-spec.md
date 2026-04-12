# Dashboard Specification

Visual reference: dark-themed, ranked/filtered layout with pink-to-orange gradient headline, monospace stat labels, numbered ranking cards with tag pills, and tab-based channel navigation.

---

## Color Palette

```css
:root {
  /* Backgrounds */
  --bg-page:        #0f0a1e;   /* very dark purple-navy */
  --bg-card:        #1a1030;   /* slightly lighter for cards */
  --bg-card-hover:  #211540;   /* hover state */
  --bg-tag:         rgba(233, 53, 131, 0.12);   /* translucent pink for tags */

  /* Brand */
  --wdai-pink:      #e93583;
  --wdai-orange:    #ee8933;
  --wdai-lavender:  #86589d;
  --wdai-navy:      #332961;

  /* Text */
  --text-primary:   #ffffff;
  --text-secondary: #b8a8d8;   /* muted lavender-white */
  --text-muted:     #7a6fa8;   /* for labels and metadata */

  /* Accents */
  --rank-badge-bg:  #ee8933;   /* orange for #1, #2, #3 etc. */
  --positive:       #e93583;   /* pink for good numbers */
  --neutral:        #7a6fa8;   /* muted for flat */
  --border:         rgba(134, 88, 157, 0.25);  /* subtle lavender border */

  /* Gradients */
  --gradient-headline: linear-gradient(90deg, #e93583 0%, #ee8933 100%);
  --gradient-card-top: linear-gradient(135deg, #1a1030 0%, #211540 100%);
}
```

---

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

- **Headline**: Poppins 800, gradient text (pink → orange)
- **Section titles / card titles**: Poppins 600–700, white
- **Stat numbers (KPI)**: Poppins 700–800, pink (#e93583)
- **Stat labels**: JetBrains Mono 400–500, uppercase, letter-spacing 0.1em, muted color
- **Body / descriptions**: Poppins 400, --text-secondary
- **Tag pills**: Poppins 500, small, uppercase

---

## External Dependencies

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## Page Layout

```
┌────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
│  [WDAI wordmark]                                            │
│  "WDAI Marketing Report" ← pink-to-orange gradient         │
│  "Highest-impact moments from [channels] · [period]"       │
│  "Ranked by engagement, reach, and resonance"              │
└────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────┐
│  CHANNEL TABS (filter)                                      │
│  [ALL] [LINKEDIN] [SLACK] [NEWSLETTER] [PROGRAMS] [PIPELINE]│
│                                              [BY RANK] [BY DATE]│
└────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────┐
│  KPI STATS ROW (5 dark cards)                              │
│  [Impressions] [Engagement Rate] [Followers] [Opens] [Reactions]│
└────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────┐
│  SECTION HEADER: "LINKEDIN"  •  [N] posts                  │
│  ─────────────────────────────────────────────────────     │
│  #1  [Post title]                          ★★★★★ ENGAGEMENT│
│      [Description]                             👍 N        │
│      [tag] [tag] [tag]          [details ▼]               │
│  ─────────────────────────────────────────────────────     │
│  #2  ...                                                   │
└────────────────────────────────────────────────────────────┘
[ repeat sections for SLACK, NEWSLETTER, PROGRAMS, PIPELINE  ]
┌────────────────────────────────────────────────────────────┐
│  CLAUDE'S ANALYSIS  (always visible)                       │
│  ─────────────────────────────────────────────────────     │
│  💡 What worked / ⚠️ Watch / → Recommendations             │
└────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────┐
│  FOOTER  |  period  |  generated  |  Powered by Claude     │
└────────────────────────────────────────────────────────────┘
```

---

## Header

```html
<header>
  <div class="wordmark">
    <span class="wordmark-women">WOMEN</span>
    <span class="wordmark-rest"> DEFINING AI</span>
  </div>
  <h1 class="headline gradient-text">WDAI Marketing Report</h1>
  <p class="subheader mono">
    Performance data from LinkedIn, Slack, and Newsletter &nbsp;·&nbsp; [Month Year]
  </p>
  <p class="sub-subheader">Ranked by engagement, reach, and resonance</p>
</header>
```

```css
header {
  background: var(--bg-page);
  text-align: center;
  padding: 56px 48px 40px;
  border-bottom: 1px solid var(--border);
}
.headline {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  background: var(--gradient-headline);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 8px 0;
}
.subheader.mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-secondary);
  letter-spacing: 0.03em;
}
.wordmark-women { color: var(--wdai-pink); font-weight: 700; font-size: 0.9rem; letter-spacing: 0.15em; }
.wordmark-rest  { color: var(--text-secondary); font-weight: 500; font-size: 0.9rem; letter-spacing: 0.1em; }
```

---

## Channel Tabs + Sort Controls

```html
<nav class="filter-bar">
  <div class="tab-group">
    <button class="tab active" data-filter="all">ALL</button>
    <button class="tab" data-filter="linkedin">LINKEDIN</button>
    <button class="tab" data-filter="slack">SLACK</button>
    <button class="tab" data-filter="newsletter">NEWSLETTER</button>
    <button class="tab" data-filter="programs">PROGRAMS</button>
    <button class="tab" data-filter="pipeline">PIPELINE</button>
  </div>
  <div class="sort-group">
    <button class="sort active" data-sort="rank">BY RANK</button>
    <button class="sort" data-sort="date">BY DATE</button>
  </div>
</nav>
```

Active tab: pink (#e93583) background, white text, border-radius: 999px (pill shape).
Inactive tabs: transparent background, border 1px solid var(--border), muted text.

JavaScript: clicking a tab filters the cards below to show only that channel's section. ALL shows everything.

---

## KPI Stats Row

5 cards in a flex row (wraps on mobile).

```html
<div class="stats-row">
  <div class="stat-card">
    <div class="stat-number">7,001</div>
    <div class="stat-label">IMPRESSIONS</div>
    <div class="stat-trend positive">▲ 2,339%</div>
    <div class="stat-vs">vs prior period</div>
  </div>
  <!-- repeat for: Engagement Rate, Followers (+N), Newsletter Open %, Slack Reactions -->
</div>
```

```css
.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px 20px;
  flex: 1;
  min-width: 160px;
  text-align: center;
}
.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: var(--wdai-pink);
}
.stat-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 4px 0;
}
.stat-trend.positive { color: var(--wdai-pink); font-size: 0.85rem; font-weight: 600; }
.stat-trend.neutral  { color: var(--neutral); }
.stat-vs { font-size: 0.7rem; color: var(--text-muted); }
```

**KPI values to populate:**
1. Total LinkedIn Impressions (+ % change)
2. Engagement Rate = (reactions + comments + reposts) / impressions × 100 → displayed as "X.XX%"
3. Follower Growth → "11,360 total · +N this month"
4. Newsletter Open Rate → "XX% avg"
5. Total Slack Reactions on promo posts

---

## Section Structure

Each content section (LinkedIn, Slack, Newsletter, etc.) follows this pattern:

```html
<section class="channel-section" data-channel="linkedin">
  <div class="section-header">
    <span class="section-dot"></span>
    <span class="section-title">LINKEDIN</span>
    <span class="section-count">N posts</span>
  </div>

  <!-- Ranked cards -->
  <div class="card-list" id="linkedin-cards">
    <!-- insert ranked cards here -->
  </div>
</section>
```

```css
.section-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--wdai-pink); display: inline-block; }
.section-title { font-family: 'JetBrains Mono', monospace; font-weight: 500; letter-spacing: 0.12em; color: var(--text-primary); font-size: 0.85rem; }
.section-count { margin-left: auto; font-size: 0.8rem; color: var(--text-muted); }
```

---

## Ranked Cards

Each post/campaign/event is a ranked card:

```html
<div class="ranked-card" data-channel="linkedin">
  <div class="rank-badge">#1</div>
  <div class="card-content">
    <div class="card-title">Post title or preview (truncated ~60 chars)</div>
    <div class="card-desc">Date · Channel · Author</div>

    <div class="tag-row">
      <span class="tag">event promo</span>
      <span class="tag">member spotlight</span>
    </div>

    <details class="card-details">
      <summary>details & data</summary>
      <div class="detail-body">
        <!-- full post text, all engagement numbers, impressions if available -->
        <!-- Chart.js mini bar chart for LinkedIn posts only -->
      </div>
    </details>
  </div>
  <div class="card-meta">
    <div class="engagement-stars">★★★★☆</div>
    <div class="engagement-label mono">ENGAGEMENT</div>
    <div class="reaction-count">👍 45</div>
  </div>
</div>
```

```css
.ranked-card {
  display: flex;
  gap: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 12px;
  align-items: flex-start;
}
.rank-badge {
  background: var(--wdai-orange);
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 8px;
  padding: 4px 10px;
  white-space: nowrap;
  align-self: flex-start;
  margin-top: 2px;
}
.tag {
  display: inline-block;
  background: var(--bg-tag);
  border: 1px solid rgba(233, 53, 131, 0.3);
  color: var(--wdai-pink);
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 10px;
  border-radius: 999px;
  margin-right: 6px;
  margin-top: 8px;
}
.card-meta {
  margin-left: auto;
  text-align: right;
  min-width: 90px;
}
.engagement-stars { color: var(--wdai-pink); font-size: 0.85rem; }
.engagement-label { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--text-muted); letter-spacing: 0.1em; }
.reaction-count { font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px; }
```

**Engagement star rating (LinkedIn posts):**
- 5 stars: >50 engagement actions
- 4 stars: 20–50
- 3 stars: 10–20
- 2 stars: 5–10
- 1 star: <5

**Tags to auto-assign:**
LinkedIn post tags: `event promo` / `member spotlight` / `program launch` / `thought leadership` (infer from post content)
Slack post tags: `cohort promo` / `event reminder` / `day-before` / `registration nudge`
Newsletter tags: `cohort campaign` / `member story` / `announcement`

---

## LinkedIn Drill-down: Mini Chart

Inside the LinkedIn section's `<details>` (expanded), include a Chart.js horizontal bar chart showing all posts ranked by engagement side by side. This is the only chart in the whole dashboard — keep it focused.

```javascript
{
  type: 'bar',
  data: {
    labels: ['Post 1 (Mar 5)', 'Post 2 (Mar 1)', ...],
    datasets: [{
      label: 'Engagement',
      data: [45, 32, 18, ...],
      backgroundColor: [
        'rgba(233, 53, 131, 0.85)',  // top post: solid pink
        'rgba(238, 137, 51, 0.75)',  // 2nd: orange
        'rgba(134, 88, 157, 0.65)',  // 3rd+: lavender
        ...
      ],
      borderRadius: 6,
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ` ${ctx.raw} engagement actions` } }
    },
    scales: {
      x: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#b8a8d8' } },
      y: { grid: { display: false }, ticks: { color: '#b8a8d8', font: { size: 11 } } }
    }
  }
}
```

Wrap the chart canvas in a dark card: `background: #0f0a1e; border-radius: 8px; padding: 16px;`

---

## Programs Section

Cards show each event that ran. Tags: `cohort-session` (lavender) / `show-dont-tell` (pink) / `guest-event` (orange) / `build-together` (muted).

If Luma data was provided, show registration count in the card-meta area instead of engagement stars.

---

## Content Pipeline Section

Instead of ranked cards, show two mini-stat blocks + a donut chart:

```
[ N scout flags ]  [ N activated ]  [ N% activation rate ]
```

Donut chart: [Internal] navy / [External] pink / [Both] orange

Keep it simple — this section is informational, not ranked.

---

## Claude's Analysis

Visually distinct from all other sections. No dark card — uses a lighter treatment to stand out:

```css
.analysis-section {
  background: linear-gradient(135deg, rgba(134, 88, 157, 0.15) 0%, rgba(233, 53, 131, 0.08) 100%);
  border: 1px solid rgba(134, 88, 157, 0.4);
  border-radius: 16px;
  padding: 32px;
  margin: 32px 0;
}
```

Header: `🤖 CLAUDE'S ANALYSIS` in monospace, lavender color.
Subheader (italic): *"Pattern observations from this period's data. Bring these as hypotheses — not conclusions."*

Three sub-blocks inside:
1. **💡 What Worked** — 2–3 sentences on top-performing content
2. **⚠️ What to Watch** — 1–2 sentences on anything flat, declining, or missing
3. **→ Recommendations** — 3 numbered action items, each referencing a specific data point

This section is always visible (not inside a filter, always shown regardless of channel tab selected).

---

## Tab Filter JavaScript

```javascript
// Filter sections by channel
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const filter = tab.dataset.filter;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.channel-section').forEach(section => {
      section.style.display = (filter === 'all' || section.dataset.channel === filter) ? 'block' : 'none';
    });
  });
});

// Sort cards within visible sections
document.querySelectorAll('.sort').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sort').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Re-sort card lists — by rank (original order) or by date (data-date attribute)
  });
});
```

---

## Footer

```css
footer {
  background: var(--bg-card);
  border-top: 1px solid var(--border);
  padding: 24px 48px;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}
```

Content: `[Period] · Generated [date] · Powered by Claude · womendefiningai.org`

---

## File Output

Filename: `wdai-marketing-report-YYYY-MM.html`

Fully standalone — all CSS and JS inline or from CDN. No server needed to view. Background color of `<html>` and `<body>` must be set to `#0f0a1e` so there's no white flash on load.
