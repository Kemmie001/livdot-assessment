import { v4 as uuidv4 } from 'uuid'
import { eventsDb, readinessDb, fakeDelay } from './db'
import { VALID_TRANSITIONS } from '@/constants/eventLifecycle'
import type { Event, CreateEventPayload, EventState } from '@/data/types/event.types'
import { RequirementKey, RequirementOwner } from '@/data/types/readiness.types'

export const eventService = {
  list: async (): Promise<Event[]> => {
    await fakeDelay()
    return Array.from(eventsDb.values())
  },

  get: async (id: string): Promise<Event> => {
    await fakeDelay()
    const event = eventsDb.get(id)
    if (!event) throw new Error(`Event not found: ${id}`)
    return event
  },

  create: async (payload: CreateEventPayload): Promise<Event> => {
    await fakeDelay()
    const now = new Date().toISOString()
    const event: Event = {
      id: uuidv4(),
      title: payload.title,
      description: payload.description,
      state: 'draft',
      scheduledAt: payload.scheduledAt,
      createdAt: now,
      updatedAt: now,
    }
    eventsDb.set(event.id, event)
    readinessDb.set(event.id, {
      eventId: event.id,
      allSatisfied: false,
      requirements: [
        { key: RequirementKey.TicketPricingConfigured, satisfied: false, owner: RequirementOwner.Host },
        { key: RequirementKey.ProductionCrewAssigned, satisfied: false, owner: RequirementOwner.Crew },
        { key: RequirementKey.StreamingIngestConfigured, satisfied: false, owner: RequirementOwner.Crew },
      ],
    })
    return event
  },

  transition: async (id: string, targetState: EventState, scheduledAt?: string): Promise<Event> => {
    await fakeDelay()
    const event = eventsDb.get(id)
    if (!event) throw new Error(`Event not found: ${id}`)
    if (!VALID_TRANSITIONS[event.state].includes(targetState)) {
      throw new Error(`Invalid transition: ${event.state} → ${targetState}`)
    }
    const updated: Event = {
      ...event,
      state: targetState,
      scheduledAt:
        targetState === 'scheduled'
          ? (scheduledAt ?? event.scheduledAt ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
          : event.scheduledAt,
      updatedAt: new Date().toISOString(),
    }
    eventsDb.set(id, updated)
    return updated
  },
}
