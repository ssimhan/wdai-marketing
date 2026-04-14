import { readFileSync, existsSync } from 'fs'
import { parse } from 'yaml'
import type { PromoRules, OverridesMap } from './types.js'

function loadYaml<T>(path: string, missingMsg: string): T | null {
  if (!existsSync(path)) {
    console.warn(`[calendar] ${missingMsg}`)
    return null
  }
  return parse(readFileSync(path, 'utf-8')) as T
}

export function loadPromoRules(path: string): PromoRules {
  const raw = loadYaml<{ event_types?: PromoRules }>(
    path,
    `promo-rules not found at ${path} — using defaults`,
  )
  return raw?.event_types ?? {}
}

export function loadOverrides(path: string): OverridesMap {
  const raw = loadYaml<{ overrides?: OverridesMap }>(
    path,
    `overrides not found at ${path} — no overrides applied`,
  )
  return raw?.overrides ?? {}
}
