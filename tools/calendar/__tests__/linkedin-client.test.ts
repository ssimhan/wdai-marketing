import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { postToLinkedIn } from '../linkedin-client.js'

const ORG_ID = '98765'
const TOKEN = 'Bearer-test-token'
const CONTENT = 'Exciting news from Women Defining AI!'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('postToLinkedIn', () => {
  it('calls the correct LinkedIn UGC Posts endpoint', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('{}', { status: 201 }))

    await postToLinkedIn(CONTENT, ORG_ID, TOKEN)

    expect(fetch).toHaveBeenCalledOnce()
    const [url] = vi.mocked(fetch).mock.calls[0]
    expect(url).toBe('https://api.linkedin.com/v2/ugcPosts')
  })

  it('sends correct headers', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('{}', { status: 201 }))

    await postToLinkedIn(CONTENT, ORG_ID, TOKEN)

    const [, init] = vi.mocked(fetch).mock.calls[0]
    const headers = init?.headers as Record<string, string>
    expect(headers['Authorization']).toBe(`Bearer ${TOKEN}`)
    expect(headers['X-Restli-Protocol-Version']).toBe('2.0.0')
    expect(headers['Content-Type']).toBe('application/json')
  })

  it('sends correct body shape with org URN and share text', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('{}', { status: 201 }))

    await postToLinkedIn(CONTENT, ORG_ID, TOKEN)

    const [, init] = vi.mocked(fetch).mock.calls[0]
    const body = JSON.parse(init?.body as string)

    expect(body.author).toBe(`urn:li:organization:${ORG_ID}`)
    expect(body.lifecycleState).toBe('PUBLISHED')
    expect(body.specificContent['com.linkedin.ugc.ShareContent'].shareCommentary.text).toBe(CONTENT)
    expect(body.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory).toBe('NONE')
    expect(body.visibility['com.linkedin.ugc.MemberNetworkVisibility']).toBe('PUBLIC')
  })

  it('uses POST method', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('{}', { status: 201 }))

    await postToLinkedIn(CONTENT, ORG_ID, TOKEN)

    const [, init] = vi.mocked(fetch).mock.calls[0]
    expect(init?.method).toBe('POST')
  })

  it('throws on non-2xx response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('Unauthorized', { status: 401 }))

    await expect(postToLinkedIn(CONTENT, ORG_ID, TOKEN)).rejects.toThrow('401')
  })

  it('throws on 500 server error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('Internal Server Error', { status: 500 }))

    await expect(postToLinkedIn(CONTENT, ORG_ID, TOKEN)).rejects.toThrow('500')
  })
})

describe.skipIf(!process.env.LINKEDIN_LIVE_TEST)('postToLinkedIn — live API', () => {
  it('posts to LinkedIn org page', async () => {
    const token = process.env.LINKEDIN_ACCESS_TOKEN!
    const orgId = process.env.LINKEDIN_ORGANIZATION_ID!
    await expect(postToLinkedIn('[TEST] WDAI automated test post — please delete', orgId, token)).resolves.not.toThrow()
  })
})
