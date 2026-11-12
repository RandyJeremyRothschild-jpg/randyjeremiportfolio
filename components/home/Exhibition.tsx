"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { galleryProjects } from "@/data/projects";
import { getCategory } from "@/data/categories";
import type { Project } from "@/data/types";
import { useProjectModal } from "@/hooks/useProjectModal";
import { useFinePointer, useIsDesktop, useReducedMotion, useWebGL } from "@/hooks/useMedia";
import { cn, pad } from "@/lib/utils";
import LazyScene from "@/components/three/LazyScene";
import { GalleryScene } from "@/components/three";
import type { LookState } from "@/components/three/GalleryScene";
import ProjectModal from "@/components/project/ProjectModal";
import Button from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/Misc";
import { FadeIn, RevealText } from "@/components/ui/Reveal";

const N = galleryProjects.length;

/**
 * Simplified exhibition for touch devices / no WebGL: the same lit gallery
 * walls, laid out as a horizontal, swipeable hall.
 */
function ExhibitionLite({ onOpen }: { onOpen: (p: Project) => void }) {
  return (
    <div className="relative mt-12">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/15" />
      <ul className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-20 pt-10 md:gap-8 md:px-10" data-lenis-prevent>
        {galleryProjects.map((p, i) => {
          const cat = getCategory(p.category);
          return (
            <li key={p.id} className="w-[76vw] max-w-[400px] shrink-0 snap-center">
              <button type="button" onClick={() => onOpen(p)} className="group block w-full text-left" aria-label={`Open project: ${p.title}`}>
                {/* track light */}
                <span aria-hidden className="mx-auto block h-1 w-1/3 rounded-full bg-white shadow-[0_0_24px_4px_rgb(255_255_255/0.45)]" />
                {/* wall */}
                <span
                  className="relative mt-3 grid h-[58svh] max-h-[560px] min-h-[380px] place-items-center p-8 [-webkit-box-reflect:below_2px_linear-gradient(transparent_90%,rgba(255,255,255,0.12))]"
                  style={{ background: "radial-gradient(ellipse 85% 70% at 50% 28%, #fbfbf8 0%, #e2e4e0 45%, #8f9494 100%)" }}
                >
                  <span
                    className="relative block max-h-full max-w-full overflow-hidden shadow-[0_24px_44px_-12px_rgb(0_0_0/0.6)] ring-[5px] ring-[#121416] transition-transform duration-700 ease-[var(--ease-expo)] group-active:scale-[0.98]"
                    style={{ aspectRatio: p.ratio, ...(p.ratio >= 1 ? { width: "100%" } : { height: "100%" }) }}
                  >
                    <SmartImage src={p.thumbnail} alt={`${p.title} — ${p.type}`} sizes="(max-width: 768px) 76vw, 400px" className="object-cover" />
                  </span>
                </span>
                <span className="mt-16 flex items-baseline justify-between gap-4">
                  <span className="font-display text-lg font-medium tracking-[-0.02em] text-white">{p.title}</span>
                  <span className="label text-white/50">
                    {pad(i + 1)} / {pad(N)}
                  </span>
                </span>
                <span className="label mt-1 block text-white/50">
                  {cat.title} · {p.year}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="label px-5 text-white/50 md:px-10">Swipe to walk the hall · Tap an artwork to open it</p>
    </div>
  );
}

/** Full 3D exhibition: the page scroll walks the camera down the hall. */
function ExhibitionFull({ onOpen, reduced }: { onOpen: (p: Project) => void; reduced: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const look = useRef<LookState>({ yaw: 0, pitch: 0, dragging: false });
  const dragStart = useRef({ x: 0, y: 0 });
  const [index, setIndex] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const sx = useSpring(tx, { stiffness: 300, damping: 30, mass: 0.4 });
  const sy = useSpring(ty, { stiffness: 300, damping: 30, mass: 0.4 });

  const getProgress = useCallback(() => {
    const el = track.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
  }, []);

  const onStep = useCallback((i: number, end: boolean) => {
    setIndex(i);
    setAtEnd(end);
  }, []);

  // Cursor label while an artwork is hovered (see components/layout/Cursor.tsx).
  useEffect(() => {
    const root = document.documentElement;
    if (hover !== null) root.dataset.cursor = "Open";
    else delete root.dataset.cursor;
    return () => {
      delete root.dataset.cursor;
    };
  }, [hover]);

  const current = galleryProjects[index];
  const hovered = hover !== null ? galleryProjects[hover] : null;

  return (
    <div ref={track} className="relative" style={{ height: `${N * 80 + 80}vh` }}>
      <div
        className="sticky top-0 h-svh touch-pan-y select-none overflow-hidden"
        onPointerDown={(e) => {
          look.current.dragging = true;
          dragStart.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerMove={(e) => {
          tx.set(e.clientX);
          ty.set(e.clientY);
          const l = look.current;
          if (!l.dragging) return;
          l.yaw = Math.max(-0.9, Math.min(0.9, l.yaw + (e.clientX - dragStart.current.x) * 0.0032));
          l.pitch = Math.max(-0.3, Math.min(0.3, l.pitch + (e.clientY - dragStart.current.y) * 0.002));
          dragStart.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={() => (look.current.dragging = false)}
        onPointerLeave={() => (look.current.dragging = false)}
        onPointerCancel={() => (look.current.dragging = false)}
      >
        <LazyScene
          className="absolute inset-0"
          rootMargin="600px"
          render={(active) => (
            <GalleryScene
              active={active}
              projects={galleryProjects}
              getProgress={getProgress}
              look={look}
              reduced={reduced}
              onHover={setHover}
              onSelect={(i) => onOpen(galleryProjects[i])}
              onStep={onStep}
            />
          )}
        />

        {/* vignette */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(14_16_18/0.75)_100%)]" />

        {/* HUD */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 pt-24 md:p-10 md:pt-24">
          <div className="flex items-start justify-between">
            <p className="label text-white/60">
              <span className="text-lime">●</span> Exhibition / Hall 01
            </p>
            <p className="label text-right text-white/60">
              Scroll — walk
              <br />
              Drag — look around
              <br />
              Click — open artwork
            </p>
          </div>

          <div className="flex items-end justify-between gap-6">
            <div className="min-w-0">
              <p className="label text-white/60">Now viewing</p>
              <div className="mt-2 flex items-baseline gap-4">
                <span className="font-display text-6xl font-medium tabular-nums leading-none tracking-[-0.04em] text-white md:text-7xl">
                  {pad(index + 1)}
                </span>
                <span className="label text-white/50">/ {pad(N)}</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="mt-3"
                >
                  <p className="truncate font-display text-xl font-medium tracking-[-0.02em] text-white">{current.title}</p>
                  <p className="label mt-1 text-white/55">
                    {getCategory(current.category).title} · {current.type} · {current.year}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* progress ticks */}
            <div className="flex items-end gap-1.5" aria-hidden>
              {galleryProjects.map((p, i) => (
                <span
                  key={p.id}
                  className={cn("w-px transition-all duration-500", i === index ? "h-8 bg-lime" : i < index ? "h-4 bg-white/60" : "h-4 bg-white/20")}
                />
              ))}
            </div>
          </div>
        </div>

        {/* end of hall */}
        <AnimatePresence>
          {atEnd && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 bottom-28 flex justify-center"
            >
              <Button href="/portfolio" variant="lime">
                Explore all works
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* hover caption */}
        <motion.div aria-hidden className="pointer-events-none absolute left-0 top-0 z-10" style={{ x: sx, y: sy }}>
          <AnimatePresence>
            {hovered && (
              <motion.div
                key={hovered.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.2 }}
                className="ml-6 mt-6 w-max max-w-[260px] border border-white/15 bg-night/85 px-4 py-3 backdrop-blur-md"
              >
                <p className="font-display text-base font-medium tracking-[-0.01em] text-white">{hovered.title}</p>
                <p className="label mt-1 text-white/60">
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-lime" />
                  {getCategory(hovered.category).title}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default function Exhibition() {
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const fine = useFinePointer();
  const webgl = useWebGL();
  const modal = useProjectModal(galleryProjects);
  const full = desktop && fine && webgl === true;

  return (
    <section id="exhibition" data-nav="work" aria-label="3D art exhibition" className="on-dark relative bg-night text-white">
      <div className="grid-night">
        <div className="wrap pb-10 pt-24 md:pb-16 md:pt-36">
          <div className="label flex items-center gap-3 text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" aria-hidden />
            <span>03</span>
            <span className="h-px w-8 bg-current opacity-40" aria-hidden />
            <span>3D Art Exhibition</span>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
            <RevealText as="h2" text={"Walk through\n*the *work."} highlightClassName="text-white/45" className="h-section lg:col-span-7" />
            <FadeIn className="lg:col-span-4 lg:col-start-9">
              <p className="leading-relaxed text-white/70">
                A virtual gallery where selected projects hang as physical artworks. {full ? "Keep scrolling to step inside." : "Swipe through the hall below."}
              </p>
              <p className="label mt-4 text-white/45">
                {pad(N)} artworks · {full ? "Real-time 3D" : "Gallery view"}
              </p>
            </FadeIn>
          </div>
        </div>
      </div>

      {full ? <ExhibitionFull onOpen={modal.open} reduced={reduced} /> : <ExhibitionLite onOpen={modal.open} />}

      <ProjectModal project={modal.project} onClose={modal.close} onNavigate={modal.navigate} />
    </section>
  );
}
