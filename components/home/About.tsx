"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/config/site";
import { categories } from "@/data/categories";
import { getProjectsByCategory } from "@/data/projects";
import { cv } from "@/data/cv";
import { cn } from "@/lib/utils";
import { FadeIn, RevealText } from "@/components/ui/Reveal";
import { SectionLabel, SmartImage } from "@/components/ui/Misc";

/** The three disciplines as an editorial index with a cursor-following preview. */
function Disciplines() {
  const box = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.5 });

  return (
    <div
      ref={box}
      className="relative mt-16 md:mt-24"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !box.current) return;
        const r = box.current.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="border-t border-ink/15">
        {categories.map((c, i) => {
          const count = getProjectsByCategory(c.slug).length;
          return (
            <li key={c.slug} className="border-b border-ink/15">
              <Link
                href={c.href}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group grid gap-x-8 gap-y-3 py-7 transition-[padding] duration-500 ease-[var(--ease-expo)] md:grid-cols-12 md:items-baseline md:py-10 md:hover:px-4"
              >
                <span className="label md:col-span-1">
                  <span className="text-ink">{c.index}</span>
                </span>
                <h3 className="font-display text-[clamp(1.9rem,4.2vw,3.5rem)] font-medium uppercase leading-none tracking-[-0.03em] md:col-span-5">
                  {c.title}
                </h3>
                <p className="max-w-md text-[15px] leading-relaxed text-muted transition-colors duration-300 group-hover:text-ink md:col-span-4">
                  {c.description}
                </p>
                <span className="flex items-center justify-between gap-4 md:col-span-2 md:justify-end">
                  <span className="label">{String(count).padStart(2, "0")} projects</span>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 transition-all duration-500 ease-[var(--ease-expo)] group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </span>
                {/* services */}
                <ul className="label flex flex-wrap gap-x-4 gap-y-1 md:col-span-9 md:col-start-2">
                  {c.services.map((s) => (
                    <li key={s}>/ {s}</li>
                  ))}
                </ul>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* cursor-following image preview (pointer devices only) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 hidden h-[260px] w-[210px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm border border-line bg-surface shadow-[0_30px_60px_-20px_rgb(23_25_28/0.35)] lg:block"
        style={{ x: sx, y: sy }}
        animate={{ opacity: active === null ? 0 : 1, scale: active === null ? 0.85 : 1, rotate: active === null ? 0 : -4 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {categories.map((c, i) => {
          const p = getProjectsByCategory(c.slug)[0];
          if (!p) return null;
          return (
            <div key={c.slug} className={cn("absolute inset-0 transition-opacity duration-300", active === i ? "opacity-100" : "opacity-0")}>
              <SmartImage src={p.thumbnail} alt="" className="object-cover" sizes="210px" />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function About() {
  const current = cv.experience.filter((e) => e.current);
  const study = cv.education.find((e) => e.current);
  const facts: [string, string][] = [
    ["Based in", site.location],
    ...current.map((e): [string, string] => ["Currently", `${e.role}, ${e.company}`]),
    ...(study ? [["Studying", `${study.field ?? study.degree}, ${study.institution}`] as [string, string]] : []),
  ];

  return (
    <section id="about" data-nav="about" className="relative scroll-mt-24 py-24 md:py-40">
      <div className="wrap">
        <SectionLabel index="01">About</SectionLabel>

        <div className="mt-8 grid gap-10 lg:grid-cols-12">
          <RevealText
            as="h2"
            text={"Design is how *I *think.\nTechnology is how *I *build."}
            highlightClassName="text-muted"
            className="h-section lg:col-span-8"
          />
        </div>

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12">
          <FadeIn className="lg:col-span-5 lg:col-start-1">
            <dl className="border-t border-ink/15">
              {facts.map(([k, v], i) => (
                <div key={i} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-line py-3">
                  <dt className="label pt-0.5">{k}</dt>
                  <dd className="text-sm">{v}</dd>
                </div>
              ))}
            </dl>
            <Link href="/cv" className="label mt-5 inline-flex items-center gap-2 text-ink">
              <span className="u-link">Read the full CV</span> <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </FadeIn>
          <FadeIn className="space-y-5 lg:col-span-6 lg:col-start-7" delay={0.1}>
            <p className="text-[clamp(1.15rem,1.7vw,1.5rem)] leading-[1.45] tracking-[-0.01em]">{site.about.intro}</p>
            <p className="max-w-xl leading-relaxed text-muted">{site.about.secondary}</p>
          </FadeIn>
        </div>

        <Disciplines />
      </div>
    </section>
  );
}
