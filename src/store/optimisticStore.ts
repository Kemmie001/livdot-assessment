import { create } from 'zustand'
import type { EventState } from '@/data/types/event.types'

type OptimisticStore = {
  pendingTransitions: Record<string, EventState>
  setPending: (eventId: string, targetState: EventState) => void
  clearPending: (eventId: string) => void
}

export const useOptimisticStore = create<OptimisticStore>((set) => ({
  pendingTransitions: {},
  setPending: (eventId, targetState) =>
    set((state) => ({
      pendingTransitions: { ...state.pendingTransitions, [eventId]: targetState },
    })),
  clearPending: (eventId) =>
    set((state) => {
      const next = { ...state.pendingTransitions }
      delete next[eventId]
      return { pendingTransitions: next }
    }),
}))
