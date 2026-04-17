import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { CalendarEntry, PromoMoment, VoiceGuides } from '../types.js'

// Mock @anthropic-ai/sdk before importing copy-generator
vi.mock('@anthropic-ai/sdk', () => {
  const create = vi.fn()
  return {
    default: vi.fn().mockImplementation(() => ({
      messages: { create },
    })),
    __mockCreate: create,
  }
})

const mockEntry: CalendarEntry = {
  luma_id: 'evt-001',
  name: 'AI Basics W27 — Cohort Launch',
  event_type: 'ai-basics',
  start_at: '2026-05-04T17:00:00Z',
  end_at: '2026-06-13T18:00:00Z',
  timezone: 'America/New_York',
  luma_url: 'https://lu.ma/ai-basics-w27',
  meeting_url: 'https://meet.google.com/mock',
  visibility: 'public',
  tags: ['ai-basics'],
  promo_window_start: '2026-04-20T17:00:00Z',
  dri: 'Sandhya',
  copy_status: '🔲 Not started',
  approval_status: 'pending',
  channel_plan: [],
  notes: 'A cohort for professionals.',
}

const mockMoment: PromoMoment = {
  channel: 'linkedin-wdai',
  dri: 'Sandhya',
  scheduled_at: '2026-04-20T17:00:00Z',
  label: 'Announce open enrollment',
}

const mockGuides: VoiceGuides = {
  brand: 'Brand guidelines content',
  linkedin: 'LinkedIn voice content',
  slack: 'Slack voice content',
}

describe('generateCopy', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns a CopyDraft with expected fields', async () => {
    const { __mockCreate } = await import('@anthropic-ai/sdk') as { __mockCreate: ReturnType<typeof vi.fn> }
    __mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: 'Generated copy text here.' }],
    })

    const { generateCopy } = await import('../copy-generator.js')
    const draft = await generateCopy(mockEntry, mockMoment, mockGuides)

    expect(draft.luma_id).toBe('evt-001')
    expect(draft.channel).toBe('linkedin-wdai')
    expect(draft.label).toBe('Announce open enrollment')
    expect(draft.content).toBe('Generated copy text here.')
    expect(draft.status).toBe('draft')
  })

  it('returns draft with generated_by: claude and a timestamp', async () => {
    const { __mockCreate } = await import('@anthropic-ai/sdk') as { __mockCreate: ReturnType<typeof vi.fn> }
    __mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: 'Some copy.' }],
    })

    const before = new Date().toISOString()
    const { generateCopy } = await import('../copy-generator.js')
    const draft = await generateCopy(mockEntry, mockMoment, mockGuides)
    const after = new Date().toISOString()

    expect(draft.generated_by).toBe('claude')
    expect(draft.generated_at >= before).toBe(true)
    expect(draft.generated_at <= after).toBe(true)
  })

  it('throws on API error after retry', async () => {
    const { __mockCreate } = await import('@anthropic-ai/sdk') as { __mockCreate: ReturnType<typeof vi.fn> }
    __mockCreate.mockRejectedValue(new Error('API Error'))

    const { generateCopy } = await import('../copy-generator.js')
    await expect(generateCopy(mockEntry, mockMoment, mockGuides)).rejects.toThrow('API Error')
  })
})

describe('generateCopy live (gated)', () => {
  const isLive = process.env.ANTHROPIC_LIVE_TEST === 'true'

  it.skipIf(!isLive)('calls real Claude API and returns non-empty content', async () => {
    const { generateCopy } = await import('../copy-generator.js')
    const draft = await generateCopy(mockEntry, mockMoment, mockGuides)
    expect(draft.content.length).toBeGreaterThan(10)
    expect(draft.generated_by).toBe('claude')
  })
})
