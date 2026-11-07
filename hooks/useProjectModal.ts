"use client";
import { useCallback, useState } from "react";
import type { Project } from "@/data/types";

/** Open/close/prev/next state for <ProjectModal/> over a list of projects. */
export function useProjectModal(list: Project[]) {
  const [id, setId] = useState<string | null>(null);
  const project = id ? (list.find((p) => p.id === id) ?? null) : null;

  const open = useCallback((p: Project) => setId(p.id), []);
  const close = useCallback(() => setId(null), []);
  const navigate = useCallback(
    (dir: 1 | -1) =>
      setId((cur) => {
        const i = list.findIndex((p) => p.id === cur);
        if (i < 0) return cur;
        return list[(i + dir + list.length) % list.length].id;
      }),
    [list],
  );
  return { project, open, close, navigate };
}
