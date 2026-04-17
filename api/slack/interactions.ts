import crypto from 'crypto'
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'
import type { PromoStatus } from '../../tools/calendar/types.js'

// ── Types ──────────────────────────────────────────────────────────────────

export interface GitHubOptions {
  token: string
  owner: string
  repo: string
}

interface HandlerResult {
  status: number
  body: unknown
}

// ── Slack signature verification ───────────────────────────────────────────

export function verifySlackSignature(
  signingSecret: string,
  timestamp: string,
  rawBody: string,
  signature: string,
): boolean {
  if (!signature || !timestamp) return false
  try {
    const base = `v0:${timestamp}:${rawBody}`
    const hmac = crypto.createHmac('sha256', signingSecret)
    hmac.update(base)
    const expected = `v0=${hmac.digest('hex')}`
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'utf-8'),
      Buffer.from(signature, 'utf-8'),
    )
  } catch {
    return false
  }
}

// ── approve_plan handler ───────────────────────────────────────────────────

export async function handleApprovePlan(
  lumaId: string,
  userId: string,
  github: GitHubOptions,
): Promise<{ text: string }> {
  const filePath = `vault/status/${lumaId}.yaml`
  const apiUrl = `https://api.github.com/repos/${github.owner}/${github.repo}/contents/${filePath}`
  const headers = {
    Authorization: `Bearer ${github.token}`,
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'wdai-marketing-bot',
  }

  // GET existing file to retrieve SHA and current content
  let sha: string | undefined
  let existing: PromoStatus = { luma_id: lumaId, approval_status: 'pending' }

  const getRes = await fetch(apiUrl, { headers })
  if (getRes.ok) {
    const data = await getRes.json() as { content: string; sha: string }
    sha = data.sha
    existing = parseYaml(Buffer.from(data.content, 'base64').toString('utf-8')) as PromoStatus
  }

  // Build updated status
  const updated: PromoStatus = {
    ...existing,
    luma_id: lumaId,
    approval_status: 'approved',
    approved_by: userId,
    approved_at: new Date().toISOString(),
  }

  const putBody: Record<string, unknown> = {
    message: `chore(status): approve promo plan for ${lumaId} [skip ci]`,
    content: Buffer.from(stringifyYaml(updated, { lineWidth: 0 })).toString('base64'),
  }
  if (sha) putBody.sha = sha

  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify(putBody),
  })

  if (!putRes.ok) {
    const errText = await putRes.text()
    throw new Error(`GitHub API error: ${putRes.status} ${errText}`)
  }

  return { text: `✅ Promo plan approved for *${lumaId}*!` }
}

// ── Core request handler (exported for testing) ────────────────────────────

export async function handleRequest(
  rawBody: string,
  headers: Record<string, string | undefined>,
  signingSecret: string,
  github: GitHubOptions,
): Promise<HandlerResult> {
  const timestamp = headers['x-slack-request-timestamp'] ?? ''
  const signature = headers['x-slack-signature'] ?? ''

  if (!verifySlackSignature(signingSecret, timestamp, rawBody, signature)) {
    return { status: 401, body: { error: 'Invalid signature' } }
  }

  const params = new URLSearchParams(rawBody)
  const payloadStr = params.get('payload')
  if (!payloadStr) {
    return { status: 400, body: { error: 'Missing payload' } }
  }

  const payload = JSON.parse(payloadStr) as {
    actions?: Array<{ action_id: string; value: string }>
    user?: { id: string; name?: string }
  }

  const action = payload.actions?.[0]
  const userId = payload.user?.id ?? 'unknown'

  if (!action) {
    return { status: 200, body: {} }
  }

  if (action.action_id === 'approve_plan') {
    const result = await handleApprovePlan(action.value, userId, github)
    return { status: 200, body: result }
  }

  // Unknown action — acknowledge silently (Slack requires a 200 within 3s)
  return { status: 200, body: {} }
}

// ── Vercel handler ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const signingSecret = process.env.SLACK_SIGNING_SECRET ?? ''
  const github: GitHubOptions = {
    token: process.env.GITHUB_TOKEN ?? '',
    owner: process.env.GITHUB_OWNER ?? '',
    repo:  process.env.GITHUB_REPO  ?? '',
  }

  // Vercel may parse the body; we need the raw string for signature verification
  let rawBody: string
  if (typeof req.body === 'string') {
    rawBody = req.body
  } else if (Buffer.isBuffer(req.body)) {
    rawBody = req.body.toString('utf-8')
  } else {
    rawBody = new URLSearchParams(req.body ?? {}).toString()
  }

  try {
    const result = await handleRequest(rawBody, req.headers, signingSecret, github)
    res.status(result.status).json(result.body)
  } catch (err) {
    console.error('[interactions] Handler error:', err)
    res.status(500).json({ error: 'Internal error' })
  }
}
