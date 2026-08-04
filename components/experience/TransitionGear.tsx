"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { createGearGeometry } from "@/components/three/geometries";

// Sayfa geçişi ortasındaki SİYAH 3D çark — beyaz overlay üstünde döner.
function BlackGear() {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => createGearGeometry(), []);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.z += d * 1.6;
  });
  return (
    <mesh ref={ref} geometry={geo} rotation={[0.5, 0, 0]} scale={1.5}>
      <meshStandardMaterial color="#0a0b0d" metalness={0.55} roughness={0.35} envMapIntensity={1.2} />
    </mesh>
  );
}

export function TransitionGear() {
  return (
    <Canvas frameloop="always" camera={{ position: [0, 0, 6], fov: 42 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 5]} intensity={1.5} />
      <BlackGear />
      <Environment resolution={64}>
        <Lightformer intensity={1.3} position={[0, 3, 4]} scale={[8, 8, 1]} color="#ffffff" />
        <Lightformer intensity={0.8} position={[-4, 0, 3]} scale={[5, 6, 1]} color="#dddddd" />
      </Environment>
    </Canvas>
  );
}
