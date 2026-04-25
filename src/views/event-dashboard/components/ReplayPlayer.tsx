import HlsVideo from "hls-video-element/react";
import { PlayerShell } from "./PlayerShell";
import { STREAM_URL } from "./useLiveStream";

export const ReplayPlayer = () => (
  <PlayerShell>
    <HlsVideo
      src={STREAM_URL}
      controls
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    />

    {/* REPLAY badge */}
    <div className="pointer-events-none absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
      REPLAY
    </div>
  </PlayerShell>
);
