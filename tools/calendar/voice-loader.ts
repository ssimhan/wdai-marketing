import { readFileSync, existsSync } from 'fs'
import path from 'path'
import type { VoiceGuides } from './types.js'

function readVoiceFile(filePath: string): string {
  if (!existsSync(filePath)) {
    console.warn(`[voice-loader] Voice file not found: ${filePath}`)
    return ''
  }
  try {
    return readFileSync(filePath, 'utf-8')
  } catch (error) {
    console.warn(`[voice-loader] Failed to read ${filePath}: ${error}`)
    return ''
  }
}

export function loadVoiceGuides(vaultDir: string, dri?: string): VoiceGuides {
  const guides: VoiceGuides = {
    brand: readVoiceFile(path.join(vaultDir, 'brand-guidelines.md')),
    linkedin: readVoiceFile(path.join(vaultDir, 'linkedin-voice.md')),
    slack: readVoiceFile(path.join(vaultDir, 'helen-voice.md')),
  }

  // Load DRI's personal voice skill if available (e.g., vault/skills/voice-helen/SKILL.md)
  if (dri) {
    const driLower = dri.toLowerCase()
    const personalVoicePath = path.join(vaultDir, 'skills', `voice-${driLower}`, 'SKILL.md')
    const personalVoice = readVoiceFile(personalVoicePath)
    if (personalVoice) {
      guides.personal_voice = personalVoice
    }
  }

  return guides
}
