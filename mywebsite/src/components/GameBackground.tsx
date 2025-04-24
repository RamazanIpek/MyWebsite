// src/components/GameBackground.tsx
"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

/* -------- Temalar (literal-readonly) -------- */
const themes = {
  purple: ["#9c27b0", "#7b1fa2", "#6a1b9a", "#4a148c"],
  blue:   ["#2196f3", "#1976d2", "#1565c0", "#0d47a1"],
  orange: ["#ff9800", "#f57c00", "#ef6c00", "#e65100"],
  red:    ["#f44336", "#e53935", "#d32f2f", "#b71c1c"],
} as const;

type ThemeKey = keyof typeof themes;

/* -------- Parçacık tipi -------- */
interface Particle {
  position: [number, number, number];
  scale: number;
  speed: number;
  color: string;
  rotationSpeed: number;
}

/* -------- Particles -------- */
function Particles({ count = 100, color = "purple" as ThemeKey }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);

  // Sadece bir kez üretilsin
  const particles = useMemo<Particle[]>(() => {
    const col = themes[color];
    const arr: Particle[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        position: [Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 15],
        scale: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.2 + 0.1,
        color: col[Math.floor(Math.random() * col.length)],
        rotationSpeed: Math.random() * 0.01,
      });
    }
    return arr;
  }, [count, color]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      dummy.position.set(
        p.position[0],
        p.position[1] + Math.sin(t * p.speed) * 0.5,
        p.position[2]
      );
      dummy.rotation.set(t * p.rotationSpeed, t * p.rotationSpeed * 0.8, 0);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={themes[color][0]} />
    </instancedMesh>
  );
}

/* -------- Dalga efekti -------- */
function WaveEffect({ color = "purple" as ThemeKey }) {
  const mesh = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>>(null!);

  useFrame(({ clock }) => {
    const pos = mesh.current.geometry.attributes.position;
    const t = clock.getElapsedTime();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, 0.5 * Math.sin(x * 0.5 + t) + 0.5 * Math.sin(y * 0.5 + t));
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[30, 30, 32, 32]} />
      <meshStandardMaterial
        color={themes[color][0]}
        wireframe
        opacity={0.3}
        transparent
      />
    </mesh>
  );
}

/* -------- Işık efekti -------- */
function LightEffect({ color = "purple" as ThemeKey }) {
  const light = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    light.current.intensity = 1 + Math.sin(t) * 0.5;
    light.current.position.set(Math.sin(t * 0.5) * 10, 8, Math.cos(t * 0.5) * 10);
  });

  return (
    <pointLight
      ref={light}
      position={[0, 8, 0]}
      color={themes[color][0]}
      intensity={1.5}
    />
  );
}

/* -------- Ana bileşen -------- */
interface GameBackgroundProps {
  color?: ThemeKey;
}

export default function GameBackground({
  color = "purple",
}: GameBackgroundProps) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <LightEffect color={color} />
        <Particles count={50} color={color} />
        <WaveEffect color={color} />
        <fog attach="fog" args={[themes[color][3], 5, 30]} />
        <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={60} />
      </Canvas>
    </div>
  );
}
