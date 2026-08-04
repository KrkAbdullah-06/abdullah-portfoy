"use client";

import { useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { createGearGeometry } from "@/components/three/geometries";

// Her hizmete AYRI metalik 3D + hizmete özel renk vurgusu. Reliable (frameloop=always).
const STEEL = { color: "#cbd2dc", metalness: 0.92, roughness: 0.24, envMapIntensity: 1.4 };
const HALF = Math.PI / 2;

function GearMesh({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => createGearGeometry(), []);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.z += d * speed;
  });
  return (
    <mesh ref={ref} geometry={geo} position={position} scale={scale}>
      <meshStandardMaterial {...STEEL} />
    </mesh>
  );
}

function Spin({ children, speed = 0.4, tilt = -0.2 }: { children: ReactNode; speed?: number; tilt?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * speed;
  });
  return (
    <group ref={ref} rotation={[tilt, 0, 0]}>
      {children}
    </group>
  );
}

function Model({ variant }: { variant: number }) {
  // 0 — Mekanik: dişli treni
  if (variant === 0)
    return (
      <group rotation={[-0.35, 0, 0]}>
        <GearMesh position={[0, 0, 0]} scale={1.1} speed={0.35} />
        <GearMesh position={[2.3, 1.4, -0.3]} scale={0.55} speed={-0.55} />
        <GearMesh position={[-2.1, -1.3, -0.3]} scale={0.48} speed={-0.62} />
      </group>
    );
  // 1 — CNC: matkap ucu (mil + koni + bilezik)
  if (variant === 1)
    return (
      <Spin speed={0.6} tilt={0.1}>
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 1.7, 32]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
        <mesh position={[0, -0.75, 0]}>
          <coneGeometry args={[0.32, 1.2, 32]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <torusGeometry args={[0.44, 0.1, 16, 32]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
      </Spin>
    );
  // 2 — Video: kamera (gövde + lens + halka + vizör)
  if (variant === 2)
    return (
      <Spin speed={0.45}>
        <mesh>
          <boxGeometry args={[1.6, 1.15, 1.0]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
        <mesh position={[0, 0, 0.85]} rotation={[HALF, 0, 0]}>
          <cylinderGeometry args={[0.44, 0.44, 0.65, 32]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
        <mesh position={[0, 0, 1.2]}>
          <torusGeometry args={[0.46, 0.07, 16, 32]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
        <mesh position={[0, 0.78, -0.05]}>
          <boxGeometry args={[0.55, 0.38, 0.55]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
      </Spin>
    );
  // 3 — Sosyal: ağ (merkez + düğümler)
  if (variant === 3) {
    const nodes: [number, number, number][] = [
      [1.7, 0.6, 0], [-1.6, 0.9, 0.3], [0.4, -1.7, 0.2], [1.4, -1.0, -0.4], [-1.3, -0.5, 0.5],
    ];
    return (
      <Spin speed={0.5}>
        <mesh>
          <icosahedronGeometry args={[0.95, 0]} />
          <meshStandardMaterial {...STEEL} flatShading />
        </mesh>
        {nodes.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.24, 20, 20]} />
            <meshStandardMaterial {...STEEL} />
          </mesh>
        ))}
      </Spin>
    );
  }
  // 4 — Web: örgü düğüm (kod/akış hissi)
  return (
    <Spin speed={0.45}>
      <mesh>
        <torusKnotGeometry args={[0.88, 0.3, 160, 24]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
    </Spin>
  );
}

export function ServiceGear({ variant = 0, color = "#e0a94a" }: { variant?: number; color?: string }) {
  return (
    <Canvas frameloop="always" camera={{ position: [0, 0, 7], fov: 42 }} dpr={[1, 1.75]}>
      <color attach="background" args={["#0c0d0f"]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} />
      {/* hizmete özel renk vurgusu */}
      <pointLight position={[3, 2, 4]} intensity={45} distance={22} color={color} />
      <Model variant={variant} />
      <Environment resolution={192}>
        <Lightformer intensity={2} position={[0, 4, 5]} scale={[10, 10, 1]} color="#ffffff" />
        <Lightformer intensity={1.3} position={[-6, 1, 3]} scale={[5, 8, 1]} color="#c9ced6" />
      </Environment>
    </Canvas>
  );
}
