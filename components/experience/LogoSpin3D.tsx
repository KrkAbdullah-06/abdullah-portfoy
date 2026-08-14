"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { createGearGeometry } from "@/components/three/geometries";

// Hakkımda panelindeki 3D logo — metalik dişli (mühendislik teması, site logosunun
// dişli öğesiyle uyumlu). Yavaşça kendi ekseninde döner. `build` (0..1) ilerlemesiyle
// dişli küçükten büyüyerek "montajlanır" (kod yazıldıkça oluşur). Şeffaf zemin.
const STEEL = { color: "#e2e6ea", metalness: 0.88, roughness: 0.2, envMapIntensity: 1.7 };

function Gear({ mobile = false, build }: { mobile?: boolean; build?: RefObject<number> }) {
  const g = useRef<THREE.Group>(null);
  const geo = useMemo(() => createGearGeometry(mobile), [mobile]);

  useFrame((_, d) => {
    if (!g.current) return;
    g.current.rotation.z += d * 0.5; // aksı kameraya bakan dişli, kendi ekseninde döner
    const b = build ? build.current ?? 1 : 1;
    const s = 2.15 * Math.max(0.0001, b); // kod yazıldıkça büyüyerek oluşur
    g.current.scale.setScalar(s);
    g.current.visible = b > 0.001;
  });

  return (
    <group ref={g} rotation={[-0.32, 0.12, 0]}>
      <mesh geometry={geo}>
        <meshStandardMaterial {...STEEL} />
      </mesh>
    </group>
  );
}

// Mobilde kareyi ~18fps'e sabitler (frameloop="demand" + invalidate) — Hakkımda
// yazısı yazılırken React re-render'ı ile ana iş parçacığını paylaşır, 60fps WebGL
// buna ek yük bindirirdi. Masaüstü aynen 60fps kalır.
function FpsCap({ fps }: { fps: number }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let id = 0;
    let last = 0;
    const step = 1000 / fps;
    const loop = (t: number) => {
      if (t - last >= step) {
        last = t;
        invalidate();
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [fps, invalidate]);
  return null;
}

// active=false → frameloop durur (ekranda değilken GPU harcamaz).
// build → dişlinin oluşma ilerlemesi (0..1); verilmezse tam kurulu görünür.
export function LogoSpin3D({ active = true, mobile = false, build }: { active?: boolean; mobile?: boolean; build?: RefObject<number> }) {
  return (
    <Canvas frameloop={active ? (mobile ? "demand" : "always") : "never"} camera={{ position: [0, 0, 10.5], fov: 42 }} dpr={mobile ? 1 : [1, 1.75]} gl={{ antialias: !mobile, powerPreference: "low-power" }}>
      {active && mobile && <FpsCap fps={18} />}
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} />
      <Gear mobile={mobile} build={build} />
      <Environment resolution={mobile ? 64 : 128}>
        <Lightformer intensity={2.2} position={[0, 4, 4]} scale={[10, 10, 1]} color="#ffffff" />
        <Lightformer intensity={1.3} position={[-6, 1, 3]} scale={[6, 10, 1]} color="#c9ced6" />
        <Lightformer intensity={1.1} position={[6, -2, 3]} scale={[6, 8, 1]} color="#ffffff" />
      </Environment>
    </Canvas>
  );
}
