import type { EventState } from '@/data/types/event.types'

export const ORDERED_STATES: EventState[] = [
  'draft',
  'scheduled',
  'ready_for_streaming',
  'live',
  'completed',
  'replay_available',
]

export const VALID_TRANSITIONS: Record<EventState, EventState[]> = {
  draft: ['scheduled'],
  scheduled: ['ready_for_streaming', 'draft'],
  ready_for_streaming: ['live', 'scheduled'],
  live: ['completed'],
  completed: ['replay_available'],
  replay_available: [],
}

export const STATE_LABELS: Record<EventState, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  ready_for_streaming: 'Ready',
  live: 'Live',
  completed: 'Completed',
  replay_available: 'Replay Available',
}

export const STATE_DESCRIPTIONS: Record<EventState, string> = {
  draft: 'Event created, not yet scheduled',
  scheduled: 'Date set, requirements incomplete',
  ready_for_streaming: 'All requirements satisfied',
  live: 'Broadcasting to ticket holders',
  completed: 'Broadcast ended',
  replay_available: 'Catch-up viewing enabled',
}
