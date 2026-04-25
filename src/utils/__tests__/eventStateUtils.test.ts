import { describe, it, expect } from 'vitest'
import { canTransitionTo, getAvailableActions, getPrimaryAction, getAllBlockedReasons } from '../eventStateUtils'
import type { ReadinessReport } from '@/data/types/readiness.types'

const fulfilledReport: ReadinessReport = {
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
    { key: 'ticket_pricing_configured', satisfied: false, owner: 'host' },
    { key: 'production_crew_assigned', satisfied: false, owner: 'crew' },
    { key: 'streaming_ingest_configured', satisfied: true, owner: 'crew' },
  ],
}

describe('canTransitionTo', () => {
  it('allows draft → scheduled', () => {
    expect(canTransitionTo('draft', 'scheduled')).toBe(true)
  })

  it('blocks draft → live (invalid transition)', () => {
    expect(canTransitionTo('draft', 'live')).toBe(false)
  })

  it('allows scheduled → ready_for_streaming', () => {
    expect(canTransitionTo('scheduled', 'ready_for_streaming')).toBe(true)
  })

  it('allows scheduled → draft (unschedule)', () => {
    expect(canTransitionTo('scheduled', 'draft')).toBe(true)
  })

  it('allows live → completed', () => {
    expect(canTransitionTo('live', 'completed')).toBe(true)
  })

  it('blocks replay_available → anything (terminal state)', () => {
    expect(canTransitionTo('replay_available', 'completed')).toBe(false)
    expect(canTransitionTo('replay_available', 'live')).toBe(false)
  })
})

describe('getAvailableActions', () => {
  it('draft returns Schedule Event action unblocked', () => {
    const actions = getAvailableActions('draft', null)
    expect(actions).toHaveLength(1)
    expect(actions[0].targetState).toBe('scheduled')
    expect(actions[0].blocked).toBe(false)
  })

  it('scheduled is blocked when requirements are missing', () => {
    const actions = getAvailableActions('scheduled', partialReport)
    expect(actions[0].blocked).toBe(true)
    expect(actions[0].blockedReason).not.toBeNull()
  })

  it('scheduled returns host_action_required for host-owned missing requirement', () => {
    const actions = getAvailableActions('scheduled', partialReport)
    expect(actions[0].blockedReason?.type).toBe('host_action_required')
  })

  it('scheduled is unblocked when all requirements satisfied', () => {
    const actions = getAvailableActions('scheduled', fulfilledReport)
    expect(actions[0].blocked).toBe(false)
    expect(actions[0].blockedReason).toBeNull()
  })

  it('ready_for_streaming returns Go Live unblocked', () => {
    const actions = getAvailableActions('ready_for_streaming', fulfilledReport)
    expect(actions[0].targetState).toBe('live')
    expect(actions[0].blocked).toBe(false)
  })

  it('live returns End Broadcast with confirmation required', () => {
    const actions = getAvailableActions('live', null)
    expect(actions[0].targetState).toBe('completed')
    expect(actions[0].requiresConfirmation).toBe(true)
  })

  it('completed returns Enable Replay unblocked', () => {
    const actions = getAvailableActions('completed', null)
    expect(actions[0].targetState).toBe('replay_available')
    expect(actions[0].blocked).toBe(false)
  })

  it('replay_available returns no actions (terminal state)', () => {
    expect(getAvailableActions('replay_available', null)).toHaveLength(0)
  })
})

describe('getPrimaryAction', () => {
  it('returns first available action', () => {
    expect(getPrimaryAction('draft', null)?.targetState).toBe('scheduled')
  })

  it('returns null for terminal state', () => {
    expect(getPrimaryAction('replay_available', null)).toBeNull()
  })
})

describe('getAllBlockedReasons', () => {
  it('returns awaiting_external for crew-owned missing requirement', () => {
    const crewOnlyPartial: ReadinessReport = {
      ...fulfilledReport,
      allSatisfied: false,
      requirements: [
        { key: 'ticket_pricing_configured', satisfied: true, owner: 'host' },
        { key: 'production_crew_assigned', satisfied: false, owner: 'crew' },
        { key: 'streaming_ingest_configured', satisfied: false, owner: 'crew' },
      ],
    }
    const reasons = getAllBlockedReasons('scheduled', crewOnlyPartial)
    expect(reasons.every((r) => r.type === 'awaiting_external')).toBe(true)
  })

  it('returns empty array for non-scheduled states', () => {
    expect(getAllBlockedReasons('draft', partialReport)).toHaveLength(0)
    expect(getAllBlockedReasons('live', partialReport)).toHaveLength(0)
  })

  it('returns empty array when report is null', () => {
    expect(getAllBlockedReasons('scheduled', null)).toHaveLength(0)
  })
})
