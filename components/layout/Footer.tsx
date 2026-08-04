import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {/* Marka + kısa tanıtım */}
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-6 text-muted">
            {siteConfig.description}
          </p>
        </div>

        {/* Hızlı bağlantılar */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground">Menü</h3>
          <ul className="space-y-2.5">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* İletişim */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground">İletişim</h3>
          <ul className="space-y-2.5 text-sm text-muted">
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="transition-colors hover:text-accent"
              >
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                {siteConfig.phoneLabel} (WhatsApp)
              </a>
            </li>
            <li>{siteConfig.location}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-muted">
        © {year} {siteConfig.name}. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
