"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor: a small dot + a lagging ring that inverts against whatever is
 * behind it. Elements can set data-cursor="View" (or any label) to morph the
 * ring into a labelled lime pill. Only active for fine pointers with motion allowed.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    let x = -100, y = -100, rx = -100, ry = -100, raf = 0, visible = false;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        rx = x;
        ry = y;
        if (dot.current) dot.current.style.opacity = "1";
        if (ring.current) ring.current.style.opacity = "1";
      }
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("a,button,[data-cursor],input,textarea,label,select");
      setHover(!!t && !t.matches("input,textarea"));
      setLabel(t?.dataset.cursor ?? document.documentElement.dataset.cursor ?? null);
    };
    const leave = () => {
      visible = false;
      if (dot.current) dot.current.style.opacity = "0";
      if (ring.current) ring.current.style.opacity = "0";
    };
    const loop = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const pd = () => setDown(true);
    const pu = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", pd);
    window.addEventListener("pointerup", pu);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", pd);
      window.removeEventListener("pointerup", pu);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  if (!enabled) return null;

  const size = (hover ? 44 : 28) * (down ? 0.85 : 1);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[400] print:hidden">
      <div
        ref={ring}
        className="absolute left-0 top-0 opacity-0"
        style={{ willChange: "transform", mixBlendMode: label ? "normal" : "difference" }}
      >
        {label ? (
          <div className="-translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-lime px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink shadow-[0_6px_24px_rgb(23_25_28/0.18)]">
            {label}
          </div>
        ) : (
          <div
            className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 transition-[width,height,background-color] duration-300 ease-[var(--ease-expo)]"
            style={{ width: size, height: size, background: hover ? "rgb(255 255 255 / 0.18)" : "transparent" }}
          />
        )}
      </div>
      <div ref={dot} className="absolute left-0 top-0 opacity-0 mix-blend-difference">
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" style={{ opacity: label ? 0 : 1 }} />
      </div>
    </div>
  );
}
