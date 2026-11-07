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

  useEffect(() => {
    if (seenBefore === null) {
      try {
        seenBefore = sessionStorage.getItem("intro-seen") === "1";
        sessionStorage.setItem("intro-seen", "1");
      } catch {
        seenBefore = false;
      }
    }
    const seen = seenBefore;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setShow(false);
      markIntroDone();
      return;
    }
    const start = performance.now();
    const dur = 1500;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setShow(false);
          markIntroDone();
        }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          data-loader
          key="loader"
          className="fixed inset-0 z-[300] flex flex-col justify-between overflow-hidden bg-ink p-6 md:p-10"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden
        >
          <div className="flex justify-between tech-label">
            <span>| Loading exhibition |</span>
            <span>{site.wordmark} ©{new Date().getFullYear()}</span>
          </div>
          <div className="relative flex items-center justify-center">
            <span className="font-drip text-[28vw] leading-none text-bone md:text-[18vw]">{site.monogram}</span>
            <span
              className="absolute bottom-[8%] left-1/2 h-3 -translate-x-1/2 bg-acid transition-[width] duration-100"
              style={{ width: `${count * 0.5}%` }}
            />
          </div>
          <div className="flex items-end justify-between">
            <span className="tech-label max-w-[14rem]">Design / UIUX / Creative development</span>
            <span className="font-display text-6xl leading-none text-acid tabular-nums md:text-8xl">
              {String(count).padStart(3, "0")}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
