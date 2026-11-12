"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Download, ImageIcon, Plus, Printer, X } from "lucide-react";
import { site, socials } from "@/config/site";
import { cv, type CvAward } from "@/data/cv";
import { lockScroll, scrollToTarget } from "@/lib/scroll";
import { cn, pad } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/Reveal";

const SECTIONS = [
  { id: "experience", n: "01", label: "Professional Experience", count: cv.experience.length },
  { id: "education", n: "02", label: "Education", count: cv.education.length },
  { id: "awards", n: "03", label: "Honors & Awards", count: cv.awards.length },
  { id: "skills", n: "04", label: "Skills", count: cv.skills.length },
] as const;

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (src: string) => (src.startsWith("http") ? src : `${BASE_PATH}${src}`);

// ── Timeline entry (expandable) ─────────────────────────────────────────────
function Entry({
  id,
  open,
  onToggle,
  period,
  note,
  current,
  title,
  subtitle,
  tags,
  children,
}: {
  id: string;
  open: boolean;
  onToggle: () => void;
  period: string;
  note?: string;
  current?: boolean;
  title: string;
  subtitle: string;
  tags: string[];
  children?: React.ReactNode;
}) {
  return (
    <li className="print-avoid-break group relative pl-8 md:pl-10">
      {/* timeline node */}
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-[1.9rem] z-10 h-[11px] w-[11px] -translate-x-[5px] rounded-full border transition-colors duration-300",
          open || current ? "border-ink bg-lime" : "border-ink/40 bg-paper group-hover:border-ink group-hover:bg-ink",
          current && "animate-pulse-dot print:animate-none",
        )}
      />
      <div className="border-b border-line">
        <h3>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={`${id}-panel`}
            id={`${id}-header`}
            className="grid w-full grid-cols-[1fr_auto] items-start gap-x-6 gap-y-2 py-6 text-left md:grid-cols-[11rem_1fr_auto]"
          >
            <span className="label col-span-2 pt-1.5 md:col-span-1">
              <span className="text-ink">{period}</span>
              {note && <span className="block normal-case tracking-normal">{note}</span>}
            </span>
            <span className="min-w-0">
              <span className="block font-display text-xl font-medium leading-tight tracking-[-0.02em] md:text-2xl">{title}</span>
              <span className="mt-1 block text-[15px] text-ink/75">{subtitle}</span>
              <span className="mt-3 flex flex-wrap gap-1.5">
                {current && (
                  <span className="rounded-full bg-ink px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-lime print:border print:border-ink print:bg-transparent print:text-ink">
                    Present
                  </span>
                )}
                {tags.map((t) => (
                  <span key={t} className="rounded-full border border-ink/15 bg-surface px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                    {t}
                  </span>
                ))}
              </span>
            </span>
            <span
              aria-hidden
              className={cn(
                "grid h-9 w-9 place-items-center rounded-full border border-ink/15 transition-all duration-500 ease-[var(--ease-expo)] group-hover:border-ink print:hidden",
                open && "rotate-45 border-ink bg-ink text-paper",
              )}
            >
              <Plus className="h-4 w-4" />
            </span>
          </button>
        </h3>
        <div className="acc" data-open={open} id={`${id}-panel`} role="region" aria-labelledby={`${id}-header`}>
          <div>
            <div className="pb-7 md:pl-[12.5rem] md:pr-14">{children}</div>
          </div>
        </div>
      </div>
    </li>
  );
}

function Facts({ items }: { items: [string, string | undefined][] }) {
  const rows = items.filter((r): r is [string, string] => Boolean(r[1]));
  return (
    <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt className="label">{k}</dt>
          <dd className="mt-0.5 text-sm">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function SectionHead({ n, label, count, action }: { n: string; label: string; count: number; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-6 border-b border-ink pb-4">
      <h2 className="font-display text-[clamp(1.6rem,3vw,2.5rem)] font-medium uppercase leading-none tracking-[-0.03em]">
        <span className="mr-4 align-middle font-mono text-[11px] font-normal tracking-[0.08em] text-muted">{n}</span>
        {label}
      </h2>
      <div className="flex items-center gap-4">
        {action}
        <span className="label shrink-0">{pad(count)} entries</span>
      </div>
    </div>
  );
}

// ── Certificate preview ─────────────────────────────────────────────────────
function CertificateThumb({ award, onOpen }: { award: CvAward; onOpen: () => void }) {
  const c = award.certificate;
  if (!c) return null;
  return (
    <button
      type="button"
      onClick={onOpen}
      data-cursor="Preview"
      aria-label={`Preview certificate: ${award.title}`}
      className="group/cert relative block aspect-[1.414/1] w-full overflow-hidden rounded-sm border border-ink/15 bg-surface transition-colors hover:border-ink print:hidden"
    >
      {c.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asset(c.src)} alt={c.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-expo)] group-hover/cert:scale-105" />
      ) : (
        <span className="grid-paper absolute inset-0 grid place-items-center">
          <span className="flex flex-col items-center gap-2 text-muted">
            <ImageIcon className="h-5 w-5" />
            <span className="label">Certificate image — placeholder</span>
          </span>
        </span>
      )}
    </button>
  );
}

function CertificateLightbox({ award, onClose }: { award: CvAward | null; onClose: () => void }) {
  useEffect(() => {
    if (!award) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [award, onClose]);

  return (
    <AnimatePresence>
      {award?.certificate && (
        <motion.div
          className="fixed inset-0 z-[140] grid place-items-center p-4 print:hidden md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={award.certificate.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
          <motion.figure
            className="relative w-full max-w-4xl overflow-hidden rounded-lg bg-paper shadow-2xl"
            initial={{ y: 30, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 30, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
              <figcaption className="min-w-0">
                <p className="truncate font-display font-medium tracking-[-0.01em]">{award.title}</p>
                <p className="label">
                  {award.issuer} · {award.date}
                </p>
              </figcaption>
              <button type="button" autoFocus onClick={onClose} aria-label="Close preview" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-paper transition-transform duration-300 hover:rotate-90">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative aspect-[1.414/1] bg-surface">
              {award.certificate.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={asset(award.certificate.src)} alt={award.certificate.alt} className="h-full w-full object-contain" />
              ) : (
                <div className="grid-paper absolute inset-0 grid place-items-center p-8 text-center">
                  <div className="ticks max-w-sm p-8">
                    <ImageIcon className="mx-auto h-7 w-7 text-muted" />
                    <p className="mt-4 font-display text-lg font-medium">Certificate placeholder</p>
                    <p className="mt-2 text-sm text-muted">
                      The certificate image has not been added yet. Set its <code className="font-mono text-ink">certificate.src</code> in{" "}
                      <code className="font-mono text-ink">data/cv.ts</code>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function CvView() {
  const [openExp, setOpenExp] = useState<Set<string>>(() => new Set([cv.experience[0]?.id]));
  const [openEdu, setOpenEdu] = useState<Set<string>>(() => new Set([cv.education[0]?.id]));
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  const [cert, setCert] = useState<CvAward | null>(null);

  const toggle = (set: React.Dispatch<React.SetStateAction<Set<string>>>, id: string) =>
    set((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // scroll spy for the section index
  useEffect(() => {
    const onScroll = () => {
      const line = window.innerHeight * 0.4;
      let cur: string = SECTIONS[0].id;
      SECTIONS.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) cur = s.id;
      });
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const allExpOpen = openExp.size === cv.experience.length;
  const contacts = socials.filter((s) => s.primary);

  return (
    <div className="pb-24 pt-32 md:pb-36 md:pt-44 print:p-0">
      <div className="wrap print:max-w-none print:p-0">
        {/* ── Header ── */}
        <header className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="label flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-lime ring-1 ring-ink/30" aria-hidden />
              Curriculum Vitae
              <span className="h-px w-8 bg-current opacity-40" aria-hidden />
              {new Date().getFullYear()}
            </p>
            <h1 className="mt-6 font-display text-[clamp(2.2rem,5.6vw,5rem)] font-medium leading-[1] tracking-[-0.04em] print:text-[26pt]">
              {site.fullName}
            </h1>
            <p className="mt-5 font-mono text-[13px] uppercase tracking-[0.06em] text-ink print:text-[10pt]">{site.title}</p>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/80 print:mt-4 print:text-[10.5pt]">{cv.intro}</p>

            <div className="mt-8 flex flex-wrap gap-3 print:hidden">
              <Button onClick={() => window.print()} icon={<Printer className="h-4 w-4" />}>
                Print / Save as PDF
              </Button>
              {cv.pdfUrl && (
                <Button href={asset(cv.pdfUrl)} external variant="outline" icon={<Download className="h-4 w-4" />}>
                  Download PDF
                </Button>
              )}
            </div>
          </div>

          <aside className="lg:col-span-4" aria-label="Contact">
            <dl className="border-t border-ink/15 print:border-ink">
              <div className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-line py-2.5">
                <dt className="label pt-0.5">Location</dt>
                <dd className="text-sm">{site.location}</dd>
              </div>
              {contacts.map((s) => (
                <div key={s.key} className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-line py-2.5">
                  <dt className="label pt-0.5">{s.name}</dt>
                  <dd className="min-w-0 text-sm">
                    <a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="u-link break-all">
                      {s.label}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </header>

        {/* ── Body ── */}
        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 print:mt-8 print:block">
          {/* section index */}
          <nav aria-label="CV sections" className="lg:col-span-3 print:hidden">
            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:sticky lg:top-28 lg:mx-0 lg:block lg:space-y-1 lg:px-0">
              <p className="label mb-4 hidden lg:block">Index</p>
              {SECTIONS.map((s) => {
                const on = active === s.id;
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    aria-current={on ? "true" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToTarget(`#${s.id}`);
                    }}
                    className={cn(
                      "group flex shrink-0 items-center gap-3 rounded-full border px-4 py-2 text-sm transition-colors duration-300 lg:rounded-none lg:border-0 lg:border-l lg:py-2 lg:pl-4",
                      on ? "border-ink bg-ink text-paper lg:bg-transparent lg:text-ink" : "border-ink/15 text-muted hover:text-ink lg:border-line",
                    )}
                  >
                    <span className="font-mono text-[10px]">{s.n}</span>
                    <span className="whitespace-nowrap">{s.label}</span>
                    {on && <span className="hidden h-1.5 w-1.5 rounded-full bg-lime ring-1 ring-ink/30 lg:block" aria-hidden />}
                  </a>
                );
              })}
              <p className="label mt-8 hidden leading-relaxed lg:block">
                Tip — entries expand.
                <br />
                Printing opens them all.
              </p>
            </div>
          </nav>

          <div className="space-y-20 md:space-y-28 lg:col-span-9 print:space-y-8">
            {/* 01 Experience */}
            <section id="experience" className="scroll-mt-28">
              <SectionHead
                n="01"
                label="Professional Experience"
                count={cv.experience.length}
                action={
                  <button
                    type="button"
                    onClick={() => setOpenExp(allExpOpen ? new Set() : new Set(cv.experience.map((e) => e.id)))}
                    className="label hidden text-ink sm:block print:hidden"
                  >
                    <span className="u-link">{allExpOpen ? "Collapse all" : "Expand all"}</span>
                  </button>
                }
              />
              <ol className="relative ml-[5px] border-l border-ink/20">
                {cv.experience.map((e) => (
                  <Entry
                    key={e.id}
                    id={`exp-${e.id}`}
                    open={openExp.has(e.id)}
                    onToggle={() => toggle(setOpenExp, e.id)}
                    period={e.period}
                    note={e.duration}
                    current={e.current}
                    title={e.role}
                    subtitle={e.company}
                    tags={[e.type, e.arrangement].filter((t): t is string => Boolean(t))}
                  >
                    <Facts
                      items={[
                        ["Employment type", e.type],
                        ["Location", e.location],
                        ["Work arrangement", e.arrangement],
                        ["Period", e.duration ? `${e.period} (${e.duration})` : e.period],
                      ]}
                    />
                    {e.description && <p className="mt-5 max-w-2xl leading-relaxed text-ink/85">{e.description}</p>}
                    {e.responsibilities && (
                      <ul className="mt-4 max-w-2xl space-y-2.5">
                        {e.responsibilities.map((r) => (
                          <li key={r} className="flex gap-3 text-[15px] leading-relaxed text-ink/80">
                            <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-lime ring-1 ring-ink/30" aria-hidden />
                            {r}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Entry>
                ))}
              </ol>
            </section>

            {/* 02 Education */}
            <section id="education" className="scroll-mt-28">
              <SectionHead n="02" label="Education" count={cv.education.length} />
              <ol className="relative ml-[5px] border-l border-ink/20">
                {cv.education.map((e) => (
                  <Entry
                    key={e.id}
                    id={`edu-${e.id}`}
                    open={openEdu.has(e.id)}
                    onToggle={() => toggle(setOpenEdu, e.id)}
                    period={e.period}
                    current={e.current}
                    title={e.institution}
                    subtitle={[e.degree, e.field].filter(Boolean).join(" — ")}
                    tags={[]}
                  >
                    <Facts
                      items={[
                        [e.field ? "Degree" : "Program", e.degree],
                        ["Field of study", e.field],
                        ["Period", e.period],
                        ["Activities and societies", e.activities],
                      ]}
                    />
                  </Entry>
                ))}
              </ol>
            </section>

            {/* 03 Awards */}
            <section id="awards" className="scroll-mt-28">
              <SectionHead n="03" label="Honors & Awards" count={cv.awards.length} />
              <ol>
                {cv.awards.map((a, i) => (
                  <li key={a.id} className="print-avoid-break grid gap-6 border-b border-line py-8 md:grid-cols-12">
                    <div className="md:col-span-8">
                      <p className="label">
                        <span className="text-ink">{pad(i + 1)}</span> — {a.date}
                      </p>
                      <h3 className="mt-3 font-display text-xl font-medium leading-tight tracking-[-0.02em] md:text-2xl">{a.title}</h3>
                      <p className="mt-2 text-[15px] text-ink/75">Issued by {a.issuer}</p>
                      {a.associatedWith && <p className="label mt-3">Associated with {a.associatedWith}</p>}
                      {a.description && <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/80">{a.description}</p>}
                    </div>
                    <div className="md:col-span-4">
                      <CertificateThumb award={a} onOpen={() => setCert(a)} />
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* 04 Skills */}
            <section id="skills" className="scroll-mt-28">
              <SectionHead n="04" label="Skills" count={cv.skills.length} />
              <FadeIn>
                <ul className="mt-8 flex flex-wrap gap-2 print:mt-4">
                  {cv.skills.map((s, i) => (
                    <li
                      key={s}
                      className="group flex items-center gap-2.5 rounded-full border border-ink/15 bg-surface px-4 py-2.5 text-sm transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper print:px-3 print:py-1"
                    >
                      <span className="font-mono text-[10px] text-muted transition-colors group-hover:text-lime">{pad(i + 1)}</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </section>
          </div>
        </div>
      </div>
      <CertificateLightbox award={cert} onClose={() => setCert(null)} />
    </div>
  );
}
