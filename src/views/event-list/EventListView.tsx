import { Plus } from "lucide-react";
import { Button } from "@/views/shadcn/button";
import { Skeleton } from "@/views/shadcn/skeleton";
import { EventCard } from "./components/EventCard";
import { CreateEventModal } from "./components/CreateEventModal";
import { useEventListViewModel } from "./useEventList";

export const EventListView = () => {
  const { events, isLoading, isError, openModal } = useEventListViewModel();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your Events</h1>
        <Button
          variant={"default"}
          className="cursor-pointer"
          onClick={() => openModal("create_event")}
        >
          <Plus className="size-4" />
          New Event
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Failed to load events. Please refresh.
        </p>
      )}

      {events && events.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">No events yet. Create your first one.</p>
        </div>
      )}

      {events && events.length > 0 && (
        <div className="space-y-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      <CreateEventModal />
    </div>
  );
};
