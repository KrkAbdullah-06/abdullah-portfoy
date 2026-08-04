"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LogoMark } from "@/components/brand/Logo";

const CuttingScene = dynamic(
  () => import("@/components/three/CuttingScene").then((m) => m.CuttingScene),
  { ssr: false }
);

// Site ilk açıldığında görünen tanıtım ekranı: spiral matkap + amber kıvılcımlar.
// ~2.2 sn sonra yumuşakça solar, ~2.95 sn'de tamamen kaldırılır (garantili).
export function LoadingScreen() {
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 2200);
    const t2 = setTimeout(() => setGone(true), 2950);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background transition-opacity duration-700 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0">
        <CuttingScene />
      </div>

      <div className="absolute inset-x-0 bottom-16 flex flex-col items-center gap-4">
        <LogoMark size={48} />
        <p className="font-display text-xs uppercase tracking-[0.35em] text-muted">
          Yükleniyor
        </p>
        <div className="h-0.5 w-40 overflow-hidden rounded-full bg-border">
          <div className="loader-bar h-full bg-gold" />
        </div>
      </div>
    </div>
  );
}
