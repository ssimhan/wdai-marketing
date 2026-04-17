import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs'
import path from 'path'
import { parse, stringify } from 'yaml'
import type { CopyDraft } from './types.js'

export function readEventCopy(promosDir: string, lumaId: string): CopyDraft[] {
  const eventDir = path.join(promosDir, lumaId)

  if (!existsSync(eventDir)) {
    return []
  }

  const drafts: CopyDraft[] = []
  const files = readdirSync(eventDir)

  for (const file of files) {
    if (!file.endsWith('.yaml') && !file.endsWith('.yml')) {
      continue
    }

    const filePath = path.join(eventDir, file)
    try {
      const content = readFileSync(filePath, 'utf-8')
      const draft = parse(content) as CopyDraft
      if (draft && draft.luma_id) {
        drafts.push(draft)
      }
    } catch (error) {
      console.warn(`[copy-store] Failed to parse ${file}: ${error}`)
    }
  }

  return drafts
}

export function writeCopyDraft(promosDir: string, draft: CopyDraft): void {
  const eventDir = path.join(promosDir, draft.luma_id)

  if (!existsSync(eventDir)) {
    mkdirSync(eventDir, { recursive: true })
  }

  const filePath = path.join(eventDir, `${draft.channel}.yaml`)
  const yaml = stringify(draft, { lineWidth: 0 })
  writeFileSync(filePath, yaml, 'utf-8')
}
