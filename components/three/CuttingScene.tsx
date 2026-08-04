"use client";

/* eslint-disable react-hooks/immutability -- Kıvılcım parçacıklarının tamponları
   (positions/velocities/life) performans için her karede yerinde güncellenir.
   Bu, React Three Fiber'da standart ve bilinçli bir imperatif desendir. */

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

// Bir kıvılcım parçacığını başlangıç konumuna/hızına sıfırlar.
// Kıvılcımlar temas noktasından yukarı + dışa fışkırır, yerçekimiyle geri düşer.
function respawn(
  i: number,
  positions: Float32Array,
  velocities: Float32Array,
  life: Float32Array,
  initial: boolean
) {
  const emitterY = -1.35;
  positions[i * 3] = (Math.random() - 0.5) * 0.12;
  positions[i * 3 + 1] = emitterY;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 0.12;

  const ang = Math.random() * Math.PI * 2;
  const spd = 1.4 + Math.random() * 2.6;
  velocities[i * 3] = Math.cos(ang) * spd * 0.7;
  velocities[i * 3 + 1] = 1.6 + Math.random() * 2.8;
  velocities[i * 3 + 2] = Math.sin(ang) * spd * 0.7;

  life[i] = initial ? Math.random() * 0.6 : 0.35 + Math.random() * 0.55;
}

function Sparks() {
  const COUNT = 280;
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities, life } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    const life = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) respawn(i, positions, velocities, life, true);
    return { positions, velocities, life };
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    for (let i = 0; i < COUNT; i++) {
      life[i] -= dt;
      if (life[i] <= 0) {
        respawn(i, positions, velocities, life, false);
        continue;
      }
      velocities[i * 3 + 1] -= 5 * dt; // yerçekimi
      positions[i * 3] += velocities[i * 3] * dt;
      positions[i * 3 + 1] += velocities[i * 3 + 1] * dt;
      positions[i * 3 + 2] += velocities[i * 3 + 2] * dt;
    }
    const geo = pointsRef.current?.geometry;
    if (geo) {
      (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffcf6a"
        size={0.08}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Drill() {
  const ref = useRef<THREE.Group>(null);

  // Gövdenin etrafına sarılan spiral oluk (helis eğrisi boyunca ince boru)
  const spiral = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const turns = 6;
    const height = 2.4;
    const radius = 0.34;
    for (let i = 0; i <= 120; i++) {
      const t = i / 120;
      const a = t * turns * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(a) * radius,
          height / 2 - t * height,
          Math.sin(a) * radius
        )
      );
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 240, 0.08, 10, false);
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 7; // hızlı döner (spiral kesim)
      ref.current.position.y = 0.25 + Math.sin(state.clock.elapsedTime * 9) * 0.04; // titreşim
    }
  });

  return (
    <group ref={ref} position={[0, 0.25, 0]}>
      <mesh>
        <cylinderGeometry args={[0.28, 0.28, 2.4, 32]} />
        <meshStandardMaterial color="#aeb6c2" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh geometry={spiral}>
        <meshStandardMaterial color="#5b6472" metalness={0.85} roughness={0.4} />
      </mesh>
      <mesh position={[0, -1.45, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.28, 0.55, 32]} />
        <meshStandardMaterial color="#c7ccd6" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Plate() {
  return (
    <mesh position={[0, -1.78, 0]}>
      <boxGeometry args={[3, 0.3, 3]} />
      <meshStandardMaterial color="#39414f" metalness={0.7} roughness={0.5} />
    </mesh>
  );
}

// Kendi içinde tam bir 3D sahne (Canvas dahil). Hem açılış ekranı hem
// sayfa geçişleri bu bileşeni kullanır.
export function CuttingScene() {
  return (
    <Canvas camera={{ position: [3.2, 1.3, 3.8], fov: 45 }} dpr={[1, 1.75]}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 3]} intensity={1.3} />
      {/* Temas noktasında sıcak amber ışık */}
      <pointLight position={[0, -1.3, 0]} intensity={12} distance={5} color="#ffb347" />

      <Drill />
      <Plate />
      <Sparks />

      <Environment resolution={128}>
        <Lightformer intensity={1.6} position={[0, 3, 3]} scale={[6, 6, 1]} color="#cfe9ff" />
        <Lightformer intensity={1.4} position={[-4, 1, 2]} scale={[3, 4, 1]} color="#22d3ee" />
      </Environment>
    </Canvas>
  );
}
