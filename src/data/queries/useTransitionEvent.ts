import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { eventService } from "@/data/services/eventService";
import { queryKeys } from "@/lib/queryKeys";
import { useOptimisticStore } from "@/store/optimisticStore";
import { STATE_LABELS } from "@/constants/eventLifecycle";
import type { EventState } from "@/data/types/event.types";

export const useTransitionEvent = (eventId: string) => {
  const qc = useQueryClient();
  const { setPending, clearPending } = useOptimisticStore();

  return useMutation({
    mutationFn: ({ targetState, scheduledAt }: { targetState: EventState; scheduledAt?: string }) =>
      eventService.transition(eventId, targetState, scheduledAt),
    onMutate: ({ targetState }) => {
      setPending(eventId, targetState);
    },
    onSuccess: (event) => {
      clearPending(eventId);
      qc.invalidateQueries({ queryKey: queryKeys.events.detail(eventId) });
      qc.invalidateQueries({ queryKey: queryKeys.events.all() });
      toast.success(`Event moved to ${STATE_LABELS[event.state]}`);
    },
    onError: () => {
      clearPending(eventId);
      toast.error("Transition failed. Please try again.");
    },
  });
};
