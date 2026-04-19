import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createMailchimpDraft } from '../mailchimp-client.js'

const SUBJECT = '[WDAI] AI Basics Workshop — Announce open enrollment'
const CONTENT = 'Exciting news! AI Basics is open for enrollment.'
const AUDIENCE_ID = 'abc123list'
const API_KEY = 'testkey-us1'
const SERVER = 'us1'
const CAMPAIGN_ID = 'camp_xyz789'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('createMailchimpDraft', () => {
  it('calls POST /campaigns with correct body', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: CAMPAIGN_ID }), { status: 200 }))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))

    await createMailchimpDraft(SUBJECT, CONTENT, AUDIENCE_ID, API_KEY, SERVER)

    const firstCall = vi.mocked(fetch).mock.calls[0]
    expect(firstCall[0]).toBe(`https://${SERVER}.api.mailchimp.com/3.0/campaigns`)
    expect(firstCall[1]?.method).toBe('POST')

    const body = JSON.parse(firstCall[1]?.body as string)
    expect(body.type).toBe('regular')
    expect(body.recipients.list_id).toBe(AUDIENCE_ID)
    expect(body.settings.subject_line).toBe(SUBJECT)
    expect(body.settings.from_name).toBe('Women Defining AI')
    expect(body.settings.reply_to).toBe('team@womendefiningai.org')
  })

  it('calls PUT /campaigns/<id>/content after POST', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: CAMPAIGN_ID }), { status: 200 }))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))

    await createMailchimpDraft(SUBJECT, CONTENT, AUDIENCE_ID, API_KEY, SERVER)

    const secondCall = vi.mocked(fetch).mock.calls[1]
    expect(secondCall[0]).toBe(`https://${SERVER}.api.mailchimp.com/3.0/campaigns/${CAMPAIGN_ID}/content`)
    expect(secondCall[1]?.method).toBe('PUT')

    const body = JSON.parse(secondCall[1]?.body as string)
    expect(body.html).toContain(CONTENT)
  })

  it('uses Basic auth with base64-encoded anystring:<apiKey>', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: CAMPAIGN_ID }), { status: 200 }))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))

    await createMailchimpDraft(SUBJECT, CONTENT, AUDIENCE_ID, API_KEY, SERVER)

    const headers = vi.mocked(fetch).mock.calls[0][1]?.headers as Record<string, string>
    const expectedAuth = `Basic ${Buffer.from(`anystring:${API_KEY}`).toString('base64')}`
    expect(headers['Authorization']).toBe(expectedAuth)
    expect(headers['Content-Type']).toBe('application/json')
  })

  it('returns the campaign ID', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: CAMPAIGN_ID }), { status: 200 }))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))

    const result = await createMailchimpDraft(SUBJECT, CONTENT, AUDIENCE_ID, API_KEY, SERVER)
    expect(result).toBe(CAMPAIGN_ID)
  })

  it('throws on non-2xx from POST /campaigns', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('Unauthorized', { status: 401 }))

    await expect(
      createMailchimpDraft(SUBJECT, CONTENT, AUDIENCE_ID, API_KEY, SERVER),
    ).rejects.toThrow('401')
  })

  it('throws on non-2xx from PUT /campaigns/<id>/content', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: CAMPAIGN_ID }), { status: 200 }))
      .mockResolvedValueOnce(new Response('Bad Request', { status: 400 }))

    await expect(
      createMailchimpDraft(SUBJECT, CONTENT, AUDIENCE_ID, API_KEY, SERVER),
    ).rejects.toThrow('400')
  })
})

describe.skipIf(!process.env.MAILCHIMP_LIVE_TEST)('createMailchimpDraft — live API', () => {
  it('creates a draft campaign in Mailchimp', async () => {
    const apiKey = process.env.MAILCHIMP_API_KEY!
    const server = process.env.MAILCHIMP_SERVER_PREFIX!
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID!
    const id = await createMailchimpDraft('[TEST] WDAI automated test — delete me', 'Test content', audienceId, apiKey, server)
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })
})
