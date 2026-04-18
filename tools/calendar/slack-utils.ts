import type { CalendarEntry, PromoChannel, PromoMoment } from './types.js'

export const SLACK_TIMEOUT_MS = 10000

/**
 * POST JSON to a Slack endpoint with a 10s abort timeout.
 * Throws on network error or timeout — callers handle and log.
 */
export async function slackPost(
  url: string,
  headers: Record<string, string>,
  body: unknown,
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), SLACK_TIMEOUT_MS)
  try {
    return await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Encode luma_id + channel into a Slack button value.
 * Format: "<luma_id>|<channel>" — must be decoded with decodeButtonValue().
 */
export function encodeButtonValue(lumaId: string, channel: string): string {
  return `${lumaId}|${channel}`
}

/**
 * Decode a Slack button value encoded by encodeButtonValue().
 * Used in api/slack/interactions.ts when handling approve_copy / edit_copy.
 */
export function decodeButtonValue(value: string): { lumaId: string; channel: string } {
  const [lumaId, channel] = value.split('|')
  return { lumaId, channel }
}

/**
 * Find the PromoMoment for a given channel in a CalendarEntry's channel_plan.
 * Returns undefined if the channel is not in the plan.
 */
export function getMoment(event: CalendarEntry, channel: PromoChannel): PromoMoment | undefined {
  return event.channel_plan.find(m => m.channel === channel)
}
