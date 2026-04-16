import type { CalendarEntry } from './types.js'

export interface ChangeDetectionResult {
  added: CalendarEntry[]
  changed: CalendarEntry[]
}

export function detectChanges(
  previous: CalendarEntry[],
  current: CalendarEntry[]
): ChangeDetectionResult {
  const previousMap = new Map(previous.map((e) => [e.luma_id, e]))
  const currentMap = new Map(current.map((e) => [e.luma_id, e]))

  const added: CalendarEntry[] = []
  const changed: CalendarEntry[] = []

  for (const entry of current) {
    const prev = previousMap.get(entry.luma_id)

    if (!prev) {
      // Entry is new
      added.push(entry)
    } else if (hasChanged(prev, entry)) {
      // Entry has changed
      changed.push(entry)
    }
  }

  return { added, changed }
}

function hasChanged(prev: CalendarEntry, current: CalendarEntry): boolean {
  // Compare only fields that matter for promo planning
  // Ignore: copy_status, notes
  return (
    prev.start_at !== current.start_at ||
    prev.end_at !== current.end_at ||
    prev.dri !== current.dri ||
    prev.channel_plan.length !== current.channel_plan.length ||
    channelPlanChanged(prev.channel_plan, current.channel_plan)
  )
}

function channelPlanChanged(
  prev: CalendarEntry['channel_plan'],
  current: CalendarEntry['channel_plan']
): boolean {
  if (prev.length !== current.length) {
    return true
  }

  for (let i = 0; i < prev.length; i++) {
    const p = prev[i]
    const c = current[i]

    if (
      p.channel !== c.channel ||
      p.dri !== c.dri ||
      p.scheduled_at !== c.scheduled_at ||
      p.label !== c.label
    ) {
      return true
    }
  }

  return false
}
