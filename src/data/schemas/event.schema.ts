import { z } from 'zod'

export const EventStateSchema = z.enum([
  'draft',
  'scheduled',
  'ready_for_streaming',
  'live',
  'completed',
  'replay_available',
])

export const EventSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  state: EventStateSchema,
  scheduledAt: z.string().datetime().optional(),
  thumbnailUrl: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const CreateEventPayloadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
})

export const TransitionEventPayloadSchema = z.object({
  targetState: EventStateSchema,
})
