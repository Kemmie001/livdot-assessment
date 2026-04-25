import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/views/shadcn/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/views/shadcn/form";
import { Input } from "@/views/shadcn/input";
import { Button } from "@/views/shadcn/button";
import { useEventListViewModel } from "../useEventList";

export const CreateEventModal = () => {
  const { activeModal, form, onSubmit, isPending, handleOpenChange } =
    useEventListViewModel();

  return (
    <Dialog
      open={activeModal === "create_event"}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="sm:max-w-md p-6 gap-0">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-base font-semibold text-foreground">
            Create new event
          </DialogTitle>
        </DialogHeader>

        {/* Info banner */}
        <div className="flex items-start gap-1 rounded-lg bg-blue-50 border border-blue-100 px-2 py-2 mb-8">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600">
            <Info className="h-3 w-3 text-white" />
          </span>
          <p className="text-sm text-blue-800 leading-snug">
            Your event starts in <strong>draft</strong> — you can configure
            pricing and crew after creation.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground">
                    Event title <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Product Launch Keynote"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scheduledAt"
              render={({ field }) => {
                const iso = field.value ?? "";
                const datePart = iso ? iso.slice(0, 10) : "";
                const timePart = iso ? iso.slice(11, 16) : "";

                const combine = (date: string, time: string) => {
                  if (!date) return field.onChange(undefined);
                  field.onChange(
                    new Date(`${date}T${time || "00:00"}:00`).toISOString(),
                  );
                };

                return (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">
                      Date & time{" "}
                    </FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      <FormControl>
                        <Input
                          type="date"
                          value={datePart}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => combine(e.target.value, timePart)}
                        />
                      </FormControl>
                      <Input
                        type="time"
                        value={timePart}
                        disabled={!datePart}
                        onChange={(e) => combine(datePart, e.target.value)}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground">
                    Description{" "}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief description of the event"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className=" px-5 text-sm "
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                type="submit"
                disabled={isPending}
                className="flex-1  cursor-pointer text-sm "
              >
                {isPending ? "Creating..." : "Create event"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
