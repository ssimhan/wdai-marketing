import type { CalendarEntry, CopyDraft, SlackBlock } from './types.js'
import { CHANNEL_LABELS } from './types.js'
import { slackPost, encodeButtonValue, getMoment } from './slack-utils.js'

export async function sendCopyReviewDM(
  botToken: string,
  userId: string,
  blocks: SlackBlock[],
): Promise<void> {
  try {
    const response = await slackPost(
      'https://slack.com/api/chat.postMessage',
      {
        Authorization: `Bearer ${botToken}`,
        'Content-Type': 'application/json',
      },
      { channel: userId, blocks },
    )
    const data = (await response.json()) as { ok: boolean; error?: string }
    if (!data.ok) {
      console.warn(`[calendar] Slack DM failed: ${data.error}`)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`[calendar] Failed to send Slack DM: ${message}`)
  }
}

export function formatCopyReviewMessage(
  event: CalendarEntry,
  draft: CopyDraft,
): { blocks: SlackBlock[] } {
  const channelLabel = CHANNEL_LABELS[draft.channel] ?? draft.channel
  const moment = getMoment(event, draft.channel)
  const scheduledDate = moment
    ? new Date(moment.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : ''

  const value = encodeButtonValue(draft.luma_id, draft.channel)

  return {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '✍️ Copy Draft for Review' },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${event.name}*\nChannel: \`${draft.channel}\` (${channelLabel}) | Moment: ${draft.label}${scheduledDate ? `\nScheduled: ${scheduledDate}` : ''}`,
        },
      },
      { type: 'divider' },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: draft.content },
      },
      { type: 'divider' },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '✅ Approve' },
            style: 'primary',
            action_id: 'approve_copy',
            value,
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '✏️ Edit' },
            action_id: 'edit_copy',
            value,
          },
        ],
      },
    ],
  }
}
