import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { readinessService } from "@/data/services/readinessService";
import { queryKeys } from "@/lib/queryKeys";
import {
  isReadyForStreaming,
  getMissingRequirements,
  getRequirementsByOwner,
  getCompletionCount,
} from "@/utils/readinessUtils";
import { REQUIREMENT_META } from "@/constants/readinessRequirements";
import { useReadiness } from "./useReadiness";
import type { RequirementKey } from "@/data/types/readiness.types";

export const useReadinessDerived = (eventId: string) => {
  const qc = useQueryClient();
  const { data: report, ...query } = useReadiness(eventId);

  const fulfillMutation = useMutation({
    mutationFn: (key: RequirementKey) => readinessService.fulfill(eventId, key),
    onSuccess: (_, key) => {
      qc.invalidateQueries({ queryKey: queryKeys.readiness.detail(eventId) });
      toast.success(`${REQUIREMENT_META[key].label} marked complete`);
    },
    onError: () => {
      toast.error("Failed to update requirement. Please try again.");
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (key: RequirementKey) => readinessService.revoke(eventId, key),
    onSuccess: (_, key) => {
      qc.invalidateQueries({ queryKey: queryKeys.readiness.detail(eventId) });
      toast.warning(`${REQUIREMENT_META[key].label} marked incomplete`);
    },
    onError: () => {
      toast.error("Failed to update requirement. Please try again.");
    },
  });

  return {
    ...query,
    report,
    isReady: report ? isReadyForStreaming(report) : false,
    missingRequirements: report ? getMissingRequirements(report) : [],
    requirementsByOwner: report
      ? getRequirementsByOwner(report)
      : { host: [], crew: [] },
    completionCount: report
      ? getCompletionCount(report)
      : { satisfied: 0, total: 0 },
    fulfill: fulfillMutation.mutate,
    revoke: revokeMutation.mutate,
  };
};
