import { Skeleton } from "@/views/shadcn/skeleton";
import { EventLifecycleTracker } from "./components/EventLifecycleTracker";
import { OperationalStatusBanner } from "./components/OperationalStatusBanner";
import { EventActionPanel } from "./components/EventActionPanel";
import { ReadinessChecklist } from "./components/ReadinessChecklist";
import { ReadinessStatusPanel } from "./components/ReadinessStatusPanel";
import { EventPreviewCard } from "./components/EventPreviewCard";
import { useEventDashboardViewModel } from "./useEventDashboard";

export const EventDashboardView = () => {
  const {
    event,
    displayState,
    primaryAction,
    isPending,
    isLoading,
    isError,
    transition,
    report,
    fulfill,
    revoke,
    isLive,
    operationalStatus,
    showChecklist,
    config,
    thumbnailInputRef,
    THUMB_INPUT_ID,
    thumbnailPreview,
    price,
    handleThumbnailSelect,
    handleThumbnailClear,
    handleThumbnailFileChange,
    setPrice,
  } = useEventDashboardViewModel();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 rounded" />
        <Skeleton className="h-20 w-full rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError || !event || !displayState) {
    return <p className="text-sm text-destructive">Event not found.</p>;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">
          {event.id.slice(0, 7).toUpperCase()}
        </p>
        <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
          Event Status
        </p>
      </div>

      {/* Lifecycle tracker */}
      <div className="rounded-lg border bg-card px-6 py-5">
        <EventLifecycleTracker currentState={displayState} />
      </div>

      {isLive && (
        <OperationalStatusBanner config={config} status={operationalStatus} />
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
        <EventPreviewCard
          event={event}
          thumbnailPreview={thumbnailPreview}
          price={price}
          onThumbnailClick={handleThumbnailSelect}
        />
        {report && (
          <ReadinessStatusPanel
            report={report}
            hasThumbnail={thumbnailPreview !== null}
          />
        )}
      </div>

      {/* Action row */}
      <EventActionPanel
        action={primaryAction}
        isPending={isPending}
        scheduledAt={event.scheduledAt}
        onTransition={transition}
      />

      {/* Controls strip */}
      {showChecklist && report && (
        <ReadinessChecklist
          report={report}
          onFulfill={fulfill}
          onRevoke={revoke}
          thumbnailPreview={thumbnailPreview}
          onThumbnailSelect={handleThumbnailSelect}
          onThumbnailClear={handleThumbnailClear}
          onThumbnailFileChange={handleThumbnailFileChange}
          thumbnailInputId={THUMB_INPUT_ID}
          onPriceSet={setPrice}
        />
      )}

      {/* Hidden file input controlled by ref */}
      <input
        ref={thumbnailInputRef}
        id={THUMB_INPUT_ID}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleThumbnailFileChange}
      />
    </div>
  );
};
