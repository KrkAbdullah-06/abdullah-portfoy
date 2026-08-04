"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { createGearGeometry } from "@/components/three/geometries";

// Arka planda hep duran MAT büyük çark (yan yatık). Scroll'da dönerek aşağı iner.
// ÖNEMLİ: Çarkın rengi ZEMİNE göre uyarlanır — zemin koyuyken mat koyu gri kalır
// (açık yazılar üstünde okunur), zemin beyazladıkça (Portföy/İletişim) METALİK
// AÇIK GRİ'ye döner → koyu yazılar çarkın üstünde de okunur kalır.
const matteSteel = { color: "#2b2c31", metalness: 0.2, roughness: 0.88 };
const gearDark = new THREE.Color("#2b2c31");
const gearLight = new THREE.Color("#c4c8ce");

function GearAssembly({ progress, bgColor, mobile }: { progress: RefObject<number>; bgColor: RefObject<THREE.Color>; mobile: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  // mobilde sadeleştirilmiş geometri (silüet aynı, üçgen sayısı düşük)
  const gearGeo = useMemo(() => createGearGeometry(mobile), [mobile]);

  // MOBİL AKICILIK: Telefonda kaydırma olayları seyrek ve gruplu geldiği için
  // çark, konumunu doğrudan progress'ten alınca SIÇRAYARAK ilerliyordu (takılma
  // hissi). Mobilde değeri kare hızından bağımsız şekilde yumuşatıyoruz →
  // scroll olayları çoğalıp azalsa bile çark akıcı süzülür.
  // Masaüstünde davranış AYNEN korunur (anlık takip).
  const smooth = useRef<number | null>(null);

  useFrame((_, d) => {
    const g = ref.current;
    if (!g) return;
    // progress artık Experience'te SÜREKLİ rAF ile (scrollY'den) güncelleniyor →
    // mobilde de akıcı. Hafif ek yumuşatma zıplamayı iyice yok eder.
    const target = progress.current ?? 0;
    if (smooth.current === null) smooth.current = target;
    smooth.current += (target - smooth.current) * (mobile ? 0.18 : 1);
    const p = smooth.current;

    // zemin aydınlandıkça çark açık griye döner (yazı okunsun)
    const mat = mesh.current?.material as (THREE.Material & { color?: THREE.Color }) | undefined;
    if (mat?.color && bgColor.current) {
      const t = THREE.MathUtils.clamp((bgColor.current.r - 0.03) / 0.9, 0, 1);
      mat.color.copy(gearDark).lerp(gearLight, t);
    }

    // Hareket HER CİHAZDA scroll'a bağlı (PC ile AYNI görünüm) — mobilde de artık
    // akıcı çünkü progress her karede scrollY'den okunuyor.
    g.rotation.z += d * 0.14;
    g.rotation.x = 1.0 + Math.sin(p * Math.PI * 3) * 0.6;
    g.rotation.y = p * Math.PI * 1.6;
    g.position.x = Math.sin(p * Math.PI) * 4.4;
    // Başlangıçta (p=0, siteye giriş anı) çark daha YUKARIDA durur — "ABDULLAH
    // KIRKIL" başlığının biraz üstünde — böylece ziyaretçi siteye girdiğini
    // net anlar. Sonra normal seyrinde aşağı iner (bitiş konumu değişmedi).
    g.position.y = THREE.MathUtils.lerp(2.1, -1.6, p) + Math.sin(p * Math.PI * 3) * 0.9;
    g.position.z = -3 + Math.sin(p * Math.PI * 2) * 1.6;
  });

  return (
    <group ref={ref} position={[0, 1.2, -3]} scale={2.2}>
      <mesh ref={mesh} geometry={gearGeo}>
        {/* Mobil: metalness 0 (ortam haritasına ihtiyaç yok) → Environment
            atlanabilir, piksel başına maliyet çok düşer, dpr yükseltilebilir.
            Görünüm neredeyse aynı (çark zaten MAT). Masaüstü: tam PBR + env. */}
        {mobile ? (
          <meshStandardMaterial color={matteSteel.color} metalness={0} roughness={0.92} />
        ) : (
          <meshStandardMaterial {...matteSteel} />
        )}
      </mesh>
    </group>
  );
}

// NOT: Zemin rengi (koyu↔beyaz) artık BURADA değil, Experience'te bir CSS
// katmanında uygulanıyor. Böylece canvas şeffaf kalır ve MOBİLDE tamamen
// kapatılabilir (performans) — zemin renkleri yine de doğru çalışır.

// Mobilde kareyi ~30fps'e sabitler (frameloop="demand" + 30fps invalidate).
// Böylece çark saniyede 60 yerine 30 kez çizilir → GPU/işlemci yükü yarıya iner.
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

export function BackgroundStage({
  progress,
  bgColor,
  mobile = false,
}: {
  progress: RefObject<number>;
  bgColor: RefObject<THREE.Color>;
  mobile?: boolean;
}) {
  // MOBİL AYARI: çark metalness=0 (ortam haritasına gerek yok) → Environment/PMREM
  // TAMAMEN atlanır (en büyük GPU tasarrufu). Piksel başına maliyet çok düştüğü
  // için dpr YÜKSELTİLİR (pikselli görünmesin) + antialias açık. 30fps cap korunur.
  // Işıklar mobilde biraz güçlendirildi (env yokken çark net görünsün).
  return (
    <Canvas
      frameloop={mobile ? "demand" : "always"}
      camera={{ position: [0, 0, 11], fov: 42 }}
      dpr={mobile ? [1, 1.5] : [1, 1.75]}
      gl={{ antialias: true, powerPreference: "low-power" }}
    >
      {mobile && <FpsCap fps={30} />}
      <ambientLight intensity={mobile ? 0.85 : 0.5} />
      <directionalLight position={[5, 6, 6]} intensity={mobile ? 2.0 : 1.3} />

      <GearAssembly progress={progress} bgColor={bgColor} mobile={mobile} />

      {/* Ortam haritası SADECE masaüstünde (metalik yansımalar için). Mobilde
          metalness=0 olduğundan gerekmiyor → maliyetli PMREM oluşturma+örnekleme yok. */}
      {!mobile && (
        <Environment resolution={128}>
          <Lightformer intensity={1.6} position={[0, 4, 6]} scale={[10, 10, 1]} color="#ffffff" />
          <Lightformer intensity={1.0} position={[-6, 0, 4]} scale={[5, 8, 1]} color="#c9ced6" />
        </Environment>
      )}
    </Canvas>
  );
}
