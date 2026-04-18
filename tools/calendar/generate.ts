import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { readFileSync, existsSync } from 'fs'
import path from 'path'
import { parse } from 'yaml'
import { generateCopy } from './copy-generator.js'
import { readEventCopy, writeCopyDraft } from './copy-store.js'
import { loadVoiceGuides } from './voice-loader.js'
import { dispatchCopyReviews, type DriSlackMap } from './copy-review.js'
import type { CalendarEntry, PromoMoment, CopyDraft } from './types.js'

export interface GenerateOptions {
  dryRun?: boolean
  channel?: string
  model?: string
  notify?: boolean
  teamYamlPath?: string
}

export interface GenerateResult {
  generated: number
  skipped: number
  dryRunPreviews?: { moment: PromoMoment; reason: string }[]
}

export async function runGenerate(
  event: CalendarEntry,
  promosDir: string,
  options: GenerateOptions = {},
): Promise<GenerateResult> {
  const { dryRun = false, channel, model, notify = false, teamYamlPath } = options

  const existingDrafts = readEventCopy(promosDir, event.luma_id)
  const approvedChannels = new Set(
    existingDrafts.filter(d => d.status === 'approved' || d.status === 'published').map(d => d.channel),
  )

  let moments = event.channel_plan
  if (channel) {
    moments = moments.filter(m => m.channel === channel)
  }

  if (dryRun) {
    const previews = moments.map(m => ({
      moment: m,
      reason: approvedChannels.has(m.channel) ? 'skip (approved)' : 'would generate',
    }))
    return { generated: 0, skipped: 0, dryRunPreviews: previews }
  }

  // Load voice guides relative to the vault dir (one level up from promos)
  const vaultDir = path.resolve(promosDir, '..')
  const voiceGuides = loadVoiceGuides(vaultDir)

  let generated = 0
  let skipped = 0

  for (const moment of moments) {
    if (approvedChannels.has(moment.channel)) {
      skipped++
      continue
    }

    const draft = await generateCopy(event, moment, voiceGuides, model)
    writeCopyDraft(promosDir, draft)
    generated++
  }

  if (notify && !dryRun) {
    const botToken = process.env.SLACK_BOT_TOKEN ?? ''
    const driSlackMap = loadTeamMap(teamYamlPath)
    const allDrafts = readEventCopy(promosDir, event.luma_id)
    await dispatchCopyReviews(event, allDrafts, driSlackMap, botToken)
  }

  return { generated, skipped }
}

function loadTeamMap(yamlPath?: string): DriSlackMap {
  const filePath = yamlPath ?? path.join(import.meta.dirname, 'team.yaml')
  if (!existsSync(filePath)) {
    console.warn(`[calendar] team.yaml not found at ${filePath} — DM dispatch skipped`)
    return {}
  }
  const raw = parse(readFileSync(filePath, 'utf-8')) as { team?: DriSlackMap }
  return raw?.team ?? {}
}

// CLI entry point
async function main() {
  const args = process.argv.slice(2)

  const eventFlag = args.indexOf('--event')
  const allFlag = args.includes('--all')
  const dryRun = args.includes('--dry-run')
  const notify = args.includes('--notify')
  const channelFlag = args.indexOf('--channel')
  const modelFlag = args.indexOf('--model')

  const channel = channelFlag >= 0 ? args[channelFlag + 1] : undefined
  const model = modelFlag >= 0 ? args[modelFlag + 1] : undefined

  const SNAPSHOT_PATH = 'vault/.calendar-snapshot.json'
  const PROMOS_DIR = 'vault/promos'

  if (!existsSync(SNAPSHOT_PATH)) {
    console.error('No calendar snapshot found. Run `npm run calendar:sync` first.')
    process.exit(1)
  }

  const snapshot: CalendarEntry[] = JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf-8'))

  let events: CalendarEntry[] = []

  if (allFlag) {
    events = snapshot.filter(e => e.approval_status === 'approved')
  } else if (eventFlag >= 0) {
    const lumaId = args[eventFlag + 1]
    const event = snapshot.find(e => e.luma_id === lumaId)
    if (!event) {
      console.error(`Event not found in snapshot: ${lumaId}`)
      process.exit(1)
    }
    events = [event]
  } else {
    console.error('Usage: generate.ts --event <luma_id> | --all [--dry-run] [--channel <channel>] [--model <model>] [--notify]')
    process.exit(1)
  }

  let totalGenerated = 0
  let totalSkipped = 0

  for (const event of events) {
    console.log(`Generating copy for: ${event.name} (${event.luma_id})`)
    const result = await runGenerate(event, PROMOS_DIR, { dryRun, channel, model, notify })

    if (dryRun && result.dryRunPreviews) {
      for (const preview of result.dryRunPreviews) {
        console.log(`  [${preview.reason}] ${preview.moment.channel}: ${preview.moment.label}`)
      }
    } else {
      console.log(`  Generated: ${result.generated}, Skipped: ${result.skipped}`)
      totalGenerated += result.generated
      totalSkipped += result.skipped
    }
  }

  if (!dryRun) {
    console.log(`\nDone. Total generated: ${totalGenerated}, skipped: ${totalSkipped}`)
  }
}

// Only run main when invoked directly (not when imported in tests)
if (process.argv[1] && path.resolve(process.argv[1]).includes('generate')) {
  main().catch(err => {
    console.error('generate failed:', err.message)
    process.exit(1)
  })
}
