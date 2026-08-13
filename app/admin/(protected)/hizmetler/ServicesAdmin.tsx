"use client";

import { useState } from "react";
import { createService, updateService, deleteService } from "./actions";

type S = { id: string; title: string; description: string; icon: string; color: string; tools: string };

const ICONS = ["cube", "cnc", "film", "share", "code", "mobile"];

const input = "w-full rounded-lg border border-white/15 bg-white/[0.05] px-3 py-2 text-sm text-[#f4f5f6] outline-none focus:border-white/50";
const label = "mb-1 block text-xs uppercase tracking-widest text-white/55";

function Fields({ s }: { s?: S }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className={label}>Başlık</label>
        <input name="title" defaultValue={s?.title} required className={input} />
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
      <div>
        <label className={label}>Renk (hex)</label>
        <input name="color" defaultValue={s?.color ?? "#e0a94a"} placeholder="#e0a94a" className={input} />
      </div>
      <div className="sm:col-span-2">
        <label className={label}>Açıklama</label>
        <textarea name="description" defaultValue={s?.description} rows={3} className={input} />
      </div>
      <div className="sm:col-span-2">
        <label className={label}>Araçlar (virgülle ayır)</label>
        <input name="tools" defaultValue={s?.tools} placeholder="SolidWorks, AutoCAD, Fusion 360" className={input} />
      </div>
    </div>
  );
}

export function ServicesAdmin({ services }: { services: S[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const saved = () => window.dispatchEvent(new CustomEvent("admin:saved"));

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hizmetler</h1>
          <p className="mt-1 text-sm text-white/50">{services.length} hizmet · “Ne yapıyorum” bölümü</p>
        </div>
        <button
          onClick={() => {
            setAdding((a) => !a);
            setEditing(null);
          }}
          className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          {adding ? "Kapat" : "+ Yeni Hizmet"}
        </button>
      </div>

      {adding && (
        <form action={createService} className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <Fields />
          <button onClick={saved} className="mt-5 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90">Ekle</button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {services.map((s) => (
          <div key={s.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            {editing === s.id ? (
              <form action={updateService}>
                <input type="hidden" name="id" value={s.id} />
                <Fields s={s} />
                <div className="mt-5 flex gap-2">
                  <button onClick={saved} className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90">Kaydet</button>
                  <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-white/15 px-5 py-2 text-sm text-white/70 transition hover:bg-white/5">İptal</button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ background: s.color }} />
                    <span className="text-xs uppercase tracking-wide text-white/50">{s.icon}</span>
                  </div>
                  <div className="mt-1.5 font-semibold">{s.title}</div>
                  <div className="mt-0.5 truncate text-sm text-white/50">{s.description}</div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => { setEditing(s.id); setAdding(false); }} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/5">Düzenle</button>
                  <form action={deleteService} onSubmit={(e) => { if (!confirm(`"${s.title}" silinsin mi?`)) e.preventDefault(); }}>
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
