import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Telefondan (aynı Wi-Fi) bakabilmek için. Next, geliştirme modunda /_next/
  // dev kaynaklarını farklı origin'lerden gelen isteklere güvenlik gereği
  // kapatıyor; izin verilmezse JS yüklenemez ve sayfa loading'de takılır.
  // Modem DHCP ile IP'yi değiştirdiği için tek IP yerine yerel ağ aralıklarını
  // yazıyoruz (192.168.x.x ve 10.x.x.x) → IP değişse de çalışmaya devam eder.
  // SADECE dev modunu etkiler, canlı siteye hiçbir etkisi yoktur.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  // Hostinger gibi düz (Node.js olmayan) hosting'e yüklemek için: sitede API
  // route / server action / next/image yok → tamamen STATİK HTML/CSS/JS
  // dışa aktarılabilir. `npm run build` çalıştırınca proje kökünde bir `out/`
  // klasörü oluşur — o klasörün İÇİNDEKİ dosyalar Hostinger'a yüklenir.
  output: "export",
};

export default nextConfig;
