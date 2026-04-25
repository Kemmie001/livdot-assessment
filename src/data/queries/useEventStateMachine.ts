import { useOptimisticStore } from '@/store/optimisticStore'
import { getPrimaryAction, getAllBlockedReasons } from '@/utils/eventStateUtils'
import { useEvent } from './useEvent'
import { useReadiness } from './useReadiness'
import { useTransitionEvent } from './useTransitionEvent'
import type { EventState } from '@/data/types/event.types'

export const useEventStateMachine = (eventId: string) => {
  const { data: event, isLoading, isError } = useEvent(eventId)
  const { data: report } = useReadiness(eventId)
  const pendingTransitions = useOptimisticStore((s) => s.pendingTransitions)
  const { mutate: transitionMutate, isPending } = useTransitionEvent(eventId)
  const transition = (targetState: EventState, scheduledAt?: string) =>
    transitionMutate({ targetState, scheduledAt })

  const serverState = event?.state ?? null
  const displayState: EventState | null = pendingTransitions[eventId] ?? serverState

  const primaryAction = displayState ? getPrimaryAction(displayState, report ?? null) : null
  const blockedReasons = displayState ? getAllBlockedReasons(displayState, report ?? null) : []

  return {
    event,
    displayState,
    primaryAction,
    blockedReasons,
    isPending,
    isLoading,
    isError,
    transition,
  }
}
