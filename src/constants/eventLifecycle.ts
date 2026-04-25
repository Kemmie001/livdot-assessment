import type { EventState } from "@/data/types/event.types";
import { RequirementKey } from "@/data/types/readiness.types";

export const ORDERED_STATES: EventState[] = [
  "draft",
  "scheduled",
  "ready_for_streaming",
  "live",
  "completed",
  "replay_available",
];

export const VALID_TRANSITIONS: Record<EventState, EventState[]> = {
  draft: ["scheduled"],
  scheduled: ["ready_for_streaming", "draft"],
  ready_for_streaming: ["live", "scheduled"],
  live: ["completed"],
  completed: ["replay_available"],
  replay_available: [],
};

export const STATE_LABELS: Record<EventState, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  ready_for_streaming: "Ready",
  live: "Live",
  completed: "Completed",
  replay_available: "Replay Available",
};

export const STATE_DESCRIPTIONS: Record<EventState, string> = {
  draft: "Event created, not yet scheduled",
  scheduled: "Date set, requirements incomplete",
  ready_for_streaming: "All requirements satisfied",
  live: "Broadcast to ticket holders",
  completed: "Broadcast ended",
  replay_available:
    "Event has ended and is now available as a replay for those who missed it or wish to watch again.",
};
export const STATUS_ITEMS = [
  {
    key: RequirementKey.ProductionCrewAssigned,
    label: "Production Crew",
    description: "A production crew must be assigned to handle the broadcast.",
  },
  {
    key: RequirementKey.StreamingIngestConfigured,
    label: "Stream Ingest",
    description: "Streaming ingest endpoint must be configured and tested.",
  },
  {
    key: RequirementKey.TicketPricingConfigured,
    label: "Ticket Pricing",
    description: "Ticket price must be set before the event can go live.",
  },
];

export const SHORT_LABELS: Record<EventState, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  ready_for_streaming: "Ready",
  live: "Live",
  completed: "Done",
  replay_available: "Replay",
};

export const stateStyles: Record<EventState, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-blue-100 text-blue-700",
  ready_for_streaming: "bg-emerald-100 text-emerald-700",
  live: "bg-red-100 text-red-700 animate-pulse",
  completed: "bg-muted text-muted-foreground",
  replay_available: "bg-purple-100 text-purple-700",
};
