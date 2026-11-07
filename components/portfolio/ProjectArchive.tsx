"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight, LayoutGrid, List } from "lucide-react";
import { projects } from "@/data/projects";
import { categories, getCategory } from "@/data/categories";
import type { CategorySlug } from "@/data/types";
import { useProjectModal } from "@/hooks/useProjectModal";
import { cn, pad } from "@/lib/utils";
import ProjectModal from "@/components/project/ProjectModal";
import { SectionLabel, SmartImage } from "@/components/ui/Misc";

type Filter = "all" | CategorySlug;

export default function ProjectArchive() {
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<"list" | "grid">("list");
  const [hoverId, setHoverId] = useState<string | null>(null);

  // Allow deep links like /portfolio?filter=uiux-design
  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get("filter");
    if (f && categories.some((c) => c.slug === f)) setFilter(f as CategorySlug);
  }, []);

  const list = useMemo(
    () => [...projects].filter((p) => filter === "all" || p.category === filter).sort((a, b) => b.year - a.year),
    [filter],
  );
  const modal = useProjectModal(list);

  // floating hover preview (desktop list view)
  const box = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 25 });
  const sy = useSpring(y, { stiffness: 200, damping: 25 });
  const hovered = list.find((p) => p.id === hoverId);

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: projects.length },
    ...categories.map((c) => ({ key: c.slug as Filter, label: c.shortTitle, count: projects.filter((p) => p.category === c.slug).length })),
  ];

  const setF = (f: Filter) => {
    setFilter(f);
    const url = new URL(window.location.href);
    if (f === "all") url.searchParams.delete("filter");
    else url.searchParams.set("filter", f);
    history.replaceState(null, "", url);
  };

  return (
    <section id="archive" aria-labelledby="archive-title" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="B">All projects</SectionLabel>
        <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 id="archive-title" className="font-display text-5xl uppercase leading-none md:text-7xl">
            The archive
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
              {filters.map((f) => {
                const on = filter === f.key;
                const accent = f.key === "all" ? "#F5F3EF" : getCategory(f.key).accent;
                return (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setF(f.key)}
                    className={cn(
                      "relative rounded-full px-4 py-2 font-grotesk text-sm font-bold uppercase tracking-wider ring-1 ring-bone/20 transition-colors",
                      on ? "text-ink" : "text-bone hover:ring-bone/60",
                    )}
                  >
                    {on && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full" style={{ background: accent }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                    <span className="relative">
                      {f.label} <sup className="font-mono text-[9px]">{pad(f.count)}</sup>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="ml-2 flex rounded-full p-1 ring-1 ring-bone/20" role="group" aria-label="Layout">
              <button type="button" aria-pressed={view === "list"} aria-label="List view" onClick={() => setView("list")} className={cn("grid h-9 w-9 place-items-center rounded-full", view === "list" && "bg-bone text-ink")}>
                <List className="h-4 w-4" />
              </button>
              <button type="button" aria-pressed={view === "grid"} aria-label="Grid view" onClick={() => setView("grid")} className={cn("grid h-9 w-9 place-items-center rounded-full", view === "grid" && "bg-bone text-ink")}>
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {view === "list" ? (
          <div
            ref={box}
            className="relative mt-10"
            onPointerMove={(e) => {
              x.set(e.clientX + 24);
              y.set(e.clientY - 120);
            }}
          >
            <div className="hidden grid-cols-12 gap-4 border-b border-bone/15 pb-3 font-mono text-[10px] uppercase tracking-widest text-muted md:grid">
              <span className="col-span-1">No.</span>
              <span className="col-span-5">Project</span>
              <span className="col-span-3">Type</span>
              <span className="col-span-2">Discipline</span>
              <span className="col-span-1 text-right">Year</span>
            </div>
            <motion.ul layout>
              <AnimatePresence initial={false} mode="popLayout">
                {list.map((p, i) => {
                  const c = getCategory(p.category);
                  return (
                    <motion.li
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, delay: i * 0.02 }}
                      className="border-b border-bone/10"
                    >
                      <button
                        type="button"
                        onClick={() => modal.open(p)}
                        onMouseEnter={() => setHoverId(p.id)}
                        onMouseLeave={() => setHoverId(null)}
                        onFocus={() => setHoverId(p.id)}
                        onBlur={() => setHoverId(null)}
                        data-cursor="Open"
                        className="group relative grid w-full grid-cols-12 items-center gap-4 overflow-hidden py-5 text-left md:py-6"
                      >
                        <span className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-y-100" style={{ background: c.accent }} />
                        <span className="relative col-span-2 font-mono text-xs text-muted transition-colors group-hover:text-ink md:col-span-1">{pad(i + 1)}</span>
                        <span className="relative col-span-10 font-display text-2xl uppercase leading-none transition-[color,transform] duration-500 group-hover:translate-x-3 group-hover:text-ink md:col-span-5 md:text-4xl">
                          {p.title}
                        </span>
                        <span className="relative col-span-6 col-start-3 font-grotesk text-sm text-bone/70 transition-colors group-hover:text-ink md:col-span-3 md:col-start-auto">{p.type}</span>
                        <span className="relative col-span-3 font-mono text-[11px] uppercase transition-colors group-hover:text-ink md:col-span-2" style={{ color: undefined }}>
                          <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: c.accent }} />
                          {c.shortTitle}
                        </span>
                        <span className="relative col-span-1 flex items-center justify-end gap-2 font-mono text-xs transition-colors group-hover:text-ink">
                          <span className="hidden md:inline">{p.year}</span>
                          <ArrowUpRight className="h-4 w-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </motion.ul>

            {/* cursor-following preview */}
            <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[60] hidden lg:block" style={{ x: sx, y: sy }}>
              <AnimatePresence>
                {hovered && (
                  <motion.div
                    key={hovered.id}
                    className="relative h-60 w-72 overflow-hidden rounded-xl bg-plum shadow-2xl"
                    initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
                    animate={{ opacity: 1, scale: 1, rotate: -3 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 4 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <SmartImage src={hovered.thumbnail} alt="" className={hovered.ratio < 0.6 ? "object-contain p-3" : "object-cover"} sizes="288px" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        ) : (
          <motion.div layout className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => {
                const c = getCategory(p.category);
                return (
                  <motion.button
                    key={p.id}
                    layout
                    type="button"
                    onClick={() => modal.open(p)}
                    data-cursor="Open"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.4, delay: i * 0.03 }}
                    className="group mb-5 block w-full break-inside-avoid text-left"
                  >
                    <div className="relative overflow-hidden rounded-xl bg-plum" style={{ aspectRatio: Math.max(p.ratio, 0.7) }}>
                      <SmartImage
                        src={p.thumbnail}
                        alt={p.title}
                        className={cn("transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-105", p.ratio < 0.6 ? "object-contain p-4" : "object-cover")}
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                      <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase" style={{ background: c.accent, color: c.onAccent }}>
                        {c.shortTitle}
                      </span>
                    </div>
                    <div className="mt-3 flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-xl uppercase leading-none">{p.title}</h3>
                      <span className="font-mono text-xs text-muted">{p.year}</span>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      <ProjectModal project={modal.project} onClose={modal.close} onNavigate={modal.navigate} />
    </section>
  );
}
