// Luma API response shape (from public-api.luma.com)
export interface LumaEvent {
  api_id: string
  event: {
    api_id: string
    name: string
    description_md: string | null
    start_at: string        // ISO 8601
    end_at: string          // ISO 8601
    timezone: string        // IANA e.g. "America/New_York"
    slug: string
    url: string
    cover_url: string | null
    meeting_url: string | null
    visibility: 'public' | 'private' | 'members-only'
    geo_address_json: Record<string, unknown> | null
  }
  tags: string[]
}

export interface LumaListResponse {
  entries: LumaEvent[]
  has_more: boolean
  next_cursor: string | null
}

// WDAI content calendar entry (Luma-derived + WDAI-added fields)
export type EventType =
  | 'ai-basics'
  | 'ai-intermediate'
  | 'ai-advanced'
  | 'show-dont-tell'
  | 'she-builds'
  | 'speaker-event'
  | 'other'

export type CopyStatus =
  | '🔲 Not started'
  | '🟡 In progress'
  | '✅ Approved'
  | '📤 Sent'

export interface CalendarEntry {
  // From Luma
  luma_id: string
  name: string
  event_type: EventType
  start_at: string          // ISO 8601
  end_at: string            // ISO 8601
  timezone: string
  luma_url: string
  meeting_url: string | null
  visibility: string
  tags: string[]

  // WDAI-added (computed or manually set)
  promo_window_start: string  // ISO 8601 — default: start_at minus 14 days
  dri: string                 // Directly Responsible Individual — default: ""
  copy_status: CopyStatus
  channel_plan: string        // Free text; populated by promo planner in Phase 4
  notes: string               // From Luma description_md, truncated
}
