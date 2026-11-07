"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { navItems, site } from "@/config/site";
import { scrollToTarget } from "@/lib/scroll";
import { TornEdge } from "@/components/ui/TornStrip";
import Magnetic from "@/components/ui/Magnetic";
import { InstagramIcon, LinkedinIcon, WhatsappIcon, PinterestIcon, BehanceIcon } from "@/components/ui/SocialIcons";

function LocalTime() {
  const [time, setTime] = useState<string>("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: site.timezone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {time} <span className="opacity-60">({site.timezoneLabel})</span>
    </span>
  );
}

export default function Footer() {
  const socials = [
    { label: "Instagram", href: site.contact.instagram.href, Icon: InstagramIcon },
    { label: "LinkedIn", href: site.contact.linkedin.href, Icon: LinkedinIcon },
    { label: "WhatsApp", href: site.contact.whatsapp.href, Icon: WhatsappIcon },
    { label: "Pinterest", href: site.contact.pinterest.href, Icon: PinterestIcon },
    { label: "Behance", href: site.contact.behance.href, Icon: BehanceIcon },
  ];
  return (
    <footer className="relative mt-0 overflow-hidden">
      <TornEdge seed={17} />
      <div className="bg-acid px-4 pb-6 pt-10 text-ink md:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="tech-label !text-ink/60">| Navigation |</p>
              <ul className="mt-4 space-y-1">
                {navItems.map((n) => (
                  <li key={n.label}>
                    <Link href={n.href} className="group inline-flex items-center gap-2 font-display text-3xl uppercase md:text-4xl">
                      <span className="inline-block h-[3px] w-0 bg-ink transition-all duration-300 group-hover:w-8" />
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-4">
              <p className="tech-label !text-ink/60">| Elsewhere |</p>
              <ul className="mt-4 grid grid-cols-2 gap-2">
                {socials.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-full border-2 border-ink px-4 py-2 font-grotesk text-sm font-bold uppercase transition-colors hover:bg-ink hover:text-acid"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
              <a href={`mailto:${site.contact.email}`} className="mt-6 block font-grotesk text-lg font-bold underline decoration-2 underline-offset-4">
                {site.contact.email}
              </a>
            </div>
            <div className="flex flex-col items-start gap-6 md:col-span-3 md:items-end">
              <div className="text-left md:text-right">
                <p className="tech-label !text-ink/60">| Local time |</p>
                <p className="mt-2 font-mono text-lg">
                  <LocalTime />
                </p>
                <p className="mt-1 font-mono text-xs uppercase">{site.location}</p>
                <p className="mt-1 font-mono text-xs uppercase opacity-70">{site.availability}</p>
              </div>
              <Magnetic>
                <button
                  type="button"
                  onClick={() => scrollToTarget(0)}
                  data-cursor="Top"
                  className="group grid h-24 w-24 place-items-center rounded-full bg-ink text-acid transition-transform hover:rotate-12"
                  aria-label="Back to top"
                >
                  <ArrowUp className="h-8 w-8 transition-transform duration-300 group-hover:-translate-y-1" />
                </button>
              </Magnetic>
            </div>
          </div>

          <p
            aria-hidden
            className="mt-12 select-none overflow-hidden whitespace-nowrap text-center font-display text-[10.5vw] leading-[0.8] tracking-tighter md:text-[10vw]"
          >
            {site.wordmark}
          </p>
          <div className="mt-6 flex flex-col justify-between gap-2 border-t-2 border-ink pt-4 font-mono text-[11px] uppercase tracking-wider md:flex-row">
            <span>
              © {new Date().getFullYear()} {site.name}. All rights reserved.
            </span>
            <span>Designed & vibe-coded with Next.js · Three.js · GSAP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
