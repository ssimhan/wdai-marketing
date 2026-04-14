import { describe, it, expectTypeOf } from 'vitest'
import type { LumaEvent, CalendarEntry, PromoMoment, PromoRules, OverridesMap } from '../types.js'

describe('types', () => {
  it('LumaEvent has required fields', () => {
    expectTypeOf<LumaEvent>().toHaveProperty('api_id')
    expectTypeOf<LumaEvent>().toHaveProperty('event')
    expectTypeOf<LumaEvent>().toHaveProperty('tags')
  })

  it('CalendarEntry has WDAI-added fields', () => {
    expectTypeOf<CalendarEntry>().toHaveProperty('promo_window_start')
    expectTypeOf<CalendarEntry>().toHaveProperty('copy_status')
    expectTypeOf<CalendarEntry>().toHaveProperty('dri')
  })

  it('PromoMoment has required fields', () => {
    expectTypeOf<PromoMoment>().toHaveProperty('channel')
    expectTypeOf<PromoMoment>().toHaveProperty('scheduled_at')
    expectTypeOf<PromoMoment>().toHaveProperty('label')
  })

  it('PromoRules is a partial record of event type rules', () => {
    expectTypeOf<PromoRules>().not.toBeNull()
  })

  it('OverridesMap is a record keyed by luma_id', () => {
    expectTypeOf<OverridesMap>().not.toBeNull()
  })
})
