"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { COLORS, SceneCanvas, Studio } from "./common";

const CODE = [
  "import { Canvas } from '@react-three/fiber'",
  "import gsap from 'gsap'",
  "",
  "export default function Idea() {",
  "  const vibe = useVibe({ mode: 'experimental' })",
  "  useEffect(() => {",
  "    gsap.to('.title', { y: 0, stagger: 0.04 })",
  "  }, [])",
  "  return (",
  "    <Canvas dpr={[1, 2]}>",
  "      <SprayCan color=\"#19FF32\" />",
  "      <Gallery walls={3} frames={9} />",
  "    </Canvas>",
  "  )",
  "}",
  "",
  "// ship it ✦",
  "> npm run build",
  "✓ Compiled successfully",
  "✓ Generating static pages (5/5)",
  "> deploying… done in 14s",
];

/** Live-updating canvas texture with typing code. */
function useCodeTexture() {
  const { canvas, ctx, tex } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext("2d")!;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return { canvas, ctx, tex };
  }, []);
  const state = useRef({ chars: 0, last: 0 });
  useEffect(() => () => tex.dispose(), [tex]);

  const draw = (t: number) => {
    const s = state.current;
    if (t - s.last < 0.03) return;
    s.last = t;
    s.chars += 2;
    const total = CODE.join("\n").length;
    if (s.chars > total + 120) s.chars = 0;
    ctx.fillStyle = "#0b0918";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#16122a";
    ctx.fillRect(0, 0, canvas.width, 44);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(26 + i * 24, 22, 7, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "#a9a3bd";
    ctx.font = "20px monospace";
    ctx.fillText("~/idea/app/page.tsx", 120, 29);
    ctx.font = "24px monospace";
    let remaining = s.chars;
    CODE.forEach((line, i) => {
      if (remaining <= 0) return;
      const vis = line.slice(0, remaining);
      remaining -= line.length + 1;
      const y = 84 + i * 26.5;
      ctx.fillStyle = "#4b4466";
      ctx.fillText(String(i + 1).padStart(2, " "), 16, y);
      ctx.fillStyle = line.startsWith("✓")
        ? COLORS.acid
        : line.startsWith(">")
          ? COLORS.lemon
          : line.startsWith("//")
            ? "#7d7697"
            : line.includes("import") || line.includes("export") || line.includes("return")
              ? COLORS.violet
              : COLORS.bone;
      ctx.fillText(vis, 64, y);
      if (remaining <= 0 && Math.floor(t * 2) % 2 === 0) {
        ctx.fillStyle = COLORS.acid;
        ctx.fillRect(64 + ctx.measureText(vis).width + 2, y - 20, 12, 24);
      }
    });
    tex.needsUpdate = true;
  };
  return { tex, draw };
}

function Monitor() {
  const g = useRef<THREE.Group>(null);
  const { tex, draw } = useCodeTexture();
  const { size } = useThree();
  useFrame((s, dt) => {
    draw(s.clock.elapsedTime);
    if (!g.current) return;
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, -0.15 + s.pointer.x * 0.3, 3, dt);
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, 0.05 - s.pointer.y * 0.15, 3, dt);
  });
  const w = 3.6, h = 2.25;
  return (
    <group ref={g} scale={size.width < 768 ? 0.7 : 1}>
      <RoundedBox args={[w + 0.2, h + 0.2, 0.14]} radius={0.08}>
        <meshStandardMaterial color="#15121f" metalness={0.7} roughness={0.3} />
      </RoundedBox>
      <mesh position-z={0.072}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh position={[0, -h / 2 - 0.5, -0.12]}>
        <cylinderGeometry args={[0.08, 0.1, 0.9, 24]} />
        <meshStandardMaterial color={COLORS.chrome} metalness={1} roughness={0.12} />
      </mesh>
      <mesh position={[0, -h / 2 - 0.95, 0]}>
        <cylinderGeometry args={[0.7, 0.75, 0.06, 48]} />
        <meshStandardMaterial color={COLORS.chrome} metalness={1} roughness={0.12} />
      </mesh>
      {/* floating UI chips */}
      <Float speed={2} floatIntensity={1.4}>
        <RoundedBox args={[0.9, 0.36, 0.06]} radius={0.15} position={[-2.3, 0.9, 0.5]}>
          <meshStandardMaterial color={COLORS.acid} />
        </RoundedBox>
      </Float>
      <Float speed={1.6} floatIntensity={1.2}>
        <RoundedBox args={[0.6, 0.6, 0.06]} radius={0.1} position={[2.3, -0.6, 0.6]}>
          <meshStandardMaterial color={COLORS.lemon} />
        </RoundedBox>
      </Float>
      <Float speed={1.3} floatIntensity={1.6}>
        <mesh position={[2.1, 1.1, 0.2]}>
          <torusGeometry args={[0.24, 0.08, 16, 48]} />
          <meshStandardMaterial color={COLORS.violet} />
        </mesh>
      </Float>
    </group>
  );
}

/** Vibe-coding hero: a 3D monitor live-typing code. */
export default function MonitorScene({ active, eventSource }: { active: boolean; eventSource?: React.RefObject<HTMLElement | null> }) {
  return (
    <SceneCanvas
      active={active}
      eventSource={eventSource as React.RefObject<HTMLElement>}
      eventPrefix="client"
      camera={{ position: [0, 0, 5.8], fov: 38 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 5]} intensity={1.6} />
      <pointLight position={[-3, 1, 3]} intensity={12} color={COLORS.acid} />
      <Monitor />
      <Studio intensity={0.7} />
    </SceneCanvas>
  );
}
