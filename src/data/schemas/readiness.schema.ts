import { z } from 'zod'

export const RequirementKeySchema = z.enum([
  'ticket_pricing_configured',
  'production_crew_assigned',
  'streaming_ingest_configured',
])

export const RequirementOwnerSchema = z.enum(['host', 'crew'])

export const RequirementSchema = z.object({
  key: RequirementKeySchema,
  satisfied: z.boolean(),
  owner: RequirementOwnerSchema,
})

export const ReadinessReportSchema = z.object({
  eventId: z.string().uuid(),
  requirements: z.array(RequirementSchema),
  allSatisfied: z.boolean(),
})
