import { readinessDb, fakeDelay } from './db'
import type { ReadinessReport, RequirementKey } from '@/data/types/readiness.types'

export const readinessService = {
  get: async (eventId: string): Promise<ReadinessReport> => {
    await fakeDelay()
    const report = readinessDb.get(eventId)
    if (!report) throw new Error(`Readiness report not found for event: ${eventId}`)
    return report
  },

  fulfill: async (eventId: string, key: RequirementKey): Promise<ReadinessReport> => {
    await fakeDelay()
    const report = readinessDb.get(eventId)
    if (!report) throw new Error(`Readiness report not found for event: ${eventId}`)
    const updated: ReadinessReport = {
      ...report,
      requirements: report.requirements.map((r) =>
        r.key === key ? { ...r, satisfied: true } : r
      ),
    }
    updated.allSatisfied = updated.requirements.every((r) => r.satisfied)
    readinessDb.set(eventId, updated)
    return updated
  },

  revoke: async (eventId: string, key: RequirementKey): Promise<ReadinessReport> => {
    await fakeDelay()
    const report = readinessDb.get(eventId)
    if (!report) throw new Error(`Readiness report not found for event: ${eventId}`)
    const updated: ReadinessReport = {
      ...report,
      requirements: report.requirements.map((r) =>
        r.key === key ? { ...r, satisfied: false } : r
      ),
      allSatisfied: false,
    }
    readinessDb.set(eventId, updated)
    return updated
  },
}
