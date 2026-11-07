"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { getProjectsByCategory } from "@/data/projects";
import { getCategory } from "@/data/categories";
import type { Project } from "@/data/types";
import { useProjectModal } from "@/hooks/useProjectModal";
import { cn, pad } from "@/lib/utils";
import ProjectModal from "@/components/project/ProjectModal";
import NextCategory from "@/components/portfolio/NextCategory";
import TornStrip from "@/components/ui/TornStrip";
import { RevealText } from "@/components/ui/Reveal";
import { Marquee, SectionLabel, SmartImage } from "@/components/ui/Misc";
import { Crown, Splat, Star, Arrow } from "@/components/ui/Doodles";

const cat = getCategory("graphic-design");
const items = getProjectsByCategory("graphic-design");

// Editorial composition: spans + crops cycle so the wall never feels like a grid.
const spans = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-4 md:row-span-2",
  "md:col-span-8",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-6",
];
const crops = ["object-center", "object-top", "object-[50%_30%]", "object-bottom", "object-[30%_50%]", "object-center"];

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -260]);
  const posters = items.slice(0, 3);
  return (
    <section ref={ref} className="relative overflow-hidden px-4 pt-32 md:px-8 md:pt-40">
      <Splat seed={81} className="pointer-events-none absolute -left-20 top-10 w-80 opacity-80" />
      <div className="relative mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-7">
          <SectionLabel index={cat.index}>Portfolio / Graphic design</SectionLabel>
          <h1 className="mt-6 uppercase leading-[0.8]">
            <RevealText text="Graphic" immediate className="block font-drip text-[24vw] text-acid lg:text-[13vw]" />
            <RevealText text="Design" immediate delay={0.15} className="block font-display text-[19vw] tracking-tight text-bone lg:text-[10vw]" />
          </h1>
          <div className="mt-8 flex items-start gap-6">
            <Crown className="w-20 shrink-0" />
            <p className="max-w-md font-grotesk text-lg leading-snug text-bone/80">
              A visual exhibition of identities, posters, packaging and campaigns. Let the work do the talking — click any piece for the story behind it.
            </p>
          </div>
        </div>
        <div className="relative h-[60vh] lg:col-span-5 lg:h-[72vh]" aria-hidden>
          {posters.map((p, i) => (
            <motion.div
              key={p.id}
              style={{ y: [y1, y2, y3][i] }}
              className={cn(
                "absolute overflow-hidden border-[6px] border-bone shadow-2xl",
                i === 0 && "left-[4%] top-[6%] w-[52%] -rotate-6",
                i === 1 && "right-[2%] top-[18%] w-[50%] rotate-[5deg]",
                i === 2 && "bottom-[2%] left-[22%] w-[46%] rotate-[-2deg]",
              )}
            >
              <div className="relative" style={{ aspectRatio: p.ratio }}>
                <SmartImage src={p.thumbnail} alt="" className="object-cover" sizes="30vw" priority={i === 0} />
              </div>
            </motion.div>
          ))}
          <Star className="absolute right-[10%] top-0 w-16 animate-spin-slow" color="var(--color-lemon)" />
        </div>
      </div>
      <div className="relative -mx-6 mt-10 rotate-[-2deg]">
        <TornStrip seed={91} className="h-24 md:h-28">
          <Marquee duration={30} className="h-full items-center">
            {cat.services.map((s) => (
              <span key={s} className="flex items-center gap-6 px-6 font-condensed text-5xl uppercase text-ink md:text-6xl">
                {s} <Star className="h-8 w-8" color="var(--color-ink)" />
              </span>
            ))}
          </Marquee>
        </TornStrip>
      </div>
    </section>
  );
}

function Piece({ p, i, onOpen }: { p: Project; i: number; onOpen: (p: Project) => void }) {
  return (
    <motion.article
      className={cn("group relative", spans[i % spans.length])}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.08 }}
    >
      <button type="button" onClick={() => onOpen(p)} data-cursor="View" className="relative block h-full min-h-[340px] w-full overflow-hidden bg-plum text-left md:min-h-[300px]">
        <SmartImage
          src={p.thumbnail}
          alt={p.title}
          className={cn("object-cover transition-[transform,filter] duration-[1.1s] ease-[var(--ease-expo)] group-hover:scale-110 md:grayscale-[35%] md:group-hover:grayscale-0", crops[i % crops.length])}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute left-4 top-4 rotate-[-4deg] bg-acid px-2.5 py-1 font-condensed text-lg uppercase leading-none text-ink">{p.type}</span>
        <span className="absolute right-4 top-3 font-display text-6xl leading-none text-outline-bone opacity-70">{pad(i + 1)}</span>
        <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
          <span>
            <span className="block font-display text-2xl uppercase leading-none md:text-3xl">{p.title}</span>
            <span className="mt-1 block font-mono text-[11px] uppercase tracking-widest text-bone/70">
              {p.client} · {p.year}
            </span>
          </span>
          <span className="grid h-12 w-12 shrink-0 translate-y-4 place-items-center rounded-full bg-acid text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </span>
      </button>
    </motion.article>
  );
}

/** Typographic services list — hovering a service reveals a matching piece. */
function ServicesIndex({ onOpen }: { onOpen: (p: Project) => void }) {
  const [hover, setHover] = useState<string | null>(null);
  const match = (s: string) => items.find((p) => p.type.toLowerCase().startsWith(s.toLowerCase().split(" ")[0]));
  const hovered = hover ? match(hover) : undefined;
  return (
    <section className="px-4 py-24 md:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel index="B">Services index</SectionLabel>
          <p className="mt-4 max-w-sm text-bone/70">Everything I make on the graphic side. Hover to peek at a related piece.</p>
          <div className="relative mt-8 hidden aspect-[3/4] w-full max-w-sm overflow-hidden bg-plum lg:block">
            <AnimatePresence mode="wait">
              {hovered ? (
                <motion.div key={hovered.id} className="absolute inset-0" initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                  <SmartImage src={hovered.thumbnail} alt="" className="object-cover" sizes="400px" />
                </motion.div>
              ) : (
                <motion.div key="empty" className="absolute inset-0 grid place-items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Arrow className="w-32 rotate-90 text-acid" variant={0} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <ul className="lg:col-span-8">
          {cat.services.map((s, i) => {
            const p = match(s);
            return (
              <li key={s} className="border-b border-bone/10">
                <button
                  type="button"
                  disabled={!p}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => p && onOpen(p)}
                  className="group flex w-full items-baseline gap-4 py-4 text-left disabled:cursor-default"
                >
                  <span className="font-mono text-xs text-muted">{pad(i + 1)}</span>
                  <span className="font-display text-[9vw] uppercase leading-none transition-colors duration-300 group-hover:text-acid group-hover:[font-family:var(--font-graffiti)] group-hover:normal-case md:text-6xl">
                    {s}
                  </span>
                  {p && <span className="ml-auto hidden font-mono text-[11px] uppercase text-muted group-hover:text-acid md:inline">{p.title} ↗</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default function GraphicDesignView() {
  const modal = useProjectModal(items);
  return (
    <>
      <Hero />
      <section aria-labelledby="gd-wall" className="px-4 py-24 md:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex items-end justify-between">
            <div>
              <SectionLabel index="A">The wall</SectionLabel>
              <h2 id="gd-wall" className="mt-3 font-display text-5xl uppercase leading-none md:text-7xl">
                Exhibited <span className="font-graffiti normal-case text-acid">pieces</span>
              </h2>
            </div>
            <span className="hidden font-mono text-xs text-muted md:block">{pad(items.length)} works on display</span>
          </div>
          <div className="mt-10 grid auto-rows-[minmax(300px,32vh)] grid-cols-1 gap-4 md:grid-cols-12">
            {items.map((p, i) => (
              <Piece key={p.id} p={p} i={i} onOpen={modal.open} />
            ))}
          </div>
        </div>
      </section>
      <ServicesIndex onOpen={modal.open} />
      <NextCategory current="graphic-design" />
      <ProjectModal project={modal.project} onClose={modal.close} onNavigate={modal.navigate} />
    </>
  );
}
