"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Monitor, Smartphone, X } from "lucide-react";
import type { GraphicDetails, Project, UiuxDetails, VibeDetails } from "@/data/types";
import { getCategory } from "@/data/categories";
import { lockScroll } from "@/lib/scroll";
import { cn, pad } from "@/lib/utils";
import { GithubIcon } from "@/components/ui/SocialIcons";

function Block({ n, title, children, accent }: { n: string; title: string; children: React.ReactNode; accent: string }) {
  return (
    <section className="grid gap-4 border-t border-bone/10 py-8 md:grid-cols-12">
      <div className="md:col-span-4">
        <p className="font-mono text-xs" style={{ color: accent }}>
          {n}
        </p>
        <h3 className="mt-1 font-display text-2xl uppercase leading-none md:text-3xl">{title}</h3>
      </div>
      <div className="text-bone/80 md:col-span-8">{children}</div>
    </section>
  );
}

function List({ items, accent }: { items: string[]; accent: string }) {
  return (
    <ul className="space-y-2">
      {items.map((t) => (
        <li key={t} className="flex gap-3">
          <span className="mt-2 h-2 w-2 shrink-0 rotate-45" style={{ background: accent }} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Img({ src, alt, className }: { src: string; alt: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={cn("block h-auto w-full", className)} />;
}

function GraphicBody({ p, d, accent }: { p: Project; d: GraphicDetails; accent: string }) {
  return (
    <>
      <Block n="01" title="Overview" accent={accent}>
        <p className="text-lg leading-relaxed">{d.overview}</p>
      </Block>
      <Block n="02" title="Design objectives" accent={accent}>
        <List items={d.objectives} accent={accent} />
      </Block>
      <div className="grid gap-4 py-4 md:grid-cols-2">
        {p.gallery.map((src, i) => (
          <figure key={src} className={cn("overflow-hidden bg-plum", i === 0 && "md:col-span-2")}>
            <Img src={src} alt={`${p.title} — image ${i + 1}`} />
          </figure>
        ))}
      </div>
      <Block n="03" title="Creative process" accent={accent}>
        <ol className="space-y-3">
          {d.process.map((t, i) => (
            <li key={t} className="flex gap-4">
              <span className="font-condensed text-2xl leading-none" style={{ color: accent }}>
                {pad(i + 1)}
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
      </Block>
      <Block n="04" title="Design outcomes" accent={accent}>
        <List items={d.outcomes} accent={accent} />
      </Block>
    </>
  );
}

function UiuxBody({ p, d, accent }: { p: Project; d: UiuxDetails; accent: string }) {
  const [screen, setScreen] = useState(0);
  const phone = d.device === "phone";
  return (
    <>
      <Block n="01" title="Project overview" accent={accent}>
        <p className="text-lg leading-relaxed">{d.overview}</p>
      </Block>
      <Block n="02" title="Problem statement" accent={accent}>
        <p className="border-l-4 pl-4 font-grotesk text-xl leading-snug text-bone" style={{ borderColor: accent }}>
          {d.problem}
        </p>
      </Block>
      <Block n="03" title="Design objectives" accent={accent}>
        <List items={d.objectives} accent={accent} />
      </Block>
      <Block n="04" title="Research & discovery" accent={accent}>
        <div className="grid gap-3 sm:grid-cols-3">
          {d.research.map((t, i) => (
            <div key={t} className="rounded-xl border border-bone/10 bg-bone/[0.03] p-4">
              <span className="font-mono text-xs text-muted">R{i + 1}</span>
              <p className="mt-2 text-sm">{t}</p>
            </div>
          ))}
        </div>
      </Block>
      <Block n="05" title="User flow" accent={accent}>
        <div className="flex flex-wrap items-center gap-2">
          {d.userFlow.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span
                className={cn("rounded-full border px-4 py-2 font-grotesk text-sm font-medium", i === 0 || i === d.userFlow.length - 1 ? "text-ink" : "border-bone/30")}
                style={i === 0 || i === d.userFlow.length - 1 ? { background: accent, borderColor: accent } : undefined}
              >
                {s}
              </span>
              {i < d.userFlow.length - 1 && <span className="font-mono text-muted">→</span>}
            </div>
          ))}
        </div>
      </Block>
      <Block n="06" title="Wireframes" accent={accent}>
        <div className={cn("grid gap-3", phone ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2")}>
          {d.wireframes.map((src, i) => (
            <figure key={src} className="overflow-hidden rounded-lg">
              <Img src={src} alt={`${p.title} wireframe ${i + 1}`} />
            </figure>
          ))}
        </div>
      </Block>
      <Block n="07" title="UI design" accent={accent}>
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-plum p-6 md:p-10">
          <div className={cn("relative overflow-hidden border-[6px] border-[#1a1726] bg-ink shadow-2xl", phone ? "w-[220px] rounded-[2rem]" : "w-full rounded-xl")}>
            <AnimatePresence mode="wait">
              <motion.div key={screen} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
                <Img src={d.screens[screen]} alt={`${p.title} screen ${screen + 1}`} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Previous screen" className="grid h-10 w-10 place-items-center rounded-full border border-bone/20 hover:bg-bone/10" onClick={() => setScreen((s) => (s - 1 + d.screens.length) % d.screens.length)}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-mono text-xs">
              {pad(screen + 1)} / {pad(d.screens.length)}
            </span>
            <button type="button" aria-label="Next screen" className="grid h-10 w-10 place-items-center rounded-full border border-bone/20 hover:bg-bone/10" onClick={() => setScreen((s) => (s + 1) % d.screens.length)}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Block>
      <Block n="08" title="Prototype" accent={accent}>
        {d.prototypeUrl ? (
          <a href={d.prototypeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-bold text-ink" style={{ background: accent }}>
            Open interactive prototype <ArrowUpRight className="h-4 w-4" />
          </a>
        ) : (
          <p className="flex items-center gap-2 text-sm text-muted">
            {phone ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
            Add a Figma / Protopie link via <code className="text-bone">prototypeUrl</code> in data/projects.ts to embed it here.
          </p>
        )}
      </Block>
      <Block n="09" title="Final results" accent={accent}>
        <List items={d.results} accent={accent} />
      </Block>
    </>
  );
}

function VibeBody({ p, d, accent }: { p: Project; d: VibeDetails; accent: string }) {
  const live = p.links?.live;
  const [loadPreview, setLoadPreview] = useState(false);
  return (
    <>
      <Block n="01" title="Project overview" accent={accent}>
        <p className="text-lg leading-relaxed">{d.overview}</p>
      </Block>
      <Block n="02" title="Live preview" accent={accent}>
        <div className="overflow-hidden rounded-xl border border-bone/15 bg-[#0b0918]">
          <div className="flex items-center gap-2 border-b border-bone/10 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 truncate rounded-md bg-bone/5 px-3 py-1 font-mono text-xs text-muted">{live ?? "preview.local"}</span>
          </div>
          <div className="relative aspect-[16/10]">
            {live && loadPreview ? (
              <iframe src={live} title={`${p.title} live preview`} className="absolute inset-0 h-full w-full bg-ink" loading="lazy" sandbox="allow-scripts allow-same-origin" />
            ) : (
              <>
                <Img src={p.thumbnail} alt={`${p.title} preview`} className="absolute inset-0 h-full object-cover" />
                {live && (
                  <button
                    type="button"
                    onClick={() => setLoadPreview(true)}
                    data-cursor="Play"
                    className="absolute inset-0 grid place-items-center bg-ink/50 font-condensed text-3xl tracking-wider transition-colors hover:bg-ink/30"
                  >
                    <span className="rounded-full px-6 py-3 text-ink" style={{ background: accent }}>
                      ▶ Load interactive preview
                    </span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </Block>
      <Block n="03" title="Creative concept" accent={accent}>
        <p className="font-grotesk text-xl leading-snug text-bone">{d.concept}</p>
      </Block>
      <Block n="04" title="Main features" accent={accent}>
        <List items={d.features} accent={accent} />
      </Block>
      <Block n="05" title="Technologies" accent={accent}>
        <div className="flex flex-wrap gap-2">
          {d.technologies.map((t) => (
            <span key={t} className="rounded-md border border-bone/20 bg-bone/5 px-3 py-1.5 font-mono text-xs">
              {t}
            </span>
          ))}
        </div>
      </Block>
    </>
  );
}

export default function ProjectModal({
  project,
  onClose,
  onNavigate,
}: {
  project: Project | null;
  onClose: () => void;
  /** Optional prev/next navigation within a list. */
  onNavigate?: (dir: 1 | -1) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    lastFocus.current = document.activeElement as HTMLElement;
    lockScroll(true);
    const t = setTimeout(() => closeRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (onNavigate && e.key === "ArrowRight") onNavigate(1);
      if (onNavigate && e.key === "ArrowLeft") onNavigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      lastFocus.current?.focus?.();
    };
  }, [project, onClose, onNavigate]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [project?.id]);

  const cat = project ? getCategory(project.category) : null;
  const accent = cat?.accent ?? "#19FF32";

  return (
    <AnimatePresence>
      {project && cat && (
        <motion.div
          key="modal"
          className="fixed inset-0 z-[140]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            ref={scroller}
            data-lenis-prevent
            className="absolute inset-x-0 bottom-0 top-4 overflow-y-auto overscroll-contain rounded-t-[1.75rem] border-t border-bone/10 bg-ink md:inset-x-6 md:top-8"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-bone/10 bg-ink/90 px-5 py-3 backdrop-blur md:px-10">
              <span className="tech-label truncate">
                <span style={{ color: accent }}>{cat.index}</span> | {cat.title} | {project.type}
              </span>
              <div className="flex items-center gap-2">
                {onNavigate && (
                  <>
                    <button type="button" aria-label="Previous project" onClick={() => onNavigate(-1)} className="grid h-10 w-10 place-items-center rounded-full border border-bone/20 hover:bg-bone/10">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button type="button" aria-label="Next project" onClick={() => onNavigate(1)} className="grid h-10 w-10 place-items-center rounded-full border border-bone/20 hover:bg-bone/10">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close project"
                  className="grid h-10 w-10 place-items-center rounded-full text-ink transition-transform hover:rotate-90"
                  style={{ background: accent }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <article className="mx-auto max-w-6xl px-5 pb-24 pt-10 md:px-10">
              <header className="grid gap-8 md:grid-cols-12">
                <div className="md:col-span-8">
                  <h2 id="project-title" className="font-display text-[11vw] uppercase leading-[0.9] tracking-tight md:text-7xl">
                    {project.title}
                  </h2>
                  <p className="mt-5 max-w-2xl text-lg text-bone/80">{project.description}</p>
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 self-end font-mono text-xs uppercase md:col-span-4">
                  {[
                    ["Year", String(project.year)],
                    ["Type", project.type],
                    ["Client", project.client],
                    ["Role", project.role],
                  ].map(([k, v]) => (
                    <div key={k} className="border-t border-bone/15 pt-2">
                      <dt className="text-muted">{k}</dt>
                      <dd className="mt-1 text-bone">{v}</dd>
                    </div>
                  ))}
                  <div className="col-span-2 border-t border-bone/15 pt-2">
                    <dt className="text-muted">Tools</dt>
                    <dd className="mt-1 flex flex-wrap gap-1.5">
                      {project.tools.map((t) => (
                        <span key={t} className="rounded-full border border-bone/20 px-2 py-0.5 normal-case text-bone">
                          {t}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </header>

              {project.details.kind !== "graphic-design" && (
                <figure className="my-10 overflow-hidden rounded-2xl bg-plum">
                  <Img src={project.thumbnail} alt={`${project.title} hero`} className={project.ratio < 0.7 ? "mx-auto max-h-[70vh] w-auto" : ""} />
                </figure>
              )}

              <div className="mt-6">
                {project.details.kind === "graphic-design" && <GraphicBody p={project} d={project.details} accent={accent} />}
                {project.details.kind === "uiux-design" && <UiuxBody p={project} d={project.details} accent={accent} />}
                {project.details.kind === "vibe-coding" && <VibeBody p={project} d={project.details} accent={accent} />}
              </div>

              {(project.links?.live || project.links?.github || project.links?.external?.length) && (
                <div className="mt-8 flex flex-wrap gap-3 border-t border-bone/10 pt-8">
                  {project.links?.live && (
                    <a href={project.links.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-bold text-ink" style={{ background: accent }}>
                      Visit live site <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {project.links?.github && (
                    <a href={project.links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-bone/30 px-5 py-3 font-bold hover:bg-bone/10">
                      <GithubIcon className="h-4 w-4" /> Source on GitHub
                    </a>
                  )}
                  {project.links?.external?.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-bone/30 px-5 py-3 font-bold hover:bg-bone/10">
                      {l.label} <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              )}
            </article>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
