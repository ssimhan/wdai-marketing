import { describe, it, expect, vi } from 'vitest'
import { sendCopyReviewDM, formatCopyReviewMessage } from '../slack-dm.js'
import type { CalendarEntry, CopyDraft } from '../types.js'

const mockEntry: CalendarEntry = {
  luma_id: 'evt-001',
  name: 'AI Basics W27',
  event_type: 'ai-basics',
  start_at: '2026-05-04T17:00:00Z',
  end_at: '2026-06-13T18:00:00Z',
  timezone: 'America/New_York',
  luma_url: 'https://lu.ma/ai-basics-w27',
  meeting_url: null,
  visibility: 'public',
  tags: [],
  promo_window_start: '2026-04-20T17:00:00.000Z',
  dri: 'Sheena',
  copy_status: '🟡 In progress',
  approval_status: 'approved',
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

const mockDraft: CopyDraft = {
  luma_id: 'evt-001',
  channel: 'linkedin-wdai',
  label: 'Announce open enrollment',
  content: 'Exciting news! AI Basics cohort is open for enrollment. Join us!',
  status: 'draft',
  generated_at: '2026-04-18T12:00:00Z',
  generated_by: 'claude',
}

// ─── sendCopyReviewDM ───────────────────────────────────────────────────────

describe('sendCopyReviewDM', () => {
  it('POSTs to chat.postMessage with correct auth header and body', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    })
    global.fetch = mockFetch

    const blocks = [{ type: 'section', text: { type: 'mrkdwn', text: 'hello' } }]
    await sendCopyReviewDM('xoxb-test-token', 'U0123456789', blocks)

    expect(mockFetch).toHaveBeenCalledOnce()
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toBe('https://slack.com/api/chat.postMessage')
    expect(options.method).toBe('POST')
    expect(options.headers['Authorization']).toBe('Bearer xoxb-test-token')
    expect(options.headers['Content-Type']).toBe('application/json')
    const body = JSON.parse(options.body)
    expect(body.channel).toBe('U0123456789')
    expect(body.blocks).toEqual(blocks)
  })

  it('catches and logs errors without throwing', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const blocks = [{ type: 'section', text: { type: 'mrkdwn', text: 'hello' } }]
    await expect(sendCopyReviewDM('xoxb-test-token', 'U0123456789', blocks)).resolves.toBeUndefined()

    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('logs warning when Slack returns ok: false', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: false, error: 'channel_not_found' }),
    })

    const blocks = [{ type: 'section', text: { type: 'mrkdwn', text: 'hello' } }]
    await sendCopyReviewDM('xoxb-test-token', 'U0123456789', blocks)

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('channel_not_found'))
    warnSpy.mockRestore()
  })

  it('uses a timeout signal', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    })
    global.fetch = mockFetch

    const blocks = [{ type: 'section', text: { type: 'mrkdwn', text: 'hello' } }]
    await sendCopyReviewDM('xoxb-test-token', 'U0123456789', blocks)

    const signal = mockFetch.mock.calls[0][1].signal
    expect(signal).toBeDefined()
  })
})

// ─── formatCopyReviewMessage ────────────────────────────────────────────────

describe('formatCopyReviewMessage', () => {
  it('returns blocks array', () => {
    const result = formatCopyReviewMessage(mockEntry, mockDraft)
    expect(result).toHaveProperty('blocks')
    expect(Array.isArray(result.blocks)).toBe(true)
  })

  it('includes a header block', () => {
    const result = formatCopyReviewMessage(mockEntry, mockDraft)
    const header = result.blocks.find((b: any) => b.type === 'header')
    expect(header).toBeDefined()
    expect(header?.text?.text).toContain('Copy Draft')
  })

  it('includes event name and channel in context', () => {
    const result = formatCopyReviewMessage(mockEntry, mockDraft)
    const sections = result.blocks.filter((b: any) => b.type === 'section')
    const text = sections.map((s: any) => s.text?.text ?? '').join(' ')
    expect(text).toContain('AI Basics W27')
    expect(text).toContain('linkedin-wdai')
  })

  it('includes the full copy text', () => {
    const result = formatCopyReviewMessage(mockEntry, mockDraft)
    const sections = result.blocks.filter((b: any) => b.type === 'section')
    const text = sections.map((s: any) => s.text?.text ?? '').join(' ')
    expect(text).toContain(mockDraft.content)
  })

  it('includes Approve and Edit buttons with encoded value', () => {
    const result = formatCopyReviewMessage(mockEntry, mockDraft)
    const actions = result.blocks.find((b: any) => b.type === 'actions')
    expect(actions).toBeDefined()

    const elements = (actions as any).elements
    const approve = elements.find((e: any) => e.action_id === 'approve_copy')
    const edit = elements.find((e: any) => e.action_id === 'edit_copy')

    expect(approve).toBeDefined()
    expect(edit).toBeDefined()

    // Value encodes luma_id|channel
    expect(approve.value).toBe('evt-001|linkedin-wdai')
    expect(edit.value).toBe('evt-001|linkedin-wdai')
  })

  it('approve button has primary style', () => {
    const result = formatCopyReviewMessage(mockEntry, mockDraft)
    const actions = result.blocks.find((b: any) => b.type === 'actions') as any
    const approve = actions.elements.find((e: any) => e.action_id === 'approve_copy')
    expect(approve.style).toBe('primary')
  })

  it('includes scheduled date in context', () => {
    const result = formatCopyReviewMessage(mockEntry, mockDraft)
    const sections = result.blocks.filter((b: any) => b.type === 'section')
    const text = sections.map((s: any) => s.text?.text ?? '').join(' ')
    expect(text).toMatch(/Apr 20|April 20/)
  })
})
