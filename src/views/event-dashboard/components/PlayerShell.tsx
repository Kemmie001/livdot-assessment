import type { ReactNode } from "react";

export const PlayerShell = ({ children }: { children: ReactNode }) => (
  <div className="rounded-lg border overflow-hidden bg-black">
    <div className="relative aspect-video w-full">{children}</div>
  </div>
);
