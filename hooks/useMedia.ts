"use client";
import { useEffect, useState, useSyncExternalStore } from "react";

export function useMediaQuery(query: string, fallback = false) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const useFinePointer = () => useMediaQuery("(pointer: fine)");

let webglCache: boolean | null = null;
/** Returns null while unknown (SSR / first paint), then true/false. */
export function useWebGL() {
  const [ok, setOk] = useState<boolean | null>(webglCache);
  useEffect(() => {
    if (webglCache !== null) {
      setOk(webglCache);
      return;
    }
    try {
      const c = document.createElement("canvas");
      webglCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglCache = false;
    }
    setOk(webglCache);
  }, []);
  return ok;
}
