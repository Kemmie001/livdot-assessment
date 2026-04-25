import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { eventService } from "@/data/services/eventService";
import { queryKeys } from "@/lib/queryKeys";
import type { CreateEventPayload } from "@/data/types/event.types";

export const useCreateEvent = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEventPayload) => eventService.create(payload),
    onSuccess: (event) => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all() });
      toast.success(`"${event.title}" created`);
    },
    onError: () => {
      toast.error("Failed to create event. Please try again.");
    },
  });
};
