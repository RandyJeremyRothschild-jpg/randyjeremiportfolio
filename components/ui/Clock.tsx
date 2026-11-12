"use client";
import { useEffect, useState } from "react";
import { site } from "@/config/site";

/** Live local time in the configured timezone. Renders dashes until mounted. */
export default function Clock({ seconds = false, className }: { seconds?: boolean; className?: string }) {
  const [now, setNow] = useState<string>(seconds ? "--:--:--" : "--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      ...(seconds ? { second: "2-digit" } : {}),
      hour12: false,
      timeZone: site.timezone,
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, seconds ? 1000 : 15000);
    return () => clearInterval(id);
  }, [seconds]);
  return <span className={className}>{now}</span>;
}
