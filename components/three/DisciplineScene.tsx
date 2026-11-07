"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { COLORS, PointerRig, SceneCanvas, Studio } from "./common";

/** Animates a group's scale toward 1 when `on`, 0 otherwise, with a spin-in. */
function useAppear(on: boolean) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const s = THREE.MathUtils.damp(g.scale.x, on ? 1 : 0.001, 5, dt);
    g.scale.setScalar(s);
    g.visible = s > 0.01;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, on ? 0 : -Math.PI, 4, dt);
  });
  return ref;
}

/** 01 — Graphic design: a composition of bold primitives. */
function GraphicObject({ on }: { on: boolean }) {
  const ref = useAppear(on);
  const spin = useRef<THREE.Group>(null);
  useFrame((s, dt) => {
    if (spin.current) spin.current.rotation.z += dt * 0.15;
  });
  return (
    <group ref={ref}>
      <group ref={spin}>
        <Float speed={2} floatIntensity={1.2} rotationIntensity={1}>
          <mesh position={[-0.9, 0.6, 0]}>
            <coneGeometry args={[0.6, 1.1, 3]} />
            <meshStandardMaterial color={COLORS.lemon} roughness={0.5} flatShading />
          </mesh>
        </Float>
        <Float speed={1.5} floatIntensity={1} rotationIntensity={1.5}>
          <mesh position={[0.9, 0.5, -0.3]}>
            <torusGeometry args={[0.5, 0.2, 24, 64]} />
            <meshStandardMaterial color={COLORS.violet} roughness={0.3} />
          </mesh>
        </Float>
        <Float speed={1.8} floatIntensity={1.4} rotationIntensity={2}>
          <mesh position={[0.6, -0.8, 0.3]}>
            <boxGeometry args={[0.7, 0.7, 0.7]} />
            <meshStandardMaterial color={COLORS.bone} roughness={0.6} />
          </mesh>
        </Float>
        <Float speed={1.2} floatIntensity={1} rotationIntensity={0.5}>
          <mesh position={[-0.6, -0.6, 0.2]}>
            <sphereGeometry args={[0.55, 64, 64]} />
            <MeshDistortMaterial color={COLORS.acid} distort={0.4} speed={2.5} roughness={0.2} />
          </mesh>
        </Float>
      </group>
    </group>
  );
}

/** 02 — UI/UX: layered interface cards. */
function UiObject({ on }: { on: boolean }) {
  const ref = useAppear(on);
  const stack = useRef<THREE.Group>(null);
  useFrame((s, dt) => {
    if (!stack.current) return;
    stack.current.rotation.y = THREE.MathUtils.damp(stack.current.rotation.y, -0.5 + s.pointer.x * 0.5, 3, dt);
    stack.current.rotation.x = THREE.MathUtils.damp(stack.current.rotation.x, 0.15 - s.pointer.y * 0.3, 3, dt);
    stack.current.children.forEach((c, i) => {
      c.position.z = THREE.MathUtils.damp(c.position.z, (i - 1) * (0.45 + Math.sin(s.clock.elapsedTime + i) * 0.08), 3, dt);
    });
  });
  const cards = [
    { color: COLORS.plum, y: 0.25, x: -0.25 },
    { color: COLORS.violet, y: 0, x: 0 },
    { color: COLORS.bone, y: -0.25, x: 0.25 },
  ];
  return (
    <group ref={ref}>
      <group ref={stack}>
        {cards.map((c, i) => (
          <group key={i} position={[c.x, c.y, 0]}>
            <RoundedBox args={[2, 1.3, 0.05]} radius={0.06} smoothness={4}>
              <meshStandardMaterial color={c.color} roughness={0.35} metalness={0.1} />
            </RoundedBox>
            {i === 2 && (
              <>
                <mesh position={[-0.6, 0.35, 0.04]}>
                  <circleGeometry args={[0.16, 32]} />
                  <meshStandardMaterial color={COLORS.acid} />
                </mesh>
                <mesh position={[0.15, 0.4, 0.04]}>
                  <planeGeometry args={[1, 0.08]} />
                  <meshStandardMaterial color={COLORS.ink} />
                </mesh>
                <mesh position={[0.0, 0.24, 0.04]}>
                  <planeGeometry args={[0.7, 0.06]} />
                  <meshStandardMaterial color={COLORS.ink} transparent opacity={0.4} />
                </mesh>
                <RoundedBox args={[0.8, 0.24, 0.04]} radius={0.1} position={[-0.4, -0.38, 0.04]}>
                  <meshStandardMaterial color={COLORS.ink} />
                </RoundedBox>
                <mesh position={[0.55, -0.3, 0.04]}>
                  <planeGeometry args={[0.5, 0.5]} />
                  <meshStandardMaterial color={COLORS.lemon} />
                </mesh>
              </>
            )}
          </group>
        ))}
      </group>
    </group>
  );
}

/** 03 — Vibe coding: a wireframe core with orbiting bits. */
function CodeObject({ on }: { on: boolean }) {
  const ref = useAppear(on);
  const core = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Group>(null);
  useFrame((s, dt) => {
    if (core.current) {
      core.current.rotation.x += dt * 0.3;
      core.current.rotation.y += dt * 0.4;
    }
    if (orbit.current) orbit.current.rotation.y -= dt * 0.8;
  });
  return (
    <group ref={ref}>
      <group ref={core}>
        <mesh>
          <icosahedronGeometry args={[1.1, 1]} />
          <meshBasicMaterial color={COLORS.acid} wireframe />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.55, 64, 64]} />
          <meshStandardMaterial color={COLORS.chrome} metalness={1} roughness={0.08} />
        </mesh>
      </group>
      <group ref={orbit} rotation-x={0.4}>
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 1.7, Math.sin(a * 2) * 0.2, Math.sin(a) * 1.7]}>
              <boxGeometry args={[0.14, 0.14, 0.14]} />
              <meshStandardMaterial
                color={i % 2 ? COLORS.lemon : COLORS.acid}
                emissive={i % 2 ? COLORS.lemon : COLORS.acid}
                emissiveIntensity={0.5}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

export default function DisciplineScene({ active, index }: { active: boolean; index: number }) {
  return (
    <SceneCanvas active={active} camera={{ position: [0, 0, 5.5], fov: 40 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 4]} intensity={2} />
      <pointLight position={[-3, 0, 2]} intensity={10} color={COLORS.acid} />
      <GraphicObject on={index === 0} />
      <UiObject on={index === 1} />
      <CodeObject on={index === 2} />
      <Studio intensity={0.8} />
      <PointerRig x={0.5} y={0.3} z={5.5} />
    </SceneCanvas>
  );
}
