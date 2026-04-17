import type { LumaEvent, CalendarEntry, EventType, PromoRules, OverridesMap, PromoMoment, PromoMomentRule, PromoStatus, CopyDraft, CopyStatus } from './types.js'

// Default promo window: events are promoted for 2 weeks before they start.
// Overridden per-event via overrides.yaml if a shorter/longer window is needed.
const PROMO_WINDOW_DAYS = 14

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

function buildMoments(
  startAt: string,
  rawMoments: PromoMomentRule[],
  dri: string,
): PromoMoment[] {
  return rawMoments.map(m => ({
    channel: m.channel,
    dri,
    scheduled_at: subtractDays(startAt, m.days_before),
    label: m.label,
  }))
}

function deriveCopyStatus(drafts: CopyDraft[]): CopyStatus {
  if (drafts.length === 0) return '🔲 Not started'
  const statuses = drafts.map(d => d.status)
  if (statuses.every(s => s === 'published')) return '📤 Sent'
  if (statuses.every(s => s === 'approved' || s === 'published')) return '✅ Approved'
  return '🟡 In progress'
}

export function mapLumaEvent(
  raw: LumaEvent,
  rules?: PromoRules,
  overrides?: OverridesMap,
  statuses?: Map<string, PromoStatus>,
  copyMap?: Map<string, CopyDraft[]>,
): CalendarEntry {
  const { event, tags } = raw
  const eventType = classifyEventType(tags)
  const rule = rules?.[eventType]
  const override = overrides?.[event.api_id]
  const status = statuses?.get(event.api_id)

  // Priority: override > rule > default ('')
  const dri = override?.dri ?? rule?.dri ?? ''

  // Priority: override moments > rule moments > []
  const rawMoments = override?.moments ?? rule?.moments ?? []
  const channel_plan = buildMoments(event.start_at, rawMoments, dri)

  const copy_drafts = copyMap ? (copyMap.get(event.api_id) ?? []) : undefined
  const copy_status = deriveCopyStatus(copy_drafts ?? [])

  return {
    luma_id: event.api_id,
    name: event.name,
    event_type: eventType,
    start_at: event.start_at,
    end_at: event.end_at,
    timezone: event.timezone,
    luma_url: event.url,
    meeting_url: event.meeting_url,
    visibility: event.visibility,
    tags,
    promo_window_start: subtractDays(event.start_at, PROMO_WINDOW_DAYS),
    dri,
    copy_status,
    copy_drafts,
    approval_status: status?.approval_status ?? 'pending',
    channel_plan,
    notes: event.description_md?.slice(0, 200) ?? '',
  }
}
