import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs'
import path from 'path'
import { parse, stringify } from 'yaml'
import type { PromoStatus } from './types.js'

export function readAllStatuses(dirPath: string): Map<string, PromoStatus> {
  const statuses = new Map<string, PromoStatus>()

  if (!existsSync(dirPath)) {
    return statuses
  }

  const files = readdirSync(dirPath)

  for (const file of files) {
    if (!file.endsWith('.yaml') && !file.endsWith('.yml')) {
      continue
    }

    const filePath = path.join(dirPath, file)
    try {
      const content = readFileSync(filePath, 'utf-8')
      const status = parse(content) as PromoStatus

      if (status && status.luma_id) {
        statuses.set(status.luma_id, status)
      }
    } catch (error) {
      console.warn(`[calendar] Failed to parse ${file}: ${error}`)
    }
  }

  return statuses
}

export function writeStatus(dirPath: string, status: PromoStatus): void {
  // Create directory if it doesn't exist
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
  }

  const filePath = path.join(dirPath, `${status.luma_id}.yaml`)
  const yaml = stringify(status, { lineWidth: 0 })
  writeFileSync(filePath, yaml, 'utf-8')
}
