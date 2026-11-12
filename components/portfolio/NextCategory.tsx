import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";
import type { CategorySlug } from "@/data/types";

/** Bottom-of-page navigation to the next discipline + back to the archive. */
export default function NextCategory({ current }: { current: CategorySlug }) {
  const i = categories.findIndex((c) => c.slug === current);
  const next = categories[(i + 1) % categories.length];
  return (
    <section className="pb-24 pt-8 md:pb-32">
      <div className="wrap">
        <Link href="/portfolio" className="label inline-flex items-center gap-2 text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> <span className="u-link">Back to the archive</span>
        </Link>
        <Link
          href={next.href}
          data-cursor="Next"
          className="group mt-6 flex items-center justify-between gap-6 border-y border-ink/15 py-8 transition-[padding] duration-500 ease-[var(--ease-expo)] hover:px-4 md:py-12"
        >
          <span>
            <span className="label block">Next discipline — {next.index}</span>
            <span className="mt-3 block font-display text-[clamp(2rem,7vw,6rem)] font-medium uppercase leading-none tracking-[-0.035em]">
              {next.title}
            </span>
            <span className="mt-3 block max-w-md text-sm text-muted">{next.tagline}</span>
          </span>
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-ink text-paper transition-all duration-500 ease-[var(--ease-expo)] group-hover:rotate-45 group-hover:bg-lime group-hover:text-ink md:h-20 md:w-20">
            <ArrowUpRight className="h-6 w-6 md:h-8 md:w-8" />
          </span>
        </Link>
      </div>
    </section>
  );
}
