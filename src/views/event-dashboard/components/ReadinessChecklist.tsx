import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/views/shadcn/button";
import { Input } from "@/views/shadcn/input";
import { Switch } from "@/views/shadcn/switch";
import { REQUIREMENT_META } from "@/constants/readinessRequirements";
import { RequirementKey } from "@/data/types/readiness.types";
import type { ReadinessReport } from "@/data/types/readiness.types";

type Props = {
  report: ReadinessReport;
  onFulfill: (key: RequirementKey) => void;
  onRevoke: (key: RequirementKey) => void;
  thumbnailPreview: string | null;
  onThumbnailSelect: () => void;
  onThumbnailClear: () => void;
  onThumbnailFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  thumbnailInputId: string;
  onPriceSet: (price: number) => void;
};

const ControlRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b last:border-0 px-4">
    <span className="text-sm text-muted-foreground">{label}</span>
    <div className="flex items-center gap-2 shrink-0">{children}</div>
  </div>
);

export const ReadinessChecklist = ({
  report,
  onFulfill,
  onRevoke,
  thumbnailPreview,
  onThumbnailSelect,
  onThumbnailClear,
  onThumbnailFileChange,
  thumbnailInputId,
  onPriceSet,
}: Props) => {
  const [priceValue, setPriceValue] = useState("");

  const getSatisfied = (key: RequirementKey) =>
    report.requirements.find((r) => r.key === key)?.satisfied ?? false;

  const handleToggle = (key: RequirementKey) => {
    if (getSatisfied(key)) onRevoke(key);
    else onFulfill(key);
  };

  const handlePriceSet = () => {
    const parsed = parseFloat(priceValue);
    if (!isNaN(parsed) && parsed >= 0) {
      onPriceSet(parsed);
      onFulfill(RequirementKey.TicketPricingConfigured);
    }
  };

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <span className="text-xs text-muted-foreground">
          Event Controls — Operational Readiness
        </span>
      </div>

      <ControlRow
        label={REQUIREMENT_META[RequirementKey.ProductionCrewAssigned].label}
      >
        <Switch
          checked={getSatisfied(RequirementKey.ProductionCrewAssigned)}
          onCheckedChange={() =>
            handleToggle(RequirementKey.ProductionCrewAssigned)
          }
        />
      </ControlRow>

      <ControlRow
        label={REQUIREMENT_META[RequirementKey.StreamingIngestConfigured].label}
      >
        <Switch
          checked={getSatisfied(RequirementKey.StreamingIngestConfigured)}
          onCheckedChange={() =>
            handleToggle(RequirementKey.StreamingIngestConfigured)
          }
        />
      </ControlRow>

      <ControlRow
        label={REQUIREMENT_META[RequirementKey.TicketPricingConfigured].label}
      >
        {getSatisfied(RequirementKey.TicketPricingConfigured) ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground">
              ${priceValue || "—"}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-muted-foreground"
              onClick={() => onRevoke(RequirementKey.TicketPricingConfigured)}
            >
              Edit
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                $
              </span>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={priceValue}
                onChange={(e) => setPriceValue(e.target.value)}
                className="pl-5 h-7 w-24 text-sm"
              />
            </div>
            <Button
              size="sm"
              variant="default"
              onClick={handlePriceSet}
              disabled={!priceValue}
            >
              Set
            </Button>
          </div>
        )}
      </ControlRow>

      <ControlRow label="Event Thumbnail">
        <input
          id={thumbnailInputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onThumbnailFileChange}
        />
        {thumbnailPreview ? (
          <div className="flex items-center gap-2">
            <img
              src={thumbnailPreview}
              alt="Thumbnail"
              className="h-8 w-14 rounded object-cover"
            />
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={onThumbnailSelect}
            >
              Replace
            </Button>
            <button
              type="button"
              onClick={onThumbnailClear}
              className="h-6 w-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={onThumbnailSelect}
          >
            Upload
          </Button>
        )}
      </ControlRow>
    </div>
  );
};
