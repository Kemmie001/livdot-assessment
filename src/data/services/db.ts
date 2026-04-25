import type { Event } from '@/data/types/event.types'
import { RequirementKey, RequirementOwner } from '@/data/types/readiness.types'
import type { ReadinessReport } from '@/data/types/readiness.types'

const now = new Date().toISOString()

export const eventsDb: Map<string, Event> = new Map([
  [
    '00000000-0000-0000-0000-000000000001',
    {
      id: '00000000-0000-0000-0000-000000000001',
      title: 'Product Launch Keynote',
      description: 'Live keynote for the Q2 product launch.',
      state: 'scheduled',
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      thumbnailUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80',
      createdAt: now,
      updatedAt: now,
    },
  ],
  [
    '00000000-0000-0000-0000-000000000002',
    {
      id: '00000000-0000-0000-0000-000000000002',
      title: 'Community Q&A Session',
      description: 'Open Q&A with the community team.',
      state: 'draft',
      scheduledAt: undefined,
      thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      createdAt: now,
      updatedAt: now,
    },
  ],
  [
    '00000000-0000-0000-0000-000000000003',
    {
      id: '00000000-0000-0000-0000-000000000003',
      title: 'Engineering Deep Dive',
      description: 'Technical walkthrough of the new infrastructure.',
      state: 'ready_for_streaming',
      scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
      createdAt: now,
      updatedAt: now,
    },
  ],
  [
    '00000000-0000-0000-0000-000000000004',
    {
      id: '00000000-0000-0000-0000-000000000004',
      title: 'Annual Investor Briefing',
      description: 'Annual update for investors and stakeholders.',
      state: 'completed',
      scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
      createdAt: now,
      updatedAt: now,
    },
  ],
])

export const readinessDb: Map<string, ReadinessReport> = new Map([
  [
    '00000000-0000-0000-0000-000000000001',
    {
      eventId: '00000000-0000-0000-0000-000000000001',
      allSatisfied: false,
      requirements: [
        { key: RequirementKey.TicketPricingConfigured, satisfied: false, owner: RequirementOwner.Host },
        { key: RequirementKey.ProductionCrewAssigned, satisfied: false, owner: RequirementOwner.Crew },
        { key: RequirementKey.StreamingIngestConfigured, satisfied: false, owner: RequirementOwner.Crew },
      ],
    },
  ],
  [
    '00000000-0000-0000-0000-000000000002',
    {
      eventId: '00000000-0000-0000-0000-000000000002',
      allSatisfied: false,
      requirements: [
        { key: RequirementKey.TicketPricingConfigured, satisfied: false, owner: RequirementOwner.Host },
        { key: RequirementKey.ProductionCrewAssigned, satisfied: false, owner: RequirementOwner.Crew },
        { key: RequirementKey.StreamingIngestConfigured, satisfied: false, owner: RequirementOwner.Crew },
      ],
    },
  ],
  [
    '00000000-0000-0000-0000-000000000003',
    {
      eventId: '00000000-0000-0000-0000-000000000003',
      allSatisfied: true,
      requirements: [
        { key: RequirementKey.TicketPricingConfigured, satisfied: true, owner: RequirementOwner.Host },
        { key: RequirementKey.ProductionCrewAssigned, satisfied: true, owner: RequirementOwner.Crew },
        { key: RequirementKey.StreamingIngestConfigured, satisfied: true, owner: RequirementOwner.Crew },
      ],
    },
  ],
  [
    '00000000-0000-0000-0000-000000000004',
    {
      eventId: '00000000-0000-0000-0000-000000000004',
      allSatisfied: true,
      requirements: [
        { key: RequirementKey.TicketPricingConfigured, satisfied: true, owner: RequirementOwner.Host },
        { key: RequirementKey.ProductionCrewAssigned, satisfied: true, owner: RequirementOwner.Crew },
        { key: RequirementKey.StreamingIngestConfigured, satisfied: true, owner: RequirementOwner.Crew },
      ],
    },
  ],
])

export type OperationalStatus = 'nominal' | 'degraded' | 'stream_failed'

export const operationalDb: Map<string, OperationalStatus> = new Map([
  ['00000000-0000-0000-0000-000000000001', 'nominal'],
  ['00000000-0000-0000-0000-000000000002', 'nominal'],
  ['00000000-0000-0000-0000-000000000003', 'nominal'],
  ['00000000-0000-0000-0000-000000000004', 'nominal'],
])

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))
export const fakeDelay = () => delay(300 + Math.random() * 200)
