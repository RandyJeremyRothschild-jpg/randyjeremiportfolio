"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { COLORS, PointerRig, SceneCanvas, Studio, getDotTexture } from "./common";

function makeLabelTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#0d0b1a";
  g.fillRect(0, 0, 1024, 512);
  // acid band + drips
  g.fillStyle = COLORS.acid;
  g.fillRect(0, 150, 1024, 200);
  for (let i = 0; i < 28; i++) {
    const x = Math.random() * 1024;
    const w = 6 + Math.random() * 16;
    const h = 20 + Math.random() * 120;
    g.fillRect(x, 330, w, h);
    g.beginPath();
    g.arc(x + w / 2, 330 + h, w * 0.7, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = COLORS.ink;
  g.font = "900 150px Impact, 'Arial Black', sans-serif";
  g.textBaseline = "middle";
  g.fillText("IDEAS", 40, 252);
  g.fillText("BUILD", 560, 252);
  g.fillStyle = COLORS.bone;
  g.font = "700 30px monospace";
  g.fillText("CREATIVE PAINT — 400ML", 40, 80);
  g.fillText("NO.001 / ACID GREEN", 560, 80);
  g.fillStyle = COLORS.violet;
  g.fillRect(0, 108, 1024, 10);
  g.fillStyle = COLORS.bone;
  for (let i = 0; i < 46; i++) g.fillRect(560 + i * 7, 440, Math.random() > 0.5 ? 3 : 1.5, 48);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Paint mist bursting from the nozzle, in the can's local space. */
function SprayMist({ count, origin }: { count: number; origin: [number, number, number] }) {
  const ref = useRef<THREE.Points>(null);
  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const life = new Float32Array(count);
    for (let i = 0; i < count; i++) life[i] = Math.random();
    return { pos, vel, life };
  }, [count]);

  useFrame((_, dt) => {
    const { pos, vel, life } = data;
    const d = Math.min(dt, 0.05);
    for (let i = 0; i < count; i++) {
      life[i] += d * (0.5 + (i % 7) * 0.05);
      if (life[i] >= 1) {
        life[i] = 0;
        pos[i * 3] = origin[0];
        pos[i * 3 + 1] = origin[1];
        pos[i * 3 + 2] = origin[2];
        const spread = 0.55;
        vel[i * 3] = 1.6 + Math.random() * 1.4;
        vel[i * 3 + 1] = (Math.random() - 0.3) * spread;
        vel[i * 3 + 2] = (Math.random() - 0.5) * spread;
      }
      pos[i * 3] += vel[i * 3] * d;
      pos[i * 3 + 1] += vel[i * 3 + 1] * d - life[i] * 0.4 * d;
      pos[i * 3 + 2] += vel[i * 3 + 2] * d;
      vel[i * 3] *= 0.985;
    }
    if (ref.current) ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        map={getDotTexture()}
        color={COLORS.acid}
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function SprayCan({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const label = useMemo(() => makeLabelTexture(), []);
  const chrome = useMemo(
    () => new THREE.MeshStandardMaterial({ color: COLORS.chrome, metalness: 1, roughness: 0.12 }),
    [],
  );

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    if (!reduced) g.rotation.y += dt * 0.35;
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -0.32 + state.pointer.x * 0.18, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.12 - state.pointer.y * 0.2, 3, dt);
    g.position.y = reduced ? 0 : Math.sin(t * 0.9) * 0.08;
  });

  return (
    <group ref={group} scale={mobile ? 0.62 : 0.8}>
      {/* body */}
      <mesh>
        <cylinderGeometry args={[0.62, 0.62, 2.1, 64, 1, true]} />
        <meshStandardMaterial map={label} roughness={0.32} metalness={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* bottom */}
      <mesh position-y={-1.1} material={chrome}>
        <cylinderGeometry args={[0.6, 0.56, 0.12, 64]} />
      </mesh>
      <mesh position-y={-1.04} rotation-x={Math.PI / 2} material={chrome}>
        <torusGeometry args={[0.61, 0.035, 16, 64]} />
      </mesh>
      {/* shoulder */}
      <mesh position-y={1.05} rotation-x={Math.PI / 2} material={chrome}>
        <torusGeometry args={[0.61, 0.04, 16, 64]} />
      </mesh>
      <mesh position-y={1.05} scale={[1, 0.55, 1]} material={chrome}>
        <sphereGeometry args={[0.62, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {/* neck + actuator */}
      <mesh position-y={1.42} material={chrome}>
        <cylinderGeometry args={[0.2, 0.24, 0.16, 32]} />
      </mesh>
      <mesh position-y={1.6}>
        <cylinderGeometry args={[0.17, 0.19, 0.24, 32]} />
        <meshStandardMaterial color={COLORS.bone} roughness={0.45} />
      </mesh>
      <mesh position={[0.17, 1.64, 0]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.04, 0.04, 0.06, 16]} />
        <meshStandardMaterial color={COLORS.acid} emissive={COLORS.acid} emissiveIntensity={0.6} />
      </mesh>
      {!reduced && <SprayMist count={mobile ? 120 : 280} origin={[0.2, 1.64, 0]} />}
    </group>
  );
}

function Floaters({ mobile }: { mobile: boolean }) {
  const s = mobile ? 0.7 : 1;
  return (
    <group scale={s}>
      <Float speed={1.4} rotationIntensity={1.2} floatIntensity={1.5}>
        <mesh position={[-3.1, 1.35, -1.4]} scale={0.8}>
          <torusGeometry args={[0.38, 0.14, 32, 64]} />
          <meshStandardMaterial color={COLORS.chrome} metalness={1} roughness={0.1} />
        </mesh>
      </Float>
      <Float speed={1.1} rotationIntensity={0.6} floatIntensity={2}>
        <mesh position={[3.1, -1.2, -1.2]} scale={0.75}>
          <sphereGeometry args={[0.5, 64, 64]} />
          <MeshDistortMaterial color={COLORS.acid} distort={0.45} speed={2} roughness={0.2} metalness={0.1} />
        </mesh>
      </Float>
      <Float speed={2} rotationIntensity={2} floatIntensity={1}>
        <mesh position={[2.2, 1.5, -1.6]}>
          <icosahedronGeometry args={[0.36, 0]} />
          <meshStandardMaterial color={COLORS.violet} wireframe />
        </mesh>
      </Float>
      <Float speed={1.6} rotationIntensity={1} floatIntensity={2.4}>
        <mesh position={[-2.1, -1.4, 0.2]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color={COLORS.chrome} metalness={1} roughness={0.05} />
        </mesh>
      </Float>
      <Float speed={1.3} rotationIntensity={2} floatIntensity={1.4}>
        <mesh position={[-3.2, -0.2, -2]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color={COLORS.lemon} roughness={0.4} />
        </mesh>
      </Float>
    </group>
  );
}

function Scene({ reduced }: { reduced: boolean }) {
  const { size } = useThree();
  const mobile = size.width < 768;
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <pointLight position={[-3, -1, 2]} intensity={14} color={COLORS.acid} />
      <pointLight position={[3, 2, -2]} intensity={10} color={COLORS.violet} />
      <SprayCan reduced={reduced} mobile={mobile} />
      <Floaters mobile={mobile} />
      <Studio />
      {!reduced && <PointerRig x={0.7} y={0.4} z={mobile ? 7.5 : 6} />}
    </>
  );
}

export default function HeroScene({
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
      <Scene reduced={reduced} />
    </SceneCanvas>
  );
}
