"use client";

import { useState } from "react";
import { PROJECT_CATEGORIES } from "@/lib/categories";
import { createProject, updateProject, deleteProject } from "./actions";

type P = { id: string; title: string; category: string; year: string; description: string; url: string | null };

const input = "w-full rounded-lg border border-white/15 bg-white/[0.05] px-3 py-2 text-sm text-[#f4f5f6] outline-none focus:border-white/50";
const label = "mb-1 block text-xs uppercase tracking-widest text-white/55";

function Fields({ p }: { p?: P }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className={label}>Başlık</label>
        <input name="title" defaultValue={p?.title} required className={input} />
      </div>
      <div>
        <label className={label}>Kategori</label>
        <select name="category" defaultValue={p?.category ?? PROJECT_CATEGORIES[0]} className={input}>
          {PROJECT_CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-[#101114]">
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={label}>Yıl</label>
        <input name="year" defaultValue={p?.year} placeholder="2025" className={input} />
      </div>
      <div className="sm:col-span-2">
        <label className={label}>Açıklama</label>
        <textarea name="description" defaultValue={p?.description} rows={3} className={input} />
      </div>
      <div className="sm:col-span-2">
        <label className={label}>Site linki (opsiyonel)</label>
        <input name="url" defaultValue={p?.url ?? ""} placeholder="https://..." className={input} />
      </div>
    </div>
  );
}

export function ProjectsAdmin({ projects }: { projects: P[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projeler</h1>
          <p className="mt-1 text-sm text-white/50">{projects.length} proje · ekle, düzenle, sil</p>
        </div>
        <button
          onClick={() => {
            setAdding((a) => !a);
            setEditing(null);
          }}
          className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          {adding ? "Kapat" : "+ Yeni Proje"}
        </button>
      </div>

      {adding && (
        <form action={createProject} className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-4 font-semibold">Yeni proje ekle</h2>
          <Fields />
          <button className="mt-5 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90">Ekle</button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            {editing === p.id ? (
              <form action={updateProject}>
                <input type="hidden" name="id" value={p.id} />
                <Fields p={p} />
                <div className="mt-5 flex gap-2">
                  <button className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90">Kaydet</button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="rounded-lg border border-white/15 px-5 py-2 text-sm text-white/70 transition hover:bg-white/5"
                  >
                    İptal
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/60">{p.category}</span>
                    <span className="text-xs text-white/40">{p.year}</span>
                    {p.url && <span className="text-xs text-emerald-400/70">↗ link</span>}
                  </div>
                  <div className="mt-1.5 font-semibold">{p.title}</div>
                  <div className="mt-0.5 truncate text-sm text-white/50">{p.description}</div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => {
                      setEditing(p.id);
                      setAdding(false);
                    }}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/5"
                  >
                    Düzenle
                  </button>
                  <form
                    action={deleteProject}
                    onSubmit={(e) => {
                      if (!confirm(`"${p.title}" silinsin mi?`)) e.preventDefault();
                    }}
                  >
                    <input type="hidden" name="id" value={p.id} />
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
