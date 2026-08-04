"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// Tek "sıvı metal (cıva)" obje: kaydırdıkça (aktif hizmet) şekil değiştirir,
// etrafında parçacıklar, fare/parmak hareketine tepki verir. Monokrom gövde +
// hizmete özel renkte ince ışık/parçacık vurgusu. frameloop=always (güvenilir).

type DistortMat = THREE.MeshPhysicalMaterial & { distort: number };

function Orb({ color, distort, speed }: { color: string; distort: number; speed: number }) {
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const pts = useRef<THREE.Points>(null);
  const target = useRef(new THREE.Color(color));

  const positions = useMemo(() => {
    // deterministik sözde-rastgele (render'da saf): sin tabanlı hash
    const hash = (seed: number) => {
      const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    };
    const N = 540;
    const a = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 2.3 + hash(i + 0.1) * 1.6;
      const th = hash(i + 0.3) * Math.PI * 2;
      const ph = Math.acos(2 * hash(i + 0.7) - 1);
      a[i * 3] = r * Math.sin(ph) * Math.cos(th);
      a[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      a[i * 3 + 2] = r * Math.cos(ph);
    }
    return a;
  }, []);

  useFrame((state, d) => {
    target.current.set(color);
    const p = state.pointer;
    if (tilt.current) {
      tilt.current.rotation.x += (-p.y * 0.35 - tilt.current.rotation.x) * 0.06;
      tilt.current.rotation.y += (p.x * 0.6 - tilt.current.rotation.y) * 0.06;
    }
    if (spin.current) {
      spin.current.rotation.y += d * 0.12;
      spin.current.rotation.z += d * 0.03;
    }
    const mat = mesh.current?.material as DistortMat | undefined;
    if (mat) mat.distort += (distort - mat.distort) * 0.04;
    if (light.current) light.current.color.lerp(target.current, 0.06);
    if (pts.current) (pts.current.material as THREE.PointsMaterial).color.lerp(target.current, 0.06);
  });

  return (
    <group ref={tilt}>
      <group ref={spin}>
        <mesh ref={mesh}>
          <sphereGeometry args={[1.55, 128, 128]} />
          <MeshDistortMaterial color="#cfd3d9" metalness={1} roughness={0.06} envMapIntensity={2.2} distort={0.35} speed={speed} radius={1} />
        </mesh>
        <points ref={pts}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <pointsMaterial size={0.035} sizeAttenuation transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} color={color} />
        </points>
      </group>
      <pointLight ref={light} position={[3, 2, 4]} intensity={32} distance={20} color={color} />
    </group>
  );
}

export function ServiceOrb({ color, distort, speed }: { color: string; distort: number; speed: number }) {
  return (
    <Canvas frameloop="always" camera={{ position: [0, 0, 6], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} />
      <Orb color={color} distort={distort} speed={speed} />
      <Environment resolution={192}>
        <Lightformer intensity={2.4} position={[0, 4, 4]} scale={[10, 10, 1]} color="#ffffff" />
        <Lightformer intensity={1.4} position={[-6, 0, 2]} scale={[6, 10, 1]} color="#c9ced6" />
        <Lightformer intensity={1.2} position={[6, -2, 2]} scale={[6, 8, 1]} color="#ffffff" />
      </Environment>
    </Canvas>
  );
}
