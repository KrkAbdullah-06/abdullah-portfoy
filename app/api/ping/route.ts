// Uygulamayı "uyanık" tutmak için hafif yoklama adresi (UptimeRobot buraya bakar).
// ÖNEMLİ: Burada VERİTABANINA HİÇBİR SORGU YAPILMAZ. Sadece "ok" döner. Böylece
// Node süreci ayakta kalır ("couldn't load"/yeniden başlama biter) ama ileride
// Neon veritabanı eklenince bile bu ping DB'yi uyandırmaz → Neon compute limiti
// DOLMAZ. (NİMAK'ta hata, ping'in /api/health'te DB'ye SELECT atmasıydı.)
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET() {
  return new Response("ok", {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
