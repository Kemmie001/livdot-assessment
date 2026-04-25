import type { RequirementKey, RequirementOwner } from '@/data/types/readiness.types'

type RequirementMeta = {
  label: string
  owner: RequirementOwner
  description: string
  actionLabel: string | null
}

export const REQUIREMENT_META: Record<RequirementKey, RequirementMeta> = {
  ticket_pricing_configured: {
    label: 'Ticket pricing configured',
    owner: 'host',
    description: 'Set ticket price and availability for this event',
    actionLabel: 'Configure pricing',
  },
  production_crew_assigned: {
    label: 'Production crew assigned',
    owner: 'crew',
    description: 'A production crew must accept assignment for this event',
    actionLabel: null,
  },
  streaming_ingest_configured: {
    label: 'Streaming ingest configured',
    owner: 'crew',
    description: 'Production crew must configure the stream ingest settings',
    actionLabel: null,
  },
}
