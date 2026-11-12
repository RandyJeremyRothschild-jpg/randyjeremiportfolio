import Image from "next/image";
import { cn, isSvg } from "@/lib/utils";

/** Small technical section label: "● 01 —— About". */
export function SectionLabel({
  children,
  className,
  index,
}: {
  children: React.ReactNode;
  className?: string;
  index?: string;
}) {
  return (
    <div className={cn("label flex items-center gap-3", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-lime ring-1 ring-ink/25" aria-hidden />
      {index && <span>{index}</span>}
      <span className="h-px w-8 bg-current opacity-40" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

/** Infinite marquee. Content is duplicated for a seamless loop. */
export function Marquee({
  children,
  className,
  duration = 30,
  reverse = false,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  reverse?: boolean;
}) {
  return (
    <div className={cn("flex overflow-hidden whitespace-nowrap", className)} aria-hidden>
      <div
        className="flex shrink-0 animate-marquee"
        style={{ ["--marquee-duration" as string]: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0">{children}</div>
      </div>
    </div>
  );
}

/** next/image wrapper — SVG placeholders bypass the optimizer automatically. */
export function SmartImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority,
  fill = true,
  width,
  height,
  draggable,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  draggable?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized={isSvg(src)}
      draggable={draggable}
      {...(fill ? { fill: true } : { width: width ?? 1200, height: height ?? 900 })}
    />
  );
}

/** Row of small monospaced metadata items. */
export function Meta({ className, items }: { className?: string; items: string[] }) {
  return (
    <div className={cn("label flex flex-wrap gap-x-6 gap-y-1", className)}>
      {items.map((t) => (
        <span key={t}>{t}</span>
      ))}
    </div>
  );
}
