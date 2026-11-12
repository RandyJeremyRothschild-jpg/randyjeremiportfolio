import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "lime" | "ghost-dark";

const styles: Record<Variant, string> = {
  solid: "bg-ink text-paper hover:bg-ink/90",
  outline: "border border-ink/15 bg-surface/60 text-ink hover:border-ink/40",
  lime: "bg-lime text-ink hover:brightness-95",
  "ghost-dark": "border border-white/20 text-white hover:border-white/50",
};
const iconStyles: Record<Variant, string> = {
  solid: "bg-lime text-ink",
  outline: "bg-ink text-paper",
  lime: "bg-ink text-paper",
  "ghost-dark": "bg-white text-ink",
};

/**
 * Pill button / link with a rolling label and a rotating arrow.
 * Renders <Link> for internal hrefs, <a> for external ones, <button> otherwise.
 */
export default function Button({
  children,
  href,
  onClick,
  variant = "solid",
  icon = <ArrowUpRight className="h-4 w-4" />,
  className,
  type = "button",
  ariaLabel,
  cursor,
  external,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  variant?: Variant;
  /** Pass null to hide the icon bubble. */
  icon?: React.ReactNode | null;
  className?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
  cursor?: string;
  /** Force a plain <a target="_blank"> (e.g. static files under /public). */
  external?: boolean;
}) {
  const cls = cn(
    "group/btn inline-flex h-12 items-center gap-3 rounded-full pl-5 font-ui text-sm font-medium transition-[background-color,border-color,filter] duration-300",
    icon ? "pr-2" : "pr-5",
    styles[variant],
    className,
  );
  const inner = (
    <>
      <span className="relative block h-[1.3em] overflow-hidden whitespace-nowrap leading-[1.3]">
        <span className="block transition-transform duration-500 ease-[var(--ease-expo)] group-hover/btn:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-expo)] group-hover/btn:translate-y-0"
        >
          {children}
        </span>
      </span>
      {icon && (
        <span
          aria-hidden
          className={cn(
            "grid h-8 w-8 shrink-0 place-items-center rounded-full transition-transform duration-500 ease-[var(--ease-expo)] group-hover/btn:rotate-45",
            iconStyles[variant],
          )}
        >
          {icon}
        </span>
      )}
    </>
  );
  if (href && (external || /^(https?:|mailto:|tel:)/.test(href))) {
    return (
      <a
        href={href}
        className={cls}
        aria-label={ariaLabel}
        data-cursor={cursor}
        onClick={onClick}
        {...(external || href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={cls} aria-label={ariaLabel} data-cursor={cursor} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} aria-label={ariaLabel} data-cursor={cursor}>
      {inner}
    </button>
  );
}
