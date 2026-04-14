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
  channel_plan: [
    { channel: 'linkedin-wdai', dri: 'Sheena', scheduled_at: '2026-04-20T17:00:00Z', label: 'Announce open enrollment' }
  ],
  notes: 'A 6-week cohort.',
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
})
