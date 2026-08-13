import { prisma } from "@/lib/prisma";
import { saveAbout } from "./actions";
import { SaveButton } from "../SaveButton";

export const dynamic = "force-dynamic";

const input = "w-full rounded-lg border border-white/15 bg-white/[0.05] px-3 py-2 text-sm text-[#f4f5f6] outline-none focus:border-white/50";
const label = "mb-1 block text-xs uppercase tracking-widest text-white/55";

export default async function HakkimdaPage() {
  const c = await prisma.siteContent.findUnique({ where: { id: "main" } });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Hakkımda</h1>
      <p className="mt-1 text-sm text-white/50">Ana sayfadaki “Hakkımda” bölümünün metni.</p>

      <form action={saveAbout} className="mt-6 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="space-y-5">
          <div>
            <label className={label}>Üst etiket</label>
            <input name="aboutKicker" defaultValue={c?.aboutKicker ?? ""} placeholder="Hakkımda" className={input} />
          </div>
          <div>
            <label className={label}>Başlık</label>
            <input name="aboutTitle" defaultValue={c?.aboutTitle ?? ""} placeholder="Öğrenci ruhu, profesyonel işçilik." className={input} />
          </div>
          <div>
            <label className={label}>Yazı</label>
            <textarea name="aboutBody" defaultValue={c?.aboutBody ?? ""} rows={7} className={input} />
          </div>
        </div>
        <SaveButton className="mt-6 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90">Kaydet</SaveButton>
      </form>
    </div>
  );
}
