import { useState } from "react";
import type { AvailableAction, EventState } from "@/data/types/event.types";

type Props = {
  action: AvailableAction;
  scheduledAt?: string;
  onTransition: (targetState: EventState, scheduledAt?: string) => void;
};

export const useEventActionPanel = ({
  action,
  scheduledAt,
  onTransition,
}: Props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [datePart, setDatePart] = useState("");
  const [timePart, setTimePart] = useState("");

  const needsDate = action.targetState === "scheduled" && !scheduledAt;
  const isGoLive = action.targetState === "live";
  const today = new Date().toISOString().split("T")[0];

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
    // Explicit UTC construction to avoid local-timezone offset surprises
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = timePart
      ? timePart.split(":").map(Number)
      : [0, 0];
    const iso = new Date(
      Date.UTC(year, month - 1, day, hours, minutes),
    ).toISOString();
    setDatePickerOpen(false);
    onTransition(action.targetState, iso);
  };

  return {
    confirmOpen,
    setConfirmOpen,
    datePickerOpen,
    setDatePickerOpen,
    datePart,
    setDatePart,
    timePart,
    setTimePart,
    needsDate,
    isGoLive,
    today,
    handleClick,
    handleConfirm,
    handleDateConfirm,
  };
};
