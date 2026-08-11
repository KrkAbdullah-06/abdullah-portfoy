"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { Services } from "./Services";
import { CadIntro } from "./CadIntro";
import { Marquee, About, Process, Work } from "./Sections";
import { AKMark } from "@/components/brand/AKMark";
import { ContactPanel } from "./ContactPanel";

const BackgroundStage = dynamic(
  () => import("./BackgroundStage").then((m) => m.BackgroundStage),
  { ssr: false }
);

// Zemin siyah↔beyaz geçişi KONUM tabanlı: portföy + iletişim bölümleri
// ekranı kaplarken beyaz, öncesi/sonrası (footer) koyu. Bölüm yükseklikleri
// (ör. çok uzun Hizmetler) değişse de doğru çalışır.
const darkBg = new THREE.Color("#08090a");
const lightBg = new THREE.Color("#f4f5f6");


function smoothstep(x: number) {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
} as const;

// Tıklanabilir öğeler için ortak etkileşim: hover'da alt çizgi soldan büyür,
// basınca hafif geri tepki, klavyeyle gezerken görünür odak halkası.
const linkFx =
  "relative inline-block py-0.5 transition-[opacity,transform] duration-200 hover:-translate-y-0.5 hover:opacity-100 active:translate-y-0 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100";

export function Experience() {
  const progress = useRef(0);
  // Açılış (CadIntro) ekranı ekranı OPAK kaplarken arkadaki 3D çark GÖRÜNMEZ ama
  // yine de çiziliyordu (mobilde en büyük israf). Bu bayrak, çark görünür hale
  // gelmeye yakın true olur → BackgroundStage o ana kadar render'ı DURAKLATIR.
  const gearActive = useRef(true);
  // İletişime yaklaşma (0→1): portföyden sonra iletişim bölümü ekrana yaklaşırken
  // artar → çark "ışınlanma zoom"u tam bu geçişte tetiklenir.
  const warp = useRef(0);
  const bgColor = useRef(new THREE.Color("#08090a"));
  const pageBg = useRef<HTMLDivElement>(null);
  const headerBlurRef = useRef<HTMLDivElement>(null);
  const [light, setLight] = useState(false);
  // Çark HER CİHAZDA var (temanın kalbi) ama mobilde HAFİFLETİLMİŞ ayarlarla
  // çalışır (bkz. BackgroundStage: düşük dpr, antialias kapalı, hafif env).
  // ready: doğru ayarla tek seferde mount etmek için.
  const [gfx, setGfx] = useState({ ready: false, mobile: false });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => setGfx({ ready: true, mobile: mq.matches });
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  const [transActive, setTransActive] = useState(false);
  const transRef = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Sinematik CAD açılışı sürerken üst menü gizli (immersif + beyaz ekranda
  // beyaz yazı sorununu önler). İntro'nun kararma kısmına gelince geri gelir.
  const [headerHidden, setHeaderHidden] = useState(true);

  // menü açıkken arkadaki sayfa kaymasın
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Sayfa içi geçiş: beyaz overlay + ortada siyah 3D çark, sonra hedefe kayar.
  const goTo = (id: string) => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number | HTMLElement, o?: { immediate?: boolean }) => void } }).__lenis;
    if (id === "top") {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { immediate: true });
    else el.scrollIntoView();
  };

  const startNav = (id: string) => {
    if (transRef.current) return;
    setMenuOpen(false);
    transRef.current = true;
    setTransActive(true);
    window.setTimeout(() => goTo(id), 430); // örtü kapandı, hedefe sessizce kay
    window.setTimeout(() => setTransActive(false), 1080); // bar doldu → aç (reveal)
    window.setTimeout(() => {
      transRef.current = false;
    }, 1650);
  };

  // PERFORMANS / MOBİL AKICILIK: Progress ve zemin rengini scroll OLAYINDAN değil,
  // SÜREKLİ rAF döngüsünden window.scrollY okuyarak güncelliyoruz. Sebep: iOS/mobil
  // parmakla kaydırırken (momentum) scroll olayı GÖNDERMEZ ama scrollY her an
  // doğrudur → olaya bağlıyken çark zıplayarak iniyor, renk sıçrayarak değişiyordu.
  // Her karede scrollY okumak ucuzdur (layout tetiklemez); konumlar önbellekte.
  useEffect(() => {
    let raf = 0;
    const layout = { portfoyTop: 0, footerTop: 0, introTop: 0, introH: 0, iletisimTop: 0, max: 1 };
    let lastBg = "";
    let lastLight = false;
    let lastHeaderHidden = true;
    let lastHeaderBlur = "";

    const measure = () => {
      const sy = window.scrollY;
      const portfoy = document.getElementById("portfoy");
      const footer = document.querySelector("footer");
      const intro = document.getElementById("intro");
      const iletisim = document.getElementById("iletisim");
      layout.portfoyTop = portfoy ? portfoy.getBoundingClientRect().top + sy : 0;
      layout.footerTop = footer ? footer.getBoundingClientRect().top + sy : 0;
      layout.introTop = intro ? intro.getBoundingClientRect().top + sy : 0;
      layout.introH = intro ? intro.offsetHeight : 0;
      layout.iletisimTop = iletisim ? iletisim.getBoundingClientRect().top + sy : 0;
      layout.max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    const frame = () => {
      const sy = window.scrollY;
      const vh = window.innerHeight;
      // Çark ilerlemesi intro BİTTİKTEN sonra başlar → intro boyunca çark doğuş
      // pozunda (ismin üstünde, yatay/ortada) durur, sağdan gelmez. Sonra iner.
      const introEnd = layout.introTop + Math.max(1, layout.introH - vh);
      progress.current = Math.min(1, Math.max(0, (sy - introEnd) / Math.max(1, layout.max - introEnd)));

      // Çark, açılışın son ~%18'ine gelince (devir anına yakın) render'a başlar;
      // öncesinde opak açılış ekranının arkasında görünmediği için çizilmez →
      // açılış boyunca GPU tamamen açılış animasyonuna kalır (mobil kasma çözümü).
      gearActive.current = layout.introH > 0 ? sy + vh > layout.introTop + layout.introH * 0.82 : true;

      // IŞINLANMA ZOOM ilerlemesi: iletişim bölümü ekranın üstüne ~1.1 ekran kala
      // başlar, bölüm tepeye gelince (0.15 ekran kala) tamamlanır → portföyden
      // sonra kaydırınca çark adım adım büyür, iletişimde en büyük halini alır.
      if (layout.iletisimTop > 0) {
        const peakY = layout.iletisimTop; // zirve: iletişim bölümü ekranın tepesinde
        // Yaklaşırken 0→1 (çark büyür), zirveyi geçince 1→0 (çark arkaya çekilip
        // normal scroll inişine devam eder). Zirvede tam zoom = "havalı geçiş".
        const up = Math.min(1, Math.max(0, (sy - (peakY - vh * 1.1)) / (vh * 1.1)));
        const down = Math.min(1, Math.max(0, (sy - peakY) / (vh * 0.9)));
        warp.current = up * (1 - down);
      } else {
        warp.current = 0;
      }

      const enter = smoothstep((vh - (layout.portfoyTop - sy)) / vh);
      const exit = smoothstep((vh - (layout.footerTop - sy)) / (0.55 * vh));
      const t = Math.max(0, Math.min(1, enter - exit));

      bgColor.current.copy(darkBg).lerp(lightBg, t);
      const css = bgColor.current.getStyle();
      if (pageBg.current && css !== lastBg) {
        pageBg.current.style.backgroundColor = css;
        lastBg = css;
      }
      const lt = t > 0.5;
      if (lt !== lastLight) {
        setLight(lt);
        lastLight = lt;
      }

      // İntro'nun sinematik (parlak) kısmında header gizli; kararmaya (~%74)
      // geçince geri gelir. İntro yoksa header her zaman görünür.
      const pIntro = (sy - layout.introTop) / Math.max(1, layout.introH - vh);
      const hh = layout.introH > 0 ? pIntro < 0.74 : false;
      if (hh !== lastHeaderHidden) {
        setHeaderHidden(hh);
        lastHeaderHidden = hh;
      }

      // Header arkası: zemin KOYUYKEN blur YOK (şeffaf). Zemin BEYAZA dönerken
      // (Portföy/İletişim) koyu blur belirir — o bölgede kart/başlık gibi içerik
      // altından geçtiğinde yazı okunaklı kalsın diye. `t` zaten zemin geçiş
      // oranı (0=koyu, 1=beyaz) → aynı orana bağlamak en doğal geçişi verir.
      const headerBlurStr = String(t);
      if (headerBlurRef.current && headerBlurStr !== lastHeaderBlur) {
        headerBlurRef.current.style.opacity = headerBlurStr;
        lastHeaderBlur = headerBlurStr;
      }

      raf = requestAnimationFrame(frame);
    };

    measure();
    raf = requestAnimationFrame(frame);
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main
      className={`relative transition-colors duration-700 ${
        light ? "text-[#0a0b0c]" : "text-foreground"
      }`}
    >
      {/* Sayfa geçişi — akışkan koyu blur (opacity) + üstte dolma barı + ortada 3D logo.
          (canvas sürekli mount → hitch yok; opak blur → arka sayfa zıplaması gizli) */}
      <div className={`fixed inset-0 z-[90] ${transActive ? "" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-[#0a0b0d]/97 transition-opacity duration-[400ms] ease-out sm:bg-[#0a0b0d]/92 sm:backdrop-blur-xl ${
            transActive ? "opacity-100" : "opacity-0"
          }`}
          style={{ willChange: "opacity" }}
        />
        {/* üstten dolma barı (monokrom — koyu zeminde açık) */}
        <div className={`absolute inset-x-0 top-0 h-[3px] overflow-hidden bg-white/10 transition-opacity duration-300 ${transActive ? "opacity-100" : "opacity-0"}`}>
          <div
            className="h-full bg-white"
            style={{ width: transActive ? "100%" : "0%", transition: transActive ? "width 950ms cubic-bezier(0.4,0,0.2,1)" : "none" }}
          />
        </div>
        {/* ortada İSİM — tek satır, zarif, maskeden yükselir */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="overflow-hidden">
            <div
              className={`font-display text-xl font-semibold tracking-tight text-white transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-3xl ${
                transActive ? "translate-y-0" : "translate-y-full"
              }`}
            >
              ABDULLAH KIRKIL
            </div>
          </div>
          <div
            className={`mt-3 font-mono text-[9px] uppercase tracking-[0.4em] text-white/55 transition-opacity duration-500 sm:text-[10px] ${
              transActive ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: transActive ? "220ms" : "0ms" }}
          >
            Tasarım · Üretim · Web
          </div>
        </div>
      </div>

      {/* Mobil tam ekran menü */}
      <div
        className={`fixed inset-0 z-[95] flex flex-col justify-center bg-[#08090a] px-8 transition-opacity duration-300 sm:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex flex-col">
          {[
            { id: "hizmetler", t: "Hizmetler" },
            { id: "portfoy", t: "Portföy" },
            { id: "iletisim", t: "İletişim" },
          ].map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => startNav(m.id)}
              style={{ transitionDelay: menuOpen ? `${120 + i * 70}ms` : "0ms" }}
              className={`flex items-center justify-between border-b border-white/10 py-6 text-left transition-all duration-500 ease-out active:scale-95 ${
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <span className="font-display text-4xl font-bold tracking-tight text-white">{m.t}</span>
              <span className="text-lg text-white/40" aria-hidden>↗</span>
            </button>
          ))}
        </nav>
        <div className="mt-12 flex flex-col gap-2 text-sm text-white/60">
          <a href="mailto:kirkilabdullah33@gmail.com" className="transition-colors hover:text-white">kirkilabdullah33@gmail.com</a>
          <a href="https://wa.me/905539525051?text=Merhaba%20Abdullah%2C%20web%20sitenizden%20yaz%C4%B1yorum." target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">0553 952 50 51 · WhatsApp</a>
          <span className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-white/35">Ankara / Niğde</span>
        </div>
      </div>

      {/* Zemin rengi (koyu↔beyaz) — CSS katmanı, her cihazda çalışır */}
      <div ref={pageBg} className="fixed inset-0 -z-20" style={{ backgroundColor: "#08090a" }} />

      {/* Sabit 3D arka plan (mat çark) — HER CİHAZDA, mobilde hafif ayarlarla */}
      {gfx.ready && (
        <div className="fixed inset-0 -z-10">
          <BackgroundStage progress={progress} bgColor={bgColor} mobile={gfx.mobile} active={gearActive} warp={warp} />
        </div>
      )}

      {/* Global doku: ince ızgara + yumuşak ışık haleleri (site hiç boş durmasın) */}
      <div className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:70px_70px]" />
        <div className="absolute left-[8%] top-[12%] h-[45vw] w-[45vw] rounded-full bg-current/[0.04] blur-[120px]" />
        <div className="absolute bottom-[6%] right-[6%] h-[38vw] w-[38vw] rounded-full bg-current/[0.05] blur-[130px]" />
      </div>

      {/* Üst menü: sayfa en üstteyken (giriş) şeffaf. Kaydırmaya başlayınca
          arkasına koyu blur zemin gelir → altından geçen kart/başlık gibi
          içerik olsa da yazı her zaman okunur (eskiden mix-blend-difference
          kullanıyordu ama karışık içerik üstünde bazen okunmuyordu). Blur zaten
          hep koyu olduğundan yazı hep beyaz — zemin koyu/beyaz fark etmez. */}
      <header className={`fixed inset-x-0 top-0 transition-[opacity,transform] duration-500 ease-out ${menuOpen ? "z-[96]" : "z-50"} ${headerHidden && !menuOpen ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>
        {/* MOBİL PERFORMANS: mobilde blur yok, daha opak zemin (bkz. ContactPanel'deki aynı desen) */}
        <div ref={headerBlurRef} className="absolute inset-0 -z-10 bg-black/85 sm:bg-black/55 sm:backdrop-blur-md" style={{ opacity: 0 }} />
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-white">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); startNav("top"); }}
            className="group flex items-center gap-2.5 font-display text-sm font-semibold tracking-wide transition-[opacity,transform] duration-200 hover:opacity-75 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
          >
            <span className="transition-transform duration-500 ease-out group-hover:rotate-[10deg] group-hover:scale-110">
              <AKMark className="h-6 w-6" strokeWidth={3.4} />
            </span>
            ABDULLAH KIRKIL
          </a>
          <nav className="hidden gap-8 text-[11px] uppercase tracking-[0.25em] sm:flex">
            <a href="#hizmetler" onClick={(e) => { e.preventDefault(); startNav("hizmetler"); }} className={linkFx}>Hizmetler</a>
            <a href="#portfoy" onClick={(e) => { e.preventDefault(); startNav("portfoy"); }} className={linkFx}>Portföy</a>
            <a href="#iletisim" onClick={(e) => { e.preventDefault(); startNav("iletisim"); }} className={linkFx}>İletişim</a>
          </nav>

          {/* Mobil menü butonu (hamburger ↔ X) */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={menuOpen}
            className="relative flex h-10 w-10 items-center justify-center transition-transform duration-200 active:scale-90 sm:hidden"
          >
            <span className={`absolute h-[1.5px] w-6 rounded-full bg-current transition-transform duration-300 ease-out ${menuOpen ? "rotate-45" : "-translate-y-[5px]"}`} />
            <span className={`absolute h-[1.5px] w-6 rounded-full bg-current transition-opacity duration-200 ${menuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute h-[1.5px] w-6 rounded-full bg-current transition-transform duration-300 ease-out ${menuOpen ? "-rotate-45" : "translate-y-[5px]"}`} />
          </button>
        </div>
      </header>

      {/* 0 — Sinematik CAD açılışı (scroll ile çark modellenir → 3D çarka devreder) */}
      <CadIntro />

      {/* 1 — Giriş */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <span className="mb-6 text-xs uppercase tracking-[0.4em] opacity-70">
          Mühendislik &nbsp;+&nbsp; Dijital Üretim
        </span>
        <h1
          className="font-display font-bold leading-[0.9] tracking-[-0.04em] text-white mix-blend-difference"
          style={{ fontSize: "clamp(3rem, 11vw, 9rem)" }}
        >
          ABDULLAH
          <br />
          KIRKIL
        </h1>
        <p className="mt-8 max-w-md text-sm leading-6 opacity-60 sm:text-base">
          Mekanik tasarımdan mobil uygulamaya — altı alanda, tek elden, uçtan uca üretim.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[11px] uppercase tracking-[0.25em] opacity-45">
          <span>3D &amp; Mekanik</span>
          <span className="opacity-40">✦</span>
          <span>CNC</span>
          <span className="opacity-40">✦</span>
          <span>Video</span>
          <span className="opacity-40">✦</span>
          <span>Sosyal</span>
          <span className="opacity-40">✦</span>
          <span>Web</span>
          <span className="opacity-40">✦</span>
          <span>Mobil</span>
        </div>
        <span className="absolute bottom-10 animate-bounce text-xs opacity-60">↓</span>
      </section>

      {/* Kayan yazı bandı */}
      <Marquee />

      {/* 2 — Manifesto */}
      <section className="relative flex min-h-screen items-center justify-center px-6">
        <motion.p
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl text-center font-display leading-tight tracking-tight text-white mix-blend-difference"
          style={{ fontSize: "clamp(1.6rem, 4.5vw, 3.2rem)" }}
        >
          Metalden piksele — tasarlıyor, üretiyor, yayınlıyorum.
        </motion.p>
      </section>

      {/* Hakkımda */}
      <About />

      {/* Hizmetler */}
      <Services />

      {/* Süreç */}
      <Process />

      {/* Portföy (görselli ızgara) */}
      <Work />

      {/* İletişim — sinematik CTA */}
      <section id="iletisim" className="relative flex min-h-[88vh] flex-col justify-center px-6 py-24 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
            </span>
            <span className="text-xs uppercase tracking-[0.35em] opacity-70">Yeni projelere açık</span>
          </motion.div>

          <motion.h2
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="mt-8 font-display font-bold leading-[0.95] tracking-tight text-white mix-blend-difference"
            style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
          >
            Bir fikrin mi var?
            <br />
            Hayata geçirelim.
          </motion.h2>

          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="mt-12">
            <a
              href="mailto:kirkilabdullah33@gmail.com"
              className="group inline-flex items-center gap-4 transition-transform duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
            >
              <span className="font-display font-semibold tracking-tight underline-offset-[10px] group-hover:underline" style={{ fontSize: "clamp(1.25rem, 3.5vw, 2.4rem)" }}>
                kirkilabdullah33@gmail.com
              </span>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-current/40 transition-transform duration-300 group-hover:rotate-45 sm:h-14 sm:w-14">↗</span>
            </a>
          </motion.div>

          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="mt-16 grid gap-8 border-t border-current/15 pt-10 sm:grid-cols-3">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] opacity-50">WhatsApp</div>
              <a href="https://wa.me/905539525051?text=Merhaba%20Abdullah%2C%20web%20sitenizden%20yaz%C4%B1yorum." target="_blank" rel="noopener noreferrer" className={`${linkFx} mt-2 font-display text-lg font-semibold`}>0553 952 50 51</a>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.28em] opacity-50">Konum</div>
              <div className="mt-2 font-display text-lg font-semibold">Ankara / Niğde</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.28em] opacity-50">Yanıt Süresi</div>
              <div className="mt-2 font-display text-lg font-semibold">24 saat içinde</div>
            </div>
          </motion.div>

          {/* mesaj formu + sosyal hesaplar */}
          <ContactPanel />
        </div>
      </section>

      {/* 6 — Footer (karanlık, sade) */}
      <footer className="relative flex min-h-[55vh] flex-col justify-end px-6 pb-14 pt-20 sm:px-10">
        <div className="mx-auto w-full max-w-6xl border-t border-current/10 pt-12">
          <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
            <div>
              <div className="font-display text-lg font-semibold">Abdullah Kırkıl</div>
              <p className="mt-2 max-w-xs text-sm opacity-60">
                Mekanik tasarım · CNC · video · sosyal medya · web · mobil uygulama
              </p>
            </div>
            <div className="flex gap-14 text-sm">
              <div className="flex flex-col items-start gap-2">
                <span className="mb-1 text-xs uppercase tracking-[0.25em] opacity-50">Menü</span>
                <a href="#hizmetler" onClick={(e) => { e.preventDefault(); startNav("hizmetler"); }} className={`${linkFx} opacity-75`}>Hizmetler</a>
                <a href="#portfoy" onClick={(e) => { e.preventDefault(); startNav("portfoy"); }} className={`${linkFx} opacity-75`}>Portföy</a>
                <a href="#iletisim" onClick={(e) => { e.preventDefault(); startNav("iletisim"); }} className={`${linkFx} opacity-75`}>İletişim</a>
              </div>
              <div className="flex flex-col items-start gap-2">
                <span className="mb-1 text-xs uppercase tracking-[0.25em] opacity-50">İletişim</span>
                <a href="mailto:kirkilabdullah33@gmail.com" className={`${linkFx} opacity-75`}>E-posta</a>
                <a href="https://wa.me/905539525051?text=Merhaba%20Abdullah%2C%20web%20sitenizden%20yaz%C4%B1yorum." target="_blank" rel="noopener noreferrer" className={`${linkFx} opacity-75`}>WhatsApp</a>
                <span className="py-0.5 opacity-75">Ankara / Niğde</span>
              </div>
            </div>
          </div>
          <div className="mt-12 text-xs opacity-50">
            © {new Date().getFullYear()} Abdullah Kırkıl. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </main>
  );
}
