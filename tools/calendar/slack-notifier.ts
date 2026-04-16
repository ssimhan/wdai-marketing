import type { CalendarEntry, SlackBlock } from './types.js'

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

    // Divider between entries
    blocks.push({
      type: 'divider',
    })
  }

  return { blocks }
}

function formatChannelLabel(channel: string): string {
  const labels: Record<string, string> = {
    'linkedin-wdai': 'LinkedIn (WDAI)',
    'linkedin-personal': 'LinkedIn (Personal)',
    email: 'Email',
    slack: 'Slack',
  }
  return labels[channel] || channel
}
