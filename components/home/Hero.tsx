"use client";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { site } from "@/config/site";
import { useIntroDone } from "@/lib/intro";
import { useReducedMotion } from "@/hooks/useMedia";
import LazyScene from "@/components/three/LazyScene";
import { HeroScene } from "@/components/three";
import Button from "@/components/ui/Button";
import Magnetic from "@/components/ui/Magnetic";
import { RevealText } from "@/components/ui/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Static stand-in for the 3D object when WebGL is unavailable. */
function ObjectFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center lg:left-[40%]" aria-hidden>
      <svg viewBox="0 0 400 400" className="w-[min(70vw,440px)] -translate-y-[12vh] lg:translate-y-0">
        <ellipse cx="200" cy="200" rx="170" ry="60" fill="none" stroke="#17191C" strokeWidth="2" transform="rotate(-24 200 200)" />
        <ellipse cx="200" cy="200" rx="140" ry="120" fill="none" stroke="#9aa0a6" strokeWidth="3" transform="rotate(38 200 200)" />
        <ellipse cx="200" cy="200" rx="110" ry="36" fill="none" stroke="#A9BFFF" strokeWidth="3" transform="rotate(70 200 200)" />
        <rect x="158" y="158" width="84" height="84" rx="20" fill="#fff" stroke="#E4E6E2" strokeWidth="2" transform="rotate(18 200 200)" />
        <circle cx="200" cy="200" r="20" fill="#C5F36A" />
      </svg>
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const ready = useIntroDone();
  const reduced = useReducedMotion();
  const [aligned, setAligned] = useState(false);

  const fade = (delay: number) => ({
    "data-motion": true,
    initial: { opacity: 0, y: 16 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <section ref={ref} id="top" data-nav="home" className="relative flex min-h-svh flex-col overflow-hidden">
      {/* faint construction grid behind the object */}
      <div
        aria-hidden
        className="grid-paper absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_35%,black,transparent)] lg:[mask-image:radial-gradient(ellipse_45%_70%_at_70%_48%,black,transparent)]"
      />

      {/* 3D centerpiece */}
      <LazyScene
        className="absolute inset-0"
        rootMargin="0px"
        fallback={<ObjectFallback />}
        render={(active) => <HeroScene active={active} reduced={reduced} eventSource={ref} onAligned={setAligned} />}
      />

      {/* object annotations (desktop) */}
      <motion.div {...fade(1.1)} aria-hidden className="pointer-events-none absolute right-10 top-[22%] hidden text-right lg:block">
        <p className="label text-ink">Obj. 01 — Gimbal</p>
        <p className="label mt-1">3 rings / 1 core</p>
      </motion.div>
      <motion.div {...fade(1.2)} aria-hidden className="pointer-events-none absolute right-10 top-[30%] hidden lg:block">
        <p className="label flex items-center justify-end gap-2">
          State
          <span className="rounded-full border border-ink/15 bg-surface/70 px-2.5 py-1 text-ink backdrop-blur">
            <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${aligned ? "bg-lime ring-1 ring-ink/30" : "bg-sky ring-1 ring-ink/20"}`} />
            {aligned ? "Aligned — clarity" : "Free — curiosity"}
          </span>
        </p>
        <p className="label mt-2 text-right">Drag to rotate · Click to {aligned ? "release" : "align"}</p>
      </motion.div>

      <div className="wrap relative z-10 flex flex-1 flex-col justify-end pb-6 pt-28 md:pb-8">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.p {...fade(0.15)} className="label mb-5 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-lime ring-1 ring-ink/30" aria-hidden />
              Portfolio {new Date().getFullYear()}
              <span className="h-px w-8 bg-current opacity-40" aria-hidden />
              {site.location}
            </motion.p>
            <RevealText
              as="h1"
              immediate
              play={ready}
              delay={0.2}
              stagger={0.07}
              text={"Designing\n*with clarity.\nBuilding\n*with curiosity."}
              highlightClassName="text-muted"
              className="h-display text-[clamp(2.2rem,9.6vw,3.9rem)] md:text-[clamp(3.6rem,5.5vw,6rem)]"
            />
          </div>

          <div className="lg:col-span-4 lg:col-start-9 lg:pb-2">
            <motion.p {...fade(0.7)} className="max-w-sm text-[15px] leading-relaxed text-ink/80 md:text-base">
              {site.hero.intro}
            </motion.p>
            <motion.div {...fade(0.85)} className="mt-6 flex flex-wrap gap-3">
              <Magnetic strength={0.2}>
                <Button href="/portfolio">Explore work</Button>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Button href="/cv" variant="outline">
                  View CV
                </Button>
              </Magnetic>
            </motion.div>
          </div>
        </div>

        {/* bottom strip */}
        <motion.div {...fade(1)} className="mt-8 flex items-center justify-between gap-6 border-t border-line pt-4 md:mt-12">
          <ul className="label hidden gap-x-8 gap-y-1 sm:flex">
            {site.disciplines.map((d, i) => (
              <li key={d}>
                <span className="text-ink">0{i + 1}</span> {d}
              </li>
            ))}
          </ul>
          <a href="#about" className="label group flex items-center gap-3 text-ink" aria-label="Scroll to about">
            <span className="relative block h-8 w-px overflow-hidden bg-ink/15" aria-hidden>
              <span className="absolute inset-0 animate-scroll-hint bg-ink" />
            </span>
            Scroll
          </a>
          <span className="label hidden md:inline">
            {site.availableForWork ? site.availability : site.timezoneLabel}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
