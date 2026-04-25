import { z } from 'zod'

export const RequirementKey = {
  TicketPricingConfigured: 'ticket_pricing_configured',
  ProductionCrewAssigned: 'production_crew_assigned',
  StreamingIngestConfigured: 'streaming_ingest_configured',
} as const

export const RequirementOwner = {
  Host: 'host',
  Crew: 'crew',
} as const

export const RequirementKeySchema = z.enum([
  RequirementKey.TicketPricingConfigured,
  RequirementKey.ProductionCrewAssigned,
  RequirementKey.StreamingIngestConfigured,
])

export const RequirementOwnerSchema = z.enum([
  RequirementOwner.Host,
  RequirementOwner.Crew,
])

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
