"use client";
import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { featuredProjects } from "@/data/projects";
import { getCategory } from "@/data/categories";
import type { Project } from "@/data/types";
import { useProjectModal } from "@/hooks/useProjectModal";
import { cn, pad } from "@/lib/utils";
import ProjectModal from "@/components/project/ProjectModal";
import { SectionLabel, SmartImage } from "@/components/ui/Misc";
import { Arrow, Splat } from "@/components/ui/Doodles";
import Magnetic from "@/components/ui/Magnetic";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Varying sizes + offsets so the row feels curated, not a grid.
const layouts = [
  { h: "lg:h-[52vh]", aspect: "aspect-[4/5]", offset: "lg:-translate-y-[5vh]" },
  { h: "lg:h-[44vh]", aspect: "aspect-[3/4]", offset: "lg:translate-y-[8vh]" },
  { h: "lg:h-[42vh]", aspect: "aspect-[16/10]", offset: "lg:-translate-y-[2vh]" },
  { h: "lg:h-[48vh]", aspect: "aspect-[4/5]", offset: "lg:translate-y-[6vh]" },
  { h: "lg:h-[40vh]", aspect: "aspect-[16/11]", offset: "lg:-translate-y-[6vh]" },
  { h: "lg:h-[46vh]", aspect: "aspect-[1/1]", offset: "lg:translate-y-[4vh]" },
];

function WorkCard({ project, i, onOpen }: { project: Project; i: number; onOpen: (p: Project) => void }) {
  const l = layouts[i % layouts.length];
  const cat = getCategory(project.category);
  const contain = project.ratio < 0.6;
  return (
    <article
      className={cn(
        "work-card group relative w-[86%] shrink-0 lg:w-auto",
        l.offset,
        i % 2 ? "self-end lg:self-auto" : "self-start lg:self-auto",
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        data-cursor="View"
        className="block w-full text-left"
        aria-label={`View project: ${project.title}`}
      >
        <div className="mb-3 flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-wider text-muted">
          <span>
            <span style={{ color: cat.accent }}>{pad(i + 1)}</span> / {project.type}
          </span>
          <span>{project.year}</span>
        </div>
        <div
          className={cn(
            "relative overflow-hidden bg-plum [clip-path:inset(0_0_0_0)] transition-[clip-path] duration-700 ease-[var(--ease-expo)] group-hover:[clip-path:inset(3%_3%_3%_3%_round_18px)]",
            l.aspect,
            l.h,
            "lg:w-auto",
          )}
        >
          <div className="work-img absolute inset-[-6%] transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.08]">
            {contain ? (
              <div className="absolute inset-0 grid place-items-center" style={{ background: cat.accent }}>
                <div className="relative h-[86%] w-auto" style={{ aspectRatio: project.ratio }}>
                  <SmartImage src={project.thumbnail} alt={project.title} className="rounded-2xl object-cover shadow-2xl" sizes="30vw" />
                </div>
              </div>
            ) : (
              <SmartImage src={project.thumbnail} alt={project.title} className="object-cover" sizes="(max-width: 1024px) 86vw, 40vw" />
            )}
          </div>
          <span
            className="absolute right-4 top-4 grid h-14 w-14 scale-0 place-items-center rounded-full text-ink transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-100"
            style={{ background: cat.accent }}
          >
            <ArrowUpRight className="h-6 w-6" />
          </span>
        </div>
        <div className="mt-4 overflow-hidden lg:w-0 lg:min-w-full">
          <h3 className="relative font-display text-3xl uppercase leading-none md:text-4xl">
            <span className="block transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-full">{project.title}</span>
            <span aria-hidden className="absolute inset-x-0 top-full block font-graffiti normal-case transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-full" style={{ color: cat.accent }}>
              {project.title}
            </span>
          </h3>
        </div>
        <p className="mt-2 line-clamp-2 max-w-md text-sm text-bone/70 lg:w-0 lg:min-w-full">{project.description}</p>
        <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest" style={{ color: cat.accent }}>
          View project <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </button>
    </article>
  );
}

export default function SelectedWorks() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const modal = useProjectModal(featuredProjects);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const t = track.current!;
        const dist = () => t.scrollWidth - window.innerWidth;
        const tween = gsap.to(t, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (st) => {
              if (progress.current) progress.current.style.transform = `scaleX(${st.progress})`;
            },
          },
        });
        gsap.utils.toArray<HTMLElement>(".work-card").forEach((card) => {
          const img = card.querySelector(".work-img");
          if (img)
            gsap.fromTo(
              img,
              { xPercent: -6 },
              { xPercent: 6, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
            );
        });
      });
      // Mobile / reduced motion: simple reveal.
      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray<HTMLElement>(".work-card").forEach((card) => {
          gsap.from(card, { y: 60, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 85%" } });
        });
      });
    },
    { scope: section },
  );

  return (
    <>
      <section id="works" ref={section} aria-labelledby="works-title" className="relative overflow-hidden bg-ink lg:h-screen">
        <div aria-hidden className="pointer-events-none absolute -right-10 top-0 font-display text-[28vw] leading-none text-outline-bone opacity-[0.06] lg:text-[22vw]">
          WORK
        </div>
        <div ref={track} className="relative flex flex-col gap-16 px-4 py-24 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-[6vw] lg:px-[6vw] lg:py-0">
          {/* intro panel */}
          <div className="relative shrink-0 lg:w-[34vw]">
            <SectionLabel index="02">Selected works</SectionLabel>
            <h2 id="works-title" className="mt-6 font-display text-[16vw] uppercase leading-[0.85] tracking-tight lg:text-[7.5vw]">
              Selected
              <br />
              <span className="font-graffiti normal-case text-acid">works</span>
              <sup className="ml-2 align-top font-mono text-base text-muted">({pad(featuredProjects.length)})</sup>
            </h2>
            <p className="mt-6 max-w-sm text-bone/75">
              A curated cut across identity, interface and code. Click any piece for the full story — or scroll to keep walking the wall.
            </p>
            <Arrow className="mt-6 hidden w-40 text-acid lg:block" variant={0} />
            <Splat seed={33} className="pointer-events-none absolute -left-20 -top-10 -z-10 w-64 opacity-25" color="var(--color-violet)" />
          </div>

          {featuredProjects.map((p, i) => (
            <WorkCard key={p.id} project={p} i={i} onOpen={modal.open} />
          ))}

          {/* outro CTA */}
          <div className="flex shrink-0 items-center justify-center lg:w-[30vw]">
            <Magnetic strength={0.25}>
              <Link
                href="/portfolio"
                data-cursor="All"
                className="group relative grid aspect-square w-64 place-items-center rounded-full bg-acid p-8 text-center text-ink lg:w-[22vw]"
              >
                <span className="font-display text-3xl uppercase leading-[0.95] lg:text-[2.4vw]">
                  View all
                  <br />
                  projects
                </span>
                <ArrowUpRight className="absolute bottom-[18%] h-8 w-8 transition-transform duration-500 group-hover:rotate-45" />
                <span className="absolute inset-[-10px] rounded-full border-2 border-dashed border-acid/60 transition-transform duration-[2s] group-hover:rotate-90" />
              </Link>
            </Magnetic>
          </div>
        </div>
        {/* progress bar (desktop) */}
        <div className="absolute inset-x-[6vw] bottom-8 hidden h-[2px] bg-bone/10 lg:block" aria-hidden>
          <div ref={progress} className="h-full origin-left scale-x-0 bg-acid" />
        </div>
      </section>
      <ProjectModal project={modal.project} onClose={modal.close} onNavigate={modal.navigate} />
    </>
  );
}
