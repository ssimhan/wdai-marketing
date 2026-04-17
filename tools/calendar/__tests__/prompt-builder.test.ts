import { describe, it, expect } from 'vitest'
import { buildPrompt } from '../prompt-builder.js'
import type { CalendarEntry, PromoMoment, VoiceGuides } from '../types.js'

const mockEntry: CalendarEntry = {
  luma_id: 'evt-001',
  name: 'AI Basics W27 — Cohort Launch',
  event_type: 'ai-basics',
  start_at: '2026-05-04T17:00:00Z',
  end_at: '2026-06-13T18:00:00Z',
  timezone: 'America/New_York',
  luma_url: 'https://lu.ma/ai-basics-w27',
  meeting_url: 'https://meet.google.com/mock',
  visibility: 'public',
  tags: ['ai-basics'],
  promo_window_start: '2026-04-20T17:00:00Z',
  dri: 'Sandhya',
  copy_status: '🔲 Not started',
  approval_status: 'pending',
  channel_plan: [],
  notes: 'A cohort for professionals.',
}

const mockGuides: VoiceGuides = {
  brand: 'BRAND GUIDELINES CONTENT',
  linkedin: 'LINKEDIN VOICE CONTENT',
  slack: 'HELEN SLACK VOICE CONTENT',
}

const linkedinMoment: PromoMoment = {
  channel: 'linkedin-wdai',
  dri: 'Sandhya',
  scheduled_at: '2026-04-20T17:00:00Z',
  label: 'Announce open enrollment',
}

const slackMoment: PromoMoment = {
  channel: 'slack',
  dri: 'Sandhya',
  scheduled_at: '2026-04-24T17:00:00Z',
  label: 'Enrollment announcement in #general',
}

const emailMoment: PromoMoment = {
  channel: 'email',
  dri: 'Sandhya',
  scheduled_at: '2026-04-27T17:00:00Z',
  label: 'Email outreach to prior cohort',
}

describe('buildPrompt', () => {
  it('returns system and user prompts', () => {
    const prompt = buildPrompt(mockEntry, linkedinMoment, mockGuides)
    expect(prompt.system).toBeTruthy()
    expect(prompt.user).toBeTruthy()
  })

  it('LinkedIn prompt includes brand guidelines and linkedin voice', () => {
    const prompt = buildPrompt(mockEntry, linkedinMoment, mockGuides)
    expect(prompt.system).toContain('BRAND GUIDELINES CONTENT')
    expect(prompt.system).toContain('LINKEDIN VOICE CONTENT')
    expect(prompt.system).not.toContain('HELEN SLACK VOICE CONTENT')
  })

  it('linkedin-personal prompt also uses linkedin voice guide', () => {
    const moment: PromoMoment = { ...linkedinMoment, channel: 'linkedin-personal' }
    const prompt = buildPrompt(mockEntry, moment, mockGuides)
    expect(prompt.system).toContain('LINKEDIN VOICE CONTENT')
    expect(prompt.system).not.toContain('HELEN SLACK VOICE CONTENT')
  })

  it('Slack prompt includes brand guidelines and helen voice, not linkedin', () => {
    const prompt = buildPrompt(mockEntry, slackMoment, mockGuides)
    expect(prompt.system).toContain('BRAND GUIDELINES CONTENT')
    expect(prompt.system).toContain('HELEN SLACK VOICE CONTENT')
    expect(prompt.system).not.toContain('LINKEDIN VOICE CONTENT')
  })

  it('Email prompt includes brand guidelines but no channel-specific voice', () => {
    const prompt = buildPrompt(mockEntry, emailMoment, mockGuides)
    expect(prompt.system).toContain('BRAND GUIDELINES CONTENT')
    expect(prompt.system).not.toContain('LINKEDIN VOICE CONTENT')
    expect(prompt.system).not.toContain('HELEN SLACK VOICE CONTENT')
  })

  it('user prompt includes event name and registration URL', () => {
    const prompt = buildPrompt(mockEntry, linkedinMoment, mockGuides)
    expect(prompt.user).toContain('AI Basics W27')
    expect(prompt.user).toContain('https://lu.ma/ai-basics-w27')
  })

  it('user prompt includes moment label and channel', () => {
    const prompt = buildPrompt(mockEntry, linkedinMoment, mockGuides)
    expect(prompt.user).toContain('Announce open enrollment')
    expect(prompt.user).toContain('linkedin-wdai')
  })

  it('user prompt ends with instruction to output just the copy', () => {
    const prompt = buildPrompt(mockEntry, linkedinMoment, mockGuides)
    expect(prompt.user).toContain('Output just the post copy')
  })
})
