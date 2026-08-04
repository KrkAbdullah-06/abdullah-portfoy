"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// İletişim alt paneli: solda ziyaretçi FORMU, sağda sosyal hesaplar.
// ÖNEMLİ: Bu bölüm zeminin AÇIK→KOYU döndüğü bölgeye denk geliyor. Bu yüzden
// kartlar currentColor'a BAĞLI DEĞİL; kendi kendine yeten KOYU CAM panel
// (sabit koyu zemin + açık yazı + backdrop-blur) → hem aydınlık hem karanlık
// alanda her zaman tam ve okunur. Form şimdilik mailto ile çalışır (sunucu yok);
// Aşama 3'te API route + Resend ile doğrudan gönderime çevrilebilir.

const MAIL = "kirkilabdullah33@gmail.com";

// TODO: LinkedIn / Instagram / Bionluk kullanıcı adlarını gerçeğiyle değiştir.
const SOCIALS = [
  { name: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/in/abdullahkirkil" },
  { name: "Instagram", icon: "instagram", href: "https://www.instagram.com/abdullahkirkil" },
  { name: "GitHub", icon: "github", href: "https://github.com/KrkAbdullah-06" },
  { name: "Bionluk", icon: "briefcase", href: "https://bionluk.com/abdullahkirkil" },
  { name: "WhatsApp", icon: "whatsapp", href: "https://wa.me/905539525051?text=Merhaba%20Abdullah%2C%20web%20sitenizden%20yaz%C4%B1yorum." },
];

function SocialIcon({ name }: { name: string }) {
  const c = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "linkedin":
      return (<svg {...c}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 11v5M8 8v.01M12 16v-5M16 16v-3a2 2 0 0 0-4 0" /></svg>);
    case "instagram":
      return (<svg {...c}><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3" /><path d="M16.5 7.5v.01" /></svg>);
    case "github":
      return (<svg {...c}><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.7 5.4 3 5.4 3a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.4c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></svg>);
    case "briefcase":
      return (<svg {...c}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" /></svg>);
    case "whatsapp":
      return (<svg {...c}><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" /></svg>);
    default:
      return null;
  }
}

// Kendi kendine yeten koyu cam kart — zeminden bağımsız, her yerde okunur.
// MOBİL PERFORMANS: backdrop-blur telefonlarda pahalı → mobilde blur yok,
// bunun yerine daha opak zemin (okunabilirlik aynı kalır).
const card =
  "rounded-2xl border border-white/15 bg-[#0f1012]/95 p-6 text-[#f4f5f6] shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:bg-[#0f1012]/85 sm:p-8 sm:backdrop-blur-md";
const field =
  "w-full rounded-xl border border-white/25 bg-white/[0.06] px-4 py-3 text-base text-[#f4f5f6] outline-none transition-colors placeholder:text-white/45 focus:border-white/70 focus:bg-white/[0.1]";
const label = "mb-1.5 block font-mono text-[11px] uppercase tracking-[0.25em] text-white/70";

export function ContactPanel() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(name ? `Web sitesi — ${name}` : "Web sitesi — yeni mesaj");
    const body = encodeURIComponent(`Ad: ${name}\nE-posta: ${email}\n\n${message}`);
    window.location.href = `mailto:${MAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mt-32 grid gap-8 border-t border-current/15 pt-20 lg:grid-cols-[1.35fr_1fr] lg:gap-10"
    >
      {/* SOL — mesaj formu */}
      <div className={card}>
        <h3 className="font-display text-2xl font-bold tracking-tight">Mesaj gönder</h3>
        <p className="mt-2 text-sm text-white/70">Projeni kısaca anlat, en kısa sürede dönüş yapayım.</p>

        <form onSubmit={send} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className={label}>Ad Soyad</span>
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Adınız" className={field} />
            </label>
            <label className="block">
              <span className={label}>E-posta</span>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@mail.com" className={field} />
            </label>
          </div>
          <label className="block">
            <span className={label}>Mesaj</span>
            <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Nasıl yardımcı olabilirim?" className={`${field} resize-none`} />
          </label>

          <button
            type="submit"
            className="group inline-flex items-center gap-3 rounded-full border-2 border-white/80 bg-white/10 px-8 py-3.5 text-sm font-semibold text-[#f4f5f6] transition-[background-color,transform] duration-200 hover:bg-white/20 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Gönder
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
          </button>
        </form>
      </div>

      {/* SAĞ — sosyal hesaplar */}
      <div className={card}>
        <h3 className="font-display text-2xl font-bold tracking-tight">Beni takip et</h3>
        <p className="mt-2 text-sm text-white/70">İşlerimi ve güncellemeleri buradan görebilirsin.</p>

        <ul className="mt-8 space-y-2">
          {SOCIALS.map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-white/15 px-4 py-3 text-[#f4f5f6] transition-all duration-300 hover:border-white/40 hover:bg-white/[0.08] hover:pl-6 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="text-white/75 transition-colors duration-300 group-hover:text-white">
                  <SocialIcon name={s.icon} />
                </span>
                <span className="flex-1 text-base font-medium">{s.name}</span>
                <span className="text-sm text-white/0 transition-colors duration-300 group-hover:text-white/70" aria-hidden>↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
