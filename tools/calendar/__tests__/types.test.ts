import { describe, it, expectTypeOf } from 'vitest'
import type { LumaEvent, CalendarEntry } from '../types.js'

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
})
