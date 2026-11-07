"use client";
import { Suspense, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Project } from "@/data/types";
import { COLORS, SceneCanvas, Studio } from "./common";

export type FrameSlot = { pos: [number, number, number]; rotY: number; h: number };

/** Exhibition layout: 3 frames on the back wall, 3 on each side wall. */
export const SLOTS: FrameSlot[] = [
  { pos: [-4.45, 0.15, -3.4], rotY: Math.PI / 2, h: 1.6 },
  { pos: [-4.45, 0.0, -1.2], rotY: Math.PI / 2, h: 1.8 },
  { pos: [-4.45, 0.2, 1.0], rotY: Math.PI / 2, h: 1.5 },
  { pos: [-2.5, 0.1, -4.9], rotY: 0, h: 1.9 },
  { pos: [0, 0.25, -4.6], rotY: 0, h: 2.2 },
  { pos: [2.5, 0.0, -4.9], rotY: 0, h: 1.9 },
  { pos: [4.45, 0.2, 1.0], rotY: -Math.PI / 2, h: 1.5 },
  { pos: [4.45, 0.0, -1.2], rotY: -Math.PI / 2, h: 1.8 },
  { pos: [4.45, 0.15, -3.4], rotY: -Math.PI / 2, h: 1.6 },
];

const normalOf = (rotY: number) => new THREE.Vector3(Math.sin(rotY), 0, Math.cos(rotY));

function Frame({
  project,
  slot,
  index,
  lit,
  onHover,
  onSelect,
}: {
  project: Project;
  slot: FrameSlot;
  index: number;
  lit: boolean;
  onHover: (i: number | null) => void;
  onSelect: (i: number) => void;
}) {
  const tex = useTexture(project.thumbnail);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const inner = useRef<THREE.Group>(null);
  const border = useRef<THREE.MeshStandardMaterial>(null);
  const h = slot.h;
  const w = Math.min(h * project.ratio, 2.7);

  useFrame((s, dt) => {
    const g = inner.current;
    if (!g) return;
    g.position.z = THREE.MathUtils.damp(g.position.z, lit ? 0.4 : 0, 6, dt);
    const sc = THREE.MathUtils.damp(g.scale.x, lit ? 1.06 : 1, 6, dt);
    g.scale.setScalar(sc);
    g.position.y = Math.sin(s.clock.elapsedTime * 0.7 + index) * 0.04;
    if (border.current) border.current.emissiveIntensity = THREE.MathUtils.damp(border.current.emissiveIntensity, lit ? 0.9 : 0, 6, dt);
  });

  return (
    <group position={slot.pos} rotation-y={slot.rotY}>
      <group ref={inner}>
        <mesh position-z={-0.05} castShadow>
          <boxGeometry args={[w + 0.16, h + 0.16, 0.08]} />
          <meshStandardMaterial ref={border} color="#121019" emissive={COLORS.acid} emissiveIntensity={0} metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(index);
          }}
          onPointerOut={() => onHover(null)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(index);
          }}
        >
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial map={tex} roughness={0.55} />
        </mesh>
        {/* name plate */}
        <mesh position={[-w / 2 + 0.25, -h / 2 - 0.22, 0]}>
          <planeGeometry args={[0.5, 0.08]} />
          <meshBasicMaterial color={lit ? COLORS.acid : COLORS.bone} />
        </mesh>
      </group>
    </group>
  );
}

function Room() {
  return (
    <group>
      {/* floor + ceiling: the acid perspective bands from the reference */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -2.2, -1]} receiveShadow>
        <planeGeometry args={[9, 14]} />
        <meshStandardMaterial color={COLORS.acid} roughness={0.85} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, 2.6, -1]}>
        <planeGeometry args={[9, 14]} />
        <meshStandardMaterial color={COLORS.acid} roughness={0.9} emissive={COLORS.acid} emissiveIntensity={0.15} />
      </mesh>
      {/* walls */}
      <mesh position={[0, 0.2, -5]}>
        <planeGeometry args={[9, 5]} />
        <meshStandardMaterial color="#120e24" roughness={0.95} />
      </mesh>
      <mesh position={[-4.5, 0.2, -1]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[14, 5]} />
        <meshStandardMaterial color="#0e0b1d" roughness={0.95} />
      </mesh>
      <mesh position={[4.5, 0.2, -1]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[14, 5]} />
        <meshStandardMaterial color="#0e0b1d" roughness={0.95} />
      </mesh>
      {/* plinth + sculpture */}
      <mesh position={[0, -1.85, -2.4]}>
        <boxGeometry args={[0.9, 0.7, 0.9]} />
        <meshStandardMaterial color={COLORS.bone} roughness={0.7} />
      </mesh>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={0.6}>
        <mesh position={[0, -1.05, -2.4]} scale={0.32}>
          <torusKnotGeometry args={[1, 0.32, 160, 24]} />
          <meshStandardMaterial color={COLORS.chrome} metalness={1} roughness={0.08} />
        </mesh>
      </Float>
      <ContactShadows position={[0, -2.19, -1]} scale={10} blur={2.2} opacity={0.55} far={3} color="#052b0a" />
    </group>
  );
}

function CameraRig({ focus, reduced }: { focus: number | null; reduced: boolean }) {
  const { size } = useThree();
  const lookAt = useRef(new THREE.Vector3(0, 0, -4));
  const baseZ = size.width / size.height < 1 ? 9.5 : 6.6;
  useFrame((s, dt) => {
    const cam = s.camera;
    const pos = new THREE.Vector3();
    const look = new THREE.Vector3();
    if (focus !== null) {
      const slot = SLOTS[focus];
      const n = normalOf(slot.rotY);
      const dist = size.width / size.height < 1 ? 5.2 : 3.8;
      pos.set(...slot.pos).addScaledVector(n, dist);
      pos.y += 0.1;
      look.set(...slot.pos);
    } else {
      const px = reduced ? 0 : s.pointer.x;
      const py = reduced ? 0 : s.pointer.y;
      pos.set(px * 1.2, 0.1 + py * 0.5, baseZ);
      look.set(px * 0.8, py * 0.3, -4);
    }
    const k = focus !== null ? 2.4 : 2;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, pos.x, k, dt);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, pos.y, k, dt);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, pos.z, k, dt);
    lookAt.current.x = THREE.MathUtils.damp(lookAt.current.x, look.x, k, dt);
    lookAt.current.y = THREE.MathUtils.damp(lookAt.current.y, look.y, k, dt);
    lookAt.current.z = THREE.MathUtils.damp(lookAt.current.z, look.z, k, dt);
    cam.lookAt(lookAt.current);
  });
  return null;
}

/** A spotlight that glides to whichever frame is hovered/focused. */
function RoamingSpot({ target }: { target: number | null }) {
  const spot = useRef<THREE.SpotLight>(null);
  const tObj = useMemo(() => new THREE.Object3D(), []);
  useFrame((_, dt) => {
    const l = spot.current;
    if (!l) return;
    const slot = target !== null ? SLOTS[target] : null;
    const tx = slot ? slot.pos[0] : 0;
    const ty = slot ? slot.pos[1] : 0;
    const tz = slot ? slot.pos[2] : -4.6;
    tObj.position.x = THREE.MathUtils.damp(tObj.position.x, tx, 4, dt);
    tObj.position.y = THREE.MathUtils.damp(tObj.position.y, ty, 4, dt);
    tObj.position.z = THREE.MathUtils.damp(tObj.position.z, tz, 4, dt);
    l.intensity = THREE.MathUtils.damp(l.intensity, slot ? 60 : 30, 4, dt);
    tObj.updateMatrixWorld();
  });
  return (
    <>
      <primitive object={tObj} />
      <spotLight ref={spot} position={[0, 2.4, 1.5]} angle={0.45} penumbra={0.7} intensity={30} color="#ffffff" target={tObj} castShadow />
    </>
  );
}

export default function GalleryScene({
  active,
  projects,
  focus,
  reduced,
  onSelect,
}: {
  active: boolean;
  projects: Project[];
  focus: number | null;
  reduced: boolean;
  onSelect: (i: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const items = projects.slice(0, SLOTS.length);
  return (
    <SceneCanvas active={active} shadows camera={{ position: [0, 0.1, 6.6], fov: 50 }} style={{ cursor: hover !== null ? "pointer" : "auto" }}>
      <ambientLight intensity={0.55} />
      <hemisphereLight args={[COLORS.bone, COLORS.acid, 0.4]} />
      <pointLight position={[0, 2, -2]} intensity={8} color={COLORS.violet} />
      <RoamingSpot target={hover ?? focus} />
      <Room />
      <Suspense fallback={null}>
        {items.map((p, i) => (
          <Frame
            key={p.id}
            project={p}
            slot={SLOTS[i]}
            index={i}
            lit={hover === i || focus === i}
            onHover={setHover}
            onSelect={onSelect}
          />
        ))}
      </Suspense>
      <Studio intensity={0.6} />
      <CameraRig focus={focus} reduced={reduced} />
    </SceneCanvas>
  );
}
