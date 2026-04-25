import { useNavigate, useParams } from "@tanstack/react-router";
import { useEventStateMachine } from "@/data/queries/useEventStateMachine";
import { useReadinessDerived } from "@/data/queries/useReadinessDerived";
import { useOperationalStatus } from "@/data/queries/useOperationalStatus";
import { operationalService } from "@/data/services/operationalService";
import type { OperationalStatus } from "@/data/services/operationalService";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const useEventDashboardViewModel = () => {
  const { eventId } = useParams({ from: "/events/$eventId/" });
  const navigate = useNavigate();
  const {
    event,
    displayState,
    primaryAction,
    blockedReasons,
    isPending,
    isLoading,
    isError,
    transition,
  } = useEventStateMachine(eventId);

  useEffect(() => {
    if (isError) navigate({ to: "/events" });
  }, [isError, navigate]);

  const {
    report,
    isReady,
    missingRequirements,
    completionCount,
    fulfill,
    revoke,
  } = useReadinessDerived(eventId);

  const isLive = displayState === "live";
  const { data: operationalStatus } = useOperationalStatus(eventId, isLive);

  const showChecklist =
    displayState !== null &&
    !["live", "completed", "replay_available"].includes(displayState);

  const setOperationalStatus = (status: OperationalStatus) =>
    operationalService.setStatus(eventId, status);
  const config = {
    nominal: {
      icon: CheckCircle,
      message: "Stream is running normally",
      className: "border-emerald-200 bg-emerald-50 text-emerald-800",
      iconClass: "text-emerald-600",
    },
    degraded: {
      icon: AlertTriangle,
      message: "Stream quality is degraded — monitoring the situation",
      className: "border-yellow-200 bg-yellow-50 text-yellow-800",
      iconClass: "text-yellow-600",
    },
    stream_failed: {
      icon: XCircle,
      message: "Stream has failed — contact operations immediately",
      className: "border-red-200 bg-red-50 text-red-800",
      iconClass: "text-red-600",
    },
  };

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(event?.thumbnailUrl ?? null);
  const [price, setPrice] = useState<number | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const THUMB_INPUT_ID = "event-thumbnail-upload";

  const handleThumbnailFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleThumbnailSelect = () => {
    thumbnailInputRef.current?.click();
  };

  const handleThumbnailClear = () => {
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  };

  return {
    eventId,
    event,
    displayState,
    primaryAction,
    blockedReasons,
    isPending,
    isLoading,
    isError,
    transition,
    report,
    isReady,
    missingRequirements,
    completionCount,
    fulfill,
    revoke,
    isLive,
    operationalStatus: operationalStatus ?? "nominal",
    showChecklist,
    setOperationalStatus,
    config,
    thumbnailInputRef,
    THUMB_INPUT_ID,
    thumbnailPreview,
    price,
    handleThumbnailSelect,
    handleThumbnailClear,
    handleThumbnailFileChange,
    setPrice,
  };
};
