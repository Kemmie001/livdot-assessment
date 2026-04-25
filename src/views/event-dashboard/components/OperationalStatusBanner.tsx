import { type LucideIcon } from "lucide-react";
import { Alert } from "@/views/shadcn/alert";
import { cn } from "@/lib/utils";
import type { OperationalStatus } from "@/data/services/operationalService";

type Props = {
  status: OperationalStatus;
  config: {
    [key: string]: {
      icon: LucideIcon;
      message: string;
      className: string;
      iconClass: string;
    };
  };
};

export const OperationalStatusBanner = ({ status, config }: Props) => {
  const { icon: Icon, message, className, iconClass } = config[status];

  return (
    <Alert className={cn("flex items-center gap-3", className)}>
      <Icon className={cn("h-4 w-4 shrink-0", iconClass)} />
      <span className="text-sm font-medium">{message}</span>
    </Alert>
  );
};
