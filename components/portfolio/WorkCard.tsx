"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Project } from "@/data/types";
import { getCategory } from "@/data/categories";
import { useReducedMotion } from "@/hooks/useMedia";
import { cn } from "@/lib/utils";
import { ImageReveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/Misc";

/**
 * Editorial project card: a large image panel with a scroll reveal, subtle
 * parallax and hover zoom, followed by title / category / year / description.
 * `panelRatio` is the panel's width / height; artwork that doesn't match it is
 * presented "matted" (contained on the panel) instead of being cropped.
 */
export default function WorkCard({
  project,
  index,
  panelRatio = 4 / 3,
  onOpen,
  className,
  sizes = "(max-width: 768px) 100vw, 55vw",
  showDescription = true,
}: {
  project: Project;
  index?: number;
  panelRatio?: number;
  onOpen: (p: Project) => void;
  className?: string;
  sizes?: string;
  showDescription?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const cat = getCategory(project.category);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-3.5%", "3.5%"]);

  const fits = Math.abs(project.ratio - panelRatio) / panelRatio < 0.22;
  const phone = project.ratio < 0.6;

  return (
    <article ref={ref} className={cn("group", className)}>
      <button
        type="button"
        onClick={() => onOpen(project)}
        data-cursor="View"
        aria-label={`Open project: ${project.title}`}
        className="block w-full text-left"
      >
        <ImageReveal className="rounded-sm bg-soft">
          <div className="relative overflow-hidden" style={{ aspectRatio: panelRatio }}>
            <motion.div className="absolute inset-[-4%]" style={{ y }}>
              {fits ? (
                <SmartImage
                  src={project.thumbnail}
                  alt={`${project.title} — ${project.type}`}
                  sizes={sizes}
                  className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-expo)] group-hover:scale-[1.04]"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center p-[11%]">
                  <div
                    className={cn(
                      "relative max-h-full max-w-full overflow-hidden shadow-[0_30px_60px_-24px_rgb(23_25_28/0.45)] transition-transform duration-[1200ms] ease-[var(--ease-expo)] group-hover:-translate-y-2 group-hover:scale-[1.03]",
                      phone ? "h-full rounded-[1.6rem] ring-[5px] ring-ink" : "rounded-[2px]",
                      !phone && project.ratio > panelRatio ? "w-full" : "h-full",
                    )}
                    style={{ aspectRatio: project.ratio }}
                  >
                    <SmartImage src={project.thumbnail} alt={`${project.title} — ${project.type}`} sizes={sizes} className="object-cover" />
                  </div>
                </div>
              )}
            </motion.div>
            {/* technical corner label */}
            <span className="label absolute left-3 top-3 rounded-full bg-surface/85 px-2.5 py-1 text-ink backdrop-blur">
              {index !== undefined && <span className="mr-2 text-muted">{String(index + 1).padStart(2, "0")}</span>}
              {project.type}
            </span>
          </div>
        </ImageReveal>

        <div className="mt-4 grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1">
          <h3 className="font-display text-xl font-medium tracking-[-0.02em] md:text-2xl">
            <span className="u-link">{project.title}</span>
          </h3>
          <span className="label">{project.year}</span>
          <p className="label col-span-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full ring-1 ring-ink/25" style={{ background: cat.accent }} aria-hidden />
            {cat.title}
          </p>
          {showDescription && <p className="col-span-2 mt-2 max-w-md text-sm leading-relaxed text-muted">{project.description}</p>}
        </div>
      </button>
    </article>
  );
}
