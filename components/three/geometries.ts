import * as THREE from "three";

// Bu dosya, 3D sahnedeki mekanik parçaların geometrilerini (şekillerini) üretir.
// Hepsi koddan (prosedürel) oluşturulur; ileride kendi .glb modellerinle değiştirebiliriz.

// Dişli
// `light = true` → mobil için sadeleştirilmiş sürüm: silüet birebir aynı,
// sadece yuvarlatma/eğri çözünürlüğü düşürülür (üçgen sayısı ciddi azalır).
export function createGearGeometry(light = false) {
  const teeth = 18;
  const rRoot = 1.35;
  const rTip = 1.72;
  const rHole = 0.55;
  const depth = 0.5;

  const shape = new THREE.Shape();
  const step = (Math.PI * 2) / teeth;

  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const pts: [number, number][] = [
      [Math.cos(a) * rRoot, Math.sin(a) * rRoot],
      [Math.cos(a + step * 0.25) * rTip, Math.sin(a + step * 0.25) * rTip],
      [Math.cos(a + step * 0.5) * rTip, Math.sin(a + step * 0.5) * rTip],
      [Math.cos(a + step * 0.75) * rRoot, Math.sin(a + step * 0.75) * rRoot],
    ];
    pts.forEach(([x, y], idx) => {
      if (i === 0 && idx === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
  }
  shape.closePath();

  const hole = new THREE.Path();
  hole.absarc(0, 0, rHole, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.06,
    bevelSegments: light ? 1 : 3,
    curveSegments: light ? 10 : 32,
  });
  geometry.center();
  return geometry;
}

// Flanş (delikli dairesel bağlantı parçası)
export function createFlangeGeometry() {
  const outerR = 1.5;
  const boreR = 0.55; // orta delik
  const boltR = 0.16; // cıvata delikleri
  const boltCircle = 1.05; // cıvata deliklerinin merkez uzaklığı
  const boltCount = 6;
  const depth = 0.28;

  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);

  const bore = new THREE.Path();
  bore.absarc(0, 0, boreR, 0, Math.PI * 2, true);
  shape.holes.push(bore);

  for (let i = 0; i < boltCount; i++) {
    const a = (i / boltCount) * Math.PI * 2;
    const x = Math.cos(a) * boltCircle;
    const y = Math.sin(a) * boltCircle;
    const h = new THREE.Path();
    h.absarc(x, y, boltR, 0, Math.PI * 2, true);
    shape.holes.push(h);
  }

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 2,
    curveSegments: 48,
  });
  geometry.center();
  return geometry;
}

// Altıgen somun
export function createHexNutGeometry() {
  const R = 0.9;
  const boreR = 0.42;
  const depth = 0.5;

  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const x = Math.cos(a) * R;
    const y = Math.sin(a) * R;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const bore = new THREE.Path();
  bore.absarc(0, 0, boreR, 0, Math.PI * 2, true);
  shape.holes.push(bore);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 2,
    curveSegments: 16,
  });
  geometry.center();
  return geometry;
}
