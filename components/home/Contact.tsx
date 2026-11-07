"use client";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Check, Copy, MapPin, Send } from "lucide-react";
import { site } from "@/config/site";
import { useReducedMotion } from "@/hooks/useMedia";
import LazyScene from "@/components/three/LazyScene";
import { ContactScene } from "@/components/three";
import { RevealText } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/Misc";
import { SpinBadge, Splat, Arrow } from "@/components/ui/Doodles";
import Magnetic from "@/components/ui/Magnetic";
import { InstagramIcon, LinkedinIcon, WhatsappIcon, PinterestIcon, BehanceIcon } from "@/components/ui/SocialIcons";

const socials = [
  { label: "Instagram", handle: site.contact.instagram.label, href: site.contact.instagram.href, Icon: InstagramIcon },
  { label: "LinkedIn", handle: site.contact.linkedin.label, href: site.contact.linkedin.href, Icon: LinkedinIcon },
  { label: "WhatsApp", handle: site.contact.whatsapp.label, href: site.contact.whatsapp.href, Icon: WhatsappIcon },
  { label: "Pinterest", handle: site.contact.pinterest.label, href: site.contact.pinterest.href, Icon: PinterestIcon },
  { label: "Behance", handle: site.contact.behance.label, href: site.contact.behance.href, Icon: BehanceIcon },
];

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  // No backend required: the form composes an email in the visitor's mail app.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`New project idea from ${f.get("name") || "a visitor"}`);
    const body = encodeURIComponent(`${f.get("message") || ""}\n\n— ${f.get("name") || ""} (${f.get("email") || ""})`);
    window.location.href = `mailto:${site.contact.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" ref={ref} aria-labelledby="contact-title" className="relative overflow-hidden bg-plum px-4 pb-24 pt-24 md:px-8 md:pt-32">
      <div aria-hidden className="grid-lines absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute right-0 top-0 z-0 h-[70vh] w-full md:w-[55%]">
        <LazyScene className="h-full w-full" render={(active) => <ContactScene active={active} reduced={reduced} eventSource={ref} />} />
      </div>
      <Splat seed={51} className="pointer-events-none absolute -left-16 bottom-10 w-72 opacity-40" color="var(--color-violet)" />

      <div className="relative z-10 mx-auto max-w-[1600px]">
        <SectionLabel index="04">Contact</SectionLabel>
        <h2 id="contact-title" className="mt-8 font-display uppercase leading-[0.88] tracking-tight">
          <RevealText text="Have an" className="block text-[14vw] md:text-[8vw]" />
          <RevealText text="*idea?*" className="block text-[18vw] md:text-[10vw]" highlightClassName="font-graffiti normal-case text-acid spray-glow" delay={0.1} />
          <RevealText text="Let's make" className="block pl-[6vw] text-[14vw] md:pl-[16vw] md:text-[8vw]" delay={0.2} />
          <RevealText text="it real." className="block text-outline-bone text-[14vw] md:text-[8vw]" delay={0.3} />
        </h2>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="max-w-lg font-grotesk text-xl leading-snug text-bone/90 md:text-2xl">
              Brand that needs a voice, product that needs a flow, idea that needs to exist on the web? Let&apos;s build it together.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="tech-label">| Email |</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <a href={`mailto:${site.contact.email}`} className="break-all font-display text-2xl text-bone underline decoration-acid decoration-4 underline-offset-8 hover:text-acid md:text-3xl">
                    {site.contact.email}
                  </a>
                  <button
                    type="button"
                    onClick={copy}
                    aria-label="Copy email address"
                    className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-bone/25 transition-colors hover:bg-acid hover:text-ink"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <span aria-live="polite" className="font-mono text-xs text-acid">
                    {copied ? "Copied!" : ""}
                  </span>
                </div>
              </div>
              <div>
                <p className="tech-label">| Location |</p>
                <div className="mt-3 flex items-center gap-2 font-display text-2xl text-bone md:text-3xl">
                  <MapPin className="h-6 w-6 shrink-0 text-acid" />
                  <span>{site.location}</span>
                </div>
                <p className="mt-1 font-mono text-xs uppercase text-muted">{site.availability}</p>
              </div>
            </div>

            <ul className="mt-10 border-t border-bone/15">
              {socials.map(({ label, handle, href, Icon }) => (
                <li key={label} className="border-b border-bone/15">
                  <a href={href} target="_blank" rel="noreferrer" className="group flex items-center gap-4 py-5 transition-colors hover:text-acid">
                    <Icon className="h-6 w-6" />
                    <span className="font-display text-2xl uppercase md:text-3xl">{label}</span>
                    <span className="ml-auto hidden font-mono text-xs text-muted sm:inline">{handle}</span>
                    <ArrowUpRight className="h-6 w-6 transition-transform duration-300 group-hover:rotate-45" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative lg:col-span-5 lg:col-start-8">
            <Arrow className="absolute -left-24 -top-16 hidden w-32 text-acid lg:block" variant={2} />
            <motion.form
              onSubmit={onSubmit}
              className="relative rotate-[-1.5deg] rounded-[1.5rem] bg-acid p-6 text-ink shadow-[12px_12px_0_0_var(--color-ink)] md:p-8"
              initial={{ opacity: 0, y: 40, rotate: 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-graffiti text-4xl leading-none md:text-5xl">Let&apos;s go draw</p>
              <p className="font-display text-3xl uppercase leading-none md:text-4xl">something interesting</p>
              <div className="mt-6 space-y-3">
                {[
                  { name: "name", label: "Name", type: "text", auto: "name" },
                  { name: "email", label: "Email", type: "email", auto: "email" },
                ].map((f) => (
                  <label key={f.name} className="block">
                    <span className="font-mono text-[11px] uppercase tracking-widest">{f.label}</span>
                    <input
                      name={f.name}
                      type={f.type}
                      required
                      autoComplete={f.auto}
                      className="mt-1 w-full border-b-2 border-ink bg-transparent py-2 font-grotesk text-lg outline-none placeholder:text-ink/40 focus:border-ink focus:bg-ink/5"
                    />
                  </label>
                ))}
                <label className="block">
                  <span className="font-mono text-[11px] uppercase tracking-widest">Message</span>
                  <textarea
                    name="message"
                    rows={3}
                    required
                    className="mt-1 w-full resize-none border-b-2 border-ink bg-transparent py-2 font-grotesk text-lg outline-none focus:bg-ink/5"
                  />
                </label>
              </div>
              <Magnetic className="mt-6">
                <button type="submit" className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 font-condensed text-2xl tracking-wide text-acid">
                  Start a project <Send className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </Magnetic>
              <SpinBadge text="Available for work • 2026 • " className="absolute -right-6 -top-10 h-28 w-28 text-ink md:-right-10 md:h-32 md:w-32">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-ink font-display text-acid">✦</span>
              </SpinBadge>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
}
