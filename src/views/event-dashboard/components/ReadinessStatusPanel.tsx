import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_ITEMS } from "@/constants/eventLifecycle";
import type { ReadinessReport } from "@/data/types/readiness.types";

const THUMBNAIL_ITEM = {
  label: "Event Thumbnail",
  description: "A thumbnail image must be uploaded for the event listing.",
};

const StatusIcon = ({ satisfied }: { satisfied: boolean }) => (
  <div
    className={cn(
      "mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0",
      satisfied ? "bg-emerald-500/15 text-emerald-500" : "bg-red-500/15 text-red-500",
    )}
  >
    {satisfied ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
  </div>
);

const ReadinessRow = ({ label, description, satisfied }: { label: string; description: string; satisfied: boolean }) => (
  <div className="flex items-start gap-3 px-4 py-3">
    <StatusIcon satisfied={satisfied} />
    <div>
      <p className="text-sm text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  </div>
);

export const ReadinessStatusPanel = ({
  report,
  hasThumbnail,
}: {
  report: ReadinessReport;
  hasThumbnail: boolean;
}) => {
  const satisfied = report.requirements.filter((r) => r.satisfied).length + (hasThumbnail ? 1 : 0);
  const total = STATUS_ITEMS.length + 1;

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
        {STATUS_ITEMS.map((item) => (
          <ReadinessRow
            key={item.key}
            label={item.label}
            description={item.description}
            satisfied={report.requirements.find((r) => r.key === item.key)?.satisfied ?? false}
          />
        ))}
        <ReadinessRow
          label={THUMBNAIL_ITEM.label}
          description={THUMBNAIL_ITEM.description}
          satisfied={hasThumbnail}
        />
      </div>
    </div>
  );
};
