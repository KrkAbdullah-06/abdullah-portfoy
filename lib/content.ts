import { prisma } from "@/lib/prisma";

export type PublicProject = {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  url: string | null;
};
export type PublicSocial = { name: string; icon: string; href: string };
export type PublicService = { title: string; description: string; icon: string; color: string; tools: string[] };
export type SiteData = {
  projects: PublicProject[];
  services: PublicService[];
  about: {
    kicker: string;
    title: string;
    body: string | null;
    name: string;
    school: string;
    loc: string;
    comment1: string;
    comment2: string;
    comment3: string;
    vision: string;
    status: string;
  };
  contact: { email: string; phone: string; whatsapp: string; location: string };
  socials: PublicSocial[];
};

// DB boş veya erişilemezse kullanılacak varsayılanlar (site her zaman çalışsın).
const FALLBACK: SiteData = {
  projects: [
    { id: "01", title: "Nimak Makine Çizimleri", category: "3D & Mekanik", year: "2025", description: "Nimak Makina için SolidWorks ile hazırlanan 3D parça ve montaj çizimleri, üretime hazır teknik resimler.", url: null },
    { id: "02", title: "Nimak Parça G-Kodları", category: "CNC Üretim", year: "2025", description: "Nimak Makina parçalarının CNC tezgahında işlenmesi için SolidCAM ile hazırlanan takım yolları ve G-code çıktıları.", url: null },
    { id: "03", title: "Nimak Web Sitesi", category: "Web", year: "2025", description: "Nimak Makina'nın kurumsal web sitesi — modern, hızlı ve mobil uyumlu.", url: "https://www.nimak.com.tr/" },
    { id: "04", title: "Everest Soğutma", category: "Web", year: "2025", description: "Everest Soğutma için modern ve mobil uyumlu kurumsal tanıtım web sitesi.", url: "https://xn--nideeverestsoutma-3lcl.com/" },
    { id: "05", title: "Marka Yüzüm", category: "Web", year: "2025", description: "Marka Yüzüm için tasarlanıp geliştirilen kurumsal web sitesi.", url: "https://markayuzum.com" },
    { id: "06", title: "Mavi Kutu", category: "Web", year: "2024", description: "Marka için hızlı, modern ve şık bir web deneyimi.", url: null },
    { id: "07", title: "Ensa Hayvancılık", category: "Web", year: "2024", description: "Ensa Hayvancılık için kurumsal tanıtım web sitesi.", url: null },
    { id: "08", title: "Bereket Çiçekçilik", category: "Web", year: "2024", description: "Bereket Çiçekçilik için şık, sade ve kullanışlı web sitesi.", url: null },
    { id: "09", title: "Google Maps Scraper", category: "Mobil & Otomasyon", year: "2024", description: "Google Haritalar'dan işletme verilerini (isim, telefon, adres) otomatik toplayan veri kazıma aracı.", url: null },
    { id: "10", title: "Trendyol Ürün Scraper", category: "Mobil & Otomasyon", year: "2024", description: "Trendyol ürün bilgilerini otomatik çeken, fiyat ve stok takibi yapan otomasyon aracı.", url: null },
  ],
  services: [
    { title: "3D & Mekanik Tasarım", description: "SolidWorks ve AutoCAD ile parça ve ürün tasarlıyorum: 3D modelleme, montaj ve üretime hazır teknik resim.", icon: "cube", color: "#e0a94a", tools: ["SolidWorks", "AutoCAD", "Fusion 360", "Teknik Resim"] },
    { title: "CNC Üretim Hazırlığı", description: "AutoCAD ve SolidCAM ile tezgahın izleyeceği yolu çıkarıp makinenin anlayacağı komutları (G-code) üretiyorum.", icon: "cnc", color: "#6fb7d9", tools: ["SolidCAM", "AutoCAD", "G-Code", "CAM"] },
    { title: "Video Prodüksiyon", description: "Çekimden kurguya: sinematik montaj, renk düzenleme ve ses tasarımıyla akılda kalıcı içerik.", icon: "film", color: "#d98a5a", tools: ["Premiere Pro", "After Effects", "DaVinci"] },
    { title: "Sosyal Medya Yönetimi", description: "İçerik, reels ve reklam yönetimiyle (Meta Ads) hesabını düzenler, doğru kitleye ulaştırır ve markanı öne çıkarırım.", icon: "share", color: "#b58cd9", tools: ["Meta Ads", "Reels", "İçerik"] },
    { title: "Web Geliştirme", description: "Sıfırdan, uçtan uca profesyonel web siteleri: hızlı, modern, SEO uyumlu — tıpkı şu an gezdiğin bu site gibi.", icon: "code", color: "#5fd9a8", tools: ["Next.js", "React", "Three.js", "Tailwind"] },
    { title: "Mobil Uygulama & Otomasyon", description: "iOS ve Android için modern mobil uygulamalar ve tekrarlayan işleri otomatikleştiren akıllı sistemler kuruyorum — tasarımdan yayına, tek elden.", icon: "mobile", color: "#7b8cf5", tools: ["React Native", "Flutter", "Python", "Otomasyon"] },
  ],
  about: {
    kicker: "Hakkımda",
    title: "Öğrenci ruhu, profesyonel işçilik.",
    body: null,
    name: "Abdullah Kırkıl",
    school: "Gazi Üniversitesi · MIS · 4. sınıf",
    loc: "Ankara / Niğde",
    comment1: "Bilişim ve yönetim disiplinlerinin kesişim noktasında, teknolojiyi iş süreçlerine entegre etme vizyonuyla hareket ediyorum.",
    comment2: "Akademik eğitimimin yanı sıra, Nimak Makina Mühendislik çatısı altında stajyerlikle adım attığım kariyer yolculuğuma, Nimak'da hibrit (tam zamanlı ve uzaktan) çalışma yapısıyla devam ediyorum.",
    comment3: "Sanayi ve mühendislik sektöründeki iş süreçlerini bilişim altyapılarıyla destekleme üzerine pratik tecrübeler ediniyorum.",
    vision: "Teknoloji, dijital dönüşüm ve yönetim bilişimi alanlarındaki vizyonumu paylaşmak ve geliştirmek temel hedefimdir.",
    status: "Yeni projelere açık ✓",
  },
  contact: { email: "kirkilabdullah33@gmail.com", phone: "0553 952 50 51", whatsapp: "https://wa.me/905539525051", location: "Ankara / Niğde" },
  socials: [
    { name: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/in/abdullahkirkil" },
    { name: "Instagram", icon: "instagram", href: "https://www.instagram.com/abdullahkirkil" },
    { name: "GitHub", icon: "github", href: "https://github.com/KrkAbdullah-06" },
    { name: "Bionluk", icon: "briefcase", href: "https://bionluk.com/abdullahkirkil" },
    { name: "WhatsApp", icon: "whatsapp", href: "https://wa.me/905539525051?text=Merhaba%20Abdullah%2C%20web%20sitenizden%20yaz%C4%B1yorum." },
  ],
};

export async function getSiteData(): Promise<SiteData> {
  try {
    const [projects, services, content, socials] = await Promise.all([
      prisma.project.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
      prisma.service.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
      prisma.siteContent.findUnique({ where: { id: "main" } }),
      prisma.socialLink.findMany({ where: { enabled: true }, orderBy: { order: "asc" } }),
    ]);

    return {
      projects: projects.length
        ? projects.map((p) => ({ id: p.id, title: p.title, category: p.category, year: p.year, description: p.description, url: p.url }))
        : FALLBACK.projects,
      services: services.length
        ? services.map((s) => ({ title: s.title, description: s.description, icon: s.icon, color: s.color, tools: s.tools }))
        : FALLBACK.services,
      about: {
        kicker: content?.aboutKicker || FALLBACK.about.kicker,
        title: content?.aboutTitle || FALLBACK.about.title,
        body: content?.aboutBody ?? FALLBACK.about.body,
        name: content?.aboutName || FALLBACK.about.name,
        school: content?.aboutSchool || FALLBACK.about.school,
        loc: content?.aboutLoc || FALLBACK.about.loc,
        comment1: content?.aboutComment1 || FALLBACK.about.comment1,
        comment2: content?.aboutComment2 || FALLBACK.about.comment2,
        comment3: content?.aboutComment3 || FALLBACK.about.comment3,
        vision: content?.aboutVision || FALLBACK.about.vision,
        status: content?.aboutStatus || FALLBACK.about.status,
      },
      contact: {
        email: content?.contactEmail || FALLBACK.contact.email,
        phone: content?.contactPhone || FALLBACK.contact.phone,
        whatsapp: content?.contactWhatsapp || FALLBACK.contact.whatsapp,
        location: content?.contactLocation || FALLBACK.contact.location,
      },
      socials: socials.length ? socials.map((s) => ({ name: s.name, icon: s.icon, href: s.href })) : FALLBACK.socials,
    };
  } catch {
    // DB uykuda/erişilemez → site yine varsayılanlarla çalışır (çökmez)
    return FALLBACK;
  }
}
