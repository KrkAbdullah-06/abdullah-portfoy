"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

// Masaüstüne "akıcı/kayar gibi" premium kaydırma hissi verir (Lenis).
// MOBİLDE KAPALI: Lenis mobilde scroll'u ANA iş parçacığında yürütüyor; çark +
// reveal animasyonlarıyla çakışınca takılma hissi veriyordu. Native mobil scroll
// compositor iş parçacığında (ayrı) çalışır → çok daha akıcı. __lenis global'i
// mobilde undefined kalır; tüketiciler (goTo/startNav) native'e düşer (fallback var).
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) return;
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });
    // Menü linkleri ve programatik kaydırma için erişilebilir yapıyoruz
    window.__lenis = lenis;

    let frame: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return null;
}
