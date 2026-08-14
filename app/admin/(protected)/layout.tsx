import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SignOut } from "./SignOut";
import { AdminToaster } from "./AdminToaster";
import { NavLinks } from "./NavLinks";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="relative min-h-screen bg-[#08090c] text-[#f4f5f6]">
      {/* arka plan ışıltısı */}
      <div aria-hidden className="pointer-events-none fixed inset-0 opacity-70" style={{ background: "radial-gradient(60% 45% at 15% 0%, rgba(99,102,241,0.18), transparent 60%), radial-gradient(50% 40% at 100% 0%, rgba(45,212,191,0.14), transparent 60%)" }} />

      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0b0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-teal-300 font-display text-sm font-bold text-black shadow-[0_8px_20px_-6px_rgba(99,102,241,0.7)]">AK</span>
              <span className="font-display text-sm font-bold tracking-tight">Yönetim</span>
            </div>
            <NavLinks />
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer" className="hidden text-xs text-white/50 transition hover:text-white sm:inline">
              Siteyi gör ↗
            </a>
            <SignOut />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-5 py-10">{children}</main>
      <AdminToaster />
    </div>
  );
}
