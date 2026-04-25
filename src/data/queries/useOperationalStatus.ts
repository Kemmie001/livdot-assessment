import { useQuery } from "@tanstack/react-query";
import { operationalService } from "@/data/services/operationalService";
import { queryKeys } from "@/lib/queryKeys";

export const useOperationalStatus = (eventId: string, isLive: boolean) =>
  useQuery({
    queryKey: queryKeys.operational.detail(eventId),
    queryFn: () => operationalService.getStatus(eventId),
    enabled: !!eventId && isLive,
    refetchInterval: isLive ? 5000 : false,
  });
