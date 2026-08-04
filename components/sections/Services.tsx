import { Reveal } from "@/components/ui/Reveal";

type ServiceIconName = "cube" | "cnc" | "film" | "share" | "code";

const services: {
  icon: ServiceIconName;
  title: string;
  desc: string;
  tools: string;
}[] = [
  {
    icon: "cube",
    title: "3D & Mekanik Tasarım",
    desc: "Endüstriyel parçalar, makine elemanları ve mekanik montajlar için hassas 3D modelleme ve teknik tasarım.",
    tools: "SolidWorks · AutoCAD",
  },
  {
    icon: "cnc",
    title: "CNC Üretim Hazırlığı",
    desc: "Tasarımdan üretime köprü: CAM işlemleri, takım yolları ve CNC tezgâhları için üretime hazır dosyalar.",
    tools: "SolidCAM · CAD/CAM",
  },
  {
    icon: "film",
    title: "Video Prodüksiyon",
    desc: "Profesyonel kurgu, renk ve ses düzenlemesiyle akılda kalıcı tanıtım ve sosyal medya videoları.",
    tools: "Premiere · After Effects",
  },
  {
    icon: "share",
    title: "Sosyal Medya",
    desc: "İçerik düzenleme, reels/kısa video hazırlama ve markanızı öne çıkaran görsel dil.",
    tools: "Reels · İçerik yönetimi",
  },
  {
    icon: "code",
    title: "Web Geliştirme",
    desc: "Sıfırdan, hızlı ve modern full-stack web siteleri. Tıpkı şu an gezindiğiniz bu site gibi.",
    tools: "Next.js · React · Tailwind",
  },
];

function ServiceIcon({ name }: { name: ServiceIconName }) {
  switch (name) {
    case "cube":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 3 7v10l9 5 9-5V7z" />
          <path d="M3 7l9 5 9-5" />
          <path d="M12 12v10" />
        </svg>
      );
    case "cnc":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
        </svg>
      );
    case "film":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4" />
        </svg>
      );
    case "share":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="12" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
          <path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6" />
        </svg>
      );
    case "code":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 6l-2 12" />
        </svg>
      );
  }
}

export function Services() {
  return (
    <section id="hizmetler" className="scroll-mt-24 border-t border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-gold">
            Hizmetler
          </p>
          <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Ne yapıyorum?
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted">
            Beş farklı alanda uzmanlaşmış tek bir üretici. İhtiyacınız hangisiyse,
            baştan sona ilgileniyorum.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.08}>
              <div className="group h-full rounded-2xl border border-border bg-surface/40 p-7 transition-colors hover:border-accent/50">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-background">
                  <ServiceIcon name={service.icon} />
                </div>
                <h3 className="font-display text-lg font-semibold">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">{service.desc}</p>
                <p className="mt-4 text-xs font-medium uppercase tracking-wider text-gold">
                  {service.tools}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
