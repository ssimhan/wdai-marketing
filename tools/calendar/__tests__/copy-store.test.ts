import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { readEventCopy, writeCopyDraft } from '../copy-store.js'
import type { CopyDraft } from '../types.js'

const testVaultDir = path.join(import.meta.dirname, '.copy-store-test-vault')

const makeDraft = (overrides: Partial<CopyDraft> = {}): CopyDraft => ({
  luma_id: 'evt-001',
  channel: 'linkedin-wdai',
  label: 'Announce open enrollment',
  content: 'We are opening enrollment for AI Basics W27!',
  status: 'draft',
  generated_at: '2026-04-16T12:00:00Z',
  generated_by: 'claude',
  ...overrides,
})

beforeEach(() => {
  if (!fs.existsSync(testVaultDir)) {
    fs.mkdirSync(testVaultDir, { recursive: true })
  }
})

afterEach(() => {
  if (fs.existsSync(testVaultDir)) {
    fs.rmSync(testVaultDir, { recursive: true, force: true })
  }
})

describe('readEventCopy', () => {
  it('returns empty array for non-existent event', () => {
    const result = readEventCopy(testVaultDir, 'nonexistent')
    expect(result).toEqual([])
  })

  it('returns empty array for event dir with no YAML files', () => {
    const eventDir = path.join(testVaultDir, 'evt-001')
    fs.mkdirSync(eventDir, { recursive: true })
    fs.writeFileSync(path.join(eventDir, 'notes.txt'), 'ignore me')
    const result = readEventCopy(testVaultDir, 'evt-001')
    expect(result).toEqual([])
  })

  it('reads a single copy draft from event dir', () => {
    const draft = makeDraft()
    writeCopyDraft(testVaultDir, draft)

    const result = readEventCopy(testVaultDir, 'evt-001')
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject(draft)
  })

  it('reads multiple drafts for different channels', () => {
    const d1 = makeDraft({ channel: 'linkedin-wdai' })
    const d2 = makeDraft({ channel: 'slack', label: 'Enrollment announcement in #general' })
    writeCopyDraft(testVaultDir, d1)
    writeCopyDraft(testVaultDir, d2)

    const result = readEventCopy(testVaultDir, 'evt-001')
    expect(result).toHaveLength(2)
  })

  it('ignores non-YAML files in event dir', () => {
    const draft = makeDraft()
    writeCopyDraft(testVaultDir, draft)
    fs.writeFileSync(path.join(testVaultDir, 'evt-001', 'README.txt'), 'ignore')

    const result = readEventCopy(testVaultDir, 'evt-001')
    expect(result).toHaveLength(1)
  })
})

describe('writeCopyDraft', () => {
  it('writes draft to vault/promos/<luma_id>/<channel>.yaml', () => {
    const draft = makeDraft()
    writeCopyDraft(testVaultDir, draft)

    const filePath = path.join(testVaultDir, 'evt-001', 'linkedin-wdai.yaml')
    expect(fs.existsSync(filePath)).toBe(true)

    const content = fs.readFileSync(filePath, 'utf-8')
    expect(content).toContain('luma_id: evt-001')
    expect(content).toContain('channel: linkedin-wdai')
    expect(content).toContain('status: draft')
    expect(content).toContain('generated_by: claude')
  })

  it('overwrites existing draft for the same channel (idempotent)', () => {
    const draft1 = makeDraft({ content: 'First draft' })
    const draft2 = makeDraft({ content: 'Updated draft', status: 'pending_review' })

    writeCopyDraft(testVaultDir, draft1)
    writeCopyDraft(testVaultDir, draft2)

    const result = readEventCopy(testVaultDir, 'evt-001')
    expect(result).toHaveLength(1)
    expect(result[0].content).toBe('Updated draft')
    expect(result[0].status).toBe('pending_review')
  })

  it('creates event directory if it does not exist', () => {
    const eventDir = path.join(testVaultDir, 'evt-new')
    expect(fs.existsSync(eventDir)).toBe(false)

    const draft = makeDraft({ luma_id: 'evt-new' })
    writeCopyDraft(testVaultDir, draft)

    expect(fs.existsSync(eventDir)).toBe(true)
  })

  it('writes optional fields when present', () => {
    const draft = makeDraft({
      approved_by: 'Sandhya',
      approved_at: '2026-04-17T09:00:00Z',
      revised_content: 'Edited version',
    })
    writeCopyDraft(testVaultDir, draft)

    const filePath = path.join(testVaultDir, 'evt-001', 'linkedin-wdai.yaml')
    const content = fs.readFileSync(filePath, 'utf-8')
    expect(content).toContain('approved_by: Sandhya')
    expect(content).toContain('revised_content: Edited version')
  })
})
