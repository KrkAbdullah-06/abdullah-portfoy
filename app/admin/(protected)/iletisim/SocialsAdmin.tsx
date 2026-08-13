"use client";

import { useState } from "react";
import { createSocial, updateSocial, deleteSocial } from "./actions";

type S = { id: string; name: string; icon: string; href: string };

// ContactPanel'deki SocialIcon'ın desteklediği ikonlar
const ICONS = ["linkedin", "instagram", "github", "briefcase", "whatsapp"];

const input = "w-full rounded-lg border border-white/15 bg-white/[0.05] px-3 py-2 text-sm text-[#f4f5f6] outline-none focus:border-white/50";
const label = "mb-1 block text-xs uppercase tracking-widest text-white/55";

function Fields({ s }: { s?: S }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div>
        <label className={label}>Ad</label>
        <input name="name" defaultValue={s?.name} placeholder="LinkedIn" required className={input} />
      </div>
      <div>
        <label className={label}>İkon</label>
        <select name="icon" defaultValue={s?.icon ?? ICONS[0]} className={input}>
          {ICONS.map((i) => (
            <option key={i} value={i} className="bg-[#101114]">
              {i}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-3">
        <label className={label}>Link</label>
        <input name="href" defaultValue={s?.href} placeholder="https://..." required className={input} />
      </div>
    </div>
  );
}

export function SocialsAdmin({ socials }: { socials: S[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Sosyal / Uygulama Linkleri</h2>
          <p className="mt-1 text-sm text-white/50">İletişimde görünen uygulamalar ve linkleri.</p>
        </div>
        <button
          onClick={() => {
            setAdding((a) => !a);
            setEditing(null);
          }}
          className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          {adding ? "Kapat" : "+ Yeni"}
        </button>
      </div>

      {adding && (
        <form action={createSocial} className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <Fields />
          <button className="mt-5 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90">Ekle</button>
        </form>
      )}

      <div className="mt-5 space-y-3">
        {socials.map((s) => (
          <div key={s.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            {editing === s.id ? (
              <form action={updateSocial}>
                <input type="hidden" name="id" value={s.id} />
                <Fields s={s} />
                <div className="mt-5 flex gap-2">
                  <button className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90">Kaydet</button>
                  <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-white/15 px-5 py-2 text-sm text-white/70 transition hover:bg-white/5">
                    İptal
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold">{s.name}</div>
                  <div className="mt-0.5 truncate text-sm text-white/50">{s.href}</div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => { setEditing(s.id); setAdding(false); }} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/5">
                    Düzenle
                  </button>
                  <form action={deleteSocial} onSubmit={(e) => { if (!confirm(`"${s.name}" silinsin mi?`)) e.preventDefault(); }}>
                    <input type="hidden" name="id" value={s.id} />
                    <button className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10">Sil</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
