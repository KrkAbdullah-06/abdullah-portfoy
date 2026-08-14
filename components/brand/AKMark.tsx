// Siteye özel logo: WEB (dünya) + MOBİL/AYARLAR (telefon) + MÜHENDİSLİK (dişli)
// birleşik amblem — Abdullah'ın tüm çalışma alanları. Monoline, currentColor.
// Dünya, telefon ve dişlinin arkasında maskeyle "kesilir" (temiz örtüşme, her
// zeminde çalışır). Tek kaynak (header, footer, açılış, orbit merkezi).
export function AKMark({ className }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <defs>
        <mask id="ak-knock">
          <rect width="100" height="100" fill="white" />
          <rect x="15" y="29" width="35" height="54" rx="9" fill="black" />
          <circle cx="72" cy="67" r="22" fill="black" />
        </mask>
      </defs>

      {/* Dünya (web) — telefon ve dişlinin arkasında maskelenir */}
      <g mask="url(#ak-knock)">
        <circle cx="55" cy="43" r="25" />
        <path d="M55 18 V68" />
        <path d="M30 43 H80" />
        <ellipse cx="55" cy="43" rx="12" ry="25" />
        <path d="M34 29 H76" />
        <path d="M34 57 H76" />
      </g>

      {/* Telefon + ayar sürgüleri (mobil/otomasyon) */}
      <rect x="21" y="34" width="24" height="45" rx="5" />
      <g strokeWidth="4">
        <path d="M26 47 H40" />
        <path d="M26 57 H40" />
        <path d="M26 67 H40" />
      </g>
      <g fill="currentColor" stroke="none">
        <circle cx="30" cy="47" r="2.7" />
        <circle cx="37" cy="57" r="2.7" />
        <circle cx="33" cy="67" r="2.7" />
      </g>

      {/* Dişli (mühendislik) */}
      <circle cx="72" cy="67" r="12.5" />
      <circle cx="72" cy="67" r="4.5" />
      <g strokeWidth="4.5">
        <path d="M72 51 V55.5" />
        <path d="M72 78.5 V83" />
        <path d="M56 67 H60.5" />
        <path d="M83.5 67 H88" />
        <path d="M60.7 55.7 L63.9 58.9" />
        <path d="M80.1 74.1 L83.3 77.3" />
        <path d="M83.3 55.7 L80.1 58.9" />
        <path d="M63.9 75.1 L60.7 78.3" />
      </g>
    </svg>
  );
}
