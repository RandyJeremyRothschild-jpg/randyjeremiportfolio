"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Float, MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { COLORS, SceneCanvas, Studio } from "./common";

/**
 * SIGNATURE OBJECT — "the gimbal".
 * Three metal rings (one per discipline) tumble around a glass core that
 * holds a single lime idea. Idle: slow gyroscopic motion. Pointer: the whole
 * piece leans toward the cursor. Hover: it speeds up. Drag: rotate it freely.
 * Click: the rings snap into one aligned plane ("clarity"); click again to
 * release them ("curiosity").
 */
const RINGS = [
  { r: 1.3, tube: 0.052, axis: [1, 0.25, 0], speed: 0.46, phase: 0.4, color: COLORS.chrome, rough: 0.07 },
  { r: 1.64, tube: 0.04, axis: [0.15, 1, 0], speed: -0.34, phase: 1.7, color: COLORS.chrome, rough: 0.07 },
  { r: 1.98, tube: 0.03, axis: [0.7, 0.7, 0], speed: 0.24, phase: 3.1, color: "#9db2f5", rough: 0.22 },
] as const;

const bgColor = new THREE.Color(COLORS.paper);

function Ring({
  cfg,
  index,
  aligned,
  speed,
}: {
  cfg: (typeof RINGS)[number];
  index: number;
  aligned: boolean;
  speed: React.RefObject<number>;
}) {
  const ref = useRef<THREE.Group>(null);
  const angle = useRef<number>(cfg.phase);
  const axis = useMemo(() => new THREE.Vector3(...cfg.axis).normalize(), [cfg]);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const zAxis = useMemo(() => new THREE.Vector3(0, 0, 1), []);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    angle.current += dt * cfg.speed * speed.current;
    if (aligned) q.setFromAxisAngle(zAxis, angle.current * 0.6 + index);
    else q.setFromAxisAngle(axis, angle.current);
    g.quaternion.slerp(q, 1 - Math.exp(-dt * (aligned ? 5 : 3)));
  });

  return (
    <group ref={ref}>
      <mesh castShadow>
        <torusGeometry args={[cfg.r, cfg.tube, 24, 160]} />
        <meshStandardMaterial color={cfg.color} metalness={1} roughness={cfg.rough} envMapIntensity={1.25} />
      </mesh>
      {/* a bead rides each ring, like a marker on a dial */}
      <mesh position={[cfg.r, 0, 0]} castShadow>
        <sphereGeometry args={[index === 2 ? 0.1 : 0.075, 24, 24]} />
        <meshStandardMaterial
          color={index === 2 ? COLORS.lime : COLORS.ink}
          metalness={index === 2 ? 0.1 : 0.6}
          roughness={0.3}
          emissive={index === 2 ? COLORS.lime : "#000000"}
          emissiveIntensity={index === 2 ? 0.35 : 0}
        />
      </mesh>
    </group>
  );
}

function Core({ speed, hovered }: { speed: React.RefObject<number>; hovered: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const idea = useRef<THREE.Mesh>(null);
  useFrame((s, dt) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.x += dt * 0.18 * speed.current;
    g.rotation.y += dt * 0.26 * speed.current;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, hovered ? 1.1 : 1, 5, dt));
    if (idea.current) idea.current.scale.setScalar(1 + Math.sin(s.clock.elapsedTime * 1.6) * 0.06);
  });
  return (
    <group ref={ref}>
      <RoundedBox args={[1.06, 1.06, 1.06]} radius={0.22} smoothness={6} castShadow>
        <MeshTransmissionMaterial
          background={bgColor}
          samples={6}
          resolution={256}
          transmission={1}
          thickness={0.85}
          roughness={0.04}
          ior={1.32}
          chromaticAberration={0.05}
          anisotropicBlur={0.1}
          distortion={0.08}
          distortionScale={0.4}
          temporalDistortion={0.05}
          color="#ffffff"
          attenuationColor="#dfe6ff"
          attenuationDistance={2.4}
        />
      </RoundedBox>
      <mesh ref={idea}>
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshStandardMaterial color={COLORS.lime} emissive={COLORS.lime} emissiveIntensity={0.3} roughness={0.25} />
      </mesh>
    </group>
  );
}

/** Small supporting objects floating around the piece. */
function Floaters({ reduced }: { reduced: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s, dt) => {
    if (!g.current || reduced) return;
    g.current.position.x = THREE.MathUtils.damp(g.current.position.x, -s.pointer.x * 0.28, 2, dt);
    g.current.position.y = THREE.MathUtils.damp(g.current.position.y, -s.pointer.y * 0.18, 2, dt);
  });
  const f = reduced ? 0 : 1;
  return (
    <group ref={g}>
      <Float speed={1.4 * f} floatIntensity={1.1} rotationIntensity={1.2}>
        <mesh position={[-2.75, 1.55, -0.6]} rotation={[0.4, 0, 0.7]} castShadow>
          <capsuleGeometry args={[0.13, 0.46, 8, 24]} />
          <meshStandardMaterial color={COLORS.lime} roughness={0.32} metalness={0.05} />
        </mesh>
      </Float>
      <Float speed={1.1 * f} floatIntensity={1.4} rotationIntensity={0.4}>
        <mesh position={[2.65, 1.75, -1.2]} castShadow>
          <sphereGeometry args={[0.21, 32, 32]} />
          <meshStandardMaterial color={COLORS.chrome} metalness={1} roughness={0.05} />
        </mesh>
      </Float>
      <Float speed={1.7 * f} floatIntensity={1} rotationIntensity={1.6}>
        <mesh position={[2.55, -1.5, 0.7]} rotation={[1.1, 0.3, 0]} castShadow>
          <torusGeometry args={[0.2, 0.075, 20, 48]} />
          <meshStandardMaterial color={COLORS.sky} roughness={0.3} metalness={0.2} />
        </mesh>
      </Float>
      <Float speed={1.3 * f} floatIntensity={1.2} rotationIntensity={1.4}>
        <RoundedBox args={[0.34, 0.34, 0.34]} radius={0.07} smoothness={4} position={[-2.5, -1.35, 0.9]} rotation={[0.5, 0.6, 0.2]} castShadow>
          <meshStandardMaterial color={COLORS.ink} roughness={0.18} metalness={0.7} />
        </RoundedBox>
      </Float>
    </group>
  );
}

function Sculpture({ reduced, onAligned }: { reduced: boolean; onAligned?: (aligned: boolean) => void }) {
  const rig = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const { viewport, size } = useThree();
  const [hovered, setHovered] = useState(false);
  const [aligned, setAligned] = useState(false);
  const speed = useRef<number>(1);
  const alignedRef = useRef(false);
  const drag = useRef({ active: false, x: 0, y: 0, rx: 0, ry: 0, moved: 0 });

  const wide = size.width >= 1024;
  const scale = wide ? Math.min(0.86, viewport.height / 6) : Math.min(0.72, viewport.width / 5.6);
  const pos: [number, number, number] = wide ? [viewport.width * 0.21, 0.5, 0] : [0, viewport.height * 0.17, 0];

  // Cursor label for the custom cursor (see components/layout/Cursor.tsx).
  useEffect(() => {
    const root = document.documentElement;
    if (hovered) root.dataset.cursor = aligned ? "Release" : "Drag / Click";
    else delete root.dataset.cursor;
    return () => {
      delete root.dataset.cursor;
    };
  }, [hovered, aligned]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.active) return;
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      d.x = e.clientX;
      d.y = e.clientY;
      d.moved += Math.abs(dx) + Math.abs(dy);
      d.ry += dx * 0.009;
      d.rx += dy * 0.009;
    };
    const up = () => {
      const d = drag.current;
      if (!d.active) return;
      d.active = false;
      if (d.moved < 6) {
        alignedRef.current = !alignedRef.current;
        setAligned(alignedRef.current);
        onAligned?.(alignedRef.current);
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [onAligned]);

  const down = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    drag.current = { ...drag.current, active: true, x: e.clientX, y: e.clientY, moved: 0 };
  };

  useFrame((s, dt) => {
    const d = drag.current;
    speed.current = THREE.MathUtils.damp(speed.current, (hovered ? 3 : 1) * (reduced ? 0.15 : 1), 3, dt);
    // dragging adds rotation, which then eases back to rest
    if (!d.active) {
      d.rx = THREE.MathUtils.damp(d.rx, 0, 1.6, dt);
      d.ry = THREE.MathUtils.damp(d.ry, 0, 1.6, dt);
    }
    const px = reduced ? 0 : s.pointer.x;
    const py = reduced ? 0 : s.pointer.y;
    if (tilt.current) {
      tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, -py * 0.28 + d.rx, 4, dt);
      tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, px * 0.42 + d.ry, 4, dt);
    }
    if (rig.current) {
      // entrance: grow in once, then stay at the responsive scale
      rig.current.scale.setScalar(THREE.MathUtils.damp(rig.current.scale.x, scale, 3.2, dt));
      rig.current.position.y = pos[1] + (reduced ? 0 : Math.sin(s.clock.elapsedTime * 0.7) * 0.06);
    }
  });

  return (
    <group ref={rig} position={pos} scale={0.55}>
      <group ref={tilt}>
        <Core speed={speed} hovered={hovered} />
        {RINGS.map((cfg, i) => (
          <Ring key={i} cfg={cfg} index={i} aligned={aligned} speed={speed} />
        ))}
        {/* invisible grab volume */}
        <mesh
          onPointerDown={down}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[2.05, 24, 24]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
      <Floaters reduced={reduced} />
      <ContactShadows position={[0, -2.55, 0]} scale={9} blur={2.8} opacity={0.34} far={5.5} resolution={256} color="#1b1e22" />
    </group>
  );
}

export default function HeroScene({
  active,
  reduced = false,
  eventSource,
  onAligned,
}: {
  active: boolean;
  reduced?: boolean;
  eventSource?: React.RefObject<HTMLElement | null>;
  onAligned?: (aligned: boolean) => void;
}) {
  return (
    <SceneCanvas
      active={active}
      eventSource={eventSource as React.RefObject<HTMLElement>}
      eventPrefix="client"
      camera={{ position: [0, 0, 8.5], fov: 35 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <Sculpture reduced={reduced} onAligned={onAligned} />
      <Studio />
    </SceneCanvas>
  );
}
