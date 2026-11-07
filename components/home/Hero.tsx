"use client";
import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowDownRight } from "lucide-react";
import { site } from "@/config/site";
import { useIntroDone } from "@/lib/intro";
import { scrollToTarget } from "@/lib/scroll";
import { useReducedMotion } from "@/hooks/useMedia";
import LazyScene from "@/components/three/LazyScene";
import { HeroScene } from "@/components/three";
import TornStrip from "@/components/ui/TornStrip";
import Magnetic from "@/components/ui/Magnetic";
import { Marquee } from "@/components/ui/Misc";
import { Arrow, Splat, Star } from "@/components/ui/Doodles";

const ease = [0.16, 1, 0.3, 1] as const;

function Line({ children, delay, show, className }: { children: React.ReactNode; delay: number; show: boolean; className?: string }) {
  return (
    <span className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        animate={show ? { y: "0%" } : undefined}
        transition={{ duration: 1.1, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Static fallback when WebGL is unavailable: a CSS spray can silhouette. */
function CanFallback() {
  return (
    <div className="absolute left-1/2 top-1/2 h-[46vh] w-[18vh] -translate-x-1/2 -translate-y-1/2 -rotate-12">
      <div className="mx-auto h-[6%] w-[22%] rounded-t-md bg-bone" />
      <div className="mx-auto h-[8%] w-[50%] rounded-t-full bg-chrome" />
      <div className="relative h-[80%] overflow-hidden rounded-b-xl bg-ink ring-2 ring-chrome">
        <div className="absolute inset-x-0 top-[30%] grid h-[38%] place-items-center bg-acid font-display text-[4vh] text-ink">IDEAS</div>
      </div>
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const show = useIntroDone();

  // pointer parallax for layered type
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const l1 = useTransform(sx, (v) => v * -18);
  const l2 = useTransform(sx, (v) => v * 32);
  const l3 = useTransform(sx, (v) => v * 14);
  const splatX = useTransform(sx, (v) => v * -40);
  const splatY = useTransform(sy, (v) => v * -30);

  // scroll-out parallax
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const outLeft = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const outRight = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const stripRot = useTransform(scrollYProgress, [0, 1], [-3, 4]);

  return (
    <section
      id="home"
      ref={ref}
      aria-label="Introduction"
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse") return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-4 pb-6 pt-24 md:px-8 md:pt-28"
    >
      {/* background layers */}
      <div aria-hidden className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <motion.div aria-hidden style={{ x: splatX, y: splatY }} className="pointer-events-none absolute inset-0">
        <Splat seed={3} className="absolute -left-10 top-16 w-56 opacity-80 md:w-80" />
        <Splat seed={8} className="absolute -right-12 top-1/3 w-48 opacity-70 md:w-72" color="var(--color-acid)" />
        <Splat seed={21} className="absolute bottom-10 left-1/3 w-24 opacity-60" color="var(--color-violet)" />
        <Star className="absolute right-[12%] top-[18%] w-10 animate-spin-slow md:w-14" color="var(--color-lemon)" />
      </motion.div>

      {/* meta row */}
      <motion.div
        className="relative z-30 flex items-start justify-between tech-label"
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : undefined}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <span>
          N° 001 — Portfolio ©{new Date().getFullYear()}
          <br />
          Based in {site.location}
          <br />
          <span className="text-acid">●</span> {site.availability}
        </span>
        <span className="hidden text-right md:block">
          Lat. ideas / Long. execution
          <br />
          {site.disciplines.join(" · ")}
        </span>
      </motion.div>

      {/* 3D spray can */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-70 md:z-20 md:opacity-100">
        <LazyScene
          className="h-full w-full"
          rootMargin="0px"
          fallback={<CanFallback />}
          render={(active) => <HeroScene active={active} reduced={reduced} eventSource={ref} />}
        />
      </div>

      <motion.h1 style={{ opacity: fade }} className="relative z-10 mt-6 flex flex-1 flex-col justify-center uppercase md:mt-2">
        <motion.span style={{ x: outLeft }} className="block">
          <motion.span style={{ x: l1 }} className="block">
            <Line show={show} delay={0.1} className="font-display text-[13.5vw] leading-[0.86] tracking-[-0.02em] text-bone md:text-[min(11vw,16vh)]">
              Designing
            </Line>
          </motion.span>
        </motion.span>
        <motion.span style={{ x: l2 }} className="relative -mt-[2vw] block self-end pr-[4vw] md:-mt-[3vw] md:pr-[8vw]">
          <Line show={show} delay={0.25} className="pb-[0.15em] font-graffiti text-[20vw] normal-case leading-[0.9] text-acid spray-glow md:text-[min(10vw,14vh)]">
            <span className="inline-block -rotate-6">Ideas.</span>
          </Line>
        </motion.span>

        {/* torn acid strip with marquee */}
        <motion.span aria-hidden style={{ rotate: reduced ? -3 : stripRot }} className="relative -mx-8 my-[1vw] block md:-mx-12">
          <TornStrip seed={11} className="h-[15vw] md:h-[min(9vw,12vh)]">
            <Marquee duration={24} className="h-full items-center">
              {["Graphic Design", "UI/UX Design", "Creative Development", "Vibe Coding", "Art Direction"].map((t) => (
                <span key={t} className="flex items-center gap-[3vw] px-[1.5vw] font-condensed text-[10vw] leading-none text-ink md:text-[min(6.4vw,8.5vh)]">
                  {t}
                  <Star className="h-[4vw] w-[4vw] md:h-[3vw] md:w-[3vw]" color="var(--color-ink)" />
                </span>
              ))}
            </Marquee>
          </TornStrip>
        </motion.span>

        <motion.span style={{ x: outRight }} className="block self-end text-right">
          <motion.span style={{ x: l3 }} className="block">
            <Line show={show} delay={0.35} className="font-display text-[13.5vw] leading-[0.86] tracking-[-0.02em] text-bone md:text-[min(11vw,16vh)]">
              Building
            </Line>
          </motion.span>
        </motion.span>
        <motion.span style={{ x: l1 }} className="block md:pl-[6vw]">
          <Line show={show} delay={0.45} className="font-condensed text-[21vw] leading-[0.82] text-outline-bone md:text-[min(13vw,19vh)]">
            Experiences.
          </Line>
        </motion.span>
      </motion.h1>

      {/* bottom row */}
      <motion.div
        className="relative z-30 mt-6 grid items-end gap-6 md:grid-cols-12"
        initial={{ opacity: 0, y: 20 }}
        animate={show ? { opacity: 1, y: 0 } : undefined}
        transition={{ delay: 0.8, duration: 0.9, ease }}
      >
        <p className="max-w-sm font-grotesk text-base leading-snug text-bone/85 md:col-span-4 md:text-lg">
          <span className="text-acid">✦</span> {site.tagline}
        </p>
        <div className="relative flex items-center gap-4 md:col-span-5 md:justify-center">
          <Arrow className="absolute -left-4 -top-16 hidden w-28 text-acid md:block" variant={1} />
          <Magnetic>
            <a
              href="#works"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("#works");
              }}
              data-cursor="Go"
              className="group relative inline-flex -rotate-2 items-center gap-3 overflow-hidden rounded-full bg-acid px-7 py-4 font-condensed text-2xl leading-none tracking-wide text-ink md:text-3xl"
            >
              <span className="relative z-[1]">Explore my work</span>
              <ArrowDownRight className="relative z-[1] h-6 w-6 transition-transform duration-500 group-hover:rotate-[-45deg]" />
              <span className="absolute inset-0 translate-y-full bg-bone transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0" />
            </a>
          </Magnetic>
        </div>
        <div className="hidden items-center justify-end gap-3 md:col-span-3 md:flex">
          <span className="tech-label">Scroll</span>
          <span className="relative block h-14 w-[2px] overflow-hidden bg-bone/15">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-acid"
              animate={reduced ? undefined : { y: ["-100%", "200%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </div>
      </motion.div>
    </section>
  );
}
