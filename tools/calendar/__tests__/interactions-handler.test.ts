import { describe, it, expect, vi, beforeEach } from 'vitest'
import crypto from 'crypto'
import { verifySlackSignature, handleApprovePlan, handleRequest } from '../../../api/slack/interactions.js'

// ── Signature helpers ──────────────────────────────────────────────────────

const TEST_SECRET = 'test-signing-secret'

function makeSignature(secret: string, timestamp: string, body: string): string {
  const base = `v0:${timestamp}:${body}`
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(base)
  return `v0=${hmac.digest('hex')}`
}

// ── verifySlackSignature ───────────────────────────────────────────────────

describe('verifySlackSignature', () => {
  it('returns true for a valid signature', () => {
    const ts   = '1713312000'
    const body = 'payload=%7B%22test%22%3A1%7D'
    const sig  = makeSignature(TEST_SECRET, ts, body)
    expect(verifySlackSignature(TEST_SECRET, ts, body, sig)).toBe(true)
  })

  it('returns false for a tampered body', () => {
    const ts      = '1713312000'
    const body    = 'payload=%7B%22test%22%3A1%7D'
    const sig     = makeSignature(TEST_SECRET, ts, body)
    const tampered = body + 'extra'
    expect(verifySlackSignature(TEST_SECRET, ts, tampered, sig)).toBe(false)
  })

  it('returns false for a wrong secret', () => {
    const ts  = '1713312000'
    const body = 'payload=%7B%22test%22%3A1%7D'
    const sig  = makeSignature('wrong-secret', ts, body)
    expect(verifySlackSignature(TEST_SECRET, ts, body, sig)).toBe(false)
  })

  it('returns false when signature is missing', () => {
    expect(verifySlackSignature(TEST_SECRET, '1713312000', 'body', '')).toBe(false)
  })
})

// ── handleApprovePlan ──────────────────────────────────────────────────────

const mockGithub = {
  token: 'ghp_test',
  owner: 'womendefiningai',
  repo: 'wdai-marketing',
}

describe('handleApprovePlan', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('GETs existing file then PUTs updated status', async () => {
    const existingYaml = 'luma_id: evt-001\napproval_status: pending\n'
    const existingContent = Buffer.from(existingYaml).toString('base64')

    ;(fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: existingContent, sha: 'abc123' }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })

    const result = await handleApprovePlan('evt-001', 'U123', mockGithub)

    expect(fetch).toHaveBeenCalledTimes(2)
    const [, putCall] = (fetch as ReturnType<typeof vi.fn>).mock.calls
    const putBody = JSON.parse(putCall[1].body)
    expect(putBody.sha).toBe('abc123')
    const decoded = Buffer.from(putBody.content, 'base64').toString('utf-8')
    expect(decoded).toContain('approval_status: approved')
    expect(decoded).toContain('approved_by: U123')
    expect(result.text).toContain('approved')
  })

  it('PUTs without SHA when file does not yet exist', async () => {
    ;(fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })

    await handleApprovePlan('evt-new', 'U123', mockGithub)

    const [, putCall] = (fetch as ReturnType<typeof vi.fn>).mock.calls
    const putBody = JSON.parse(putCall[1].body)
    expect(putBody.sha).toBeUndefined()
    const decoded = Buffer.from(putBody.content, 'base64').toString('utf-8')
    expect(decoded).toContain('approval_status: approved')
  })

  it('throws when GitHub PUT fails', async () => {
    ;(fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({ ok: false, status: 422, text: async () => 'Unprocessable' })

    await expect(handleApprovePlan('evt-001', 'U123', mockGithub)).rejects.toThrow('422')
  })
})

// ── handleRequest ──────────────────────────────────────────────────────────

describe('handleRequest', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  function makeHeaders(body: string, secret = TEST_SECRET) {
    const ts  = String(Math.floor(Date.now() / 1000))
    const sig = makeSignature(secret, ts, body)
    return {
      'x-slack-request-timestamp': ts,
      'x-slack-signature': sig,
    }
  }

  it('returns 401 for an invalid signature', async () => {
    const body    = 'payload=%7B%7D'
    const headers = { 'x-slack-request-timestamp': '0', 'x-slack-signature': 'v0=bad' }
    const result  = await handleRequest(body, headers, TEST_SECRET, mockGithub)
    expect(result.status).toBe(401)
  })

  it('routes approve_plan to handleApprovePlan', async () => {
    ;(fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })

    const payload = JSON.stringify({
      actions: [{ action_id: 'approve_plan', value: 'evt-001' }],
      user: { id: 'U456' },
    })
    const body = `payload=${encodeURIComponent(payload)}`
    const result = await handleRequest(body, makeHeaders(body), TEST_SECRET, mockGithub)
    expect(result.status).toBe(200)
    expect((result.body as { text: string }).text).toContain('approved')
  })

  it('returns 200 silently for an unknown action_id', async () => {
    const payload = JSON.stringify({
      actions: [{ action_id: 'unknown_action', value: 'evt-001' }],
      user: { id: 'U456' },
    })
    const body = `payload=${encodeURIComponent(payload)}`
    const result = await handleRequest(body, makeHeaders(body), TEST_SECRET, mockGithub)
    expect(result.status).toBe(200)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('returns 400 when payload field is missing', async () => {
    const body   = 'not_a_payload=something'
    const result = await handleRequest(body, makeHeaders(body), TEST_SECRET, mockGithub)
    expect(result.status).toBe(400)
  })
})
