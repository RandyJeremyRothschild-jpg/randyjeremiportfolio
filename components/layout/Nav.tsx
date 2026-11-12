"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { navItems, site, socials, type NavKey } from "@/config/site";
import { lockScroll, scrollToTarget } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import Clock from "@/components/ui/Clock";

const pill =
  "pointer-events-auto flex h-12 items-center rounded-full border border-ink/10 bg-surface/75 shadow-[0_8px_30px_-12px_rgb(23_25_28/0.25)] backdrop-blur-md";

/** Which nav item is active for the current route / scroll position. */
function useActiveKey(): NavKey | null {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [section, setSection] = useState<NavKey>("home");

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => {
      const line = window.innerHeight * 0.45;
      let cur: NavKey = "home";
      document.querySelectorAll<HTMLElement>("[data-nav]").forEach((el) => {
        if (el.getBoundingClientRect().top <= line) cur = el.dataset.nav as NavKey;
      });
      setSection(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  if (pathname.startsWith("/portfolio")) return "work";
  if (pathname.startsWith("/cv")) return "cv";
  return isHome ? section : null;
}

export default function Nav() {
  const pathname = usePathname();
  const active = useActiveKey();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<NavKey | null>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /** Same-page anchors scroll smoothly instead of navigating. */
  const onNav = (href: string) => (e: React.MouseEvent) => {
    setOpen(false);
    if (pathname !== "/") return;
    if (href === "/") {
      e.preventDefault();
      scrollToTarget(0);
    } else if (href.startsWith("/#")) {
      e.preventDefault();
      scrollToTarget(href.slice(1));
      history.replaceState(null, "", href);
    }
  };

  const highlight = hovered ?? active;

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[100] print:hidden">
        <div className="wrap flex items-center justify-between gap-3 pt-4">
          {/* Wordmark */}
          <Link href="/" onClick={onNav("/")} className={cn(pill, "gap-2.5 pl-1.5 pr-4")} aria-label={`${site.name} — home`}>
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-ink font-display text-[13px] font-medium tracking-tight text-paper">
              {site.monogram}
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-lime ring-2 ring-surface" aria-hidden />
            </span>
            <span className="font-display text-[15px] font-medium tracking-tight">{site.name}</span>
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className={cn(pill, "hidden px-1.5 md:flex")} onMouseLeave={() => setHovered(null)}>
            {navItems.map((item) => {
              const isActive = active === item.key;
              const isLit = highlight === item.key;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={onNav(item.href)}
                  onMouseEnter={() => setHovered(item.key)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex h-9 items-center rounded-full px-4 font-ui text-[13px] font-medium transition-colors duration-300",
                    isLit ? "text-paper" : "text-ink/70",
                  )}
                >
                  {isLit && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    {isActive && <span className="h-1 w-1 rounded-full bg-lime" aria-hidden />}
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Status */}
          <div className={cn(pill, "hidden gap-3 px-4 lg:flex")}>
            {site.availableForWork && (
              <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink/80">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-lime ring-1 ring-ink/30" aria-hidden />
                Available
              </span>
            )}
            <span className="h-3 w-px bg-ink/15" aria-hidden />
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              SBY <Clock className="tabular-nums text-ink" />
            </span>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className={cn(pill, "gap-2.5 px-4 font-ui text-[13px] font-medium md:hidden")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
            <span className="relative h-2.5 w-4" aria-hidden>
              <span className={cn("absolute left-0 top-0 h-px w-4 bg-ink transition-transform duration-300", open && "translate-y-[5px] rotate-45")} />
              <span className={cn("absolute bottom-0 left-0 h-px w-4 bg-ink transition-transform duration-300", open && "-translate-y-[4px] -rotate-45")} />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[95] flex flex-col bg-paper px-5 pb-8 pt-24 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <p className="label">Navigation</p>
            <nav aria-label="Mobile" className="mt-4 flex flex-col">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={onNav(item.href)}
                    aria-current={active === item.key ? "page" : undefined}
                    className="flex items-baseline justify-between border-b border-line py-4"
                  >
                    <span className="font-display text-[11vw] font-medium uppercase leading-none tracking-tight">{item.label}</span>
                    <span className="label flex items-center gap-2">
                      {active === item.key && <span className="h-1.5 w-1.5 rounded-full bg-lime ring-1 ring-ink/30" />}0{i + 1}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-8">
              {socials
                .filter((s) => s.primary)
                .map((s) => (
                  <a key={s.key} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="label text-ink">
                    {s.name} ↗
                  </a>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
