"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getProjectsByCategory } from "@/data/projects";
import { getCategory } from "@/data/categories";
import type { Project, UiuxDetails } from "@/data/types";
import { useProjectModal } from "@/hooks/useProjectModal";
import { cn, pad } from "@/lib/utils";
import LazyScene from "@/components/three/LazyScene";
import { DeviceScene } from "@/components/three";
import ProjectModal from "@/components/project/ProjectModal";
import CategoryHero from "@/components/portfolio/CategoryHero";
import NextCategory from "@/components/portfolio/NextCategory";
import PosterStack from "@/components/portfolio/PosterStack";
import Button from "@/components/ui/Button";
import { FadeIn, ImageReveal, RevealText } from "@/components/ui/Reveal";
import { SectionLabel, SmartImage } from "@/components/ui/Misc";

const cat = getCategory("uiux-design");
const items = getProjectsByCategory("uiux-design");

const phoneScreens = items.filter((p) => p.ratio < 0.7).map((p) => p.thumbnail);
const desktopScreen = items.find((p) => p.ratio > 1.3)?.thumbnail ?? items[0]?.thumbnail;

/** Device mockup with switchable screens and a second, layered device behind it. */
function Showcase({ p, d }: { p: Project; d: UiuxDetails }) {
  const [active, setActive] = useState(0);
  const phone = d.device === "phone";
  const screens = d.screens.length ? d.screens : [p.thumbnail];
  const behind = screens[(active + 1) % screens.length];

  return (
    <ImageReveal className="rounded-sm bg-soft">
      <div className="grid-paper relative aspect-[4/3] overflow-hidden">
        {phone ? (
          <div className="absolute inset-0 grid place-items-center">
            {screens.length > 1 && (
              <div className="absolute left-1/2 top-1/2 h-[66%] -translate-y-1/2 translate-x-[18%] rotate-6 overflow-hidden rounded-[1.5rem] opacity-90 shadow-[0_30px_60px_-24px_rgb(23_25_28/0.4)] ring-[5px] ring-ink transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-[30%] group-hover:rotate-[10deg]" style={{ aspectRatio: 390 / 844 }}>
                <SmartImage src={behind} alt="" sizes="20vw" className="object-cover" />
              </div>
            )}
            <div className="relative h-[80%] -translate-x-[12%] overflow-hidden rounded-[1.8rem] bg-ink shadow-[0_40px_70px_-28px_rgb(23_25_28/0.55)] ring-[6px] ring-ink transition-transform duration-700 ease-[var(--ease-expo)] group-hover:-translate-x-[18%] group-hover:-rotate-2" style={{ aspectRatio: 390 / 844 }}>
              <AnimatePresence mode="wait">
                <motion.div key={active} className="absolute inset-0" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3 }}>
                  <SmartImage src={screens[active]} alt={`${p.title} — screen ${active + 1}`} sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 grid place-items-center p-[8%]">
            <div className="relative w-full overflow-hidden rounded-lg bg-surface shadow-[0_40px_70px_-28px_rgb(23_25_28/0.5)] ring-1 ring-ink/10 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:-translate-y-2">
              <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-ink/15" />
                <span className="h-2 w-2 rounded-full bg-ink/15" />
                <span className="h-2 w-2 rounded-full bg-sky" />
              </div>
              <div className="relative" style={{ aspectRatio: 16 / 10 }}>
                <AnimatePresence mode="wait">
                  <motion.div key={active} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <SmartImage src={screens[active]} alt={`${p.title} — screen ${active + 1}`} sizes="(max-width: 768px) 90vw, 50vw" className="object-cover object-top" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            {/* floating wireframe card */}
            {d.wireframes[0] && (
              <div className="absolute bottom-[7%] right-[5%] w-[30%] overflow-hidden rounded-md shadow-[0_24px_44px_-18px_rgb(23_25_28/0.5)] ring-1 ring-ink/15 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:-translate-y-3 group-hover:rotate-2" style={{ aspectRatio: 16 / 10 }}>
                <SmartImage src={d.wireframes[0]} alt="" sizes="15vw" className="object-cover" />
              </div>
            )}
          </div>
        )}

        {/* screen switcher */}
        {screens.length > 1 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-surface/90 p-1 backdrop-blur" role="group" aria-label="Switch screen">
            {screens.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-pressed={active === i}
                aria-label={`Show screen ${i + 1}`}
                onClick={() => setActive(i)}
                className={cn(
                  "h-7 min-w-7 rounded-full px-2 font-mono text-[10px] transition-colors",
                  active === i ? "bg-ink text-paper" : "text-muted hover:text-ink",
                )}
              >
                {pad(i + 1)}
              </button>
            ))}
          </div>
        )}
        <span className="label absolute right-3 top-3 rounded-full bg-surface/85 px-2.5 py-1 text-ink backdrop-blur">{phone ? "Mobile" : "Desktop"}</span>
      </div>
    </ImageReveal>
  );
}

function Case({ p, i, onOpen }: { p: Project; i: number; onOpen: (p: Project) => void }) {
  if (p.details.kind !== "uiux-design") return null;
  const d = p.details;
  const flip = i % 2 === 1;
  return (
    <article className="group grid gap-8 border-t border-ink/15 py-12 md:grid-cols-12 md:gap-10 md:py-20">
      <div className={cn("md:col-span-7", flip && "md:order-2")}>
        <Showcase p={p} d={d} />
      </div>
      <FadeIn className={cn("flex flex-col justify-center md:col-span-5", flip ? "md:order-1 md:pr-6" : "md:pl-6")}>
        <p className="label">
          <span className="text-ink">{pad(i + 1)}</span> — {p.type} · {p.year}
        </p>
        <h3 className="mt-4 font-display text-[clamp(1.8rem,3.2vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.03em]">{p.title}</h3>
        <p className="mt-4 leading-relaxed text-ink/80">{p.description}</p>
        <dl className="mt-6 space-y-4 border-t border-line pt-5">
          <div>
            <dt className="label">Problem</dt>
            <dd className="mt-1 text-sm leading-relaxed text-muted">{d.problem}</dd>
          </div>
          <div>
            <dt className="label">User flow</dt>
            <dd className="mt-2 flex flex-wrap items-center gap-1.5">
              {d.userFlow.map((s, k) => (
                <span key={s} className="flex items-center gap-1.5">
                  <span className="rounded-full border border-ink/15 bg-surface px-2.5 py-1 font-mono text-[11px]">{s}</span>
                  {k < d.userFlow.length - 1 && <span className="font-mono text-[11px] text-muted" aria-hidden>→</span>}
                </span>
              ))}
            </dd>
          </div>
        </dl>
        <div className="mt-8">
          <Button onClick={() => onOpen(p)} variant="outline">
            View case study
          </Button>
        </div>
      </FadeIn>
    </article>
  );
}

export default function UiuxView() {
  const modal = useProjectModal(items);
  const heroRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <CategoryHero
        category={cat}
        count={items.length}
        visual={
          <div ref={heroRef} className="group h-full">
            <LazyScene
              className="h-full w-full"
              fallback={<PosterStack items={items} className="h-full" />}
              render={(active) => <DeviceScene active={active} phoneScreens={phoneScreens} desktopScreen={desktopScreen} eventSource={heroRef} />}
            />
          </div>
        }
      />

      <section aria-label="UI/UX case studies" className="py-20 md:py-32">
        <div className="wrap">
          <SectionLabel index="A">Case studies</SectionLabel>
          <RevealText as="h2" text="Product showcase" className="h-section mt-6" />
          <div className="mt-12 md:mt-16">
            {items.map((p, i) => (
              <Case key={p.id} p={p} i={i} onOpen={modal.open} />
            ))}
          </div>
        </div>
      </section>

      <NextCategory current="uiux-design" />
      <ProjectModal project={modal.project} onClose={modal.close} onNavigate={modal.navigate} />
    </>
  );
}
