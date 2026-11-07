"use client";
import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { getProjectsByCategory } from "@/data/projects";
import { getCategory } from "@/data/categories";
import type { Project, UiuxDetails } from "@/data/types";
import { useProjectModal } from "@/hooks/useProjectModal";
import { cn, pad } from "@/lib/utils";
import ProjectModal from "@/components/project/ProjectModal";
import NextCategory from "@/components/portfolio/NextCategory";
import LazyScene from "@/components/three/LazyScene";
import { DeviceScene } from "@/components/three";
import { RevealText } from "@/components/ui/Reveal";
import { SectionLabel, SmartImage } from "@/components/ui/Misc";
import { Squiggle } from "@/components/ui/Doodles";

const cat = getCategory("uiux-design");
const items = getProjectsByCategory("uiux-design");
const details = (p: Project) => p.details as UiuxDetails;

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const phones = items.filter((p) => details(p).device === "phone").flatMap((p) => details(p).screens);
  const desk = items.find((p) => details(p).device === "desktop");
  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden px-4 pt-32 md:px-8 md:pt-36">
      <div aria-hidden className="grid-lines absolute inset-0" />
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/25 blur-[120px]" />
      <div className="relative z-10 mx-auto max-w-[1600px]">
        <SectionLabel index={cat.index}>Portfolio / UI-UX design</SectionLabel>
        <h1 className="mt-6 font-display uppercase leading-[0.86] tracking-tight">
          <RevealText text="Interfaces" immediate className="block text-[15vw] md:text-[9vw]" />
          <span className="flex flex-wrap items-baseline gap-x-4">
            <RevealText text="&" immediate delay={0.1} className="block font-graffiti text-[15vw] text-violet md:text-[9vw]" />
            <RevealText text="experiences" immediate delay={0.15} className="block text-outline-bone text-[14vw] md:text-[9vw]" />
          </span>
        </h1>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[38%] md:top-[30%]">
        <LazyScene
          className="h-full w-full"
          rootMargin="0px"
          fallback={
            <div className="flex h-full items-center justify-center gap-6">
              {phones.slice(0, 2).map((s) => (
                <div key={s} className="relative aspect-[9/19] h-[70%] overflow-hidden rounded-[2rem] border-[6px] border-[#1a1726]">
                  <SmartImage src={s} alt="" className="object-cover" sizes="200px" />
                </div>
              ))}
            </div>
          }
          render={(active) => (
            <DeviceScene active={active} phoneScreens={phones.slice(0, 2)} desktopScreen={desk?.thumbnail ?? phones[0]} eventSource={ref} />
          )}
        />
      </div>
      <p className="absolute bottom-6 left-4 z-10 max-w-xs rounded-2xl bg-ink/75 p-4 font-grotesk text-bone/85 ring-1 ring-bone/10 backdrop-blur md:bottom-8 md:left-8 md:max-w-sm md:text-lg">
        Products people understand on the first tap — researched, structured, prototyped and polished.
      </p>
    </section>
  );
}

const steps = ["Discover", "Define", "Flow", "Wireframe", "UI", "Prototype", "Test"];

function Process() {
  return (
    <section className="border-y border-bone/10 px-4 py-14 md:px-8">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="A">Process</SectionLabel>
        <ol className="no-scrollbar mt-6 flex gap-3 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <motion.li
              key={s}
              className="group flex shrink-0 items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <span className="rounded-2xl border border-bone/15 px-5 py-4 transition-colors group-hover:border-violet group-hover:bg-violet">
                <span className="block font-mono text-[10px] text-muted group-hover:text-bone">{pad(i + 1)}</span>
                <span className="font-display text-2xl uppercase">{s}</span>
              </span>
              {i < steps.length - 1 && <span className="font-mono text-violet">→</span>}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** CSS-3D device that tilts with the pointer and fans out its screens on scroll. */
function DeviceShowcase({ p, flip }: { p: Project; flip: boolean }) {
  const d = details(p);
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 14 });
  const sry = useSpring(ry, { stiffness: 120, damping: 14 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const spread = useTransform(scrollYProgress, [0.15, 0.5], [0, 1]);
  const phone = d.device === "phone";
  const screens = d.screens.slice(0, 3);

  return (
    <div
      ref={ref}
      className="relative flex min-h-[420px] items-center justify-center [perspective:1400px] md:min-h-[560px]"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 22);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 16);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <motion.div style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }} className="relative">
        {phone ? (
          <div className="relative h-[400px] w-[190px] md:h-[500px] md:w-[236px]" style={{ transformStyle: "preserve-3d" }}>
            {screens.map((s, i) => (
              <ScreenLayer key={s} i={i} n={screens.length} spread={spread} flip={flip}>
                <div className="relative h-full w-full overflow-hidden rounded-[2.2rem] border-[7px] border-[#1a1726] bg-ink shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
                  <SmartImage src={s} alt={`${p.title} screen ${i + 1}`} className="object-cover" sizes="240px" />
                  <span className="absolute left-1/2 top-2 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
                </div>
              </ScreenLayer>
            ))}
          </div>
        ) : (
          <div className="relative aspect-[16/10] w-[78vw] max-w-[620px]" style={{ transformStyle: "preserve-3d" }}>
            {screens.map((s, i) => (
              <ScreenLayer key={s} i={i} n={screens.length} spread={spread} flip={flip} desktop>
                <div className="h-full w-full overflow-hidden rounded-xl border border-bone/15 bg-[#0b0918] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
                  <div className="flex items-center gap-1.5 border-b border-bone/10 px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="relative h-[calc(100%-30px)]">
                    <SmartImage src={s} alt={`${p.title} screen ${i + 1}`} className="object-cover object-top" sizes="620px" />
                  </div>
                </div>
              </ScreenLayer>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function ScreenLayer({
  i,
  n,
  spread,
  flip,
  desktop,
  children,
}: {
  i: number;
  n: number;
  spread: MotionValue<number>;
  flip: boolean;
  desktop?: boolean;
  children: React.ReactNode;
}) {
  // front layer = last index; back layers fan out sideways + back in Z
  const depth = n - 1 - i;
  const dir = flip ? -1 : 1;
  const x = useTransform(spread, (v) => `${v * depth * (desktop ? 14 : 48) * dir}${desktop ? "%" : "px"}`);
  const y = useTransform(spread, (v) => v * depth * (desktop ? -24 : -10));
  const z = useTransform(spread, (v) => -v * depth * 80);
  const rotate = useTransform(spread, (v) => v * depth * 4 * dir);
  return (
    <motion.div className="absolute inset-0" style={{ x, y, z, rotate, zIndex: i, opacity: depth > 0 ? 0.92 : 1 }}>
      {children}
    </motion.div>
  );
}

function Case({ p, i, onOpen }: { p: Project; i: number; onOpen: (p: Project) => void }) {
  const d = details(p);
  const flip = i % 2 === 1;
  return (
    <article className="grid items-center gap-10 border-t border-bone/10 py-16 md:py-24 lg:grid-cols-12">
      <div className={cn("lg:col-span-5", flip && "lg:order-2 lg:col-start-8")}>
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted">
          <span className="text-violet">{pad(i + 1)}</span>
          <span>{p.type}</span>
          <span>·</span>
          <span>{p.year}</span>
        </div>
        <h3 className="mt-4 font-display text-4xl uppercase leading-[0.92] md:text-6xl">{p.title}</h3>
        <p className="mt-5 text-lg text-bone/80">{p.description}</p>
        <div className="mt-6 rounded-2xl border border-bone/10 bg-bone/[0.03] p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-violet">Problem</p>
          <p className="mt-2 text-bone/85">{d.problem}</p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {d.userFlow.map((s, k) => (
            <span key={s} className="flex items-center gap-2 font-mono text-[11px] uppercase text-bone/70">
              {s}
              {k < d.userFlow.length - 1 && <span className="text-violet">→</span>}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onOpen(p)}
          className="group mt-8 inline-flex items-center gap-3 rounded-full bg-violet px-6 py-3.5 font-grotesk text-sm font-bold uppercase tracking-wider text-bone"
        >
          Read case study <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
        </button>
      </div>
      <div className={cn("lg:col-span-7", flip && "lg:order-1 lg:col-start-1 lg:row-start-1")}>
        <DeviceShowcase p={p} flip={flip} />
      </div>
    </article>
  );
}

export default function UiuxView() {
  const modal = useProjectModal(items);
  return (
    <>
      <Hero />
      <Process />
      <section aria-labelledby="ux-cases" className="px-4 py-20 md:px-8">
        <div className="mx-auto max-w-[1600px]">
          <SectionLabel index="B">Case studies</SectionLabel>
          <h2 id="ux-cases" className="mt-3 flex flex-wrap items-end gap-4 font-display text-5xl uppercase leading-none md:text-7xl">
            Products <Squiggle className="w-40 text-violet md:w-56" />
          </h2>
          <div className="mt-10">
            {items.map((p, i) => (
              <Case key={p.id} p={p} i={i} onOpen={modal.open} />
            ))}
          </div>
        </div>
      </section>
      <NextCategory current="uiux-design" />
      <ProjectModal project={modal.project} onClose={modal.close} onNavigate={modal.navigate} />
    </>
  );
}
