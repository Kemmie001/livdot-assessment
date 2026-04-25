import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/data/services/eventService";
import { queryKeys } from "@/lib/queryKeys";

export const useEvent = (id: string) =>
  useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: () => eventService.get(id),
    enabled: !!id,
  });
