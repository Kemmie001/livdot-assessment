import { Link } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { EventStateBadge } from "./EventStateBadge";
import { formatEventDate } from "@/utils/formatters";
import type { Event } from "@/data/types/event.types";

type Props = { event: Event };

export const EventCard = ({ event }: Props) => (
  <Link
    to="/events/$eventId"
    params={{ eventId: event.id }}
    className="block rounded-lg border p-5 transition-all"
  >
    <div className="flex items-start justify-between gap-4 text-left">
      <div className="min-w-0">
        <p className="font-semibold text-foreground truncate">{event.title}</p>
        {event.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        )}
        {event.scheduledAt && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatEventDate(event.scheduledAt)}
          </div>
        )}
      </div>
      <EventStateBadge state={event.state} />
    </div>
  </Link>
);
