"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import {
  createGearGeometry,
  createHexNutGeometry,
} from "@/components/three/geometries";

// AŞAMA 2: koddan tasarlanan DETAYLI premium modeller (yuvarlatılmış kenar, yansıma,
// çok parçalı montaj). Her hizmet ~11 parça, kendi rengi. Anında yüklenir, temiz akış.

const smooth = THREE.MathUtils.smoothstep;
const HALF = Math.PI / 2;
const baseDark = new THREE.Color("#0b0b0d");
const colA = new THREE.Color();
const colB = new THREE.Color();
const bgTmp = new THREE.Color();

type Part = {
  g: () => THREE.BufferGeometry;
  pos: [number, number, number];
  dir: [number, number, number];
  scale?: number;
  rot?: [number, number, number];
};

// r parametresi ileride yuvarlatma için tutuluyor; şu an düz kutu (runtime güvenli).
const rbox = (w: number, h: number, d: number, r = 0.06) => {
  void r;
  return () => new THREE.BoxGeometry(w, h, d);
};
const cyl = (rt: number, rb: number, h: number, s = 24) => () => new THREE.CylinderGeometry(rt, rb, h, s);
const cone = (r: number, h: number, s = 24) => () => new THREE.ConeGeometry(r, h, s);
const tor = (r: number, t: number, s = 28) => () => new THREE.TorusGeometry(r, t, 16, s);
const sph = (r: number) => () => new THREE.SphereGeometry(r, 24, 24);

type Service = { color: string; index: string; title: string; desc: string; parts: Part[] };

const SERVICES: Service[] = [
  {
    color: "#e0a94a", index: "01", title: "3D & Mekanik Tasarım",
    desc: "SolidWorks & AutoCAD ile hassas modelleme, montaj ve teknik resim.",
    parts: [
      { g: createGearGeometry, pos: [0, 0, 0], dir: [0, 0.5, 0], scale: 0.9 },
      { g: createGearGeometry, pos: [1.7, 0.6, 0.1], dir: [1.2, 0.8, 0], scale: 0.42 },
      { g: createGearGeometry, pos: [-1.5, -0.7, 0.15], dir: [-1.1, -0.9, 0], scale: 0.38 },
      { g: cyl(0.14, 0.14, 3.2), pos: [0, 0, 0], dir: [0, 0, 1.4], rot: [HALF, 0, 0] },
      { g: tor(0.55, 0.14), pos: [0, 0, 0.9], dir: [0, 0.6, 1.3] },
      { g: tor(0.55, 0.14), pos: [0, 0, -0.9], dir: [0, -0.6, -1.3] },
      { g: createHexNutGeometry, pos: [0, 0, 1.5], dir: [0.6, 1, 1.3], scale: 0.4 },
      { g: createHexNutGeometry, pos: [0, 0, -1.5], dir: [-0.6, -1, -1.3], scale: 0.4 },
      { g: cyl(0.09, 0.09, 0.8), pos: [1.2, -0.9, 0.3], dir: [1, -1.2, 0.4], rot: [0, 0, HALF] },
      { g: cyl(0.09, 0.09, 0.8), pos: [-1.1, 0.9, -0.3], dir: [-1, 1.2, -0.4], rot: [0, 0, HALF] },
      { g: tor(0.32, 0.07), pos: [1.7, 0.6, 0.3], dir: [1.3, 0.9, 0.6] },
    ],
  },
  {
    color: "#6fb7d9", index: "02", title: "CNC Üretim Hazırlığı",
    desc: "SolidCAM ile takım yolları ve üretime hazır dosyalar.",
    parts: [
      { g: rbox(2.8, 0.3, 1.8), pos: [0, -1, 0], dir: [0, -1.3, 0] },
      { g: rbox(0.25, 0.25, 1.8), pos: [-1.15, -0.75, 0], dir: [-1.3, -0.4, 0] },
      { g: rbox(0.25, 0.25, 1.8), pos: [1.15, -0.75, 0], dir: [1.3, -0.4, 0] },
      { g: rbox(2.8, 0.35, 0.4), pos: [0, 0.5, 0], dir: [0, 1.3, 0] },
      { g: rbox(0.7, 0.6, 0.6), pos: [0.2, 0.5, 0.25], dir: [0.6, 1, 0.5] },
      { g: cyl(0.16, 0.16, 0.8), pos: [0.2, 0.05, 0.25], dir: [0.4, 0.7, 0.4] },
      { g: cone(0.14, 0.35), pos: [0.2, -0.45, 0.25], dir: [0.5, -0.9, 0.4] },
      { g: cyl(0.22, 0.22, 0.5), pos: [-1.3, 0.5, 0], dir: [-1.3, 1.1, 0], rot: [0, 0, HALF] },
      { g: cyl(0.22, 0.22, 0.5), pos: [1.3, 0.5, 0], dir: [1.3, 1.1, 0], rot: [0, 0, HALF] },
      { g: rbox(0.9, 0.4, 0.7), pos: [0, -0.7, 0], dir: [0.2, -1.2, 0.6] },
      { g: rbox(2.2, 0.06, 0.12), pos: [0, -0.82, 0.4], dir: [0, -1.1, 0.9] },
    ],
  },
  {
    color: "#d98a5a", index: "03", title: "Video Prodüksiyon",
    desc: "Sinematik kurgu, renk ve ses düzenlemesi.",
    parts: [
      { g: rbox(1.4, 1.0, 0.9), pos: [0, 0, 0], dir: [-0.3, 0, -1.1] },
      { g: cyl(0.42, 0.42, 0.5), pos: [0, 0, 0.7], dir: [0, 0.2, 1.3], rot: [HALF, 0, 0] },
      { g: cyl(0.36, 0.36, 0.4), pos: [0, 0, 1.05], dir: [0, 0.1, 1.5], rot: [HALF, 0, 0] },
      { g: cyl(0.46, 0.4, 0.35), pos: [0, 0, 1.35], dir: [0, -0.2, 1.7], rot: [HALF, 0, 0] },
      { g: tor(0.44, 0.05), pos: [0, 0, 0.85], dir: [0, 0.7, 1.3] },
      { g: tor(0.38, 0.05), pos: [0, 0, 1.2], dir: [0, -0.6, 1.5] },
      { g: rbox(0.55, 0.28, 0.6), pos: [0, 0.65, 0], dir: [0.4, 1.2, 0] },
      { g: rbox(0.35, 0.35, 0.45), pos: [-0.55, 0.35, -0.2], dir: [-1, 1, -0.4] },
      { g: cyl(0.08, 0.08, 0.12), pos: [0.45, 0.5, 0.2], dir: [0.9, 1.1, 0.5], rot: [HALF, 0, 0] },
      { g: cyl(0.16, 0.16, 0.12), pos: [0.6, 0, 0.1], dir: [1.3, 0, 0.4], rot: [0, 0, HALF] },
      { g: rbox(0.35, 0.8, 0.55), pos: [-0.75, -0.15, 0], dir: [-1.3, -0.4, 0] },
    ],
  },
  {
    color: "#b58cd9", index: "04", title: "Sosyal Medya",
    desc: "Dikkat çeken içerik, reels ve büyüyen hesaplar.",
    parts: [
      { g: rbox(1.05, 2.0, 0.16, 0.12), pos: [0, 0, 0], dir: [0, 0, -0.9] },
      { g: rbox(0.9, 1.8, 0.05, 0.08), pos: [0, 0, 0.09], dir: [0, 0.3, 1.1] },
      { g: rbox(0.42, 0.42, 0.09, 0.08), pos: [-0.28, 0.72, -0.11], dir: [-0.6, 1.1, -0.7] },
      { g: cyl(0.08, 0.08, 0.06), pos: [-0.38, 0.8, -0.15], dir: [-0.7, 1.2, -0.8], rot: [HALF, 0, 0] },
      { g: cyl(0.08, 0.08, 0.06), pos: [-0.18, 0.8, -0.15], dir: [-0.5, 1.2, -0.8], rot: [HALF, 0, 0] },
      { g: cyl(0.08, 0.08, 0.06), pos: [-0.28, 0.62, -0.15], dir: [-0.6, 0.9, -0.8], rot: [HALF, 0, 0] },
      { g: rbox(0.06, 0.35, 0.1), pos: [0.53, 0.3, 0], dir: [1.2, 0.4, 0] },
      { g: rbox(0.06, 0.2, 0.1), pos: [-0.53, 0.4, 0], dir: [-1.2, 0.5, 0] },
      { g: rbox(0.5, 0.3, 0.08, 0.1), pos: [0.95, 0.7, 0.3], dir: [1.5, 0.9, 0.7] },
      { g: rbox(0.4, 0.26, 0.08, 0.1), pos: [-0.9, -0.6, 0.3], dir: [-1.4, -1, 0.7] },
    ],
  },
  {
    color: "#5fd9a8", index: "05", title: "Web Geliştirme",
    desc: "Sıfırdan hızlı, modern full-stack web siteleri.",
    parts: [
      { g: rbox(2.5, 1.6, 0.12), pos: [0, 0.35, 0], dir: [0, 0.6, -0.7] },
      { g: rbox(2.3, 1.4, 0.05, 0.04), pos: [0, 0.35, 0.06], dir: [0, 0.8, 0.8] },
      { g: rbox(2.3, 0.22, 0.06, 0.03), pos: [0, 0.95, 0.09], dir: [0, 1.3, 0.6] },
      { g: sph(0.05), pos: [-1.05, 0.95, 0.12], dir: [-1.1, 1.4, 0.7] },
      { g: sph(0.05), pos: [-0.92, 0.95, 0.12], dir: [-0.95, 1.4, 0.7] },
      { g: sph(0.05), pos: [-0.79, 0.95, 0.12], dir: [-0.8, 1.4, 0.7] },
      { g: rbox(1.4, 0.14, 0.05, 0.03), pos: [0.1, 0.95, 0.1], dir: [0.6, 1.3, 0.7] },
      { g: rbox(1.6, 0.16, 0.04, 0.02), pos: [-0.25, 0.5, 0.1], dir: [-0.7, 0.5, 0.9] },
      { g: rbox(1.1, 0.16, 0.04, 0.02), pos: [-0.5, 0.15, 0.1], dir: [-1, -0.1, 0.9] },
      { g: rbox(0.2, 0.5, 0.2), pos: [0, -0.65, 0], dir: [0, -1.1, 0] },
      { g: rbox(1.1, 0.1, 0.6), pos: [0, -0.95, 0], dir: [0, -1.4, 0] },
    ],
  },
];
const N = SERVICES.length;

function ServiceModel({ service, index, progress }: { service: Service; index: number; progress: RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const geos = useMemo(() => service.parts.map((p) => p.g()), [service]);
  const spread = 2.4;

  useFrame((state) => {
    const p = progress.current ?? 0;
    const lp = p * N - index;
    const e = smooth(lp, 0.2, 0.9);
    const op = smooth(lp, -0.15, 0.08) * (1 - smooth(lp, 0.9, 1.15));
    const grp = groupRef.current;
    if (grp) {
      grp.visible = op > 0.01;
      grp.rotation.y = state.clock.elapsedTime * 0.12;
    }
    if (op <= 0.01) return;
    service.parts.forEach((part, k) => {
      const m = meshes.current[k];
      if (!m) return;
      m.position.set(
        part.pos[0] + part.dir[0] * e * spread,
        part.pos[1] + part.dir[1] * e * spread,
        part.pos[2] + part.dir[2] * e * spread
      );
      (m.material as THREE.MeshStandardMaterial).opacity = op;
    });
  });

  return (
    <group ref={groupRef} position={[2.4, 0, 0]} visible={false}>
      {service.parts.map((part, k) => (
        <mesh
          key={k}
          ref={(el) => {
            meshes.current[k] = el;
          }}
          geometry={geos[k]}
          scale={part.scale ?? 1}
          rotation={part.rot ?? [0, 0, 0]}
        >
          <meshStandardMaterial
            color={service.color}
            metalness={0.62}
            roughness={0.26}
            envMapIntensity={1.35}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  );
}

function Ambience({ progress, lightRef }: { progress: RefObject<number>; lightRef: RefObject<THREE.PointLight | null> }) {
  useFrame((state) => {
    const p = progress.current ?? 0;
    const f = Math.min(N - 1, Math.max(0, p * N - 0.5));
    const i = Math.min(N - 2, Math.floor(f));
    const k = f - i;
    colA.set(SERVICES[i].color);
    colB.set(SERVICES[i + 1].color);
    colA.lerp(colB, k);
    if (lightRef.current) lightRef.current.color.copy(colA);
    bgTmp.copy(baseDark).lerp(colA, 0.12);
    if (state.scene.background instanceof THREE.Color) state.scene.background.copy(bgTmp);
    if (state.scene.fog) state.scene.fog.color.copy(bgTmp);
  });
  return null;
}

function CamRig() {
  useFrame((state) => state.camera.lookAt(1.4, 0, 0));
  return null;
}

function Scene({ progress }: { progress: RefObject<number> }) {
  const lightRef = useRef<THREE.PointLight | null>(null);
  return (
    <Canvas camera={{ position: [0, 0.5, 8.5], fov: 40 }} dpr={[1, 1.75]}>
      <color attach="background" args={["#0b0b0d"]} />
      <fog attach="fog" args={["#0b0b0d", 10, 26]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 8, 5]} intensity={1.2} />
      <pointLight ref={lightRef} position={[3, 3, 4]} intensity={50} distance={22} color="#e0a94a" />

      <CamRig />
      <Ambience progress={progress} lightRef={lightRef} />

      <mesh position={[1.4, -1.75, -2]} rotation={[-HALF, 0, 0]}>
        <planeGeometry args={[12, 60]} />
        <meshStandardMaterial color="#26272b" metalness={0.4} roughness={0.7} envMapIntensity={0.6} />
      </mesh>

      {SERVICES.map((s, i) => (
        <ServiceModel key={s.index} service={s} index={i} progress={progress} />
      ))}

      <Environment resolution={256}>
        <Lightformer intensity={2} position={[0, 5, 6]} scale={[12, 12, 1]} color="#ffffff" />
        <Lightformer intensity={1.4} position={[-6, 2, 4]} scale={[6, 10, 1]} color="#dfe6ef" />
        <Lightformer intensity={1.1} position={[6, -2, 4]} scale={[6, 8, 1]} color="#aab2be" />
      </Environment>
    </Canvas>
  );
}

export function ServiceJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = sectionRef.current;
        if (!el) return;
        const total = el.offsetHeight - window.innerHeight;
        const scrolled = -el.getBoundingClientRect().top;
        const v = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
        progress.current = v;
        setP(v);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} id="hizmetler" className="relative" style={{ height: `${N * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-[#0b0b0d]">
        <div className="absolute inset-0">
          <Scene progress={progress} />
        </div>

        <div className="pointer-events-none absolute inset-0 [background:linear-gradient(90deg,rgba(11,11,13,0.92)_0%,rgba(11,11,13,0.3)_45%,transparent_72%)]" />

        {SERVICES.map((s, i) => {
          const lp = p * N - i;
          const opacity = smooth(lp, -0.1, 0.12) * (1 - smooth(lp, 0.85, 1.1));
          const ty = (lp - 0.5) * -70;
          return (
            <div
              key={s.index}
              className="pointer-events-none absolute inset-y-0 left-0 flex w-full max-w-xl flex-col justify-center px-8 text-white sm:px-16"
              style={{ opacity, transform: `translateY(${ty}px)` }}
            >
              <span className="mb-4 text-xs uppercase tracking-[0.4em]" style={{ color: s.color }}>
                {s.index} &nbsp;—&nbsp; Hizmet
              </span>
              <h2 className="font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
                {s.title}
              </h2>
              <p className="mt-6 max-w-md text-base leading-7 text-white/70">{s.desc}</p>
            </div>
          );
        })}

        <div className="absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-3">
          {SERVICES.map((s, i) => {
            const active = Math.round(p * (N - 1)) === i;
            return (
              <span
                key={s.index}
                className="h-2 w-2 rounded-full transition-all duration-300"
                style={{ background: active ? s.color : "rgba(255,255,255,0.25)", transform: active ? "scale(1.3)" : "scale(1)" }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
