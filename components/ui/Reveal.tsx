"use client";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

const word: Variants = {
  hidden: { y: "110%", rotate: 4 },
  show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Staggered word-by-word reveal. Pass a string; wrap words to highlight in
 * *asterisks* to render them with `highlightClassName`.
 */
export function RevealText({
  text,
  className,
  highlightClassName = "font-graffiti text-acid normal-case",
  as: Tag = "span",
  delay = 0,
  stagger = 0.06,
  immediate = false,
}: {
  text: string;
  className?: string;
  highlightClassName?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  delay?: number;
  stagger?: number;
  immediate?: boolean;
}) {
  const words = text.split(" ");
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      {...(immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.4 } })}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text.replace(/\*/g, "")}
    >
      {words.map((w, i) => {
        const hl = w.startsWith("*") && w.includes("*", 1);
        const clean = w.replace(/\*/g, "");
        return (
          <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span variants={word} className={cn("inline-block", hl && highlightClassName)}>
              {clean}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
}

/** Simple fade/slide-up on scroll. */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 40,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
