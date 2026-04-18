import type { CalendarEntry, PromoMoment, VoiceGuides } from './types.js'

export interface BuiltPrompt {
  system: string
  user: string
}

function getChannelVoiceGuide(channel: string, guides: VoiceGuides): string {
  if (channel === 'linkedin-wdai' || channel === 'linkedin-personal') {
    return guides.linkedin
  }
  if (channel === 'slack') {
    return guides.slack
  }
  // email and others: brand guidelines only
  return ''
}

export function buildPrompt(
  event: CalendarEntry,
  moment: PromoMoment,
  voiceGuides: VoiceGuides,
): BuiltPrompt {
  const channelVoice = getChannelVoiceGuide(moment.channel, voiceGuides)

  const systemParts = [
    `You are a marketing copywriter for Women Defining AI. Write a ${moment.channel} post for the following event. Match the voice and style guide exactly.`,
    '',
    '=== BRAND GUIDELINES ===',
    voiceGuides.brand,
  ]

  if (channelVoice) {
    systemParts.push(
      '',
      `=== VOICE GUIDE (${moment.channel}) ===`,
      channelVoice,
    )
  }

  if (voiceGuides.personal_voice) {
    systemParts.push(
      '',
      '=== PERSONAL VOICE ===',
      voiceGuides.personal_voice,
    )
  }

  const system = systemParts.join('\n')

  const user = [
    `Write a ${moment.label} for this event:`,
    `- Event: ${event.name}`,
    `- Type: ${event.event_type}`,
    `- Dates: ${event.start_at} - ${event.end_at}`,
    `- Registration: ${event.luma_url}`,
    `- Channel: ${moment.channel}`,
    '',
    'Output just the post copy. No preamble, no explanation.',
  ].join('\n')

  return { system, user }
}
