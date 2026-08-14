import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function timeAgo(d: Date) {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "az önce";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} dk önce`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} saat önce`;
  const dd = Math.floor(h / 24);
  return dd === 1 ? "dün" : `${dd} gün önce`;
}

const KIND: Record<string, { dot: string; label: string }> = {
  create: { dot: "#34d399", label: "Ekleme" },
  update: { dot: "#fbbf24", label: "Güncelleme" },
  delete: { dot: "#f87171", label: "Silme" },
  info: { dot: "#94a3b8", label: "Bilgi" },
};

export default async function AdminDashboard() {
  const [projects, servicesCount, socials, logs] = await Promise.all([
    prisma.project.count(),
    prisma.service.count(),
    prisma.socialLink.count(),
    prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  const cards = [
    { href: "/admin/projeler", title: "Projeler", value: projects, desc: "ekle · düzenle · sil", color: "#8b8cf5", emoji: "🗂️" },
    { href: "/admin/hizmetler", title: "Hizmetler", value: servicesCount, desc: "Ne yapıyorum", color: "#2dd4bf", emoji: "🛠️" },
    { href: "/admin/hakkimda", title: "Hakkımda", value: "✎", desc: "kod editörü metinleri", color: "#f0a94a", emoji: "✏️" },
    { href: "/admin/iletisim", title: "İletişim", value: socials, desc: "sosyal linkler", color: "#5fb7f5", emoji: "📱" },
  ];

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Merhaba, Abdullah 👋</h1>
          <p className="mt-1.5 text-sm text-white/50">Sitenin içeriğini buradan yönet.</p>
        </div>
      </div>

      {/* Renkli kartlar */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            style={{ "--c": c.color } as React.CSSProperties}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--c)]/50 hover:bg-white/[0.04]"
          >
            <div aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40" style={{ background: c.color }} />
            <div className="relative flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl text-lg ring-1 ring-inset ring-white/10" style={{ background: `${c.color}1f` }}>
                {c.emoji}
              </span>
              <span className="font-display text-3xl font-bold tabular-nums" style={{ color: c.color }}>
                {c.value}
              </span>
            </div>
            <div className="relative mt-4 font-semibold">{c.title}</div>
            <div className="relative text-xs text-white/45">{c.desc}</div>
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] scale-x-0 bg-[var(--c)] transition-transform duration-300 group-hover:scale-x-100" style={{ transformOrigin: "left" }} />
          </Link>
        ))}
      </div>

      {/* Son işlemler (log) */}
      <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold tracking-tight">Son işlemler</h2>
          <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white/40">Log</span>
        </div>

        {logs.length === 0 ? (
          <p className="mt-6 text-sm text-white/40">Henüz işlem yok. Bir şey ekle/düzenle, burada görünür.</p>
        ) : (
          <ul className="mt-5 space-y-1">
            {logs.map((l) => {
              const k = KIND[l.kind] ?? KIND.info;
              return (
                <li key={l.id} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/[0.03]">
                  <span className="h-2 w-2 shrink-0 rounded-full ring-4 ring-white/[0.03]" style={{ background: k.dot }} />
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="font-medium">{l.action}</span>
                    {l.detail && <span className="text-white/50"> — {l.detail}</span>}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-white/35">{timeAgo(l.createdAt)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
