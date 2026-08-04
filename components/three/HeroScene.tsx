"use client";

import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  ContactShadows,
  OrbitControls,
} from "@react-three/drei";
import { MechParts } from "./MechParts";

// 3D sahne: mekanik parçalar (dişli + flanş + somun) + ışıklar + yansımalar + gölge.
// Environment içindeki Lightformer'lar, internetten dosya indirmeden
// metalik yüzey için stüdyo yansımaları üretir (hızlı + güvenli).
export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 7.5], fov: 42 }} dpr={[1, 2]}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 5, 3]} intensity={1.4} />

      <MechParts />

      <ContactShadows
        position={[0, -2.4, 0]}
        opacity={0.4}
        scale={14}
        blur={2.8}
        far={5}
      />

      {/* Monokrom stüdyo: nötr beyaz/gri ışıklar (renksiz, asil) */}
      <Environment resolution={256}>
        <Lightformer
          intensity={2.2}
          position={[0, 3, 4]}
          scale={[8, 8, 1]}
          color="#ffffff"
        />
        <Lightformer
          intensity={2}
          position={[-5, 1, 2]}
          scale={[4, 6, 1]}
          color="#c9ced6"
        />
        <Lightformer
          intensity={1.6}
          position={[5, -2, 2]}
          scale={[4, 5, 1]}
          color="#9aa0aa"
        />
      </Environment>

      {/* Kullanıcı fareyle döndürebilir; zoom ve kaydırma kapalı */}
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
