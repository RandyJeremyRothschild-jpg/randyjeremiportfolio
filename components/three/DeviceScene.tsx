"use client";
import { Suspense, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { COLORS, SceneCanvas, Studio } from "./common";

function useScreen(src: string) {
  const t = useTexture(src);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function Phone({ screen, position, rotation }: { screen: string; position: [number, number, number]; rotation: [number, number, number] }) {
  const tex = useScreen(screen);
  const w = 1.15, h = 2.4;
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[w, h, 0.1]} radius={0.14} smoothness={6}>
        <meshStandardMaterial color="#17191C" metalness={0.8} roughness={0.25} />
      </RoundedBox>
      <mesh position-z={0.052}>
        <planeGeometry args={[w - 0.1, h - 0.1]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh position={[0, h / 2 - 0.16, 0.054]}>
        <planeGeometry args={[0.32, 0.08]} />
        <meshBasicMaterial color="#000" />
      </mesh>
    </group>
  );
}

function Monitor({ screen, position, rotation }: { screen: string; position: [number, number, number]; rotation: [number, number, number] }) {
  const tex = useScreen(screen);
  const w = 3.6, h = 2.25;
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[w + 0.14, h + 0.14, 0.1]} radius={0.06}>
        <meshStandardMaterial color="#17191C" metalness={0.8} roughness={0.25} />
      </RoundedBox>
      <mesh position-z={0.052}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh position={[0, -h / 2 - 0.45, -0.1]}>
        <boxGeometry args={[0.18, 0.8, 0.08]} />
        <meshStandardMaterial color={COLORS.chrome} metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[0, -h / 2 - 0.85, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.6]} />
        <meshStandardMaterial color={COLORS.chrome} metalness={1} roughness={0.15} />
      </mesh>
    </group>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  const { size } = useThree();
  useFrame((s, dt) => {
    if (!g.current) return;
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, s.pointer.x * 0.35, 3, dt);
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, -s.pointer.y * 0.18, 3, dt);
  });
  const scale = size.width < 768 ? 0.62 : 1;
  return (
    <group ref={g} scale={scale}>
      {children}
    </group>
  );
}

/** UI/UX hero: a floating phone + desktop monitor showing real project screens. */
export default function DeviceScene({
  active,
  phoneScreens,
  desktopScreen,
  eventSource,
}: {
  active: boolean;
  phoneScreens: string[];
  desktopScreen: string;
  eventSource?: React.RefObject<HTMLElement | null>;
}) {
  return (
    <SceneCanvas
      active={active}
      eventSource={eventSource as React.RefObject<HTMLElement>}
      eventPrefix="client"
      camera={{ position: [0, 0, 7.5], fov: 35 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 5]} intensity={1.8} />
      <pointLight position={[-4, 0, 2]} intensity={10} color={COLORS.sky} />
      <Suspense fallback={null}>
        <Rig>
          <Float speed={1.2} floatIntensity={0.6} rotationIntensity={0.2}>
            <Monitor screen={desktopScreen} position={[0.6, 0.3, -1]} rotation={[0, -0.25, 0]} />
          </Float>
          <Float speed={1.8} floatIntensity={1} rotationIntensity={0.4}>
            <Phone screen={phoneScreens[0]} position={[-1.9, -0.3, 0.6]} rotation={[0.05, 0.35, 0.08]} />
          </Float>
          {phoneScreens[1] && (
            <Float speed={1.5} floatIntensity={1.2} rotationIntensity={0.3}>
              <Phone screen={phoneScreens[1]} position={[2.5, -0.7, 0.9]} rotation={[0, -0.4, -0.06]} />
            </Float>
          )}
        </Rig>
      </Suspense>
      <Studio intensity={0.8} />
    </SceneCanvas>
  );
}
