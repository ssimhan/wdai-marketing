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

export type CopyDraftStatus = 'draft' | 'pending_review' | 'approved' | 'published'

export interface CopyDraft {
  luma_id: string
  channel: PromoChannel
  label: string           // from PromoMoment.label
  content: string         // the generated copy text
  status: CopyDraftStatus
  generated_at: string    // ISO 8601
  generated_by: string    // 'claude' or 'manual'
  approved_by?: string
  approved_at?: string
  revised_content?: string  // if leader edits before approving
}

export type PromoChannel =
  | 'linkedin-wdai'
  | 'linkedin-personal'
  | 'email'
  | 'slack'

export interface PromoMoment {
  channel: PromoChannel
  dri: string           // who posts/sends this
  scheduled_at: string  // ISO 8601 — computed: event.start_at minus days_before
  label: string         // e.g., "Announce open enrollment"
}

// Shared shape for a moment rule in config files
export interface PromoMomentRule {
  channel: PromoChannel
  days_before: number
  label: string
}

// Rules config shape (from promo-rules.yaml)
export interface EventTypeRule {
  dri: string
  moments: PromoMomentRule[]
}
export type PromoRules = Partial<Record<string, EventTypeRule>>

// Overrides (from overrides.yaml) — keyed by luma_id
export interface EventOverride {
  dri?: string
  moments?: PromoMomentRule[]
}
export type OverridesMap = Record<string, EventOverride>

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
  copy_drafts?: CopyDraft[]   // loaded from vault/promos/<luma_id>/
  approval_status: ApprovalStatus // default: 'pending'
  channel_plan: PromoMoment[] // populated from promo-rules.yaml / overrides.yaml
  notes: string               // From Luma description_md, truncated
}

// Slack Block Kit types
export type SlackBlock = Record<string, unknown>

// Approval status for promo plan
export type ApprovalStatus = 'pending' | 'approved' | 'changes_requested'

export interface PromoStatus {
  luma_id: string
  approval_status: ApprovalStatus
  approved_by?: string
  approved_at?: string
  notes?: string
}

export interface VoiceGuides {
  brand: string       // vault/brand-guidelines.md
  linkedin: string    // vault/linkedin-voice.md
  slack: string       // vault/helen-voice.md (Helen's Slack voice)
}

// Channel metadata for rendering
export const CHANNEL_LABELS: Record<PromoChannel, string> = {
  'linkedin-wdai': 'LinkedIn · WDAI',
  'linkedin-personal': 'LinkedIn · Personal',
  email: 'Email',
  slack: 'Slack',
}
