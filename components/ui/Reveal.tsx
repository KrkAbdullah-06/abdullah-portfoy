"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Küçük yardımcı: içindeki içerik ekrana girince aşağıdan yukarı yumuşakça belirir.
// Sayfadaki bölümleri sarmalayarak premium bir scroll hissi veriyoruz.
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
