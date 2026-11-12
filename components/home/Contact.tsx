"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { site, socials } from "@/config/site";
import { FadeIn, RevealText } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/Misc";
import Buddy from "./Buddy";

export default function Contact() {
  const area = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const email = site.contact.email;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  };

  return (
    <section id="contact" data-nav="contact" className="relative scroll-mt-24 py-24 md:py-40">
      <div ref={area} className="wrap relative">
        <SectionLabel index="04">Contact</SectionLabel>

        <div className="mt-8 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <RevealText as="h2" text={"Have something\n*in *mind?"} highlightClassName="text-muted" className="h-display text-[clamp(2.4rem,7.4vw,7rem)]" />
            <FadeIn>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-ink/80">{site.contactSection.text}</p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${email}`}
                  className="group inline-flex items-baseline gap-3 font-display text-[clamp(1.15rem,2.6vw,2rem)] font-medium tracking-[-0.02em]"
                >
                  <span className="u-link break-all">{email}</span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 self-center transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </a>
                <button
                  type="button"
                  onClick={copy}
                  aria-label="Copy email address"
                  className="label inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface px-3 py-2 text-ink transition-colors hover:border-ink/40"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </FadeIn>

            <div className="mt-12 md:mt-16">
              <Buddy constraints={area} />
            </div>
          </div>

          {/* Channels */}
          <FadeIn className="lg:col-span-4 lg:col-start-9" delay={0.1}>
            <p className="label">Channels</p>
            <ul className="mt-4 border-t border-ink/15">
              {socials.map((s, i) => (
                <li key={s.key} className="border-b border-line">
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="group flex items-center gap-4 py-4 transition-[padding] duration-500 ease-[var(--ease-expo)] hover:px-3"
                  >
                    <span className="label w-6">0{i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-medium tracking-[-0.01em]">{s.name}</span>
                      <span className="label block truncate normal-case tracking-normal">{s.label}</span>
                    </span>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/15 transition-all duration-500 ease-[var(--ease-expo)] group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="label mt-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-lime ring-1 ring-ink/30" aria-hidden />
              {site.availableForWork ? site.availability : site.location}
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
