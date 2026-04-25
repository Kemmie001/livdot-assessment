import { CalendarDays, DollarSign, ImagePlus } from "lucide-react";
import { EventStateBadge } from "@/views/event-list/components/EventStateBadge";
import { formatEventDate } from "@/utils/formatters";
import type { EventState } from "@/data/types/event.types";

type EventPreview = {
  title: string;
  description?: string;
  scheduledAt?: string;
  state: EventState;
};

type Props = {
  event: EventPreview;
  thumbnailPreview: string | null;
  price: number | null;
  onThumbnailClick: () => void;
};

export const EventPreviewCard = ({ event, thumbnailPreview, price, onThumbnailClick }: Props) => (
  <div className="rounded-lg border text-left overflow-hidden">
    {thumbnailPreview ? (
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={thumbnailPreview}
          alt="Event thumbnail"
          className="w-full h-full object-cover"
        />
      </div>
    ) : (
      <button
        type="button"
        onClick={onThumbnailClick}
        className="aspect-video w-full bg-muted flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-primary/60 hover:bg-muted/80 transition-colors group"
      >
        <ImagePlus className="h-7 w-7" />
        <span className="text-xs">Add thumbnail</span>
      </button>
    )}

    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg text-foreground leading-snug">{event.title}</h2>
        <EventStateBadge state={event.state} />
      </div>

      {event.description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {event.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t">
        {event.scheduledAt && (
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatEventDate(event.scheduledAt)}
          </span>
        )}
        {price !== null && (
          <span className="flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5" />
            {price.toFixed(2)} per ticket
          </span>
        )}
      </div>
    </div>
  </div>
);
