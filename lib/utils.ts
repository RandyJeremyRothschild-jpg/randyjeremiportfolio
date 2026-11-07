import clsx, { type ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

/** Small deterministic PRNG so decorative randomness is identical on server + client. */
export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

export const pad = (n: number, len = 2) => String(n).padStart(len, "0");

export const isSvg = (src: string) => src.toLowerCase().endsWith(".svg");
