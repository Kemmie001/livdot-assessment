import { Radio, Users } from "lucide-react";
import HlsVideo from "hls-video-element/react";
import { PlayerShell } from "./PlayerShell";
import { STREAM_URL, useLiveStream } from "./useLiveStream";
import { formatElapsed } from "@/utils/eventStateUtils";

export const LiveStreamSimulator = ({ title }: { title: string }) => {
  const { viewers, elapsed } = useLiveStream();

  return (
    <PlayerShell>
      <HlsVideo
        src={STREAM_URL}
        playsInline
        controls
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* LIVE badge */}
      <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
        <Radio className="h-3 w-3 animate-pulse" />
        LIVE
      </div>

      {/* Elapsed timer */}
      <div className="pointer-events-none absolute top-3 right-3 bg-black/60 text-white text-xs font-mono px-2 py-1 rounded">
        {formatElapsed(elapsed)}
      </div>

      {/* Viewer count */}
      <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
        <Users className="h-3.5 w-3.5" />
        <span className="tabular-nums font-medium">
          {viewers.toLocaleString()}
        </span>
        <span className="text-white/70">watching</span>
      </div>

      {/* Title overlay */}
      <div className="pointer-events-none absolute bottom-3 left-3 max-w-[60%] bg-black/60 text-white text-xs px-2.5 py-1 rounded truncate">
        {title}
      </div>
    </PlayerShell>
  );
};
