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
import { useEventActionPanel } from "./useEventActionPanel";

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
  if (!action) {
    return (
      <p className="text-sm text-muted-foreground">
        This event has reached its final state.
      </p>
    );
  }
  return (
    <ActiveActionPanel
      action={action}
      isPending={isPending}
      scheduledAt={scheduledAt}
      onTransition={onTransition}
    />
  );
};

type ActiveProps = {
  action: AvailableAction;
  isPending: boolean;
  scheduledAt?: string;
  onTransition: (targetState: EventState, scheduledAt?: string) => void;
};

const ActiveActionPanel = ({
  action,
  isPending,
  scheduledAt,
  onTransition,
}: ActiveProps) => {
  const vm = useEventActionPanel({
    action,
    scheduledAt,
    onTransition,
  });

  const { blockedReason } = action;
  const description =
    blockedReason?.type === "host_action_required"
      ? `Complete: ${REQUIREMENT_META[blockedReason.requirement.key].label}`
      : blockedReason?.type === "awaiting_external"
        ? `Waiting for crew: ${REQUIREMENT_META[blockedReason.requirement.key].label}`
        : STATE_DESCRIPTIONS[action.targetState];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Button
          className="shrink-0 gap-2"
          disabled={action.blocked || isPending}
          onClick={vm.handleClick}
          variant={
            action.targetState === "completed" ? "destructive" : "default"
          }
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : vm.isGoLive ? (
            <Radio className="h-4 w-4" />
          ) : null}
          {isPending ? "Processing…" : action.label}
        </Button>

        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Date picker dialog for scheduling without an existing date */}
      <Dialog open={vm.datePickerOpen} onOpenChange={vm.setDatePickerOpen}>
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
              min={vm.today}
              value={vm.datePart}
              onChange={(e) => vm.setDatePart(e.target.value)}
            />
            <Input
              type="time"
              value={vm.timePart}
              disabled={!vm.datePart}
              onChange={(e) => vm.setTimePart(e.target.value)}
            />
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => vm.setDatePickerOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={!vm.datePart}
              onClick={vm.handleDateConfirm}
            >
              Schedule Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* End broadcast confirmation */}
      <Dialog open={vm.confirmOpen} onOpenChange={vm.setConfirmOpen}>
        <DialogContent className="sm:max-w-sm overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-black">End Broadcast?</DialogTitle>
            <DialogDescription>
              This will end the live stream for all viewers. This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" onClick={() => vm.setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={vm.handleConfirm}
            >
              End Broadcast
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
