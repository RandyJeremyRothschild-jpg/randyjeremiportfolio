"use client";
import { useState } from "react";
import { Canvas, useFrame, type CanvasProps } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";

export const COLORS = {
  ink: "#080711",
  plum: "#17102D",
  acid: "#19FF32",
  bone: "#F5F3EF",
  violet: "#9B5CFF",
  lemon: "#E8FF2A",
  chrome: "#D8DBE4",
};

/** Studio lighting rig: gives chrome materials acid/violet reflections. No network HDRs. */
export function Studio({ intensity = 1, bg = "#0b0918" }: { intensity?: number; bg?: string }) {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={[bg]} />
      <Lightformer form="rect" intensity={3 * intensity} position={[0, 5, -2]} scale={[12, 2, 1]} rotation-x={Math.PI / 2} />
      <Lightformer form="rect" intensity={2.4 * intensity} color={COLORS.acid} position={[-5, 1, 1]} scale={[3, 8, 1]} rotation-y={Math.PI / 2} />
      <Lightformer form="rect" intensity={2.4 * intensity} color={COLORS.violet} position={[5, -1, 1]} scale={[3, 8, 1]} rotation-y={-Math.PI / 2} />
      <Lightformer form="ring" intensity={2 * intensity} position={[0, 0, 6]} scale={3} />
      <Lightformer form="rect" intensity={1 * intensity} color={COLORS.bone} position={[0, -5, 0]} scale={[10, 10, 1]} rotation-x={-Math.PI / 2} />
    </Environment>
  );
}

/** Pointer-driven camera parallax. */
export function PointerRig({ x = 0.6, y = 0.4, z = 6, lookAt = [0, 0, 0] as [number, number, number] }) {
  const target = new THREE.Vector3(...lookAt);
  useFrame((state, dt) => {
    const cam = state.camera;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, state.pointer.x * x, 2.5, dt);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, state.pointer.y * y, 2.5, dt);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, z, 2.5, dt);
    cam.lookAt(target);
  });
  return null;
}

/** Canvas with sensible defaults: adaptive DPR, transparent, paused when inactive. */
export function SceneCanvas({
  active,
  children,
  camera = { position: [0, 0, 6], fov: 35 },
  ...rest
}: { active: boolean; children: React.ReactNode } & Omit<CanvasProps, "children">) {
  const [dpr, setDpr] = useState(1.75);
  return (
    <Canvas
      dpr={[1, dpr]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={camera}
      {...rest}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.75)} />
      {children}
    </Canvas>
  );
}

/** Soft round sprite for particle points. */
let dotTex: THREE.Texture | null = null;
export function getDotTexture() {
  if (dotTex) return dotTex;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.4, "rgba(255,255,255,0.8)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  dotTex = new THREE.CanvasTexture(c);
  return dotTex;
}
