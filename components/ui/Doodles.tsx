"use client";
import { motion } from "motion/react";
import { seeded, cn } from "@/lib/utils";

type P = { className?: string; color?: string; seed?: number; style?: React.CSSProperties };

/** Paint splat with droplets + drips. Deterministic per seed (SSR-safe). */
export function Splat({ className, color = "var(--color-acid)", seed = 1, style }: P) {
  const r = seeded(seed);
  const drops = Array.from({ length: 16 }, () => {
    const a = r() * Math.PI * 2;
    const d = 30 + r() * 55;
    return { cx: 100 + Math.cos(a) * d, cy: 100 + Math.sin(a) * d, r: 1.5 + r() * 7 };
  });
  const drips = Array.from({ length: 3 }, () => ({ x: 80 + r() * 40, len: 30 + r() * 60, w: 4 + r() * 5 }));
  return (
    <svg viewBox="0 0 200 260" className={className} style={style} aria-hidden>
      <g fill={color}>
        <path d="M100 58c18 0 26 14 40 18s30 2 30 22-18 22-22 34 6 30-14 36-26-8-38-8-26 14-40 2-2-26-8-38-30-14-26-32 26-14 34-22 26-12 44-12z" />
        {drops.map((d, i) => (
          <circle key={i} cx={d.cx.toFixed(1)} cy={d.cy.toFixed(1)} r={d.r.toFixed(1)} />
        ))}
        {drips.map((d, i) => (
          <g key={`d${i}`}>
            <rect x={d.x} y={130} width={d.w} height={d.len} rx={d.w / 2} />
            <circle cx={d.x + d.w / 2} cy={130 + d.len} r={d.w * 0.9} />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Hand-drawn arrow that draws itself when in view. */
export function Arrow({ className, color = "currentColor", variant = 0 }: P & { variant?: 0 | 1 | 2 }) {
  const paths = [
    { body: "M8 60 C 40 10, 110 6, 150 40 S 180 90, 190 70", head: "M174 58 L192 70 L176 86" },
    { body: "M10 20 C 60 80, 120 90, 180 40", head: "M160 36 L182 40 L172 60" },
    { body: "M20 10 C 10 60, 40 110, 100 120 S 170 100, 180 120", head: "M162 108 L182 122 L164 136" },
  ][variant];
  return (
    <svg viewBox="0 0 200 140" className={className} fill="none" aria-hidden>
      <motion.path
        d={paths.body}
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      <motion.path
        d={paths.head}
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.35, delay: 0.95 }}
      />
    </svg>
  );
}

export function Squiggle({ className, color = "currentColor" }: P) {
  return (
    <svg viewBox="0 0 300 40" className={className} fill="none" aria-hidden>
      <motion.path
        d="M4 24 Q 22 4, 40 22 T 76 22 T 112 22 T 148 22 T 184 22 T 220 22 T 256 22 T 296 20"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
    </svg>
  );
}

export function Star({ className, color = "var(--color-acid)", style }: P) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <path
        fill={color}
        d="M50 2 L58 38 L96 30 L64 52 L86 88 L50 66 L14 88 L36 52 L4 30 L42 38 Z"
      />
    </svg>
  );
}

export function Crown({ className, color = "var(--color-acid)" }: P) {
  return (
    <svg viewBox="0 0 120 80" className={className} fill="none" aria-hidden>
      <path d="M10 70 L6 18 L36 44 L60 8 L84 44 L114 18 L110 70 Z" stroke={color} strokeWidth={5} strokeLinejoin="round" />
      <circle cx="6" cy="14" r="5" fill={color} />
      <circle cx="60" cy="5" r="5" fill={color} />
      <circle cx="114" cy="14" r="5" fill={color} />
    </svg>
  );
}

export function XMark({ className, color = "var(--color-acid)", style }: P) {
  return (
    <svg viewBox="0 0 100 140" className={className} style={style} aria-hidden>
      <g stroke={color} strokeWidth={14} strokeLinecap="round" fill="none">
        <path d="M18 14 Q 50 60 84 96" />
        <path d="M84 12 Q 52 56 20 98" />
      </g>
      <g fill={color}>
        <rect x="78" y="96" width="8" height="34" rx="4" />
        <circle cx="82" cy="130" r="6" />
        <rect x="16" y="98" width="7" height="22" rx="3.5" />
      </g>
    </svg>
  );
}

/** Drippy smiley — a nod to the reference's street-art mascot. */
export function DripSmiley({ className, color = "var(--color-acid)" }: P) {
  return (
    <svg viewBox="0 0 160 190" className={className} fill="none" aria-hidden>
      <circle cx="80" cy="80" r="64" stroke={color} strokeWidth={7} />
      <path d="M52 66 l14 14 M66 66 l-14 14" stroke={color} strokeWidth={7} strokeLinecap="round" />
      <circle cx="106" cy="72" r="8" fill={color} />
      <path d="M46 100 Q 80 132 116 100" stroke={color} strokeWidth={7} strokeLinecap="round" />
      <g fill={color}>
        <rect x="54" y="140" width="8" height="34" rx="4" />
        <circle cx="58" cy="176" r="6" />
        <rect x="100" y="138" width="7" height="22" rx="3.5" />
        <circle cx="103.5" cy="162" r="5" />
      </g>
    </svg>
  );
}

/** Circular rotating sticker with text on a path. */
export function SpinBadge({
  text,
  className,
  children,
}: {
  text: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("grid place-items-center", className)}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden>
        <defs>
          <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-current font-mono text-[15px] uppercase tracking-[0.32em]">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
