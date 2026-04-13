import { describe, it, expect } from 'vitest'

describe('setup', () => {
  it('TypeScript resolves', () => {
    const x: number = 1
    expect(x).toBe(1)
  })
})
