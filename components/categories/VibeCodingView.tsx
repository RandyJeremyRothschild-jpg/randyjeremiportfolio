"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Code2, Eye, Play, Sparkles } from "lucide-react";
import { getProjectsByCategory } from "@/data/projects";
import { getCategory } from "@/data/categories";
import type { Project, VibeDetails } from "@/data/types";
import { useProjectModal } from "@/hooks/useProjectModal";
import { useReducedMotion } from "@/hooks/useMedia";
import { cn, pad } from "@/lib/utils";
import ProjectModal from "@/components/project/ProjectModal";
import NextCategory from "@/components/portfolio/NextCategory";
import LazyScene from "@/components/three/LazyScene";
import { MonitorScene } from "@/components/three";
import { Marquee, SectionLabel, SmartImage } from "@/components/ui/Misc";
import { GithubIcon } from "@/components/ui/SocialIcons";

const cat = getCategory("vibe-coding");
const items = getProjectsByCategory("vibe-coding");
const details = (p: Project) => p.details as VibeDetails;

/** Types out a string once, terminal style. */
function useTyped(text: string, speed = 45, start = true) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setN(text.length);
      return;
    }
    setN(0);
    const id = setInterval(() => setN((v) => (v >= text.length ? (clearInterval(id), v) : v + 1)), speed);
    return () => clearInterval(id);
  }, [text, speed, start, reduced]);
  return text.slice(0, n);
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const cmd = useTyped("npx create-experience --vibe=max");
  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden px-4 pt-32 md:px-8 md:pt-36">
      <motion.div aria-hidden className="grid-lines-acid absolute inset-0" animate={{ backgroundPosition: ["0px 0px", "48px 48px"] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink to-transparent" />
      <div className="relative z-10 mx-auto grid max-w-[1600px] gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionLabel index={cat.index}>Portfolio / Creative development</SectionLabel>
          <p className="mt-8 font-mono text-sm text-lemon md:text-base">
            <span className="text-muted">~/portfolio $</span> {cmd}
            <span className="animate-blink">█</span>
          </p>
          <h1 className="mt-4 font-mono font-bold uppercase leading-[0.9] tracking-tighter">
            <motion.span className="block text-[15vw] text-bone lg:text-[7.5vw]" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
              Vibe_
            </motion.span>
            <motion.span className="block text-[15vw] text-lemon lg:text-[7.5vw]" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35, duration: 0.8 }}>
              Coding<span className="text-acid">()</span>
            </motion.span>
          </h1>
          <p className="mt-6 max-w-md font-grotesk text-lg text-bone/80">
            Websites and digital experiments built with modern tooling and AI-assisted workflows — from idea to deployed URL.
          </p>
          <div className="mt-8 flex flex-wrap gap-2 font-mono text-xs">
            {["status: shipping", `projects: ${pad(items.length)}`, "stack: next / three / gsap"].map((t) => (
              <span key={t} className="rounded border border-lemon/30 bg-lemon/5 px-3 py-1.5 text-lemon">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="pointer-events-none relative h-[48vh] lg:col-span-6 lg:h-[70vh]">
          <LazyScene
            className="h-full w-full"
            rootMargin="0px"
            fallback={
              <div className="grid h-full place-items-center">
                <pre className="rounded-lg border border-lemon/30 bg-ink p-6 font-mono text-sm text-lemon">{`<Experience\n  vibe="max"\n  ship={true}\n/>`}</pre>
              </div>
            }
            render={(active) => <MonitorScene active={active} eventSource={ref} />}
          />
        </div>
      </div>
    </section>
  );
}

function BrowserCard({ p, i, onOpen }: { p: Project; i: number; onOpen: (p: Project) => void }) {
  const d = details(p);
  const [tab, setTab] = useState<"preview" | "stack">("preview");
  const [live, setLive] = useState(false);
  const url = p.links?.live;
  const wide = i % 3 === 0;
  return (
    <motion.article
      className={cn("group", wide ? "lg:col-span-12" : "lg:col-span-6")}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={cn("grid gap-6", wide && "lg:grid-cols-12 lg:items-center")}>
        <div className={cn("overflow-hidden rounded-xl border border-bone/15 bg-[#0b0918] shadow-[0_30px_80px_-30px_rgba(232,255,42,0.25)] transition-colors group-hover:border-lemon/50", wide && "lg:col-span-8")}>
          {/* browser chrome */}
          <div className="flex items-center gap-2 border-b border-bone/10 px-3 py-2.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 flex-1 truncate rounded-md bg-bone/5 px-3 py-1 font-mono text-[11px] text-muted">
              {url ? (url.startsWith("/") ? `localhost${url}` : url) : `${p.id}.vercel.app`}
            </span>
            <div className="flex rounded-md bg-bone/5 p-0.5 font-mono text-[10px] uppercase" role="tablist" aria-label={`${p.title} view`}>
              {(["preview", "stack"] as const).map((t) => (
                <button key={t} role="tab" aria-selected={tab === t} type="button" onClick={() => setTab(t)} className={cn("flex items-center gap-1 rounded px-2 py-1", tab === t ? "bg-lemon text-ink" : "text-muted hover:text-bone")}>
                  {t === "preview" ? <Eye className="h-3 w-3" /> : <Code2 className="h-3 w-3" />}
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="relative aspect-[16/10]">
            {tab === "preview" ? (
              live && url ? (
                <iframe src={url} title={`${p.title} — live preview`} className="absolute inset-0 h-full w-full bg-ink" sandbox="allow-scripts allow-same-origin" loading="lazy" data-lenis-prevent />
              ) : (
                <>
                  <SmartImage src={p.thumbnail} alt={`${p.title} preview`} className="object-cover object-top transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.04]" sizes="(max-width: 1024px) 100vw, 60vw" />
                  {url && (
                    <button
                      type="button"
                      onClick={() => setLive(true)}
                      data-cursor="Play"
                      className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-lemon px-4 py-2.5 font-mono text-xs font-bold uppercase text-ink shadow-lg transition-transform hover:scale-105"
                    >
                      <Play className="h-3.5 w-3.5" /> Run live preview
                    </button>
                  )}
                </>
              )
            ) : (
              <div className="absolute inset-0 overflow-auto p-6 font-mono text-sm" data-lenis-prevent>
                <p className="text-muted">{"// package.json — highlights"}</p>
                <p className="mt-2 text-violet">{"{"}</p>
                {d.technologies.map((t, k) => (
                  <p key={t} className="pl-4">
                    <span className="text-lemon">&quot;{t}&quot;</span>
                    <span className="text-bone/60">: </span>
                    <span className="text-acid">&quot;✓&quot;</span>
                    {k < d.technologies.length - 1 && <span className="text-bone/60">,</span>}
                  </p>
                ))}
                <p className="text-violet">{"}"}</p>
                <p className="mt-4 text-muted">{"// features"}</p>
                {d.features.map((f) => (
                  <p key={f}>
                    <span className="text-acid">+</span> <span className="text-bone/90">{f}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={cn(wide && "lg:col-span-4")}>
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted">
            <span className="text-lemon">{pad(i + 1)}</span> {p.type} · {p.year}
          </div>
          <h3 className="mt-3 font-display text-3xl uppercase leading-none md:text-5xl">{p.title}</h3>
          <p className="mt-3 text-bone/75">{p.description}</p>
          <p className="mt-3 flex gap-2 text-sm text-bone/60">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-lemon" /> {d.concept}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={() => onOpen(p)} className="inline-flex items-center gap-2 rounded-full bg-lemon px-5 py-2.5 font-grotesk text-sm font-bold uppercase text-ink">
              Project details <ArrowUpRight className="h-4 w-4" />
            </button>
            {p.links?.github && (
              <a href={p.links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-grotesk text-sm font-bold uppercase ring-1 ring-bone/25 hover:bg-bone/10">
                <GithubIcon className="h-4 w-4" /> GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function VibeCodingView() {
  const modal = useProjectModal(items);
  const allTech = Array.from(new Set(items.flatMap((p) => details(p).technologies)));
  return (
    <>
      <Hero />
      <div className="border-y border-lemon/20 bg-lemon/5 py-4">
        <Marquee duration={28}>
          {allTech.map((t) => (
            <span key={t} className="px-6 font-mono text-xl uppercase text-lemon md:text-2xl">
              <span className="text-muted">import</span> {t.replace(/\s+/g, "")}
            </span>
          ))}
        </Marquee>
      </div>
      <section aria-labelledby="vc-builds" className="px-4 py-24 md:px-8">
        <div className="mx-auto max-w-[1600px]">
          <SectionLabel index="A">Builds</SectionLabel>
          <h2 id="vc-builds" className="mt-3 font-mono text-5xl font-bold uppercase leading-none tracking-tighter md:text-7xl">
            ./shipped<span className="animate-blink text-lemon">_</span>
          </h2>
          <p className="mt-4 max-w-lg text-bone/70">Hit “Run live preview” to play with the experiments right here — they are real, running pages.</p>
          <div className="mt-12 grid gap-16 lg:grid-cols-12 lg:gap-x-10">
            {items.map((p, i) => (
              <BrowserCard key={p.id} p={p} i={i} onOpen={modal.open} />
            ))}
          </div>
        </div>
      </section>
      <NextCategory current="vibe-coding" />
      <ProjectModal project={modal.project} onClose={modal.close} onNavigate={modal.navigate} />
    </>
  );
}
