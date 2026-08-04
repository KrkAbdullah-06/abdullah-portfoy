"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Şimdilik form, mesajı WhatsApp'a önceden doldurup gönderiyor.
  // Aşama 5'te bu mesaj ayrıca veritabanına kaydedilip e-postana da düşecek.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Merhaba Abdullah, ben ${name}.\n\n${message}\n\n(İletişim e-postam: ${email})`;
    window.open(
      `${siteConfig.whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <section id="iletisim" className="scroll-mt-24 border-t border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-gold">
            İletişim
          </p>
          <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Bir projeniz mi var? Konuşalım.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted">
            Aklınızdaki işi yazın; en kısa sürede dönüş yapayım.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {/* Sol: iletişim kartları */}
          <Reveal className="space-y-4">
            <a
              href={`mailto:${siteConfig.email}`}
              className="block rounded-2xl border border-border bg-surface/40 p-6 transition-colors hover:border-accent/50"
            >
              <p className="text-xs uppercase tracking-wider text-muted">E-posta</p>
              <p className="mt-1 text-lg text-foreground">{siteConfig.email}</p>
            </a>
            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-border bg-surface/40 p-6 transition-colors hover:border-accent/50"
            >
              <p className="text-xs uppercase tracking-wider text-muted">
                Telefon / WhatsApp
              </p>
              <p className="mt-1 text-lg text-foreground">
                {siteConfig.phoneLabel}
              </p>
            </a>
            <div className="rounded-2xl border border-border bg-surface/40 p-6">
              <p className="text-xs uppercase tracking-wider text-muted">Konum</p>
              <p className="mt-1 text-lg text-foreground">{siteConfig.location}</p>
            </div>
          </Reveal>

          {/* Sağ: mesaj formu */}
          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl border border-border bg-surface/40 p-7"
            >
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm text-muted">
                  Adınız
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
                  placeholder="Ad Soyad"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm text-muted">
                  E-postanız
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
                  placeholder="ornek@eposta.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm text-muted"
                >
                  Mesajınız
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
                  placeholder="Projenizden kısaca bahsedin..."
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-gold px-6 py-3 font-medium text-background transition hover:brightness-110"
              >
                WhatsApp ile gönder
              </button>
              <p className="text-center text-xs text-muted">
                Gönder’e basınca mesajınız WhatsApp’ta hazır gelir.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
