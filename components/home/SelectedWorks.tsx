"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { featuredProjects, projects } from "@/data/projects";
import { useProjectModal } from "@/hooks/useProjectModal";
import { cn } from "@/lib/utils";
import ProjectModal from "@/components/project/ProjectModal";
import WorkCard from "@/components/portfolio/WorkCard";
import { FadeIn, RevealText } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/Misc";

/** Asymmetric editorial rhythm: [grid classes, panel ratio]. Repeats every 5 projects. */
const LAYOUT: [string, number][] = [
  ["md:col-span-7", 4 / 3],
  ["md:col-span-4 md:col-start-9 md:mt-48", 4 / 5],
  ["md:col-span-5 md:mt-8", 4 / 5],
  ["md:col-span-6 md:col-start-7 md:mt-40", 4 / 3],
  ["md:col-span-8 md:col-start-3 md:mt-8", 16 / 9],
];

export default function SelectedWorks() {
  const modal = useProjectModal(featuredProjects);

  return (
    <section id="works" data-nav="work" className="relative scroll-mt-24 border-t border-line py-24 md:py-40">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel index="02">Work</SectionLabel>
            <RevealText as="h2" text="Selected works" className="h-section mt-8" />
          </div>
          <FadeIn className="max-w-xs">
            <p className="text-sm leading-relaxed text-muted">
              A selection across graphic design, UI/UX design and web development.
            </p>
            <p className="label mt-3">
              {String(featuredProjects.length).padStart(2, "0")} selected / {String(projects.length).padStart(2, "0")} in archive
            </p>
          </FadeIn>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-16 md:mt-24 md:grid-cols-12 md:gap-y-24">
          {featuredProjects.map((p, i) => {
            const [cls, ratio] = LAYOUT[i % LAYOUT.length];
            return <WorkCard key={p.id} project={p} index={i} panelRatio={ratio} onOpen={modal.open} className={cn(cls)} />;
          })}
        </div>

        {/* Explore all */}
        <Link
          href="/portfolio"
          data-cursor="Archive"
          className="group mt-24 flex items-center justify-between gap-6 border-y border-ink/15 py-8 transition-[padding] duration-500 ease-[var(--ease-expo)] hover:px-4 md:mt-36 md:py-12"
        >
          <span className="font-display text-[clamp(1.8rem,6vw,5rem)] font-medium uppercase leading-none tracking-[-0.035em]">
            Explore all works
          </span>
          <span className="flex items-center gap-4">
            <span className="label hidden sm:inline">{String(projects.length).padStart(2, "0")} projects</span>
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-ink text-paper transition-all duration-500 ease-[var(--ease-expo)] group-hover:rotate-45 group-hover:bg-lime group-hover:text-ink md:h-20 md:w-20">
              <ArrowUpRight className="h-6 w-6 md:h-8 md:w-8" />
            </span>
          </span>
        </Link>
      </div>
      <ProjectModal project={modal.project} onClose={modal.close} onNavigate={modal.navigate} />
    </section>
  );
}
