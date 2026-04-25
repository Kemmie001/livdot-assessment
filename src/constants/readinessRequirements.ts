import { RequirementKey, RequirementOwner } from "@/data/types/readiness.types";

type RequirementMeta = {
  label: string;
  owner: typeof RequirementOwner[keyof typeof RequirementOwner];
  description: string;
  actionLabel: string | null;
};

export const REQUIREMENT_META: Record<RequirementKey, RequirementMeta> = {
  [RequirementKey.TicketPricingConfigured]: {
    label: "Set up ticketing",
    owner: RequirementOwner.Host,
    description: "Define your ticket structure and access rules",
    actionLabel: "Set up ticketing",
  },
  [RequirementKey.ProductionCrewAssigned]: {
    label: "Assign production crew",
    owner: RequirementOwner.Crew,
    description: "Ensure your technical team has accepted the assignment",
    actionLabel: null,
  },
  [RequirementKey.StreamingIngestConfigured]: {
    label: "Configure streaming ingest",
    owner: RequirementOwner.Crew,
    description: "Production crew must configure the stream ingest settings",
    actionLabel: null,
  },
};
