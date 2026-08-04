// Siteye özel logo: ince ÇEMBER içinde zarif "AK" ligatür monogram — A ve K
// ortak dikey gövdeyi paylaşır. Düz/mat, currentColor. Tek kaynak (header,
// footer, açılış, favicon, hakkımda-mobil). Hakkımda masaüstünde 3D dönen sürüm.
export function AKMark({ className, strokeWidth = 4 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="50" cy="50" r="44" strokeWidth={strokeWidth * 0.62} />
      <path d="M49 26 V74" />
      <path d="M31 74 L49 26" />
      <path d="M37 55 H49" />
      <path d="M49 50 L69 30" />
      <path d="M49 50 L69 74" />
    </svg>
  );
}
