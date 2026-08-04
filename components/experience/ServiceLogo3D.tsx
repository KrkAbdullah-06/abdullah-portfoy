"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

// Siteye özel "AK" monogram logosu — 3D metalik kirişlerden kurulu ligatür
// (A ve K ortak dikey gövdeyi paylaşır) + hassasiyet halkası. Her hizmete
// geçince döner + kısa titreşim (robotik his), hizmete özel renkli ışık,
// fareye hafif tepki. frameloop=always (güvenilir).

const STEEL = { color: "#cbd2dc", metalness: 0.92, roughness: 0.22, envMapIntensity: 1.5 };

function Beam({ a, b, w = 0.26, depth = 0.34 }: { a: [number, number]; b: [number, number]; w?: number; depth?: number }) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  return (
    <mesh position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0]} rotation={[0, 0, angle]}>
      <boxGeometry args={[len + w * 0.4, w, depth]} />
      <meshStandardMaterial {...STEEL} />
    </mesh>
  );
}

function Logo({ active, color }: { active: number; color: string }) {
  const grp = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const target = useRef(new THREE.Color(color));
  const prev = useRef(active);
  const pulse = useRef(0);

  useFrame((state, d) => {
    target.current.set(color);
    if (prev.current !== active) {
      pulse.current = 1;
      prev.current = active;
    }
    pulse.current *= 0.9;
    const p = state.pointer;
    const t = state.clock.elapsedTime;
    if (grp.current) {
      const ty = active * 0.9 + p.x * 0.4;
      const tx = -0.15 - p.y * 0.3 + Math.sin(t * 0.6) * 0.05;
      grp.current.rotation.y += (ty - grp.current.rotation.y) * 0.08;
      grp.current.rotation.x += (tx - grp.current.rotation.x) * 0.08;
      grp.current.rotation.z = pulse.current * 0.3 * Math.sin(t * 22);
      grp.current.scale.setScalar(0.9 * (1 + pulse.current * 0.08));
    }
    if (ring.current) ring.current.rotation.z += d * 0.4;
    if (light.current) light.current.color.lerp(target.current, 0.06);
  });

  return (
    <group ref={grp} rotation={[-0.15, 0, 0]}>
      {/* ortak dikey gövde (A'nın sağ bacağı = K'nın gövdesi) */}
      <Beam a={[0, -1.5]} b={[0, 1.5]} w={0.3} />
      {/* A — sol bacak + kiriş */}
      <Beam a={[-1.35, -1.5]} b={[0, 1.5]} />
      <Beam a={[-0.68, -0.05]} b={[0, -0.05]} w={0.24} />
      {/* K — üst ve alt kol */}
      <Beam a={[0, 0.05]} b={[1.3, 1.5]} />
      <Beam a={[0, -0.05]} b={[1.3, -1.5]} />
      {/* hassasiyet halkası */}
      <mesh ref={ring} position={[0, 0, -0.3]}>
        <torusGeometry args={[2.15, 0.045, 16, 80]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      <pointLight ref={light} position={[3, 2, 4]} intensity={30} distance={20} color={color} />
    </group>
  );
}

export function ServiceLogo3D({ active, color }: { active: number; color: string }) {
  return (
    <Canvas frameloop="always" camera={{ position: [0, 0, 7], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 5]} intensity={1.15} />
      <Logo active={active} color={color} />
      <Environment resolution={192}>
        <Lightformer intensity={2.3} position={[0, 4, 4]} scale={[10, 10, 1]} color="#ffffff" />
        <Lightformer intensity={1.4} position={[-6, 1, 3]} scale={[6, 10, 1]} color="#c9ced6" />
        <Lightformer intensity={1.1} position={[6, -2, 3]} scale={[6, 8, 1]} color="#ffffff" />
      </Environment>
    </Canvas>
  );
}
