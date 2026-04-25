import { useState } from "react";
import { Loader2, Radio } from "lucide-react";
import { Button } from "@/views/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/views/shadcn/dialog";
import { Input } from "@/views/shadcn/input";
import { REQUIREMENT_META } from "@/constants/readinessRequirements";
import { STATE_DESCRIPTIONS } from "@/constants/eventLifecycle";
import type { AvailableAction, EventState } from "@/data/types/event.types";

type Props = {
  action: AvailableAction | null;
  isPending: boolean;
  scheduledAt?: string;
  onTransition: (targetState: EventState, scheduledAt?: string) => void;
};

export const EventActionPanel = ({
  action,
  isPending,
  scheduledAt,
  onTransition,
}: Props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [datePart, setDatePart] = useState("");
  const [timePart, setTimePart] = useState("");

  if (!action) {
    return (
      <p className="text-sm text-muted-foreground">
        This event has reached its final state.
      </p>
    );
  }

  const isScheduleAction = action.targetState === "scheduled";
  const needsDate = isScheduleAction && !scheduledAt;

  const handleClick = () => {
    if (needsDate) {
      setDatePickerOpen(true);
    } else if (action.requiresConfirmation) {
      setConfirmOpen(true);
    } else {
      onTransition(action.targetState);
    }
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    onTransition(action.targetState);
  };

  const handleDateConfirm = () => {
    if (!datePart) return;
    const iso = timePart
      ? new Date(`${datePart}T${timePart}`).toISOString()
      : new Date(`${datePart}T00:00:00`).toISOString();
    setDatePickerOpen(false);
    onTransition(action.targetState, iso);
  };

  const blockedReason = action.blockedReason;
  const isGoLive = action.targetState === "live";
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Button
          className="shrink-0 gap-2"
          disabled={action.blocked || isPending}
          onClick={handleClick}
          variant={
            action.targetState === "completed" ? "destructive" : "default"
          }
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isGoLive ? (
            <Radio className="h-4 w-4" />
          ) : null}
          {isPending ? "Processing…" : action.label}
        </Button>

        <p className="text-sm text-muted-foreground">
          {blockedReason?.type === "host_action_required"
            ? `Complete: ${REQUIREMENT_META[blockedReason.requirement.key].label}`
            : blockedReason?.type === "awaiting_external"
              ? `Waiting for crew: ${REQUIREMENT_META[blockedReason.requirement.key].label}`
              : STATE_DESCRIPTIONS[action.targetState]}
        </p>
      </div>

      {/* Date picker dialog for scheduling without an existing date */}
      <Dialog open={datePickerOpen} onOpenChange={setDatePickerOpen}>
        <DialogContent className="sm:max-w-sm overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-black">Set Event Date</DialogTitle>
            <DialogDescription>
              Pick a date and time for this event before scheduling.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input
              type="date"
              min={today}
              value={datePart}
              onChange={(e) => setDatePart(e.target.value)}
            />
            <Input
              type="time"
              value={timePart}
              disabled={!datePart}
              onChange={(e) => setTimePart(e.target.value)}
            />
          </div>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" onClick={() => setDatePickerOpen(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={!datePart}
              onClick={handleDateConfirm}
            >
              Schedule Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* End broadcast confirmation */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-black">End Broadcast?</DialogTitle>
            <DialogDescription>
              This will end the live stream for all viewers. This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleConfirm}
            >
              End Broadcast
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
