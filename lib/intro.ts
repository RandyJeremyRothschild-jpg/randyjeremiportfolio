"use client";
import { useSyncExternalStore } from "react";

let done = false;
const subs = new Set<() => void>();

export function markIntroDone() {
  if (done) return;
  done = true;
  subs.forEach((s) => s());
}

/** True once the intro loader has finished (or was skipped). */
export function useIntroDone() {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => done,
    () => false,
  );
}
