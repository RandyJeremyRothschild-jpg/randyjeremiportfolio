"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { categories, type CategoryInfo } from "@/data/categories";
import { getProjectsByCategory } from "@/data/projects";
import { cn, pad } from "@/lib/utils";
import { SectionLabel, SmartImage } from "@/components/ui/Misc";
import { Splat } from "@/components/ui/Doodles";

/** Each category panel has its own background treatment + preview style. */
function Treatment({ c, open }: { c: CategoryInfo; open: boolean }) {
  const items = getProjectsByCategory(c.slug).slice(0, 3);
  if (c.slug === "graphic-design")
    return (
      <>
        <Splat seed={71} className="absolute -right-10 -top-10 w-64 opacity-90" color="var(--color-ink)" />
        <div className="absolute inset-x-0 bottom-28 flex justify-center">
          {items.map((p, i) => (
            <motion.div
              key={p.id}
              className="relative -mx-6 aspect-[3/4] w-[38%] max-w-[180px] overflow-hidden border-4 border-ink shadow-xl"
              initial={false}
              animate={{ rotate: open ? (i - 1) * 12 : (i - 1) * 4, y: open ? (i === 1 ? -30 : 0) : 30, opacity: open ? 1 : 0.5 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <SmartImage src={p.thumbnail} alt="" className="object-cover" sizes="180px" />
            </motion.div>
          ))}
        </div>
      </>
    );
  if (c.slug === "uiux-design")
    return (
      <>
        <div aria-hidden className="grid-lines absolute inset-0 opacity-70" />
        <motion.div
          className="absolute bottom-24 left-1/2 aspect-[9/19] w-[40%] max-w-[170px] -translate-x-1/2 overflow-hidden rounded-[1.6rem] border-[5px] border-ink bg-ink shadow-2xl"
          initial={false}
          animate={{ y: open ? -20 : 40, rotate: open ? -6 : 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <SmartImage src={items[0]?.thumbnail ?? ""} alt="" className="object-cover" sizes="170px" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 right-[8%] h-20 w-32 rounded-xl border-2 border-dashed border-bone/50"
          initial={false}
          animate={{ opacity: open ? 1 : 0, x: open ? 0 : 30 }}
        />
      </>
    );
  return (
    <>
      <div aria-hidden className="grid-lines-acid absolute inset-0" />
      <motion.pre
        aria-hidden
        className="absolute left-6 right-6 top-24 whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-lemon/80"
        initial={false}
        animate={{ opacity: open ? 1 : 0.35 }}
      >
        {`> npx create-idea --vibe
✓ concept loaded
✓ ${items.length} projects compiled
$ deploy --prod
  ▲ live at /portfolio/vibe-coding`}
        <span className="animate-blink">█</span>
      </motion.pre>
      <motion.div
        className="absolute inset-x-6 bottom-28 aspect-[16/10] overflow-hidden rounded-lg border border-lemon/40 bg-ink"
        initial={false}
        animate={{ y: open ? 0 : 40, opacity: open ? 1 : 0.4 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex gap-1 border-b border-lemon/20 p-1.5">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </div>
        <div className="relative h-full">
          <SmartImage src={items[0]?.thumbnail ?? ""} alt="" className="object-cover object-top" sizes="400px" />
        </div>
      </motion.div>
    </>
  );
}

const bgFor: Record<string, string> = {
  "graphic-design": "bg-acid text-ink",
  "uiux-design": "bg-violet text-bone",
  "vibe-coding": "bg-ink text-lemon ring-1 ring-inset ring-lemon/30",
};

const titleFont: Record<string, string> = {
  "graphic-design": "font-drip",
  "uiux-design": "font-display",
  "vibe-coding": "font-mono font-bold tracking-tight",
};

export default function CategoryPanels() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <section aria-labelledby="disciplines-title" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <SectionLabel index="A">Disciplines</SectionLabel>
            <h2 id="disciplines-title" className="mt-3 font-display text-5xl uppercase leading-none md:text-7xl">
              Pick a room
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm text-bone/60 md:block">Three disciplines, three exhibitions. Each room has its own rules.</p>
        </div>
        <div className="mt-10 flex flex-col gap-3 lg:h-[78vh] lg:flex-row" onMouseLeave={() => setHover(null)}>
          {categories.map((c, i) => {
            const open = hover === i;
            const count = getProjectsByCategory(c.slug).length;
            return (
              <motion.div
                key={c.slug}
                className={cn("relative min-h-[460px] overflow-hidden rounded-[1.5rem] lg:min-h-0", bgFor[c.slug])}
                initial={false}
                animate={{ flexGrow: open ? 2.2 : 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ flexBasis: 0 }}
                onMouseEnter={() => setHover(i)}
              >
                <Link href={c.href} className="absolute inset-0 z-10" data-cursor="Enter" aria-label={`${c.title} — ${count} projects`} onFocus={() => setHover(i)} />
                <Treatment c={c} open={open || hover === null} />
                <div className="pointer-events-none relative flex h-full flex-col justify-between p-6 md:p-8">
                  <div className="flex items-start justify-between font-mono text-xs uppercase tracking-widest">
                    <span>
                      {c.index} / {pad(count)} projects
                    </span>
                    <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-current transition-transform duration-500" style={{ transform: open ? "rotate(45deg)" : undefined }}>
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="relative">
                    <h3 className={cn("text-[11vw] uppercase leading-[0.85] lg:text-[3.6vw]", titleFont[c.slug])}>{c.shortTitle}</h3>
                    <p className="mt-2 max-w-xs text-sm opacity-80">{c.tagline}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
