import type { CalendarEntry, PromoMoment, CopyDraft } from './types.js'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
}

// summaryRow and detailBlock share the same field set.
// If you add a new CalendarEntry field, update BOTH functions and the header row in renderCalendar().
function summaryRow(e: CalendarEntry): string {
  return `| [${e.name}](#${e.luma_id}) | ${e.event_type} | ${formatDate(e.start_at)} | ${formatDate(e.promo_window_start)} | ${e.dri || '—'} | ${e.copy_status} | ${e.approval_status} |`
}

function copyExcerpt(draft: CopyDraft | undefined): string {
  if (!draft) return ''
  const excerpt = draft.content.slice(0, 100)
  const truncated = draft.content.length > 100 ? `${excerpt}…` : excerpt
  return ` *(${truncated})*`
}

function renderChannelPlanMd(moments: PromoMoment[], copyDrafts?: CopyDraft[]): string {
  if (moments.length === 0) return '*(No channel plan — fill in promo-rules.yaml)*'
  const rows = moments.map(m => {
    const draft = copyDrafts?.find(d => d.channel === m.channel)
    return `| ${m.channel} | ${m.dri || '—'} | ${formatDate(m.scheduled_at)} | ${m.label}${copyExcerpt(draft)} |`
  })
  return [
    '| Channel | DRI | Date | Moment |',
    '|---------|-----|------|--------|',
    ...rows,
  ].join('\n')
}

function detailBlock(e: CalendarEntry): string {
  return [
    `## ${e.name}`,
    '',
    `**Luma ID:** ${e.luma_id}`,
    `**Type:** ${e.event_type}`,
    `**Dates:** ${formatDate(e.start_at)} – ${formatDate(e.end_at)}`,
    `**Timezone:** ${e.timezone}`,
    `**Registration:** ${e.luma_url}`,
    e.meeting_url ? `**Meeting URL:** ${e.meeting_url}` : null,
    `**Promo Window Opens:** ${formatDate(e.promo_window_start)}`,
    `**DRI:** ${e.dri || '—'}`,
    `**Copy Status:** ${e.copy_status}`,
    `**Approval Status:** ${e.approval_status}`,
    '',
    '### Channel Plan',
    renderChannelPlanMd(e.channel_plan, e.copy_drafts),
    '',
    '### Notes',
    e.notes || '*(No description)*',
    '',
    '---',
  ].filter((line): line is string => line !== null).join('\n')
}

export function renderCalendar(entries: CalendarEntry[], syncedAt: string): string {
  const header = [
    '# WDAI Content Calendar',
    '',
    `> Last synced from Luma: ${formatDate(syncedAt)}`,
    '',
    '---',
    '',
    '## Upcoming Events',
    '',
    '| Event | Type | Start | Promo Window | DRI | Copy Status | Approval Status |',
    '|-------|------|-------|--------------|-----|-------------|-----------------|',
    ...entries.map(summaryRow),
    '',
    '---',
    '',
  ].join('\n')

  const details = entries.map(detailBlock).join('\n\n')

  return header + details + '\n'
}
