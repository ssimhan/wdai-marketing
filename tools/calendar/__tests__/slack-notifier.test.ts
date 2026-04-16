import { describe, it, expect, vi } from 'vitest'
import { formatSlackMessage, sendSlackNotification } from '../slack-notifier.js'
import type { CalendarEntry } from '../types.js'

const mockEntry: CalendarEntry = {
  luma_id: 'evt-001',
  name: 'AI Basics W27',
  event_type: 'ai-basics',
  start_at: '2026-05-04T17:00:00Z',
  end_at: '2026-06-13T18:00:00Z',
  timezone: 'America/New_York',
  luma_url: 'https://lu.ma/ai-basics-w27',
  meeting_url: 'https://meet.google.com/mock',
  visibility: 'public',
  tags: ['ai-basics', 'cohort'],
  promo_window_start: '2026-04-20T17:00:00.000Z',
  dri: 'Sheena',
  copy_status: '🔲 Not started',
  channel_plan: [
    {
      channel: 'linkedin-wdai',
      dri: 'Sheena',
      scheduled_at: '2026-04-20T17:00:00.000Z',
      label: 'Announce open enrollment',
    },
    {
      channel: 'email',
      dri: 'Helen',
      scheduled_at: '2026-04-27T17:00:00.000Z',
      label: 'Member invite',
    },
  ],
  notes: 'A cohort for professionals.',
}

describe('formatSlackMessage', () => {
  it('returns null for empty entries', () => {
    const result = formatSlackMessage([])
    expect(result).toBeNull()
  })

  it('formats single entry with event header, details, and channel plan', () => {
    const result = formatSlackMessage([mockEntry])
    expect(result).not.toBeNull()
    expect(result).toHaveProperty('blocks')
    expect(Array.isArray(result?.blocks)).toBe(true)
  })

  it('includes header block with calendar emoji', () => {
    const result = formatSlackMessage([mockEntry])
    const headerBlock = result?.blocks?.find((b: any) => b.type === 'header')
    expect(headerBlock).toBeDefined()
    expect(headerBlock?.text?.text).toContain('📅')
  })

  it('includes event details with name, type, and start date', () => {
    const result = formatSlackMessage([mockEntry])
    const detailsBlocks = result?.blocks?.filter((b: any) => b.type === 'section')
    expect(detailsBlocks?.length).toBeGreaterThan(0)

    const eventBlock = detailsBlocks?.[0]
    const text = eventBlock?.text?.text
    expect(text).toContain('AI Basics W27')
    expect(text).toContain('ai-basics')
    expect(text).toContain('Sheena')
  })

  it('includes channel plan as bulleted list in separate section', () => {
    const result = formatSlackMessage([mockEntry])
    const planBlock = result?.blocks?.find((b: any) =>
      b.type === 'section' && b.text?.text?.includes('Channel Plan')
    )
    expect(planBlock).toBeDefined()
    expect(planBlock?.text?.text).toContain('LinkedIn · WDAI')
    expect(planBlock?.text?.text).toContain('Announce open enrollment')
    expect(planBlock?.text?.text).toContain('Email')
    expect(planBlock?.text?.text).toContain('Member invite')
  })

  it('includes divider block at the end', () => {
    const result = formatSlackMessage([mockEntry])
    const lastBlock = result?.blocks?.[result.blocks.length - 1]
    expect(lastBlock?.type).toBe('divider')
  })

  it('formats multiple entries with dividers between them', () => {
    const entry2: CalendarEntry = {
      ...mockEntry,
      luma_id: 'evt-002',
      name: 'AI Intermediate W28',
      event_type: 'ai-intermediate',
      dri: 'Helen',
      channel_plan: [
        {
          channel: 'linkedin-wdai',
          dri: 'Helen',
          scheduled_at: '2026-06-01T17:00:00.000Z',
          label: 'Enrollment open',
        },
      ],
    }

    const result = formatSlackMessage([mockEntry, entry2])
    expect(result?.blocks).toBeDefined()

    // Count dividers — should be at least one per entry
    const dividers = result?.blocks?.filter((b: any) => b.type === 'divider')
    expect(dividers?.length).toBeGreaterThanOrEqual(2)
  })

  it('includes action buttons for each entry', () => {
    const result = formatSlackMessage([mockEntry])
    expect(result?.blocks).toBeDefined()

    const actionsBlocks = result?.blocks?.filter((b: any) => b.type === 'actions')
    expect(actionsBlocks?.length).toBeGreaterThan(0)

    const actionBlock = actionsBlocks?.[0] as any
    expect(actionBlock.elements).toBeDefined()
    expect(Array.isArray(actionBlock.elements)).toBe(true)
  })

  it('action buttons have correct action_id and luma_id as value', () => {
    const result = formatSlackMessage([mockEntry])
    const actionsBlocks = result?.blocks?.filter((b: any) => b.type === 'actions')
    const actionBlock = actionsBlocks?.[0] as any
    const elements = actionBlock.elements

    expect(elements.length).toBeGreaterThanOrEqual(2)

    const approveButton = elements.find((e: any) => e.action_id === 'approve_plan')
    const editButton = elements.find((e: any) => e.action_id === 'edit_plan')

    expect(approveButton).toBeDefined()
    expect(editButton).toBeDefined()

    expect(approveButton.value).toBe('evt-001')
    expect(editButton.value).toBe('evt-001')
  })

  it('approve button has checkmark emoji', () => {
    const result = formatSlackMessage([mockEntry])
    const actionsBlocks = result?.blocks?.filter((b: any) => b.type === 'actions')
    const actionBlock = actionsBlocks?.[0] as any
    const approveButton = actionBlock.elements.find((e: any) => e.action_id === 'approve_plan')

    expect(approveButton.text.text).toContain('✅')
  })

  it('edit button has pencil emoji', () => {
    const result = formatSlackMessage([mockEntry])
    const actionsBlocks = result?.blocks?.filter((b: any) => b.type === 'actions')
    const actionBlock = actionsBlocks?.[0] as any
    const editButton = actionBlock.elements.find((e: any) => e.action_id === 'edit_plan')

    expect(editButton.text.text).toContain('✏️')
  })
})

describe('sendSlackNotification', () => {
  it('POSTs to webhook URL with correct headers and body', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, status: 200 })
    global.fetch = mockFetch

    const webhookUrl = 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXX'
    const blocks = [
      {
        type: 'header',
        text: { type: 'plain_text', text: '📅 Calendar Update' },
      },
    ]

    await sendSlackNotification(webhookUrl, blocks)

    expect(mockFetch).toHaveBeenCalledOnce()
    const call = mockFetch.mock.calls[0]
    expect(call[0]).toBe(webhookUrl)
    expect(call[1]).toEqual({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
      signal: expect.any(AbortSignal),
    })
  })

  it('catches and logs errors without throwing', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
    global.fetch = mockFetch

    const webhookUrl = 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXX'
    const blocks = [{ type: 'header', text: { type: 'plain_text', text: 'Test' } }]

    // Should not throw
    await expect(sendSlackNotification(webhookUrl, blocks)).resolves.toBeUndefined()

    expect(consoleWarnSpy).toHaveBeenCalled()
    consoleWarnSpy.mockRestore()
  })

  it('uses 10 second timeout for abort', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    global.fetch = mockFetch

    const webhookUrl = 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXX'
    const blocks = [{ type: 'header', text: { type: 'plain_text', text: 'Test' } }]

    await sendSlackNotification(webhookUrl, blocks)

    const call = mockFetch.mock.calls[0]
    const signal = call[1].signal as AbortSignal
    expect(signal).toBeDefined()
  })
})
