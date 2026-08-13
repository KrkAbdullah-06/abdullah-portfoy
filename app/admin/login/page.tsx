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
    <div className="flex min-h-screen items-center justify-center bg-[#0a0b0c] px-6 text-[#f4f5f6]">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <h1 className="text-xl font-bold tracking-tight">Yönetim Girişi</h1>
        <p className="mt-1 text-sm text-white/50">Abdullah Kırkıl · Portföy</p>

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
          className="mt-7 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş yap"}
        </button>
      </form>
    </div>
  );
}
