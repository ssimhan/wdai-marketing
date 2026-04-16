import type { CalendarEntry, SlackBlock } from './types.js'
import { CHANNEL_LABELS } from './types.js'

const SLACK_TIMEOUT_MS = 10000 // 10 seconds

export function formatSlackMessage(entries: CalendarEntry[]): { blocks: SlackBlock[] } | null {
  if (entries.length === 0) {
    return null
  }

  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: '📅 Content Calendar Update',
      },
    },
  ]

  for (const entry of entries) {
    // Event details section
    const startDate = new Date(entry.start_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })

    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${entry.name}*\nType: \`${entry.event_type}\` | Start: ${startDate}\nDRI: ${entry.dri}`,
      },
    })

    // Channel plan section
    const planLines = entry.channel_plan.map((moment) => {
      const channelLabel = formatChannelLabel(moment.channel)
      const date = new Date(moment.scheduled_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
      return `• ${channelLabel} — ${date} — ${moment.label}`
    })

    if (planLines.length > 0) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Channel Plan:*\n${planLines.join('\n')}`,
        },
      })
    }

    // Action buttons
    blocks.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: '✅ Approve' },
          action_id: 'approve_plan',
          value: entry.luma_id,
        },
        {
          type: 'button',
          text: { type: 'plain_text', text: '✏️ Edit Plan' },
          action_id: 'edit_plan',
          value: entry.luma_id,
        },
      ],
    })

    // Divider between entries
    blocks.push({
      type: 'divider',
    })
  }

  return { blocks }
}

function formatChannelLabel(channel: string): string {
  return CHANNEL_LABELS[channel as keyof typeof CHANNEL_LABELS] || channel
}

export async function sendSlackNotification(
  webhookUrl: string,
  blocks: SlackBlock[],
): Promise<void> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), SLACK_TIMEOUT_MS)

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
      signal: controller.signal,
    })

    if (!response.ok) {
      console.warn(
        `[calendar] Slack webhook returned ${response.status}: ${response.statusText}`,
      )
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`[calendar] Failed to send Slack notification: ${message}`)
  } finally {
    clearTimeout(timeoutId)
  }
}
