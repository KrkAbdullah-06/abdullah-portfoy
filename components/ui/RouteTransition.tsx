"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const CuttingScene = dynamic(
  () => import("@/components/three/CuttingScene").then((m) => m.CuttingScene),
  { ssr: false }
);

// Sayfalar arası geçişte kısa bir kesim/kıvılcım animasyonu oynatır.
export function RouteTransition() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const isFirst = useRef(true);

  useEffect(() => {
    // İlk yüklemede oynatma (onu açılış ekranı hallediyor)
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    setShow(true);
    const timer = setTimeout(() => setShow(false), 1100);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="route-transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed inset-0 z-[90] bg-background"
        >
          <div className="absolute inset-0">
            <CuttingScene />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
