"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { navItems, site } from "@/config/site";
import { scrollToTarget, lockScroll } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { Splat } from "@/components/ui/Doodles";
import Magnetic from "@/components/ui/Magnetic";

type Section = (typeof navItems)[number]["section"];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState<Section>("home");
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Active section tracking on the home page.
  useEffect(() => {
    if (pathname !== "/") {
      setActive(pathname.startsWith("/portfolio") ? "works" : "home");
      return;
    }
    const ids: Section[] = ["home", "about", "works", "contact"];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id as Section);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Hide on scroll down, show on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 300 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (e: React.MouseEvent, href: string) => {
    setOpen(false);
    if (href.startsWith("/#")) {
      e.preventDefault();
      const id = href.slice(1);
      if (pathname === "/") {
        scrollToTarget(id);
        history.replaceState(null, "", id);
      } else router.push(href);
    } else if (href === "/" && pathname === "/") {
      e.preventDefault();
      scrollToTarget(0);
    }
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[100] px-4 pt-4 md:px-8"
        animate={{ y: hidden && !open ? "-120%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav aria-label="Main" className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <Link
            href="/"
            onClick={(e) => go(e, "/")}
            className="group relative z-[2] flex flex-col leading-none text-bone"
            aria-label={`${site.navLabel} ${site.navSuffix} — home`}
          >
            <span className="relative whitespace-nowrap font-graffiti text-2xl md:text-[1.7rem]">
              {site.navLabel}
              <span className="absolute -right-3 -top-1 h-2 w-2 rounded-full bg-acid transition-transform group-hover:scale-150" />
            </span>
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.35em] text-acid transition-colors group-hover:text-bone">
              {site.navSuffix}
            </span>
          </Link>

          <ul
            className={cn(
              "relative hidden items-center gap-1 rounded-full border border-bone/10 p-1 transition-colors duration-500 md:flex",
              scrolled ? "bg-ink/80 backdrop-blur-md" : "bg-ink/30 backdrop-blur-sm",
            )}
          >
            {navItems.map((item) => {
              const isActive = active === item.section;
              return (
                <li key={item.label} className="relative">
                  <Link
                    href={item.href}
                    onClick={(e) => go(e, item.href)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group relative z-[1] block overflow-hidden rounded-full px-5 py-2 font-grotesk text-[13px] font-medium uppercase tracking-wider transition-colors",
                      isActive ? "text-ink" : "text-bone/80 hover:text-bone",
                    )}
                  >
                    <span className="block transition-transform duration-300 group-hover:-translate-y-full">{item.label}</span>
                    <span aria-hidden className="absolute inset-x-0 top-full block py-2 text-center transition-transform duration-300 group-hover:-translate-y-full">
                      {item.label}
                    </span>
                  </Link>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-acid"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
            <Magnetic>
              <Link
                href="/#contact"
                onClick={(e) => go(e, "/#contact")}
                className="inline-flex -rotate-3 items-center gap-2 rounded-full bg-bone px-5 py-2.5 font-condensed text-lg leading-none tracking-wider text-ink transition-colors hover:bg-acid"
              >
                {site.availableForWork && <span className="h-2 w-2 animate-pulse rounded-full bg-acid ring-2 ring-ink/20" />}
                Let&apos;s talk
              </Link>
            </Magnetic>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative z-[2] grid h-12 w-12 place-items-center rounded-full bg-acid text-ink md:hidden"
            >
              <span className="relative block h-3 w-5">
                <span className={cn("absolute left-0 top-0 h-0.5 w-5 bg-ink transition-transform duration-300", open && "translate-y-[5px] rotate-45")} />
                <span className={cn("absolute bottom-0 left-0 h-0.5 w-5 bg-ink transition-transform duration-300", open && "-translate-y-[5px] -rotate-45")} />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[99] flex flex-col justify-between overflow-hidden bg-plum px-6 pb-10 pt-28 md:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <Splat className="pointer-events-none absolute -right-16 bottom-24 w-72 opacity-80" seed={9} color="var(--color-violet)" />
            <ul className="relative space-y-1">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => go(e, item.href)}
                    className={cn(
                      "flex items-baseline gap-3 font-display text-[12.5vw] uppercase leading-[0.95]",
                      active === item.section ? "text-acid" : "text-bone",
                    )}
                  >
                    <span className="font-mono text-xs text-muted">0{i + 1}</span>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="relative space-y-2 font-mono text-xs uppercase tracking-wider text-muted">
              <p className="text-acid">● {site.location}</p>
              <a href={`mailto:${site.contact.email}`} className="block text-bone">
                {site.contact.email}
              </a>
              <div className="flex flex-wrap gap-4">
                <a href={site.contact.instagram.href} target="_blank" rel="noreferrer">Instagram</a>
                <a href={site.contact.linkedin.href} target="_blank" rel="noreferrer">LinkedIn</a>
                <a href={site.contact.whatsapp.href} target="_blank" rel="noreferrer">WhatsApp</a>
                <a href={site.contact.pinterest.href} target="_blank" rel="noreferrer">Pinterest</a>
                <a href={site.contact.behance.href} target="_blank" rel="noreferrer">Behance</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
