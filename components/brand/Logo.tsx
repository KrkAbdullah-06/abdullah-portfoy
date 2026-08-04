// Abdullah Kırkıl markası — "Ligatür + Halka" AK monogramı.
// LogoMark: sadece işaret (favicon/küçük kullanım).
// Logo: işaret + "Abdullah Kırkıl" yazısı (kilit / lockup).
// Renkler CSS değişkenlerinden gelir; koyu/açık temaya uyum sağlar.

type LogoMarkProps = {
  size?: number;
  className?: string;
};

export function LogoMark({ size = 34, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Hassasiyet halkası + tepede amber tik */}
      <circle
        cx="32"
        cy="33"
        r="26"
        stroke="var(--foreground)"
        strokeOpacity="0.18"
        strokeWidth="1.5"
      />
      <line
        x1="32"
        y1="5"
        x2="32"
        y2="11"
        stroke="var(--gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* A ve K'nın dış çizgileri */}
      <g
        stroke="var(--foreground)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 52 L32 15" />
        <path d="M25 37 L32 37" />
        <path d="M32 34 L46 17" />
        <path d="M32 34 L46 52" />
      </g>
      {/* Ortak gövde (A'nın sağ kenarı = K'nın omurgası) — mavi vurgu */}
      <path
        d="M32 15 L32 52"
        stroke="var(--accent)"
        strokeWidth="3.8"
        strokeLinecap="round"
      />
      {/* Birleşme noktası — amber */}
      <circle cx="32" cy="34" r="2.6" fill="var(--gold)" />
    </svg>
  );
}

type LogoProps = {
  withWordmark?: boolean;
  className?: string;
};

export function Logo({ withWordmark = true, className }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark size={34} />
      {withWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight text-foreground">
          Abdullah <span className="text-accent">Kırkıl</span>
        </span>
      )}
    </span>
  );
}
