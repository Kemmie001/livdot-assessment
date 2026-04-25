import type { Event, EventState } from '@/data/types/event.types'
import { RequirementKey, RequirementOwner } from '@/data/types/readiness.types'
import type { ReadinessReport } from '@/data/types/readiness.types'

export const createMockEvent = (overrides: Partial<Event> = {}): Event => ({
  id: '00000000-0000-0000-0000-000000000001',
  title: 'Test Event',
  description: 'A test event',
  state: 'draft',
  scheduledAt: new Date(Date.now() + 86400000).toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

export const createMockReadiness = (
  overrides: Partial<ReadinessReport> = {}
): ReadinessReport => ({
  eventId: '00000000-0000-0000-0000-000000000001',
  allSatisfied: false,
  requirements: [
    { key: RequirementKey.TicketPricingConfigured, satisfied: false, owner: RequirementOwner.Host },
    { key: RequirementKey.ProductionCrewAssigned, satisfied: false, owner: RequirementOwner.Crew },
    { key: RequirementKey.StreamingIngestConfigured, satisfied: false, owner: RequirementOwner.Crew },
  ],
  ...overrides,
})

export const createFullReadiness = (eventId = '00000000-0000-0000-0000-000000000001'): ReadinessReport => ({
  eventId,
  allSatisfied: true,
  requirements: [
    { key: RequirementKey.TicketPricingConfigured, satisfied: true, owner: RequirementOwner.Host },
    { key: RequirementKey.ProductionCrewAssigned, satisfied: true, owner: RequirementOwner.Crew },
    { key: RequirementKey.StreamingIngestConfigured, satisfied: true, owner: RequirementOwner.Crew },
  ],
})

export const createEventInState = (state: EventState): Event =>
  createMockEvent({ state })
