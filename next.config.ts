import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Telefondan (aynı Wi-Fi) bakabilmek için. Next, geliştirme modunda /_next/
  // dev kaynaklarını farklı origin'lerden gelen isteklere güvenlik gereği
  // kapatıyor; izin verilmezse JS yüklenemez ve sayfa loading'de takılır.
  // Modem DHCP ile IP'yi değiştirdiği için tek IP yerine yerel ağ aralıklarını
  // yazıyoruz (192.168.x.x ve 10.x.x.x) → IP değişse de çalışmaya devam eder.
  // SADECE dev modunu etkiler, canlı siteye hiçbir etkisi yoktur.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  // Hostinger paylaşımlı hosting'in Git özelliği DERLEME yapmıyor, dosyaları
  // olduğu gibi kopyalıyor → siteyi biz burada derleyip hazır statik HTML/CSS/JS
  // olarak `out/` klasörüne koyuyoruz, depoya o klasörü de ekliyoruz. Hostinger
  // sadece `out/` klasörünü public_html'e kopyalayacak (aşağıda .gitignore'da
  // /out/ satırı bu yüzden kaldırıldı — normalde derleme çıktısı depoya
  // eklenmez ama BU özel dağıtım yöntemi için gerekli).
  output: "export",
};

export default nextConfig;
