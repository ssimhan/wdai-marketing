import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { CalendarEntry, CopyDraft } from '../types.js'

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
  tags: [],
  promo_window_start: '2026-04-20T17:00:00Z',
  dri: 'Sheena',
  copy_status: '🟡 In progress',
  approval_status: 'approved',
  channel_plan: [
    { channel: 'linkedin-wdai', dri: 'Sheena', scheduled_at: '2026-04-20T17:00:00Z', label: 'Announce open enrollment' },
    { channel: 'slack', dri: 'Helen', scheduled_at: '2026-04-18T17:00:00Z', label: 'Slack promo' },
  ],
  notes: '',
}

const pendingDraft = (channel: CopyDraft['channel']): CopyDraft => ({
  luma_id: 'evt-001',
  channel,
  label: 'Announce open enrollment',
  content: `Draft copy for ${channel}`,
  status: 'draft',
  generated_at: '2026-04-18T12:00:00Z',
  generated_by: 'claude',
})

const approvedDraft: CopyDraft = {
  ...pendingDraft('linkedin-wdai'),
  status: 'approved',
}

vi.mock('../slack-dm.js', () => ({
  sendCopyReviewDM: vi.fn().mockResolvedValue(undefined),
  formatCopyReviewMessage: vi.fn().mockReturnValue({ blocks: [] }),
}))

describe('dispatchCopyReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sends a DM for each pending draft', async () => {
    const { dispatchCopyReviews } = await import('../copy-review.js')
    const { sendCopyReviewDM } = await import('../slack-dm.js')

    const driSlackMap = { Sheena: 'U111', Helen: 'U222' }
    const drafts = [pendingDraft('linkedin-wdai'), pendingDraft('slack')]

    await dispatchCopyReviews(mockEntry, drafts, driSlackMap, 'xoxb-token')

    expect(sendCopyReviewDM).toHaveBeenCalledTimes(2)
  })

  it('skips already-approved drafts', async () => {
    const { dispatchCopyReviews } = await import('../copy-review.js')
    const { sendCopyReviewDM } = await import('../slack-dm.js')

    const driSlackMap = { Sheena: 'U111', Helen: 'U222' }
    const drafts = [approvedDraft, pendingDraft('slack')]

    await dispatchCopyReviews(mockEntry, drafts, driSlackMap, 'xoxb-token')

    expect(sendCopyReviewDM).toHaveBeenCalledTimes(1)
  })

  it('logs warning if DRI not found in team map', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { dispatchCopyReviews } = await import('../copy-review.js')
    const { sendCopyReviewDM } = await import('../slack-dm.js')

    // Sheena not in map
    const driSlackMap = { Helen: 'U222' }
    const drafts = [pendingDraft('linkedin-wdai')]

    await dispatchCopyReviews(mockEntry, drafts, driSlackMap, 'xoxb-token')

    expect(sendCopyReviewDM).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Sheena'))
    warnSpy.mockRestore()
  })

  it('sends DM to moment DRI, not event DRI', async () => {
    const { dispatchCopyReviews } = await import('../copy-review.js')
    const { sendCopyReviewDM } = await import('../slack-dm.js')

    // event.dri is Sheena, but slack moment dri is Helen
    const driSlackMap = { Sheena: 'U111', Helen: 'U222' }
    const drafts = [pendingDraft('slack')]

    await dispatchCopyReviews(mockEntry, drafts, driSlackMap, 'xoxb-token')

    expect(sendCopyReviewDM).toHaveBeenCalledWith('xoxb-token', 'U222', expect.any(Array))
  })

  it('does nothing and warns if botToken is missing', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { dispatchCopyReviews } = await import('../copy-review.js')
    const { sendCopyReviewDM } = await import('../slack-dm.js')

    const driSlackMap = { Sheena: 'U111' }
    const drafts = [pendingDraft('linkedin-wdai')]

    await dispatchCopyReviews(mockEntry, drafts, driSlackMap, '')

    expect(sendCopyReviewDM).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('SLACK_BOT_TOKEN'))
    warnSpy.mockRestore()
  })
})
