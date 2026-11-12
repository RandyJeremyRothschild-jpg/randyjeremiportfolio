import type { Project } from "@/data/types";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/ui/Misc";

const POS = [
  "left-[6%] top-[16%] -rotate-3 group-hover:-translate-x-3 group-hover:-rotate-6",
  "left-1/2 top-[9%] z-10 -translate-x-1/2 group-hover:-translate-y-3",
  "right-[6%] bottom-[12%] rotate-3 group-hover:translate-x-3 group-hover:rotate-6",
];

/**
 * Three overlapping project images on a soft panel. Sits inside a `.group`
 * element: the tiles fan out when that group is hovered.
 */
export default function PosterStack({ items, className, sizes = "30vw" }: { items: Project[]; className?: string; sizes?: string }) {
  return (
    <div className={cn("grid-paper relative overflow-hidden rounded-sm bg-soft", className)} aria-hidden>
      {items.slice(0, 3).map((p, i) => (
        <div
          key={p.id}
          className={cn(
            "absolute overflow-hidden bg-surface shadow-[0_26px_50px_-22px_rgb(23_25_28/0.5)] transition-transform duration-700 ease-[var(--ease-expo)]",
            p.ratio < 0.6 ? "h-[76%] rounded-[1.2rem] ring-4 ring-ink" : p.ratio < 1 ? "h-[74%] rounded-[2px]" : "h-[50%] rounded-[3px] ring-1 ring-ink/10",
            POS[i],
          )}
          style={{ aspectRatio: p.ratio }}
        >
          <SmartImage src={p.thumbnail} alt="" sizes={sizes} className="object-cover" />
        </div>
      ))}
    </div>
  );
}
