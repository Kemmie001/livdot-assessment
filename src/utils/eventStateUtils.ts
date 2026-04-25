import { VALID_TRANSITIONS } from "@/constants/eventLifecycle";
import type {
  EventState,
  AvailableAction,
  BlockedReason,
} from "@/data/types/event.types";
import { RequirementOwner } from "@/data/types/readiness.types";
import type {
  ReadinessReport,
  Requirement,
} from "@/data/types/readiness.types";
import { REQUIREMENT_META } from "@/constants/readinessRequirements";

export const canTransitionTo = (from: EventState, to: EventState): boolean =>
  VALID_TRANSITIONS[from].includes(to);

const getBlockedReasonsForReadiness = (
  report: ReadinessReport,
): BlockedReason[] =>
  report.requirements
    .filter((r) => !r.satisfied)
    .map((r: Requirement): BlockedReason => {
      const meta = REQUIREMENT_META[r.key];
      if (r.owner === "host") {
        return {
          type: "host_action_required",
          requirement: r,
          actionLabel: meta.actionLabel ?? "Resolve",
        };
      }
      return {
        type: "awaiting_external",
        requirement: r,
        owner: RequirementOwner.Crew,
      };
    });

export const getAvailableActions = (
  state: EventState,
  report: ReadinessReport | null,
): AvailableAction[] => {
  switch (state) {
    case "draft":
      return [
        {
          label: "Schedule Event",
          targetState: "scheduled",
          blocked: false,
          blockedReason: null,
        },
      ];

    case "scheduled": {
      const blockedReasons = report
        ? getBlockedReasonsForReadiness(report)
        : [];
      const isBlocked = blockedReasons.length > 0 || !report;
      return [
        {
          label: "Mark as Ready",
          targetState: "ready_for_streaming",
          blocked: isBlocked,
          blockedReason: isBlocked ? (blockedReasons[0] ?? null) : null,
        },
      ];
    }

    case "ready_for_streaming":
      return [
        {
          label: "Go Live",
          targetState: "live",
          blocked: false,
          blockedReason: null,
        },
      ];

    case "live":
      return [
        {
          label: "End Broadcast",
          targetState: "completed",
          blocked: false,
          blockedReason: null,
          requiresConfirmation: true,
        },
      ];

    case "completed":
      return [
        {
          label: "Enable Replay",
          targetState: "replay_available",
          blocked: false,
          blockedReason: null,
        },
      ];

    case "replay_available":
      return [];
  }
};

export const getPrimaryAction = (
  state: EventState,
  report: ReadinessReport | null,
): AvailableAction | null => getAvailableActions(state, report)[0] ?? null;

export const getAllBlockedReasons = (
  state: EventState,
  report: ReadinessReport | null,
): BlockedReason[] => {
  if (state !== "scheduled" || !report) return [];
  return getBlockedReasonsForReadiness(report);
};

export const formatElapsed = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};
