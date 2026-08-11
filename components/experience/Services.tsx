"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { AKMark } from "@/components/brand/AKMark";

// Hizmetler — PREMIUM SPOTLIGHT KARTLARI. Dengeli 3'lü ızgara. İmleç kartın üstünde
// gezerken o hizmetin renginde bir ışık huzmesi imleci takip eder (masaüstü); kart
// kalkar, kenarı ve alt çizgisi o renge döner, ikon canlanır. Scroll'da sırayla
// belirir. Mobilde imleç yok → ekran ortasındaki kart aynı efekti alır (merkezî ışık).

export function Icon({ name, size = 26 }: { name: string; size?: number }) {
  const c = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "cube":
      return (<svg {...c}><path d="M12 2 3 7v10l9 5 9-5V7z" /><path d="M3 7l9 5 9-5" /><path d="M12 12v10" /></svg>);
    case "cnc":
      return (<svg {...c}><rect x="3" y="4" width="18" height="4" rx="1" /><path d="M6 8v3M18 8v3M12 8v6" /><path d="M9 14h6l-1.6 4h-2.8z" /></svg>);
    case "film":
      return (<svg {...c}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4" /></svg>);
    case "share":
      return (<svg {...c}><circle cx="6" cy="12" r="2.4" /><circle cx="18" cy="6" r="2.4" /><circle cx="18" cy="18" r="2.4" /><path d="M8.1 10.9l7.8-3.8M8.1 13.1l7.8 3.8" /></svg>);
    case "code":
      return (<svg {...c}><path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" /></svg>);
    case "mobile":
      return (<svg {...c}><rect x="6" y="3" width="12" height="18" rx="2.5" /><path d="M11 18h2" /></svg>);
    default:
      return null;
  }
}

type Service = { n: string; title: string; desc: string; icon: string; color: string; tools: string[] };

const services: Service[] = [
  { n: "01", title: "3D & Mekanik Tasarım", desc: "SolidWorks ve AutoCAD ile parça ve ürün tasarlıyorum: 3D modelleme, montaj ve üretime hazır teknik resim.", icon: "cube", color: "#e0a94a", tools: ["SolidWorks", "AutoCAD", "Fusion 360", "Teknik Resim"] },
  { n: "02", title: "CNC Üretim Hazırlığı", desc: "AutoCAD ve SolidCAM ile tezgahın izleyeceği yolu çıkarıp makinenin anlayacağı komutları (G-code) üretiyorum.", icon: "cnc", color: "#6fb7d9", tools: ["SolidCAM", "AutoCAD", "G-Code", "CAM"] },
  { n: "03", title: "Video Prodüksiyon", desc: "Çekimden kurguya: sinematik montaj, renk düzenleme ve ses tasarımıyla akılda kalıcı içerik.", icon: "film", color: "#d98a5a", tools: ["Premiere Pro", "After Effects", "DaVinci"] },
  { n: "04", title: "Sosyal Medya Yönetimi", desc: "İçerik, reels ve reklam yönetimiyle (Meta Ads) hesabını düzenler, doğru kitleye ulaştırır ve markanı öne çıkarırım.", icon: "share", color: "#b58cd9", tools: ["Meta Ads", "Reels", "İçerik"] },
  { n: "05", title: "Web Geliştirme", desc: "Sıfırdan, uçtan uca profesyonel web siteleri: hızlı, modern, SEO uyumlu — tıpkı şu an gezdiğin bu site gibi.", icon: "code", color: "#5fd9a8", tools: ["Next.js", "React", "Three.js", "Tailwind"] },
  { n: "06", title: "Mobil Uygulama & Otomasyon", desc: "iOS ve Android için modern mobil uygulamalar ve tekrarlayan işleri otomatikleştiren akıllı sistemler kuruyorum — tasarımdan yayına, tek elden.", icon: "mobile", color: "#7b8cf5", tools: ["React Native", "Flutter", "Python", "Otomasyon"] },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function onMove(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

// Tek hizmet kartı. Mobilde "kart ekranın ortasına gelince aktif" efektini
// ESKİDEN üst bileşende scroll dinleyicisi + rAF ile hesaplıyorduk → her
// kaydırmada TÜM Hizmetler bölümü yeniden render oluyordu (mobilde kart takılması
// buydu). Artık her kart kendi IntersectionObserver'ıyla (tarayıcının ucuz eşik
// kontrolü, ana iş parçacığını meşgul etmez) aktifliğini yönetir. Masaüstünde
// zaten :hover kullanılır (lg:group-hover) — değişmedi.
function ServiceCard({ s, i }: { s: Service; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "-42% 0px -42% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 48, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: (i % 3) * 0.1, ease: EASE }}
      style={{ "--ac": s.color, "--mx": "50%", "--my": "50%" } as CSSProperties}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-current/12 bg-current/[0.02] p-7 transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:border-[var(--ac)] hover:shadow-[0_26px_60px_-28px_var(--ac)] ${
        on ? "max-lg:-translate-y-1.5 max-lg:border-[var(--ac)] max-lg:shadow-[0_22px_50px_-26px_var(--ac)]" : ""
      }`}
    >
      {/* imleç-takipli ışık huzmesi (spotlight) */}
      <span aria-hidden className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${on ? "max-lg:opacity-100" : ""}`} style={{ background: `radial-gradient(260px circle at var(--mx) var(--my), ${s.color}24, transparent 62%)` }} />
      {/* ince ızgara doku (hover'da hafif belirir) */}
      <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.05] [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:26px_26px]" />
      {/* dev hayalet numara */}
      <span aria-hidden className="pointer-events-none absolute right-5 top-2 font-display text-6xl font-bold leading-none opacity-[0.06]">{s.n}</span>

      {/* ikon kutusu */}
      <div className={`relative flex h-14 w-14 items-center justify-center rounded-xl border border-current/15 transition-colors duration-500 group-hover:border-[var(--ac)] ${on ? "max-lg:border-[var(--ac)]" : ""}`}>
        <span className={`transition-colors duration-500 lg:group-hover:text-[var(--ac)] ${on ? "max-lg:text-[var(--ac)]" : ""}`}>
          <Icon name={s.icon} size={26} />
        </span>
      </div>

      <h3 className="relative mt-6 font-display text-xl font-bold tracking-tight sm:text-2xl">{s.title}</h3>
      <p className="relative mt-3 text-sm leading-6 opacity-65">{s.desc}</p>

      <div className="relative mt-auto flex flex-wrap gap-2 pt-6">
        {s.tools.map((t) => (
          <span key={t} className="rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider opacity-75" style={{ borderColor: `${s.color}44` }}>
            {t}
          </span>
        ))}
      </div>

      {/* alt vurgu çizgisi */}
      <span className={`absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 transition-transform duration-500 ease-out lg:group-hover:scale-x-100 ${on ? "max-lg:scale-x-100" : ""}`} style={{ background: s.color }} />
    </motion.article>
  );
}

/* ————— 3D dönen hizmet halkası (ortada AK logo, etrafında kartlar) ————— */
function ServicesOrbit() {
  const [active, setActive] = useState(0);
  const [narrow, setNarrow] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const targetRef = useRef(0);
  const activeRef = useRef(0);
  const pausedRef = useRef(false);
  const dragRef = useRef<{ x: number; a: number } | null>(null);

  const n = services.length;
  const stepDeg = 360 / n;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const radius = narrow ? 170 : 340;

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      // boştayken yavaş otomatik dönüş; hover/sürükleme sırasında durur
      if (!pausedRef.current && !dragRef.current) targetRef.current += 0.1;
      angleRef.current += (targetRef.current - angleRef.current) * 0.08;
      if (ringRef.current) {
        ringRef.current.style.transform = `translateZ(${-radius}px) rotateY(${angleRef.current}deg)`;
      }
      const idx = ((Math.round(-angleRef.current / stepDeg) % n) + n) % n;
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [radius, stepDeg, n]);

  const go = (d: number) => {
    targetRef.current += d * stepDeg;
  };
  const focus = (i: number) => {
    const curIdx = -targetRef.current / stepDeg;
    const nearest = Math.round((curIdx - i) / n) * n + i;
    targetRef.current = -nearest * stepDeg;
  };

  return (
    <div className="mt-8 select-none">
      <div
        className="relative mx-auto flex h-[420px] items-center justify-center overflow-hidden sm:h-[500px]"
        style={{ perspective: narrow ? "900px" : "1200px" }}
        onPointerDown={(e) => {
          dragRef.current = { x: e.clientX, a: targetRef.current };
        }}
        onPointerMove={(e) => {
          if (!dragRef.current) return;
          targetRef.current = dragRef.current.a + (e.clientX - dragRef.current.x) * 0.35;
        }}
        onPointerUp={() => {
          dragRef.current = null;
        }}
        onPointerLeave={() => {
          dragRef.current = null;
          pausedRef.current = false;
        }}
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
      >
        {/* Merkez amblem — senin AK logon (3D öğe) */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-current/15 bg-current/[0.03] sm:h-28 sm:w-28">
            <AKMark className="h-11 w-11 sm:h-14 sm:w-14" strokeWidth={2.2} />
          </div>
          <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] opacity-45">uçtan uca</div>
        </div>

        {/* Dönen halka */}
        <div ref={ringRef} className="relative h-full w-full [transform-style:preserve-3d]">
          {services.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.n}
                type="button"
                onClick={() => focus(i)}
                style={{ transform: `rotateY(${i * stepDeg}deg) translateZ(${radius}px)`, "--ac": s.color } as CSSProperties}
                className="absolute left-1/2 top-1/2 w-[180px] -translate-x-1/2 -translate-y-1/2 [backface-visibility:hidden] sm:w-[240px]"
              >
                <div
                  className={`flex flex-col rounded-2xl border p-5 text-left transition-[transform,border-color,box-shadow,opacity] duration-500 ${
                    on
                      ? "scale-105 border-[var(--ac)] bg-[#0f1013] text-[#f4f5f6] opacity-100 shadow-[0_28px_60px_-28px_var(--ac)]"
                      : "border-current/12 bg-current/[0.03] opacity-40"
                  }`}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl border"
                    style={{ borderColor: on ? s.color : undefined, color: on ? s.color : undefined }}
                  >
                    <Icon name={s.icon} size={24} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold leading-tight tracking-tight">{s.title}</h3>
                  {on && <p className="mt-2 text-xs leading-5 opacity-70">{s.desc}</p>}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.tools.slice(0, on ? 4 : 2).map((t) => (
                      <span key={t} className="rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider opacity-70" style={{ borderColor: `${s.color}55` }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Kontroller — ok + sayaç */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <button type="button" onClick={() => go(1)} aria-label="Önceki hizmet" className="flex h-11 w-11 items-center justify-center rounded-full border border-current/25 text-lg transition hover:border-current/70 hover:bg-current/10 active:scale-95">
          <span aria-hidden>‹</span>
        </button>
        <div className="font-mono text-sm tabular-nums">
          <span>{String(active + 1).padStart(2, "0")}</span>
          <span className="opacity-30"> | </span>
          <span className="opacity-45">{String(n).padStart(2, "0")}</span>
        </div>
        <button type="button" onClick={() => go(-1)} aria-label="Sonraki hizmet" className="flex h-11 w-11 items-center justify-center rounded-full border border-current/25 text-lg transition hover:border-current/70 hover:bg-current/10 active:scale-95">
          <span aria-hidden>›</span>
        </button>
      </div>
    </div>
  );
}

export function Services() {
  return (
    <section id="hizmetler" className="relative px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, ease: EASE }}>
          <span className="mb-3 block text-xs uppercase tracking-[0.4em] opacity-50">Hizmetler</span>
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">Ne yapıyorum?</h2>
            <span className="font-mono text-xs uppercase tracking-[0.3em] opacity-50">6 alan · tek elden</span>
          </div>
        </motion.div>

        {/* 3D dönen hizmet halkası */}
        <ServicesOrbit />
      </div>
    </section>
  );
}
