import { useOptimisticStore } from "@/store/optimisticStore";
import {
  getPrimaryAction,
  getAllBlockedReasons,
} from "@/utils/eventStateUtils";
import { useEvent } from "./useEvent";
import { useReadiness } from "./useReadiness";
import { useTransitionEvent } from "./useTransitionEvent";
import type { EventState } from "@/data/types/event.types";
import { useEffect } from "react";

export const useEventStateMachine = (eventId: string) => {
  const { data: event, isLoading, isError } = useEvent(eventId);
  const { data: report } = useReadiness(eventId);
  const { pendingTransitions, clearPending } = useOptimisticStore();
  const { mutate: transitionMutate, isPending } = useTransitionEvent(eventId);
  const transition = (targetState: EventState, scheduledAt?: string) =>
    transitionMutate({ targetState, scheduledAt });
  useEffect(() => {
    // This runs when the component "unmounts" (user leaves the page)
    return () => {
      clearPending(eventId);
    };
  }, [eventId, clearPending]);
  const serverState = event?.state ?? null;
  const displayState: EventState | null =
    pendingTransitions[eventId] ?? serverState;

  const primaryAction = displayState
    ? getPrimaryAction(displayState, report ?? null)
    : null;
  const blockedReasons = displayState
    ? getAllBlockedReasons(displayState, report ?? null)
    : [];

  return {
    event,
    displayState,
    primaryAction,
    blockedReasons,
    isPending,
    isLoading,
    isError,
    transition,
  };
};
