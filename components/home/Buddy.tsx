"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "motion/react";

/**
 * A small playful companion for the contact section: a lime badge whose eyes
 * follow the cursor. Drag it around; click it for a reaction.
 */
export default function Buddy({ constraints }: { constraints: React.RefObject<HTMLElement | null> }) {
  const root = useRef<HTMLDivElement>(null);
  const pupils = useRef<(HTMLSpanElement | null)[]>([]);
  const controls = useAnimationControls();
  const [surprised, setSurprised] = useState(false);
  const dragged = useRef(false);

  useEffect(() => {
    let raf = 0;
    let mx = 0, my = 0;
    const update = () => {
      raf = 0;
      pupils.current.forEach((p) => {
        const eye = p?.parentElement;
        if (!p || !eye) return;
        const r = eye.getBoundingClientRect();
        const dx = mx - (r.left + r.width / 2);
        const dy = my - (r.top + r.height / 2);
        const dist = Math.min(1, Math.hypot(dx, dy) / 160);
        const a = Math.atan2(dy, dx);
        p.style.transform = `translate(${Math.cos(a) * dist * 5}px, ${Math.sin(a) * dist * 6}px)`;
      });
    };
    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  const react = async () => {
    if (dragged.current) return;
    setSurprised(true);
    await controls.start({ rotate: [0, -14, 12, -6, 0], scale: [1, 1.12, 1], transition: { duration: 0.7 } });
    setSurprised(false);
  };

  return (
    <motion.div
      ref={root}
      drag
      dragConstraints={constraints}
      dragElastic={0.25}
      dragMomentum
      whileDrag={{ scale: 1.08, rotate: 6 }}
      onDragStart={() => (dragged.current = true)}
      onDragEnd={() => setTimeout(() => (dragged.current = false), 0)}
      animate={controls}
      onClick={react}
      data-cursor="Drag me"
      role="img"
      aria-label="A friendly badge that follows your cursor"
      className="relative grid h-32 w-32 touch-none cursor-grab place-items-center rounded-full bg-lime shadow-[0_18px_40px_-14px_rgb(23_25_28/0.4)] active:cursor-grabbing md:h-40 md:w-40"
    >
      {/* rotating text ring */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 animate-spin-slow" aria-hidden>
        <defs>
          <path id="buddy-ring" d="M 100,100 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" />
        </defs>
        <text className="fill-ink font-mono text-[13px] uppercase" letterSpacing="2.2">
          <textPath href="#buddy-ring">Let&apos;s talk · Say hello · Let&apos;s talk · Say hello ·</textPath>
        </text>
      </svg>
      {/* face */}
      <div className="relative flex flex-col items-center gap-2">
        <div className="flex gap-2.5">
          {[0, 1].map((i) => (
            <span key={i} className="grid h-7 w-5 place-items-center rounded-full bg-surface md:h-8 md:w-6">
              <span
                ref={(el) => {
                  pupils.current[i] = el;
                }}
                className="block h-2.5 w-2.5 rounded-full bg-ink"
              />
            </span>
          ))}
        </div>
        <span
          className={
            surprised
              ? "h-3 w-3 rounded-full bg-ink transition-all duration-200"
              : "h-2 w-6 rounded-b-full border-b-[3px] border-ink transition-all duration-200"
          }
        />
      </div>
    </motion.div>
  );
}
