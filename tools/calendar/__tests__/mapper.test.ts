import { describe, it, expect } from 'vitest'
import { mapLumaEvent } from '../mapper.js'
import type { LumaEvent, PromoRules, OverridesMap, PromoStatus } from '../types.js'

const mockEvent: LumaEvent = {
  api_id: 'entry-001',
  event: {
    api_id: 'evt-001',
    name: 'AI Basics W27 — Cohort Launch',
    description_md: 'A cohort for professionals.',
    start_at: '2026-05-04T17:00:00Z',
    end_at: '2026-06-13T18:00:00Z',
    timezone: 'America/New_York',
    slug: 'ai-basics-w27',
    url: 'https://lu.ma/ai-basics-w27',
    cover_url: null,
    meeting_url: 'https://meet.google.com/mock',
    visibility: 'public',
    geo_address_json: null,
  },
  tags: ['ai-basics', 'cohort'],
}

describe('mapLumaEvent', () => {
  it('maps core fields correctly', () => {
    const entry = mapLumaEvent(mockEvent)
    expect(entry.luma_id).toBe('evt-001')
    expect(entry.name).toBe('AI Basics W27 — Cohort Launch')
    expect(entry.luma_url).toBe('https://lu.ma/ai-basics-w27')
  })

  it('classifies event type from tags', () => {
    const entry = mapLumaEvent(mockEvent)
    expect(entry.event_type).toBe('ai-basics')
  })

  it('classifies unknown tags as "other"', () => {
    const entry = mapLumaEvent({ ...mockEvent, tags: ['unknown-tag'] })
    expect(entry.event_type).toBe('other')
  })

  it('computes promo_window_start as 14 days before start_at', () => {
    const entry = mapLumaEvent(mockEvent)
    expect(entry.promo_window_start).toBe('2026-04-20T17:00:00.000Z')
  })

  it('sets default copy_status to Not started', () => {
    const entry = mapLumaEvent(mockEvent)
    expect(entry.copy_status).toBe('🔲 Not started')
  })
})

const testRules: PromoRules = {
  'ai-basics': {
    dri: 'Sheena',
    moments: [
      { channel: 'linkedin-wdai', days_before: 14, label: 'Announce open enrollment' },
    ],
  },
}

describe('mapLumaEvent with rules', () => {
  it('sets dri from matching event type rule', () => {
    const entry = mapLumaEvent(mockEvent, testRules)
    expect(entry.dri).toBe('Sheena')
  })

  it('computes scheduled_at from event start_at minus days_before', () => {
    const entry = mapLumaEvent(mockEvent, testRules)
    expect(entry.channel_plan[0].scheduled_at).toBe('2026-04-20T17:00:00.000Z')
  })

  it('override dri wins over rule dri', () => {
    const overrides: OverridesMap = { 'evt-001': { dri: 'Helen' } }
    const entry = mapLumaEvent(mockEvent, testRules, overrides)
    expect(entry.dri).toBe('Helen')
  })

  it('no matching rule leaves channel_plan empty', () => {
    const entry = mapLumaEvent({ ...mockEvent, tags: ['unknown'] }, testRules)
    expect(entry.channel_plan).toEqual([])
  })
})

describe('mapLumaEvent with copy drafts', () => {
  it('sets copy_status to Not started when no drafts provided', () => {
    const entry = mapLumaEvent(mockEvent)
    expect(entry.copy_status).toBe('🔲 Not started')
    expect(entry.copy_drafts).toBeUndefined()
  })

  it('sets copy_status to Not started when copy map is empty', () => {
    const copyMap = new Map()
    const entry = mapLumaEvent(mockEvent, undefined, undefined, undefined, copyMap)
    expect(entry.copy_status).toBe('🔲 Not started')
    expect(entry.copy_drafts).toEqual([])
  })

  it('attaches copy drafts for the event', () => {
    const drafts: import('../types.js').CopyDraft[] = [
      {
        luma_id: 'evt-001',
        channel: 'linkedin-wdai',
        label: 'Announce',
        content: 'Copy text',
        status: 'draft',
        generated_at: '2026-04-16T12:00:00Z',
        generated_by: 'claude',
      },
    ]
    const copyMap = new Map([['evt-001', drafts]])
    const entry = mapLumaEvent(mockEvent, undefined, undefined, undefined, copyMap)
    expect(entry.copy_drafts).toEqual(drafts)
  })

  it('derives copy_status In progress when any draft is pending_review', () => {
    const drafts: import('../types.js').CopyDraft[] = [
      { luma_id: 'evt-001', channel: 'linkedin-wdai', label: 'A', content: 'x', status: 'pending_review', generated_at: '', generated_by: 'claude' },
      { luma_id: 'evt-001', channel: 'slack', label: 'B', content: 'y', status: 'draft', generated_at: '', generated_by: 'claude' },
    ]
    const copyMap = new Map([['evt-001', drafts]])
    const entry = mapLumaEvent(mockEvent, undefined, undefined, undefined, copyMap)
    expect(entry.copy_status).toBe('🟡 In progress')
  })

  it('derives copy_status Approved when all drafts are approved', () => {
    const drafts: import('../types.js').CopyDraft[] = [
      { luma_id: 'evt-001', channel: 'linkedin-wdai', label: 'A', content: 'x', status: 'approved', generated_at: '', generated_by: 'claude' },
      { luma_id: 'evt-001', channel: 'slack', label: 'B', content: 'y', status: 'approved', generated_at: '', generated_by: 'claude' },
    ]
    const copyMap = new Map([['evt-001', drafts]])
    const entry = mapLumaEvent(mockEvent, undefined, undefined, undefined, copyMap)
    expect(entry.copy_status).toBe('✅ Approved')
  })

  it('derives copy_status Sent when all drafts are published', () => {
    const drafts: import('../types.js').CopyDraft[] = [
      { luma_id: 'evt-001', channel: 'linkedin-wdai', label: 'A', content: 'x', status: 'published', generated_at: '', generated_by: 'claude' },
    ]
    const copyMap = new Map([['evt-001', drafts]])
    const entry = mapLumaEvent(mockEvent, undefined, undefined, undefined, copyMap)
    expect(entry.copy_status).toBe('📤 Sent')
  })

  it('derives copy_status In progress when drafts are mixed draft and approved', () => {
    const drafts: import('../types.js').CopyDraft[] = [
      { luma_id: 'evt-001', channel: 'linkedin-wdai', label: 'A', content: 'x', status: 'approved', generated_at: '', generated_by: 'claude' },
      { luma_id: 'evt-001', channel: 'slack', label: 'B', content: 'y', status: 'draft', generated_at: '', generated_by: 'claude' },
    ]
    const copyMap = new Map([['evt-001', drafts]])
    const entry = mapLumaEvent(mockEvent, undefined, undefined, undefined, copyMap)
    expect(entry.copy_status).toBe('🟡 In progress')
  })
})

describe('mapLumaEvent with approval status', () => {
  it('sets default approval_status to pending when no status provided', () => {
    const entry = mapLumaEvent(mockEvent)
    expect(entry.approval_status).toBe('pending')
  })

  it('reads approval_status from provided statuses map', () => {
    const statuses: Map<string, PromoStatus> = new Map([
      [
        'evt-001',
        {
          luma_id: 'evt-001',
          approval_status: 'approved',
          approved_by: 'Sheena',
        },
      ],
    ])
    const entry = mapLumaEvent(mockEvent, undefined, undefined, statuses)
    expect(entry.approval_status).toBe('approved')
  })

  it('preserves pending status if event not in statuses map', () => {
    const statuses: Map<string, PromoStatus> = new Map([
      [
        'evt-002',
        {
          luma_id: 'evt-002',
          approval_status: 'approved',
        },
      ],
    ])
    const entry = mapLumaEvent(mockEvent, undefined, undefined, statuses)
    expect(entry.approval_status).toBe('pending')
  })

  it('reads changes_requested status', () => {
    const statuses: Map<string, PromoStatus> = new Map([
      [
        'evt-001',
        {
          luma_id: 'evt-001',
          approval_status: 'changes_requested',
          notes: 'Update the messaging.',
        },
      ],
    ])
    const entry = mapLumaEvent(mockEvent, undefined, undefined, statuses)
    expect(entry.approval_status).toBe('changes_requested')
  })
})
