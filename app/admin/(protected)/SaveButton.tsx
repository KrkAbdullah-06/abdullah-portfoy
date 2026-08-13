"use client";

// Kaydet butonu — form gönderilince "admin:saved" bildirimini tetikler.
export function SaveButton({ children = "Kaydet", className }: { children?: React.ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      onClick={() => window.dispatchEvent(new CustomEvent("admin:saved"))}
      className={className ?? "rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90"}
    >
      {children}
    </button>
  );
}
