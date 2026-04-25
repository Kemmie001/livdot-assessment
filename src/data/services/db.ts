import type { Event } from '@/data/types/event.types'
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
        { key: 'ticket_pricing_configured', satisfied: false, owner: 'host' },
        { key: 'production_crew_assigned', satisfied: false, owner: 'crew' },
        { key: 'streaming_ingest_configured', satisfied: false, owner: 'crew' },
      ],
    },
  ],
  [
    '00000000-0000-0000-0000-000000000002',
    {
      eventId: '00000000-0000-0000-0000-000000000002',
      allSatisfied: false,
      requirements: [
        { key: 'ticket_pricing_configured', satisfied: false, owner: 'host' },
        { key: 'production_crew_assigned', satisfied: false, owner: 'crew' },
        { key: 'streaming_ingest_configured', satisfied: false, owner: 'crew' },
      ],
    },
  ],
  [
    '00000000-0000-0000-0000-000000000003',
    {
      eventId: '00000000-0000-0000-0000-000000000003',
      allSatisfied: true,
      requirements: [
        { key: 'ticket_pricing_configured', satisfied: true, owner: 'host' },
        { key: 'production_crew_assigned', satisfied: true, owner: 'crew' },
        { key: 'streaming_ingest_configured', satisfied: true, owner: 'crew' },
      ],
    },
  ],
  [
    '00000000-0000-0000-0000-000000000004',
    {
      eventId: '00000000-0000-0000-0000-000000000004',
      allSatisfied: true,
      requirements: [
        { key: 'ticket_pricing_configured', satisfied: true, owner: 'host' },
        { key: 'production_crew_assigned', satisfied: true, owner: 'crew' },
        { key: 'streaming_ingest_configured', satisfied: true, owner: 'crew' },
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
