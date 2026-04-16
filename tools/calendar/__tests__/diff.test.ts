import { describe, it, expect } from 'vitest'
import { detectChanges } from '../diff.js'
import type { CalendarEntry } from '../types.js'

const mockEntry1: CalendarEntry = {
  luma_id: 'evt-001',
  name: 'AI Basics W27',
  event_type: 'ai-basics',
  start_at: '2026-05-04T17:00:00Z',
  end_at: '2026-06-13T18:00:00Z',
  timezone: 'America/New_York',
  luma_url: 'https://lu.ma/ai-basics-w27',
  meeting_url: 'https://meet.google.com/mock',
  visibility: 'public',
  tags: ['ai-basics', 'cohort'],
  promo_window_start: '2026-04-20T17:00:00.000Z',
  dri: 'Sheena',
  copy_status: '🔲 Not started',
  channel_plan: [
    {
      channel: 'linkedin-wdai',
      dri: 'Sheena',
      scheduled_at: '2026-04-20T17:00:00.000Z',
      label: 'Announce open enrollment',
    },
  ],
  notes: 'A cohort for professionals.',
}

const mockEntry2: CalendarEntry = {
  luma_id: 'evt-002',
  name: 'AI Intermediate W28',
  event_type: 'ai-intermediate',
  start_at: '2026-06-15T17:00:00Z',
  end_at: '2026-07-20T18:00:00Z',
  timezone: 'America/New_York',
  luma_url: 'https://lu.ma/ai-intermediate-w28',
  meeting_url: 'https://meet.google.com/mock2',
  visibility: 'public',
  tags: ['ai-intermediate', 'cohort'],
  promo_window_start: '2026-06-01T17:00:00.000Z',
  dri: 'Helen',
  copy_status: '🔲 Not started',
  channel_plan: [
    {
      channel: 'linkedin-wdai',
      dri: 'Helen',
      scheduled_at: '2026-06-01T17:00:00.000Z',
      label: 'Enrollment open',
    },
  ],
  notes: 'Intermediate cohort.',
}

describe('detectChanges', () => {
  it('returns all entries as added when previous list is empty', () => {
    const result = detectChanges([], [mockEntry1, mockEntry2])
    expect(result.added).toEqual([mockEntry1, mockEntry2])
    expect(result.changed).toEqual([])
  })

  it('returns empty result when no changes between previous and current', () => {
    const result = detectChanges([mockEntry1, mockEntry2], [mockEntry1, mockEntry2])
    expect(result.added).toEqual([])
    expect(result.changed).toEqual([])
  })

  it('detects new entries in current list', () => {
    const result = detectChanges([mockEntry1], [mockEntry1, mockEntry2])
    expect(result.added).toEqual([mockEntry2])
    expect(result.changed).toEqual([])
  })

  it('detects when event start date changes', () => {
    const modified = {
      ...mockEntry1,
      start_at: '2026-05-11T17:00:00Z', // Changed from 05-04
    }
    const result = detectChanges([mockEntry1], [modified])
    expect(result.added).toEqual([])
    expect(result.changed).toEqual([modified])
  })

  it('detects when DRI changes', () => {
    const modified = {
      ...mockEntry1,
      dri: 'Helen', // Changed from Sheena
    }
    const result = detectChanges([mockEntry1], [modified])
    expect(result.added).toEqual([])
    expect(result.changed).toEqual([modified])
  })

  it('detects when channel plan length changes', () => {
    const modified = {
      ...mockEntry1,
      channel_plan: [
        ...mockEntry1.channel_plan,
        {
          channel: 'email' as const,
          dri: 'Helen',
          scheduled_at: '2026-04-27T17:00:00.000Z',
          label: 'Member invite',
        },
      ],
    }
    const result = detectChanges([mockEntry1], [modified])
    expect(result.added).toEqual([])
    expect(result.changed).toEqual([modified])
  })

  it('does not report change for copy_status field', () => {
    const modified = {
      ...mockEntry1,
      copy_status: '✅ Approved' as const,
    }
    const result = detectChanges([mockEntry1], [modified])
    expect(result.added).toEqual([])
    expect(result.changed).toEqual([])
  })

  it('does not report change for notes field', () => {
    const modified = {
      ...mockEntry1,
      notes: 'Updated notes.',
    }
    const result = detectChanges([mockEntry1], [modified])
    expect(result.added).toEqual([])
    expect(result.changed).toEqual([])
  })

  it('ignores entries removed from current list', () => {
    const result = detectChanges([mockEntry1, mockEntry2], [mockEntry1])
    // Only added and changed are reported, deletions are not tracked
    expect(result.added).toEqual([])
    expect(result.changed).toEqual([])
  })

  it('returns both added and changed in same result', () => {
    const modified = {
      ...mockEntry1,
      dri: 'Helen',
    }
    const result = detectChanges([mockEntry1], [modified, mockEntry2])
    expect(result.added).toEqual([mockEntry2])
    expect(result.changed).toEqual([modified])
  })
})
