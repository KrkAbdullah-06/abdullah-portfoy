"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

// Sayfa geçişi ortasındaki 3D "AK" monogram logosu — metalik, yavaşça döner,
// hassasiyet halkası ters yönde döner. Şeffaf zemin (arkadaki blur görünür).
const STEEL = { color: "#cfd3d9", metalness: 0.9, roughness: 0.22, envMapIntensity: 1.5 };

function Beam({ a, b, w = 0.28, depth = 0.36 }: { a: [number, number]; b: [number, number]; w?: number; depth?: number }) {
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

function Logo({ active }: { active: boolean }) {
  const g = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const start = useRef(0);
  const was = useRef(false);
  useFrame((state, d) => {
    // Geçiş başladığında: öne bak (rotation sıfır), zamanı sıfırla
    if (active && !was.current) {
      start.current = state.clock.elapsedTime;
      if (g.current) g.current.rotation.set(0, 0, 0);
    }
    was.current = active;
    const since = state.clock.elapsedTime - start.current;
    if (g.current) {
      // ilk ~0.5sn ÖNE bakar, sonra yumuşakça DÖNER
      const spin = Math.max(0, since - 0.5);
      g.current.rotation.y = spin * 1.1;
      g.current.rotation.x = -0.1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
    if (ring.current) ring.current.rotation.z -= d * 0.5;
  });
  return (
    <group ref={g} scale={0.9}>
      <Beam a={[0, -1.5]} b={[0, 1.5]} w={0.32} />
      <Beam a={[-1.35, -1.5]} b={[0, 1.5]} />
      <Beam a={[-0.68, -0.05]} b={[0, -0.05]} w={0.26} />
      <Beam a={[0, 0.05]} b={[1.3, 1.5]} />
      <Beam a={[0, -0.05]} b={[1.3, -1.5]} />
      <mesh ref={ring} position={[0, 0, -0.3]}>
        <torusGeometry args={[2.15, 0.05, 16, 80]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
    </group>
  );
}

export function TransitionLogo3D({ active = true }: { active?: boolean }) {
  return (
    <Canvas frameloop={active ? "always" : "never"} camera={{ position: [0, 0, 7], fov: 42 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} />
      <Logo active={active} />
      <Environment resolution={64}>
        <Lightformer intensity={2.2} position={[0, 4, 4]} scale={[10, 10, 1]} color="#ffffff" />
        <Lightformer intensity={1.3} position={[-6, 1, 3]} scale={[6, 10, 1]} color="#c9ced6" />
      </Environment>
    </Canvas>
  );
}
