import Anthropic from '@anthropic-ai/sdk'
import { buildPrompt } from './prompt-builder.js'
import type { CalendarEntry, PromoMoment, VoiceGuides, CopyDraft } from './types.js'

const DEFAULT_MODEL = 'claude-haiku-4-5-20251001'
const TIMEOUT_MS = 60_000

export async function generateCopy(
  event: CalendarEntry,
  moment: PromoMoment,
  voiceGuides: VoiceGuides,
  model = DEFAULT_MODEL,
): Promise<CopyDraft> {
  const client = new Anthropic()
  const { system, user } = buildPrompt(event, moment, voiceGuides)

  const response = await client.messages.create(
    {
      model,
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: user }],
    },
    { timeout: TIMEOUT_MS },
  )

  const textBlock = response.content.find(b => b.type === 'text')
  const content = textBlock && textBlock.type === 'text' ? textBlock.text : ''

  return {
    luma_id: event.luma_id,
    channel: moment.channel,
    label: moment.label,
    content,
    status: 'draft',
    generated_at: new Date().toISOString(),
    generated_by: 'claude',
  }
}
