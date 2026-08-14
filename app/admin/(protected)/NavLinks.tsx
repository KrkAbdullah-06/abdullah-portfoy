"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/projeler", label: "Projeler" },
  { href: "/admin/hizmetler", label: "Hizmetler" },
  { href: "/admin/hakkimda", label: "Hakkımda" },
  { href: "/admin/iletisim", label: "İletişim" },
];

export function NavLinks() {
  const path = usePathname();
  return (
    <nav className="flex items-center gap-1">
      {nav.map((n) => {
        const active = n.href === "/admin" ? path === "/admin" : path.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
              active
                ? "text-white"
                : "text-white/55 hover:text-white hover:-translate-y-0.5"
            }`}
          >
            {active && (
              <span className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/[0.14] to-white/[0.04] ring-1 ring-white/15" />
            )}
            <span className="relative">{n.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
