"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/config/site";
import { markIntroDone } from "@/lib/intro";

// Decided once per page load (survives React strict-mode double effects).
let seenBefore: boolean | null = null;

/** Intro loader: shown once per browser session, skipped for reduced motion. */
export default function Loader() {
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);
  // Return visits / reduced motion: remove instantly, without an exit animation.
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (seenBefore === null) {
      try {
        seenBefore = sessionStorage.getItem("intro-seen") === "1";
        sessionStorage.setItem("intro-seen", "1");
      } catch {
        seenBefore = false;
      }
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seenBefore || reduce) {
      setSkip(true);
      setShow(false);
      markIntroDone();
      return;
    }
    const start = performance.now();
    const dur = 1300;
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      setShow(false);
      markIntroDone();
    };
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else timer = setTimeout(finish, 220);
    };
    raf = requestAnimationFrame(tick);
    // Safety net: never let the loader block the page (e.g. throttled background tabs).
    const guard = setTimeout(finish, 3500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      clearTimeout(guard);
    };
  }, []);

  if (skip) return null;
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          data-loader
          key="loader"
          className="fixed inset-0 z-[300] flex flex-col justify-between bg-paper p-5 md:p-10 print:hidden"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden
        >
          <div className="label flex justify-between">
            <span>{site.name} — Portfolio</span>
            <span>©{new Date().getFullYear()}</span>
          </div>
          <div className="mx-auto w-full max-w-sm">
            <div className="flex items-end justify-between">
              <span className="font-display text-2xl font-medium tracking-tight">{site.monogram}</span>
              <span className="font-mono text-sm tabular-nums text-ink">{String(count).padStart(3, "0")}</span>
            </div>
            <div className="mt-3 h-px w-full bg-line">
              <div className="h-px bg-ink transition-[width] duration-100" style={{ width: `${count}%` }} />
            </div>
            <p className="label mt-3">Preparing the exhibition</p>
          </div>
          <div className="label flex justify-between">
            <span>{site.tagline}</span>
            <span className="hidden sm:inline">{site.location}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
