# PROJE DURUMU — Abdullah Kırkıl Portföy Sitesi

> Bu dosya, sohbet bağlamı özetlense/sıfırlansa bile projeye kaldığı yerden devam
> edebilmek için TÜM durumu tutar. **Devam etmeden önce bu dosyayı oku.**
> Her önemli adımdan sonra "MEVCUT DURUM" ve "SIRADAKİ ADIMLAR" güncellenir.
> Son güncelleme: Tasarım büyük ölçüde BİTTİ (PC + mobil). Mobil performans elden geçirildi.

---

## 0) EN GÜNCEL DURUM (compaction öncesi özet — buradan devam et)
- **Tasarım PC'de mükemmel, mobil de artık akıcı hedefli.** Ana sayfa bölümleri hazır:
  Giriş(Hero) → Marquee → Manifesto → Hakkımda(3D dönen AK logo) → Hizmetler(spotlight kartlar) →
  Süreç(timeline) → Portföy(kategori filtreli kartlar) → İletişim(form + sosyal) → Footer.
  Ayrıca: açılış(loading) ekranı, sayfa geçişi (blur + isim), mobil hamburger menü.
- **Logo:** çember içinde ince AK ligatür (components/brand/AKMark.tsx + app/icon.svg). Hakkımda'da 3D dönen
  sürüm (LogoSpin3D), her cihazda (mobilde IntersectionObserver ile ekranda değilken duraklar).
- **6 HİZMET** (Services.tsx, spotlight kartlar): 3D&Mekanik, CNC, Video, Sosyal Medya, Web, Mobil Uygulama.
- **MOBİL PERFORMANS (0bb):** Lenis mobilde KAPALI (native scroll). Progress+zemin rengi Experience'te
  SÜREKLİ rAF ile scrollY'den okunuyor (iOS momentum'da bile akıcı). Çark mobilde metalness=0 (env yok),
  dpr [1,1.5], 30fps cap, scroll-driven (PC ile aynı iniş). Kart reveal'ları transform-only.
- **WhatsApp linkleri (4):** ?text= ile hazır mesaj "Merhaba Abdullah, web sitenizden yazıyorum."
- **ÇALIŞAN SUNUCU:** üretim (`npm run build` + preview_start "prod", port 3000). launch.json'da "dev" ve "prod" var.
- **TELEFONDA TEST:** yerel IP/ağ/firewall hep sorun çıkardı (IP her seans değişiyor, ağ "Public").
  ÇÖZÜM: cloudflare quick tunnel → `npx --yes cloudflared tunnel --url http://localhost:3000` (tunnel.log'a
  yazıp trycloudflare.com adresini oradan al). Herhangi bir ağdan/mobil veriyle açılır. Geçici (sunucu kapanınca ölür).
- **SIRADAKİ:** (1) kullanıcı mobili tünelden test ediyor. (2) Onay bekleyen içerik: mobil uygulama
  gerçek framework(ler)i (şu an React Native/Flutter/Kotlin/Swift TAHMİNÎ), sosyal linkler (LinkedIn/
  Instagram/Bionluk TAHMİNÎ, GitHub KrkAbdullah-06). (3) VERCEL'E YAYIN (kullanıcının GitHub hesabı VAR) —
  IP/firewall derdini bitirir, kalıcı adres. Blog sayfası hâlâ eski taslak (app/blog/page.tsx) — ya yenile ya kaldır.
- YEDEKLER: Services'in önceki sürümleri components/experience/Services.cards.bak (geri dönülebilir).

---

## 1) PROJE AMACI
Abdullah Kırkıl için **kişisel tanıtım + portföy + blog** sitesi. Hedef: insanlar siteye
girsin, onu tanısın, işlerini görsün ve **iş versin / iletişime geçsin** (siteden iş alıp
para kazanmak + kendini duyurmak).

**Kim:** Gazi Üniversitesi Yönetim Bilişim Sistemleri (MIS) 4. sınıf öğrencisi. Çok yönlü:
3D & mekanik tasarım (SolidWorks, AutoCAD), CNC üretim hazırlığı (SolidCAM), profesyonel
video edit, sosyal medya yönetimi, full-stack web geliştirme.

**Marka:** Site adı "Abdullah Kırkıl". Domain hedefi **abdullahkirkil.com** (henüz alınmadı).

**İletişim (sitede gösterilen):** E-posta `kirkilabdullah33@gmail.com`, Telefon/WhatsApp
`0553 952 50 51` (wa.me/905539525051), Konum `Ankara / Niğde`. Sosyal medya linkleri
ileride ADMIN panelinden yönetilecek.

**Çalışma tarzı (ÖNEMLİ):** Kullanıcı yazılımdan çok anlamıyor. Her şey ADIM ADIM, SADE
TÜRKÇE. Ekran görüntüsü atarak ilerliyor. Kurulum/hesap adımları "şu butona bas, şu bilgiyi
kopyala" düzeyinde anlatılmalı. Her adımda **tsc + lint = 0 hata** hedefi.

---

## 2) TEKNOLOJİ YIĞINI
- **Next.js 16.2.10** (App Router) — modern, hızlı, Vercel ile sorunsuz. React **19.2.4**.
- **TypeScript** (strict) — tip güvenliği.
- **Tailwind CSS v4** (`@tailwindcss/postcss`) — hızlı, tutarlı stil. Renkler CSS
  değişkenleri + `@theme inline` ile `app/globals.css`'te.
- **React Three Fiber v9** (`@react-three/fiber`) + **drei v10** (`@react-three/drei`) +
  **three 0.185** — 3D sahneler (arka plan mat çark). `three-stdlib` (drei bağımlılığı).
- **framer-motion v12** — giriş/scroll animasyonları.
- **lenis** — yumuşak (smooth) kaydırma. `components/ui/SmoothScroll.tsx`, `window.__lenis`.
- **@gltf-transform/cli** (npx ile) — glb sıkıştırma (kullanıldı; şu an modeller aktif değil).

**HENÜZ KURULMADI (Aşama 3 planı):** Prisma + **Neon (PostgreSQL)** (ücretsiz bulut DB),
**NextAuth** (admin girişi), **Cloudinary** (görsel/video — diske YAZMA, kalıcı olsun),
**GitHub + Vercel** (otomatik deploy). Hiçbiri kurulmadı; hesaplar açılmadı.

---

## 3) YAPILAN İŞLER
- ✅ Proje kurulumu (create-next-app; ad `abdullahkirkil-portfolio`), Git repo mevcut.
- ✅ **Tasarım sistemi**: Başta grafit+cyan+amber idi; sonra kullanıcı isteğiyle **SAF
  MONOKROM** (siyah-gri-beyaz) lükse çevrildi. Yazı tipleri **Space Grotesk** (başlık) +
  **Inter** (gövde). Türkçe dil, favicon (app/icon.svg), site metadata.
- ✅ **Logo**: "Ligatür + Halka" AK monogramı — `components/brand/Logo.tsx` (Logo + LogoMark).
  (NOT: aktif ana sayfa artık metin logotype kullanıyor; Logo bileşeni şu an kullanılmıyor.)
- ✅ **AKTİF SİTE = tek büyük scroll deneyimi** (`components/experience/Experience.tsx`):
  Awwwards tarzı, lüks monokrom. Bölümler: Hero (dev "ABDULLAH KIRKIL" + arkada mat çark) →
  Manifesto → **Hizmetler (Services)** → Portföy → İletişim → Footer. Arka planda scroll'la
  dönerek inen **mat büyük çark** (`BackgroundStage`), bölümler arası **yumuşak siyah↔beyaz**
  zemin geçişi, `mix-blend-difference` uyarlanabilir üst menü.
- ✅ **Hizmetler bölümü** (`components/experience/Services.tsx`): sinematik, fotoğraflı,
  sticky-split (masaüstü: solda sabit S/B görsel, sağda kayan 5 hizmet; mobil: her blokta
  görsel). 5 hizmet: 3D & Mekanik, CNC, Video, Sosyal Medya, Web.
- ✅ Arka plan çarkı: `components/three/BackgroundStage.tsx` (prosedürel dişli + somun,
  matte, scroll'da hareket, zemin rengini `bgColor` ref ile paylaşır).
- ⏳ Şu an: Hizmetler bölümü "daha canlı + daha iyi/alakalı foto" için iyileştiriliyor
  (globals.css'e `kenburns` animasyonu eklendi; Services'e uygulanması + foto doğrulama kaldı).

**TERK EDİLEN / KULLANILMAYAN (dosyalar duruyor ama import EDİLMİYOR):**
Eski bölüm bileşenleri `components/sections/*` (Hero, About, Services, Portfolio, Contact,
CinematicShowcase), `components/layout/Header+Footer`, `components/ui/LoadingScreen+
RouteTransition+Reveal+AnimatedBackground`, `components/three/MechParts+HeroScene+
CuttingScene`, `components/experience/ServiceJourney.tsx` (5-duraklı 3D patlama yolculuğu —
kullanıcı beğenmedi, terk edildi), `public/models/*.glb` (engine/cnc/camera/phone/laptop —
Sketchfab'den indirilip sıkıştırıldı; şu an KULLANILMIYOR). Bunlar ileride temizlenebilir.

---

## 4) DOSYA YAPISI (önemli)
```
app/
  layout.tsx        → RootLayout: fontlar + globals + <SmoothScroll/> + {children} (sade)
  page.tsx          → <Experience/> (tek şey)
  globals.css       → MONOKROM palet (CSS değişkenleri) + kenburns + loader-bar keyframes
  icon.svg          → favicon (AK monogram, mavi/cyan çizgili — monokromda nötr durur)
  blog/page.tsx     → basit "yakında" blog sayfası (aktif site scroll olduğu için ikincil)
components/
  experience/
    Experience.tsx      → ANA SİTE (scroll deneyimi, tüm bölümler + bg renk mantığı)
    BackgroundStage.tsx → sabit 3D mat çark (R3F Canvas, scroll'a bağlı, bgColor ref)
    Services.tsx        → Hizmetler (fotoğraflı sticky-split, 5 hizmet)
    ServiceJourney.tsx  → (KULLANILMIYOR) eski 3D patlama yolculuğu
  three/
    geometries.ts   → createGearGeometry / createFlangeGeometry / createHexNutGeometry
    (MechParts, HeroScene, CuttingScene → kullanılmıyor)
  ui/SmoothScroll.tsx → Lenis kurulumu (window.__lenis)
  (brand/Logo.tsx, layout/*, ui/* diğerleri → kullanılmıyor)
lib/site.ts         → siteConfig (isim, e-posta, telefon, wa, konum, nav)
public/models/*.glb → engine, cnc, camera, phone, laptop (KULLANILMIYOR, sıkıştırılmış ~9MB)
docs/PROJE-DURUMU.md → BU DOSYA
```
Kalıcı hafıza (ayrı): `C:\Users\ThinkPad\.claude\projects\C--Users-ThinkPad-Desktop-portfol-yo\memory\project-portfolio-site.md` (daha teknik detaylı geçmiş).

---

## 5) TASARIM & KARARLAR
- **Renk (MONOKROM):** bg `#08090a`, surface `#101114`/`#181a1e`, foreground `#f4f5f6`,
  muted `#9a9da3`, accent `#f4f5f6` (beyaz), gold `#cfd3d9` (gümüş), border rgba(255,255,255,.07).
  Hizmet fotoğrafları **grayscale + karartma**. (Renkli değil — kullanıcı "saf monokrom" seçti.)
- **Tipografi:** Space Grotesk (display, sıkı letter-spacing, dev boyutlar), Inter (gövde).
- **Yön:** Lüks, minimalist, geniş boşluk, keskin tipografi, sinematik, Apple/Tesla + Awwwards.
- **Deneyim:** Tek sayfa scroll; arka planda mat çark dönerek iner; bölümlere gelince zemin
  yumuşakça koyu↔beyaz döner; yazılar rengi otomatik uyum sağlar; üst menü mix-blend-difference.
- **3D KARARI:** Ağır glb modeller ve karmaşık 3D scroll yolculuğu DENENDİ ama kullanıcı
  beğenmedi ("geç geliyor, karmaşık, sade kaldı"). SONUÇ: hizmetler için 3D BIRAKILDI,
  yerine fotoğraflı sinematik bölüm. Arka plandaki tek mat çark 3D olarak kaldı.
- **İletişim formu:** (eski sürümde vardı) şimdilik e-posta/WhatsApp linkleri; ileride DB+mail.

---

## 6) KURULUM & ÇALIŞTIRMA
- **Proje yolu:** `C:\Users\ThinkPad\Desktop\portfolıyo` (klasör adında Türkçe "ı" var).
- **Çalıştırma:** `npm run dev` → `http://localhost:3000` (port 3000). launch.json'da "dev".
  Önizleme aracıyla da başlatılıyor (mcp__Claude_Browser__preview_start name:"dev").
- **Kontroller:** `npx tsc --noEmit` (tip), `npm run lint` (ESLint). Hedef: 0 hata.
- **AGENTS.md UYARISI:** Next.js kodu yazmadan önce `node_modules/next/dist/docs/` içindeki
  ilgili rehberi oku (bu sürümde API/konvansiyonlar değişmiş olabilir).
- **Env değişkenleri:** ŞU AN YOK. Aşama 3'te gerekecek (SADECE isimler):
  `DATABASE_URL` (Neon), `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `CLOUDINARY_CLOUD_NAME`,
  `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. (Gizli değerler dosyaya YAZILMAZ; `.env` gizli.)
- **Hesap/servis durumu:** Neon ❌, Cloudinary ❌, GitHub repo (yerel var; remote ?), Vercel ❌,
  Domain ❌. Sketchfab hesabı Epic Games ile açılıyor (kullanıcı denedi).

---

## 7) MEVCUT DURUM (en son ne yapıyorduk)
Site "çok boş" geri bildirimi üzerine ZENGİNLEŞTİRİLDİ. Aktif sayfa akışı (Experience.tsx):
**Hero → Marquee (kayan yazı bandı) → Manifesto → Hakkımda → Hizmetler → Süreç → Portföy
(görselli ızgara) → İletişim → Footer.** Yeni bölümler `components/experience/Sections.tsx`
içinde: `Marquee` (sonsuz kayan keyword bandı, CSS `.animate-marquee`), `About` (#hakkimda:
bio + skill chip'leri + istatistik + AK monogram panel), `Process` (#surec: 4 adımlı süreç
kartları), `Work` (#portfoy: grayscale görselli hover-zoom proje ızgarası). tsc+lint TEMİZ,
konsol hatasız, scrollHeight ~11000 (dolu). 9 bölüm de DOM'da doğrulandı.
- `globals.css`: `.animate-marquee` (marquee) + `.kenburns` keyframe'leri eklendi
  (kenburns şu an Services'te aktif uygulanmadı; hazır bekliyor).
- **Görseller (Unsplash grayscale):** video/sosyal/web İÇERİK doğrulandı. mekanik
  (`1519861531473-9200262188bf`) + CNC (`1504917595217-d4dc5ebe6122`) İÇERİK DOĞRULANMADI
  (screenshot çalışmıyor) — kullanıcı gözle kontrol edip yanlışsa değiştirmeli. Aynı görseller
  hem Services hem Work'te kullanılıyor. loremflickr TERK (flaky/500).
- Bölüm bg renkleri MODES=[0,0,0,1,1,0] tüm sayfaya yayılıyor; yeni bölüm sayısıyla tam
  hizalı değil ama dekoratif (yazı rengi `light` state ile otomatik uyum sağlıyor).
- "Çok boş" geri bildirimi için EKLENDİ: Experience'te GLOBAL DOKU katmanı (fixed, -z-[5]:
  ince currentColor ızgara 70px + iki yumuşak ışık halesi/blur) → hiçbir yer boş durmasın.
  Hero'ya alt açıklama + "3D&Mekanik ✦ CNC ✦ Video ✦ Sosyal ✦ Web" hız şeridi eklendi.
- HATIRLATMA: Kullanıcı "boş" derse önce SERT YENİLE (Ctrl+Shift+R) dedirt — çoğu ekleme
  önbellek yüzünden görünmemiş olabiliyor.
- HİZMETLER FOTOĞRAFLARI KALDIRILDI (kötüydü). Services.tsx artık FOTO YOK: masaüstü sticky
  panelde `ServiceGear.tsx` = dönen metalik DİŞLİ GRUBU (3D, reliable — hero/loader tekniği,
  frameloop=always) + üstünde aktif hizmetin BELİRGİN line-ikon + dev numara + başlık.
  Mobilde SVG `Visual` (ikon+halka+ızgara). İkon strokeWidth 1.3 (kalın/belli). Toplam 2
  canvas (bg çark + hizmet dişlisi), ikisi de hafif. Work(#portfoy) HÂLÂ foto kullanıyor
  (aynı Unsplash görselleri) — kullanıcı isterse o da tasarımsal panele çevrilebilir.

---

## 8) SIRADAKİ ADIMLAR (öncelik sırası)
0. ✅ YAPILDI (bu turda) — HİZMETLER TAM YENİDEN TASARLANDI (kullanıcı Q&A ile karar verdi):
   Kullanıcı "daha effektif, yaratıcı, dinamik, hareketli; scroll'da efektli gelsin; hizmet
   değişince arka plan değişsin; 3D ekleyelim" dedi ve tasarım sorularına şu cevapları verdi:
   - Düzen: sabitlenmiş (pinned) YATAY KAYAN DESTE + sürekli duran 3D (harman).
   - 3D: tek "SIVI METAL (CIVA)" obje, kaydırdıkça morph + etrafında parçacıklar + FAREYE tepki.
   - Arka plan: hizmete göre renk-ışık dalgası + ızgara yoğunluğu değişimi.
   - Giriş: MASKELİ AÇILIM (başlık maskeden yukarı çıkar).
   - Renk: monokrom + ince vurgu. İçerik: her hizmette ARAÇ/YAZILIM ROZETLERİ.
   UYGULAMA:
   - `components/experience/ServiceOrb.tsx` (YENİ): R3F Canvas, sphere(1.55,128,128) +
     drei MeshDistortMaterial (sıvı metal: metalness 1, roughness .06, distort lerp'lenir,
     speed hizmete göre), 540 parçacık (deterministik sin-hash — Math.random YASAK: react-hooks/purity),
     state.pointer ile fare tepkisi (tilt grubu lerp), hizmete özel renkli pointLight + parçacık
     rengi lerp. frameloop="always". Not: material.distort ref yerine mesh.material cast ile
     lerp'lenir (ref'e render'da yazmak react-hooks/refs hatası veriyor → target.current.set useFrame içinde).
   - `components/experience/Services.tsx` (YENİDEN YAZILDI): Masaüstü = pinned yatay deste;
     dış sarmalayıcı height=N*100vh (500vh), içeride sticky top-0 h-screen. Sol yarıda ServiceOrb,
     sağ yarıda 5 panel yatay track (width N*50vw), scroll handler translateX'i track.current.style'a
     rAF ile yazar (re-render YOK), active değişince setActive. Arka plan ışıma+ızgara aktif renge göre.
     Başlıklar framer motion maskeli açılım, araç rozetleri (tools[]). Mobil (lg:hidden) = dikey kart
     yığını (aynı içerik, 3D yok — çift WebGL'den kaçınmak için; global çark zaten var).
   - `Experience.tsx`: zemin siyah↔beyaz geçişi artık KONUM tabanlı (portföy/iletişim
     getBoundingClientRect ile) — 500vh'lik Hizmetler bölümü eski MODES segment mantığını bozmasın diye.
   DOĞRULAMA: tsc+lint=0. DOM: yeni track+orb+45 rozet canlı, eski Ring/Visual/grid tamamen gitti.
   GÖRSEL/animasyon DOĞRULANAMADI: preview sekmesi document.hidden=true → requestAnimationFrame
   duraklı (hem yatay scroll hem 3D bu gizli sekmede güncellenmez). Konsoldaki hydration hatası
   ESKİ Ring kodundan kalma stale tampon (yeni DOM'da o kod yok). Kullanıcı gerçek tarayıcıda
   (Ctrl+Shift+R) Hizmetler'e kaydırıp değerlendirecek.
0b. ✅ YAPILDI (revizyon — kullanıcı geri bildirimi): (1) Web/Sosyal'de zemin beyaza
   dönüp siyah çark yazıların üstüne geliyordu → Hizmetler sticky'sine OPAK KOYU zemin
   `bg-[#08090a] text-[#f4f5f6]` verildi; bölüm artık HEP koyu, global beyaz geçiş + çark
   bu bölümü örtmüyor (garantili okunabilirlik; global çark bu 500vh bölümde görünmez).
   (2) Yazılar YANA KAYMASIN → yatay track KALDIRILDI; başlık artık sabit konumda, scroll'da
   hizmet değişince ROBOTİK "decode" (DecodeText: setInterval ile karakter çözülme, key={active}
   ile remount) efektiyle gelir. Kategori/rozetler font-mono. (3) Sıvı metal orb BEĞENİLMEDİ →
   yerine SİTEYE ÖZEL 3D "AK" MONOGRAM LOGOSU: `components/experience/ServiceLogo3D.tsx`
   (metalik kirişlerden A·K ligatür — ortak dikey gövde + hassasiyet halkası; her hizmete
   geçince döner + kısa titreşim/pulse, hizmete özel renkli ışık, fareye hafif tepki).
   ServiceOrb.tsx artık KULLANILMIYOR (dosya duruyor). DOM doğrulandı: stickyBg koyu, logo
   canvas=1, decode çalışıyor (mid-scramble yakalandı), track yok, mono stil var.
0c. ✅ YAPILDI (NİHAİ hibrit — kullanıcının netleştirdiği son istek): Hizmetler =
   robotik decode yazı + arkada dönen çark + değişen zemin + sadece web/sosyalde metalik gri.
   - YATAY KAYMA YOK (kullanıcı: "sağa sola kayma geçişi olmasın"): track kaldırıldı, sağdaki
     yazı SABİT konumda; hizmet değişince DecodeText ile robotik "dökülüp oluşma" (key={active}).
   - ARKA PLAN ŞEFFAF (kullanıcı: "arka plan değişsin, çark dönsün arkada"): sticky'de OPAK zemin
     YOK (stickyBg=transparent doğrulandı) → global BackgroundStage çarkı arkada görünür/döner +
     hizmete göre renk ışıması + ızgara yoğunluğu değişir. (Experience zemin geçişi konum tabanlı.)
   - SOL: ServiceOrb (sıvı metal) korundu, morph. ServiceLogo3D.tsx yapıldı ama şu an KULLANILMIYOR.
   - METALİK GRİ SADECE web(idx4)+sosyal(idx3): `readStyle = active>=3 ? METAL : undefined`
     (METAL: #dcdfe4 + text-shadow) → beyaza dönen zeminde okunur; diğer hizmetlerde currentColor.
   DOĞRULANDI (DOM): orbCanvas=1, totalCanvas=2, noTrack=true, stickyBg=transparent, decode
   çözülüyor, font-mono var. GÖRSEL/animasyon: preview sekmesi hidden → rAF duraklı, kullanıcı bakacak.
0d. ✅ YAPILDI (arka plan mat monokrom): Kullanıcı "arka plan renk geçişleri yok, arka plan
    renk değişsin; metalik gri/beyaz/siyah MAT renkler olsun; ama renkleri (vurgular) kaldırma"
    dedi. Çözüm: her hizmete YARI SAYDAM MAT MONOKROM zemin (services[i].bg = rgba):
    01 siyah(0.70) → 02 koyu gri(0.76) → 03 orta metalik gri(0.82) → 04 açık gri(0.85) →
    05 mat beyaz(0.88). Yarı saydam olduğu için global ÇARK arkada hafif görünür. Renkli
    vurgular KORUNDU (orb ışığı, radial halo, ikon, rozet, dot = services[i].color). Yazı tonu
    zemine göre: dark→#eef0f2, light→#0b0c0e + uyumlu text-shadow (tone objesi, sticky'de
    transition-colors). readStyle/METAL kaldırıldı. DOĞRULANDI: matteBg rgba(11,12,14,0.7),
    stickyColor açık, orb=1, noTrack, decode çalışıyor.
0e. ✅ YAPILDI (yeniden yön — kullanıcı: "çark çok arkada kaldı, scroll takılıyor akıcı değil,
    fazla kaydırınca değişiyor, renkler iyi değil, daha yaratıcı"): 
    - ÇARK ÖNE ALINDI: `components/experience/ServiceMechanism.tsx` (YENİ) = birbirine geçen
      büyük metalik çark grubu (createGearGeometry x3 + hex somun), öne çıkan kahraman. Sol %56.
    - AKICILIK: ağır ServiceOrb (MeshDistortMaterial 128² sphere + 540 parçacık + env192) KALDIRILDI;
      yerine hafif çark (standart material, env128, dpr [1,1.5]). ServiceOrb.tsx artık kullanılmıyor.
    - DAHA AZ KAYDIRMA: bölüm 500vh → 275vh (N*55vh), hizmetler hızlı değişir (ratio 2.75 doğrulandı).
    - RAFİNE RENK: baskın monokrom metal + zarif tek vurgu; koyu premium zemin (#090a0c) + hizmete göre
      ince renk haresi (color 2e alpha) + vinyet. Yeni palet: 01#d6a24e 02#6fa6cc 03#cf7d57 04#a68fce 05#5cbf97.
      Yazı hep açık (okunur, beyaz-flip YOK). Başlık altında vurgu çizgisi (scaleX animasyon).
    - Robotik decode + yana kayma yok korundu. NOT: hâlâ 2 canvas (global çark + mekanizma); scroll
      hâlâ takılırsa sıradaki kaldıraç: Hizmetler'de global BackgroundStage'i duraklat/gizle.
    DOĞRULANDI: gearCanvas=1, ratio=2.75, stickyBg koyu, noTrack, decode çalışıyor. Görsel/akıcılık
    preview'da doğrulanamaz (sekme hidden → rAF duraklı) — kullanıcı bakacak.
0f. ✅ YAPILDI (kullanıcı: "öndeki çark sahnesini tamamen kaldır, oraya hiçbir şey koyma; hizmet
    değiştikçe ARKA PLANDA çarkımız görünsün/dönsün; RENK değişsin; çark yazının üstüne gelip
    okunmazsa sadece üstündeki harflerin rengi değişsin ki okunsun"):
    - ServiceMechanism (öndeki çark) KALDIRILDI, Services artık hiç canvas render etmiyor
      (sectionCanvas=0). Sol taraf boş. Sayfada tek canvas = global BackgroundStage çarkı (perf ↑).
    - Sticky ŞEFFAF → global çark arka planda görünür/döner.
    - Her hizmette arka plan RENGİ: `${color}3d` full tint + radial `${color}5c` (transition-colors),
      yarı saydam → çark görünür. Palet: 01#d6a24e 02#6fa6cc 03#cf7d57 04#a68fce 05#5cbf97.
    - Yazı `mix-blend-difference text-white` (doğrulandı: mixBlendMode=difference) → çark/zemin
      harflerin ardına gelince o harfler otomatik tersine döner = HER ZAMAN OKUNUR (istenen efekt,
      hero'daki teknik). Üst başlık + dots + ipucu da blend. Renkli vurgu artık sadece arka planda.
    - Robotik decode + yana kayma yok korundu. Bölüm 275vh. ServiceMechanism.tsx + ServiceOrb.tsx +
      ServiceLogo3D.tsx artık KULLANILMIYOR (dosyalar duruyor).
    DOĞRULANDI: sectionCanvas=0, totalCanvas=1, blendMode=difference, tint rgba, decode çalışıyor.
0g. ✅ YAPILDI: Hizmetler'in boş SOL alanına siteye özel MARKA LOGOSU eklendi (Services.tsx `Brand()`):
    dönen kesikli hassasiyet halkası ([animation:spin_22s]) + rounded-square badge içinde "AK" ligatür
    monogram (SVG stroke) + "ABDULLAH KIRKIL" wordmark + "Tasarım · Üretim · Web" tagline. mix-blend-difference
    (çark üstünden geçince okunur). Yazı bloğu sağ %60 alana alındı (eski justify-end'e göre biraz daha solda).
    DOĞRULANDI: hasBrandBadge=true, ringSpin=spin, wordmark var.
0h. ✅ YAPILDI: PORTFÖY / Seçili İşler SİNEMATİK yenilendi (Sections.tsx Work()): eski 3'lü ızgara
    yerine ALTERNATİF editoryal satırlar (bir sağdan bir soldan, lg:flex-row-reverse). Her satır:
    büyük görsel (aspect-4/3) framer PERDE AÇILIŞI (clipPath inset(100%)→inset(0)) + hover yavaş zoom
    (scale-105) + grayscale brightness .72 + dark gradient + grid + dev hayalet numara (text-white/10)
    + hover'da "Projeyi Gör ↗" rozeti; metin tarafı: mono kategori · yıl, büyük başlık, açıklama,
    "Projeyi Gör →" alt-çizgili link. Görseller Unsplash (5 ID, HEAD 200 doğrulandı — yükleniyor).
    href şimdilik #iletisim (proje sayfaları Aşama 3+). Monokrom/currentColor → portföy beyaz zemininde okunur.
    DOĞRULANDI: articles=5, reversedRows alternatif, firstImgStatus=200.
0i. ✅ YAPILDI: İLETİŞİM + FOOTER sinematik yenilendi (Experience.tsx).
    - İletişim: sol hizalı editoryal. "Yeni projelere açık" animate-ping nokta + büyük başlık
      "Bir fikrin mi var? Hayata geçirelim." (mix-blend-difference) + DEV tıklanır e-posta + dönen ↗
      ok + 3'lü meta grid (WhatsApp link / Konum / Yanıt Süresi 24 saat). min-h-screen.
    - Footer: (REVİZE) kullanıcı "eski footer daha iyiydi + karanlık olsun" dedi → ESKİ SADE FOOTER
      geri getirildi (min-h-screen justify-end: marka + Menü/İletişim sütunları + ©). min-h-screen
      olduğu için zemin geçişi tamamlanır → footer KARANLIK. Yeni dev "KIRKIL" imza/AK-svg KALDIRILDI.
    - Zemin geçişi (Experience light exit): İletişim'in ALT YARISI kararsın diye erken başlar:
      exit = smoothstep((1.25*vh - iletisimBottom)/vh). Böylece İletişim üst yarı beyaz → alt yarı koyu → footer koyu.
    DOĞRULANDI: İletişim (availPing/bigEmail/metaCols=3) korundu; footer sade, KIRKIL imza yok, 2 sütun, ©.
    - (REVİZE 2) İletişim↔Footer boşluğu fazlaydı → İletişim min-h-[88vh] py-24.
    - (REVİZE 3 — SON) Footer 35vh olunca "çok yakın + kararmıyor" oldu → Footer min-h-[55vh] justify-end
      pt-20 pb-14 (orta nokta). ZEMİN GEÇİŞİ artık FOOTER KONUMUNA bağlı (iletişim bottom yerine):
      exit = smoothstep((vh - footerTop)/(0.55*vh)) → footer kısa olsa da TAM kararır. DOĞRULANDI
      (en alta Lenis ile kaydırıp hesaplandı): footerVh=0.55, exit=1.00, bg t=0.00 (tam koyu).
0j. ✅ YAPILDI: AÇILIŞ EKRANI (components/experience/LoadingScreen.tsx, layout.tsx'te <LoadingScreen/>):
    koyu zemin (#08090a) + ince ızgara + dönen kesikli halka + "AK" monogram + ABDULLAH KIRKIL +
    "Tasarım · Üretim · Web" + ilerleme çubuğu & yüzde sayacı (000→100). setInterval (arka plan sekmede
    bile ilerler, ~1.3sn foreground) → 100'de soluklaşır (opacity 700ms) → unmount (gone). Yüklenirken
    body overflow kilitli. DOĞRULANDI: loaderPresent, monogram/ring/name/progressBar var, percent ilerliyor.
0k. ÇARK yanındaki SOMUN kaldırıldı (BackgroundStage.tsx): nut mesh/geo/material/import silindi, tek çark kaldı.
0m. ✅ YAPILDI: TEK KAYNAK LOGO — components/brand/AKMark.tsx (saf SVG "AK" ligatür, currentColor,
    strokeWidth prop). Kullanım: (a) Hakkımda paneli: "AK" yazısı → AKMark (h-44). (b) Header: ismin
    SOLUNA AKMark (h-5). (c) Açılış ekranı LoadingScreen: inline SVG → AKMark (tutarlılık). (d) FAVICON:
    app/icon.svg monokrom AK badge'e çevrildi (rect #0a0b0d + beyaz monogram; eski cyan/amber silindi).
    DOĞRULANDI: headerHasLogo, aboutHasLogo (AK text gitti), favicon icon.svg yeni.
    LOGO EVRİMİ (kullanıcı kararları): önce AK ligatür → "bu değil, sıfırdan" → 6 konsept sunuldu
    (widget) → kullanıcı "3 (Halka+A)" seçti + "K'yi ekle" → halka+AK+tik → "çok çocukça, ince/zarif,
    nokta kaldır, K A'ya birleşsin, sıfırdan" → SON: A ve K BİRLEŞİK ince ligatür (ortak dikey gövde,
    HALKA YOK, NOKTA YOK). AKMark paths: stem M49 16 V84 / A-leg M27 84 L49 16 / crossbar M34 58 H49 /
    K-üst M49 51 L72 25 / K-alt M49 51 L72 84. strokeWidth: header 5, hakkımda 3.6, loading 4.5, favicon 5.
    DOĞRULANDI: 5 path, halka yok.
    → sonra "çerçeve ekle" (rounded-rect frame + AK) → sonra "SolidWorks + web + AK'yı birleştir"
    → 3 füzyon konsepti sunuldu (widget: altıgen AK / kod ⟨AK⟩ / 3D kutu AK) → kullanıcı "3 (3D kutu)"
    seçti "daha şık zarif mat". SON LOGO: EKSTRÜDE 3D KUTU (SolidWorks/CAD) + ön yüzünde birleşik AK.
    AKMark 11 path (kutu 6 kenar + AK 5 çizgi), ince/mat. strokeWidth: header 4, hakkımda 2.6, loading 3.2,
    favicon 4. DOĞRULANDI: headerPaths=11, aboutPaths=11. Fikir: A+K harfleri + hem 3D/mekanik hem dijital his.
0l. ✅ YAPILDI: SAYFA GEÇİŞİ (header + footer nav linkleri): tıklayınca beyaz sade overlay
    (fixed z-[90], bg-#f4f5f6) + ortada SİYAH 3D dönen çark (components/experience/TransitionGear.tsx,
    createGearGeometry, meshStandardMaterial #0a0b0d). Experience.tsx: transActive state + transRef guard +
    goTo(id|"top") (Lenis scrollTo immediate) + startNav (overlay→520ms hedefe kay→1150ms kapan). Header
    logosu "top", nav 3 + footer Menü 3 linki e.preventDefault()+startNav'a bağlı. Not: overlay z-90, loader z-100 üstünde.
    (REVİZE) Kullanıcı: "beyaz olmasın blur olsun, ortada 3D logomuz, üstte Apple gibi siyah dolma" →
    overlay artık: koyu blur panel (bg-#0a0b0d/70 + backdrop-blur-2xl) ÜSTTEN dolar (clip-path inset(0 0 100%)→
    inset(0), 600ms cubic-bezier) + ortada 3D "AK" monogram (components/experience/TransitionLogo3D.tsx,
    metalik, yavaş Y dönüş + ters dönen halka). TransitionGear.tsx artık KULLANILMIYOR. Zamanlama:
    goTo 640ms, reveal(transActive=false) 1050ms, guard reset 1700ms. DOĞRULANDI: backdropFilter blur(40px),
    panelBg koyu 0.7, logoCanvas=1, clip-path inset (ön planda üstten dolar).
    (REVİZE 2) Kullanıcı: "üstten gelmesin ortadan blur gelsin + gelirken takılıyor" →
    (1) clip-path artık MERKEZDEN dairesel: circle(0% at 50% 50%)→circle(150%) (üstten inset kaldırıldı).
    (2) Takılma = geçişte R3F canvas o an mount oluyordu (WebGL hitch) → TransitionLogo3D SÜREKLİ mount,
    boştayken frameloop={active?'always':'never'} ile duraklı (mount hitch yok, boşta GPU yok). blur-2xl→blur-xl.
    DOĞRULANDI: clipUsesCircle=true, canvasAlwaysMounted=1, backdrop blur(24px).
    (REVİZE 3 — nimak.com.tr referansı) Kullanıcı: "blur takılmasın/donmasın, arka sayfa tak diye
    zıplamasın daha akışkan, üstte dolma barı (nimak mavi → bizde monokrom), logo önce öne baksın sonra dönsün":
    (1) clip-path KALDIRILDI (stutter kaynağıydı) → örtü OPACITY ile açılır (akıcı). (2) örtü bg-#0a0b0d/92
    (daha opak) → Lenis immediate scroll zıplaması gizli. (3) ÜSTTE DOLMA BARI: inset-x-0 top-0 h-[3px]
    bg-white/10 track + beyaz fill width 0→100% (950ms). (Not: koyu zeminde siyah bar görünmez → beyaz
    kullanıldı = monokrom karşılığı; istenirse örtü açık+bar siyah yapılır.) (4) TransitionLogo3D Logo({active}):
    aktif olunca rotation sıfırlanır, ilk ~0.5sn ÖNE bakar, sonra rotation.y=spin*1.1 döner. Zamanlama:
    goTo 430, reveal 1080, reset 1650. DOĞRULANDI: clipPath=none, coverBg 0.92, hasTopBar+barWidth 100%, canvas=1.
    (REVİZE 4) Kullanıcı "logo yerine İSİM daha güzel" dedi → geçiş ortasındaki 3D logo KALDIRILDI,
    yerine "ABDULLAH KIRKIL" iki satır WORDMARK: her satır overflow-hidden mask + translate-y-full→0
    (staggered delay i*90ms) yükselir + "Tasarım · Üretim · Web" tagline fade (260ms). TransitionLogo3D
    import kaldırıldı (dosya duruyor, kullanılmıyor) → geçişte artık canvas YOK (daha hafif). DOĞRULANDI:
    canvasInOverlay=0, nameLines=[ABDULLAH,KIRKIL], topBar+tagline var.
0n. ✅ YAPILDI (HİZMETLER TAM YENİDEN — kullanıcı "hâlâ sevemedim, sıfırdan, şık sade yaratıcı, UI/UX,
    scroll'da hover+effect"): pinned/3D/decode/orb yaklaşımı TAMAMEN kaldırıldı. Yeni Services.tsx =
    editoryal ETKİLEŞİMLİ LİSTE (canvas YOK). 5 satır, hairline ayraç. Efektler: (a) scroll reveal
    (framer whileInView opacity+y stagger). (b) hover-expand accordion: detay (desc+araç etiketleri)
    CSS grid-template-rows 0fr→1fr, overflow-hidden child (masaüstü kapalı, mobil açık). (c) sol renkli
    aksan çizgisi scale-y. (d) hover zemin haresi. (e) diğer satırlar soluklaşır (lg:group-hover/list:opacity-40
    + lg:hover:!opacity-100). (f) ok rotate-45+accent, başlık translate-x, numara/ikon accent renk (CSS var --ac).
    DOĞRULANDI: rows=5, canvas=0, detay masaüstü 0px (kapalı), overflow hidden.
0o. ✅ YAPILDI (kullanıcı "gayet iyi, scroll kaydırdıkça efektli yap"): Services'e SCROLL SÜRÜCÜLÜ
    efektler eklendi. rAF scroll handler → ekran ortasına en yakın satır = active. Aktif satır SPOT
    IŞIĞINDA (opacity 1, aksan çizgisi scale-y-100, zemin haresi, numara/ikon accent renk, ok rotate-45),
    diğerleri opacity-40; hover hâlâ override (lg:hover:!opacity-100). Ayrıca: ayraç çizgileri scaleX
    0→1 çizilir, başlıklar overflow-hidden mask içinde y 110%→0 yükselir, başlık sayacı "01 / 05" aktif
    hizmete göre değişir. Satırlar ferahlatıldı (py-10 sm:py-14). ÖNEMLİ: scroll YÜKSEKLİĞİ değiştirmez
    (detay açılması sadece hover/mobil) → sayfa zıplaması yok. DOĞRULANDI: rowOpacities [1,.4,.4,.4,.4],
    separatorLines=5, detay 0px, counter 01/05. (Not: preview sekmesi hidden → rAF duraklı, active hep 0 görünür.)
0p. ✅ YAPILDI (PORTFÖY YENİDEN — kullanıcı "UI/UX'e göre düzenle, KATEGORİK olsun, kendi projelerimi
    atacağım, her proje AYRI KART"): Sections.tsx Work() = KATEGORİ FİLTRELİ KART IZGARASI.
    - CATEGORIES: Tümü / 3D & Mekanik / CNC Üretim / Video / Sosyal Medya / Web. CAT_COLOR map (kategori rengi).
    - `projects` dizisi (8 temsili proje, id/title/cat/year/desc/img) — YENİ PROJE = bu diziye nesne ekle.
    - Filtre çipleri: sayı rozetli, aktif çip vurgulu (useState cat). Başlıkta "{n} proje" sayacı.
    - Kartlar: responsive grid (1/2/3 sütun), framer layout + AnimatePresence(popLayout) ile yumuşak
      yeniden dizilim; scroll reveal stagger. Kart: grayscale görsel (hover'da zoom+brightness), üstte
      kategori rozeti (backdrop-blur), hover'da dönen ok, altında kategori renginde scaleX çizgi, tam
      kart tıklanır (şimdilik #iletisim).
    - Görseller Unsplash, 12 aday HEAD-test edildi hepsi 200 (kırık yok). Aşama 3'te admin/DB'den gerçek işler.
    DOĞRULANDI: çipler+sayılar (Tümü8/3D2/CNC1/Video1/Sosyal1/Web3), Web tık→"3 proje"+aktif çip,
    CNC tık→"1 proje". (Not: hidden preview'da rAF duraklı → framer exit bitmez, kartlar DOM'da kalır; gerçek tarayıcıda sorun yok.)
0q. ✅ YAPILDI: ÇARK OKUNABİLİRLİK — çark koyu (#2b2c31) olduğu için zemin beyazlayan bölümlerde
    (Portföy/İletişim) koyu yazıların üstüne gelince okunmuyordu (kontrast 1.41:1). BackgroundStage'de
    çark rengi artık ZEMİNE göre lerp: bgColor.r'den t hesaplanır, gearDark #2b2c31 → gearLight #c4c8ce
    (metalik açık gri). Ölçüldü: yeni kontrast 11.73:1 (koyu yazı/açık çark), koyu bölüm 12.76:1. Not:
    sadece 4 öğe mix-blend-difference korumalı (header, hero h1, manifesto, iletişim h2); gerisi currentColor.
0r. ✅ YAPILDI: İLETİŞİM ALT PANELİ (components/experience/ContactPanel.tsx) — İletişim meta satırı ile
    footer arasındaki boşluğa eklendi. SOL: ziyaretçi mesaj FORMU (Ad Soyad / E-posta / Mesaj + Gönder),
    şimdilik MAILTO ile çalışır (sunucu yok; Aşama 3'te API route + Resend ile doğrudan gönderime çevrilebilir).
    SAĞ: sosyal hesaplar listesi (LinkedIn, Instagram, GitHub, Bionluk, WhatsApp) Tabler tarzı stroke ikonlar,
    hover'da kayma+↗. ⚠️ LinkedIn/Instagram/Bionluk URL'leri TAHMİNİ placeholder (kullanıcıdan gerçek
    kullanıcı adları alınacak). GitHub git config'ten: KrkAbdullah-06. WhatsApp gerçek.
0s. ✅ YAPILDI (6. HİZMET + KART TASARIMI + entegrasyon — kullanıcı 1 haftada yayın istiyor):
    - Services.tsx TAMAMEN yeniden: havalı KART IZGARASI (grid 1/2/3 sütun). Kart: ikon kutusu, hayalet
      numara, başlık, AÇIKLAYICI desc, araç etiketleri, hover'da: kalkma (-translate-y), accent kenar +
      glow (shadow var --ac), köşe ışıması (blur, sadece hover→mobil maliyet yok), ikon accent renk, alt
      accent çizgi scaleX. Scroll reveal stagger. (Eski scroll-spot liste kaldırıldı → mobil daha hafif.)
    - 6. HİZMET: "Mobil Uygulama Geliştirme" (icon "mobile" eklendi, color #7b8cf5, tools React Native/iOS/
      Android/App Store — ⚠️ framework tahminî, kullanıcıdan doğrulanacak).
    - Açıklamalar UZMANLIK belli edecek şekilde elden geçirildi (3D=SolidWorks/AutoCAD, CNC=AutoCAD/SolidCAM,
      Sosyal=Meta Ads/reels/reklam, Web=profesyonel/uçtan uca).
    - ENTEGRASYON (her yere): Marquee'ye MOBİL UYGULAMA, skills'e Meta Ads/React Native, stat "5 Alan→6 Alan",
      Hakkımda metni, Hero "beş→altı alan" + Mobil rozeti, Footer "· mobil uygulama", Süreç adımı, Portföy
      CATEGORIES+CAT_COLOR "Mobil Uygulama" (#7b8cf5) + 2 mobil proje (id 09,10; görseller HEAD 200).
    DOĞRULANDI: 6 hizmet kartı, 7 kategori çipi (Mobil Uygulama 2), portföy 10 kart, mobil görseller 200.
0t. ✅ YAPILDI (LOGO YENİDEN + 3D Hakkımda): Kullanıcı "logoyu daha zarif sıfırdan tasarla, her yere
    entegre et, Hakkımda'da 3D dönsün". AKMark → 3D kutu/çerçeve KALDIRILDI, zarif ince UZUN "AK LİGATÜR"
    (5 path: stem M49 18 V82 / A-leg / crossbar / K-up / K-low). app/icon.svg da eşitlendi. Header/footer/
    açılış otomatik güncellendi. YENİ: components/experience/LogoSpin3D.tsx — metalik AK ligatür kirişleri,
    yavaş Y dönüş + X salınım (R3F). About (Sections.tsx): matchMedia(min-1024) → masaüstü 3D dönen logo,
    MOBİL statik AKMark (mobilde ekstra WebGL yok). DOĞRULANDI: header 5 çizgi/kutu yok; masaüstü hakkımda
    canvas=1 (toplam 2), mobil hakkımda canvas=0 (toplam 1, statik logo var).
0u. ✅ YAPILDI (mobil eşitleme): Kullanıcı "logo mobilde 3D olsun, hizmet hover mobilde de olsun, çark
    biraz takılıyor". (1) LogoSpin3D artık HER cihazda (About). active(IntersectionObserver, panel görünür)
    → frameloop; ekranda değilken durur (GPU yok). mobile prop → dpr1/env64/antialias off. AKMark statik
    fallback kaldırıldı (About artık hep 3D). (2) Services kart efektleri mobilde HEP AÇIK: ikon accent
    renk (lg:group-hover, max-lg hep) + alt çizgi scale-x-100 (lg:scale-x-0 lg:hover). (3) Çark mobil dpr
    1→0.8. DOĞRULANDI (mobil 390 üretim): hakkimdaCanvas=1, ikon accent renk, alt çizgi görünür.
0v. ✅ YAPILDI (mobil ince ayar): (1) Logo pixelliydi → LogoSpin3D mobil dpr [1,2]+antialias açık (canvas
    küçük, ucuz). (2) Çark hâlâ takılıyordu → mobil dpr 0.8→0.65, env 64→24. (3) "Hover'lar PC gibi olsun":
    Services'e SCROLL-ACTIVE kart eklendi — ekran ortasına gelen kart (active) PC hover efektinin AYNISINI
    alır (lift + accent border + shadow + alt çizgi + ikon renk), `on ? max-lg:...` ile SADECE mobilde;
    masaüstü hover aynen. Konumlar cache'li (scroll'da layout okuma yok). NOT: hidden preview'da rAF duraklı
    → scroll-active + framer reveal görsel doğrulanamadı, kod doğru; kullanıcı telefonda görecek.
0w. ✅ YAPILDI (MOBİL AKICILIK — kök sebep): "gezerken/reveal gelirken takılıyor". KÖK SEBEP: Lenis
    smooth-scroll MOBİLDE scroll'u ANA iş parçacığında yürütüyor; çark(fullscreen WebGL 60fps) + framer
    reveal ile çakışınca takılma. ÇÖZÜM: SmoothScroll.tsx → mobilde (max-1023) Lenis MOUNT EDİLMEZ → native
    scroll (compositor thread → pürüzsüz). __lenis undefined; goTo/startNav native fallback kullanır.
    Ek: Services kart reveal hafifletildi (scale kaldırıldı, y 60→32, süre/delay düştü); çark mobil dpr
    0.65→0.5. DOĞRULANDI: mobil __lenis undefined (lenisKapali=true), htmlLenisClass=false, 6 kart, canvas=2.
0x. ✅ YAPILDI (çark mobil — son kaldıraçlar): Kök sebep: iOS/mobil scroll'u PARMAKLA kaydırırken
    scroll olayı GÖNDERMİYOR (momentum bitince toplu) → çark scroll'a bağlı olduğu için donup zıplıyordu.
    ÇÖZÜM: BackgroundStage GearAssembly'de mobil dalı ZAMANA bağlı hareket (rotation/position = sin(clock),
    scroll'dan bağımsız → hep akıcı). + 30fps CAP (FpsCap: frameloop="demand" + 30fps invalidate) +
    dpr 0.6. Masaüstü scroll-driven aynen. NOT: mobilde çark artık scroll'la İNMİYOR, kendi sakin
    temposunda süzülüyor (bilinçli tercih — akıcılık için). EĞER hâlâ takılırsa GARANTİLİ çözüm: mobilde
    2D/CSS çark (compositor, WebGL yok) — kullanıcıya opsiyon sunuldu. DOĞRULANDI: mobil çark var, lenis kapalı.
0y. ✅ Hizmetler → PREMIUM SPOTLIGHT KARTLAR (kullanıcı "sen daha iyisini yap" dedi, bento'dan sonra):
    Dengeli 3'lü ızgara (lg:grid-cols-3 auto-rows-fr, 6 eşit kart). İMLEÇ-TAKİPLİ IŞIK HUZMESİ (spotlight):
    onMouseMove → CSS var --mx/--my (px), radial-gradient overlay accent renkte imleci takip eder (masaüstü,
    ucuz-GPU). + hover lift/accent-border/shadow, hover'da ince ızgara doku, alt accent çizgi, ikon accent,
    hayalet numara. Mobilde imleç yok → scroll-active kart merkezî ışık + tüm efektler (max-lg). Scroll reveal
    stagger. ⚠️ Önceki bento/kart yedekleri: Services.cards.bak (eski uniform kart). DOĞRULANDI: 3 sütun,
    6 eşit kart 301×368, spotlight katmanı var.
0z. ✅ YAPILDI: SÜREÇ ("Nasıl çalışırım?") yenilendi — eski 4 düz kart yerine ZAMAN ÇİZELGESİ (timeline).
    4 adım (Keşif/Tasarım/Üretim/Teslim), her adımda numaralı yuvarlak işaret + özel ikon (search/design/
    build/deliver) + başlık + açıklama. Masaüstünde işaretleri bağlayan yatay çizgi scroll'da soldan çizilir
    (framer scaleX). Adımlar scroll'da stagger ile belirir. Mobilde dikey yığın. DOĞRULANDI: 4 adım, 01-04
    numaralar, bağlantı çizgisi + 4 ikon.
0aa. ✅ YAPILDI: Hizmet + Portföy kartlarına DAHA BELİRGİN scroll giriş efekti. İkisi de artık
    opacity 0→1 + y 48→0 + scale 0.94→1, kademeli (i%3 stagger), ease [0.16,1,0.3,1]. Portföy: animate→
    whileInView (viewport once, margin -60px) → artık sayfa yüklenirken değil SCROLL'DA belirir; AnimatePresence
    (popLayout) + layout + exit korundu (filtreleme animasyonu çalışır). DOĞRULANDI: 6+10 kart DOM'da,
    konsol temiz. (Görsel reveal hidden preview'da rAF duraklı → doğrulanamaz, kullanıcı foreground'da görecek.)
0bb. ✅ YAPILDI (MOBİL AKICILIK — kök çözüm, tasarım DEĞİŞMEDEN): Kullanıcı "PC mükemmel ama mobilde
    çark dönmesi/inerken takılması/pikselli + renk geçişi akıcı değil; tasarımı değiştirmeden çöz" dedi.
    KÖK SEBEP: iOS/mobil parmakla kaydırırken scroll OLAYI göndermiyor (momentum) ama scrollY doğru →
    olaya bağlı çark/renk zıplıyordu. ÇÖZÜMLER:
    (1) Experience: progress + zemin rengi artık scroll olayından DEĞİL, SÜREKLİ rAF'tan scrollY okunarak
        güncelleniyor (her karede, layout tetiklemez) → renk geçişi ve çark inişi akıcı. setLight sadece değişince.
    (2) BackgroundStage: mobil zaman-tabanlı hareket KALDIRILDI → her cihazda scroll-driven (PC ile aynı iniş),
        artık akıcı çünkü progress sürekli. smooth lerp 0.18 (mobil) kalan titreşimi siler.
    (3) Çark malzemesi mobilde metalness=0 → Environment/PMREM TAMAMEN atlanır (en büyük GPU tasarrufu);
        ışıklar güçlendirildi (env yokken görünür). dpr 0.6→[1,1.5] (PİKSELLİ değil artık). 30fps cap korundu.
    Masaüstü aynen (metalness .2 + env + dpr 1.75). DOĞRULANDI: build OK, tsc/lint 0. (Perf hidden preview'da
    ölçülemez → kullanıcı telefonda test edecek.)
0cc. ✅ WhatsApp linkleri (4 adet): ?text= ile hazır mesaj "Merhaba Abdullah, web sitenizden yazıyorum."
     DOĞRULANDI: 4/4 linkte text var.
1. **Geri bildirim:** Kullanıcı gerçek tarayıcıda görecek. Portföy görselleri hâlâ Unsplash (temsili);
    Aşama 3'te admin/DB'den gerçek işlerle değişecek. NOT: footer "Başa dön" href="#" — istenirse
    Lenis ile pürüzsüz yapılır. Sıradaki: Aşama 3 (Neon+Prisma+NextAuth+Cloudinary+admin) veya deploy.
   Şu an Services paneli TÜM hizmetlerde AYNI dişli grubunu gösteriyor — kullanıcı
   "hepsi aynı olmuş" dedi. İSTENEN:
   (a) Her hizmet için AYRI/DISTINCT görsel-3D (mekanik→dişli, cnc→matkap/tezgah,
       video→kamera, sosyal→ağ/baloncuk, web→kod/pencere gibi ayrı ayrı, yaratıcı).
       NOT: glb ağır+sorunlu, tek-primitive "çok basit" demişti → çok-parçalı ama HAFİF
       prosedürel şekiller veya güzel SVG/canvas kompozisyonları düşün; reliable olsun
       (frameloop=always, inView gating YOK). ServiceGear.tsx buna göre genişletilebilir
       (aktif hizmete göre farklı geometri/kompozisyon).
   (b) Her hizmet değiştikçe HİZMETLER bölümünün ARKA PLANI/RENGİ değişsin (aktif hizmet
       rengine göre tint/glow). Hizmet renkleri: 01 gold #e0a94a, 02 cyan #6fb7d9,
       03 turuncu #d98a5a, 04 mor #b58cd9, 05 teal #5fd9a8 (monokrom üstüne HAFİF vurgu).
   (c) Sağdaki liste satırları/kartlar HOVER efektli olsun (renk, kayma, ikon animasyonu).
   (d) Genel: daha yaratıcı, daha havalı, "belli" (net) olsun.
   İlgili dosyalar: components/experience/Services.tsx, ServiceGear.tsx.
2. **Hizmetler ek:** kenburns hazır (globals.css) — istenirse kullan. Portföy(#portfoy)
   hâlâ foto — istenirse tasarımsal panele çevir.
2. (Gerekirse) Portföy & İletişim & Footer bölümlerini de bu canlı monokrom dile cilala.
3. **Aşama 3 — Altyapı:** Neon (PostgreSQL) + Prisma şeması, NextAuth admin girişi,
   Cloudinary (görsel/video, f_auto/q_auto). Kullanıcıya hesap açtırma ekran-ekran.
4. **Admin panel (CMS):** projeler/blog/hizmetler/hakkımda/iletişim/sosyal linkler CRUD +
   görsel-video yükleme (Cloudinary).
5. **Ön yüzü DB'ye bağla** (içerikler admin'den), iletişim formu → DB + e-posta.
6. **Deploy:** GitHub → Vercel, env değişkenleri, otomatik deploy. Sonra domain (abdullahkirkil.com).
7. Blog sayfasını gerçek içerikle doldur (admin).

---

## 9) NOTLAR / DERSLER / SORUNLAR
- **KRİTİK DERS:** Görsel/video ASLA sunucu diskine (public/uploads) yazma — deploy'da silinir.
  Baştan **Cloudinary** kullan (kalıcı + otomatik optimizasyon).
- **Bu oturumun ORTAM SORUNU:** `mcp__Claude_Browser__computer` (screenshot) bu oturumda SÜREKLİ
  timeout veriyor (WebGL kapalıyken bile — muhtemelen Lenis rAF döngüsü sayfayı boşta bırakmıyor).
  Bu yüzden görsel doğrulama DOM/JS ile (`javascript_tool` ile canvas sayısı, opacity, img.onload)
  yapılıyor; nihai görsel kontrolü KULLANICI kendi tarayıcısında yapıyor. Ekran görüntüsü
  gerekiyorsa: sunucuyu yeniden başlat + dar/tek denemeyle şansını dene, olmazsa DOM'a güven.
- **Preview araçları:** `mcp__Claude_Browser__preview_start` (name:"dev"), `navigate`,
  `javascript_tool`, `read_console_messages`, `preview_logs`. (Eski `mcp__Claude_Preview__*` KALKTI.)
- **R3F dersi:** `frameloop`/`inView` ile Canvas gating SORUN çıkardı (IntersectionObserver
  Lenis+sticky ile true olmuyordu → sahne donuyordu). Çözüm: gating YOK, Canvas hep render.
  Ayrıca `dynamic(()=>Promise.resolve(Comp))` bileşeni yüklemez — doğrudan render et.
- **glb dersi:** Sketchfab modelleri ağır → `@gltf-transform/cli optimize --texture-compress webp`
  ile küçült (17MB→2MB). Ama kullanıcı 3D'yi beğenmedi; şimdilik kullanılmıyor.
- **Görsel kaynak:** loremflickr flaky (bazen 500). Unsplash (`images.unsplash.com/photo-<id>`)
  güvenilir ama içerik ID'den kör seçilince yanlış çıkabiliyor (bir kez CNC'ye araba geldi) —
  mutlaka gözle doğrulat.
- **Kullanıcı tarzı:** Tasarımda çok kez yön değiştirdi (sinematik foto → 3D journey → monokrom
  → sıfırdan scroll → 3D bırak → fotoğraflı). Sabırlı ol, her büyük adımı göster, onay al.
