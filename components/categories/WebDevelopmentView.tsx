"use client";
import { useRef, useState } from "react";
import { ExternalLink, Play, RotateCcw } from "lucide-react";
import { getProjectsByCategory } from "@/data/projects";
import { getCategory } from "@/data/categories";
import type { Project } from "@/data/types";
import { useProjectModal } from "@/hooks/useProjectModal";
import { cn, pad } from "@/lib/utils";
import LazyScene from "@/components/three/LazyScene";
import { MonitorScene } from "@/components/three";
import ProjectModal from "@/components/project/ProjectModal";
import CategoryHero from "@/components/portfolio/CategoryHero";
import NextCategory from "@/components/portfolio/NextCategory";
import PosterStack from "@/components/portfolio/PosterStack";
import Button from "@/components/ui/Button";
import { GithubIcon } from "@/components/ui/SocialIcons";
import { FadeIn, ImageReveal, RevealText } from "@/components/ui/Reveal";
import { SectionLabel, SmartImage } from "@/components/ui/Misc";

const cat = getCategory("web-development");
const items = getProjectsByCategory("web-development");

/** Browser mockup. With a live link it can load the real site inside the frame. */
function Browser({ p }: { p: Project }) {
  const live = p.links?.live;
  const [loaded, setLoaded] = useState(false);
  return (
    <ImageReveal className="rounded-lg">
      <div className="overflow-hidden rounded-lg border border-ink/15 bg-surface shadow-[0_40px_70px_-40px_rgb(23_25_28/0.5)]">
        <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className={cn("h-2.5 w-2.5 rounded-full", live ? "bg-lime ring-1 ring-ink/20" : "bg-ink/15")} />
          <span className="ml-2 flex-1 truncate rounded-full bg-soft px-3 py-1 font-mono text-[11px] text-muted">
            {live ? live.replace(/^https?:\/\//, "") : "preview — not deployed"}
          </span>
          {live && loaded && (
            <button type="button" onClick={() => setLoaded(false)} aria-label="Close live preview" className="text-muted hover:text-ink">
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
          {live && (
            <a href={live} target="_blank" rel="noreferrer" aria-label={`Open ${p.title} in a new tab`} className="text-muted hover:text-ink">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
        <div className="relative aspect-[16/10] bg-soft">
          {live && loaded ? (
            <iframe src={live} title={`${p.title} — live preview`} className="absolute inset-0 h-full w-full bg-white" loading="lazy" sandbox="allow-scripts allow-same-origin" data-lenis-prevent />
          ) : (
            <>
              <SmartImage
                src={p.thumbnail}
                alt={`${p.title} — ${p.type}`}
                sizes="(max-width: 768px) 100vw, 58vw"
                className="object-cover object-top transition-transform duration-[1200ms] ease-[var(--ease-expo)] group-hover:scale-[1.03]"
              />
              {live && (
                <button
                  type="button"
                  onClick={() => setLoaded(true)}
                  className="absolute inset-0 grid place-items-center bg-ink/0 transition-colors duration-500 hover:bg-ink/30 focus-visible:bg-ink/30"
                  aria-label={`Load live preview of ${p.title}`}
                >
                  <span className="inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 font-ui text-sm font-medium text-ink shadow-[0_12px_30px_-10px_rgb(23_25_28/0.5)]">
                    <Play className="h-4 w-4" /> Load live preview
                  </span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </ImageReveal>
  );
}

function Row({ p, i, onOpen }: { p: Project; i: number; onOpen: (p: Project) => void }) {
  if (p.details.kind !== "web-development") return null;
  const d = p.details;
  const flip = i % 2 === 1;
  return (
    <article className="group grid gap-8 border-t border-ink/15 py-12 md:grid-cols-12 md:gap-10 md:py-20">
      <div className={cn("md:col-span-7", flip && "md:order-2")}>
        <Browser p={p} />
      </div>
      <FadeIn className={cn("flex flex-col justify-center md:col-span-5", flip ? "md:order-1 md:pr-6" : "md:pl-6")}>
        <p className="font-mono text-[11px] text-muted">
          <span className="text-ink">{"//"} {pad(i + 1)}</span> {p.type.toLowerCase().replace(/\s+/g, "-")} · {p.year}
        </p>
        <h3 className="mt-4 font-display text-[clamp(1.8rem,3.2vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.03em]">{p.title}</h3>
        <p className="mt-4 leading-relaxed text-ink/80">{p.description}</p>

        {/* code-style spec sheet */}
        <div className="mt-6 overflow-hidden rounded-md border border-line bg-surface font-mono text-[12px] leading-relaxed">
          <div className="flex">
            <div className="select-none border-r border-line bg-soft px-2.5 py-3 text-right text-muted" aria-hidden>
              {Array.from({ length: d.features.length + 2 }, (_, k) => (
                <div key={k}>{k + 1}</div>
              ))}
            </div>
            <div className="min-w-0 flex-1 px-3 py-3">
              <div className="truncate">
                <span className="text-muted">stack:</span> [{d.technologies.join(", ")}]
              </div>
              <div className="text-muted">features:</div>
              {d.features.map((f) => (
                <div key={f} className="truncate pl-3">
                  <span className="text-muted">-</span> {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {p.links?.live && (
            <Button href={p.links.live} external>
              Visit live site
            </Button>
          )}
          {p.links?.github && (
            <Button href={p.links.github} variant="outline" icon={<GithubIcon className="h-4 w-4" />}>
              GitHub
            </Button>
          )}
          <Button onClick={() => onOpen(p)} variant="outline">
            Project details
          </Button>
        </div>
      </FadeIn>
    </article>
  );
}

export default function WebDevelopmentView() {
  const modal = useProjectModal(items);
  const heroRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <CategoryHero
        category={cat}
        count={items.length}
        visual={
          <div ref={heroRef} className="group relative h-full">
            <LazyScene
              className="h-full w-full"
              fallback={<PosterStack items={items} className="h-full" />}
              render={(active) => <MonitorScene active={active} eventSource={heroRef} />}
            />
            {/* floating interface chips */}
            <span aria-hidden className="label absolute left-2 top-6 rounded-full border border-ink/15 bg-surface/80 px-3 py-1.5 text-ink backdrop-blur">
              &lt;main /&gt;
            </span>
            <span aria-hidden className="label absolute bottom-8 right-2 rounded-full border border-ink/15 bg-surface/80 px-3 py-1.5 text-ink backdrop-blur">
              grid: 12 · ease: expo
            </span>
          </div>
        }
      />

      <section aria-label="Web development projects" className="relative py-20 md:py-32">
        <div aria-hidden className="grid-paper pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_30%)]" />
        <div className="wrap relative">
          <SectionLabel index="A">Builds</SectionLabel>
          <RevealText as="h2" text="Shipped & experimental" className="h-section mt-6" />
          <div className="mt-12 md:mt-16">
            {items.map((p, i) => (
              <Row key={p.id} p={p} i={i} onOpen={modal.open} />
            ))}
          </div>
        </div>
      </section>

      <NextCategory current="web-development" />
      <ProjectModal project={modal.project} onClose={modal.close} onNavigate={modal.navigate} />
    </>
  );
}
