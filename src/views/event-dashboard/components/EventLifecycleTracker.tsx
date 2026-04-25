import { Check } from "lucide-react";
import {
  ORDERED_STATES,
  SHORT_LABELS,
  STATE_DESCRIPTIONS,
} from "@/constants/eventLifecycle";
import { cn } from "@/lib/utils";
import type { EventState } from "@/data/types/event.types";

type Props = { currentState: EventState };

export const EventLifecycleTracker = ({ currentState }: Props) => {
  const currentIndex = ORDERED_STATES.indexOf(currentState);
  const total = ORDERED_STATES.length;

  return (
    <>
      {/* Mobile: current step card + segmented progress bar */}
      <div className="sm:hidden space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold ring-4 ring-primary/20 shrink-0 mt-0.5">
            {currentIndex + 1}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground leading-tight">
              {SHORT_LABELS[currentState]}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {STATE_DESCRIPTIONS[currentState]}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1.5 tracking-widest uppercase">
              Step {currentIndex + 1} of {total}
            </p>
          </div>
        </div>

        <div className="flex gap-1">
          {ORDERED_STATES.map((state, index) => (
            <div
              key={state}
              className={cn(
                "h-1 flex-1 rounded-full transition-all duration-300",
                index < currentIndex
                  ? "bg-primary"
                  : index === currentIndex
                    ? "bg-primary/50"
                    : "bg-muted",
              )}
            />
          ))}
        </div>

        {currentIndex < total - 1 && (
          <p className="text-[11px] text-muted-foreground">
            Next:{" "}
            <span className="text-foreground font-medium">
              {SHORT_LABELS[ORDERED_STATES[currentIndex + 1]]}
            </span>
          </p>
        )}
      </div>

      {/* Desktop: horizontal stepper */}
      <div className="hidden sm:flex items-center gap-0">
        {ORDERED_STATES.map((state, index) => {
          const isPast = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={state}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all",
                    isPast &&
                      "bg-primary border-primary text-primary-foreground",
                    isCurrent &&
                      "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20",
                    !isPast &&
                      !isCurrent &&
                      "bg-background border-muted text-muted-foreground",
                  )}
                >
                  {isPast ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "text-[10px] text-center leading-tight w-14",
                    isCurrent && "text-primary font-medium",
                    !isCurrent && "text-muted-foreground",
                  )}
                >
                  {SHORT_LABELS[state]}
                </span>
              </div>
              {index < total - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mb-5 mx-1 transition-colors duration-300",
                    index < currentIndex ? "bg-primary" : "bg-muted",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
