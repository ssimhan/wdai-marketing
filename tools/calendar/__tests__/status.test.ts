import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { readAllStatuses, writeStatus } from '../status.js'
import type { PromoStatus } from '../types.js'

const testDir = path.join(import.meta.dirname, '.status-test-dir')

beforeEach(() => {
  // Create test directory
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true })
  }
})

afterEach(() => {
  // Clean up test directory
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true })
  }
})

describe('readAllStatuses', () => {
  it('returns empty map for non-existent directory', () => {
    const nonExistentDir = path.join(testDir, 'nonexistent')
    const result = readAllStatuses(nonExistentDir)
    expect(result.size).toBe(0)
  })

  it('returns empty map for empty directory', () => {
    const result = readAllStatuses(testDir)
    expect(result.size).toBe(0)
  })

  it('reads single status YAML file', () => {
    const status: PromoStatus = {
      luma_id: 'evt-001',
      approval_status: 'approved',
      approved_by: 'Sheena',
      approved_at: '2026-04-16T12:00:00Z',
    }

    writeStatus(testDir, status)

    const result = readAllStatuses(testDir)
    expect(result.size).toBe(1)
    expect(result.get('evt-001')).toEqual(status)
  })

  it('reads multiple status YAML files', () => {
    const status1: PromoStatus = {
      luma_id: 'evt-001',
      approval_status: 'approved',
      approved_by: 'Sheena',
    }

    const status2: PromoStatus = {
      luma_id: 'evt-002',
      approval_status: 'changes_requested',
      notes: 'Update the messaging.',
    }

    writeStatus(testDir, status1)
    writeStatus(testDir, status2)

    const result = readAllStatuses(testDir)
    expect(result.size).toBe(2)
    expect(result.get('evt-001')).toEqual(status1)
    expect(result.get('evt-002')).toEqual(status2)
  })

  it('ignores non-YAML files in directory', () => {
    const status: PromoStatus = {
      luma_id: 'evt-001',
      approval_status: 'pending',
    }

    writeStatus(testDir, status)
    fs.writeFileSync(path.join(testDir, 'README.txt'), 'Ignore me')

    const result = readAllStatuses(testDir)
    expect(result.size).toBe(1)
    expect(result.has('evt-001')).toBe(true)
  })
})

describe('writeStatus', () => {
  it('writes status with all fields to YAML file', () => {
    const status: PromoStatus = {
      luma_id: 'evt-001',
      approval_status: 'approved',
      approved_by: 'Sheena',
      approved_at: '2026-04-16T12:00:00Z',
      notes: 'Great promo plan!',
    }

    writeStatus(testDir, status)

    const filePath = path.join(testDir, 'evt-001.yaml')
    expect(fs.existsSync(filePath)).toBe(true)

    const content = fs.readFileSync(filePath, 'utf-8')
    expect(content).toContain('luma_id: evt-001')
    expect(content).toContain('approval_status: approved')
    expect(content).toContain('approved_by: Sheena')
    expect(content).toContain('approved_at: 2026-04-16T12:00:00Z')
    expect(content).toContain('notes: Great promo plan!')
  })

  it('writes status with minimal fields', () => {
    const status: PromoStatus = {
      luma_id: 'evt-002',
      approval_status: 'pending',
    }

    writeStatus(testDir, status)

    const filePath = path.join(testDir, 'evt-002.yaml')
    expect(fs.existsSync(filePath)).toBe(true)

    const content = fs.readFileSync(filePath, 'utf-8')
    expect(content).toContain('luma_id: evt-002')
    expect(content).toContain('approval_status: pending')
  })

  it('overwrites existing status file', () => {
    const status1: PromoStatus = {
      luma_id: 'evt-001',
      approval_status: 'pending',
    }

    const status2: PromoStatus = {
      luma_id: 'evt-001',
      approval_status: 'approved',
      approved_by: 'Helen',
    }

    writeStatus(testDir, status1)
    writeStatus(testDir, status2)

    const filePath = path.join(testDir, 'evt-001.yaml')
    const content = fs.readFileSync(filePath, 'utf-8')
    expect(content).toContain('approval_status: approved')
    expect(content).toContain('approved_by: Helen')
  })

  it('creates status directory if it does not exist', () => {
    const newDir = path.join(testDir, 'new-subdir')
    expect(fs.existsSync(newDir)).toBe(false)

    const status: PromoStatus = {
      luma_id: 'evt-001',
      approval_status: 'pending',
    }

    writeStatus(newDir, status)
    expect(fs.existsSync(newDir)).toBe(true)
    expect(fs.existsSync(path.join(newDir, 'evt-001.yaml'))).toBe(true)
  })
})
