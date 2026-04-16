import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { fetchAllEvents } from './luma-client.js'
import { mapLumaEvent } from './mapper.js'
import { renderCalendar } from './writer.js'
import { renderCalendarHtml } from './html-writer.js'
import { loadPromoRules, loadOverrides } from './rules-loader.js'
import { detectChanges } from './diff.js'
import { formatSlackMessage, sendSlackNotification } from './slack-notifier.js'
import type { CalendarEntry } from './types.js'

const MD_PATH              = 'vault/content-calendar.md'
const HTML_PATH            = 'vault/content-calendar.html'
const SNAPSHOT_PATH        = 'vault/.calendar-snapshot.json'
const RULES_PATH           = 'tools/calendar/promo-rules.yaml'
const OVERRIDES_PATH       = 'tools/calendar/overrides.yaml'

async function main() {
  const isMock = process.env.LUMA_MOCK === 'true'
  console.log(`Running calendar sync (${isMock ? 'mock' : 'live'} mode)...`)

  const rawEvents = await fetchAllEvents()
  const rules     = loadPromoRules(RULES_PATH)
  const overrides = loadOverrides(OVERRIDES_PATH)
  console.log(`  Fetched ${rawEvents.length} events from Luma`)

  const syncedAt = new Date().toISOString()
  const entries  = rawEvents.map(e => mapLumaEvent(e, rules, overrides))

  // Load previous snapshot for change detection
  const previousEntries = loadSnapshot()
  const changes = detectChanges(previousEntries, entries)

  // Write calendar files
  writeFileSync(MD_PATH,   renderCalendar(entries, syncedAt),     'utf-8')
  writeFileSync(HTML_PATH, renderCalendarHtml(entries, syncedAt), 'utf-8')
  saveSnapshot(entries)

  console.log(`  Written to ${MD_PATH}`)
  console.log(`  Written to ${HTML_PATH}`)

  // Send Slack notification if there are changes
  if ((changes.added.length > 0 || changes.changed.length > 0) && !isMock) {
    const message = formatSlackMessage([...changes.added, ...changes.changed])
    if (message) {
      const webhookUrl = process.env.SLACK_WEBHOOK_URL
      if (webhookUrl) {
        await sendSlackNotification(webhookUrl, message.blocks)
        console.log(
          `  Sent Slack notification (${changes.added.length} added, ${changes.changed.length} changed)`,
        )
      }
    }
  }

  console.log('Done.')
}

function loadSnapshot(): CalendarEntry[] {
  if (!existsSync(SNAPSHOT_PATH)) {
    return []
  }
  try {
    const content = readFileSync(SNAPSHOT_PATH, 'utf-8')
    return JSON.parse(content) as CalendarEntry[]
  } catch (error) {
    console.warn(`[calendar] Failed to load snapshot: ${error}`)
    return []
  }
}

function saveSnapshot(entries: CalendarEntry[]): void {
  try {
    writeFileSync(SNAPSHOT_PATH, JSON.stringify(entries, null, 2), 'utf-8')
  } catch (error) {
    console.warn(`[calendar] Failed to save snapshot: ${error}`)
  }
}

main().catch(err => {
  console.error('Calendar sync failed:', err.message)
  process.exit(1)
})
