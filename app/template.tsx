"use client";
import { motion } from "motion/react";

/** Page transition: a paper panel lifts away (with a lime hairline) as each route mounts. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[120] border-b border-lime bg-paper print:hidden"
        initial={{ y: "0%" }}
        animate={{ y: "-101%" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
      />
      <motion.div
        data-motion
        // Opacity only: a transform here would break position:sticky / fixed children.
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
      >
        {children}
      </motion.div>
    </>
  );
}
