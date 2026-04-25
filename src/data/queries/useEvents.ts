import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/data/services/eventService";
import { queryKeys } from "@/lib/queryKeys";

export const useEvents = () =>
  useQuery({
    queryKey: queryKeys.events.all(),
    queryFn: () => eventService.list(),
  });
