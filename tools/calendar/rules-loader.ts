import { readFileSync, existsSync } from 'fs'
import { parse } from 'yaml'
import type { PromoRules, OverridesMap } from './types.js'

export function loadPromoRules(path: string): PromoRules {
  if (!existsSync(path)) {
    console.warn(`[calendar] promo-rules not found at ${path} — using defaults`)
    return {}
  }
  const raw = parse(readFileSync(path, 'utf-8')) as { event_types?: PromoRules }
  return raw?.event_types ?? {}
}

export function loadOverrides(path: string): OverridesMap {
  if (!existsSync(path)) {
    console.warn(`[calendar] overrides not found at ${path} — no overrides applied`)
    return {}
  }
  const raw = parse(readFileSync(path, 'utf-8')) as { overrides?: OverridesMap }
  return raw?.overrides ?? {}
}
