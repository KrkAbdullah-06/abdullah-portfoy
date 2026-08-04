"use client";

import { useEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

// Hakkımda panelindeki 3D "AK" ligatür logosu — metalik ince kirişler. Yavaşça
// döner. YENİ: `build` (0..1) ilerlemesiyle kirişler SIRAYLA büyüyerek oluşur
// (kod yazıldıkça logo adım adım "montajlanır"). Şeffaf zemin.
const STEEL = { color: "#e2e6ea", metalness: 0.85, roughness: 0.22, envMapIntensity: 1.6 };

// Kirişler oluşma SIRASINA göre (AK ligatürü): dikey gövde → A eğik → A kol →
// K üst → K alt → (en son) halka.
const BEAMS: { a: [number, number]; b: [number, number]; w: number }[] = [
  { a: [0, -3.1], b: [0, 3.1], w: 0.36 },
  { a: [-2.3, -3.1], b: [0, 3.1], w: 0.32 },
  { a: [-1.4, -0.5], b: [0, -0.5], w: 0.28 },
  { a: [0, 0.1], b: [2.4, 3.0], w: 0.32 },
  { a: [0, 0.1], b: [2.4, -3.1], w: 0.32 },
];
const PARTS = BEAMS.length + 1; // + halka
const STEP = 1 / PARTS;

function Logo({ build }: { build?: RefObject<number> }) {
  const g = useRef<THREE.Group>(null);
  const beams = useRef<(THREE.Mesh | null)[]>([]);
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state, d) => {
    if (g.current) {
      g.current.rotation.y += d * 0.55;
      g.current.rotation.x = -0.12 + Math.sin(state.clock.elapsedTime * 0.5) * 0.12;
    }
    const b = build ? build.current ?? 1 : 1;
    // kirişler sırayla uzunlukları boyunca büyür (çizilir gibi)
    for (let i = 0; i < beams.current.length; i++) {
      const m = beams.current[i];
      if (!m) continue;
      const t = Math.min(1, Math.max(0, (b - i * STEP) / STEP));
      m.scale.x = t < 0.001 ? 0.0001 : t;
      m.visible = t > 0.001;
    }
    if (ring.current) {
      const t = Math.min(1, Math.max(0, (b - BEAMS.length * STEP) / STEP));
      ring.current.scale.setScalar(t < 0.001 ? 0.0001 : t);
      ring.current.visible = t > 0.001;
    }
  });

  return (
    <group ref={g} scale={0.68}>
      {BEAMS.map((bm, i) => {
        const len = Math.hypot(bm.b[0] - bm.a[0], bm.b[1] - bm.a[1]);
        const angle = Math.atan2(bm.b[1] - bm.a[1], bm.b[0] - bm.a[0]);
        return (
          <mesh
            key={i}
            ref={(el) => {
              beams.current[i] = el;
            }}
            position={[(bm.a[0] + bm.b[0]) / 2, (bm.a[1] + bm.b[1]) / 2, 0]}
            rotation={[0, 0, angle]}
            scale={[0.0001, 1, 1]}
          >
            <boxGeometry args={[len + bm.w * 0.5, bm.w, 0.34]} />
            <meshStandardMaterial {...STEEL} />
          </mesh>
        );
      })}
      <mesh ref={ring} scale={[0.0001, 0.0001, 0.0001]}>
        <torusGeometry args={[4.5, 0.09, 16, 96]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
    </group>
  );
}

// Mobilde kareyi ~24fps'e sabitler (frameloop="demand" + invalidate) — Hakkımda
// yazısı yazılırken (uzun bio, ~15-20sn) React re-render'ı ile AYNI ana iş
// parçacığını paylaşıyordu, 60fps WebGL render'ı buna ek yük bindiriyordu
// ("yazı yazılırken kaydıramıyorum" şikayetinin ikinci kaynağı). BackgroundStage'
// teki çark için zaten kanıtlanmış aynı teknik. Masaüstü AYNEN 60fps kalır.
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
// build → kirişlerin oluşma ilerlemesi (0..1); verilmezse logo tam kurulu görünür.
export function LogoSpin3D({ active = true, mobile = false, build }: { active?: boolean; mobile?: boolean; build?: RefObject<number> }) {
  return (
    <Canvas frameloop={active ? (mobile ? "demand" : "always") : "never"} camera={{ position: [0, 0, 10.5], fov: 42 }} dpr={mobile ? [1, 2] : [1, 1.75]} gl={{ antialias: true, powerPreference: "low-power" }}>
      {active && mobile && <FpsCap fps={24} />}
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} />
      <Logo build={build} />
      <Environment resolution={mobile ? 64 : 128}>
        <Lightformer intensity={2.2} position={[0, 4, 4]} scale={[10, 10, 1]} color="#ffffff" />
        <Lightformer intensity={1.3} position={[-6, 1, 3]} scale={[6, 10, 1]} color="#c9ced6" />
        <Lightformer intensity={1.1} position={[6, -2, 3]} scale={[6, 8, 1]} color="#ffffff" />
      </Environment>
    </Canvas>
  );
}
