"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Briefcase, GraduationCap, MapPin } from "lucide-react";
import { site } from "@/config/site";
import { categories } from "@/data/categories";
import { getProjectsByCategory } from "@/data/projects";
import { cn } from "@/lib/utils";
import { RevealText, FadeIn } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/Misc";
import { DripSmiley, XMark, Crown, Squiggle } from "@/components/ui/Doodles";
import LazyScene from "@/components/three/LazyScene";
import { DisciplineScene } from "@/components/three";

const disciplineExtras = [
  {
    name: "Graphic Design",
    tag: "GFX",
    body: "Visual identities, branding, art direction, promotional materials, and digital graphics.",
    rows: [
      ["Focus", "Identity systems & expressive type"],
      ["Toolkit", "Illustrator · Photoshop · InDesign"],
      ["Output", "Logos, posters, packaging, campaigns"],
    ],
    Doodle: Crown,
  },
  {
    name: "UI/UX Design",
    tag: "UX",
    body: "User-centered interfaces, digital products, wireframes, prototypes, and interactive experiences.",
    rows: [
      ["Focus", "Clarity, flow & delightful detail"],
      ["Toolkit", "Figma · FigJam · Protopie"],
      ["Output", "Apps, dashboards, design systems"],
    ],
    Doodle: Squiggle,
  },
  {
    name: "Vibe Coding",
    tag: "DEV",
    body: "Transforming creative ideas into functional websites and digital experiences using modern development tools and AI-assisted workflows.",
    rows: [
      ["Focus", "Ideas shipped as working products"],
      ["Toolkit", "Next.js · Three.js · GSAP · AI agents"],
      ["Output", "Websites, experiments, web apps"],
    ],
    Doodle: XMark,
  },
];

/** CSS fallback visual when WebGL is not available. */
function DisciplineFallback({ index }: { index: number }) {
  const c = categories[index];
  return (
    <div className="absolute inset-0 grid place-items-center">
      <span className="font-drip text-[9rem] leading-none" style={{ color: c.accent }}>
        {c.index}
      </span>
    </div>
  );
}

export default function About() {
  const [active, setActive] = useState(0);
  const cat = categories[active];
  const extra = disciplineExtras[active];

  return (
    <section id="about" aria-labelledby="about-title" className="relative px-4 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="01">About</SectionLabel>

        {/* staggered headline like the reference's offset lines */}
        <h2 id="about-title" className="mt-8 font-display uppercase leading-[0.9] tracking-tight">
          <RevealText text="More than" className="block pl-[8vw] text-[13vw] md:pl-[22vw] md:text-[8.5vw]" />
          <span className="flex flex-wrap items-end gap-x-[2vw]">
            <RevealText text="just" className="block text-[13vw] md:text-[8.5vw]" delay={0.1} />
            <RevealText
              text="*design.*"
              className="block text-[16vw] md:text-[10vw]"
              highlightClassName="font-graffiti normal-case text-acid spray-glow"
              delay={0.2}
            />
          </span>
        </h2>

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
          <FadeIn className="relative flex items-start gap-6 md:col-span-5 md:col-start-2">
            <DripSmiley className="w-28 md:w-36" />
            <XMark className="mt-10 w-10 md:w-14" color="var(--color-violet)" />
          </FadeIn>
          <FadeIn delay={0.1} className="space-y-5 md:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-acid/40 bg-acid/10 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-acid">
              <MapPin className="h-3.5 w-3.5" />
              <span>Based in {site.location}</span>
            </div>
            <p className="font-grotesk text-xl leading-snug text-bone md:text-2xl">{site.about.intro}</p>
            <p className="text-bone/70">{site.about.secondary}</p>
            <Link href="/portfolio" className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-acid">
              Read the archive <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </FadeIn>
        </div>

        {/* Disciplines — interactive */}
        <div className="mt-24 md:mt-32">
          <SectionLabel>What I do</SectionLabel>
          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            {/* list */}
            <ul role="tablist" aria-label="Disciplines" className="lg:col-span-4">
              {categories.map((c, i) => {
                const on = i === active;
                return (
                  <li key={c.slug} className="border-b border-bone/10">
                    <button
                      type="button"
                      role="tab"
                      id={`disc-tab-${i}`}
                      aria-selected={on}
                      aria-controls="disc-panel"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className={cn(
                        "group relative flex w-full items-center gap-4 overflow-hidden px-3 py-4 text-left transition-colors md:py-5",
                        on ? "text-ink" : "text-bone hover:text-bone",
                      )}
                    >
                      <motion.span
                        className="absolute inset-0 origin-left"
                        style={{ background: c.accent }}
                        initial={false}
                        animate={{ scaleX: on ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      />
                      <span className="relative font-mono text-xs">{c.index}</span>
                      <span className={cn("relative font-display text-2xl uppercase md:text-3xl", on && "font-graffiti normal-case")}>
                        {disciplineExtras[i].name}
                      </span>
                      <span className="relative ml-auto font-mono text-[10px]">({getProjectsByCategory(c.slug).length})</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* 3D object frame */}
            <div className="relative lg:col-span-4">
              <div
                className="relative aspect-square overflow-hidden border-2 transition-colors duration-500"
                style={{ borderColor: cat.accent, background: `radial-gradient(circle at 50% 60%, ${cat.accent}22, transparent 65%)` }}
              >
                <div aria-hidden className="grid-lines absolute inset-0 opacity-60" />
                <LazyScene
                  className="absolute inset-0"
                  fallback={<DisciplineFallback index={active} />}
                  render={(on) => <DisciplineScene active={on} index={active} />}
                />
                <span className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-widest text-bone/70">
                  OBJ_{cat.index} / {extra.tag}
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={active}
                    className="absolute -bottom-2 -left-2 font-drip text-6xl"
                    style={{ color: cat.accent }}
                    initial={{ opacity: 0, rotate: -20, scale: 0.6 }}
                    animate={{ opacity: 1, rotate: -8, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                  >
                    {extra.tag}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* details */}
            <div id="disc-panel" role="tabpanel" aria-labelledby={`disc-tab-${active}`} className="lg:col-span-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-drip text-5xl uppercase leading-[0.9] md:text-6xl" style={{ color: cat.accent }}>
                      {extra.name}
                    </h3>
                    <extra.Doodle className="w-16 shrink-0 md:w-20" color={cat.accent} />
                  </div>
                  <p className="mt-4 text-bone/80">{extra.body}</p>
                  <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                    {cat.services.map((s) => (
                      <li key={s} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rotate-45" style={{ background: cat.accent }} />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <table className="mt-6 w-full text-left font-mono text-xs">
                    <caption className="tech-label mb-2 text-left">Spec sheet</caption>
                    <tbody>
                      {extra.rows.map(([k, v]) => (
                        <tr key={k} className="border-t border-bone/10">
                          <th scope="row" className="py-2.5 pr-4 font-normal uppercase text-muted">
                            {k}
                          </th>
                          <td className="py-2.5 text-bone">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Link
                    href={cat.href}
                    className="group mt-6 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-grotesk text-sm font-bold uppercase tracking-wider transition-colors hover:text-ink"
                    style={{ borderColor: cat.accent, color: cat.accent }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = cat.accent;
                      e.currentTarget.style.color = cat.onAccent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = cat.accent;
                    }}
                  >
                    See {cat.shortTitle} work <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Experience & Education */}
        <div className="mt-24 grid gap-12 lg:mt-32 lg:grid-cols-2">
          {/* Experience */}
          <FadeIn className="rounded-3xl border border-bone/15 bg-ink/40 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-bone/15 pb-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-acid text-ink">
                  <Briefcase className="h-5 w-5" />
                </span>
                <div>
                  <p className="tech-label">Career</p>
                  <h3 className="font-display text-3xl uppercase text-bone md:text-4xl">Experience</h3>
                </div>
              </div>
              <a
                href={site.linkedinDetails.experienceUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-full border border-bone/20 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-bone transition-colors hover:border-acid hover:bg-acid hover:text-ink"
              >
                LinkedIn Experience
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
            <div className="mt-6 space-y-6">
              {site.experience.map((exp, idx) => (
                <div key={idx} className="relative border-l-2 border-acid pl-5">
                  <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-acid" />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-grotesk text-xl font-bold text-bone">{exp.role}</h4>
                    <span className="font-mono text-xs uppercase text-acid">{exp.period}</span>
                  </div>
                  <p className="mt-1 font-mono text-xs uppercase tracking-wider text-bone/80">
                    {exp.company} · <span className="text-muted">{exp.type}</span>
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] uppercase text-muted">{exp.location}</p>
                  <p className="mt-3 text-sm leading-relaxed text-bone/75">{exp.description}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Education */}
          <FadeIn delay={0.1} className="rounded-3xl border border-bone/15 bg-ink/40 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-bone/15 pb-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-violet text-bone">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div>
                  <p className="tech-label">Academic</p>
                  <h3 className="font-display text-3xl uppercase text-bone md:text-4xl">Education</h3>
                </div>
              </div>
              <a
                href={site.linkedinDetails.educationUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-full border border-bone/20 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-bone transition-colors hover:border-acid hover:bg-acid hover:text-ink"
              >
                LinkedIn Education
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
            <div className="mt-6 space-y-6">
              {site.education.map((edu, idx) => (
                <div key={idx} className="relative border-l-2 border-violet pl-5">
                  <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-violet" />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-grotesk text-xl font-bold text-bone">{edu.institution}</h4>
                    <span className="font-mono text-xs uppercase text-acid">{edu.period}</span>
                  </div>
                  <p className="mt-1 font-mono text-xs uppercase tracking-wider text-bone/80">{edu.degree}</p>
                  <p className="mt-3 text-sm leading-relaxed text-bone/75">{edu.description}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
