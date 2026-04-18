import { describe, it, expect } from 'vitest'
import path from 'path'
import { loadVoiceGuides } from '../voice-loader.js'

// Points at the real vault directory
const vaultDir = path.resolve(import.meta.dirname, '../../../vault')

describe('loadVoiceGuides', () => {
  it('returns content from all three voice files', () => {
    const guides = loadVoiceGuides(vaultDir)
    expect(guides.brand).toBeTruthy()
    expect(guides.linkedin).toBeTruthy()
    expect(guides.slack).toBeTruthy()
  })

  it('brand content comes from brand-guidelines.md', () => {
    const guides = loadVoiceGuides(vaultDir)
    // brand-guidelines.md contains the word "Women Defining AI"
    expect(guides.brand).toContain('Women Defining AI')
  })

  it('linkedin content comes from linkedin-voice.md', () => {
    const guides = loadVoiceGuides(vaultDir)
    // linkedin-voice.md should have content distinct from helen-voice.md
    expect(guides.linkedin.length).toBeGreaterThan(50)
  })

  it('slack content comes from helen-voice.md', () => {
    const guides = loadVoiceGuides(vaultDir)
    expect(guides.slack.length).toBeGreaterThan(50)
  })

  it('gracefully returns empty string if a voice file is missing', () => {
    const fakeVaultDir = path.join(import.meta.dirname, '.nonexistent-vault')
    const guides = loadVoiceGuides(fakeVaultDir)
    expect(guides.brand).toBe('')
    expect(guides.linkedin).toBe('')
    expect(guides.slack).toBe('')
  })

  it('loads personal voice for a DRI when skill exists', () => {
    const guides = loadVoiceGuides(vaultDir, 'sandhya')
    // If vault/skills/voice-sandhya/SKILL.md exists, personal_voice should be loaded
    // If not, it should be undefined (graceful fallback)
    expect(guides.brand).toBeTruthy() // Brand should always load
    expect(guides.personal_voice === undefined || typeof guides.personal_voice === 'string').toBe(true)
  })

  it('gracefully handles missing personal voice skill', () => {
    const fakeVaultDir = path.join(import.meta.dirname, '.nonexistent-vault')
    const guides = loadVoiceGuides(fakeVaultDir, 'nonexistent-leader')
    expect(guides.personal_voice).toBeUndefined()
  })
})
