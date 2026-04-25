import { useEvents } from "@/data/queries/useEvents";
import { useUiStore } from "@/store/uiStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { CreateEventPayload } from "@/data/types/event.types";
import { CreateEventPayloadSchema } from "@/data/schemas/event.schema";
import { useCreateEvent } from "@/data/queries/useCreateEvent";
import { useNavigate } from "@tanstack/react-router";

export const useEventListViewModel = () => {
  const { data: events, isLoading, isError } = useEvents();
  const openModal = useUiStore((s) => s.openModal);
  const navigate = useNavigate();

  const form = useForm<CreateEventPayload>({
    resolver: zodResolver(CreateEventPayloadSchema),
    defaultValues: { title: "", description: "", scheduledAt: undefined },
  });
  const { activeModal, closeModal } = useUiStore();
  const { mutate: createEvent, isPending } = useCreateEvent();
  const onSubmit = (data: CreateEventPayload) => {
    createEvent(data, {
      onSuccess: (event) => {
        closeModal();
        form.reset();
        navigate({ to: "/events/$eventId", params: { eventId: event.id } });
      },
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal();
      form.reset();
    }
  };

  return {
    events,
    isLoading,
    isError,
    openModal,
    form,
    onSubmit,
    closeModal,
    isPending,
    handleOpenChange,
    activeModal,
  };
};
