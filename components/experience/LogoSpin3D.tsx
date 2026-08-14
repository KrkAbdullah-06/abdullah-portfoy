"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Hakkımda panelindeki 3D logo — "ağ küresi" (jeodezik wireframe globe): site
// logosundaki DÜNYA öğesiyle uyumlu, web/global temayı temsil eder. Arka planda
// zaten hareketli çark olduğundan burada ÇARK KULLANILMAZ. Yavaşça döner; `build`
// (0..1) ilerlemesiyle küçükten büyüyerek "oluşur" (kod yazıldıkça montajlanır).
// Şeffaf zemin. Çizgi/nokta malzemeleri ışıksızdır → ışık/Environment gerekmez
// (mobilde ekstra GPU yükü yok).
const LINE = "#cfd4da";
const NODE = "#ffffff";

function NetworkGlobe({ mobile = false, build }: { mobile?: boolean; build?: RefObject<number> }) {
  const g = useRef<THREE.Group>(null);
  const { edges, nodes } = useMemo(() => {
    const base = new THREE.IcosahedronGeometry(2, mobile ? 1 : 2);
    return { edges: new THREE.WireframeGeometry(base), nodes: base };
  }, [mobile]);

  useFrame((_, d) => {
    if (!g.current) return;
    g.current.rotation.y += d * 0.4;
    const b = build ? build.current ?? 1 : 1;
    g.current.scale.setScalar(1.35 * Math.max(0.0001, b)); // kod yazıldıkça büyüyerek oluşur
    g.current.visible = b > 0.001;
  });

  return (
    <group ref={g} rotation={[0.3, 0, 0.12]}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={LINE} transparent opacity={0.85} />
      </lineSegments>
      <points geometry={nodes}>
        <pointsMaterial color={NODE} size={mobile ? 0.11 : 0.09} sizeAttenuation transparent opacity={0.95} />
      </points>
    </group>
  );
}

// Mobilde kareyi ~18fps'e sabitler (frameloop="demand" + invalidate) — Hakkımda
// yazısı yazılırken React re-render'ı ile ana iş parçacığını paylaşır; 60fps WebGL
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
// build → oluşma ilerlemesi (0..1); verilmezse tam kurulu görünür.
export function LogoSpin3D({ active = true, mobile = false, build }: { active?: boolean; mobile?: boolean; build?: RefObject<number> }) {
  return (
    <Canvas frameloop={active ? (mobile ? "demand" : "always") : "never"} camera={{ position: [0, 0, 9], fov: 42 }} dpr={mobile ? 1 : [1, 1.75]} gl={{ antialias: !mobile, powerPreference: "low-power" }}>
      {active && mobile && <FpsCap fps={18} />}
      <NetworkGlobe mobile={mobile} build={build} />
    </Canvas>
  );
}
