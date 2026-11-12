"use client";
import Link from "next/link";
import type { CategoryInfo } from "@/data/categories";
import { pad } from "@/lib/utils";
import { FadeIn, RevealText } from "@/components/ui/Reveal";

/** Shared hero for the three category pages: title, intro, services and a visual. */
export default function CategoryHero({
  category,
  count,
  visual,
}: {
  category: CategoryInfo;
  count: number;
  visual: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-40">
      <div className="wrap">
        <nav aria-label="Breadcrumb" className="label flex items-center gap-2">
          <Link href="/portfolio" className="u-link text-ink">
            Work
          </Link>
          <span aria-hidden>/</span>
          <span aria-current="page">{category.title}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="relative z-10 lg:col-span-6">
            <p className="label">
              <span className="text-ink">{category.index}</span> / 03
            </p>
            <RevealText
              as="h1"
              immediate
              delay={0.35}
              text={category.title.replace(" ", "\n")}
              className="h-display mt-3 text-[clamp(2.8rem,8vw,7.5rem)]"
            />
            <FadeIn delay={0.2}>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-ink/80">{category.intro}</p>
              <p className="label mt-6 flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full ring-1 ring-ink/25" style={{ background: category.accent }} aria-hidden />
                {pad(count)} projects
                <span className="h-px w-8 bg-current opacity-40" aria-hidden />
                Click any piece for the full story
              </p>
            </FadeIn>
          </div>
          <div className="relative h-[46vh] min-h-[320px] lg:col-span-6 lg:h-[58vh]">{visual}</div>
        </div>

        {/* services index */}
        <ul className="mt-12 grid grid-cols-2 border-t border-ink/15 sm:grid-cols-3 lg:grid-cols-4">
          {category.services.map((s, i) => (
            <li key={s} className="flex items-baseline gap-3 border-b border-line py-3 pr-4 text-sm">
              <span className="label">{pad(i + 1)}</span>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
