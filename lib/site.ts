// Sitenin temel bilgileri tek yerde. İleride admin panelinden yönetilecek
// içeriklerin şimdilik varsayılan (fallback) değerleri burada duruyor.
export const siteConfig = {
  name: "Abdullah Kırkıl",
  title: "Abdullah Kırkıl — 3D Tasarım, CNC, Video & Web",
  description:
    "Mekanik 3D tasarım, CNC üretim hazırlığı, video prodüksiyon, sosyal medya ve modern full-stack web geliştirme.",

  // İletişim bilgileri (sitede gösterilecek)
  email: "kirkilabdullah33@gmail.com",
  phoneLabel: "0553 952 50 51",
  phoneHref: "+905539525051", // tel: ve WhatsApp linkleri için
  whatsapp: "https://wa.me/905539525051",
  location: "Ankara / Niğde",

  // Üst menü bağlantıları (bölümler Aşama 2'de eklenecek)
  nav: [
    { label: "Hakkımda", href: "/#hakkimda" },
    { label: "Hizmetler", href: "/#hizmetler" },
    { label: "Portföy", href: "/#portfolyo" },
    { label: "Blog", href: "/blog" },
    { label: "İletişim", href: "/#iletisim" },
  ],
} as const;
