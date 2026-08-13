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
            <label className={label}>Yazı (kodun sonuna yorum olarak eklenir)</label>
            <textarea name="aboutBody" defaultValue={c?.aboutBody ?? ""} rows={4} className={input} />
          </div>

          <div className="border-t border-white/10 pt-5">
            <p className="mb-4 text-sm font-semibold text-white/80">Kod editörü (hakkimda.ts) metinleri</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Ad</label>
                <input name="aboutName" defaultValue={c?.aboutName ?? ""} className={input} />
              </div>
              <div>
                <label className={label}>Okul</label>
                <input name="aboutSchool" defaultValue={c?.aboutSchool ?? ""} className={input} />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Konum</label>
                <input name="aboutLoc" defaultValue={c?.aboutLoc ?? ""} className={input} />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Yorum 1</label>
                <textarea name="aboutComment1" defaultValue={c?.aboutComment1 ?? ""} rows={2} className={input} />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Yorum 2</label>
                <textarea name="aboutComment2" defaultValue={c?.aboutComment2 ?? ""} rows={3} className={input} />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Yorum 3</label>
                <textarea name="aboutComment3" defaultValue={c?.aboutComment3 ?? ""} rows={2} className={input} />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Vizyon (return metni)</label>
                <textarea name="aboutVision" defaultValue={c?.aboutVision ?? ""} rows={2} className={input} />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Durum</label>
                <input name="aboutStatus" defaultValue={c?.aboutStatus ?? ""} className={input} />
              </div>
            </div>
          </div>
        </div>
        <SaveButton className="mt-6 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90">Kaydet</SaveButton>
      </form>
    </div>
  );
}
