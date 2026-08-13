import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [projects, socials] = await Promise.all([
    prisma.project.count(),
    prisma.socialLink.count(),
  ]);

  const cards = [
    { href: "/admin/projeler", title: "Projeler", desc: `${projects} proje · ekle, düzenle, sil`, emoji: "🗂️" },
    { href: "/admin/hakkimda", title: "Hakkımda", desc: "Başlık ve yazıyı düzenle", emoji: "✏️" },
    { href: "/admin/iletisim", title: "İletişim", desc: `${socials} sosyal link · iletişim bilgileri`, emoji: "📱" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Yönetim Paneli</h1>
      <p className="mt-1 text-sm text-white/50">Sitenin içeriğini buradan yönet.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/25 hover:bg-white/[0.04]"
          >
            <div className="text-2xl">{c.emoji}</div>
            <div className="mt-4 font-semibold">{c.title}</div>
            <div className="mt-1 text-sm text-white/50">{c.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
