"use client";

import { Suspense, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// 5 durak, x ekseninde GAP aralıkla dizili. Model sağda, yazı solda durur.
const STATIONS = [
  { url: "/models/engine.glb", size: 4.8, y: 0.2 }, // 3D & Mekanik
  { url: "/models/cnc.glb", size: 5.0, y: 0.0 }, // CNC
  { url: "/models/camera.glb", size: 20.0, y: 0.0 }, // Video (bu modelde ölçek farklı)
  { url: "/models/phone.glb", size: 4.6, y: 0.2 }, // Sosyal
  { url: "/models/laptop.glb", size: 4.8, y: 0.0 }, // Web
];
const GAP = 12;
const N = STATIONS.length;
const MODEL_OFFSET_X = 2.8; // model kameranın sağında dursun (yazıya yer aç)
const stationX = (i: number) => i * GAP;

// Her durağın kendi ambiyansı: arka plan rengi + vurgu ışığı rengi
const BG_COLORS = ["#0b1220", "#17110a", "#0a0e15", "#120a1c", "#08140f"].map(
  (c) => new THREE.Color(c)
);
const LIGHT_COLORS = ["#22d3ee", "#e8a63c", "#7cc4ff", "#a855f7", "#34d399"].map(
  (c) => new THREE.Color(c)
);

const lerp = THREE.MathUtils.lerp;
const smooth = THREE.MathUtils.smoothstep;

const tmpPos = new THREE.Vector3();
const tmpTarget = new THREE.Vector3();
const tmpColor = new THREE.Color();

// Kamera + ambiyans: kamera düz ilerler, duraklarda uzun bekler; arka plan/ışık
// rengi aktif durağa göre yumuşakça değişir.
function Rig({
  progress,
  lightRef,
}: {
  progress: RefObject<number>;
  lightRef: RefObject<THREE.PointLight | null>;
}) {
  useFrame((state) => {
    const p = progress.current ?? 0;
    const seg = p * (N - 1);
    const i = Math.min(N - 2, Math.max(0, Math.floor(seg)));
    const frac = seg - i;

    // Durakta uzun bekle, sadece 0.42–0.62 arası geç (yol uzun hissi)
    const tp = smooth(frac, 0.42, 0.62);
    const x = lerp(stationX(i), stationX(i + 1), tp);
    tmpPos.set(x, 1.0, 7);
    tmpTarget.set(x, 0, 0);
    state.camera.position.lerp(tmpPos, 0.09);
    state.camera.lookAt(tmpTarget);

    // Ambiyans (arka plan + sis + ışık rengi)
    tmpColor.lerpColors(BG_COLORS[i], BG_COLORS[i + 1], frac);
    if (state.scene.background instanceof THREE.Color) {
      state.scene.background.copy(tmpColor);
    }
    if (state.scene.fog) state.scene.fog.color.copy(tmpColor);

    if (lightRef.current) {
      lightRef.current.position.set(x + 3, 3, 5);
      lightRef.current.color.lerpColors(LIGHT_COLORS[i], LIGHT_COLORS[i + 1], frac);
    }
  });
  return null;
}

// Gerçek .glb modelini yükler, parçalarını düzleştirir ve scroll'a göre patlatır/birleştirir.
function ExplodingModel({
  url,
  position,
  targetSize,
  progress,
  explode,
}: {
  url: string;
  position: [number, number, number];
  targetSize: number;
  progress: RefObject<number>;
  explode: (p: number) => number;
}) {
  const { scene } = useGLTF(url);
  const grpRef = useRef<THREE.Group>(null);

  const data = useMemo(() => {
    const src = scene.clone(true);
    src.updateMatrixWorld(true);

    const meshes: THREE.Object3D[] = [];
    src.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) meshes.push(o);
    });
    const container = new THREE.Group();
    meshes.forEach((m) => container.attach(m));

    const box = new THREE.Box3().setFromObject(container);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    meshes.forEach((m) => m.position.sub(center));

    const parts = meshes.map((m, i) => {
      const dir = m.position.clone();
      if (dir.lengthSq() < 1e-5) {
        dir.set(Math.sin(i * 12.9), Math.cos(i * 7.3), Math.sin(i * 3.7));
      }
      dir.y *= 0.5;
      dir.normalize();
      return { mesh: m, base: m.position.clone(), dir };
    });

    return { container, parts, fit: targetSize / maxDim, spread: maxDim * 1.0 };
  }, [scene, targetSize]);

  useFrame((_, d) => {
    const e = explode(progress.current ?? 0);
    for (const pt of data.parts) {
      pt.mesh.position.copy(pt.base).addScaledVector(pt.dir, e * data.spread);
    }
    if (grpRef.current) grpRef.current.rotation.y += d * 0.12;
  });

  return (
    <group ref={grpRef} position={position} scale={data.fit}>
      <primitive object={data.container} />
    </group>
  );
}

export function JourneyScene({ progress }: { progress: RefObject<number> }) {
  const w = 1 / (N - 1);
  const lightRef = useRef<THREE.PointLight | null>(null);

  return (
    <Canvas frameloop="always" camera={{ position: [0, 1.0, 7], fov: 45 }} dpr={[1, 1.75]}>
      <color attach="background" args={["#0b1220"]} />
      <fog attach="fog" args={["#0b1220", 12, 48]} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 8, 4]} intensity={1.5} />
      <pointLight ref={lightRef} intensity={40} distance={18} color="#22d3ee" />

      <Rig progress={progress} lightRef={lightRef} />

      <Suspense fallback={null}>
        {STATIONS.map((s, i) => {
          const c = i / (N - 1);
          return (
            <ExplodingModel
              key={s.url}
              url={s.url}
              position={[stationX(i) + MODEL_OFFSET_X, s.y, 0]}
              targetSize={s.size}
              progress={progress}
              explode={(p) => smooth(Math.abs(p - c) / w, 0.1, 0.5)}
            />
          );
        })}
      </Suspense>

      <ContactShadows
        position={[stationX(N - 1) / 2 + MODEL_OFFSET_X, -2.05, 0]}
        opacity={0.3}
        scale={120}
        blur={2.8}
        far={6}
      />

      <Environment resolution={192}>
        <Lightformer intensity={1.6} position={[0, 4, 4]} scale={[12, 12, 1]} color="#e8eefc" />
        <Lightformer intensity={1.3} position={[-6, 1, 2]} scale={[5, 6, 1]} color="#9fd8ff" />
        <Lightformer intensity={1.2} position={[8, -1, 3]} scale={[6, 6, 1]} color="#ffd9a0" />
      </Environment>
    </Canvas>
  );
}

STATIONS.forEach((s) => useGLTF.preload(s.url));
