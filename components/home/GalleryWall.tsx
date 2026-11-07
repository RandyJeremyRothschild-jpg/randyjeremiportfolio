"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, RotateCcw, X } from "lucide-react";
import { galleryProjects } from "@/data/projects";
import { getCategory } from "@/data/categories";
import { useProjectModal } from "@/hooks/useProjectModal";
import { useReducedMotion } from "@/hooks/useMedia";
import { pad } from "@/lib/utils";
import LazyScene from "@/components/three/LazyScene";
import { GalleryScene } from "@/components/three";
import ProjectModal from "@/components/project/ProjectModal";
import { SectionLabel, SmartImage } from "@/components/ui/Misc";
import { Splat } from "@/components/ui/Doodles";

/** Non-WebGL fallback: a CSS-perspective exhibition corridor. */
function CssGallery({ onSelect }: { onSelect: (i: number) => void }) {
  return (
    <div className="absolute inset-0 overflow-hidden [perspective:900px]">
      <div className="absolute inset-x-0 top-0 h-[22%] origin-top bg-acid [transform:rotateX(-70deg)]" />
      <div className="absolute inset-x-0 bottom-0 h-[22%] origin-bottom bg-acid [transform:rotateX(70deg)]" />
      <div className="no-scrollbar absolute inset-0 flex items-center gap-6 overflow-x-auto px-[10vw]">
        {galleryProjects.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(i)}
            className="relative h-[46%] shrink-0 border-[6px] border-[#121019] shadow-2xl transition-transform hover:-translate-y-2"
            style={{ aspectRatio: Math.max(p.ratio, 0.6) }}
            aria-label={`Preview ${p.title}`}
          >
            <SmartImage src={p.thumbnail} alt={p.title} className="object-cover" sizes="30vw" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function GalleryWall() {
  const reduced = useReducedMotion();
  const [focus, setFocus] = useState<number | null>(null);
  const modal = useProjectModal(galleryProjects);
  const n = galleryProjects.length;
  const current = focus !== null ? galleryProjects[focus] : null;
  const cat = current ? getCategory(current.category) : null;

  const step = useCallback((d: 1 | -1) => setFocus((f) => (f === null ? (d === 1 ? 0 : n - 1) : (f + d + n) % n)), [n]);

  useEffect(() => {
    if (focus === null || modal.project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocus(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focus, step, modal.project]);

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="relative overflow-hidden py-24 md:py-32">
      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        <SectionLabel index="03">Exhibition</SectionLabel>
        <div className="relative mt-4 flex flex-col items-center text-center">
          <Splat seed={44} className="pointer-events-none absolute left-1/2 top-0 -z-10 w-72 -translate-x-1/2 opacity-30 md:w-[28rem]" color="var(--color-violet)" />
          <h2 id="gallery-title" className="font-drip text-[18vw] uppercase leading-[0.8] text-bone md:text-[9vw]">
            Gallery
            <span className="block text-[12vw] md:text-[6vw]">
              <span className="text-acid">of</span> works
            </span>
          </h2>
          <p className="mt-6 max-w-md text-sm text-bone/70">
            Step inside the studio. Move to look around, hover a frame to light it up, click to bring it closer.
          </p>
        </div>
      </div>

      <div className="relative mt-10 h-[78vh] min-h-[520px] w-full md:mt-14">
        <LazyScene
          className="h-full w-full"
          fallback={<CssGallery onSelect={(i) => setFocus(i)} />}
          render={(active) => <GalleryScene active={active} projects={galleryProjects} focus={focus} reduced={reduced} onSelect={(i) => setFocus(i)} />}
        />

        {/* controls */}
        <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2 md:bottom-6">
          <button type="button" onClick={() => step(-1)} aria-label="Previous artwork" className="grid h-12 w-12 place-items-center rounded-full bg-ink/80 text-bone ring-1 ring-bone/20 backdrop-blur hover:bg-acid hover:text-ink">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="min-w-[90px] rounded-full bg-ink/80 px-4 py-3 text-center font-mono text-xs text-bone ring-1 ring-bone/20 backdrop-blur">
            {focus === null ? "OVERVIEW" : `${pad(focus + 1)} / ${pad(n)}`}
          </span>
          <button type="button" onClick={() => step(1)} aria-label="Next artwork" className="grid h-12 w-12 place-items-center rounded-full bg-ink/80 text-bone ring-1 ring-bone/20 backdrop-blur hover:bg-acid hover:text-ink">
            <ArrowRight className="h-5 w-5" />
          </button>
          {focus !== null && (
            <button type="button" onClick={() => setFocus(null)} aria-label="Back to overview" className="grid h-12 w-12 place-items-center rounded-full bg-ink/80 text-bone ring-1 ring-bone/20 backdrop-blur hover:bg-acid hover:text-ink">
              <RotateCcw className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* preview card */}
        <AnimatePresence>
          {current && cat && (
            <motion.aside
              key={current.id}
              aria-live="polite"
              className="absolute left-4 top-4 z-10 w-[min(340px,calc(100%-2rem))] overflow-hidden rounded-2xl bg-ink/90 ring-1 ring-bone/15 backdrop-blur md:left-8 md:top-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative hidden aspect-[16/10] bg-plum sm:block">
                <SmartImage src={current.thumbnail} alt={current.title} className="object-cover" sizes="340px" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted">
                  <span style={{ color: cat.accent }}>{cat.shortTitle}</span>
                  <span>{current.year}</span>
                </div>
                <h3 className="mt-2 font-display text-2xl uppercase leading-none">{current.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-bone/70">{current.description}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => modal.open(current)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 font-grotesk text-sm font-bold uppercase text-ink"
                    style={{ background: cat.accent }}
                  >
                    Open project <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => setFocus(null)} aria-label="Close preview" className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-bone/20 hover:bg-bone/10">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
      <ProjectModal project={modal.project} onClose={modal.close} onNavigate={modal.navigate} />
    </section>
  );
}
