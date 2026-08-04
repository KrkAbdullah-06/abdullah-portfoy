"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatedBackground, type BgVariant } from "@/components/ui/AnimatedBackground";

type PanelData = {
  key: BgVariant;
  index: string;
  kicker: string;
  title: string;
  accent: string; // "cyan" | "gold"
  sub: string;
  image: string; // tam ekran arka plan (şimdilik geçici; admin'den gerçek işlerinle değişecek)
  bg: string; // görsel yüklenene kadar arkada duran marka renkli gradyan
  anim?: boolean; // true ise foto yerine kod-animasyonlu arka plan kullanılır
  video?: string; // varsa tam ekran video arka plan (ör. Magnific'te üretilmiş .mp4)
  poster?: string; // video yüklenene kadar gösterilecek kare (opsiyonel)
};

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1920&q=75`;

// Her sahne senin bir iş dalın. Görseller şimdilik yüksek kaliteli geçici
// fotoğraflar; Aşama 4-5'te admin'den kendi gerçek foto/videolarınla değişecek.
const panels: PanelData[] = [
  {
    key: "web",
    index: "01",
    kicker: "Web Geliştirme",
    title: "HAYAL, EKRANA DÖNÜŞÜR",
    accent: "cyan",
    sub: "Sıfırdan, hızlı ve modern web siteleri.",
    image: img("1461749280684-dccba630e2f6"),
    bg: "radial-gradient(circle at 30% 30%, rgba(34,211,238,0.25), transparent 60%), #0a1220",
  },
  {
    key: "3d",
    index: "02",
    kicker: "3D & Mekanik Tasarım",
    title: "FİKİR, FORMA KAVUŞUR",
    accent: "cyan",
    sub: "SolidWorks & AutoCAD ile hassas modelleme.",
    image: img("1518770660439-4636190af475"),
    bg: "radial-gradient(circle at 70% 35%, rgba(120,150,190,0.25), transparent 60%), #0a1220",
  },
  {
    key: "cnc",
    index: "03",
    kicker: "CNC Üretim Hazırlığı",
    title: "TASARIM, ÜRETİME GEÇER",
    accent: "gold",
    sub: "SolidCAM ile üretime hazır dosyalar ve takım yolları.",
    image: "https://loremflickr.com/1920/1080/cnc,machine,lathe?lock=7",
    bg: "radial-gradient(circle at 50% 100%, rgba(232,166,60,0.18), transparent 60%), #0d1016",
    anim: true,
  },
  {
    key: "video",
    index: "04",
    kicker: "Video Prodüksiyon",
    title: "ANLAR, HİKÂYEYE DÖNÜŞÜR",
    accent: "gold",
    sub: "Sinematik kurgu, renk ve ses düzenlemesi.",
    image: img("1485846234645-a62644f84728"),
    bg: "radial-gradient(circle at 75% 30%, rgba(232,166,60,0.20), transparent 60%), #0a0e16",
  },
  {
    key: "sosyal",
    index: "05",
    kicker: "Sosyal Medya",
    title: "MARKAN, GÖRÜNÜR OLUR",
    accent: "cyan",
    sub: "Dikkat çeken içerikler, büyüyen hesaplar.",
    image: img("1611162617213-7d7a39e9b1d7"),
    bg: "radial-gradient(circle at 50% 80%, rgba(34,211,238,0.22), transparent 60%), #0a1220",
  },
];

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function CinematicShowcase() {
  const ref = useRef<HTMLElement>(null);
  // Bölüm içindeki kaydırma ilerlemesi (0 = başında, 1 = sonunda)
  const [progress, setProgress] = useState(0);

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
        setProgress(total > 0 ? clamp(scrolled / total, 0, 1) : 0);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const n = panels.length;
  const active = Math.round(progress * (n - 1));

  return (
    <section
      ref={ref}
      id="vitrin"
      className="relative"
      style={{ height: `${n * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Tam ekran arka planlar (birbirine geçerek değişir) */}
        {panels.map((d, i) => {
          const center = i / (n - 1);
          const w = 1 / (n - 1);
          const opacity = clamp(1 - Math.abs(progress - center) / w, 0, 1);
          const scale = 1.12 - 0.12 * opacity;
          return (
            <div
              key={d.key}
              className="absolute inset-0"
              style={{ opacity }}
              aria-hidden={active !== i}
            >
              {/* Arkada marka gradyanı (temel) */}
              <div className="absolute inset-0" style={{ background: d.bg }} />
              {d.video ? (
                <>
                  {/* Tam ekran video arka plan (Magnific vb. ile üretilmiş .mp4) */}
                  <video
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ transform: `scale(${scale})` }}
                    src={d.video}
                    poster={d.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-background/55" />
                </>
              ) : d.anim ? (
                /* Kod ile üretilen animasyonlu arka plan */
                <AnimatedBackground variant={d.key} active={active === i} />
              ) : (
                <>
                  {/* Fotoğraf (hafif zoom ile sinematik) */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${d.image})`,
                      transform: `scale(${scale})`,
                    }}
                  />
                  {/* Okunabilirlik karartması (sadece fotoğrafta) */}
                  <div className="absolute inset-0 bg-background/60" />
                </>
              )}
              {/* Sinematik üst/alt geçiş karartması (her sahnede) */}
              <div className="absolute inset-0 [background:linear-gradient(to_top,rgba(10,18,32,0.92),rgba(10,18,32,0.15)_45%,rgba(10,18,32,0.55))]" />
            </div>
          );
        })}

        {/* Başlıklar */}
        {panels.map((d, i) => {
          const center = i / (n - 1);
          const w = 1 / (n - 1);
          const opacity = clamp(1 - Math.abs(progress - center) / (w * 0.8), 0, 1);
          const ty = clamp((progress - center) / w, -1, 1) * -40;
          const accentClass = d.accent === "gold" ? "text-gold" : "text-accent";
          return (
            <div
              key={d.key}
              className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
              style={{ opacity, transform: `translateY(${ty}px)` }}
            >
              <span
                className={`mb-4 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.3em] ${accentClass}`}
              >
                <span className="font-display text-base">{d.index}</span>
                <span className="h-px w-8 bg-current" />
                {d.kicker}
              </span>
              <h2 className="max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] sm:text-6xl lg:text-7xl">
                {d.title}
              </h2>
              <p className="mt-6 max-w-md text-base text-foreground/80 sm:text-lg">
                {d.sub}
              </p>
            </div>
          );
        })}

        {/* Sağda sahne göstergesi (noktalar) */}
        <div className="absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-3">
          {panels.map((d, i) => (
            <span
              key={d.key}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                active === i ? "scale-125 bg-accent" : "bg-foreground/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
