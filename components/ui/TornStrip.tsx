import { seeded, cn } from "@/lib/utils";

/** Builds a jagged polygon clip-path for a torn-paper edge (top + bottom). */
function tornPolygon(seed: number, depth = 10, steps = 48) {
  const r = seeded(seed);
  const top: string[] = [];
  const bottom: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100;
    top.push(`${x.toFixed(2)}% ${(r() * depth).toFixed(2)}%`);
  }
  for (let i = steps; i >= 0; i--) {
    const x = (i / steps) * 100;
    bottom.push(`${x.toFixed(2)}% ${(100 - r() * depth).toFixed(2)}%`);
  }
  return `polygon(${[...top, ...bottom].join(",")})`;
}

/**
 * Torn paper strip: off-white paper edge with an acid layer on top,
 * like the ripped poster band in the reference.
 */
export default function TornStrip({
  children,
  className,
  seed = 7,
  color = "var(--color-acid)",
  paper = "var(--color-bone)",
  innerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  seed?: number;
  color?: string;
  paper?: string;
  innerClassName?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0" style={{ background: paper, clipPath: tornPolygon(seed, 9) }} />
      <div
        className={cn("absolute inset-[6px_0] overflow-hidden", innerClassName)}
        style={{ background: color, clipPath: tornPolygon(seed + 3, 14) }}
      >
        {children}
      </div>
    </div>
  );
}

/** A single torn edge to put on top of a section (e.g. footer). */
export function TornEdge({ seed = 3, color = "var(--color-acid)", className }: { seed?: number; color?: string; className?: string }) {
  const r = seeded(seed);
  const pts: string[] = ["0% 100%"];
  const steps = 60;
  for (let i = 0; i <= steps; i++) pts.push(`${((i / steps) * 100).toFixed(2)}% ${(20 + r() * 80).toFixed(2)}%`);
  pts.push("100% 100%");
  return <div aria-hidden className={cn("h-6 w-full md:h-10", className)} style={{ background: color, clipPath: `polygon(${pts.join(",")})` }} />;
}
