"use client";
import { useRef } from "react";
import { getProjectsByCategory } from "@/data/projects";
import { getCategory } from "@/data/categories";
import type { Project } from "@/data/types";
import { useProjectModal } from "@/hooks/useProjectModal";
import { pad } from "@/lib/utils";
import ProjectModal from "@/components/project/ProjectModal";
import CategoryHero from "@/components/portfolio/CategoryHero";
import NextCategory from "@/components/portfolio/NextCategory";
import PosterStack from "@/components/portfolio/PosterStack";
import { ImageReveal, RevealText } from "@/components/ui/Reveal";
import { SectionLabel, SmartImage } from "@/components/ui/Misc";

const cat = getCategory("graphic-design");
const items = getProjectsByCategory("graphic-design");

/** Supporting images (everything after each project's thumbnail) for the horizontal strip. */
const details = items.flatMap((p) => p.gallery.slice(1).map((src) => ({ src, project: p })));

function Piece({ p, i, onOpen }: { p: Project; i: number; onOpen: (p: Project) => void }) {
  return (
    <article className="group mb-12 break-inside-avoid md:mb-16">
      <button type="button" onClick={() => onOpen(p)} data-cursor="View" aria-label={`Open project: ${p.title}`} className="block w-full text-left">
        <ImageReveal className="rounded-[2px] bg-soft">
          <div className="relative overflow-hidden" style={{ aspectRatio: p.ratio }}>
            <SmartImage
              src={p.thumbnail}
              alt={`${p.title} — ${p.type}`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-expo)] group-hover:scale-[1.05]"
            />
            <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-ink px-4 py-3 text-paper transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
              <span className="font-ui text-sm font-medium">View project</span>
              <span className="label text-lime">{p.role}</span>
            </span>
          </div>
        </ImageReveal>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-xl font-medium tracking-[-0.02em]">
            <span className="mr-3 font-mono text-[11px] font-normal text-muted">{pad(i + 1)}</span>
            <span className="u-link">{p.title}</span>
          </h3>
          <span className="label shrink-0">{p.year}</span>
        </div>
        <p className="label mt-1">{p.type}</p>
      </button>
    </article>
  );
}

/** Horizontal, draggable strip of supporting artwork. */
function DetailStrip({ onOpen }: { onOpen: (p: Project) => void }) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ on: false, x: 0, left: 0, moved: 0 });
  if (details.length === 0) return null;
  return (
    <section aria-label="Details and explorations" className="border-y border-line bg-surface py-14 md:py-20">
      <div className="wrap flex items-end justify-between gap-6">
        <div>
          <SectionLabel index="B">Details &amp; explorations</SectionLabel>
          <h2 className="h-section mt-6">Up close</h2>
        </div>
        <p className="label hidden sm:block">Drag / scroll sideways →</p>
      </div>
      <div
        ref={scroller}
        data-lenis-prevent
        data-cursor="Drag"
        className="no-scrollbar mt-10 flex cursor-grab gap-5 overflow-x-auto px-5 active:cursor-grabbing md:gap-8 md:px-10"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !scroller.current) return;
          drag.current = { on: true, x: e.clientX, left: scroller.current.scrollLeft, moved: 0 };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d.on || !scroller.current) return;
          d.moved = Math.abs(e.clientX - d.x);
          scroller.current.scrollLeft = d.left - (e.clientX - d.x);
        }}
        onPointerUp={() => (drag.current.on = false)}
        onPointerLeave={() => (drag.current.on = false)}
      >
        {details.map(({ src, project }, i) => (
          <button
            key={src}
            type="button"
            onClick={() => drag.current.moved < 6 && onOpen(project)}
            aria-label={`Open project: ${project.title}`}
            className="group shrink-0 text-left"
            draggable={false}
          >
            <span className="relative block h-[44vh] min-h-[280px] overflow-hidden rounded-[2px] bg-soft md:h-[56vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${project.title} — detail`} loading="lazy" draggable={false} className="h-full w-auto max-w-none transition-transform duration-[1200ms] ease-[var(--ease-expo)] group-hover:scale-[1.03]" />
            </span>
            <span className="label mt-3 flex justify-between gap-6">
              <span className="text-ink">{project.title}</span>
              <span>
                {pad(i + 1)} / {pad(details.length)}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function GraphicDesignView() {
  const modal = useProjectModal(items);
  return (
    <>
      <CategoryHero
        category={cat}
        count={items.length}
        visual={
          <div className="group h-full">
            <PosterStack items={items} className="h-full" sizes="(max-width: 1024px) 60vw, 28vw" />
          </div>
        }
      />

      <section aria-labelledby="gd-gallery" className="py-20 md:py-32">
        <div className="wrap">
          <SectionLabel index="A">Gallery</SectionLabel>
          <RevealText as="h2" text="The work" className="h-section mt-6" />
          <h2 id="gd-gallery" className="sr-only">
            Graphic design gallery
          </h2>
          <div className="mt-12 columns-1 gap-8 sm:columns-2 md:mt-20 lg:columns-3 lg:gap-10">
            {items.map((p, i) => (
              <Piece key={p.id} p={p} i={i} onOpen={modal.open} />
            ))}
          </div>
        </div>
      </section>

      <DetailStrip onOpen={modal.open} />
      <div className="pt-16 md:pt-24">
        <NextCategory current="graphic-design" />
      </div>
      <ProjectModal project={modal.project} onClose={modal.close} onNavigate={modal.navigate} />
    </>
  );
}
