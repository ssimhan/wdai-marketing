import { describe, it, expect } from 'vitest'
import { renderCalendar } from '../writer.js'
import type { CalendarEntry } from '../types.js'

const entry: CalendarEntry = {
  luma_id: 'evt-001',
  name: 'AI Basics W27',
  event_type: 'ai-basics',
  start_at: '2026-05-04T17:00:00Z',
  end_at: '2026-06-13T18:00:00Z',
  timezone: 'America/New_York',
  luma_url: 'https://lu.ma/ai-basics-w27',
  meeting_url: 'https://meet.google.com/mock',
  visibility: 'public',
  tags: ['ai-basics'],
  promo_window_start: '2026-04-20T17:00:00Z',
  dri: 'Sheena',
  copy_status: '🔲 Not started',
  channel_plan: [],
  notes: 'A 6-week cohort.',
}

describe('renderCalendar', () => {
  it('includes a summary table', () => {
    const md = renderCalendar([entry], '2026-04-12T10:00:00Z')
    expect(md).toContain('| Event |')
    expect(md).toContain('AI Basics W27')
  })

  it('includes per-event detail block', () => {
    const md = renderCalendar([entry], '2026-04-12T10:00:00Z')
    expect(md).toContain('## AI Basics W27')
    expect(md).toContain('evt-001')
    expect(md).toContain('Sheena')
  })

  it('is idempotent — same input produces same output', () => {
    const a = renderCalendar([entry], '2026-04-12T10:00:00Z')
    const b = renderCalendar([entry], '2026-04-12T10:00:00Z')
    expect(a).toBe(b)
  })

  it('includes last synced timestamp', () => {
    const md = renderCalendar([entry], '2026-04-12T10:00:00Z')
    expect(md).toContain('Apr 12, 2026')
  })
})
