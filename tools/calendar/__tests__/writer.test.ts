import { describe, it, expect } from 'vitest'
import { renderCalendar } from '../writer.js'
import type { CalendarEntry, PromoMoment } from '../types.js'

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

  it('renders placeholder when channel_plan is empty', () => {
    const md = renderCalendar([entry], '2026-04-12T10:00:00Z')
    expect(md).toContain('*(No channel plan')
  })
})

const moment: PromoMoment = {
  channel: 'linkedin-wdai',
  dri: 'Sheena',
  scheduled_at: '2026-04-20T17:00:00Z',
  label: 'Announce open enrollment',
}

const entryWithPlan: CalendarEntry = { ...entry, channel_plan: [moment] }

describe('renderCalendar with channel plan', () => {
  it('renders channel plan as a markdown table', () => {
    const md = renderCalendar([entryWithPlan], '2026-04-12T10:00:00Z')
    expect(md).toContain('| Channel |')
    expect(md).toContain('linkedin-wdai')
    expect(md).toContain('Announce open enrollment')
  })
})

describe('renderCalendar with copy drafts', () => {
  const entryWithCopy: CalendarEntry = {
    ...entryWithPlan,
    copy_drafts: [
      {
        luma_id: 'evt-001',
        channel: 'linkedin-wdai',
        label: 'Announce open enrollment',
        content: 'Exciting news! AI Basics W27 is open for enrollment. Join us to learn.',
        status: 'approved',
        generated_at: '2026-04-16T12:00:00Z',
        generated_by: 'claude',
      },
    ],
  }

  it('includes copy excerpt in channel plan table when copy exists', () => {
    const md = renderCalendar([entryWithCopy], '2026-04-12T10:00:00Z')
    expect(md).toContain('Exciting news!')
  })

  it('truncates copy excerpt to 100 characters', () => {
    const longContent = 'A'.repeat(200)
    const entryWithLongCopy: CalendarEntry = {
      ...entryWithPlan,
      copy_drafts: [{ luma_id: 'evt-001', channel: 'linkedin-wdai', label: 'A', content: longContent, status: 'draft', generated_at: '', generated_by: 'claude' }],
    }
    const md = renderCalendar([entryWithLongCopy], '2026-04-12T10:00:00Z')
    // Should contain the excerpt, not the full 200-char string
    expect(md).toContain('AAAAAAAAAA')
    expect(md).not.toContain('A'.repeat(150))
  })
})
