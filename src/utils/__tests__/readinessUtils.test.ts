import { describe, it, expect } from 'vitest'
import {
  isReadyForStreaming,
  getMissingRequirements,
  getSatisfiedRequirements,
  getRequirementsByOwner,
  getCompletionCount,
} from '../readinessUtils'
import type { ReadinessReport } from '@/data/types/readiness.types'

const fullReport: ReadinessReport = {
  eventId: '00000000-0000-0000-0000-000000000001',
  allSatisfied: true,
  requirements: [
    { key: 'ticket_pricing_configured', satisfied: true, owner: 'host' },
    { key: 'production_crew_assigned', satisfied: true, owner: 'crew' },
    { key: 'streaming_ingest_configured', satisfied: true, owner: 'crew' },
  ],
}

const partialReport: ReadinessReport = {
  eventId: '00000000-0000-0000-0000-000000000001',
  allSatisfied: false,
  requirements: [
    { key: 'ticket_pricing_configured', satisfied: true, owner: 'host' },
    { key: 'production_crew_assigned', satisfied: false, owner: 'crew' },
    { key: 'streaming_ingest_configured', satisfied: false, owner: 'crew' },
  ],
}

const emptyReport: ReadinessReport = {
  eventId: '00000000-0000-0000-0000-000000000001',
  allSatisfied: false,
  requirements: [
    { key: 'ticket_pricing_configured', satisfied: false, owner: 'host' },
    { key: 'production_crew_assigned', satisfied: false, owner: 'crew' },
    { key: 'streaming_ingest_configured', satisfied: false, owner: 'crew' },
  ],
}

describe('isReadyForStreaming', () => {
  it('returns true when all satisfied', () => {
    expect(isReadyForStreaming(fullReport)).toBe(true)
  })

  it('returns false when any unsatisfied', () => {
    expect(isReadyForStreaming(partialReport)).toBe(false)
  })
})

describe('getMissingRequirements', () => {
  it('returns only unsatisfied requirements', () => {
    const missing = getMissingRequirements(partialReport)
    expect(missing).toHaveLength(2)
    expect(missing.every((r) => !r.satisfied)).toBe(true)
  })

  it('returns empty array when all satisfied', () => {
    expect(getMissingRequirements(fullReport)).toHaveLength(0)
  })
})

describe('getSatisfiedRequirements', () => {
  it('returns only satisfied requirements', () => {
    const satisfied = getSatisfiedRequirements(partialReport)
    expect(satisfied).toHaveLength(1)
    expect(satisfied[0].key).toBe('ticket_pricing_configured')
  })

  it('returns all when fully satisfied', () => {
    expect(getSatisfiedRequirements(fullReport)).toHaveLength(3)
  })
})

describe('getRequirementsByOwner', () => {
  it('groups requirements correctly by owner', () => {
    const grouped = getRequirementsByOwner(fullReport)
    expect(grouped.host).toHaveLength(1)
    expect(grouped.crew).toHaveLength(2)
  })

  it('host group contains only host-owned requirements', () => {
    const grouped = getRequirementsByOwner(partialReport)
    expect(grouped.host.every((r) => r.owner === 'host')).toBe(true)
  })

  it('crew group contains only crew-owned requirements', () => {
    const grouped = getRequirementsByOwner(partialReport)
    expect(grouped.crew.every((r) => r.owner === 'crew')).toBe(true)
  })
})

describe('getCompletionCount', () => {
  it('returns correct totals when all satisfied', () => {
    expect(getCompletionCount(fullReport)).toEqual({ satisfied: 3, total: 3 })
  })

  it('returns correct totals when partially satisfied', () => {
    expect(getCompletionCount(partialReport)).toEqual({ satisfied: 1, total: 3 })
  })

  it('returns zero satisfied when none complete', () => {
    expect(getCompletionCount(emptyReport)).toEqual({ satisfied: 0, total: 3 })
  })
})
