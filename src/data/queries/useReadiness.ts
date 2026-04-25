import { useQuery } from "@tanstack/react-query";
import { readinessService } from "@/data/services/readinessService";
import { queryKeys } from "@/lib/queryKeys";

export const useReadiness = (eventId: string) =>
  useQuery({
    queryKey: queryKeys.readiness.detail(eventId),
    queryFn: () => readinessService.get(eventId),
    enabled: !!eventId,
  });
