"use client";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { navItems, site, socials } from "@/config/site";
import { scrollToTarget } from "@/lib/scroll";
import Clock from "@/components/ui/Clock";
import Magnetic from "@/components/ui/Magnetic";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line bg-paper print:hidden">
      <div className="wrap pb-8 pt-16 md:pt-24">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Wordmark */}
          <div className="md:col-span-6">
            <p className="label">Portfolio / {year}</p>
            <Link href="/" className="mt-4 inline-block font-display text-[13vw] font-medium leading-[0.9] tracking-[-0.05em] md:text-[6.5vw]">
              {site.name}
              <span className="align-top text-[0.35em] text-muted">®</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{site.tagline}</p>
          </div>

          <nav aria-label="Footer" className="md:col-span-2 md:col-start-8">
            <p className="label">Index</p>
            <ul className="mt-4 space-y-2">
              {navItems.map((n, i) => (
                <li key={n.key}>
                  <Link href={n.href} className="group flex items-baseline gap-3 text-sm">
                    <span className="font-mono text-[10px] text-muted">0{i + 1}</span>
                    <span className="u-link">{n.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="label">Elsewhere</p>
            <ul className="mt-4 space-y-2">
              {socials.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="group flex items-baseline justify-between gap-3 text-sm"
                  >
                    <span className="u-link">{s.name}</span>
                    <span className="font-mono text-[10px] text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden>
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Technical strip */}
        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <div className="label flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>
              © {year} {site.name}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-lime ring-1 ring-ink/30" aria-hidden />
              {site.location}
            </span>
            <span>
              <Clock seconds className="tabular-nums text-ink" /> {site.timezoneLabel}
            </span>
            <span className="hidden lg:inline">Next.js · Three.js · GSAP · Motion</span>
            <span className="hidden lg:inline" title="Thanks for scrolling all the way down">
              Made with clarity + curiosity ( ◕‿◕ )
            </span>
          </div>
          <Magnetic strength={0.25}>
            <button
              type="button"
              onClick={() => scrollToTarget(0)}
              className="group flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.08em]"
            >
              Back to top
              <span className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 bg-surface transition-colors duration-300 group-hover:bg-ink group-hover:text-paper">
                <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
              </span>
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
