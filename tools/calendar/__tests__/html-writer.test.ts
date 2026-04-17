import { describe, it, expect } from 'vitest'
import { renderCalendarHtml } from '../html-writer.js'
import type { CalendarEntry } from '../types.js'

const entry: CalendarEntry = {
  luma_id: 'evt-001',
  name: 'AI Basics W27',
  event_type: 'ai-basics',
  start_at: '2026-05-04T17:00:00Z',
  end_at: '2026-06-13T18:00:00Z',
  timezone: 'America/New_York',
  luma_url: 'https://lu.ma/ai-basics-w27',
  meeting_url: null,
  visibility: 'public',
  tags: ['ai-basics'],
  promo_window_start: '2026-04-20T17:00:00Z',
  dri: 'Sheena',
  copy_status: '🔲 Not started',
  approval_status: 'pending',
  channel_plan: [
    { channel: 'linkedin-wdai', dri: 'Sheena', scheduled_at: '2026-04-20T17:00:00Z', label: 'Announce open enrollment' }
  ],
  notes: 'A 6-week cohort.',
}

const entryWithCopy: CalendarEntry = {
  ...entry,
  copy_drafts: [
    {
      luma_id: 'evt-001',
      channel: 'linkedin-wdai',
      label: 'Announce open enrollment',
      content: 'Exciting news! AI Basics W27 is open for enrollment.',
      status: 'draft',
      generated_at: '2026-04-16T12:00:00Z',
      generated_by: 'claude',
    },
  ],
}

const entryWithApprovedCopy: CalendarEntry = {
  ...entry,
  copy_drafts: [
    {
      luma_id: 'evt-001',
      channel: 'linkedin-wdai',
      label: 'Announce open enrollment',
      content: 'Approved post copy here.',
      status: 'approved',
      generated_at: '2026-04-16T12:00:00Z',
      generated_by: 'claude',
    },
  ],
}

describe('renderCalendarHtml', () => {
  it('contains all three view sections', () => {
    const html = renderCalendarHtml([entry], '2026-04-14T10:00:00Z')
    expect(html).toContain('view-date')
    expect(html).toContain('view-event')
    expect(html).toContain('view-docs')
  })

  it('renders event name in both views', () => {
    const html = renderCalendarHtml([entry], '2026-04-14T10:00:00Z')
    expect(html.match(/AI Basics W27/g)?.length).toBeGreaterThan(1)
  })

  it('renders day-of-week date format without comma', () => {
    const html = renderCalendarHtml([entry], '2026-04-14T10:00:00Z')
    // Mon Apr 20 — computed from scheduled_at '2026-04-20T17:00:00Z'
    expect(html).toContain('Mon Apr 20')
  })

  it('renders channel badge label', () => {
    const html = renderCalendarHtml([entry], '2026-04-14T10:00:00Z')
    expect(html).toContain('LinkedIn · WDAI')
  })

  it('is idempotent', () => {
    const a = renderCalendarHtml([entry], '2026-04-14T10:00:00Z')
    const b = renderCalendarHtml([entry], '2026-04-14T10:00:00Z')
    expect(a).toBe(b)
  })

  it('synced date appears in header', () => {
    const html = renderCalendarHtml([entry], '2026-04-14T10:00:00Z')
    expect(html).toContain('Apr 14, 2026')
  })

  it('renders approval status badge for pending status', () => {
    const html = renderCalendarHtml([entry], '2026-04-14T10:00:00Z')
    expect(html).toContain('⏳')
    expect(html).toContain('Pending')
    expect(html).toContain('badge-pending')
  })

  it('renders approval status badge for approved status', () => {
    const approvedEntry: CalendarEntry = { ...entry, approval_status: 'approved' }
    const html = renderCalendarHtml([approvedEntry], '2026-04-14T10:00:00Z')
    expect(html).toContain('✅')
    expect(html).toContain('Approved')
    expect(html).toContain('badge-approved')
  })

  it('renders approval status badge for changes_requested status', () => {
    const changesEntry: CalendarEntry = { ...entry, approval_status: 'changes_requested' }
    const html = renderCalendarHtml([changesEntry], '2026-04-14T10:00:00Z')
    expect(html).toContain('✏️')
    expect(html).toContain('Changes Requested')
    expect(html).toContain('badge-changes-requested')
  })
})

describe('renderCalendarHtml copy display', () => {
  it('shows generate prompt in copy-panel when no copy exists', () => {
    const html = renderCalendarHtml([entry], '2026-04-14T10:00:00Z')
    expect(html).toContain('npm run calendar:generate')
    expect(html).toContain('class="copy-empty"')
  })

  it('shows copy text in copy-panel when copy draft exists', () => {
    const html = renderCalendarHtml([entryWithCopy], '2026-04-14T10:00:00Z')
    expect(html).toContain('Exciting news! AI Basics W27 is open for enrollment.')
    // Should NOT show the generate prompt (the element, not the CSS class definition)
    expect(html).not.toContain('class="copy-empty"')
  })

  it('shows copy status badge "Draft" for draft status', () => {
    const html = renderCalendarHtml([entryWithCopy], '2026-04-14T10:00:00Z')
    expect(html).toContain('copy-badge-draft')
    expect(html).toContain('Draft')
  })

  it('shows copy status badge "Approved" for approved status', () => {
    const html = renderCalendarHtml([entryWithApprovedCopy], '2026-04-14T10:00:00Z')
    expect(html).toContain('copy-badge-approved')
    expect(html).toContain('Approved')
  })

  it('shows copy text in event view plan-copy-inner when draft exists', () => {
    const html = renderCalendarHtml([entryWithCopy], '2026-04-14T10:00:00Z')
    expect(html).toContain('plan-copy-inner')
    expect(html).toContain('Exciting news! AI Basics W27 is open for enrollment.')
  })

  it('shows generate prompt in event view plan-copy-inner when no copy', () => {
    const html = renderCalendarHtml([entry], '2026-04-14T10:00:00Z')
    expect(html).toContain('npm run calendar:generate')
  })
})
