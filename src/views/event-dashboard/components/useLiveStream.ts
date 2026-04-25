import { useEffect, useState } from "react";

export const STREAM_URL =
  "https://devstreaming-cdn.apple.com/videos/streaming/examples/adv_dv_atmos/main.m3u8";

export const useLiveStream = () => {
  const [viewers, setViewers] = useState(
    () => Math.floor(Math.random() * 200) + 50,
  );
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setViewers((c) =>
        Math.max(10, c + Math.floor((Math.random() - 0.4) * 15)),
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return { viewers, elapsed };
};
