"use client";

import { useEffect, useRef } from "react";

export type BgVariant = "web" | "3d" | "cnc" | "video" | "sosyal";

// Kod ile üretilen, sahneye özel animasyonlu arka plan (Canvas 2D — hafif).
// Performans için SADECE aktif sahne animasyon yapar (active=false ise durur).
export function AnimatedBackground({
  variant,
  active,
}: {
  variant: BgVariant;
  active: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = performance.now();

    // --- CNC: aşağıdan yükselen amber kıvılcımlar/közler ---
    if (variant === "cnc") {
      type Spark = {
        x: number;
        y: number;
        vx: number;
        vy: number;
        life: number;
        max: number;
        size: number;
      };
      const sparks: Spark[] = [];
      const spawn = () => {
        const x = w * (0.28 + Math.random() * 0.44);
        const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.0;
        const s = 40 + Math.random() * 130;
        sparks.push({
          x,
          y: h + 6,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - 40,
          life: 0,
          max: 1.1 + Math.random() * 1.6,
          size: 1 + Math.random() * 2,
        });
      };

      const loop = (t: number) => {
        const dt = Math.min((t - last) / 1000, 0.05);
        last = t;

        // İz bırakan koyu katman (sinematik derinlik)
        ctx.fillStyle = "rgba(13,16,22,0.22)";
        ctx.fillRect(0, 0, w, h);

        // Alt kısımda sıcak amber parıltı
        const g = ctx.createRadialGradient(w / 2, h, 0, w / 2, h, h * 0.7);
        g.addColorStop(0, "rgba(232,166,60,0.16)");
        g.addColorStop(1, "rgba(232,166,60,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < 3; i++) if (Math.random() < 0.7) spawn();

        ctx.globalCompositeOperation = "lighter";
        for (let i = sparks.length - 1; i >= 0; i--) {
          const p = sparks[i];
          p.life += dt;
          if (p.life > p.max) {
            sparks.splice(i, 1);
            continue;
          }
          p.vy += 130 * dt; // yerçekimi
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          const k = 1 - p.life / p.max;
          ctx.beginPath();
          ctx.fillStyle = `rgba(255,${175 + Math.floor(55 * k)},90,${0.65 * k})`;
          ctx.arc(p.x, p.y, p.size * (0.5 + k), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";

        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [variant, active]);

  return (
    <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" />
  );
}
