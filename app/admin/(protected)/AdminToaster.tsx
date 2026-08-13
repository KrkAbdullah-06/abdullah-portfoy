"use client";

import { useEffect, useState } from "react";

// Bir kayıt/güncelleme yapıldığında "Güncelleme kaydedildi" bildirimi gösterir.
// Formlar submit anında `window` üzerinde "admin:saved" olayı yayınlar.
export function AdminToaster() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onSaved = () => {
      setShow(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShow(false), 2600);
    };
    window.addEventListener("admin:saved", onSaved);
    return () => {
      window.removeEventListener("admin:saved", onSaved);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-5 py-2.5 text-sm font-medium text-emerald-300 backdrop-blur">
        <span aria-hidden>✓</span> Güncelleme kaydedildi
      </div>
    </div>
  );
}
