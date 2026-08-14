"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) setError("E-posta veya şifre hatalı.");
    else router.push("/admin");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08090c] px-6 text-[#f4f5f6]">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(50% 40% at 30% 20%, rgba(99,102,241,0.22), transparent 60%), radial-gradient(45% 40% at 80% 90%, rgba(45,212,191,0.18), transparent 60%)" }} />
      <form onSubmit={submit} className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-teal-300 font-display text-sm font-bold text-black shadow-[0_10px_24px_-6px_rgba(99,102,241,0.7)]">AK</span>
          <div>
            <h1 className="text-lg font-bold leading-tight tracking-tight">Yönetim Girişi</h1>
            <p className="text-xs text-white/50">Abdullah Kırkıl · Portföy</p>
          </div>
        </div>

        <label className="mt-8 block text-xs uppercase tracking-widest text-white/60">E-posta</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/[0.05] px-3 py-2.5 text-sm outline-none focus:border-white/50"
        />

        <label className="mt-5 block text-xs uppercase tracking-widest text-white/60">Şifre</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/[0.05] px-3 py-2.5 text-sm outline-none focus:border-white/50"
        />

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-7 w-full rounded-lg bg-gradient-to-r from-indigo-400 to-teal-300 px-4 py-2.5 text-sm font-semibold text-black shadow-[0_10px_28px_-10px_rgba(99,102,241,0.8)] transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş yap"}
        </button>
      </form>
    </div>
  );
}
