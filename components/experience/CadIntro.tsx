"use client";

import { useEffect, useRef, useState } from "react";

// ————————————————————————————————————————————————————————————————
// SİNEMATİK AÇILIŞ — "SolidWorks'te çark modelleme" (scroll ile adım adım)
// GERÇEK SolidWorks referans ekran görüntülerine göre tasarlandı:
//   1) Düzlem seçimi (Üst Düzlem + mavi çizim sınırı dikdörtgeni)
//   2) Orijin / merkez nokta
//   3) Daire çizilir (mavi = tanımsız)
//   4) Akıllı Ölçü aracı AKTİF (yarıçap ölçülürken — kalem+daire ikonu)
//   5) Ölçü tamamlanır → Ø 60.00, tam tanımlı (siyah)
//   6) Yardımcı kesikli çember (diş tepe dairesi)
//   7) TEK DİŞ kesilir (Kesme-Ekstrüzyon)
//   8) DAİRESEL ÖRÜNTÜ — o tek diş 14 kopyaya çoğaltılır (gerçek mühendislik
//      yöntemi: tek diş + pattern, tüm dişleri tek tek çizmek değil)
//   9) Boss-Ekstrüzyon ÖNİZLEMESİ — sarı/haki yarı saydam, sürükleme tutamacı
//      (dikey ok) + çapraz lider çizgili "Ø60.00" etiketi (referans fotoğraf 4)
//  10) Parça 3B'ye yatar, GERÇEK KALINLIKLI metalik katıya dönüşür
//  11) Döner → kararır → arkadaki GERÇEK 3D çarka devredilir
// Her adım scroll'a bağlı; tamamen SVG/CSS (3B için CSS perspective) → mobilde
// akıcı (30fps mobil sınırı + filtre atlama + katman azaltma korunuyor).
// ————————————————————————————————————————————————————————————————

function gearPath(cx: number, cy: number, ro: number, rr: number, teeth: number) {
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  const tw = step * 0.3;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const a0 = a - tw;
    const a1 = a - tw * 0.55;
    const a2 = a + tw * 0.55;
    const a3 = a + tw;
    pts.push(`${(cx + rr * Math.cos(a0)).toFixed(2)},${(cy + rr * Math.sin(a0)).toFixed(2)}`);
    pts.push(`${(cx + ro * Math.cos(a1)).toFixed(2)},${(cy + ro * Math.sin(a1)).toFixed(2)}`);
    pts.push(`${(cx + ro * Math.cos(a2)).toFixed(2)},${(cy + ro * Math.sin(a2)).toFixed(2)}`);
    pts.push(`${(cx + rr * Math.cos(a3)).toFixed(2)},${(cy + rr * Math.sin(a3)).toFixed(2)}`);
  }
  return "M" + pts.join(" L") + " Z";
}

function circlePath(cx: number, cy: number, r: number) {
  return `M${cx - r},${cy} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 Z`;
}

const TEETH_COUNT = 14;
const GEAR = gearPath(50, 50, 31, 25.5, TEETH_COUNT);
const BORE = circlePath(50, 50, 6.5);
const BOLTS = Array.from({ length: 5 }, (_, i) => {
  const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
  return circlePath(50 + 15.5 * Math.cos(a), 50 + 15.5 * Math.sin(a), 3.4);
}).join(" ");
const GEAR_FILL = `${GEAR} ${BORE} ${BOLTS}`;
const SKETCH_PTS = [
  [50, 23],
  [50, 77],
  [23, 50],
  [77, 50],
];
// Diş profili tek parça bir path (gearPath, açısal sırayla). Bir dişin
// path-uzunluğu içindeki payı ~1/TEETH_COUNT → "tek diş kes + pattern" hissi
// bu oranı iki aşamalı ortaya çıkararak (kes → duraksa → tamamla) verilir.
const ONE_TOOTH = 1 / TEETH_COUNT;

const seg = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));

function mix(aHex: string, bHex: string, t: number) {
  const pa = [parseInt(aHex.slice(1, 3), 16), parseInt(aHex.slice(3, 5), 16), parseInt(aHex.slice(5, 7), 16)];
  const pb = [parseInt(bHex.slice(1, 3), 16), parseInt(bHex.slice(3, 5), 16), parseInt(bHex.slice(5, 7), 16)];
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

// Ekstrüzyon gövdesi: N katman, arkaya (aşağı) gittikçe koyulaşan yan duvarlar.
// MOBİL PERFORMANS: her katman her karede bir "transform" yazması gerektiriyor
// (14 tanesi masaüstünde ucuz, mobilde pahalı) → mobilde katman sayısı azaltılır.
function makeBodyFill(layers: number) {
  return Array.from({ length: layers }, (_, j) => mix("#26282c", "#6b7079", j / (layers - 1)));
}
const BODY_LAYERS_DESKTOP = 14;
const BODY_LAYERS_MOBILE = 6;
const BODY_MAX_DEPTH = 9; // viewBox birimi
const BODY_FILL_DESKTOP = makeBodyFill(BODY_LAYERS_DESKTOP);
const BODY_FILL_MOBILE = makeBodyFill(BODY_LAYERS_MOBILE);

export function CadIntro() {
  // MOBİL AKICILIK: masaüstü davranışı (60fps, tam efektler) AYNEN korunur.
  // Mobilde: (1) kare hızı ~30fps'e sabitlenir, (2) pahalı `filter: drop-shadow`
  // atlanır, (3) katman sayısı azalır, (4) atlanan karelerin arasını CSS
  // transition doldurur (göz akıcı görür, JS daha az iş yapar).
  const [mobile, setMobile] = useState(false);
  const wrapRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rootBgRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const gearWrapRef = useRef<HTMLDivElement>(null);
  const gearGroupRef = useRef<SVGGElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const sheenRef = useRef<SVGPathElement>(null);
  const previewRef = useRef<SVGPathElement>(null);
  const dragHandleRef = useRef<SVGGElement>(null);
  const diamCalloutRef = useRef<SVGGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const constructionRef = useRef<SVGCircleElement>(null);
  const outlineRef = useRef<SVGPathElement>(null);
  const ptsRef = useRef<SVGGElement>(null);
  const centerPtRef = useRef<SVGGElement>(null);
  const dimRef = useRef<SVGGElement>(null);
  const radiusToolRef = useRef<SVGGElement>(null);
  const planeRectRef = useRef<SVGGElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const treePlaneRef = useRef<HTMLLIElement>(null);
  const treeSketchRef = useRef<HTMLLIElement>(null);
  const treeExtrudeRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    // Sayfa hep en baştan başlasın (tarayıcı scroll'u geri yüklemesin). Tek
    // seferlik — mobil algılaması sonradan değişse bile TEKRAR ÇALIŞMAZ.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let raf = 0;
    let top = 0;
    let len = 1;
    const measure = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      top = r.top + window.scrollY;
      len = Math.max(1, el.offsetHeight - window.innerHeight);
    };

    let last = -1;
    let lastWrite = 0;
    let lastSkColor = "";
    let lastBgColor = "";
    const frame = (t: number) => {
      const p = Math.min(1, Math.max(0, (window.scrollY - top) / len));
      // MOBİL: pahalı yazma bloğu ~20fps'e sınırlanır. scrollY her rAF'ta
      // okunuyor (gecikme yok), sadece DOM yazmaları seyrekleştiriliyor.
      const throttled = mobile && t - lastWrite < 50;
      if (p !== last && !throttled) {
        last = p;
        lastWrite = t;

        // ————— 1) Düzlem seçimi —————
        const plane = seg(p, 0.04, 0.08);
        const planeOut = seg(p, 0.09, 0.12);
        // ————— 2) Orijin / merkez nokta —————
        const center = seg(p, 0.12, 0.15);
        // ————— 3) Daire çizilir (mavi, tanımsız) —————
        const draw = seg(p, 0.15, 0.23);
        // ————— 4) Akıllı Ölçü aracı AKTİF (yarıçap ölçülüyor) —————
        const radiusTool = seg(p, 0.24, 0.28);
        const radiusToolOut = seg(p, 0.3, 0.33);
        // ————— 5) Ø 60.00 tam tanımlı (mavi→siyah) —————
        const dimIn = seg(p, 0.29, 0.34);
        const defined = seg(p, 0.32, 0.38);
        const dimOut = seg(p, 0.56, 0.6);
        // ————— 6) Yardımcı kesikli çember —————
        const constr = seg(p, 0.4, 0.45);
        // ————— 7-8) Tek diş kes → duraksa → Dairesel Örüntü tamamla —————
        const toothCut = seg(p, 0.47, 0.51);
        const patternRest = seg(p, 0.54, 0.64);
        const teethReveal = toothCut < 1 ? toothCut * ONE_TOOTH : ONE_TOOTH + patternRest * (1 - ONE_TOOTH);
        // ————— 9) Boss-Ekstrüzyon önizleme (sarı/haki) + sürükleme tutamacı —————
        // ÖNEMLİ: eğim (tilt) ÖNİZLEME İLE AYNI ANDA başlar — referans fotoğraftaki
        // gibi, çizim daireyken hemen "yan/elips" şekle döner, önizleme onun
        // ÜSTÜNDE yükselir. Mavi taban çizimi (referans fotoda olduğu gibi)
        // katılaşana kadar TABANDA görünür kalır (erken solmaz).
        const preview = seg(p, 0.66, 0.71);
        const previewFadeOut = seg(p, 0.84, 0.9);
        const previewOp = preview * (1 - previewFadeOut);
        // ————— 10) Eğim (yan/elips görünüm) + katılaşma —————
        const tilt = seg(p, 0.66, 0.84) * 50;
        const face = seg(p, 0.86, 0.92);
        const body = seg(p, 0.88, 0.96);
        // ————— 11) Kararma + devir —————
        const dark = seg(p, 0.94, 1);
        const chromeFade = seg(p, 0.82, 0.97);
        const handoff = seg(p, 0.96, 1);

        const skColor = mix("#1c6fd6", "#141414", defined);
        // Mavi taban çizimi referans fotoğraftaki gibi eğim+önizleme boyunca
        // görünür kalır, yalnızca tam katılaşınca (steel) solar.
        const sketchFade = 1 - seg(p, 0.9, 0.96);

        // düzlem (Üst Düzlem çizim sınırı dikdörtgeni)
        if (planeRectRef.current) planeRectRef.current.style.opacity = String(Math.min(1, plane * 3) * (1 - planeOut));
        if (treePlaneRef.current) treePlaneRef.current.style.background = p > 0.03 && p < 0.12 ? "#cfe3f7" : "transparent";

        // merkez / çizim noktaları / daire
        if (centerPtRef.current) centerPtRef.current.style.opacity = String(Math.min(1, center * 3) * sketchFade);
        if (ptsRef.current) ptsRef.current.style.opacity = String(Math.min(1, draw * 2) * sketchFade);
        // MOBİL PERFORMANS: `stroke`/`backgroundColor` değişimi REPAINT tetikler
        // (opacity/transform gibi sadece compositor değil) → değer GERÇEKTEN
        // değişmediyse tekrar yazılmaz (aynı karede iki path aynı rengi paylaşıyor,
        // gereksiz ikinci boyama önlenir).
        const skColorChanged = skColor !== lastSkColor;
        if (skColorChanged) lastSkColor = skColor;
        if (circleRef.current) {
          circleRef.current.style.strokeDashoffset = String(1 - draw);
          if (skColorChanged) circleRef.current.style.stroke = skColor;
          circleRef.current.style.opacity = String(sketchFade);
        }

        // yarıçap ölçü aracı aktif (kalem+daire ikonu, R etiketi)
        if (radiusToolRef.current) radiusToolRef.current.style.opacity = String(Math.min(1, radiusTool * 3) * (1 - radiusToolOut));

        // Ø 60.00 tam tanımlı ölçü
        if (dimRef.current) dimRef.current.style.opacity = String(Math.min(1, dimIn * 3) * (1 - dimOut));

        // yardımcı çember (kesikli)
        if (constructionRef.current) constructionRef.current.style.opacity = String(constr * sketchFade * 0.9);

        // diş profili: tek diş kes → duraksa → dairesel örüntüyle tamamlanır
        if (outlineRef.current) {
          outlineRef.current.style.strokeDashoffset = String(1 - teethReveal);
          if (skColorChanged) outlineRef.current.style.stroke = skColor;
          outlineRef.current.style.opacity = String(Math.min(1, teethReveal * 40) * sketchFade);
        }

        // çizimde "oynama": çark hafifçe büyüyüp yerine oturur
        const sketchScale = 0.82 + 0.18 * seg(p, 0.15, 0.62);
        const settleRot = -8 * (1 - seg(p, 0.2, 0.66));
        if (gearGroupRef.current) {
          gearGroupRef.current.setAttribute("transform", `translate(50 50) rotate(${settleRot.toFixed(2)}) scale(${sketchScale.toFixed(3)}) translate(-50 -50)`);
        }

        // Boss-Ekstrüzyon önizleme (sarı/haki) + dikey sürükleme tutamacı + Ø60.00 lider etiketi
        if (previewRef.current) previewRef.current.style.opacity = String(previewOp * 0.94);
        if (dragHandleRef.current) dragHandleRef.current.style.opacity = String(previewOp);
        if (diamCalloutRef.current) diamCalloutRef.current.style.opacity = String(previewOp);

        // parça açıyla yatar (gerçek perspektif) + gölge
        // MOBİL: `filter: drop-shadow` per-kare hesaplaması pahalı (blur
        // konvolüsyonu) → mobilde tamamen atlanır, masaüstünde AYNEN kalır.
        if (gearWrapRef.current) {
          gearWrapRef.current.style.transform = `perspective(820px) rotateX(${tilt.toFixed(2)}deg)`;
          if (!mobile) {
            gearWrapRef.current.style.filter = body > 0 ? `drop-shadow(0 ${(body * 10).toFixed(1)}px ${(body * 11).toFixed(1)}px rgba(0,0,0,${(0.32 * body).toFixed(2)}))` : "none";
          }
        }

        // GERÇEK KALINLIK: katmanlar arkaya doğru istiflenir, kalınlık büyür
        if (bodyRef.current) {
          bodyRef.current.style.opacity = String(body);
          const depth = body * BODY_MAX_DEPTH;
          const kids = bodyRef.current.children;
          for (let j = 0; j < kids.length; j++) {
            const off = ((kids.length - j) / kids.length) * depth;
            (kids[j] as SVGPathElement).setAttribute("transform", `translate(0 ${off.toFixed(2)})`);
          }
        }
        if (fillRef.current) fillRef.current.style.opacity = String(face);
        if (sheenRef.current) sheenRef.current.style.opacity = String(seg(p, 0.85, 0.94) * 0.6);

        // kararma + arayüz + devir
        if (rootBgRef.current) {
          const bg = mix("#e9ecf0", "#08090a", dark);
          if (bg !== lastBgColor) {
            rootBgRef.current.style.backgroundColor = bg;
            lastBgColor = bg;
          }
        }
        if (chromeRef.current) chromeRef.current.style.opacity = String(1 - chromeFade);
        if (gridRef.current) gridRef.current.style.opacity = String((1 - chromeFade) * 0.6);
        if (hintRef.current) hintRef.current.style.opacity = String((1 - seg(p, 0.08, 0.2)) * (1 - dark));
        if (stageRef.current) stageRef.current.style.opacity = String(1 - handoff);

        // özellik ağacı + durum çubuğu
        const sketchOn = p > 0.12 && p < 0.66;
        const extrudeOn = p >= 0.66 && p < 0.97;
        if (treeSketchRef.current) treeSketchRef.current.style.background = sketchOn ? "#cfe3f7" : "transparent";
        if (treeExtrudeRef.current) treeExtrudeRef.current.style.background = extrudeOn ? "#cfe3f7" : "transparent";
        if (statusRef.current) {
          const s =
            p < 0.09 ? "Üst Düzlem seçildi → Yeni Çizim"
            : p < 0.15 ? "Nokta · orijinde merkez"
            : p < 0.24 ? "Daire çiziliyor  ▸  Tanımsız (mavi)"
            : p < 0.29 ? "Akıllı Ölçü  ▸  Yarıçap ölçülüyor…"
            : p < 0.4 ? "Akıllı Ölçü  ▸  Ø 60.00  ▸  Tam Tanımlı"
            : p < 0.47 ? "Yardımcı çember (diş üstü)"
            : p < 0.53 ? "Kesme-Ekstrüzyon  ▸  1 diş"
            : p < 0.66 ? "Dairesel Örüntü  ▸  14 kopya  ▸  Eşit Aralıklı"
            : p < 0.84 ? "Boss-Ekstrüzyon  ▸  Önizleme  ▸  Kör  ▸  12.00 mm"
            : p < 0.96 ? "Katılaştırılıyor…"
            : "Katı Gövde  ▸  Çelik 1.0037  ▸  Tam Tanımlı";
          if (statusRef.current.textContent !== s) statusRef.current.textContent = s;
        }
      }
      raf = requestAnimationFrame(frame);
    };

    measure();
    raf = requestAnimationFrame(frame);
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mobile]);

  return (
    // dvh: mobil adres çubuğu açılıp kapanınca `vh` ile window.innerHeight arasında
    // fark oluşup scroll ölçümünü bozuyordu ("adımlar sıçrıyor" hissi) → dvh her
    // zaman gerçek görünür yüksekliği takip eder, masaüstünde vh ile aynı davranır.
    // 460dvh: daha çok adım için ekstra nefes alma payı.
    <section id="intro" ref={wrapRef} className="relative h-[460dvh]">
      {/* NOT: mobilde eskiden burada TÜM alt elemanlara CSS transition uygulayan
          bir "yumuşatma" hilesi vardı ([&_*]:transition-*). Bu, JS'in her karede
          yazdığı renk/opaklık değerlerinin ÜSTÜNE tarayıcının kendi geçiş
          animasyonunu bindiriyordu → iki animasyon sistemi aynı özellikleri aynı
          anda "boyamaya" çalışınca performans DAHA KÖTÜ oldu (beklenenin tersi).
          Kaldırıldı — 20fps'e düşürülen JS yazımı zaten yeterince akıcı. */}
      <div ref={stageRef} className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden">
        {/* zemin: açık SW ekranı → koyu */}
        <div ref={rootBgRef} className="absolute inset-0 -z-10" style={{ backgroundColor: "#e9ecf0" }} />

        {/* ——— SolidWorks arayüzü (kararınca kaybolur) ——— */}
        <div ref={chromeRef} className="absolute inset-0">
          <div className="absolute inset-x-0 top-0 flex h-9 items-center gap-4 border-b border-black/10 bg-white/85 px-3 text-[11px] text-neutral-600">
            <span className="flex items-center gap-1.5">
              <span className="grid h-[18px] w-[18px] place-items-center rounded-[3px] bg-[#e01e2b] text-[8px] font-bold leading-none text-white">3DS</span>
              <span className="font-semibold tracking-wide text-neutral-700">SOLIDWORKS</span>
            </span>
            {/* MOBİL PERFORMANS: bu metin yığını, sürekli yeniden boyanan arka
                planın (rootBgRef) üstünde oturuyor — mobilde göstermek ciddi
                takılmaya yol açtı (her boya karesi bu metinleri de yeniden
                çizmek zorunda kalıyordu). Masaüstünde AYNEN kalır. */}
            <span className="hidden gap-3 text-neutral-500 sm:flex">
              {["Dosya", "Düzenle", "Görünüm", "Ekle", "Araçlar", "Pencere"].map((x) => (
                <span key={x}>{x}</span>
              ))}
            </span>
            <span className="ml-auto font-mono text-neutral-400">Parça1 *</span>
          </div>

          <div className="absolute inset-x-0 top-9 hidden h-7 items-center gap-3 border-b border-black/10 bg-white/60 px-3 font-mono text-[10px] text-neutral-500 sm:flex">
            {["Unsurlar", "Çizim", "İşaretleme", "Hesapla", "SOLIDWORKS Eklentileri"].map((x, i) => (
              <span key={x} className={i === 1 ? "rounded bg-[#dbeafe] px-1.5 py-0.5 text-neutral-700" : ""}>{x}</span>
            ))}
          </div>

          <div className="absolute left-0 top-9 hidden h-[calc(100%-2.25rem)] w-56 border-r border-black/10 bg-white/60 p-3 pt-9 text-[11.5px] leading-relaxed text-neutral-700 sm:block">
            <div className="mb-2 font-semibold text-neutral-800">▾ Parça1 (Varsayılan)</div>
            <ul className="space-y-1 pl-1">
              <li className="text-neutral-500">▾ Katı Gövdeler(1)</li>
              <li className="pl-3 text-neutral-400">≡ Malzeme &lt;1.0037&gt;</li>
              <li className="pl-3">◱ Ön Düzlem</li>
              <li ref={treePlaneRef} className="rounded pl-3 transition-colors">◱ Üst Düzlem</li>
              <li className="pl-3">◱ Sağ Düzlem</li>
              <li className="pl-3">↳ Orijin</li>
              <li ref={treeSketchRef} className="mt-1 rounded px-1 transition-colors">✎ Çizim1</li>
              <li ref={treeExtrudeRef} className="rounded px-1 transition-colors">⬒ Boss-Ekstrüzyon1</li>
            </ul>
          </div>

          <div
            ref={gridRef}
            className="pointer-events-none absolute inset-0 opacity-[0.6] [background-image:linear-gradient(#94a3b833_1px,transparent_1px),linear-gradient(90deg,#94a3b833_1px,transparent_1px)] [background-size:28px_28px]"
          />

          <svg viewBox="0 0 40 40" className="absolute bottom-16 left-5 h-12 w-12 opacity-80">
            <line x1="8" y1="32" x2="8" y2="12" stroke="#37a24a" strokeWidth="1.4" />
            <line x1="8" y1="32" x2="28" y2="32" stroke="#d23b3b" strokeWidth="1.4" />
            <line x1="8" y1="32" x2="20" y2="22" stroke="#2f6fd0" strokeWidth="1.4" />
            <text x="7" y="9" fontSize="6" fill="#37a24a">Y</text>
            <text x="30" y="34" fontSize="6" fill="#d23b3b">X</text>
            <text x="21" y="20" fontSize="6" fill="#2f6fd0">Z</text>
          </svg>

          <div className="absolute inset-x-0 bottom-0 flex h-7 items-center gap-4 border-t border-black/10 bg-white/85 px-3 font-mono text-[10px] text-neutral-500">
            <span ref={statusRef}>Üst Düzlem seçildi → Yeni Çizim</span>
            <span className="ml-auto hidden sm:block">Düzenleniyor · MMGS · Ton</span>
          </div>
        </div>

        {/* ——— SVG sahne: çizim + çark. 3B eğim wrapper'a uygulanır ——— */}
        <div ref={gearWrapRef} className="relative z-10 h-[62vmin] max-h-[520px] w-[62vmin] max-w-[520px]" style={{ transformOrigin: "50% 50%", transform: "perspective(820px) rotateX(0deg)" }}>
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <defs>
              <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f0f2f6" />
                <stop offset="36%" stopColor="#b6bcc4" />
                <stop offset="60%" stopColor="#d6dae0" />
                <stop offset="100%" stopColor="#7e838b" />
              </linearGradient>
              <radialGradient id="sheen" cx="0.36" cy="0.3" r="0.75">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="45%" stopColor="#ffffff" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* 1) düzlem — Üst Düzlem çizim sınırı (referans foto 1: mavi dikdörtgen) */}
            <g ref={planeRectRef} opacity="0" stroke="#5b8fd6" strokeWidth="0.35" fill="none">
              <rect x="14" y="14" width="72" height="72" />
              <circle cx="14" cy="14" r="0.9" fill="#5b8fd6" stroke="none" />
              <circle cx="86" cy="14" r="0.9" fill="#5b8fd6" stroke="none" />
              <circle cx="14" cy="86" r="0.9" fill="#5b8fd6" stroke="none" />
              <circle cx="86" cy="86" r="0.9" fill="#5b8fd6" stroke="none" />
              <text x="16" y="12" fontSize="3.6" fill="#5b8fd6" stroke="none" fontFamily="monospace">Üst Düzlem</text>
            </g>

            {/* 4) Akıllı Ölçü aracı AKTİF — yarıçap ölçülürken (referans foto 2) */}
            <g ref={radiusToolRef} opacity="0" stroke="#4c5158" strokeWidth="0.3" fill="#4c5158">
              <line x1="50" y1="50" x2="70.6" y2="67.4" strokeDasharray="1.4 1.1" />
              <circle cx="75" cy="71" r="2.6" fill="none" stroke="#4c5158" strokeWidth="0.35" />
              <line x1="73.4" y1="71" x2="76.6" y2="71" strokeWidth="0.35" />
              <text x="79.5" y="72.3" fontSize="3.6" fill="#141414" stroke="none" fontFamily="monospace">R 25.22</text>
            </g>

            {/* 5) akıllı ölçülendirme (Ø 60.00, tam tanımlı) */}
            <g ref={dimRef} opacity="0" stroke="#4c5158" strokeWidth="0.32" fill="#4c5158">
              <line x1="23" y1="50" x2="17" y2="50" />
              <line x1="77" y1="50" x2="83" y2="50" />
              <line x1="23" y1="50" x2="77" y2="50" />
              <path d="M23,50 l3,-1.5 l0,3 Z" />
              <path d="M77,50 l-3,-1.5 l0,3 Z" />
              <rect x="41.5" y="44.4" width="17" height="6" rx="0.7" fill="#ffffff" stroke="none" />
              <text x="50" y="49" fontSize="4.2" textAnchor="middle" fill="#141414" stroke="none" fontFamily="monospace">Ø 60.00</text>
            </g>

            {/* 9) Boss-Ekstrüzyon önizleme: çapraz lider + "∅60.00" (referans foto 4) */}
            <g ref={diamCalloutRef} opacity="0" stroke="#222528" strokeWidth="0.32" fill="#141414">
              <line x1="73" y1="37" x2="91" y2="21" />
              <circle cx="73" cy="37" r="0.8" stroke="none" />
              <text x="92.5" y="20.5" fontSize="4" stroke="none" fontFamily="monospace">∅60.00</text>
            </g>

            {/* 9) sürükleme tutamacı — dikey eksen + iki ucunda ok (referans foto 4) */}
            <g ref={dragHandleRef} opacity="0" stroke="#6b7079" strokeWidth="0.4" fill="#6b7079">
              <line x1="50" y1="20" x2="50" y2="80" />
              <path d="M50,19 l-1.3,2.6 l2.6,0 Z" />
              <path d="M50,81 l-1.3,-2.6 l2.6,0 Z" />
            </g>

            {/* çark grubu (büyür, oturur) */}
            <g ref={gearGroupRef} transform="translate(50 50) rotate(0) scale(0.82) translate(-50 -50)">
              {/* GERÇEK KALINLIK — katmanlı ekstrüzyon gövdesi (arkaya koyulaşır) */}
              <g ref={bodyRef} opacity="0">
                {(mobile ? BODY_FILL_MOBILE : BODY_FILL_DESKTOP).map((c, j) => (
                  <path key={j} d={GEAR_FILL} fillRule="evenodd" fill={c} transform="translate(0 0)" />
                ))}
              </g>
              {/* katı ön yüz (metalik) */}
              <path ref={fillRef} d={GEAR_FILL} fillRule="evenodd" fill="url(#steel)" stroke="#5f646b" strokeWidth="0.3" opacity="0" />
              {/* metalik parlaklık (sheen) */}
              <path ref={sheenRef} d={GEAR} fill="url(#sheen)" opacity="0" style={{ mixBlendMode: "screen" }} />
              {/* Boss-Ekstrüzyon önizlemesi — sarı/haki yarı saydam (referans foto 4) */}
              <path ref={previewRef} d={GEAR_FILL} fillRule="evenodd" fill="#ddc637" stroke="#8f7420" strokeWidth="0.5" opacity="0" />
              {/* yardımcı çember (kesikli) */}
              <circle ref={constructionRef} cx="50" cy="50" r="31" fill="none" stroke="#7f97b3" strokeWidth="0.4" strokeDasharray="1.6 1.3" opacity="0" />
              {/* taban dairesi */}
              <circle ref={circleRef} cx="50" cy="50" r="27" fill="none" stroke="#1c6fd6" strokeWidth="0.7" pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
              {/* diş profili — tek diş kesilir, sonra dairesel örüntüyle tamamlanır */}
              <path ref={outlineRef} d={GEAR} fill="none" stroke="#1c6fd6" strokeWidth="0.7" pathLength={1} strokeDasharray={1} strokeDashoffset={1} opacity={0} />
              {/* çizim noktaları */}
              <g ref={ptsRef} opacity="0" fill="#141414">
                {SKETCH_PTS.map(([x, y]) => (
                  <rect key={`${x}-${y}`} x={x - 0.7} y={y - 0.7} width={1.4} height={1.4} />
                ))}
              </g>
              {/* merkez / orijin */}
              <g ref={centerPtRef} opacity="0">
                <line x1="46" y1="50" x2="54" y2="50" stroke="#d23b3b" strokeWidth="0.5" />
                <line x1="50" y1="46" x2="50" y2="54" stroke="#37a24a" strokeWidth="0.5" />
              </g>
            </g>
          </svg>
        </div>

        {/* Giriş rozeti — KIRMIZI + yanıp sönen, ilk anda dikkat çeksin. "Siteyi
            açmak için kaydır" net bir eylem çağrısı: ne olduğunu bilmeseler de
            NE YAPMALARI gerektiğini anında anlarlar. */}
        <div ref={hintRef} className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-pulse">
          <div className="flex items-center gap-2.5 rounded-full border border-white/20 bg-[#e01e2b] px-6 py-3 shadow-[0_20px_50px_-12px_rgba(224,30,43,0.7)]">
            <span className="text-sm font-bold tracking-wide text-white">Siteyi açmak için kaydır</span>
            <span className="text-base text-white" aria-hidden>↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}
