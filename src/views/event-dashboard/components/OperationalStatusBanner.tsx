import { Alert } from "@/views/shadcn/alert";
import { cn } from "@/lib/utils";
import { operationalConfig } from "@/views/event-dashboard/useEventDashboard";
import type { OperationalStatus } from "@/data/services/operationalService";

type Props = {
  status: OperationalStatus;
};

export const OperationalStatusBanner = ({ status }: Props) => {
  const { icon: Icon, message, className, iconClass } = operationalConfig[status];

  return (
    <Alert className={cn("flex items-center gap-3", className)}>
      <Icon className={cn("h-4 w-4 shrink-0", iconClass)} />
      <span className="text-sm font-medium">{message}</span>
    </Alert>
  );
};
