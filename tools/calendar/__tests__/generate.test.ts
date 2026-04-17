import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import type { CalendarEntry, CopyDraft, PromoMoment } from '../types.js'

// We test the generate logic (not the CLI process), so we'll import a
// testable `runGenerate` function rather than the CLI entry point.

const testVaultDir = path.join(import.meta.dirname, '.generate-test-vault')

const mockMoment = (channel: PromoMoment['channel']): PromoMoment => ({
  channel,
  dri: 'Sandhya',
  scheduled_at: '2026-04-20T17:00:00Z',
  label: `Post on ${channel}`,
})

const mockEntry: CalendarEntry = {
  luma_id: 'evt-001',
  name: 'AI Basics W27',
  event_type: 'ai-basics',
  start_at: '2026-05-04T17:00:00Z',
  end_at: '2026-06-13T18:00:00Z',
  timezone: 'America/New_York',
  luma_url: 'https://lu.ma/ai-basics-w27',
  meeting_url: null,
  visibility: 'public',
  tags: ['ai-basics'],
  promo_window_start: '2026-04-20T17:00:00Z',
  dri: 'Sandhya',
  copy_status: '🔲 Not started',
  approval_status: 'approved',
  channel_plan: [mockMoment('linkedin-wdai'), mockMoment('slack')],
  notes: '',
}

// Mock copy-generator to avoid real API calls
vi.mock('../copy-generator.js', () => ({
  generateCopy: vi.fn().mockImplementation(
    (event: CalendarEntry, moment: PromoMoment) =>
      Promise.resolve<CopyDraft>({
        luma_id: event.luma_id,
        channel: moment.channel,
        label: moment.label,
        content: `Generated copy for ${moment.channel}`,
        status: 'draft',
        generated_at: '2026-04-16T12:00:00Z',
        generated_by: 'claude',
      }),
  ),
}))

beforeEach(() => {
  fs.mkdirSync(testVaultDir, { recursive: true })
})

afterEach(() => {
  fs.rmSync(testVaultDir, { recursive: true, force: true })
  vi.clearAllMocks()
})

describe('runGenerate', () => {
  it('generates copy for all moments in channel_plan', async () => {
    const { runGenerate } = await import('../generate.js')
    const result = await runGenerate(mockEntry, testVaultDir)

    expect(result.generated).toBe(2)
    expect(result.skipped).toBe(0)
  })

  it('writes draft files to vault/promos/<luma_id>/<channel>.yaml', async () => {
    const { runGenerate } = await import('../generate.js')
    await runGenerate(mockEntry, testVaultDir)

    const linkedinPath = path.join(testVaultDir, 'evt-001', 'linkedin-wdai.yaml')
    const slackPath = path.join(testVaultDir, 'evt-001', 'slack.yaml')
    expect(fs.existsSync(linkedinPath)).toBe(true)
    expect(fs.existsSync(slackPath)).toBe(true)
  })

  it('skips moments with existing approved copy', async () => {
    // Pre-write an approved draft for linkedin-wdai
    const approvedDraft: CopyDraft = {
      luma_id: 'evt-001',
      channel: 'linkedin-wdai',
      label: 'Announce open enrollment',
      content: 'Already approved copy',
      status: 'approved',
      generated_at: '2026-04-15T00:00:00Z',
      generated_by: 'claude',
    }
    const { writeCopyDraft } = await import('../copy-store.js')
    writeCopyDraft(testVaultDir, approvedDraft)

    const { runGenerate } = await import('../generate.js')
    const result = await runGenerate(mockEntry, testVaultDir)

    expect(result.generated).toBe(1)  // only slack
    expect(result.skipped).toBe(1)    // linkedin-wdai already approved
  })

  it('dry-run mode does not call API or write files', async () => {
    const { generateCopy } = await import('../copy-generator.js')
    const { runGenerate } = await import('../generate.js')
    const result = await runGenerate(mockEntry, testVaultDir, { dryRun: true })

    expect(generateCopy).not.toHaveBeenCalled()
    expect(result.generated).toBe(0)
    expect(result.dryRunPreviews).toHaveLength(2)

    const linkedinPath = path.join(testVaultDir, 'evt-001', 'linkedin-wdai.yaml')
    expect(fs.existsSync(linkedinPath)).toBe(false)
  })

  it('channel filter restricts generation to that channel', async () => {
    const { runGenerate } = await import('../generate.js')
    const result = await runGenerate(mockEntry, testVaultDir, { channel: 'slack' })

    expect(result.generated).toBe(1)
    const linkedinPath = path.join(testVaultDir, 'evt-001', 'linkedin-wdai.yaml')
    const slackPath = path.join(testVaultDir, 'evt-001', 'slack.yaml')
    expect(fs.existsSync(linkedinPath)).toBe(false)
    expect(fs.existsSync(slackPath)).toBe(true)
  })
})
