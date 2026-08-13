import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Admin girişi
const ADMIN_EMAIL = "kirkilabdullah33@gmail.com";
const ADMIN_PASSWORD = "Portfoy2026!"; // ilk şifre — admin panelinden değiştir

const projects = [
  { title: "Nimak Makine Çizimleri", category: "3D & Mekanik", year: "2025", description: "Nimak Makina için SolidWorks ile hazırlanan 3D parça ve montaj çizimleri, üretime hazır teknik resimler.", url: null },
  { title: "Nimak Parça G-Kodları", category: "CNC Üretim", year: "2025", description: "Nimak Makina parçalarının CNC tezgahında işlenmesi için SolidCAM ile hazırlanan takım yolları ve G-code çıktıları.", url: null },
  { title: "Nimak Web Sitesi", category: "Web", year: "2025", description: "Nimak Makina'nın kurumsal web sitesi — modern, hızlı ve mobil uyumlu.", url: "https://www.nimak.com.tr/" },
  { title: "Everest Soğutma", category: "Web", year: "2025", description: "Everest Soğutma için modern ve mobil uyumlu kurumsal tanıtım web sitesi.", url: "https://xn--nideeverestsoutma-3lcl.com/" },
  { title: "Marka Yüzüm", category: "Web", year: "2025", description: "Marka Yüzüm için tasarlanıp geliştirilen kurumsal web sitesi.", url: "https://markayuzum.com" },
  { title: "Mavi Kutu", category: "Web", year: "2024", description: "Marka için hızlı, modern ve şık bir web deneyimi.", url: null },
  { title: "Ensa Hayvancılık", category: "Web", year: "2024", description: "Ensa Hayvancılık için kurumsal tanıtım web sitesi.", url: null },
  { title: "Bereket Çiçekçilik", category: "Web", year: "2024", description: "Bereket Çiçekçilik için şık, sade ve kullanışlı web sitesi.", url: null },
  { title: "Google Maps Scraper", category: "Mobil & Otomasyon", year: "2024", description: "Google Haritalar'dan işletme verilerini (isim, telefon, adres) otomatik toplayan veri kazıma aracı.", url: null },
  { title: "Trendyol Ürün Scraper", category: "Mobil & Otomasyon", year: "2024", description: "Trendyol ürün bilgilerini otomatik çeken, fiyat ve stok takibi yapan otomasyon aracı.", url: null },
];

const socials = [
  { name: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/in/abdullahkirkil" },
  { name: "Instagram", icon: "instagram", href: "https://www.instagram.com/abdullahkirkil" },
  { name: "GitHub", icon: "github", href: "https://github.com/KrkAbdullah-06" },
  { name: "Bionluk", icon: "briefcase", href: "https://bionluk.com/abdullahkirkil" },
  { name: "WhatsApp", icon: "whatsapp", href: "https://wa.me/905539525051?text=Merhaba%20Abdullah%2C%20web%20sitenizden%20yaz%C4%B1yorum." },
];

const services = [
  { title: "3D & Mekanik Tasarım", description: "SolidWorks ve AutoCAD ile parça ve ürün tasarlıyorum: 3D modelleme, montaj ve üretime hazır teknik resim.", icon: "cube", color: "#e0a94a", tools: ["SolidWorks", "AutoCAD", "Fusion 360", "Teknik Resim"] },
  { title: "CNC Üretim Hazırlığı", description: "AutoCAD ve SolidCAM ile tezgahın izleyeceği yolu çıkarıp makinenin anlayacağı komutları (G-code) üretiyorum.", icon: "cnc", color: "#6fb7d9", tools: ["SolidCAM", "AutoCAD", "G-Code", "CAM"] },
  { title: "Video Prodüksiyon", description: "Çekimden kurguya: sinematik montaj, renk düzenleme ve ses tasarımıyla akılda kalıcı içerik.", icon: "film", color: "#d98a5a", tools: ["Premiere Pro", "After Effects", "DaVinci"] },
  { title: "Sosyal Medya Yönetimi", description: "İçerik, reels ve reklam yönetimiyle (Meta Ads) hesabını düzenler, doğru kitleye ulaştırır ve markanı öne çıkarırım.", icon: "share", color: "#b58cd9", tools: ["Meta Ads", "Reels", "İçerik"] },
  { title: "Web Geliştirme", description: "Sıfırdan, uçtan uca profesyonel web siteleri: hızlı, modern, SEO uyumlu — tıpkı şu an gezdiğin bu site gibi.", icon: "code", color: "#5fd9a8", tools: ["Next.js", "React", "Three.js", "Tailwind"] },
  { title: "Mobil Uygulama & Otomasyon", description: "iOS ve Android için modern mobil uygulamalar ve tekrarlayan işleri otomatikleştiren akıllı sistemler kuruyorum — tasarımdan yayına, tek elden.", icon: "mobile", color: "#7b8cf5", tools: ["React Native", "Flutter", "Python", "Otomasyon"] },
];

async function main() {
  // Admin kullanıcı
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.adminUser.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash },
    create: { email: ADMIN_EMAIL, passwordHash },
  });

  // Site içeriği (Hakkımda + iletişim)
  await prisma.siteContent.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      aboutKicker: "Hakkımda",
      aboutTitle: "Öğrenci ruhu, profesyonel işçilik.",
      aboutBody:
        "Mekanik tasarımdan web ve mobil geliştirmeye kadar altı farklı alanda üretim yapıyorum. SolidWorks ve AutoCAD ile 3D tasarım ve CNC üretim hazırlığı; video prodüksiyon, sosyal medya yönetimi; Next.js ve React ile modern web siteleri ve mobil uygulamalar. Her işi baştan sona tek elden, öğrenci disiplini ve profesyonel titizlikle teslim ediyorum.",
      contactEmail: "kirkilabdullah33@gmail.com",
      contactPhone: "0553 952 50 51",
      contactWhatsapp: "https://wa.me/905539525051",
      contactLocation: "Ankara / Niğde",
    },
  });

  // Projeler (yalnızca tablo boşsa doldur — mevcut düzenlemeleri ezmemek için)
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.createMany({
      data: projects.map((p, i) => ({ ...p, order: i })),
    });
  }

  // Sosyal linkler (yalnızca boşsa)
  const socialCount = await prisma.socialLink.count();
  if (socialCount === 0) {
    await prisma.socialLink.createMany({
      data: socials.map((s, i) => ({ ...s, order: i })),
    });
  }

  // Hizmetler (yalnızca boşsa)
  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: services.map((s, i) => ({ ...s, order: i })),
    });
  }

  console.log("Seed tamam ✓");
  console.log(`Admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log(`Projeler: ${await prisma.project.count()} · Sosyal: ${await prisma.socialLink.count()}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
