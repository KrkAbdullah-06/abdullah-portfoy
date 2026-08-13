import { prisma } from "@/lib/prisma";
import { saveContact } from "./actions";
import { SocialsAdmin } from "./SocialsAdmin";
import { SaveButton } from "../SaveButton";

export const dynamic = "force-dynamic";

const input = "w-full rounded-lg border border-white/15 bg-white/[0.05] px-3 py-2 text-sm text-[#f4f5f6] outline-none focus:border-white/50";
const label = "mb-1 block text-xs uppercase tracking-widest text-white/55";

export default async function IletisimPage() {
  const [c, socials] = await Promise.all([
    prisma.siteContent.findUnique({ where: { id: "main" } }),
    prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">İletişim</h1>
      <p className="mt-1 text-sm text-white/50">İletişim bilgileri ve sosyal linkler.</p>

      {/* İletişim bilgileri */}
      <form action={saveContact} className="mt-6 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label}>E-posta</label>
            <input name="contactEmail" defaultValue={c?.contactEmail ?? ""} className={input} />
          </div>
          <div>
            <label className={label}>Telefon</label>
            <input name="contactPhone" defaultValue={c?.contactPhone ?? ""} className={input} />
          </div>
          <div>
            <label className={label}>WhatsApp linki</label>
            <input name="contactWhatsapp" defaultValue={c?.contactWhatsapp ?? ""} placeholder="https://wa.me/..." className={input} />
          </div>
          <div>
            <label className={label}>Konum</label>
            <input name="contactLocation" defaultValue={c?.contactLocation ?? ""} placeholder="Ankara / Niğde" className={input} />
          </div>
        </div>
        <SaveButton className="mt-6 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90">Kaydet</SaveButton>
      </form>

      {/* Sosyal linkler */}
      <SocialsAdmin socials={socials.map((s) => ({ id: s.id, name: s.name, icon: s.icon, href: s.href }))} />
    </div>
  );
}
