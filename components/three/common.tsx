"use client";
import { useState } from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";

export const COLORS = {
  paper: "#F5F6F3",
  ink: "#17191C",
  muted: "#747A80",
  lime: "#C5F36A",
  sky: "#A9BFFF",
  chrome: "#DADDE1",
  night: "#0E1012",
};

const ORIGIN: [number, number, number] = [0, 0, 0];

/**
 * Procedural studio lighting (no network HDRs): large softboxes for clean
 * highlights, dark flags so chrome keeps its contrast on a light page, and two
 * small lime / blue glints.
 */
export function Studio({ intensity = 1 }: { intensity?: number }) {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#b4b9bf"]} />
      <Lightformer form="rect" intensity={4 * intensity} position={[0, 6, 0]} scale={[10, 5, 1]} target={ORIGIN} />
      <Lightformer form="rect" intensity={3 * intensity} position={[-6, 1, 2]} scale={[2.5, 8, 1]} target={ORIGIN} />
      <Lightformer form="rect" intensity={2.4 * intensity} position={[6, 0, 1]} scale={[2, 7, 1]} target={ORIGIN} />
      <Lightformer form="ring" intensity={2 * intensity} position={[0, 1, 7]} scale={3} target={ORIGIN} />
      <Lightformer form="rect" color="#121416" intensity={1} position={[0, -6, 0]} scale={[14, 14, 1]} target={ORIGIN} />
      <Lightformer form="rect" color="#121416" intensity={1} position={[3.5, 2, -6]} scale={[3, 7, 1]} target={ORIGIN} />
      <Lightformer form="rect" color="#121416" intensity={1} position={[-4, -1, -6]} scale={[2, 9, 1]} target={ORIGIN} />
      <Lightformer form="circle" color={COLORS.lime} intensity={3 * intensity} position={[-3.5, -2.5, 4]} scale={1.3} target={ORIGIN} />
      <Lightformer form="circle" color={COLORS.sky} intensity={3 * intensity} position={[4.5, 3, 3]} scale={1.5} target={ORIGIN} />
    </Environment>
  );
}

/** Canvas with sensible defaults: adaptive DPR, transparent, paused when inactive. */
export function SceneCanvas({
  active,
  children,
  camera = { position: [0, 0, 6], fov: 35 },
  maxDpr = 1.75,
  ...rest
}: { active: boolean; children: React.ReactNode; maxDpr?: number } & Omit<CanvasProps, "children">) {
  const [dpr, setDpr] = useState(maxDpr);
  return (
    <Canvas
      dpr={[1, dpr]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={camera}
      {...rest}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(maxDpr)} />
      {children}
    </Canvas>
  );
}
