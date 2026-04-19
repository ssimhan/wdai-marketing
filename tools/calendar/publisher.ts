import { readEventCopy, writeCopyDraft } from './copy-store.js'
import type { CalendarEntry, CopyDraft, PromoChannel } from './types.js'

export interface PublishOptions {
  dryRun?: boolean
  channel?: PromoChannel
}

export interface PublishResult {
  published: number
  skipped: number
  errors: number
  dryRunPreviews?: string[]
}

async function publishToChannel(draft: CopyDraft): Promise<void> {
  const content = draft.revised_content ?? draft.content

  if (draft.channel === 'linkedin-wdai') {
    const token = process.env.LINKEDIN_ACCESS_TOKEN
    const orgId = process.env.LINKEDIN_ORGANIZATION_ID
    if (!token || !orgId) throw new Error('Missing LINKEDIN_ACCESS_TOKEN or LINKEDIN_ORGANIZATION_ID')
    const { postToLinkedIn } = await import('./linkedin-client.js')
    await postToLinkedIn(content, orgId, token)
    return
  }

  if (draft.channel === 'email') {
    const apiKey = process.env.MAILCHIMP_API_KEY
    const server = process.env.MAILCHIMP_SERVER_PREFIX
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID
    if (!apiKey || !server || !audienceId) {
      throw new Error('Missing MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX, or MAILCHIMP_AUDIENCE_ID')
    }
    const { createMailchimpDraft } = await import('./mailchimp-client.js')
    const subject = `[WDAI] ${draft.label}`
    await createMailchimpDraft(subject, content, audienceId, apiKey, server)
    return
  }

  throw new Error(`No publisher configured for channel: ${draft.channel}`)
}

export async function runPublish(
  event: CalendarEntry,
  promosDir: string,
  options: PublishOptions,
): Promise<PublishResult> {
  const allDrafts = readEventCopy(promosDir, event.luma_id)
  const candidates = allDrafts.filter((d) => {
    if (d.status !== 'approved') return false
    if (options.channel && d.channel !== options.channel) return false
    return true
  })
  const skipped = allDrafts.length - candidates.length

  if (options.dryRun) {
    const previews = candidates.map(
      (d) => `[DRY RUN] Would publish ${d.channel} for ${event.luma_id}: "${(d.revised_content ?? d.content).slice(0, 80)}..."`,
    )
    return { published: 0, skipped, errors: 0, dryRunPreviews: previews }
  }

  let published = 0
  let errors = 0

  for (const draft of candidates) {
    try {
      await publishToChannel(draft)
      writeCopyDraft(promosDir, {
        ...draft,
        status: 'published',
        published_at: new Date().toISOString(),
      })
      published++
    } catch (err) {
      console.error(`[publisher] Error publishing ${draft.channel} for ${event.luma_id}:`, err)
      errors++
    }
  }

  return { published, skipped, errors }
}

async function main() {
  const args = process.argv.slice(2)
  const eventIdx = args.indexOf('--event')
  const allFlag = args.includes('--all')
  const dryRun = args.includes('--dry-run')
  const channelIdx = args.indexOf('--channel')

  if (!allFlag && eventIdx === -1) {
    console.error('Usage: publisher.ts --event <luma_id> [--dry-run] [--channel <channel>]')
    console.error('       publisher.ts --all [--dry-run] [--channel <channel>]')
    process.exit(1)
  }

  const { config } = await import('dotenv')
  config()

  const { readFileSync, existsSync, readdirSync } = await import('fs')
  const path = await import('path')
  const { parse } = await import('yaml')

  const vaultDir = path.join(process.cwd(), 'vault')
  const calendarPath = path.join(vaultDir, '.calendar-snapshot.json')
  const promosDir = path.join(vaultDir, 'promos')

  if (!existsSync(calendarPath)) {
    console.error(`Calendar snapshot not found: ${calendarPath}`)
    console.error('Run npm run calendar:sync first.')
    process.exit(1)
  }

  const entries: CalendarEntry[] = JSON.parse(readFileSync(calendarPath, 'utf-8'))
  const channel = channelIdx !== -1 ? (args[channelIdx + 1] as PromoChannel) : undefined

  let targetEvents: CalendarEntry[]
  if (allFlag) {
    targetEvents = entries
  } else {
    const lumaId = args[eventIdx + 1]
    const found = entries.find((e) => e.luma_id === lumaId)
    if (!found) {
      console.error(`Event not found in calendar: ${lumaId}`)
      process.exit(1)
    }
    targetEvents = [found]
  }

  let totalPublished = 0
  let totalSkipped = 0
  let totalErrors = 0

  for (const event of targetEvents) {
    const result = await runPublish(event, promosDir, { dryRun, channel })
    totalPublished += result.published
    totalSkipped += result.skipped
    totalErrors += result.errors

    if (dryRun && result.dryRunPreviews?.length) {
      result.dryRunPreviews.forEach((p) => console.log(p))
    }
  }

  console.log(`\nPublish complete: ${totalPublished} published, ${totalSkipped} skipped, ${totalErrors} errors`)
  if (totalErrors > 0) process.exit(1)
}

if (process.argv[1]?.includes('publisher')) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
