"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-16 w-16 animate-pulse rounded-full border border-border" />
      </div>
    ),
  }
);

export function Hero() {
  const [show3d, setShow3d] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow3d(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Hero ekrandan çıkınca 3D'yi durdur (aynı anda iki ağır WebGL sahnesi olmasın).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="anasayfa"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      {/* Sinematik vignette */}
      <div className="pointer-events-none absolute inset-0 -z-20 [background:radial-gradient(120%_120%_at_50%_28%,transparent_55%,rgba(0,0,0,0.65))]" />

      {/* Arkada DEV başlık (net, kırık beyaz) */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center font-display font-bold leading-[0.85] tracking-[-0.04em] text-foreground"
          style={{ fontSize: "clamp(3rem, 13vw, 11rem)" }}
        >
          ABDULLAH
          <br />
          KIRKIL
        </motion.h1>
      </div>

      {/* 3D'nin arkasında yumuşak koyu hale (başlıktan ayırır, 3D öne çıkar) */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-[5] h-[680px] w-[680px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-full [background:radial-gradient(circle,rgba(8,9,10,0.9)_32%,transparent_70%)]" />

      {/* Önde 3D — başlığın üstünde yüzer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
        className="relative z-10 aspect-square w-[min(88vw,620px)]"
      >
        {show3d && heroVisible ? (
          <HeroScene />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-16 w-16 animate-pulse rounded-full border border-border" />
          </div>
        )}
      </motion.div>

      {/* Üst etiket */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
        className="absolute inset-x-0 top-28 z-20 flex justify-center"
      >
        <span className="text-xs uppercase tracking-[0.4em] text-muted">
          Mühendislik &nbsp;+&nbsp; Dijital Üretim
        </span>
      </motion.div>

      {/* Alt: slogan + CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
        className="absolute inset-x-0 bottom-16 z-20 flex flex-col items-center gap-6 px-6 text-center"
      >
        <p className="max-w-md text-base leading-7 text-muted sm:text-lg">
          Metalden piksele, her şey tek elden — 3D tasarım, CNC, video ve modern web.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/#iletisim"
            className="rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition hover:bg-accent-strong"
          >
            İletişime geç
          </Link>
          <Link
            href="/#vitrin"
            className="rounded-full border border-border px-7 py-3 text-sm font-medium text-foreground transition hover:border-foreground/40 hover:bg-surface"
          >
            Hizmetleri keşfet
          </Link>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 text-xs text-muted">
        <span className="inline-block animate-bounce">↓</span>
      </div>
    </section>
  );
}
