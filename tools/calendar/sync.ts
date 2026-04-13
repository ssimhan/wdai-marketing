import 'dotenv/config'
import { writeFileSync } from 'fs'
import { fetchAllEvents } from './luma-client.js'
import { mapLumaEvent } from './mapper.js'
import { renderCalendar } from './writer.js'

const OUTPUT_PATH = 'vault/content-calendar.md'

async function main() {
  const isMock = process.env.LUMA_MOCK === 'true'
  console.log(`Running calendar sync (${isMock ? 'mock' : 'live'} mode)...`)

  const rawEvents = await fetchAllEvents()
  console.log(`  Fetched ${rawEvents.length} events from Luma`)

  const entries = rawEvents.map(mapLumaEvent)
  const markdown = renderCalendar(entries, new Date().toISOString())

  writeFileSync(OUTPUT_PATH, markdown, 'utf-8')
  console.log(`  Written to ${OUTPUT_PATH}`)
  console.log('Done.')
}

main().catch(err => {
  console.error('Calendar sync failed:', err.message)
  process.exit(1)
})
