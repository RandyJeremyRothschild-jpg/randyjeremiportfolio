"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshReflectorMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Project } from "@/data/types";
import { COLORS, SceneCanvas } from "./common";

/**
 * 3D ART EXHIBITION
 * A dark hall with free-standing gallery walls. Each wall carries one
 * artwork (a real project image) lit from a track light above. The camera
 * walks the hall as the page scrolls, turns toward the nearest piece, follows
 * the pointer slightly and can be dragged to look around.
 */

const SPACING = 6.5;
const VIEW_DIST = 4.6;
const FLOOR_Y = -2.1;

export type Slot = { x: number; z: number; side: 1 | -1; rotY: number; w: number; h: number };

/** Layout: walls alternate left / right down the hall, each sized to its artwork. */
export function buildSlots(projects: Project[]): Slot[] {
  const heights = [2.3, 2.6, 2.05, 2.5, 2.2];
  return projects.map((p, i) => {
    const side = (i % 2 === 0 ? -1 : 1) as 1 | -1;
    let h = heights[i % heights.length];
    let w = h * p.ratio;
    if (w > 3.3) {
      w = 3.3;
      h = w / p.ratio;
    }
    return { x: side * 2.9, z: -i * SPACING, side, rotY: -side * 0.5, w, h };
  });
}

/** Look state shared with the DOM layer (drag to look around). */
export type LookState = { yaw: number; pitch: number; dragging: boolean };

// ── Procedural textures (no image downloads) ────────────────────────────────
function makeTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function useGalleryTextures() {
  const tex = useMemo(() => {
    // wall wash: a pool of light falling from above
    const wash = makeTexture(256, 256, (g) => {
      g.fillStyle = "#8f9494";
      g.fillRect(0, 0, 256, 256);
      const grd = g.createRadialGradient(128, 70, 10, 128, 110, 190);
      grd.addColorStop(0, "#fbfbf8");
      grd.addColorStop(0.55, "#e2e4e0");
      grd.addColorStop(1, "rgba(143,148,148,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, 256, 256);
    });
    // soft drop shadow behind a frame
    const shadow = makeTexture(128, 128, (g) => {
      const grd = g.createRadialGradient(64, 64, 20, 64, 64, 64);
      grd.addColorStop(0, "rgba(0,0,0,0.55)");
      grd.addColorStop(0.6, "rgba(0,0,0,0.22)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, 128, 128);
    });
    // light pooling on the floor in front of a wall
    const pool = makeTexture(128, 128, (g) => {
      const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      grd.addColorStop(0, "rgba(255,255,255,0.5)");
      grd.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, 128, 128);
    });
    return { wash, shadow, pool };
  }, []);
  useEffect(() => () => Object.values(tex).forEach((t) => t.dispose()), [tex]);
  return tex;
}

// ── Artwork on its wall ─────────────────────────────────────────────────────
function Artwork({
  project,
  slot,
  index,
  lit,
  tex,
  onHover,
  onSelect,
}: {
  project: Project;
  slot: Slot;
  index: number;
  lit: boolean;
  tex: ReturnType<typeof useGalleryTextures>;
  onHover: (i: number | null) => void;
  onSelect: (i: number) => void;
}) {
  const map = useTexture(project.thumbnail);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const piece = useRef<THREE.Group>(null);
  const outline = useRef<THREE.MeshBasicMaterial>(null);
  const { w, h } = slot;
  const wallW = Math.max(w + 1.7, 3.2);
  const wallH = 4.7;

  useFrame((_, dt) => {
    const g = piece.current;
    if (!g) return;
    g.position.z = THREE.MathUtils.damp(g.position.z, lit ? 0.42 : 0.2, 6, dt);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, lit ? 1.045 : 1, 6, dt));
    if (outline.current) outline.current.opacity = THREE.MathUtils.damp(outline.current.opacity, lit ? 1 : 0, 8, dt);
  });

  return (
    <group position={[slot.x, 0, slot.z]} rotation-y={slot.rotY}>
      {/* the wall */}
      <mesh position={[0, FLOOR_Y + wallH / 2, 0]}>
        <boxGeometry args={[wallW, wallH, 0.3]} />
        <meshBasicMaterial color="#8f9494" />
      </mesh>
      <mesh position={[0, FLOOR_Y + wallH / 2, 0.152]}>
        <planeGeometry args={[wallW, wallH]} />
        <meshBasicMaterial map={tex.wash} />
      </mesh>
      {/* track light */}
      <mesh position={[0, FLOOR_Y + wallH + 0.35, 0.9]}>
        <boxGeometry args={[Math.min(w * 0.7, 1.6), 0.05, 0.1]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} fog={false} />
      </mesh>
      {/* light pool on the floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR_Y + 0.012, 1.5]}>
        <planeGeometry args={[wallW * 1.2, 3.4]} />
        <meshBasicMaterial map={tex.pool} transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* frame shadow on the wall */}
      <mesh position={[0.06, -0.1, 0.158]}>
        <planeGeometry args={[w * 1.45, h * 1.35]} />
        <meshBasicMaterial map={tex.shadow} transparent depthWrite={false} />
      </mesh>

      {/* the piece: floats off the wall, steps forward on hover */}
      <group ref={piece} position={[0, 0, 0.2]}>
        <mesh position-z={-0.025}>
          <planeGeometry args={[w + 0.2, h + 0.2]} />
          <meshBasicMaterial ref={outline} color={COLORS.lime} transparent opacity={0} toneMapped={false} />
        </mesh>
        <mesh position-z={-0.02}>
          <boxGeometry args={[w + 0.09, h + 0.09, 0.06]} />
          <meshBasicMaterial color="#121416" />
        </mesh>
        <mesh
          position-z={0.012}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(index);
          }}
          onPointerOut={() => onHover(null)}
          onClick={(e) => {
            e.stopPropagation();
            // ignore the click that ends a look-around drag
            if (e.delta < 8) onSelect(index);
          }}
        >
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={map} toneMapped={false} />
        </mesh>
        {/* caption plate */}
        <mesh position={[w / 2 + 0.34, -h / 2 + 0.12, -0.03]}>
          <planeGeometry args={[0.34, 0.2]} />
          <meshBasicMaterial color="#f6f6f3" />
        </mesh>
      </group>
    </group>
  );
}

// ── The hall ────────────────────────────────────────────────────────────────
function Hall({ length, reflect }: { length: number; reflect: boolean }) {
  const mid = -length / 2 + 8;
  const bars = useMemo(() => Array.from({ length: Math.ceil(length / 3.25) + 3 }, (_, i) => 8 - i * 3.25), [length]);
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR_Y, mid]}>
        <planeGeometry args={[30, length + 30]} />
        {reflect ? (
          <MeshReflectorMaterial
            blur={[320, 90]}
            resolution={512}
            mixBlur={1}
            mixStrength={9}
            roughness={1}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#15181b"
            metalness={0.45}
            mirror={0.6}
          />
        ) : (
          <meshBasicMaterial color="#14171a" />
        )}
      </mesh>
      {/* side walls */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 9.5, 1.5, mid]} rotation-y={-s * (Math.PI / 2)}>
          <planeGeometry args={[length + 30, 8]} />
          <meshBasicMaterial color="#16191c" />
        </mesh>
      ))}
      {/* ceiling light bars: strong perspective lines receding into the fog */}
      {bars.map((z) => (
        <mesh key={z} position={[0, 4.6, z]}>
          <boxGeometry args={[5.5, 0.03, 0.06]} />
          <meshBasicMaterial color="#aab0b6" />
        </mesh>
      ))}
      {/* floor guide line */}
      <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR_Y + 0.006, mid]}>
        <planeGeometry args={[0.015, length + 30]} />
        <meshBasicMaterial color={COLORS.lime} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

// ── Camera ──────────────────────────────────────────────────────────────────
function CameraRig({
  slots,
  getProgress,
  look,
  reduced,
  onStep,
}: {
  slots: Slot[];
  getProgress: () => number;
  look: React.RefObject<LookState>;
  reduced: boolean;
  onStep: (index: number, atEnd: boolean) => void;
}) {
  const { camera } = useThree();
  const last = useRef({ index: -1, end: false });
  const startZ = SPACING * 0.3 + VIEW_DIST + 2.2;
  const endZ = slots[slots.length - 1].z + VIEW_DIST - 0.6;

  useEffect(() => {
    camera.rotation.order = "YXZ";
    camera.position.set(0, 0.15, startZ);
  }, [camera, startZ]);

  useFrame((s, dt) => {
    const p = getProgress();
    const z = THREE.MathUtils.damp(camera.position.z, THREE.MathUtils.lerp(startZ, endZ, p), reduced ? 30 : 4, dt);

    // attention: lean toward whichever wall the camera is standing in front of
    let side = 0;
    let nearest = 0;
    let best = Infinity;
    slots.forEach((slot, i) => {
      const d = z - VIEW_DIST - slot.z;
      side += Math.exp(-(d * d) / 6.5) * slot.side;
      if (Math.abs(d) < best) {
        best = Math.abs(d);
        nearest = i;
      }
    });
    side = THREE.MathUtils.clamp(side, -1, 1);

    const px = reduced ? 0 : s.pointer.x;
    const py = reduced ? 0 : s.pointer.y;
    const l = look.current;
    if (!l.dragging) {
      l.yaw = THREE.MathUtils.damp(l.yaw, 0, 1.4, dt);
      l.pitch = THREE.MathUtils.damp(l.pitch, 0, 1.4, dt);
    }
    const bob = reduced ? 0 : Math.sin(z * 1.9) * 0.025;

    camera.position.z = z;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, -side * 0.9 + px * 0.3, 2.6, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.15 + py * 0.12 + bob, 3, dt);
    camera.rotation.y = THREE.MathUtils.damp(camera.rotation.y, -side * 0.5 - px * 0.1 + l.yaw, 2.6, dt);
    camera.rotation.x = THREE.MathUtils.damp(camera.rotation.x, py * 0.05 + l.pitch, 3, dt);

    const end = p > 0.965;
    if (nearest !== last.current.index || end !== last.current.end) {
      last.current = { index: nearest, end };
      onStep(nearest, end);
    }
  });
  return null;
}

export default function GalleryScene({
  active,
  projects,
  getProgress,
  look,
  reduced,
  onHover,
  onSelect,
  onStep,
}: {
  active: boolean;
  projects: Project[];
  /** 0 → 1 scroll progress through the exhibition. */
  getProgress: () => number;
  look: React.RefObject<LookState>;
  reduced: boolean;
  onHover: (index: number | null) => void;
  onSelect: (index: number) => void;
  onStep: (index: number, atEnd: boolean) => void;
}) {
  const slots = useMemo(() => buildSlots(projects), [projects]);
  const [hover, setHover] = useState<number | null>(null);
  const length = slots.length * SPACING;

  const handleHover = (i: number | null) => {
    setHover(i);
    onHover(i);
  };

  return (
    <SceneCanvas active={active} maxDpr={1.5} camera={{ position: [0, 0.15, 9], fov: 50, near: 0.1, far: 80 }}>
      <color attach="background" args={[COLORS.night]} />
      <fog attach="fog" args={[COLORS.night, 7, 34]} />
      <ambientLight intensity={1.2} />
      <Scene slots={slots} projects={projects} hover={hover} length={length} onHover={handleHover} onSelect={onSelect} />
      <CameraRig slots={slots} getProgress={getProgress} look={look} reduced={reduced} onStep={onStep} />
    </SceneCanvas>
  );
}

function Scene({
  slots,
  projects,
  hover,
  length,
  onHover,
  onSelect,
}: {
  slots: Slot[];
  projects: Project[];
  hover: number | null;
  length: number;
  onHover: (i: number | null) => void;
  onSelect: (i: number) => void;
}) {
  const tex = useGalleryTextures();
  return (
    <>
      <Hall length={length} reflect />
      <Suspense fallback={null}>
        {projects.map((p, i) => (
          <Artwork key={p.id} project={p} slot={slots[i]} index={i} lit={hover === i} tex={tex} onHover={onHover} onSelect={onSelect} />
        ))}
      </Suspense>
    </>
  );
}
