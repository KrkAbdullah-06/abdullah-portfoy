"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { LogoSpin3D } from "./LogoSpin3D";
import { Icon } from "./Services";
import { AKMark } from "@/components/brand/AKMark";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
} as const;

function R({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ————— Kayan yazı bandı ————— */
export function Marquee() {
  const words = ["3D & MEKANİK TASARIM", "CNC ÜRETİM", "VİDEO PRODÜKSİYON", "SOSYAL MEDYA", "WEB GELİŞTİRME", "MOBİL UYGULAMA"];
  const strip = [...words, ...words];
  return (
    <div className="relative overflow-hidden border-y border-current/10 py-8">
      <div className="animate-marquee flex w-max whitespace-nowrap">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0">
            {strip.map((w, i) => (
              <span key={`${k}-${i}`} className="flex items-center">
                <span className="font-display text-3xl font-bold tracking-tight opacity-80 sm:text-5xl">{w}</span>
                <span className="mx-8 text-2xl opacity-30 sm:mx-12 sm:text-4xl">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ————— Hakkımda ————— */
const skills = ["SolidWorks", "AutoCAD", "SolidCAM", "CNC", "Premiere Pro", "After Effects", "Meta Ads", "Next.js", "React", "Three.js", "React Native", "Tailwind"];
const stats = [
  { k: "Gazi Üni.", v: "MIS · 4. Sınıf" },
  { k: "6 Alan", v: "Tek elden üretim" },
  { k: "Ankara / Niğde", v: "Türkiye" },
];

// Hakkımda kod editörü — VS Code'da GERÇEKTEN yazılıyormuş gibi: kod karakter
// karakter (typewriter) sıfırdan yazılır, SOLDAKİ 3D logo bununla SENKRON
// adım adım oluşur. Eski hakkımda metninin TAMAMI (tek kelime eksiksiz) if/else
// dallarına dağıtılmış halde kodun içinde. `rol` satırı, yazım bitince SÜREKLİ
// yazılıp silinir (typewriter loop).
// 6 rol = 6 hizmet (bkz. Services.tsx) — birebir aynı sırayla
const ROLES = ["3D & Mekanik Tasarım", "CNC Üretim Hazırlığı", "Video Prodüksiyon", "Sosyal Medya Yönetimi", "Web Geliştirme", "Mobil Uygulama & Otomasyon"];
// söz dizimi renkleri — NEON, canlı ve parlak, DENGELİ dağıtılmış: turuncu
// (const/function, sitenin kendi rengi) az sayıda satırda; kırmızı sadece
// TEK bir yerde (return) — çok tekrar edip baskın olmasın diye; mor, en sık
// tekrar eden özellik adlarında (ad/okul/konum/rol/durum).
const KW = "text-[#e0a94a]"; // bildirim (const/function) — turuncu (sitenin kendi rengi)
const CF = "text-[#ff5c5c]"; // kontrol akışı (return) — kırmızı (tek satırda, seyrek)
const FN = "text-[#8be9fd]"; // fonksiyon adı — parlak camgöbeği (cyan)
const ST = "text-[#2dd4bf]"; // metin (string / tanıtım) — camgöbeği-yeşil (cyan)
const CM = "text-[#7fe0a0]"; // yorum — parlak nane yeşili
const PR = "text-[#a78bfa]"; // özellik — canlı mor (en sık tekrar eden token)
const PL = "text-[#c8ccd4]"; // düz

type Seg = { cls?: string; color?: string; text: string };
const ROL_LINE = 4; // 0-index: "hizmetler" satırı (yazım bitince canlı döngüye geçer)
// Her hizmet, kendi renginle (bkz. Services.tsx `color` alanları, aynı sırayla)
const ROLE_COLORS = ["#e0a94a", "#6fb7d9", "#d98a5a", "#b58cd9", "#5fd9a8", "#7b8cf5"];

// Güncel hakkımda metninin TAMAMI kodun içinde: kimlik bilgileri obje
// alanlarında, uzun anlatı (vizyon + Nimak Makina stajı + hibrit çalışma +
// hedef) yorum satırlarına ve kısa bir fonksiyona bölünmüş halde.
const CODE_LINES: Seg[][] = [
  [{ cls: KW, text: "const" }, { text: " " }, { cls: PR, text: "abdullah" }, { text: " = {" }],
  [{ text: "  " }, { cls: PR, text: "ad" }, { text: ": " }, { cls: ST, text: '"Abdullah Kırkıl",' }],
  [{ text: "  " }, { cls: PR, text: "okul" }, { text: ": " }, { cls: ST, text: '"Gazi Üniversitesi · MIS · 4. sınıf",' }],
  [{ text: "  " }, { cls: PR, text: "konum" }, { text: ": " }, { cls: ST, text: '"Ankara / Niğde",' }],
  [{ text: "  " }, { cls: PR, text: "hizmetler" }, { text: ": " }, { color: ROLE_COLORS[0], text: `"${ROLES[0]}",` }],
  [{ text: "};" }],
  [],
  [{ cls: CM, text: "// Bilişim ve yönetim disiplinlerinin kesişim noktasında, teknolojiyi iş süreçlerine entegre etme vizyonuyla hareket ediyorum." }],
  [],
  [{ cls: CM, text: "// Akademik eğitimimin yanı sıra, Nimak Makina Mühendislik çatısı altında stajyerlikle adım attığım kariyer yolculuğuma, Nimak'da hibrit (tam zamanlı ve uzaktan) çalışma yapısıyla devam ediyorum." }],
  [{ cls: CM, text: "// Sanayi ve mühendislik sektöründeki iş süreçlerini bilişim altyapılarıyla destekleme üzerine pratik tecrübeler ediniyorum." }],
  [],
  [{ cls: CF, text: "function" }, { text: " " }, { cls: FN, text: "vizyonum" }, { text: "() {" }],
  [{ text: "  " }, { cls: CF, text: "return" }, { text: " " }, { cls: ST, text: '"Teknoloji, dijital dönüşüm ve yönetim bilişimi alanlarındaki vizyonumu paylaşmak ve geliştirmek temel hedefimdir.";' }],
  [{ text: "}" }],
  [],
  [{ cls: KW, text: "const" }, { text: " " }, { cls: PR, text: "durum" }, { text: " = " }, { cls: ST, text: '"Yeni projelere açık ✓";' }],
];

// Her satırın flatten-edilmiş yazım bütçesi: boş satırlar da küçük bir "duraklama"
// payı alır (real=0 ama cost=3) → tempoda doğal nefes.
const LINE_META = (() => {
  let offset = 0;
  return CODE_LINES.map((segs) => {
    const real = segs.reduce((s, seg) => s + seg.text.length, 0);
    const cost = real === 0 ? 3 : real;
    const start = offset;
    offset += cost;
    return { start, real, cost };
  });
})();
const TOTAL_CHARS = LINE_META.length ? LINE_META[LINE_META.length - 1].start + LINE_META[LINE_META.length - 1].cost : 0;
const MS_PER_CHAR = 15; // ~66 karakter/sn — gerçek daktilo hissi

function CodeRow({ n, segs, budget, started, cursor }: { n: number; segs: Seg[]; budget: number; started: boolean; cursor: boolean }) {
  if (!started) return null;
  let remaining = budget;
  const nodes: ReactNode[] = [];
  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i];
    if (remaining <= 0) break;
    const take = Math.min(remaining, seg.text.length);
    nodes.push(
      <span key={i} className={seg.cls} style={seg.color ? { color: seg.color } : undefined}>
        {seg.text.slice(0, take)}
      </span>
    );
    remaining -= take;
  }
  return (
    <div className="flex gap-4">
      <span className="w-5 shrink-0 select-none text-right text-[#4b5059]">{n}</span>
      <span className="whitespace-pre-wrap break-words">
        {nodes}
        {cursor && <span aria-hidden className="ml-px inline-block h-[0.95em] w-[2px] translate-y-[2px] animate-pulse bg-[#c8ccd4] align-middle" />}
      </span>
    </div>
  );
}

// typed = şu ana kadar "yazılan" toplam karakter (0..TOTAL_CHARS). Kod bu
// sayıya göre satır satır, karakter karakter ekrana gelir (gerçek daktilo).
function AboutCode({ typed }: { typed: number }) {
  const typingDone = typed >= TOTAL_CHARS;
  const [text, setText] = useState(ROLES[0]);
  const [ri, setRi] = useState(0);
  const [del, setDel] = useState(false);

  // Yazım tamamlanana kadar "rol" döngüsü BEKLER (dondurulur); tamamlanınca
  // sürekli yazılıp silinen typewriter döngüsü başlar.
  useEffect(() => {
    if (!typingDone) return;
    const full = ROLES[ri];
    const delay = !del && text === full ? 1500 : del ? 45 : 80;
    const t = setTimeout(() => {
      if (!del && text === full) {
        setDel(true);
      } else if (del && text === "") {
        setDel(false);
        setRi((v) => (v + 1) % ROLES.length);
      } else {
        setText(full.slice(0, del ? text.length - 1 : text.length + 1));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [text, del, ri, typingDone]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#0d0e11] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.7)]">
      {/* editör üst çubuğu */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#15171b] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 flex items-center gap-2 rounded-md bg-white/[0.06] px-3 py-1 font-mono text-[11px] text-white/70">
          <span className="text-[#7aa2f7]">{"</>"}</span> hakkimda.ts
        </span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">Abdullah Kırkıl</span>
      </div>

      {/* kod gövdesi — hakkımda metninin TAMAMI kodun İÇİNDE, sıfırdan yazılıyor */}
      <div className="overflow-x-auto px-4 py-5 font-mono text-[12.5px] leading-[1.85] sm:text-[13.5px]">
        {CODE_LINES.map((segs, i) => {
          const meta = LINE_META[i];
          const started = typed >= meta.start;
          const budget = Math.max(0, Math.min(meta.real, typed - meta.start));
          const active = typed >= meta.start && typed < meta.start + meta.cost;

          if (i === ROL_LINE && typingDone) {
            // yazım bitti → rol satırı canlı typewriter döngüsüne geçer
            return (
              <div key={i} className="flex gap-4">
                <span className="w-5 shrink-0 select-none text-right text-[#4b5059]">{i + 1}</span>
                <span className="whitespace-pre-wrap break-words">
                  <span className={PL}>{"  "}</span>
                  <span className={PR}>hizmetler</span>
                  <span className={PL}>{": "}</span>
                  <span style={{ color: ROLE_COLORS[ri] }}>{'"'}{text}</span>
                  <span aria-hidden className="ml-px inline-block h-[0.95em] w-[2px] translate-y-[2px] animate-pulse" style={{ backgroundColor: ROLE_COLORS[ri] }} />
                  <span style={{ color: ROLE_COLORS[ri] }}>{'",'}</span>
                </span>
              </div>
            );
          }
          return <CodeRow key={i} n={i + 1} segs={segs} budget={budget} started={started} cursor={active && !typingDone} />;
        })}
      </div>

      {/* durum çubuğu */}
      <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap border-t border-white/10 bg-[#15171b] px-4 py-2 font-mono text-[9px] text-white/40 sm:gap-4 sm:text-[10px]">
        <span className="flex shrink-0 items-center gap-1.5 text-[#7aa2f7]">⎇ main</span>
        <span className="shrink-0">{typingDone ? "TypeScript React" : "Yazılıyor…"}</span>
        <span className="ml-auto shrink-0">UTF-8 · Ln {Math.min(CODE_LINES.length, LINE_META.findIndex((m) => typed < m.start + m.cost) + 1 || CODE_LINES.length)}</span>
      </div>
    </div>
  );
}

export function About({ about }: { about?: { kicker: string; title: string; body: string | null } } = {}) {
  const [mobile, setMobile] = useState(false);
  const [inView, setInView] = useState(false);
  const [typed, setTyped] = useState(0); // "yazılmış" karakter sayısı (0..TOTAL_CHARS)
  const buildRef = useRef(0); // logo montaj ilerlemesi (0..1) — LogoSpin3D okur
  const secRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const applyM = () => setMobile(mq.matches);
    applyM();
    mq.addEventListener("change", applyM);
    const el = secRef.current;
    const io = el ? new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { rootMargin: "-12% 0px -12% 0px" }) : null;
    if (el && io) io.observe(el);
    return () => {
      mq.removeEventListener("change", applyM);
      io?.disconnect();
    };
  }, []);

  // Görünür olunca: kod SIFIRDAN, karakter karakter yazılır (gerçek daktilo) →
  // SOLDA logo aynı orana göre adım adım kurulur (senkron).
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    let t0 = 0;
    let lastSet = 0;
    const tick = (t: number) => {
      if (!t0) t0 = t;
      const chars = Math.min(TOTAL_CHARS, Math.floor((t - t0) / MS_PER_CHAR));
      buildRef.current = TOTAL_CHARS ? chars / TOTAL_CHARS : 1;
      const done = chars >= TOTAL_CHARS;
      // MOBİL PERFORMANS: bio metni uzun olduğundan yazım ~15-20 saniye sürüyor;
      // bu sürede React state'i (setTyped) her karede güncellemek 60/sn yeniden
      // render demek — 3D logonun WebGL render'ıyla AYNI ANDA ana iş parçacığını
      // dolduruyor ("Hakkımda yazılırken kaydıramıyorum" şikayetinin kaynağı bu).
      // Ekran güncellemesi ~20/sn'ye seyreltilir — YAZIM HIZI (MS_PER_CHAR) HİÇ
      // DEĞİŞMEZ, sadece birkaç karakter birden görünür (göz farketmez), toplam
      // süre ve nihai görünüm birebir aynı kalır.
      if (!mobile || done || t - lastSet >= 50) {
        lastSet = t;
        setTyped((cur) => (cur !== chars ? chars : cur));
      }
      if (!done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, mobile]);

  return (
    <section id="hakkimda" ref={secRef} className="relative px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <R>
          <span className="mb-3 block text-xs uppercase tracking-[0.4em] opacity-50">{about?.kicker ?? "Hakkımda"}</span>
          <h2 className="max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            {about?.title ?? "Öğrenci ruhu, profesyonel işçilik."}
          </h2>
          {about?.body ? (
            <p className="mt-6 max-w-2xl text-base leading-7 opacity-70 sm:text-lg">{about.body}</p>
          ) : null}
        </R>

        <div className="mt-14 grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          {/* SOL — 3D logo: kod yazıldıkça kirişleri adım adım oluşur (büyütülmüş çerçeve).
              Model ölçeği + iç boşluk kameranın görünür alanına güvenli marj bırakacak
              şekilde ayarlandı — artık çerçeveyi taşmıyor, alttaki yazıyı kapatmıyor. */}
          <R delay={0.1}>
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-current/15">
              <div className="absolute inset-0 [background:radial-gradient(120%_120%_at_30%_20%,rgba(255,255,255,0.06),transparent_60%)]" />
              <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:38px_38px]" />
              <div className="absolute inset-0 flex items-center justify-center pb-6">
                <div className="aspect-square w-[76%]">
                  <LogoSpin3D active={inView} mobile={mobile} build={buildRef} />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.3em] opacity-70">
                {typed < TOTAL_CHARS ? "kuruluyor…" : "Abdullah Kırkıl"}
              </div>
            </div>
          </R>

          {/* SAĞ — hakkımda metni kodun içinde, sıfırdan yazılıyor (typewriter).
              min-w-0: uzun (sarmalanmamış) bir satır olsa bile grid sütunu kendi
              fr payının ötesine BÜYÜMEZ (eskiden yazarken paneller genişliyordu). */}
          <R delay={0.15} className="min-w-0">
            <AboutCode typed={typed} />
          </R>
        </div>

        {/* yetenekler + istatistik */}
        <R delay={0.2}>
          <div className="mt-14 flex flex-wrap gap-2.5">
            {skills.map((s) => (
              <span key={s} className="rounded-full border border-current/20 px-4 py-1.5 text-xs opacity-70">
                {s}
              </span>
            ))}
          </div>
        </R>
        <R delay={0.25}>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-6 border-t border-current/10 pt-8">
            {stats.map((s) => (
              <div key={s.k}>
                <div className="font-display text-lg font-semibold">{s.k}</div>
                <div className="mt-1 text-xs opacity-55">{s.v}</div>
              </div>
            ))}
          </div>
        </R>
      </div>
    </section>
  );
}

/* ————— Süreç (zaman çizelgesi) ————— */
function StepIcon({ name }: { name: string }) {
  const c = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "search":
      return (<svg {...c}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>);
    case "design":
      return (<svg {...c}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>);
    case "build":
      return (<svg {...c}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M22 12h-3M5 12H2M19.1 4.9l-2.1 2.1M7 17l-2.1 2.1M19.1 19.1L17 17M7 7 4.9 4.9" /></svg>);
    case "deliver":
      return (<svg {...c}><path d="M21 8v8a2 2 0 0 1-1 1.7l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.7l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8z" /><path d="M9 12l2 2 4-4" /></svg>);
    default:
      return null;
  }
}

const steps = [
  { n: "01", t: "Keşif & Fikir", d: "İhtiyacını dinlerim, hedefi netleştirir ve doğru yaklaşımı birlikte belirleriz.", icon: "search" },
  { n: "02", t: "Tasarım & Modelleme", d: "3D model, teknik resim ya da arayüz — fikir görünür hale gelir, onayını alırız.", icon: "design" },
  { n: "03", t: "Üretim & Kurgu", d: "CNC hazırlığı, video kurgusu, web veya mobil uygulama kodu — iş titizlikle üretilir.", icon: "build" },
  { n: "04", t: "Teslim & Destek", d: "Sonucu teslim eder, ihtiyaç oldukça yanında olur ve destek veririm.", icon: "deliver" },
];

export function Process() {
  return (
    <section id="surec" className="relative px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <R>
          <span className="mb-3 block text-xs uppercase tracking-[0.4em] opacity-50">Süreç</span>
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">Nasıl çalışırım?</h2>
            <span className="font-mono text-xs uppercase tracking-[0.3em] opacity-50">4 adım · uçtan uca</span>
          </div>
        </R>

        <div className="relative mt-16">
          {/* aralarını bağlayan çizgi — scroll'da soldan sağa çizilir (masaüstü) */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-6 right-6 top-6 hidden h-px origin-left bg-gradient-to-r from-current/25 via-current/25 to-transparent lg:block"
          />

          <div className="grid gap-y-12 lg:grid-cols-4 lg:gap-x-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group relative"
              >
                {/* numaralı işaret (çizgiyi keser) */}
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-current/25 bg-[#0b0c0e] font-mono text-sm font-semibold text-[#f4f5f6] transition-colors duration-300 group-hover:border-current/60">
                  {s.n}
                </div>

                {/* mobil/tablet: DİKEY bağlantı segmenti (masaüstündeki yatay çizginin dikey karşılığı) */}
                {i < steps.length - 1 && <span aria-hidden className="absolute left-6 top-12 h-12 w-px bg-current/20 lg:hidden" />}

                <div className="mt-6 flex items-center gap-3">
                  <span className="opacity-55 transition-opacity duration-300 group-hover:opacity-100">
                    <StepIcon name={s.icon} />
                  </span>
                  <h3 className="font-display text-lg font-bold tracking-tight sm:text-xl">{s.t}</h3>
                </div>
                <p className="mt-3 max-w-xs text-sm leading-6 opacity-60">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ————— Portföy / Seçili İşler (kategori filtreli kart ızgarası) ————— */
// YENİ PROJE EKLEMEK İÇİN: aşağıdaki `projects` dizisine bir nesne ekle.
// `cat` değeri CATEGORIES içindekilerden biri olmalı (Tümü hariç).
const CATEGORIES = ["Tümü", "3D & Mekanik", "CNC Üretim", "Video", "Sosyal Medya", "Web", "Mobil & Otomasyon"] as const;

const CAT_COLOR: Record<string, string> = {
  "3D & Mekanik": "#e0a94a",
  "CNC Üretim": "#6fb7d9",
  Video: "#d98a5a",
  "Sosyal Medya": "#b58cd9",
  Web: "#5fd9a8",
  "Mobil & Otomasyon": "#7b8cf5",
};
// Her kategorinin kendine has ikonu (bkz. Services.tsx `Icon`, aynı ikon setinden)
const CAT_ICON: Record<string, string> = {
  "3D & Mekanik": "cube",
  "CNC Üretim": "cnc",
  Video: "film",
  "Sosyal Medya": "share",
  Web: "code",
  "Mobil & Otomasyon": "mobile",
};

// url: proje canlı bir siteyse dolu; kartına tıklayınca o site yeni sekmede açılır.
// url yoksa kart iletişim bölümüne götürür.
type Project = { id: string; title: string; cat: string; year: string; desc: string; url?: string };

const projects: Project[] = [
  { id: "01", title: "Nimak Makine Çizimleri", cat: "3D & Mekanik", year: "2025", desc: "Nimak Makina için SolidWorks ile hazırlanan 3D parça ve montaj çizimleri, üretime hazır teknik resimler." },
  { id: "02", title: "Nimak Parça G-Kodları", cat: "CNC Üretim", year: "2025", desc: "Nimak Makina parçalarının CNC tezgahında işlenmesi için SolidCAM ile hazırlanan takım yolları ve G-code çıktıları." },
  { id: "03", title: "Nimak Web Sitesi", cat: "Web", year: "2025", desc: "Nimak Makina'nın kurumsal web sitesi — modern, hızlı ve mobil uyumlu.", url: "https://www.nimak.com.tr/" },
  { id: "04", title: "Everest Soğutma", cat: "Web", year: "2025", desc: "Everest Soğutma için modern ve mobil uyumlu kurumsal tanıtım web sitesi.", url: "https://xn--nideeverestsoutma-3lcl.com/" },
  { id: "05", title: "Marka Yüzüm", cat: "Web", year: "2025", desc: "Marka Yüzüm için tasarlanıp geliştirilen kurumsal web sitesi.", url: "https://markayuzum.com" },
  { id: "06", title: "Mavi Kutu", cat: "Web", year: "2024", desc: "Marka için hızlı, modern ve şık bir web deneyimi." },
  { id: "07", title: "Ensa Hayvancılık", cat: "Web", year: "2024", desc: "Ensa Hayvancılık için kurumsal tanıtım web sitesi." },
  { id: "08", title: "Bereket Çiçekçilik", cat: "Web", year: "2024", desc: "Bereket Çiçekçilik için şık, sade ve kullanışlı web sitesi." },
  { id: "09", title: "Google Maps Scraper", cat: "Mobil & Otomasyon", year: "2024", desc: "Google Haritalar'dan işletme verilerini (isim, telefon, adres) otomatik toplayan veri kazıma aracı." },
  { id: "10", title: "Trendyol Ürün Scraper", cat: "Mobil & Otomasyon", year: "2024", desc: "Trendyol ürün bilgilerini otomatik çeken, fiyat ve stok takibi yapan otomasyon aracı." },
];

// Filtre çubuğunda yalnızca en az 1 projesi olan kategoriler görünür (Tümü hep açık).
// Video / Sosyal Medya şu an boş → dolunca otomatik görünürler.
const activeCategories = CATEGORIES.filter((c) => c === "Tümü" || projects.some((p) => p.cat === c));

// Mobilde ":hover" olmadığı için MASAÜSTÜNDEKİ "kartın üstüne gelince siyah panel
// açılır" davranışının birebir aynısını kaydırmayla tetikleriz: kart ekranın
// ortasına gelince IntersectionObserver ile "active" olur (Hakkımda'daki aynı
// hafif desen — sürekli scroll/rAF hesaplaması DEĞİL, tarayıcının kendi ucuz
// eşik kontrolü). Masaüstünde (lg+) hâlâ saf :hover kullanılır, değişmedi.
function ProjectCard({ p, i }: { p: Project; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "-38% 0px -38% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 48, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ "--ac": CAT_COLOR[p.cat] } as CSSProperties}
      // CAM EFEKTİ (glassmorphism) — düz opak beyaz "her yer beyaz" görünümü
      // yerine yarı saydam + blur'lu, parlak kenarlıklı, gerçek derinlik
      // hissi veren kart. MOBİL PERFORMANS: blur pahalı → mobilde kapalı,
      // daha opak zemin (bkz. ContactPanel'deki aynı desen).
      className={`group relative flex h-full min-h-[264px] flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-6 text-[#141416] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)] transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:border-[var(--ac)] hover:shadow-[0_28px_64px_-30px_var(--ac)] sm:bg-white/45 sm:backdrop-blur-xl ${
        active ? "max-lg:-translate-y-1.5 max-lg:border-[var(--ac)] max-lg:shadow-[0_28px_64px_-30px_var(--ac)]" : ""
      }`}
    >
      {/* cam parlaklığı (sheen) — üstten çapraz ışık yansıması */}
      <span aria-hidden className="pointer-events-none absolute inset-0 opacity-70 [background:linear-gradient(135deg,rgba(255,255,255,0.65),transparent_55%)]" />

      <a
        href={p.url ?? "#iletisim"}
        {...(p.url ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="absolute inset-0 z-30"
        aria-label={`${p.title} — ${p.url ? "siteyi aç" : "projeyi gör"}`}
      />

      {/* dev hayalet numara */}
      <span aria-hidden className={`pointer-events-none absolute -right-1 -top-4 font-display text-[6.5rem] font-bold leading-none opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.09] ${active ? "max-lg:opacity-[0.09]" : ""}`}>
        {p.id}
      </span>

      {/* üst satır: kategori İKONU (renkli rozet, HER ZAMAN görünür — hover
          gerekmez, kart hangi kategoriden anında belli olur) + yıl */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-[0_6px_16px_-6px_var(--ac)]" style={{ background: CAT_COLOR[p.cat] }}>
            <Icon name={CAT_ICON[p.cat]} size={20} />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-65">{p.cat}</span>
        </div>
        <span className="font-mono text-[11px] tabular-nums opacity-45">{p.year}</span>
      </div>

      {/* başlık (altta) */}
      <div className="relative z-10 mt-auto">
        <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight">{p.title}</h3>
      </div>

      {/* Detay paneli — MASAÜSTÜNDE :hover'da, MOBİLDE kart ekranın ortasına
          gelince (active) aşağıdan açılır. Aynı görsel, iki farklı tetikleyici. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-20 flex translate-y-full flex-col justify-end p-6 opacity-0 transition-[transform,opacity] duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 ${
          active ? "max-lg:translate-y-0 max-lg:opacity-100" : ""
        }`}
        style={{ background: `linear-gradient(to top, ${CAT_COLOR[p.cat]}1f, transparent 70%), rgba(10,11,13,0.9)` }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: CAT_COLOR[p.cat] }}>{p.cat}</span>
        <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-white">{p.title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/70">{p.desc}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: CAT_COLOR[p.cat] }}>
          {p.url ? "Siteyi aç" : "Projeyi gör"}
          <span className={`transition-transform duration-300 group-hover:translate-x-1 ${active ? "max-lg:translate-x-1" : ""}`} aria-hidden>↗</span>
        </span>
      </div>

      {/* alt kategori rengi çizgisi */}
      <span
        className={`absolute bottom-0 left-0 z-20 h-[3px] w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 ${active ? "max-lg:scale-x-100" : ""}`}
        style={{ background: CAT_COLOR[p.cat] }}
      />
    </motion.article>
  );
}

/* ————— Coverflow vitrin kartı (ortadaki büyük — mouse ile 3D eğilir) ————— */
function CoverCard({ p, color, active, onSelect }: { p: Project; color: string; active: boolean; onSelect: () => void }) {
  const ref = useRef<HTMLElement>(null);
  return (
    <article
      ref={ref}
      onClick={active ? undefined : onSelect}
      onMouseMove={(e) => {
        // Sadece ortadaki (aktif) kart, mouse'a göre 3D eğilir (masaüstü hissi).
        if (!active) return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(950px) rotateY(${(px * 12).toFixed(2)}deg) rotateX(${(-py * 9).toFixed(2)}deg) translateZ(26px)`;
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
      style={{ "--ac": color } as CSSProperties}
      className={`group/card relative flex h-[440px] flex-col overflow-hidden rounded-[22px] border bg-white text-[#141416] transition-[transform,box-shadow] duration-200 ease-out will-change-transform sm:h-[504px] ${
        active
          ? "cursor-default border-white shadow-[0_40px_100px_-36px_var(--ac)]"
          : "cursor-pointer border-white/40 shadow-[0_26px_64px_-32px_rgba(0,0,0,0.7)]"
      }`}
    >
      {/* görsel alan — kategori rengi deseni + CAD ızgara dokusu (hover'da yakınlaşır) */}
      <div className="relative h-[54%] overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-[650ms] ease-out group-hover/card:scale-[1.06]"
          style={{ background: `radial-gradient(circle at 28% 20%, ${color}66, transparent 60%), radial-gradient(circle at 82% 84%, ${color}36, transparent 55%), #0f1013` }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:26px_26px]" />
        <div className="absolute left-5 top-5 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-[0_8px_20px_-6px_var(--ac)]" style={{ background: color }}>
            <Icon name={CAT_ICON[p.cat]} size={20} />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/85">{p.cat}</span>
        </div>
        <span className="absolute right-5 top-5 font-mono text-[11px] tabular-nums text-white/55">{p.year}</span>
        <span aria-hidden className="pointer-events-none absolute -bottom-8 -right-1 font-display text-[8rem] font-bold leading-none text-white/[0.09]">{p.id}</span>
      </div>

      {/* içerik */}
      <div className="relative flex flex-1 flex-col p-7">
        <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight sm:text-[1.7rem]">{p.title}</h3>
        <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-[#141416]/70">{p.desc}</p>
        {active && (
          <a
            href={p.url ?? "#iletisim"}
            {...(p.url ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group/link mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold"
            style={{ color }}
          >
            {p.url ? "Siteyi aç" : "Projeyi gör"}
            <span aria-hidden className="transition-transform duration-300 group-hover/link:translate-x-1">↗</span>
          </a>
        )}
      </div>

      {active && <span className="absolute bottom-0 left-0 h-[3px] w-full" style={{ background: color }} />}
    </article>
  );
}

/* ————— Coverflow — sonsuz döngü, arka plan ışıması, nokta göstergeleri ————— */
function WorkCoverflow({ items }: { items: Project[] }) {
  const [idx, setIdx] = useState(0);
  const n = items.length;
  const go = (d: number) => setIdx((i) => i + d); // sınır yok → sonsuz döner
  const touchX = useRef<number | null>(null);
  // Mobilde kart daralır + yan kartlar öne çekilir → tek kart değil, iki yanda da
  // kart görünür. Masaüstünde geniş kartlar korunur.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (n === 0) return null;
  const cur = ((idx % n) + n) % n; // 0..n-1
  const activeColor = CAT_COLOR[items[cur].cat];

  // Nokta göstergesine tıklayınca en kısa yoldan o projeye döner.
  const goTo = (t: number) =>
    setIdx((i) => {
      const c = ((i % n) + n) % n;
      let diff = t - c;
      if (diff > n / 2) diff -= n;
      if (diff < -n / 2) diff += n;
      return i + diff;
    });

  return (
    <div className="mt-12">
      {/* Nokta göstergeleri — hangi projede olduğun belli olur */}
      <div className="mb-9 flex flex-wrap items-center justify-center gap-2.5">
        {items.map((p, i) => {
          const on = i === cur;
          return (
            <button key={p.id} type="button" onClick={() => goTo(i)} aria-label={`${i + 1}. projeye git`} className="flex h-4 items-center">
              <span
                className="h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: on ? 28 : 7, background: on ? CAT_COLOR[p.cat] : "currentColor", opacity: on ? 1 : 0.22 }}
              />
            </button>
          );
        })}
      </div>

      {/* Sahne + arka plan efekti */}
      <div className="relative">
        {/* aktif kategori renginde yumuşak ışıma + ince ızgara derinliği */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[background] duration-700 sm:h-[700px] sm:w-[700px]"
            style={{ background: `radial-gradient(circle, ${activeColor}33, transparent 62%)` }}
          />
          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:44px_44px]" />
        </div>

        {/* Sahne — merkeze yakın 5 kart; halka mantığıyla iki yanda da kart olur */}
        <div
          className="relative mx-auto flex h-[520px] items-center justify-center overflow-hidden sm:h-[600px]"
          style={{ perspective: "1700px" }}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          {items.map((p, i) => {
            let off = (((i - cur) % n) + n) % n;
            if (off > n / 2) off -= n;
            const abs = Math.abs(off);
            if (abs > 2) return null;
            const active = off === 0;
            // Mobilde: dar kart + az geri itme → yan kartlar net görünür (peek).
            const tx = narrow ? 54 : 47; // yana kaydırma (%)
            const tz = narrow ? 80 : 210; // geriye itme (px)
            const ry = narrow ? 20 : 26; // eğim (derece)
            const sc = narrow ? 0.1 : 0.07; // küçülme
            return (
              <div
                key={p.id}
                aria-hidden={!active}
                className="absolute left-1/2 top-1/2 transition-[transform,opacity] duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)] [will-change:transform]"
                style={{
                  width: narrow ? "62vw" : "min(90vw, 660px)",
                  transform: `translate(-50%,-50%) translateX(${off * tx}%) translateZ(${-abs * tz}px) rotateY(${-off * ry}deg) scale(${1 - abs * sc})`,
                  opacity: active ? 1 : abs === 1 ? 0.72 : 0.4,
                  zIndex: 20 - abs,
                  pointerEvents: abs > 1 ? "none" : "auto",
                }}
              >
                <CoverCard p={p} color={CAT_COLOR[p.cat]} active={active} onSelect={() => setIdx(idx + off)} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Kontroller: ok tuşları + sayaç (02 | 10) */}
      <div className="mt-10 flex items-center justify-center gap-6">
        <button type="button" onClick={() => go(-1)} aria-label="Önceki proje" className="flex h-12 w-12 items-center justify-center rounded-full border border-current/25 text-xl transition hover:-translate-x-0.5 hover:border-current/70 hover:bg-current/10 active:scale-95">
          <span aria-hidden>‹</span>
        </button>
        <div className="flex items-center gap-2.5 font-mono text-sm tabular-nums">
          <span>{String(cur + 1).padStart(2, "0")}</span>
          <span className="opacity-30">|</span>
          <span className="opacity-45">{String(n).padStart(2, "0")}</span>
        </div>
        <button type="button" onClick={() => go(1)} aria-label="Sonraki proje" className="flex h-12 w-12 items-center justify-center rounded-full border border-current/25 text-xl transition hover:translate-x-0.5 hover:border-current/70 hover:bg-current/10 active:scale-95">
          <span aria-hidden>›</span>
        </button>
      </div>
    </div>
  );
}

/* ————— Projeler 3D dönen halka (ortada AK logo, etrafında proje kartları) ————— */
function ProjectsOrbit({ items }: { items: Project[] }) {
  const [active, setActive] = useState(0);
  const [narrow, setNarrow] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const targetRef = useRef(0);
  const activeRef = useRef(0);
  const pausedRef = useRef(false);
  const dragRef = useRef<{ x: number; a: number } | null>(null);

  const n = items.length;
  const stepDeg = n > 0 ? 360 / n : 60;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const radius = narrow ? 185 : n <= 3 ? 260 : 370;

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (!pausedRef.current && !dragRef.current) targetRef.current += 0.08; // yavaş otomatik dönüş
      angleRef.current += (targetRef.current - angleRef.current) * 0.08;
      if (ringRef.current) ringRef.current.style.transform = `translateZ(${-radius}px) rotateY(${angleRef.current}deg)`;
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

  if (n === 0) return null;

  return (
    <div className="mt-10 select-none">
      <div
        className="relative mx-auto flex h-[440px] items-center justify-center overflow-hidden sm:h-[520px]"
        style={{ perspective: narrow ? "1000px" : "1300px" }}
        onPointerDown={(e) => {
          dragRef.current = { x: e.clientX, a: targetRef.current };
        }}
        onPointerMove={(e) => {
          if (dragRef.current) targetRef.current = dragRef.current.a + (e.clientX - dragRef.current.x) * 0.35;
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
        {/* merkez amblem — AK logon */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-current/15 bg-current/[0.03] sm:h-24 sm:w-24">
            <AKMark className="h-9 w-9 sm:h-11 sm:w-11" strokeWidth={2.2} />
          </div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] opacity-45">seçili işler</div>
        </div>

        {/* dönen halka */}
        <div ref={ringRef} className="relative h-full w-full [transform-style:preserve-3d]">
          {items.map((p, i) => {
            const on = i === active;
            const color = CAT_COLOR[p.cat];
            return (
              <div
                key={p.id}
                style={{ transform: `rotateY(${i * stepDeg}deg) translateZ(${radius}px)`, "--ac": color } as CSSProperties}
                className="absolute left-1/2 top-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 [backface-visibility:hidden] sm:w-[240px]"
              >
                <div
                  onClick={() => (on ? undefined : focus(i))}
                  className={`overflow-hidden rounded-2xl border bg-white text-[#141416] transition-[transform,box-shadow,opacity] duration-500 ${
                    on ? "scale-105 border-white opacity-100 shadow-[0_28px_60px_-28px_var(--ac)]" : "cursor-pointer border-white/30 opacity-45"
                  }`}
                >
                  <div className="relative h-28 overflow-hidden" style={{ background: `radial-gradient(circle at 30% 22%, ${color}66, transparent 60%), #101114` }}>
                    <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: color }}>
                      <Icon name={CAT_ICON[p.cat]} size={16} />
                    </div>
                    <span className="absolute right-3 top-3 font-mono text-[10px] tabular-nums text-white/60">{p.year}</span>
                    <span aria-hidden className="pointer-events-none absolute -bottom-5 right-0 font-display text-6xl font-bold leading-none text-white/[0.1]">{p.id}</span>
                  </div>
                  <div className="p-4">
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color }}>{p.cat}</span>
                    <h3 className="mt-1 font-display text-base font-bold leading-tight tracking-tight">{p.title}</h3>
                    {on && <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#141416]/70">{p.desc}</p>}
                    {on && (
                      <a
                        href={p.url ?? "#iletisim"}
                        {...(p.url ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color }}
                      >
                        {p.url ? "Siteyi aç" : "Projeyi gör"} <span aria-hidden>↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* kontroller */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <button type="button" onClick={() => go(1)} aria-label="Önceki proje" className="flex h-11 w-11 items-center justify-center rounded-full border border-current/25 text-lg transition hover:border-current/70 hover:bg-current/10 active:scale-95">
          <span aria-hidden>‹</span>
        </button>
        <div className="font-mono text-sm tabular-nums">
          <span>{String(active + 1).padStart(2, "0")}</span>
          <span className="opacity-30"> | </span>
          <span className="opacity-45">{String(n).padStart(2, "0")}</span>
        </div>
        <button type="button" onClick={() => go(-1)} aria-label="Sonraki proje" className="flex h-11 w-11 items-center justify-center rounded-full border border-current/25 text-lg transition hover:border-current/70 hover:bg-current/10 active:scale-95">
          <span aria-hidden>›</span>
        </button>
      </div>
    </div>
  );
}

export function Work({ items }: { items?: Project[] } = {}) {
  // DB'den gelen projeler (admin panelinden yönetilir); boşsa sabit listeye düşer.
  const data = items && items.length > 0 ? items : projects;
  const [cat, setCat] = useState<string>("Tümü");
  const filtered = cat === "Tümü" ? data : data.filter((p) => p.cat === cat);
  const countOf = (c: string) => (c === "Tümü" ? data.length : data.filter((p) => p.cat === c).length);
  const activeCats = CATEGORIES.filter((c) => c === "Tümü" || data.some((p) => p.cat === c));

  return (
    <section id="portfoy" className="relative px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <R>
          <span className="mb-3 block text-xs uppercase tracking-[0.4em] opacity-50">Portföy</span>
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">Seçili işlerim</h2>
            <span className="font-mono text-xs uppercase tracking-[0.3em] opacity-50">{filtered.length} proje</span>
          </div>
        </R>

        {/* kategori filtreleri */}
        <R delay={0.1}>
          <div className="mt-12 border-b border-current/15 pb-10">
            <span className="mb-4 block font-mono text-[11px] uppercase tracking-[0.3em] opacity-50">Kategori</span>
            <div className="flex flex-wrap gap-2.5">
              {activeCats.map((c) => {
                const on = cat === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCat(c)}
                    className={`inline-flex items-center gap-2.5 rounded-full border-2 px-5 py-2.5 text-sm transition-all duration-300 active:translate-y-0 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${
                      on
                        ? "border-current bg-current/15 opacity-100 shadow-[0_6px_20px_rgba(0,0,0,0.10)]"
                        : "border-current/20 opacity-55 hover:-translate-y-0.5 hover:border-current/60 hover:bg-current/[0.08] hover:opacity-100"
                    }`}
                  >
                    {c}
                    <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] tabular-nums transition-colors ${on ? "bg-current/25" : "bg-current/10"}`}>
                      {countOf(c)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </R>

        {/* kart ızgarası — kategori değişince tüm set yeniden mount olur (key=cat)
            → kartlar temizce sırayla belirir. ESKİDEN framer-motion `layout` +
            `popLayout` vardı: her filtrede tüm kartların konumu ölçülüp (reflow)
            kaydırılıyordu → mobilde "bağa girme"/takılma. Kaldırıldı; artık tek
            yönlü ucuz bir fade-in var, aynı görünüm ama reflow yok. */}
        {/* Coverflow vitrin — kategori değişince key ile sıfırlanır (idx=0) */}
        <WorkCoverflow key={cat} items={filtered} />
      </div>
    </section>
  );
}
