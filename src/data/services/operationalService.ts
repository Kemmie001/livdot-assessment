import { operationalDb, fakeDelay } from './db'
import type { OperationalStatus } from './db'

export type { OperationalStatus }

export const operationalService = {
  getStatus: async (eventId: string): Promise<OperationalStatus> => {
    await fakeDelay()
    return operationalDb.get(eventId) ?? 'nominal'
  },

  setStatus: async (eventId: string, status: OperationalStatus): Promise<OperationalStatus> => {
    await fakeDelay()
    operationalDb.set(eventId, status)
    return status
  },
}
