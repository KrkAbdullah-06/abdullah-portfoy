"use client";

import { signOut } from "next-auth/react";

export function SignOut() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
    >
      Çıkış
    </button>
  );
}
