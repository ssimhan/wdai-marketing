import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { CopyDraft, CalendarEntry } from '../types.js'

const makeEvent = (): CalendarEntry => ({
  luma_id: 'evt-test-001',
  name: 'AI Basics Workshop',
  event_type: 'ai-basics',
  start_at: '2026-05-01T18:00:00Z',
  end_at: '2026-05-01T20:00:00Z',
  timezone: 'America/New_York',
  luma_url: 'https://lu.ma/ai-basics',
  meeting_url: null,
  visibility: 'public',
  tags: [],
  promo_window_start: '2026-04-17T18:00:00Z',
  dri: 'Helen',
  copy_status: '✅ Approved',
  approval_status: 'approved',
  channel_plan: [],
  notes: '',
})

const makeDraft = (overrides: Partial<CopyDraft> = {}): CopyDraft => ({
  luma_id: 'evt-test-001',
  channel: 'linkedin-wdai',
  label: 'Announce open enrollment',
  content: 'Exciting news! AI Basics is open.',
  status: 'approved',
  generated_at: '2026-04-18T10:00:00Z',
  generated_by: 'claude',
  ...overrides,
})

beforeEach(() => {
  vi.resetModules()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('runPublish — no approved drafts', () => {
  it('returns skipped count when all drafts are in draft status', async () => {
    vi.doMock('../copy-store.js', () => ({
      readEventCopy: vi.fn().mockReturnValue([makeDraft({ status: 'draft' })]),
      writeCopyDraft: vi.fn(),
    }))
    vi.doMock('../linkedin-client.js', () => ({
      postToLinkedIn: vi.fn().mockResolvedValue(undefined),
    }))

    const { runPublish } = await import('../publisher.js')
    const result = await runPublish(makeEvent(), '/fake/promos', {})

    expect(result.published).toBe(0)
    expect(result.skipped).toBe(1)
    expect(result.errors).toBe(0)
  })

  it('returns zero counts when no drafts exist', async () => {
    vi.doMock('../copy-store.js', () => ({
      readEventCopy: vi.fn().mockReturnValue([]),
      writeCopyDraft: vi.fn(),
    }))
    vi.doMock('../linkedin-client.js', () => ({
      postToLinkedIn: vi.fn().mockResolvedValue(undefined),
    }))

    const { runPublish } = await import('../publisher.js')
    const result = await runPublish(makeEvent(), '/fake/promos', {})

    expect(result.published).toBe(0)
    expect(result.skipped).toBe(0)
    expect(result.errors).toBe(0)
  })
})

describe('runPublish — dry-run mode', () => {
  it('returns preview strings without writing any drafts', async () => {
    const mockWrite = vi.fn()
    vi.doMock('../copy-store.js', () => ({
      readEventCopy: vi.fn().mockReturnValue([makeDraft({ status: 'approved' })]),
      writeCopyDraft: mockWrite,
    }))
    vi.doMock('../linkedin-client.js', () => ({
      postToLinkedIn: vi.fn().mockResolvedValue(undefined),
    }))

    const { runPublish } = await import('../publisher.js')
    const result = await runPublish(makeEvent(), '/fake/promos', { dryRun: true })

    expect(result.published).toBe(0)
    expect(result.dryRunPreviews).toBeDefined()
    expect(result.dryRunPreviews!.length).toBeGreaterThan(0)
    expect(mockWrite).not.toHaveBeenCalled()
  })
})

describe('runPublish — with approved draft', () => {
  it('calls postToLinkedIn and marks draft as published', async () => {
    const mockWrite = vi.fn()
    const mockPost = vi.fn().mockResolvedValue(undefined)

    vi.doMock('../copy-store.js', () => ({
      readEventCopy: vi.fn().mockReturnValue([makeDraft({ status: 'approved' })]),
      writeCopyDraft: mockWrite,
    }))
    vi.doMock('../linkedin-client.js', () => ({
      postToLinkedIn: mockPost,
    }))

    process.env.LINKEDIN_ACCESS_TOKEN = 'test-token'
    process.env.LINKEDIN_ORGANIZATION_ID = '12345'

    const { runPublish } = await import('../publisher.js')
    const result = await runPublish(makeEvent(), '/fake/promos', {})

    expect(result.published).toBe(1)
    expect(result.errors).toBe(0)
    expect(mockPost).toHaveBeenCalledWith('Exciting news! AI Basics is open.', '12345', 'test-token')
    expect(mockWrite).toHaveBeenCalledWith(
      '/fake/promos',
      expect.objectContaining({ status: 'published', published_at: expect.any(String) }),
    )
  })

  it('counts errors when publisher throws', async () => {
    vi.doMock('../copy-store.js', () => ({
      readEventCopy: vi.fn().mockReturnValue([makeDraft({ status: 'approved' })]),
      writeCopyDraft: vi.fn(),
    }))
    vi.doMock('../linkedin-client.js', () => ({
      postToLinkedIn: vi.fn().mockRejectedValue(new Error('API error')),
    }))

    process.env.LINKEDIN_ACCESS_TOKEN = 'test-token'
    process.env.LINKEDIN_ORGANIZATION_ID = '12345'

    const { runPublish } = await import('../publisher.js')
    const result = await runPublish(makeEvent(), '/fake/promos', {})

    expect(result.errors).toBe(1)
    expect(result.published).toBe(0)
  })
})
