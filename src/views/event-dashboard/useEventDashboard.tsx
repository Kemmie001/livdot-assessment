import { useNavigate, useParams } from "@tanstack/react-router";
import { useEventStateMachine } from "@/data/queries/useEventStateMachine";
import { useReadinessDerived } from "@/data/queries/useReadinessDerived";
import { useOperationalStatus } from "@/data/queries/useOperationalStatus";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const THUMB_INPUT_ID = "event-thumbnail-upload";

export const operationalConfig = {
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

export const useEventDashboard = () => {
  const { eventId } = useParams({ from: "/events/$eventId/" });
  const navigate = useNavigate();
  const {
    event,
    displayState,
    primaryAction,
    isPending,
    isLoading,
    isError,
    transition,
  } = useEventStateMachine(eventId);

  useEffect(() => {
    if (isError) navigate({ to: "/events" });
  }, [isError, navigate]);

  const { report, isReady, fulfill, revoke } = useReadinessDerived(eventId);

  const isLive = displayState === "live";
  const isReplayAvailable = displayState === "replay_available";
  const { data: operationalStatus } = useOperationalStatus(eventId, isLive);

  const showChecklist =
    displayState !== null &&
    !["live", "completed", "replay_available"].includes(displayState) &&
    !isReady;

  const showReadinessPanel = !!report && !isReady;

  const [uploadedThumbnail, setUploadedThumbnail] = useState<string | null>(
    null,
  );
  const thumbnailPreview = uploadedThumbnail ?? event?.thumbnailUrl ?? null;

  const [price, setPrice] = useState<number | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) setUploadedThumbnail(URL.createObjectURL(file));
  };

  const handleThumbnailSelect = () => thumbnailInputRef.current?.click();

  const handleThumbnailClear = () => {
    setUploadedThumbnail(null);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  };

  return {
    event,
    displayState,
    primaryAction,
    isPending,
    isLoading,
    isError,
    transition,
    report,
    isReady,
    fulfill,
    revoke,
    isLive,
    isReplayAvailable,
    operationalStatus: operationalStatus ?? "nominal",
    showChecklist,
    showReadinessPanel,
    thumbnailInputRef,
    thumbnailPreview,
    price,
    handleThumbnailSelect,
    handleThumbnailClear,
    handleThumbnailFileChange,
    setPrice,
  };
};
