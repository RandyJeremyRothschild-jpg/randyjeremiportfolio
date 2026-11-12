"use client";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const word: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.95, ease: EASE } },
};

/**
 * Staggered word-by-word reveal. Prefix a word with * to render it with
 * `highlightClassName`. Use "\n" for a forced line break.
 */
export function RevealText({
  text,
  className,
  highlightClassName = "text-muted",
  as: Tag = "span",
  delay = 0,
  stagger = 0.05,
  immediate = false,
  play = true,
}: {
  text: string;
  className?: string;
  highlightClassName?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  delay?: number;
  stagger?: number;
  immediate?: boolean;
  /** For `immediate` reveals: hold the animation until true. */
  play?: boolean;
}) {
  const lines = text.split("\n");
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      data-motion
      className={className}
      initial="hidden"
      {...(immediate
        ? { animate: play ? "show" : "hidden" }
        : { whileInView: "show", viewport: { once: true, amount: 0.4 } })}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text.replace(/\*/g, "").replace(/\n/g, " ")}
    >
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden>
          {line.split(" ").map((w, i, arr) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
              <motion.span data-motion variants={word} className={cn("inline-block", w.startsWith("*") && highlightClassName)}>
                {w.replace(/\*/g, "")}
                {i < arr.length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </MotionTag>
  );
}

/** Simple fade/slide-up on scroll. */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      data-motion
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Image reveal: the frame un-clips upward while the content settles from a slight zoom.
 * The (unclipped) outer element is the one observed, so the reveal always triggers.
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.12 }}>
      <motion.div
        data-motion
        className={cn("overflow-hidden", className)}
        variants={{ hidden: { clipPath: "inset(100% 0% 0% 0%)" }, show: { clipPath: "inset(0% 0% 0% 0%)" } }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        <motion.div
          data-motion
          className="relative h-full w-full"
          variants={{ hidden: { scale: 1.12 }, show: { scale: 1 } }}
          transition={{ duration: 1.4, delay, ease: EASE }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
