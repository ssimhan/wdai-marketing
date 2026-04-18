import { describe, it, expect, vi } from 'vitest'
import { slackPost, encodeButtonValue, decodeButtonValue, getMoment } from '../slack-utils.js'
import type { CalendarEntry } from '../types.js'

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
  promo_window_start: '2026-04-20T17:00:00Z',
  dri: 'Sheena',
  copy_status: '🔲 Not started',
  approval_status: 'pending',
  channel_plan: [
    { channel: 'linkedin-wdai', dri: 'Sheena', scheduled_at: '2026-04-20T17:00:00Z', label: 'Announce open enrollment' },
    { channel: 'slack', dri: 'Helen', scheduled_at: '2026-04-18T17:00:00Z', label: 'Slack promo' },
  ],
  notes: '',
}

// ─── slackPost ──────────────────────────────────────────────────────────────

describe('slackPost', () => {
  it('POSTs to given URL with provided headers and JSON body', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    global.fetch = mockFetch

    await slackPost('https://example.com/api', { 'Content-Type': 'application/json' }, { foo: 'bar' })

    expect(mockFetch).toHaveBeenCalledOnce()
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toBe('https://example.com/api')
    expect(options.method).toBe('POST')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual({ foo: 'bar' })
  })

  it('attaches an AbortSignal for timeout', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    global.fetch = mockFetch

    await slackPost('https://example.com/api', {}, {})

    const signal = mockFetch.mock.calls[0][1].signal
    expect(signal).toBeInstanceOf(AbortSignal)
  })

  it('throws on network error (callers handle)', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network failure'))

    await expect(slackPost('https://example.com/api', {}, {})).rejects.toThrow('network failure')
  })
})

// ─── encodeButtonValue / decodeButtonValue ───────────────────────────────────

describe('encodeButtonValue', () => {
  it('encodes luma_id and channel as pipe-delimited string', () => {
    expect(encodeButtonValue('evt-001', 'linkedin-wdai')).toBe('evt-001|linkedin-wdai')
  })
})

describe('decodeButtonValue', () => {
  it('decodes pipe-delimited value into lumaId and channel', () => {
    const result = decodeButtonValue('evt-001|linkedin-wdai')
    expect(result).toEqual({ lumaId: 'evt-001', channel: 'linkedin-wdai' })
  })

  it('round-trips through encode → decode', () => {
    const encoded = encodeButtonValue('evt-abc', 'slack')
    expect(decodeButtonValue(encoded)).toEqual({ lumaId: 'evt-abc', channel: 'slack' })
  })
})

// ─── getMoment ──────────────────────────────────────────────────────────────

describe('getMoment', () => {
  it('returns the matching PromoMoment for a given channel', () => {
    const result = getMoment(mockEntry, 'linkedin-wdai')
    expect(result?.dri).toBe('Sheena')
    expect(result?.label).toBe('Announce open enrollment')
  })

  it('returns a different moment for a different channel', () => {
    const result = getMoment(mockEntry, 'slack')
    expect(result?.dri).toBe('Helen')
  })

  it('returns undefined if channel not in channel_plan', () => {
    const result = getMoment(mockEntry, 'email')
    expect(result).toBeUndefined()
  })
})
