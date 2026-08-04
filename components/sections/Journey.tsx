"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const JourneyScene = dynamic(
  () => import("@/components/three/JourneyScene").then((m) => m.JourneyScene),
  { ssr: false }
);

// 5 duraklık kesintisiz 3D yolculuk (her durak bir hizmet + gerçek model).
const stations = [
  {
    index: "01",
    kicker: "3D & Mekanik Tasarım",
    title: "FİKİR, FORMA KAVUŞUR",
    sub: "SolidWorks & AutoCAD ile hassas modelleme.",
    accent: "cyan" as const,
  },
  {
    index: "02",
    kicker: "CNC Üretim Hazırlığı",
    title: "TASARIM, ÜRETİME GEÇER",
    sub: "SolidCAM ile üretime hazır dosyalar ve takım yolları.",
    accent: "gold" as const,
  },
  {
    index: "03",
    kicker: "Video Prodüksiyon",
    title: "ANLAR, HİKÂYEYE DÖNÜŞÜR",
    sub: "Sinematik kurgu, renk ve ses düzenlemesi.",
    accent: "gold" as const,
  },
  {
    index: "04",
    kicker: "Sosyal Medya",
    title: "MARKAN, GÖRÜNÜR OLUR",
    sub: "Dikkat çeken içerikler, büyüyen hesaplar.",
    accent: "cyan" as const,
  },
  {
    index: "05",
    kicker: "Web Geliştirme",
    title: "HAYAL, EKRANA DÖNÜŞÜR",
    sub: "Sıfırdan, hızlı ve modern full-stack web siteleri.",
    accent: "cyan" as const,
  },
];

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function smoothstep(e0: number, e1: number, x: number) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function Journey() {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0); // 3D sahne için (re-render yok)
  const [p, setP] = useState(0); // yazı katmanları için

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = ref.current;
        if (!el) return;
        const total = el.offsetHeight - window.innerHeight;
        const scrolled = -el.getBoundingClientRect().top;
        const v = total > 0 ? clamp(scrolled / total, 0, 1) : 0;
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

  const n = stations.length;

  return (
    <section
      ref={ref}
      id="vitrin"
      className="relative"
      style={{ height: `${n * 150}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-background">
        {/* 3D yolculuk sahnesi */}
        <div className="absolute inset-0">
          <JourneyScene progress={progress} />
        </div>

        {/* Sinematik üst/alt karartma (yazı okunsun) */}
        <div className="pointer-events-none absolute inset-0 [background:linear-gradient(to_top,rgba(10,18,32,0.85),rgba(10,18,32,0)_40%,rgba(10,18,32,0.5))]" />

        {/* Durak yazıları */}
        {stations.map((s, i) => {
          // Her yazı kendi durağının merkezinde net, uzaklaşınca kaybolur (üst üste binmez).
          const c = i / (n - 1);
          const w = 1 / (n - 1);
          const off = Math.abs(p - c) / w;
          const opacity = 1 - smoothstep(0.3, 0.5, off);
          const ty = (p - c) * -120;
          const accentClass = s.accent === "gold" ? "text-gold" : "text-accent";
          return (
            <div
              key={s.index}
              className="pointer-events-none absolute inset-0 flex flex-col items-start justify-center px-8 text-left sm:px-14 lg:px-24"
              style={{ opacity, transform: `translateY(${ty}px)` }}
            >
              <span
                className={`mb-4 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.3em] ${accentClass}`}
              >
                <span className="font-display text-base">{s.index}</span>
                <span className="h-px w-8 bg-current" />
                {s.kicker}
              </span>
              <h2 className="max-w-lg font-display text-4xl font-bold leading-[1.05] tracking-tight drop-shadow-[0_2px_24px_rgba(0,0,0,0.85)] sm:text-5xl lg:text-6xl">
                {s.title}
              </h2>
              <p className="mt-5 max-w-sm text-base text-foreground/85 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-lg">
                {s.sub}
              </p>
            </div>
          );
        })}

        {/* Sahne göstergesi (noktalar) */}
        <div className="absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-3">
          {stations.map((s, i) => {
            const center = n > 1 ? i / (n - 1) : 0;
            const isActive = Math.round(p * (n - 1)) === i;
            return (
              <span
                key={s.index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  isActive ? "scale-125 bg-accent" : "bg-foreground/25"
                }`}
                style={{ opacity: 0.4 + 0.6 * (1 - Math.abs(p - center)) }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
