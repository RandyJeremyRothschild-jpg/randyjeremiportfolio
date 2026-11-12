"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { projects, getProjectsByCategory } from "@/data/projects";
import { categories } from "@/data/categories";
import type { CategorySlug } from "@/data/types";
import { useProjectModal } from "@/hooks/useProjectModal";
import { cn, pad } from "@/lib/utils";
import ProjectModal from "@/components/project/ProjectModal";
import PosterStack from "./PosterStack";
import WorkCard from "./WorkCard";
import { FadeIn, RevealText } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/Misc";

type Filter = "all" | CategorySlug;

/** Asymmetric rhythm for the archive: [grid classes, panel ratio]. */
const LAYOUT: [string, number][] = [
  ["md:col-span-7", 4 / 3],
  ["md:col-span-5 md:mt-24", 4 / 5],
  ["md:col-span-4", 4 / 5],
  ["md:col-span-4 md:mt-16", 1],
  ["md:col-span-4 md:mt-32", 4 / 5],
  ["md:col-span-5 md:mt-8", 4 / 5],
  ["md:col-span-7 md:mt-24", 4 / 3],
];

function Hero() {
  const years = projects.map((p) => p.year);
  const stats: [string, string][] = [
    [pad(projects.length), "Projects"],
    [pad(categories.length), "Disciplines"],
    [`${Math.min(...years)}—${String(Math.max(...years)).slice(2)}`, "Years"],
  ];
  return (
    <section className="relative pt-32 md:pt-44">
      <div className="wrap">
        <SectionLabel index="Work">Archive</SectionLabel>
        <RevealText
          as="h1"
          immediate
          delay={0.35}
          text={"An archive of\nideas *& executions."}
          highlightClassName="text-muted"
          className="h-display mt-8 text-[clamp(2.4rem,7.6vw,7.25rem)]"
        />
        <div className="mt-10 grid gap-8 md:mt-16 md:grid-cols-12 md:items-end">
          <FadeIn className="md:col-span-5">
            <p className="max-w-md text-lg leading-relaxed text-ink/80">
              Everything in one place — graphic design, UI/UX design and web development. Pick a discipline, or filter the full archive below.
            </p>
          </FadeIn>
          <FadeIn className="md:col-span-6 md:col-start-7" delay={0.1}>
            <dl className="grid grid-cols-3 border-t border-ink/15">
              {stats.map(([v, k]) => (
                <div key={k} className="border-b border-line py-4 pr-4">
                  <dd className="font-display text-3xl font-medium tabular-nums tracking-[-0.03em] md:text-5xl">{v}</dd>
                  <dt className="label mt-2">{k}</dt>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section aria-label="Disciplines" className="pt-20 md:pt-32">
      <div className="wrap">
        <SectionLabel index="A">Disciplines</SectionLabel>
        <ul className="mt-8 border-t border-ink/15">
          {categories.map((c) => {
            const items = getProjectsByCategory(c.slug);
            return (
              <li key={c.slug} className="border-b border-ink/15">
                <Link href={c.href} data-cursor="Enter" className="group grid gap-8 py-8 md:grid-cols-12 md:items-center md:py-12">
                  <div className="md:col-span-5">
                    <p className="label flex items-center gap-3">
                      <span className="text-ink">{c.index}</span>
                      <span className="h-1.5 w-1.5 rounded-full ring-1 ring-ink/25" style={{ background: c.accent }} aria-hidden />
                      {pad(items.length)} projects
                    </p>
                    <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,4.5rem)] font-medium uppercase leading-[0.95] tracking-[-0.035em]">
                      {c.title}
                    </h2>
                    <p className="mt-5 max-w-sm leading-relaxed text-muted transition-colors duration-300 group-hover:text-ink">{c.description}</p>
                    <span className="mt-6 inline-flex items-center gap-3 font-ui text-sm font-medium">
                      <span className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 transition-all duration-500 ease-[var(--ease-expo)] group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                      View {c.shortTitle.toLowerCase()} work
                    </span>
                  </div>
                  <PosterStack items={items} className="aspect-[16/10] md:col-span-6 md:col-start-7" sizes="(max-width: 768px) 60vw, 25vw" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Archive() {
  const [filter, setFilter] = useState<Filter>("all");

  // Deep links: /portfolio?filter=uiux-design
  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get("filter");
    if (f && categories.some((c) => c.slug === f)) setFilter(f as CategorySlug);
  }, []);

  const list = useMemo(
    () => projects.filter((p) => filter === "all" || p.category === filter).sort((a, b) => b.year - a.year),
    [filter],
  );
  const modal = useProjectModal(list);

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: projects.length },
    ...categories.map((c) => ({ key: c.slug as Filter, label: c.title, count: getProjectsByCategory(c.slug).length })),
  ];

  const choose = (f: Filter) => {
    setFilter(f);
    const url = new URL(window.location.href);
    if (f === "all") url.searchParams.delete("filter");
    else url.searchParams.set("filter", f);
    history.replaceState(null, "", url);
  };

  return (
    <section id="archive" aria-labelledby="archive-title" className="scroll-mt-24 py-20 md:py-32">
      <div className="wrap">
        <SectionLabel index="B">All projects</SectionLabel>
        <div className="mt-8 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <h2 id="archive-title" className="h-section">
            The full archive
          </h2>
          <div role="group" aria-label="Filter projects by discipline" className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const on = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => choose(f.key)}
                  className={cn(
                    "relative flex h-11 items-center gap-2 rounded-full border px-4 font-ui text-sm font-medium transition-colors duration-300",
                    on ? "border-ink text-paper" : "border-ink/15 bg-surface/60 text-ink hover:border-ink/40",
                  )}
                >
                  {on && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  <span className="relative">{f.label}</span>
                  <span className={cn("relative font-mono text-[10px]", on ? "text-lime" : "text-muted")}>{pad(f.count)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-14 md:mt-20 md:grid-cols-12 md:gap-y-20">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => {
              const [cls, ratio] = LAYOUT[i % LAYOUT.length];
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className={cls}
                >
                  <WorkCard project={p} index={i} panelRatio={ratio} onOpen={modal.open} showDescription={false} sizes="(max-width: 768px) 100vw, 45vw" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        <p className="label mt-16" aria-live="polite">
          Showing {pad(list.length)} of {pad(projects.length)} projects
        </p>
      </div>
      <ProjectModal project={modal.project} onClose={modal.close} onNavigate={modal.navigate} />
    </section>
  );
}

export default function PortfolioOverview() {
  return (
    <>
      <Hero />
      <Categories />
      <Archive />
    </>
  );
}
