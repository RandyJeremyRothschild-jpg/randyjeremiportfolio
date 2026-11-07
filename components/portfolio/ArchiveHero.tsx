"use client";
import { motion } from "motion/react";
import { projects } from "@/data/projects";
import { categories } from "@/data/categories";
import { pad } from "@/lib/utils";
import { RevealText } from "@/components/ui/Reveal";
import { Coords, Marquee, SectionLabel } from "@/components/ui/Misc";
import { SpinBadge, Splat, Star } from "@/components/ui/Doodles";

export default function ArchiveHero() {
  const years = projects.map((p) => p.year);
  const stats = [
    { k: "Projects", v: pad(projects.length) },
    ...categories.map((c) => ({ k: c.shortTitle, v: pad(projects.filter((p) => p.category === c.slug).length), color: c.accent })),
    { k: "Years", v: `${Math.min(...years)}—${String(Math.max(...years)).slice(2)}` },
  ];
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-32 md:px-8 md:pt-40">
      <div aria-hidden className="grid-lines absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <Splat seed={61} className="pointer-events-none absolute -right-16 top-24 w-72 opacity-70 md:w-[26rem]" />
      <Splat seed={62} className="pointer-events-none absolute left-[30%] top-[55%] w-24 opacity-60" color="var(--color-violet)" />
      <div className="relative mx-auto max-w-[1600px]">
        <div className="flex items-start justify-between">
          <SectionLabel index="§">Portfolio / Archive</SectionLabel>
          <Coords className="hidden md:flex" items={["Index 001—" + pad(projects.length, 3), "Sorted: newest", "Status: growing"]} />
        </div>
        <h1 className="mt-8 font-display uppercase leading-[0.84] tracking-tight">
          <RevealText text="Selected" immediate className="block text-[18vw] md:text-[12vw]" />
          <span className="flex flex-wrap items-baseline gap-x-[3vw]">
            <RevealText text="works" immediate delay={0.1} className="block text-[18vw] md:text-[12vw]" />
            <motion.span
              className="font-condensed text-[12vw] text-acid md:text-[7vw]"
              initial={{ opacity: 0, rotate: 20 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              aria-hidden
            >
              /
            </motion.span>
          </span>
          <RevealText
            text="*Creative* archive"
            immediate
            delay={0.2}
            className="block text-[13vw] md:pl-[14vw] md:text-[8vw]"
            highlightClassName="font-graffiti normal-case text-acid spray-glow"
          />
        </h1>
        <div className="mt-12 grid items-end gap-10 md:grid-cols-12">
          <p className="max-w-md font-grotesk text-lg leading-snug text-bone/80 md:col-span-5">
            Everything in one place — identities and posters, interfaces and systems, websites and experiments. Pick a discipline or browse the
            whole archive below.
          </p>
          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-bone/10 sm:grid-cols-5 md:col-span-6 md:col-start-7">
            {stats.map((s) => (
              <div key={s.k} className="bg-ink p-4">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted">{s.k}</dt>
                <dd className="mt-1 font-display text-3xl" style={{ color: "color" in s ? s.color : undefined }}>
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <SpinBadge text="Scroll to explore • archive • " className="absolute -bottom-6 right-4 hidden h-32 w-32 text-bone md:grid">
          <Star className="h-10 w-10 animate-spin-slow" />
        </SpinBadge>
      </div>
      <div className="relative mt-16 -rotate-1 bg-bone py-3 text-ink">
        <Marquee duration={35}>
          {categories.flatMap((c) => c.services).map((s, i) => (
            <span key={s + i} className="flex items-center gap-6 px-6 font-condensed text-3xl uppercase">
              {s} <Star className="h-5 w-5" color="var(--color-ink)" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
