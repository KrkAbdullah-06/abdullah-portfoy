import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { SignOut } from "./SignOut";
import { AdminToaster } from "./AdminToaster";

export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/projeler", label: "Projeler" },
  { href: "/admin/hakkimda", label: "Hakkımda" },
  { href: "/admin/iletisim", label: "İletişim" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#0a0b0c] text-[#f4f5f6]">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0a0b0c]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-6">
            <span className="font-display text-sm font-bold tracking-tight">AK · Yönetim</span>
            <nav className="flex items-center gap-1">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-lg px-3 py-1.5 text-sm text-white/65 transition hover:bg-white/5 hover:text-white"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs text-white/50 hover:text-white">
              Siteyi gör ↗
            </a>
            <SignOut />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
      <AdminToaster />
    </div>
  );
}
