import { Reveal } from "@/components/ui/Reveal";

const kunye = [
  { label: "Eğitim", value: "Gazi Üniversitesi — Yönetim Bilişim Sistemleri (4. sınıf)" },
  { label: "Uzmanlık", value: "Mekanik tasarım · CNC · video · sosyal medya · web" },
  { label: "Araçlar", value: "SolidWorks, AutoCAD, SolidCAM, Adobe Premiere, Next.js" },
  { label: "Konum", value: "Ankara / Niğde" },
];

export function About() {
  return (
    <section id="hakkimda" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-gold">
            Hakkımda
          </p>
          <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Öğrenci ruhuyla, profesyonel işçilikle.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <Reveal className="space-y-5 text-base leading-7 text-muted">
            <p>
              Merhaba! Ben Abdullah. Gazi Üniversitesi Yönetim Bilişim Sistemleri
              bölümünde okuyorum; ama işi sınıfta değil, üretimde öğrenmeyi
              seviyorum. Mekanik parçaları 3D modellemekten CNC üretime
              hazırlamaya, bir videoyu kurgulamaktan sıfırdan modern bir web
              sitesi kodlamaya kadar geniş bir alanda çalışıyorum.
            </p>
            <p>
              Beni farklı kılan şey, hem mühendislik disiplinini hem de dijital
              medyanın yaratıcılığını bir arada kullanabilmem. Bir işi baştan
              sona — fikir, tasarım, üretim ve tanıtım — tek elden
              götürebiliyorum.
            </p>
            <p className="text-foreground">
              Aklınızdaki projeyi hayata geçirmek için doğru yerdesiniz.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-2xl border border-border bg-surface/40 p-7">
              <h3 className="mb-5 font-display text-lg font-semibold">
                Kısa Künye
              </h3>
              <dl className="space-y-4">
                {kunye.map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-col gap-1 border-l-2 border-accent/40 pl-4"
                  >
                    <dt className="text-xs uppercase tracking-wider text-muted">
                      {row.label}
                    </dt>
                    <dd className="text-sm text-foreground">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
