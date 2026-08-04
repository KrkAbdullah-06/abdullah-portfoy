"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  createGearGeometry,
  createFlangeGeometry,
  createHexNutGeometry,
} from "./geometries";

// Çelik görünümlü metalik malzeme (dişli + flanş)
const steel = { color: "#cbd2dc", metalness: 0.9, roughness: 0.3 };
// İkinci çelik tonu (somun) — monokrom için hafif farklı gri
const brass = { color: "#aab0ba", metalness: 0.95, roughness: 0.28 };

export function MechParts() {
  const rootRef = useRef<THREE.Group>(null);
  const gearRef = useRef<THREE.Mesh>(null);
  const flangeRef = useRef<THREE.Group>(null);
  const nutRef = useRef<THREE.Mesh>(null);

  const gearGeo = useMemo(() => createGearGeometry(), []);
  const flangeGeo = useMemo(() => createFlangeGeometry(), []);
  const nutGeo = useMemo(() => createHexNutGeometry(), []);

  useFrame((state, delta) => {
    // Her parça kendi hızında döner (mekanik his). Kullanıcı fareyle sahneyi çevirebilir.
    if (gearRef.current) gearRef.current.rotation.z += delta * 0.3;
    if (flangeRef.current) flangeRef.current.rotation.z -= delta * 0.15;
    if (nutRef.current) {
      nutRef.current.rotation.y += delta * 0.4;
      nutRef.current.rotation.x += delta * 0.12;
    }
    // Parça grubu çok hafif salınır (canlı görünsün)
    if (rootRef.current) {
      rootRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
    }
  });

  return (
    <group ref={rootRef} rotation={[-0.45, 0, 0]}>
      {/* Dişli — merkez */}
      <mesh ref={gearRef} geometry={gearGeo} scale={0.92}>
        <meshStandardMaterial {...steel} />
      </mesh>

      {/* Flanş — arka sol */}
      <group
        ref={flangeRef}
        position={[-2.3, 0.9, -1.3]}
        rotation={[0.4, 0.3, 0]}
        scale={0.72}
      >
        <mesh geometry={flangeGeo}>
          <meshStandardMaterial {...steel} roughness={0.36} />
        </mesh>
      </group>

      {/* Somun — ön sağ (pirinç/amber) */}
      <mesh ref={nutRef} geometry={nutGeo} position={[2.4, -1.1, 0.6]} scale={0.62}>
        <meshStandardMaterial {...brass} />
      </mesh>
    </group>
  );
}
