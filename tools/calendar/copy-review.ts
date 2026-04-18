import type { CalendarEntry, CopyDraft } from './types.js'
import { sendCopyReviewDM, formatCopyReviewMessage } from './slack-dm.js'
import { getMoment } from './slack-utils.js'

export type DriSlackMap = Record<string, string>

export async function dispatchCopyReviews(
  event: CalendarEntry,
  drafts: CopyDraft[],
  driSlackMap: DriSlackMap,
  botToken: string,
): Promise<void> {
  if (!botToken) {
    console.warn('[calendar] SLACK_BOT_TOKEN not set — skipping copy review DMs')
    return
  }

  const pending = drafts.filter(d => d.status !== 'approved' && d.status !== 'published')

  for (const draft of pending) {
    // Look up DRI from the matching moment in channel_plan (not event-level DRI)
    const moment = getMoment(event, draft.channel)
    const dri = moment?.dri ?? event.dri

    const userId = driSlackMap[dri]
    if (!userId) {
      console.warn(`[calendar] No Slack user ID for DRI "${dri}" — skipping DM for ${draft.channel}`)
      continue
    }

    const { blocks } = formatCopyReviewMessage(event, draft)
    await sendCopyReviewDM(botToken, userId, blocks)
  }
}
