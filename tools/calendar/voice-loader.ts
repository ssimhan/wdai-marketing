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

export function loadVoiceGuides(vaultDir: string): VoiceGuides {
  return {
    brand: readVoiceFile(path.join(vaultDir, 'brand-guidelines.md')),
    linkedin: readVoiceFile(path.join(vaultDir, 'linkedin-voice.md')),
    slack: readVoiceFile(path.join(vaultDir, 'helen-voice.md')),
  }
}
