"use client";
import { useEffect, useRef, useState } from "react";
import { useWebGL } from "@/hooks/useMedia";
import { cn } from "@/lib/utils";

/**
 * Mounts a heavy 3D scene only when it approaches the viewport, tells it
 * whether it is visible (so it can pause rendering), and renders `fallback`
 * when WebGL is unavailable.
 */
export default function LazyScene({
  render,
  fallback,
  className,
  rootMargin = "300px",
}: {
  render: (active: boolean) => React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const webgl = useWebGL();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setMounted(true), { rootMargin });
    const vis = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "50px" });
    near.observe(el);
    vis.observe(el);
    return () => {
      near.disconnect();
      vis.disconnect();
    };
  }, [rootMargin]);

  return (
    <div ref={ref} className={cn(className ?? "relative")}>
      {webgl === false ? fallback : mounted && webgl ? render(active) : null}
    </div>
  );
}
