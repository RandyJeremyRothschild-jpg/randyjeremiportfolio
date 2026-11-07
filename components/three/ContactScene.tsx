"use client";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { COLORS, SceneCanvas, Studio } from "./common";

/** A liquid chrome blob that follows the pointer, ringed by orbiting paint chips. */
function Blob({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  useFrame((s, dt) => {
    if (ref.current && !reduced) {
      ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, (s.pointer.x * viewport.width) / 5, 2.5, dt);
      ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, (s.pointer.y * viewport.height) / 5, 2.5, dt);
      ref.current.rotation.y += dt * 0.3;
    }
    if (ring.current && ref.current) {
      ring.current.position.copy(ref.current.position);
      ring.current.rotation.z += dt * (reduced ? 0.05 : 0.5);
      ring.current.rotation.x = 1.1 + Math.sin(s.clock.elapsedTime * 0.5) * 0.2;
    }
  });
  const r = Math.min(1.25, viewport.width / 5);
  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[r, 128, 128]} />
        <MeshDistortMaterial color={COLORS.chrome} metalness={1} roughness={0.06} distort={reduced ? 0.15 : 0.38} speed={reduced ? 0.4 : 2.2} />
      </mesh>
      <group ref={ring}>
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2;
          const c = [COLORS.acid, COLORS.violet, COLORS.lemon, COLORS.bone][i % 4];
          return (
            <mesh key={i} position={[Math.cos(a) * r * 1.7, Math.sin(a) * r * 1.7, 0]} rotation-z={a}>
              <boxGeometry args={[0.18, 0.06, 0.06]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.4} />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

export default function ContactScene({
  active,
  reduced,
  eventSource,
}: {
  active: boolean;
  reduced: boolean;
  eventSource?: React.RefObject<HTMLElement | null>;
}) {
  return (
    <SceneCanvas
      active={active}
      eventSource={eventSource as React.RefObject<HTMLElement>}
      eventPrefix="client"
      camera={{ position: [0, 0, 6], fov: 35 }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 3, 4]} intensity={1.5} />
      <Blob reduced={reduced} />
      <Studio intensity={1.4} bg="#4a3f6e" />
    </SceneCanvas>
  );
}
