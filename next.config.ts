import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Telefondan (aynı Wi-Fi) bakabilmek için. Next, geliştirme modunda /_next/
  // dev kaynaklarını farklı origin'lerden gelen isteklere güvenlik gereği
  // kapatıyor; izin verilmezse JS yüklenemez ve sayfa loading'de takılır.
  // Modem DHCP ile IP'yi değiştirdiği için tek IP yerine yerel ağ aralıklarını
  // yazıyoruz (192.168.x.x ve 10.x.x.x) → IP değişse de çalışmaya devam eder.
  // SADECE dev modunu etkiler, canlı siteye hiçbir etkisi yoktur.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  // NOT: Site artık NİMAK gibi Hostinger'da "Node.js uygulaması" olarak çalışır
  // (Hostinger derleyip `next start` ile sunar). Bu yüzden `output: "export"`
  // KALDIRILDI — statik export sunucu tarafı özellikleri (admin paneli, veritabanı,
  // API route'ları) desteklemez.
};

export default nextConfig;
