"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

type Project = {
  title: string;
  category: string;
  desc: string;
};

// Örnek projeler — Aşama 4'te admin panelinden gerçek işlerinle değiştireceğiz.
const projects: Project[] = [
  {
    title: "Endüstriyel Redüktör Gövdesi",
    category: "3D Tasarım",
    desc: "SolidWorks ile parametrik gövde modeli ve teknik resim.",
  },
  {
    title: "CNC Freze Parçası",
    category: "CNC",
    desc: "SolidCAM ile takım yolu planlama ve üretime hazırlık.",
  },
  {
    title: "Dişli Mekanizması Montajı",
    category: "3D Tasarım",
    desc: "Hareketli montaj ve çakışma (interference) analizi.",
  },
  {
    title: "Ürün Tanıtım Videosu",
    category: "Video",
    desc: "Sinematik kurgu, renk ve ses düzenlemesi.",
  },
  {
    title: "Sosyal Medya Reels Serisi",
    category: "Video",
    desc: "Markayı öne çıkaran kısa video içerik üretimi.",
  },
  {
    title: "Kurumsal Web Sitesi",
    category: "Web",
    desc: "Next.js ile hızlı, modern ve yönetilebilir kurumsal site.",
  },
];

export function Portfolio() {
  const categories = useMemo(
    () => ["Tümü", ...Array.from(new Set(projects.map((p) => p.category)))],
    []
  );
  const [active, setActive] = useState("Tümü");

  const filtered =
    active === "Tümü"
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <section id="portfolyo" className="scroll-mt-24 border-t border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-gold">
            Portföy
          </p>
          <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Seçili işlerim
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted">
            Farklı alanlardan projeler. Kategoriye göre filtreleyebilirsiniz.
          </p>
        </Reveal>

        {/* Filtre butonları */}
        <Reveal className="mt-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                active === cat
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted hover:border-accent/40 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </Reveal>

        {/* Proje ızgarası */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.article
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="group overflow-hidden rounded-2xl border border-border bg-surface/40"
              >
                {/* Görsel yeri (şimdilik marka renkli desenli alan) */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-surface-2 to-background">
                  <div className="absolute inset-0 opacity-40 transition-transform duration-500 group-hover:scale-105 [background:radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.25),transparent_60%),radial-gradient(circle_at_75%_70%,rgba(232,166,60,0.18),transparent_55%)]" />
                  <span className="absolute left-4 top-4 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted backdrop-blur">
                    {project.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {project.desc}
                  </p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
