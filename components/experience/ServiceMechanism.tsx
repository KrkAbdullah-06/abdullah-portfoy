"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { createGearGeometry, createHexNutGeometry } from "@/components/three/geometries";

// Hizmetler bölümünün ÖNE ÇIKAN 3D'si: birbirine geçen büyük metalik çark grubu.
// Hafif (dpr düşük, parçacık yok, env 128) → akıcı scroll. Her hizmette hafif torku
// değişir + o hizmetin renginde ince rim ışığı. Fareye hafif parallaks tepki.

const STEEL = { color: "#c9cfd8", metalness: 0.95, roughness: 0.2, envMapIntensity: 1.6 };

function Gear({ geo, position, scale, speed }: { geo: THREE.BufferGeometry; position: [number, number, number]; scale: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.z += d * speed;
  });
  return (
    <mesh ref={ref} geometry={geo} position={position} scale={scale}>
      <meshStandardMaterial {...STEEL} />
    </mesh>
  );
}

function Rig({ color, spin }: { color: string; spin: number }) {
  const grp = useRef<THREE.Group>(null);
  const rim = useRef<THREE.PointLight>(null);
  const target = useRef(new THREE.Color(color));
  const gear = useMemo(() => createGearGeometry(), []);
  const nut = useMemo(() => createHexNutGeometry(), []);

  useFrame((state) => {
    target.current.set(color);
    const p = state.pointer;
    const t = state.clock.elapsedTime;
    if (grp.current) {
      const ty = -0.25 + p.x * 0.35;
      const tx = -0.12 - p.y * 0.25 + Math.sin(t * 0.4) * 0.05;
      grp.current.rotation.y += (ty - grp.current.rotation.y) * 0.05;
      grp.current.rotation.x += (tx - grp.current.rotation.x) * 0.05;
    }
    if (rim.current) rim.current.color.lerp(target.current, 0.05);
  });

  return (
    <group ref={grp} rotation={[-0.12, -0.25, 0]}>
      <Gear geo={gear} position={[0, 0, 0]} scale={1.5} speed={0.32 * spin} />
      <Gear geo={gear} position={[2.9, 1.6, -0.5]} scale={0.72} speed={-0.6 * spin} />
      <Gear geo={gear} position={[-2.6, -1.8, -0.7]} scale={0.62} speed={-0.68 * spin} />
      <mesh geometry={nut} position={[2.6, -2.0, 0.2]} scale={0.5} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial {...STEEL} />
      </mesh>
      <pointLight ref={rim} position={[4, 3, 4]} intensity={42} distance={26} color={color} />
    </group>
  );
}

export function ServiceMechanism({ color, spin = 1 }: { color: string; spin?: number }) {
  return (
    <Canvas frameloop="always" camera={{ position: [0, 0, 8], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 5]} intensity={1.2} />
      <Rig color={color} spin={spin} />
      <Environment resolution={128}>
        <Lightformer intensity={2.2} position={[0, 4, 5]} scale={[12, 12, 1]} color="#ffffff" />
        <Lightformer intensity={1.3} position={[-6, 1, 3]} scale={[6, 10, 1]} color="#c9ced6" />
        <Lightformer intensity={1.1} position={[6, -3, 3]} scale={[6, 8, 1]} color="#ffffff" />
      </Environment>
    </Canvas>
  );
}
