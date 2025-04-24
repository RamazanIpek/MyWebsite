/* ─────────────────────────────────────────────────────────── */
/*  src/components/AnimatedBackground.tsx                     */
/* ─────────────────────────────────────────────────────────── */
/* eslint-disable react/no-unknown-property */
"use client";

import React, {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Sparkles,
  useGLTF,
  Environment,
  Instances,
  Instance,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  GodRays,
  ChromaticAberration,
} from "@react-three/postprocessing";
import * as THREE from "three";
import {
  ShaderMaterial,
  Color,
  Group,
  Mesh,
  Vector3 as ThreeVector3,
  MathUtils,
} from "three";
import { KernelSize } from "postprocessing";
import { motion } from "framer-motion";

/* ----------------------------------------------------------------- */
/* Props                                                             */
/* ----------------------------------------------------------------- */
interface AnimatedBackgroundProps {
  isActive: boolean;            // Yalnızca Home bölümünde true olacak
}

/* ----------------------------------------------------------------- */
/* Shaders                                                           */
/* ----------------------------------------------------------------- */
const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform vec3  uColor;
  uniform float uPower;
  uniform float uIntensity;

  void main() {
    vec3  viewDir = normalize(-vPosition);
    float fresnel = 1.0 - dot(normalize(vNormal), viewDir);
          fresnel = pow(fresnel, uPower);
    gl_FragColor  = vec4(uColor * fresnel * uIntensity, fresnel * 0.8);
  }
`;

/* ----------------------------------------------------------------- */
/* Star (Güneş)                                                      */
/* ----------------------------------------------------------------- */
const Star = forwardRef<Mesh>((_, ref) => {
  const internalRef = useRef<THREE.Mesh>(null!);
  React.useImperativeHandle(ref, () => internalRef.current);

  useFrame(({ clock }) => {
    const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
    internalRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={internalRef}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial
        color="#ffa500"
        emissive="#ff8c00"
        emissiveIntensity={4}
        toneMapped={false}
      />
      <pointLight distance={150} intensity={6} color="#ffccaa" decay={1.5} />
      <Sparkles count={50} scale={5} size={6} speed={0.4} color="#ffd700" opacity={0.9} />
    </mesh>
  );
});
Star.displayName = "Star";

/* ----------------------------------------------------------------- */
/* Planet component                                                  */
/* ----------------------------------------------------------------- */
interface PlanetProps {
  modelPath: string;
  atmosphereColor?: string;
  atmospherePower?: number;
  position: [number, number, number];
  scale: [number, number, number];
  rotationSpeed: number;
  orbitSpeed: number;
  orbitRadius: number;
  orbitAxis?: "x" | "y" | "z";
}
function Planet({
  modelPath,
  atmosphereColor = "#4d71d7",
  atmospherePower = 3,
  position: initialPos,
  scale: planetScale,
  rotationSpeed,
  orbitSpeed,
  orbitRadius,
  orbitAxis = "y",
}: PlanetProps) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<Group>(null!);

  const atmosphereMat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uColor: { value: new Color(atmosphereColor) },
          uPower: { value: atmospherePower },
          uIntensity: { value: 1.5 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [atmosphereColor, atmospherePower]
  );

  const atmosphereScale = planetScale.map((v) => v * 1.15) as [
    number,
    number,
    number
  ];

  useFrame(({ clock }) => {
    groupRef.current.rotation.y += rotationSpeed * 0.01;

    const t = clock.getElapsedTime();
    const angle = t * orbitSpeed;
    const x = orbitRadius * Math.sin(angle);
    const z = orbitRadius * Math.cos(angle);

    if (orbitAxis === "x") groupRef.current.position.set(initialPos[0], x, z);
    else if (orbitAxis === "z")
      groupRef.current.position.set(x, initialPos[1], z);
    else groupRef.current.position.set(x, initialPos[1], z);
  });

  return (
    <group ref={groupRef} position={initialPos}>
      <mesh scale={atmosphereScale}>
        <sphereGeometry args={[1, 32, 32]} />
        <primitive object={atmosphereMat} attach="material" />
      </mesh>
      <group scale={planetScale}>
        <primitive object={scene.clone()} />
      </group>
    </group>
  );
}

/* ----------------------------------------------------------------- */
/* Asteroid belt                                                     */
/* ----------------------------------------------------------------- */
interface AsteroidBeltProps {
  count: number;
  innerRadius: number;
  outerRadius: number;
  height: number;
}
function AsteroidBelt({ count, innerRadius, outerRadius, height }: AsteroidBeltProps) {
  const { scene } = useGLTF("/models/planet7.glb");

  const baseMesh = useMemo<THREE.Mesh | null>(() => {
    let mesh: THREE.Mesh | null = null;
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) mesh = child;
    });
    return mesh;
  }, [scene]);

  const asteroids = useMemo(() => {
    const arr: { position: THREE.Vector3; rotation: THREE.Euler; scale: number }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = MathUtils.randFloat(innerRadius, outerRadius);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = MathUtils.randFloat(-height / 2, height / 2);
      arr.push({
        position: new ThreeVector3(x, y, z),
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        scale: MathUtils.randFloat(0.05, 0.25),
      });
    }
    return arr;
  }, [count, innerRadius, outerRadius, height]);

  const beltRef = useRef<THREE.InstancedMesh>(null!);
  useFrame(({ clock }) => {
    if (beltRef.current) beltRef.current.rotation.y = clock.getElapsedTime() * 0.05;
  });

  if (!baseMesh) return null;

  return (
    <Instances ref={beltRef} geometry={baseMesh.geometry} material={baseMesh.material} count={asteroids.length}>
      {asteroids.map(({ position, rotation, scale }, i) => (
        <Instance key={i} position={position} rotation={rotation} scale={scale} />
      ))}
    </Instances>
  );
}

/* ----------------------------------------------------------------- */
/* Main component with fade / scale animation                        */
/* ----------------------------------------------------------------- */
export default function AnimatedBackground({ isActive }: AnimatedBackgroundProps) {
  const sunRef = useRef<Mesh>(null!);
  const [godRaysReady, setGodRaysReady] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => { if (sunRef.current) setGodRaysReady(true); }, 100);
    return () => clearTimeout(id);
  }, []);

  const postEffects = useMemo(
    () => (
      <>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.8} intensity={1.5} kernelSize={KernelSize.HUGE} mipmapBlur />
        <ChromaticAberration offset={new THREE.Vector2(0.0005, 0.0005)} radialModulation />
        <Vignette eskil={false} offset={0.12} darkness={1} />
        {godRaysReady && sunRef.current && (
          <GodRays
            sun={sunRef.current}
            kernelSize={KernelSize.SMALL}
            density={0.96}
            decay={0.95}
            weight={0.6}
            exposure={0.4}
            samples={60}
            clampMax={1}
          />
        )}
      </>
    ),
    [godRaysReady]
  );

    return (
        <motion.div
          key="space-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed inset-0 z-0 pointer-events-none"
        >
     <Canvas className="w-full h-full"
             camera={{ position: [0, 15, 35], fov: 55 }}
      
      dpr={[1, 1.5]} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}>
        <color attach="background" args={["#020207"]} />
        <ambientLight intensity={0.03} />
        <Star ref={sunRef} />

        <Suspense fallback={null}>
          <Planet modelPath="/models/planet1.glb" position={[0, 0, 0]}   scale={[0.6, 0.6, 0.6]} rotationSpeed={0.15} orbitSpeed={0.12} orbitRadius={6}  atmosphereColor="#88aaff" />
          <Planet modelPath="/models/planet2.glb" position={[0, 0.2, 0]} scale={[0.8, 0.8, 0.8]} rotationSpeed={0.10} orbitSpeed={0.09} orbitRadius={9}  atmosphereColor="#ffccaa" />
          <Planet modelPath="/models/planet3.glb" position={[0,-0.1, 0]} scale={[0.7, 0.7, 0.7]} rotationSpeed={0.12} orbitSpeed={0.07} orbitRadius={13} atmosphereColor="#aaffaa" />
          <Planet modelPath="/models/planet4.glb" position={[0, 0,   0]} scale={[1.0, 1.0, 1.0]} rotationSpeed={0.08} orbitSpeed={0.05} orbitRadius={18} atmosphereColor="#ffaaaa" />
          <Planet modelPath="/models/planet5.glb" position={[0, 0.3, 0]} scale={[0.9, 0.9, 0.9]} rotationSpeed={0.06} orbitSpeed={0.04} orbitRadius={24} atmosphereColor="#aaaaff" />
          <Planet modelPath="/models/planet6.glb" position={[0,-0.2, 0]} scale={[1.2, 1.2, 1.2]} rotationSpeed={0.04} orbitSpeed={0.03} orbitRadius={30} atmosphereColor="#ffffaa" atmospherePower={4} />
          <AsteroidBelt count={400} innerRadius={42} outerRadius={55} height={2} />

          <Environment path="/textures/cubemap/" files={["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]} background />
        </Suspense>

        <Sparkles count={400} scale={20} size={2.5} speed={0.25} noise={0.15} color="#ccccff" opacity={0.7} />

        <OrbitControls enablePan={false} enableZoom autoRotate autoRotateSpeed={0.08}
                       minDistance={10} maxDistance={70}
                       minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI - Math.PI / 5}
                       zoomSpeed={0.7} />

        <EffectComposer multisampling={0}>{postEffects}</EffectComposer>
      </Canvas>
    </motion.div>
  );
}