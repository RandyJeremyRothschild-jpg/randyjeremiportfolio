"use client";
import type Lenis from "lenis";

/** Module-level handle on the Lenis instance (set by <SmoothScroll/>). */
let lenis: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  lenis = l;
};
export const getLenis = () => lenis;

/** Scroll to an element id or a y offset, using Lenis when available. */
export function scrollToTarget(target: string | number, opts: { immediate?: boolean } = {}) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : null;
  if (typeof target === "string" && !el) return;
  if (lenis) {
    lenis.scrollTo(el ?? (target as number), { offset: 0, duration: 1.4, immediate: opts.immediate });
  } else if (el) {
    el.scrollIntoView({ behavior: opts.immediate ? "auto" : "smooth" });
  } else {
    window.scrollTo({ top: target as number, behavior: opts.immediate ? "auto" : "smooth" });
  }
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
