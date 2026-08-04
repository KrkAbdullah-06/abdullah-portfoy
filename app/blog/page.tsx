import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — Abdullah Kırkıl",
  description:
    "Abdullah Kırkıl'ın 3D tasarım, üretim, video ve web üzerine yazıları.",
};

export default function BlogPage() {
  return (
    <main className="flex-1 px-6 pb-24 pt-32">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-gold">
          Blog
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Yazılar çok yakında
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted">
          3D tasarım, CNC üretim, video prodüksiyon ve web geliştirme üzerine
          deneyimlerimi burada paylaşacağım. Yazılar admin panelinden eklenecek.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full border border-border px-6 py-3 font-medium text-foreground transition hover:border-accent hover:text-accent"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </main>
  );
}
