import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";
import type { CategorySlug } from "@/data/types";

/** Bottom-of-page navigation to the next discipline + back to archive. */
export default function NextCategory({ current }: { current: CategorySlug }) {
  const i = categories.findIndex((c) => c.slug === current);
  const next = categories[(i + 1) % categories.length];
  return (
    <section className="px-4 pb-20 pt-10 md:px-8">
      <div className="mx-auto max-w-[1600px]">
        <Link href="/portfolio" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted hover:text-bone">
          <ArrowLeft className="h-4 w-4" /> Back to the archive
        </Link>
        <Link
          href={next.href}
          data-cursor="Next"
          className="group relative mt-6 block overflow-hidden rounded-[1.5rem] p-8 md:p-14"
          style={{ background: next.accent, color: next.onAccent }}
        >
          <span className="font-mono text-xs uppercase tracking-widest">Next room — {next.index}</span>
          <span className="mt-4 flex items-end justify-between gap-6">
            <span className="font-display text-[12vw] uppercase leading-[0.85] md:text-[8vw]">{next.shortTitle}</span>
            <ArrowUpRight className="h-16 w-16 shrink-0 transition-transform duration-500 group-hover:rotate-45 md:h-28 md:w-28" />
          </span>
          <span className="mt-2 block max-w-md opacity-80">{next.tagline}</span>
        </Link>
      </div>
    </section>
  );
}
