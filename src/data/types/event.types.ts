import { z } from 'zod'
import {
  EventSchema,
  EventStateSchema,
  CreateEventPayloadSchema,
  TransitionEventPayloadSchema,
} from '@/data/schemas/event.schema'
import type { Requirement } from './readiness.types'

export type EventState = z.infer<typeof EventStateSchema>
export type Event = z.infer<typeof EventSchema>
export type CreateEventPayload = z.infer<typeof CreateEventPayloadSchema>
export type TransitionEventPayload = z.infer<typeof TransitionEventPayloadSchema>

export type BlockedReason =
  | { type: 'host_action_required'; requirement: Requirement; actionLabel: string }
  | { type: 'awaiting_external'; requirement: Requirement; owner: 'crew' | 'system' }
  | { type: 'invalid_transition'; from: EventState; to: EventState }
  | { type: 'not_scheduled' }

export type AvailableAction = {
  label: string
  targetState: EventState
  blocked: boolean
  blockedReason: BlockedReason | null
  requiresConfirmation?: boolean
}
