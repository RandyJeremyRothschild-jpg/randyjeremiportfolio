"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Play, X } from "lucide-react";
import type { GraphicDetails, Project, UiuxDetails, WebDetails } from "@/data/types";
import { getCategory } from "@/data/categories";
import { lockScroll } from "@/lib/scroll";
import { cn, pad } from "@/lib/utils";
import { GithubIcon } from "@/components/ui/SocialIcons";
import Button from "@/components/ui/Button";

// ── Building blocks ─────────────────────────────────────────────────────────
function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-line py-8 md:grid-cols-12 md:py-10">
      <div className="md:col-span-4">
        <p className="label">{n}</p>
        <h3 className="mt-2 font-display text-xl font-medium tracking-[-0.02em] md:text-2xl">{title}</h3>
      </div>
      <div className="leading-relaxed text-ink/80 md:col-span-8">{children}</div>
    </section>
  );
}

function List({ items, ordered }: { items: string[]; ordered?: boolean }) {
  return (
    <ul className="space-y-2.5">
      {items.map((t, i) => (
        <li key={t} className="flex gap-4">
          {ordered ? (
            <span className="label w-5 shrink-0 pt-1 text-ink">{pad(i + 1)}</span>
          ) : (
            <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-lime ring-1 ring-ink/30" />
          )}
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Img({ src, alt, className }: { src: string; alt: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={cn("block h-auto", !className?.includes("w-auto") && "w-full", className)} />;
}

// ── Graphic design ──────────────────────────────────────────────────────────
function GraphicBody({ p, d }: { p: Project; d: GraphicDetails }) {
  return (
    <>
      {/* artwork first */}
      <figure className="mb-10 overflow-hidden rounded-sm bg-soft">
        <Img src={p.gallery[0] ?? p.thumbnail} alt={`${p.title} — key visual`} className="mx-auto max-h-[80vh] w-auto max-w-full" />
      </figure>
      <Block n="01" title="Project overview">
        <p className="text-lg leading-relaxed text-ink">{p.description}</p>
      </Block>
      <Block n="02" title="Creative brief">
        <p>{d.overview}</p>
      </Block>
      <Block n="03" title="Design objectives">
        <List items={d.objectives} />
      </Block>
      <Block n="04" title="Creative direction">
        <List items={d.process} ordered />
      </Block>
      {p.gallery.length > 1 && (
        <Block n="05" title="Visual exploration">
          <div className="grid gap-4 sm:grid-cols-2">
            {p.gallery.slice(1).map((src, i) => (
              <figure key={src} className={cn("overflow-hidden rounded-sm bg-soft", p.gallery.length === 2 && "sm:col-span-2")}>
                <Img src={src} alt={`${p.title} — exploration ${i + 1}`} />
              </figure>
            ))}
          </div>
        </Block>
      )}
      <Block n={p.gallery.length > 1 ? "06" : "05"} title="Final results">
        <List items={d.outcomes} />
      </Block>
    </>
  );
}

// ── UI/UX design ────────────────────────────────────────────────────────────
function UiuxBody({ p, d }: { p: Project; d: UiuxDetails }) {
  const [screen, setScreen] = useState(0);
  const phone = d.device === "phone";
  return (
    <>
      <Block n="01" title="Overview">
        <p className="text-lg leading-relaxed text-ink">{d.overview}</p>
      </Block>
      <Block n="02" title="Problem statement">
        <p className="border-l-2 border-ink pl-5 font-display text-xl leading-snug tracking-[-0.01em] text-ink">{d.problem}</p>
      </Block>
      <Block n="03" title="Design objectives">
        <List items={d.objectives} />
      </Block>
      <Block n="04" title="User research">
        <div className="grid gap-3 sm:grid-cols-3">
          {d.research.map((t, i) => (
            <div key={t} className="rounded-sm border border-line bg-surface p-4">
              <span className="label">R{i + 1}</span>
              <p className="mt-2 text-sm">{t}</p>
            </div>
          ))}
        </div>
      </Block>
      <Block n="05" title="User flow">
        <ol className="flex flex-wrap items-center gap-2">
          {d.userFlow.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full border px-4 py-2 font-ui text-sm font-medium",
                  i === 0 || i === d.userFlow.length - 1 ? "border-ink bg-ink text-paper" : "border-ink/15 bg-surface",
                )}
              >
                <span className="mr-2 font-mono text-[10px] opacity-60">{pad(i + 1)}</span>
                {s}
              </span>
              {i < d.userFlow.length - 1 && <span className="font-mono text-muted" aria-hidden>→</span>}
            </li>
          ))}
        </ol>
      </Block>
      <Block n="06" title="Wireframes">
        <div className={cn("grid gap-3", phone ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2")}>
          {d.wireframes.map((src, i) => (
            <figure key={src} className="overflow-hidden rounded-sm border border-line">
              <Img src={src} alt={`${p.title} wireframe ${i + 1}`} />
            </figure>
          ))}
        </div>
      </Block>
      <Block n="07" title="UI design">
        <div className="grid-paper flex flex-col items-center gap-5 rounded-sm bg-soft p-6 md:p-10">
          <div
            className={cn(
              "relative overflow-hidden bg-ink shadow-[0_30px_60px_-24px_rgb(23_25_28/0.5)] ring-[6px] ring-ink",
              phone ? "w-[230px] rounded-[2rem]" : "w-full rounded-lg",
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div key={screen} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
                <Img src={d.screens[screen]} alt={`${p.title} screen ${screen + 1}`} />
              </motion.div>
            </AnimatePresence>
          </div>
          {d.screens.length > 1 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous screen"
                className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 bg-surface hover:border-ink/40"
                onClick={() => setScreen((s) => (s - 1 + d.screens.length) % d.screens.length)}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="label text-ink">
                {pad(screen + 1)} / {pad(d.screens.length)}
              </span>
              <button
                type="button"
                aria-label="Next screen"
                className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 bg-surface hover:border-ink/40"
                onClick={() => setScreen((s) => (s + 1) % d.screens.length)}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </Block>
      <Block n="08" title="Prototype">
        {d.prototypeUrl ? (
          <Button href={d.prototypeUrl}>Open interactive prototype</Button>
        ) : (
          <p className="label normal-case tracking-normal">
            Prototype link not published yet — add <code className="text-ink">prototypeUrl</code> to this project in data/projects.ts.
          </p>
        )}
      </Block>
      <Block n="09" title="Final outcome">
        <List items={d.results} />
      </Block>
    </>
  );
}

// ── Web development ─────────────────────────────────────────────────────────
function WebBody({ p, d }: { p: Project; d: WebDetails }) {
  const live = p.links?.live;
  const [loadPreview, setLoadPreview] = useState(false);
  let n = 0;
  const next = () => pad(++n);
  return (
    <>
      <Block n={next()} title="Project overview">
        <p className="text-lg leading-relaxed text-ink">{d.overview}</p>
      </Block>
      <Block n={next()} title="Creative concept">
        <p className="font-display text-xl leading-snug tracking-[-0.01em] text-ink">{d.concept}</p>
      </Block>
      <Block n={next()} title="Technologies used">
        <div className="flex flex-wrap gap-2">
          {d.technologies.map((t) => (
            <span key={t} className="rounded-sm border border-line bg-surface px-3 py-1.5 font-mono text-xs">
              {t}
            </span>
          ))}
        </div>
      </Block>
      <Block n={next()} title="Main features">
        <List items={d.features} />
      </Block>
      {d.process && d.process.length > 0 && (
        <Block n={next()} title="Development process">
          <List items={d.process} ordered />
        </Block>
      )}
      <Block n={next()} title="Live website preview">
        <div className="overflow-hidden rounded-lg border border-ink/15 bg-surface">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-lime ring-1 ring-ink/20" />
            <span className="ml-3 flex-1 truncate rounded-full bg-soft px-3 py-1 font-mono text-[11px] text-muted">{live ?? "not deployed yet"}</span>
            {live && (
              <a href={live} target="_blank" rel="noreferrer" aria-label="Open live site in a new tab" className="text-muted hover:text-ink">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          <div className="relative aspect-[16/10] bg-soft">
            {live && loadPreview ? (
              <iframe src={live} title={`${p.title} live preview`} className="absolute inset-0 h-full w-full bg-white" loading="lazy" sandbox="allow-scripts allow-same-origin" />
            ) : (
              <>
                <Img src={p.thumbnail} alt={`${p.title} preview`} className="absolute inset-0 h-full object-cover" />
                {live && (
                  <button
                    type="button"
                    onClick={() => setLoadPreview(true)}
                    className="absolute inset-0 grid place-items-center bg-ink/35 transition-colors hover:bg-ink/20"
                  >
                    <span className="inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 font-ui text-sm font-medium text-ink">
                      <Play className="h-4 w-4" /> Load interactive preview
                    </span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </Block>
    </>
  );
}

// ── Modal ───────────────────────────────────────────────────────────────────
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!project, onClose, onNavigate]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [project?.id]);

  const cat = project ? getCategory(project.category) : null;

  return (
    <AnimatePresence>
      {project && cat && (
        <motion.div
          key="modal"
          className="fixed inset-0 z-[140] text-ink"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            ref={scroller}
            data-lenis-prevent
            className="absolute inset-x-0 bottom-0 top-4 overflow-y-auto overscroll-contain rounded-t-2xl bg-paper md:inset-x-6 md:top-6"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-paper/90 px-5 py-3 backdrop-blur md:px-10">
              <span className="label flex min-w-0 items-center gap-2 truncate">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full ring-1 ring-ink/25" style={{ background: cat.accent }} />
                <span className="text-ink">{cat.index}</span> {cat.title} / {project.type}
              </span>
              <div className="flex items-center gap-2">
                {onNavigate && (
                  <>
                    <button type="button" aria-label="Previous project" onClick={() => onNavigate(-1)} className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 bg-surface hover:border-ink/40">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button type="button" aria-label="Next project" onClick={() => onNavigate(1)} className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 bg-surface hover:border-ink/40">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close project"
                  className="grid h-10 w-10 place-items-center rounded-full bg-ink text-paper transition-transform duration-300 hover:rotate-90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <article className="mx-auto max-w-6xl px-5 pb-24 pt-10 md:px-10 md:pt-16">
              <header className="grid gap-8 md:grid-cols-12">
                <div className="md:col-span-8">
                  <h2 id="project-title" className="h-display text-[clamp(2.2rem,6vw,5rem)]">
                    {project.title}
                  </h2>
                  {project.details.kind !== "graphic-design" && <p className="mt-5 max-w-2xl text-lg text-ink/80">{project.description}</p>}
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 self-end md:col-span-4">
                  {[
                    ["Year", String(project.year)],
                    ["Type", project.type],
                    ["Client", project.client],
                    ["Role", project.role],
                  ].map(([k, v]) => (
                    <div key={k} className="border-t border-line pt-2">
                      <dt className="label">{k}</dt>
                      <dd className="mt-1 text-sm">{v}</dd>
                    </div>
                  ))}
                  <div className="col-span-2 border-t border-line pt-2">
                    <dt className="label">Tools</dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {project.tools.map((t) => (
                        <span key={t} className="rounded-full border border-ink/15 bg-surface px-2.5 py-0.5 font-mono text-[11px]">
                          {t}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </header>

              {project.details.kind === "uiux-design" && (
                <figure className="grid-paper my-10 overflow-hidden rounded-sm bg-soft p-6 md:p-12">
                  <Img
                    src={project.thumbnail}
                    alt={`${project.title} hero`}
                    className={cn(
                      "mx-auto shadow-[0_30px_60px_-24px_rgb(23_25_28/0.45)]",
                      project.ratio < 0.7 ? "max-h-[64vh] w-auto rounded-[1.6rem] ring-[6px] ring-ink" : "rounded-lg ring-[6px] ring-ink",
                    )}
                  />
                </figure>
              )}

              <div className="mt-10">
                {project.details.kind === "graphic-design" && <GraphicBody p={project} d={project.details} />}
                {project.details.kind === "uiux-design" && <UiuxBody p={project} d={project.details} />}
                {project.details.kind === "web-development" && <WebBody p={project} d={project.details} />}
              </div>

              {(project.links?.live || project.links?.github || project.links?.external?.length) && (
                <div className="flex flex-wrap gap-3 border-t border-line pt-8">
                  {project.links?.live && (
                    <Button href={project.links.live} external>
                      Visit live site
                    </Button>
                  )}
                  {project.links?.github && (
                    <Button href={project.links.github} variant="outline" icon={<GithubIcon className="h-4 w-4" />}>
                      GitHub repository
                    </Button>
                  )}
                  {project.links?.external?.map((l) => (
                    <Button key={l.href} href={l.href} variant="outline" icon={<ArrowUpRight className="h-4 w-4" />}>
                      {l.label}
                    </Button>
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
