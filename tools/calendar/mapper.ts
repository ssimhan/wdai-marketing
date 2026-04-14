import type { LumaEvent, CalendarEntry, EventType } from './types.js'

const TAG_TO_TYPE: Record<string, EventType> = {
  'ai-basics': 'ai-basics',
  'ai-intermediate': 'ai-intermediate',
  'ai-advanced': 'ai-advanced',
  'show-dont-tell': 'show-dont-tell',
  'she-builds': 'she-builds',
  'speaker-event': 'speaker-event',
}

function classifyEventType(tags: string[]): EventType {
  for (const tag of tags) {
    if (tag in TAG_TO_TYPE) return TAG_TO_TYPE[tag]
  }
  return 'other'
}

function subtractDays(isoDate: string, days: number): string {
  const d = new Date(isoDate)
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString()
}

export function mapLumaEvent(raw: LumaEvent): CalendarEntry {
  const { event, tags } = raw
  return {
    luma_id: event.api_id,
    name: event.name,
    event_type: classifyEventType(tags),
    start_at: event.start_at,
    end_at: event.end_at,
    timezone: event.timezone,
    luma_url: event.url,
    meeting_url: event.meeting_url,
    visibility: event.visibility,
    tags,
    promo_window_start: subtractDays(event.start_at, 14),
    dri: '',
    copy_status: '🔲 Not started',
    channel_plan: [],
    notes: event.description_md?.slice(0, 200) ?? '',
  }
}
