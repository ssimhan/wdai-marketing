import type { CalendarEntry, PromoMoment, EventType, ApprovalStatus, CopyDraft, CopyDraftStatus } from './types.js'
import { CHANNEL_LABELS } from './types.js'

// ── Date helpers ──

/** "Apr 14, 2026" — for header and table dates */
function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
}

/** "Mon Apr 20" — for moment rows (no comma, two separate calls) */
function fmtDow(iso: string): string {
  const d = new Date(iso)
  const dow  = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
  return `${dow} ${date}`
}

/** "Apr 20" — for event date range and week labels */
function fmtShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', timeZone: 'UTC',
  })
}

// ── Channel + type metadata ──
// Add new channels/types here only — CSS classes and HTML rendering all derive from these.
// Labels are sourced from CHANNEL_LABELS in types.ts.
const CHANNEL_META: Record<string, { label: string; css: string }> = {
  'linkedin-wdai':     { label: CHANNEL_LABELS['linkedin-wdai'],     css: 'ch-linkedin-wdai'     },
  'linkedin-personal': { label: CHANNEL_LABELS['linkedin-personal'], css: 'ch-linkedin-personal' },
  'email':             { label: CHANNEL_LABELS.email,                css: 'ch-email'             },
  'slack':             { label: CHANNEL_LABELS.slack,                css: 'ch-slack'             },
}
const TYPE_META: Record<EventType, { dot: string; pill: string }> = {
  'ai-basics':       { dot: 'dot-ai-basics',       pill: 'pill-ai-basics'       },
  'ai-intermediate': { dot: 'dot-ai-intermediate', pill: 'pill-ai-intermediate' },
  'ai-advanced':     { dot: 'dot-ai-advanced',     pill: 'pill-ai-advanced'     },
  'show-dont-tell':  { dot: 'dot-show-dont-tell',  pill: 'pill-show-dont-tell'  },
  'she-builds':      { dot: 'dot-she-builds',      pill: 'pill-she-builds'      },
  'speaker-event':   { dot: 'dot-speaker-event',   pill: 'pill-speaker-event'   },
  'other':           { dot: 'dot-other',           pill: 'pill-other'           },
}

// ── Flat moment type (internal rendering only) ──
interface FlatMoment extends PromoMoment {
  event_luma_id: string
  event_name: string
  event_type: EventType
  copy_draft?: CopyDraft
}

function flattenMoments(entries: CalendarEntry[]): FlatMoment[] {
  return entries
    .flatMap(e => e.channel_plan.map(m => ({
      ...m,
      event_luma_id: e.luma_id,
      event_name: e.name,
      event_type: e.event_type,
      copy_draft: e.copy_drafts?.find(d => d.channel === m.channel),
    })))
    .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at))
}

function getISOWeekLabel(iso: string): string {
  const d = new Date(iso)
  const day = d.getUTCDay() // 0=Sun
  const diff = day === 0 ? -6 : 1 - day  // adjust to Monday
  d.setUTCDate(d.getUTCDate() + diff)
  return `Week of ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}`
}

function channelBadge(channel: string): string {
  const meta  = CHANNEL_META[channel]
  const label = meta?.label ?? channel
  const css   = meta?.css ?? ''
  return `<span class="channel-badge ${css}">${label}</span>`
}

function driChip(dri: string): string {
  return dri
    ? `<span class="dri-chip">${dri}</span>`
    : `<span class="dri-empty">—</span>`
}

function approvalBadge(status: ApprovalStatus): string {
  const badges: Record<ApprovalStatus, { emoji: string; label: string; css: string }> = {
    pending: { emoji: '⏳', label: 'Pending', css: 'badge-pending' },
    approved: { emoji: '✅', label: 'Approved', css: 'badge-approved' },
    changes_requested: { emoji: '✏️', label: 'Changes Requested', css: 'badge-changes-requested' },
  }
  const badge = badges[status]
  return `<span class="approval-badge ${badge.css}">${badge.emoji} ${badge.label}</span>`
}

function copyStatusBadge(status: CopyDraftStatus): string {
  const badges: Record<CopyDraftStatus, { label: string; css: string }> = {
    draft:          { label: 'Draft',          css: 'copy-badge-draft'          },
    pending_review: { label: 'Pending Review', css: 'copy-badge-pending-review' },
    approved:       { label: 'Approved',       css: 'copy-badge-approved'       },
    published:      { label: 'Published',      css: 'copy-badge-published'      },
  }
  const badge = badges[status]
  return `<span class="copy-status-badge ${badge.css}">${badge.label}</span>`
}

function copyPanelContent(draft: CopyDraft | undefined): string {
  if (!draft) {
    return `<p class="copy-empty"><em>No copy yet — run <code>npm run calendar:generate</code> to draft copy.</em></p>`
  }
  return `${copyStatusBadge(draft.status)}<p>${draft.content}</p>`
}

// ── ID counter for expand/collapse pairs ──
let _uid = 0
function uid(): string {
  return `m${++_uid}`
}
function resetUid(): void {
  _uid = 0
}

function groupMomentsByWeek(moments: FlatMoment[]): Map<string, FlatMoment[]> {
  const groups = new Map<string, FlatMoment[]>()
  for (const m of moments) {
    const label = getISOWeekLabel(m.scheduled_at)
    if (!groups.has(label)) groups.set(label, [])
    groups.get(label)!.push(m)
  }
  return groups
}

function eventDateRange(e: CalendarEntry): string {
  return e.start_at === e.end_at
    ? fmtShort(e.start_at)
    : `${fmtShort(e.start_at)} – ${fmtShort(e.end_at)}, ${new Date(e.end_at).getUTCFullYear()}`
}

// ── By Date view ──
function renderDateView(entries: CalendarEntry[]): string {
  const moments = flattenMoments(entries)
  if (moments.length === 0) {
    return `<p style="color:var(--muted);padding:24px 0;font-style:italic">No channel plan moments yet — fill in <code>tools/calendar/promo-rules.yaml</code> to populate this view.</p>`
  }

  const groups = groupMomentsByWeek(moments)

  const groupHtml = [...groups.entries()].map(([weekLabel, wMoments]) => {
    const rows = wMoments.map(m => {
      const id = uid()
      return `
      <div class="moment-row" data-channel="${m.channel}" onclick="toggleRow('${id}')">
        <div class="col-date"><span class="dow">${fmtDow(m.scheduled_at)}</span></div>
        <div class="col-channel">${channelBadge(m.channel)}</div>
        <div class="col-event"><span class="event-chip"><span class="event-dot ${TYPE_META[m.event_type].dot}"></span><span><span class="event-name-text">${m.event_name}</span><span class="event-label"> · ${m.label}</span></span></span></div>
        <div class="col-dri">${driChip(m.dri)}</div>
      </div>
      <div class="copy-panel" id="${id}"><div class="copy-label">Copy</div>${copyPanelContent(m.copy_draft)}</div>`
    }).join('\n')
    return `
    <div class="week-group">
      <div class="week-label">${weekLabel}</div>
      ${rows}
    </div>`
  }).join('\n')

  return `
  <div class="filter-bar">
    <span>Filter:</span>
    <button class="filter-chip active" data-filter="all">All</button>
    <button class="filter-chip" data-filter="linkedin-wdai">LinkedIn (WDAI)</button>
    <button class="filter-chip" data-filter="linkedin-personal">LinkedIn (Personal)</button>
    <button class="filter-chip" data-filter="email">Email</button>
    <button class="filter-chip" data-filter="slack">Slack</button>
  </div>
  ${groupHtml}`
}

// ── By Event view ──
function renderEventView(entries: CalendarEntry[]): string {
  if (entries.length === 0) {
    return `<p style="color:var(--muted);padding:24px 0;font-style:italic">No events found.</p>`
  }

  return entries.map(e => {
    const dotCss  = TYPE_META[e.event_type].dot
    const pillCss = TYPE_META[e.event_type].pill
    const cardId  = e.luma_id

    const planRows = e.channel_plan.length === 0
      ? `<tr><td colspan="4" style="color:var(--muted);font-style:italic;padding:14px 16px">No channel plan — fill in promo-rules.yaml</td></tr>`
      : e.channel_plan.map(m => {
          const rowId = uid()
          const draft = e.copy_drafts?.find(d => d.channel === m.channel)
          return `
            <tr onclick="togglePlanRow('${rowId}')">
              <td>${channelBadge(m.channel)}</td>
              <td>${driChip(m.dri)}</td>
              <td>${fmtDow(m.scheduled_at)}</td>
              <td>${m.label}</td>
            </tr>
            <tr class="plan-copy-row" id="${rowId}"><td colspan="4"><div class="plan-copy-inner">${copyPanelContent(draft)}</div></td></tr>`
        }).join('\n')

    const dateRange = eventDateRange(e)

    return `
    <div class="event-card open" id="card-${cardId}">
      <div class="event-card-header" onclick="toggleCard('${cardId}')">
        <span class="event-dot ${dotCss}"></span>
        <span class="event-title">${e.name}</span>
        <div class="event-meta">
          <span class="event-type-pill ${pillCss}">${e.event_type}</span>
          <span class="event-date-range">${dateRange}</span>
          ${approvalBadge(e.approval_status)}
          ${e.dri ? `<span class="dri-chip">${e.dri}</span>` : `<span class="dri-empty">No DRI</span>`}
        </div>
        <span class="chevron">▶</span>
      </div>
      <div class="event-card-body">
        <table class="plan-table">
          <thead><tr><th>Channel</th><th>DRI</th><th>Date</th><th>Moment</th></tr></thead>
          <tbody>${planRows}</tbody>
        </table>
      </div>
    </div>`
  }).join('\n')
}

// ── How to Edit view (static) ──
const DOCS_HTML = `
  <div class="docs-panel">
    <div class="docs-header" onclick="toggleDocs('rules')">
      <h3>Setting promo rules by event type</h3>
      <span id="docs-rules-toggle">▼ expand</span>
    </div>
    <div class="docs-body open" id="docs-rules">
      <p>Promo rules define the default DRI and channel timeline for each event type. They live in <code>tools/calendar/promo-rules.yaml</code> and apply to every event of that type automatically when you run the sync.</p>
      <h4>Example</h4>
      <pre><span class="comment"># tools/calendar/promo-rules.yaml</span>
<span class="key">event_types</span>:
  <span class="key">ai-basics</span>:
    <span class="key">dri</span>: <span class="val">"Sheena"</span>
    <span class="key">moments</span>:
      - <span class="key">channel</span>: <span class="val">linkedin-wdai</span>
        <span class="key">days_before</span>: <span class="val">14</span>
        <span class="key">label</span>: <span class="val">"Announce open enrollment"</span>
      - <span class="key">channel</span>: <span class="val">email</span>
        <span class="key">days_before</span>: <span class="val">7</span>
        <span class="key">label</span>: <span class="val">"Member invite"</span>
      - <span class="key">channel</span>: <span class="val">slack</span>
        <span class="key">days_before</span>: <span class="val">2</span>
        <span class="key">label</span>: <span class="val">"Last-chance reminder"</span>

  <span class="key">show-dont-tell</span>:
    <span class="key">dri</span>: <span class="val">"Carolyn"</span>
    <span class="key">moments</span>:
      - <span class="key">channel</span>: <span class="val">linkedin-wdai</span>
        <span class="key">days_before</span>: <span class="val">14</span>
        <span class="key">label</span>: <span class="val">"Event announcement"</span></pre>
      <h4>After editing</h4>
      <ol>
        <li>Save the file</li>
        <li>Run <code>npm run calendar:sync:mock</code> to preview with mock data</li>
        <li>Run <code>npm run calendar:sync</code> to sync from the real Luma API</li>
        <li>The HTML viewer and <code>vault/content-calendar.md</code> regenerate automatically</li>
      </ol>
    </div>
  </div>

  <div class="docs-panel">
    <div class="docs-header" onclick="toggleDocs('overrides')">
      <h3>Overriding a specific event</h3>
      <span id="docs-overrides-toggle">▼ expand</span>
    </div>
    <div class="docs-body open" id="docs-overrides">
      <p>Use <code>tools/calendar/overrides.yaml</code> to set a custom DRI or channel plan for one specific event — without changing the rule for that entire event type. The override key is the event's Luma ID (visible in the URL on lu.ma).</p>
      <h4>Example</h4>
      <pre><span class="comment"># tools/calendar/overrides.yaml</span>
<span class="key">overrides</span>:
  <span class="key">evt-mock-001</span>:  <span class="comment"># AI Basics W27</span>
    <span class="key">dri</span>: <span class="val">"Helen"</span>   <span class="comment"># overrides the default "Sheena" for this event only</span>
  <span class="key">evt-mock-002</span>:  <span class="comment"># Show Don't Tell May</span>
    <span class="key">moments</span>:
      - <span class="key">channel</span>: <span class="val">email</span>
        <span class="key">days_before</span>: <span class="val">3</span>
        <span class="key">label</span>: <span class="val">"Special reminder for this session only"</span></pre>
      <h4>Priority order</h4>
      <ol>
        <li><strong>overrides.yaml</strong> — wins always (per-event manual settings)</li>
        <li><strong>promo-rules.yaml</strong> — applies if no override exists for that event</li>
        <li><strong>Default</strong> — empty DRI and no channel moments if no rule matches</li>
      </ol>
      <p style="margin-top:12px">Both files are version-controlled, so all changes are tracked in git history.</p>
    </div>
  </div>`

// ── CSS (inlined from prototype) ──
const CSS = `
    :root {
      --pink:    #e93583;
      --orange:  #ee8933;
      --navy:    #332961;
      --lavender:#86589d;
      --bg:      #f5f5f7;
      --surface: #ffffff;
      --border:  #e4e4e8;
      --text:    #1a1a2e;
      --muted:   #6b7280;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--bg); color: var(--text); font-size: 14px; line-height: 1.5;
    }

    /* ── Page header ── */
    .page-header {
      background: var(--navy); color: white;
      padding: 20px 32px;
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 12px;
    }
    .page-header h1 { font-size: 18px; font-weight: 700; letter-spacing: -0.3px; }
    .page-header h1 span { color: var(--pink); }
    .header-right { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .sync-badge {
      font-size: 12px; background: rgba(255,255,255,0.12);
      border-radius: 20px; padding: 4px 12px; color: rgba(255,255,255,0.75);
    }

    /* ── View toggle ── */
    .view-toggle { display: flex; background: rgba(255,255,255,0.12); border-radius: 8px; overflow: hidden; }
    .view-toggle button {
      background: none; border: none; color: rgba(255,255,255,0.65);
      padding: 5px 14px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s;
    }
    .view-toggle button.active { background: white; color: var(--navy); border-radius: 6px; margin: 2px; }

    /* ── Layout ── */
    main { max-width: 1000px; margin: 0 auto; padding: 28px 24px 60px; }
    .view { display: none; }
    .view.active { display: block; }

    /* ── Filter bar ── */
    .filter-bar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; align-items: center; }
    .filter-bar span { font-size: 12px; color: var(--muted); font-weight: 500; margin-right: 2px; }
    .filter-chip {
      padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;
      border: 1.5px solid var(--border); background: white; color: var(--muted);
      cursor: pointer; transition: all 0.15s;
    }
    .filter-chip:hover, .filter-chip.active { border-color: var(--navy); color: var(--navy); background: #f0eef8; }

    /* ── Shared badges ── */
    .channel-badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; white-space: nowrap;
    }
    .ch-linkedin-wdai     { background: #dbeafe; color: #1e40af; }
    .ch-linkedin-personal { background: #ede9f8; color: var(--lavender); }
    .ch-email             { background: #fce7f3; color: var(--pink); }
    .ch-slack             { background: #fef9c3; color: #854d0e; }

    .dri-chip {
      background: #f3f4f6; border-radius: 20px; padding: 2px 10px;
      font-size: 12px; color: var(--navy); font-weight: 500; display: inline-block;
    }
    .dri-empty { color: var(--muted); font-style: italic; font-size: 12px; }

    .approval-badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; white-space: nowrap;
    }
    .badge-pending { background: #fef3c7; color: #92400e; }
    .badge-approved { background: #d1fae5; color: #065f46; }
    .badge-changes-requested { background: #fed7aa; color: #9a3412; }

    /* ── DATE VIEW ── */
    .week-group { margin-bottom: 28px; }
    .week-label {
      font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;
      color: var(--muted); padding: 0 4px 8px; border-bottom: 2px solid var(--border); margin-bottom: 2px;
    }
    .moment-row {
      display: grid;
      grid-template-columns: 110px 140px 1fr 90px;
      align-items: center; gap: 12px; padding: 11px 14px;
      background: var(--surface); border-bottom: 1px solid var(--border);
      cursor: pointer; transition: background 0.1s;
    }
    .moment-row:first-of-type { border-radius: 8px 8px 0 0; }
    .moment-row:last-of-type  { border-radius: 0 0 8px 8px; border-bottom: none; }
    .moment-row:only-of-type  { border-radius: 8px; border-bottom: none; }
    .moment-row:hover, .moment-row.expanded { background: #fdf4f8; }

    .col-date { font-size: 12px; color: var(--navy); white-space: nowrap; }
    .col-date .dow  { font-weight: 700; display: block; }
    .col-date .time { font-size: 11px; font-weight: 400; color: var(--muted); display: block; }

    .event-chip { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text); }
    .event-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .dot-ai-basics       { background: var(--pink); }
    .dot-ai-intermediate { background: var(--orange); }
    .dot-ai-advanced     { background: var(--navy); }
    .dot-show-dont-tell  { background: var(--lavender); }
    .dot-she-builds      { background: var(--pink); }
    .dot-speaker-event   { background: var(--orange); }
    .dot-other           { background: #9ca3af; }
    .event-name-text { font-weight: 500; }
    .event-label     { font-size: 11px; color: var(--muted); }

    .copy-panel {
      display: none;
      padding: 12px 14px 14px calc(110px + 140px + 12px + 12px + 14px);
      background: #fdf4f8; border-bottom: 1px solid var(--border);
      font-size: 13px; color: var(--text); line-height: 1.6;
    }
    .copy-panel.open { display: block; }
    .copy-panel p { max-width: 560px; }
    .copy-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; color: var(--muted); margin-bottom: 5px; }
    .copy-empty { color: var(--muted); font-style: italic; }

    .moment-row.hidden, .copy-panel.hidden { display: none !important; }
    .week-group.all-hidden { display: none; }

    /* ── EVENT VIEW ── */
    .event-card { background: var(--surface); border-radius: 10px; border: 1px solid var(--border); margin-bottom: 20px; overflow: hidden; }
    .event-card-header {
      display: flex; align-items: center; gap: 14px; padding: 14px 18px;
      border-bottom: 1px solid var(--border); background: #fafafa; cursor: pointer;
    }
    .event-card-header:hover { background: #f0eef8; }
    .event-card-header .event-dot { width: 10px; height: 10px; flex-shrink: 0; }
    .event-title { font-size: 15px; font-weight: 700; color: var(--navy); flex: 1; }
    .event-meta  { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .event-type-pill { padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
    .pill-ai-basics       { background: #fce7f3; color: var(--pink); }
    .pill-ai-intermediate { background: #fff3e0; color: #c05a00; }
    .pill-ai-advanced     { background: #ede9f8; color: var(--navy); }
    .pill-show-dont-tell  { background: #f3e8ff; color: var(--lavender); }
    .pill-she-builds      { background: #fce7f3; color: var(--pink); }
    .pill-speaker-event   { background: #fff3e0; color: #c05a00; }
    .pill-other           { background: #f3f4f6; color: var(--muted); }
    .event-date-range { font-size: 12px; color: var(--muted); }
    .chevron { font-size: 12px; color: var(--muted); transition: transform 0.2s; }
    .event-card.open .chevron { transform: rotate(90deg); }

    .event-card-body { display: none; }
    .event-card.open .event-card-body { display: block; }

    .plan-table { width: 100%; border-collapse: collapse; }
    .plan-table th {
      background: #f8f8fa; padding: 8px 16px; text-align: left;
      font-size: 11px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.6px; color: var(--muted); border-bottom: 1px solid var(--border);
    }
    .plan-table td { padding: 11px 16px; border-bottom: 1px solid var(--border); font-size: 13px; vertical-align: middle; }
    .plan-table tr:last-child td { border-bottom: none; }
    .plan-table tr:hover td { background: #fdf4f8; cursor: pointer; }
    .plan-table tr.expanded td { background: #fdf4f8; }
    .plan-copy-row td { padding: 0; background: #fdf4f8 !important; }
    .plan-copy-inner { display: none; padding: 10px 16px 14px; font-size: 13px; color: var(--text); line-height: 1.6; max-width: 560px; }
    .plan-copy-row.open .plan-copy-inner { display: block; }

    /* ── DOCS PANEL ── */
    .docs-panel {
      background: var(--surface); border-radius: 10px; border: 1px solid var(--border);
      overflow: hidden; margin-bottom: 28px;
    }
    .docs-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 18px; background: #f8f8fa; border-bottom: 1px solid var(--border);
      cursor: pointer;
    }
    .docs-header:hover { background: #f0eef8; }
    .docs-header h3 { font-size: 13px; font-weight: 700; color: var(--navy); }
    .docs-header span { font-size: 11px; color: var(--muted); }
    .docs-body { display: none; padding: 20px 22px; line-height: 1.7; font-size: 13px; }
    .docs-body.open { display: block; }
    .docs-body h4 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: var(--muted); margin: 18px 0 6px; }
    .docs-body h4:first-child { margin-top: 0; }
    .docs-body p { max-width: 620px; color: var(--text); margin-bottom: 8px; }
    .docs-body code {
      font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px;
      background: #f3f4f6; border-radius: 4px; padding: 1px 6px; color: var(--navy);
    }
    .docs-body pre {
      background: #1e1e2e; color: #cdd6f4; border-radius: 8px;
      padding: 14px 16px; font-size: 12px; font-family: 'SF Mono', 'Fira Code', monospace;
      line-height: 1.6; overflow-x: auto; margin: 8px 0 12px; max-width: 620px;
    }
    .docs-body pre .comment { color: #6c7086; }
    .docs-body pre .key     { color: #89b4fa; }
    .docs-body pre .val     { color: #a6e3a1; }
    .docs-body ol { padding-left: 18px; max-width: 580px; }
    .docs-body ol li { margin-bottom: 4px; }

    /* ── Copy status badges ── */
    .copy-status-badge {
      display: inline-flex; align-items: center;
      padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; margin-bottom: 6px;
    }
    .copy-badge-draft          { background: #f3f4f6; color: #6b7280; }
    .copy-badge-pending-review { background: #fef3c7; color: #92400e; }
    .copy-badge-approved       { background: #d1fae5; color: #065f46; }
    .copy-badge-published      { background: #dbeafe; color: #1e40af; }`

// ── JS (inlined from prototype) ──
const JS = `
  // ── View switching ──
  function switchView(v) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'))
    document.getElementById('view-' + v).classList.add('active')
    ;['date','event','docs'].forEach(id => {
      document.getElementById('btn-' + id).classList.toggle('active', id === v)
    })
  }

  // ── Date view: row expand ──
  function toggleRow(id) {
    const panel = document.getElementById(id)
    const row   = panel.previousElementSibling
    const open  = panel.classList.contains('open')
    panel.classList.toggle('open', !open)
    row.classList.toggle('expanded', !open)
  }

  // ── Event view: card ──
  function toggleCard(id) {
    document.getElementById('card-' + id).classList.toggle('open')
  }

  // ── Event view: plan row ──
  function togglePlanRow(id) {
    const copy = document.getElementById(id)
    const data = copy.previousElementSibling
    const open = copy.classList.contains('open')
    copy.classList.toggle('open', !open)
    data.classList.toggle('expanded', !open)
  }

  // ── Docs: section expand ──
  function toggleDocs(id) {
    const body   = document.getElementById('docs-' + id)
    const toggle = document.getElementById('docs-' + id + '-toggle')
    const open   = body.classList.contains('open')
    body.classList.toggle('open', !open)
    toggle.textContent = open ? '\\u25bc expand' : '\\u25b2 collapse'
  }

  // ── Date view: filtering ──
  let activeChannel = null

  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'))
      chip.classList.add('active')
      activeChannel = chip.dataset.filter === 'all' ? null : chip.dataset.filter
      applyFilter()
    })
  })

  function applyFilter() {
    document.querySelectorAll('#view-date .moment-row').forEach(row => {
      const panel = row.nextElementSibling
      const show  = !activeChannel || row.dataset.channel === activeChannel
      row.classList.toggle('hidden', !show)
      if (panel && panel.classList.contains('copy-panel')) panel.classList.toggle('hidden', !show)
    })
    document.querySelectorAll('#view-date .week-group').forEach(g => {
      const any = [...g.querySelectorAll('.moment-row')].some(r => !r.classList.contains('hidden'))
      g.classList.toggle('all-hidden', !any)
    })
  }`

// ── Main export ──
export function renderCalendarHtml(entries: CalendarEntry[], syncedAt: string): string {
  resetUid()
  const syncedLabel = fmtDate(syncedAt)
  const dateView  = renderDateView(entries)
  const eventView = renderEventView(entries)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WDAI Content Calendar</title>
  <style>${CSS}
  </style>
</head>
<body>

<header class="page-header">
  <h1>WDAI <span>Content</span> Calendar</h1>
  <div class="header-right">
    <div class="view-toggle">
      <button id="btn-date"  class="active" onclick="switchView('date')">By Date</button>
      <button id="btn-event"             onclick="switchView('event')">By Event</button>
      <button id="btn-docs"              onclick="switchView('docs')">How to edit</button>
    </div>
    <span class="sync-badge">Synced ${syncedLabel}</span>
  </div>
</header>

<main>

  <!-- BY DATE VIEW -->
  <div id="view-date" class="view active">
    ${dateView}
  </div>

  <!-- BY EVENT VIEW -->
  <div id="view-event" class="view">
    ${eventView}
  </div>

  <!-- HOW TO EDIT VIEW -->
  <div id="view-docs" class="view">
    ${DOCS_HTML}
  </div>

</main>

<script>
${JS}
</script>

</body>
</html>`
}
