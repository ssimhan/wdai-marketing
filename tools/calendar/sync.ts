import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()
import { writeFileSync } from 'fs'
import { fetchAllEvents } from './luma-client.js'
import { mapLumaEvent } from './mapper.js'
import { renderCalendar } from './writer.js'
import { renderCalendarHtml } from './html-writer.js'
import { loadPromoRules, loadOverrides } from './rules-loader.js'

const MD_PATH        = 'vault/content-calendar.md'
const HTML_PATH      = 'vault/content-calendar.html'
const RULES_PATH     = 'tools/calendar/promo-rules.yaml'
const OVERRIDES_PATH = 'tools/calendar/overrides.yaml'

async function main() {
  const isMock = process.env.LUMA_MOCK === 'true'
  console.log(`Running calendar sync (${isMock ? 'mock' : 'live'} mode)...`)

  const [rawEvents, rules, overrides] = await Promise.all([
    fetchAllEvents(),
    Promise.resolve(loadPromoRules(RULES_PATH)),
    Promise.resolve(loadOverrides(OVERRIDES_PATH)),
  ])
  console.log(`  Fetched ${rawEvents.length} events from Luma`)

  const syncedAt = new Date().toISOString()
  const entries  = rawEvents.map(e => mapLumaEvent(e, rules, overrides))

  writeFileSync(MD_PATH,   renderCalendar(entries, syncedAt),     'utf-8')
  writeFileSync(HTML_PATH, renderCalendarHtml(entries, syncedAt), 'utf-8')

  console.log(`  Written to ${MD_PATH}`)
  console.log(`  Written to ${HTML_PATH}`)
  console.log('Done.')
}

main().catch(err => {
  console.error('Calendar sync failed:', err.message)
  process.exit(1)
})
