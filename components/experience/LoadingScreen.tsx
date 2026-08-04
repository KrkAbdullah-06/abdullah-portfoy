"use client";

import { useEffect, useState } from "react";
import { AKMark } from "@/components/brand/AKMark";

// Site açılış ekranı — sitenin diliyle uyumlu: koyu zemin, dönen hassasiyet
// halkası + "AK" monogram + isim + yüzde sayacı. Kısa (~1.3sn) sonra soluklaşıp
// kaybolur. setInterval kullanır (arka plan sekmede bile ilerler, takılmaz).
export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    let p = 0;
    const id = window.setInterval(() => {
      p += Math.random() * 9 + 5;
      if (p >= 100) {
        p = 100;
        window.clearInterval(id);
        window.setTimeout(() => setHidden(true), 350);
        window.setTimeout(() => setGone(true), 1150);
      }
      setProgress(Math.round(p));
    }, 90);
    return () => {
      window.clearInterval(id);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (hidden) document.body.style.overflow = "";
  }, [hidden]);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#08090a] text-[#f4f5f6] transition-opacity duration-700 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* ince ızgara doku */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:60px_60px]" />

      {/* logo: dönen halka + "AK" monogram */}
      <div className="relative flex h-40 w-40 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-dashed border-white/25 [animation:spin_3s_linear_infinite]" />
        <div className="absolute inset-4 rounded-full border border-white/10" />
        <AKMark className="h-20 w-20" strokeWidth={2.8} />
      </div>

      <div className="mt-8 font-display text-lg font-bold tracking-tight">ABDULLAH KIRKIL</div>
      <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.45em] opacity-60">Tasarım · Üretim · Web</div>

      {/* ilerleme çubuğu + yüzde */}
      <div className="mt-10 flex w-60 items-center gap-4">
        <div className="h-px flex-1 overflow-hidden bg-white/15">
          <div className="h-full bg-white transition-[width] duration-100 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <span className="font-mono text-xs tabular-nums opacity-70">{String(progress).padStart(3, "0")}</span>
      </div>
    </div>
  );
}
