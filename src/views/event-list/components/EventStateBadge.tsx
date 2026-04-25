import { Badge } from "@/views/shadcn/badge";
import { STATE_LABELS, stateStyles } from "@/constants/eventLifecycle";
import type { EventState } from "@/data/types/event.types";
import { cn } from "@/lib/utils";

type Props = { state: EventState };

export const EventStateBadge = ({ state }: Props) => (
  <Badge
    className={cn(
      "font-medium inline-flex items-center justify-center rounded-full outline-none transition-colors focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-cobalt-200 disabled:pointer-events-none",
      stateStyles[state],
    )}
  >
    {state === "live" && (
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500 inline-block" />
    )}
    {STATE_LABELS[state]}
  </Badge>
);
