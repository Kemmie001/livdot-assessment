import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_ITEMS } from "@/constants/eventLifecycle";
import type { ReadinessReport } from "@/data/types/readiness.types";

export const ReadinessStatusPanel = ({
  report,
  hasThumbnail,
}: {
  report: ReadinessReport;
  hasThumbnail: boolean;
}) => {
  const backendSatisfied = report.requirements.filter(
    (r) => r.satisfied,
  ).length;
  const thumbnailSatisfied = hasThumbnail ? 1 : 0;
  const total = STATUS_ITEMS.length + 1;
  const satisfied = backendSatisfied + thumbnailSatisfied;

  return (
    <div className="rounded-lg border text-left overflow-hidden h-fit">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
          Operational Readiness
        </span>
        <span className="text-xs font-medium text-foreground">
          {satisfied}/{total}
        </span>
      </div>
      <div className="divide-y">
        {STATUS_ITEMS.map((item) => {
          const isSatisfied =
            report.requirements.find((r) => r.key === item.key)?.satisfied ??
            false;
          return (
            <div key={item.key} className="flex items-start gap-3 px-4 py-3">
              <div
                className={cn(
                  "mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0",
                  isSatisfied
                    ? "bg-emerald-500/15 text-emerald-500"
                    : "bg-red-500/15 text-red-500",
                )}
              >
                {isSatisfied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )}
              </div>
              <div>
                <p className="text-sm text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
        <div className="flex items-start gap-3 px-4 py-3">
          <div
            className={cn(
              "mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0",
              hasThumbnail
                ? "bg-emerald-500/15 text-emerald-500"
                : "bg-red-500/15 text-red-500",
            )}
          >
            {hasThumbnail ? (
              <Check className="h-3 w-3" />
            ) : (
              <X className="h-3 w-3" />
            )}
          </div>
          <div>
            <p className="text-sm text-foreground">Event Thumbnail</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              A thumbnail image must be uploaded for the event listing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
