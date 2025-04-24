"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Physics,
  useBox,
  usePlane,
  useSphere,
} from "@react-three/cannon";
import { Stats } from "@react-three/drei";
import * as THREE from "three";
import { Vector3, Plane as ThreePlane, MathUtils } from "three";

/* ------------------------------------------------------------------ */
/*  Game constants                                                    */
/* ------------------------------------------------------------------ */
const TABLE_WIDTH = 4;
const TABLE_HEIGHT = 6;
const BORDER_THICKNESS = 0.2;
const BORDER_HEIGHT = 0.2;
const PADDLE_RADIUS = 0.3;
const PADDLE_HEIGHT = 0.15;
const PUCK_RADIUS = 0.15;
const PUCK_HEIGHT = 0.1;
const PLAYER_Z_MAX = TABLE_HEIGHT / 2 - PADDLE_RADIUS;
const PLAYER_Z_MIN = 0 + PADDLE_RADIUS;
const CPU_Z_MIN = -TABLE_HEIGHT / 2 + PADDLE_RADIUS;
const CPU_Z_MAX = 0 - PADDLE_RADIUS;
const CPU_PADDLE_SPEED = 4.5; // Yapay zeka hızı artırıldı
const GOAL_WIDTH = 2;

/* ------------------------------------------------------------------ */
/*  Table and walls                                                   */
/* ------------------------------------------------------------------ */
function TableAndWalls() {
  /* Floor */
  usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -BORDER_HEIGHT / 2, 0],
    material: { friction: 0.01, restitution: 0.95 },
  }));

  /* Four walls */
  const wallMaterial = { friction: 0, restitution: 0.8 } as const;
  
  // Top ve alt duvarlar (ama goal boşluğu bırakarak)
  const sideWallWidth = (TABLE_WIDTH - GOAL_WIDTH) / 2;
  
  /* Yan duvarlar */
  useBox(() => ({ 
    args: [BORDER_THICKNESS, BORDER_HEIGHT, TABLE_HEIGHT], 
    position: [-TABLE_WIDTH / 2 - BORDER_THICKNESS / 2, 0, 0], 
    material: wallMaterial 
  }));
  
  useBox(() => ({ 
    args: [BORDER_THICKNESS, BORDER_HEIGHT, TABLE_HEIGHT], 
    position: [TABLE_WIDTH / 2 + BORDER_THICKNESS / 2, 0, 0], 
    material: wallMaterial 
  }));
  
  /* Üst duvarlar - kaleleri bırakarak */
  // Sol üst duvar parçası
  useBox(() => ({ 
    args: [sideWallWidth, BORDER_HEIGHT, BORDER_THICKNESS], 
    position: [-TABLE_WIDTH / 2 + sideWallWidth / 2, 0, TABLE_HEIGHT / 2 + BORDER_THICKNESS / 2], 
    material: wallMaterial 
  }));
  
  // Sağ üst duvar parçası
  useBox(() => ({ 
    args: [sideWallWidth, BORDER_HEIGHT, BORDER_THICKNESS], 
    position: [TABLE_WIDTH / 2 - sideWallWidth / 2, 0, TABLE_HEIGHT / 2 + BORDER_THICKNESS / 2], 
    material: wallMaterial 
  }));
  
  /* Alt duvarlar - kaleleri bırakarak */
  // Sol alt duvar parçası
  useBox(() => ({ 
    args: [sideWallWidth, BORDER_HEIGHT, BORDER_THICKNESS], 
    position: [-TABLE_WIDTH / 2 + sideWallWidth / 2, 0, -TABLE_HEIGHT / 2 - BORDER_THICKNESS / 2], 
    material: wallMaterial 
  }));
  
  // Sağ alt duvar parçası
  useBox(() => ({ 
    args: [sideWallWidth, BORDER_HEIGHT, BORDER_THICKNESS], 
    position: [TABLE_WIDTH / 2 - sideWallWidth / 2, 0, -TABLE_HEIGHT / 2 - BORDER_THICKNESS / 2], 
    material: wallMaterial 
  }));

  return (
    <>
      {/* Field */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -BORDER_HEIGHT / 2, 0]} receiveShadow>
        <planeGeometry args={[TABLE_WIDTH, TABLE_HEIGHT]} />
        <meshStandardMaterial color="#3366cc" />
      </mesh>
      
      {/* Center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -BORDER_HEIGHT / 2 + 0.01, 0]}>
        <planeGeometry args={[TABLE_WIDTH, 0.05]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Center circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -BORDER_HEIGHT / 2 + 0.01, 0]}>
        <ringGeometry args={[0.5, 0.55, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Goals (visual) */}
      <mesh position={[0, 0, TABLE_HEIGHT / 2 + BORDER_THICKNESS/2]} receiveShadow>
        <boxGeometry args={[GOAL_WIDTH, 0.5, BORDER_THICKNESS]} />
        <meshStandardMaterial color="#00ff00" opacity={0.5} transparent />
      </mesh>
      <mesh position={[0, 0, -TABLE_HEIGHT / 2 - BORDER_THICKNESS/2]} receiveShadow>
        <boxGeometry args={[GOAL_WIDTH, 0.5, BORDER_THICKNESS]} />
        <meshStandardMaterial color="#ff0000" opacity={0.5} transparent />
      </mesh>
      
      {/* Walls (visual) */}
      <mesh position={[-TABLE_WIDTH / 2 - BORDER_THICKNESS / 2, 0, 0]}>
        <boxGeometry args={[BORDER_THICKNESS, BORDER_HEIGHT, TABLE_HEIGHT]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh position={[TABLE_WIDTH / 2 + BORDER_THICKNESS / 2, 0, 0]}>
        <boxGeometry args={[BORDER_THICKNESS, BORDER_HEIGHT, TABLE_HEIGHT]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Üst duvarlar */}
      <mesh position={[-TABLE_WIDTH / 2 + sideWallWidth / 2, 0, TABLE_HEIGHT / 2 + BORDER_THICKNESS / 2]}>
        <boxGeometry args={[sideWallWidth, BORDER_HEIGHT, BORDER_THICKNESS]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh position={[TABLE_WIDTH / 2 - sideWallWidth / 2, 0, TABLE_HEIGHT / 2 + BORDER_THICKNESS / 2]}>
        <boxGeometry args={[sideWallWidth, BORDER_HEIGHT, BORDER_THICKNESS]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Alt duvarlar */}
      <mesh position={[-TABLE_WIDTH / 2 + sideWallWidth / 2, 0, -TABLE_HEIGHT / 2 - BORDER_THICKNESS / 2]}>
        <boxGeometry args={[sideWallWidth, BORDER_HEIGHT, BORDER_THICKNESS]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh position={[TABLE_WIDTH / 2 - sideWallWidth / 2, 0, -TABLE_HEIGHT / 2 - BORDER_THICKNESS / 2]}>
        <boxGeometry args={[sideWallWidth, BORDER_HEIGHT, BORDER_THICKNESS]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Puck                                                              */
/* ------------------------------------------------------------------ */
interface PuckProps {
  onGoal: (side: "player" | "cpu") => void;
  resetPosition: boolean;
  onResetComplete: () => void;
}

function Puck({ onGoal, resetPosition, onResetComplete }: PuckProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [goalScored, setGoalScored] = useState(false);
  const goalSoundRef = useRef<HTMLAudioElement | null>(null);
  const wallSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio elements if in browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      goalSoundRef.current = new Audio('/sounds/goal.mp3');
      wallSoundRef.current = new Audio('/sounds/wall.mp3');
    }
  }, []);

  const [ref, api] = useSphere<THREE.Mesh>(() => ({
    mass: 1,
    args: [PUCK_RADIUS],
    position: [0, PUCK_HEIGHT / 2 + 0.01, 0],
    linearDamping: 0.1, // Sürtünmeyi azalttık (0.3 -> 0.1)
    angularDamping: 0.95,
    material: { friction: 0.02, restitution: 0.95 }, // Sürtünmeyi azalttık, sekme katsayısını artırdık
    fixedRotation: true,
  }), meshRef);

  // Reset puck position when needed
  useEffect(() => {
    if (resetPosition) {
      // Topun ortada başlamasını sağla
      api.position.set(0, PUCK_HEIGHT / 2 + 0.01, 0);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0); // Açısal hızı sıfırla
      setGoalScored(false);
      
      // Topun ilk hareketini sağlamak için rastgele hafif bir itme
      setTimeout(() => {
        const randomX = (Math.random() - 0.5) * 2; // -1 ile 1 arası
        const randomZ = (Math.random() - 0.5) * 2; // -1 ile 1 arası
        api.velocity.set(randomX, 0, randomZ);
        onResetComplete();
      }, 500); // Give time for physics to settle
    }
  }, [resetPosition, api, onResetComplete]);

  // Make object accessible for CPU AI
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.api = api;
    }
  }, [api]);

  /* Puck kontrolü ve gol tespiti */
  useFrame(() => {
    api.position.subscribe((p) => {
      // Store current position for CPU AI
      if (meshRef.current) {
        meshRef.current.userData.position = new THREE.Vector3(p[0], p[1], p[2]);
      }

      // Topun y pozisyonunu sabit tut
      if (Math.abs(p[1] - PUCK_HEIGHT / 2) > 0.05) {
        api.position.set(p[0], PUCK_HEIGHT / 2, p[2]);
      }

      // Gol tespiti - artık kale boşlukları var
      if (!goalScored) {
        // Kale genişliği içinde mi?
        const withinGoalWidth = Math.abs(p[0]) < GOAL_WIDTH / 2;
        
        // Oyuncu golü
        if (p[2] > TABLE_HEIGHT / 2 + BORDER_THICKNESS / 2 && withinGoalWidth) {
          setGoalScored(true);
          goalSoundRef.current?.play().catch(e => console.log("Sound play failed"));
          onGoal("player");
        }
        
        // CPU (Ramazan) golü
        if (p[2] < -TABLE_HEIGHT / 2 - BORDER_THICKNESS / 2 && withinGoalWidth) {
          setGoalScored(true);
          goalSoundRef.current?.play().catch(e => console.log("Sound play failed"));
          onGoal("cpu");
        }
      }
    });

    // Track and update velocity for CPU AI
    api.velocity.subscribe((v) => {
      if (meshRef.current) {
        meshRef.current.userData.velocity = new THREE.Vector3(v[0], v[1], v[2]);
      }
      
      // Dikey hızı sınırla
      if (Math.abs(v[1]) > 0.1) {
        api.velocity.set(v[0], 0, v[2]);
      }
      
      // Deadlock önleme için çok yavaş harekette küçük rastgele değişimler ekle
      if (Math.abs(v[0]) < 0.1 && Math.abs(v[2]) < 0.1) {
        api.velocity.set(
          v[0] + (Math.random() - 0.5) * 0.1,
          0,
          v[2] + (Math.random() - 0.5) * 0.1
        );
      }
    });
    
    // Dönüşü tam olarak kontrol et
    api.angularVelocity.subscribe((av) => {
      // Herhangi bir dönüş varsa sıfırla
      if (Math.abs(av[0]) > 0.01 || Math.abs(av[1]) > 0.01 || Math.abs(av[2]) > 0.01) {
        api.angularVelocity.set(0, 0, 0);
      }
    });
  });

  return (
    <mesh ref={meshRef} castShadow name="puck">
      <cylinderGeometry args={[PUCK_RADIUS, PUCK_RADIUS, PUCK_HEIGHT, 32]} />
      <meshStandardMaterial color="black" />
      
      {/* Üst yüzeye desen ekleme */}
      <mesh position={[0, PUCK_HEIGHT / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[PUCK_RADIUS * 0.3, PUCK_RADIUS * 0.7, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Player paddle                                                     */
/* ------------------------------------------------------------------ */
function PlayerPaddle() {
  const { raycaster, camera, mouse } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const tablePlane = useMemo(() => new ThreePlane(new Vector3(0, 1, 0), 0), []);
  const intersectionPoint = useMemo(() => new Vector3(), []);
  const lastPosition = useRef(new Vector3(0, PADDLE_HEIGHT / 2, PLAYER_Z_MAX - 0.5));

  const [, api] = useSphere<THREE.Mesh>(() => ({
    type: "Kinematic",
    args: [PADDLE_RADIUS],
    position: [0, PADDLE_HEIGHT / 2, PLAYER_Z_MAX - 0.5],
    material: { friction: 0.1, restitution: 0.7 },
  }), meshRef);

  useFrame(() => {
    raycaster.setFromCamera(mouse, camera);
    if (raycaster.ray.intersectPlane(tablePlane, intersectionPoint)) {
      const targetX = MathUtils.clamp(intersectionPoint.x, -TABLE_WIDTH / 2 + PADDLE_RADIUS, TABLE_WIDTH / 2 - PADDLE_RADIUS);
      const targetZ = MathUtils.clamp(intersectionPoint.z, PLAYER_Z_MIN, PLAYER_Z_MAX);
      
      // Calculate velocity based on movement for more realistic physics
      const newPos = new Vector3(targetX, PADDLE_HEIGHT / 2, targetZ);
      const velocity = new Vector3().subVectors(newPos, lastPosition.current).multiplyScalar(15); // Hız çarpanını 10'dan 15'e artırdık
      
      api.position.set(targetX, PADDLE_HEIGHT / 2, targetZ);
      api.velocity.set(velocity.x, 0, velocity.z);
      lastPosition.current.copy(newPos);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} castShadow name="playerPaddle">
        <cylinderGeometry args={[PADDLE_RADIUS, PADDLE_RADIUS, PADDLE_HEIGHT, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
      {/* Paddle üzerindeki tutamaç görünümü */}
      <mesh position={[0, PADDLE_HEIGHT / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[PADDLE_RADIUS * 0.3, PADDLE_RADIUS * 0.8, 16]} />
        <meshStandardMaterial color="#990000" />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  CPU paddle – Ramazan AI                                          */
/* ------------------------------------------------------------------ */
function CPUPaddle() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();
  const [, api] = useSphere<THREE.Mesh>(() => ({
    type: "Kinematic",
    args: [PADDLE_RADIUS],
    position: [0, PADDLE_HEIGHT / 2, CPU_Z_MIN + 0.5],
    material: { friction: 0.1, restitution: 0.7 },
  }), meshRef);

  const lastPosition = useRef(new Vector3(0, PADDLE_HEIGHT / 2, CPU_Z_MIN + 0.5));
  const targetPosition = useRef(new Vector3(0, PADDLE_HEIGHT / 2, CPU_Z_MIN + 0.5));
  const idleTimer = useRef(0);
  const aggressiveTimer = useRef(0);
  const lastPuckZ = useRef(0);
  
  /** Predict puck impact X including wall bounces */
  const predictInterceptX = useCallback((puckPos: THREE.Vector3, puckVel: THREE.Vector3, targetZ: number) => {
    // Moving away or stationary
    if (puckVel.z >= 0 || Math.abs(puckVel.z) < 0.1) return null;
    
    // Time until puck reaches target Z
    const time = (targetZ - puckPos.z) / puckVel.z; // vel.z negative
    
    // If time is negative or too large, ignore
    if (time < 0 || time > 5) return null;
    
    let predictedX = puckPos.x + puckVel.x * time;

    // Account for wall bounces (simplified)
    const tableHalfWidth = TABLE_WIDTH / 2 - PUCK_RADIUS;
    while (Math.abs(predictedX) > tableHalfWidth) {
      predictedX = predictedX > 0 
        ? 2 * tableHalfWidth - predictedX 
        : -2 * tableHalfWidth - predictedX;
    }
    
    return predictedX;
  }, []);

  useFrame((_, delta) => {
    const puck = scene.getObjectByName("puck");
    if (!puck || !meshRef.current) return;

    // Get puck data
    const puckPos = puck.userData.position as THREE.Vector3 || puck.position.clone();
    const puckVel = puck.userData.velocity as THREE.Vector3 || new THREE.Vector3();
    
    let targetX = 0;
    let targetZ = CPU_Z_MIN + 0.5;
    
    // Top yavaş mı hızlı mı?
    const puckSpeed = Math.sqrt(puckVel.x * puckVel.x + puckVel.z * puckVel.z);
    const isPuckSlow = puckSpeed < 1.0;
    
    // Top CPU tarafında mı kontrol et
    const puckInCPUHalf = puckPos.z < 0;
    
    // Top CPU sahasında ve yavaşsa, agresif mod
    if (puckInCPUHalf && isPuckSlow) {
      aggressiveTimer.current += delta;
      
      // Topa doğru git
      targetX = MathUtils.clamp(puckPos.x, -TABLE_WIDTH / 2 + PADDLE_RADIUS * 1.2, TABLE_WIDTH / 2 - PADDLE_RADIUS * 1.2);
      
      // Topa yaklaş
      const distanceToKeep = aggressiveTimer.current > 0.7 ? 0.1 : 0.3;
      targetZ = Math.max(
        CPU_Z_MIN + 0.2, 
        Math.min(puckPos.z - distanceToKeep, CPU_Z_MAX - 0.2)
      );
      
      // Eğer top çok uzun süre durağansa, ona vur
      if (aggressiveTimer.current > 1.0) {
        // Doğrudan topa git
        targetX = puckPos.x;
        targetZ = puckPos.z;
        
        // Agresif timer'ı sınırla
        if (aggressiveTimer.current > 2.0) aggressiveTimer.current = 0;
      }
      
      // Idle hareketi sıfırla
      idleTimer.current = 0;
    }
    // Topun yönü CPU'ya doğruysa (top aşağı doğru geliyorsa)
    else if (puckVel.z < -0.5 && puckPos.z > CPU_Z_MAX) {
      // İlk olarak hedef alanı belirle - topun hızına göre ayarla
      let interceptZ = CPU_Z_MIN + 1.0; // Varsayılan konum
      
      // Top hızlıysa daha geride dur
      if (puckSpeed > 5) {
        interceptZ = CPU_Z_MIN + 0.5;
      } 
      // Orta hızda biraz ileri çık
      else if (puckSpeed > 2) {
        interceptZ = CPU_Z_MIN + 1.0;
      }
      // Yavaş toplar için daha ileri çık 
      else {
        interceptZ = Math.min(CPU_Z_MAX - 0.5, puckPos.z - 1.0);
      }
      
      // Kesişme noktasını tahmin et
      const interceptX = predictInterceptX(puckPos, puckVel, interceptZ);
      
      if (interceptX !== null) {
        targetX = MathUtils.clamp(interceptX, -TABLE_WIDTH / 2 + PADDLE_RADIUS, TABLE_WIDTH / 2 - PADDLE_RADIUS);
        targetZ = interceptZ;
        
        // Acil durumlarda hızlı hareket etmesini sağla
        if (puckPos.z < CPU_Z_MAX && Math.abs(puckPos.z - targetZ) < 1.0) {
          targetX = puckPos.x; // Doğrudan topun x pozisyonuna git
        }
      }
      
      // Active mode timers reset
      idleTimer.current = 0;
      aggressiveTimer.current = 0;
    } 
    // Idle movement - topun gelişini beklerken
    else {
      idleTimer.current += delta;
      aggressiveTimer.current = 0;
      
      // CPU varsayılan konumunda hafif salınım
      if (idleTimer.current > 0.5) {
        targetX = Math.sin(idleTimer.current * 0.8) * (TABLE_WIDTH / 4);
        targetZ = CPU_Z_MIN + 0.5 + Math.sin(idleTimer.current * 0.3) * 0.3;
      } 
      // Varsayılan konum
      else {
        targetX = 0;
        targetZ = CPU_Z_MIN + 0.7;
      }
    }
    
    // Daha yumuşak hareket için damping uygula
    targetPosition.current.x = MathUtils.damp(
      targetPosition.current.x,
      targetX,
      CPU_PADDLE_SPEED,
      delta
    );
    
    targetPosition.current.z = MathUtils.damp(
      targetPosition.current.z,
      targetZ,
      CPU_PADDLE_SPEED,
      delta
    );
    
    // Calculate velocity for improved physics interaction
    const velocity = new Vector3()
      .subVectors(targetPosition.current, lastPosition.current)
      .multiplyScalar(15); // Hız çarpanını 10'dan 15'e artırdık
    
    // Update position
    api.position.set(
      targetPosition.current.x, 
      PADDLE_HEIGHT / 2, 
      targetPosition.current.z
    );
    
    // Update velocity for physics interaction
    api.velocity.set(velocity.x, 0, velocity.z);
    api.angularVelocity.set(0, 0, 0);
    
    // Store last position
    lastPosition.current.copy(targetPosition.current);
    
    // Top konumunu kaydet
    lastPuckZ.current = puckPos.z;
  });

  return (
    <group>
      <mesh ref={meshRef} castShadow name="cpuPaddle">
        <cylinderGeometry args={[PADDLE_RADIUS, PADDLE_RADIUS, PADDLE_HEIGHT, 32]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      {/* CPU paddle üzerindeki desen */}
      <mesh position={[0, PADDLE_HEIGHT / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[PADDLE_RADIUS * 0.3, PADDLE_RADIUS * 0.8, 16]} />
        <meshStandardMaterial color="#000099" />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Game effects                                                      */
/* ------------------------------------------------------------------ */
function GoalEffect({ position, active }: { position: [number, number, number], active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((_, delta) => {
    if (ref.current && active) {
      ref.current.rotation.y += delta * 5;
      ref.current.scale.x = 1.2 + Math.sin(Date.now() * 0.01) * 0.3;
      ref.current.scale.z = 1.2 + Math.sin(Date.now() * 0.01) * 0.3;
    }
  });
  
  if (!active) return null;
  
  return (
    <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.7, 0.9, 32]} />
      <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={2} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
export default function AirHockey() {
  const [playerScore, setPlayerScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [resetPuck, setResetPuck] = useState(false);
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [goalEffect, setGoalEffect] = useState<{ active: boolean, position: [number, number, number] }>({
    active: false,
    position: [0, 0, 0]
  });

  // Callback when a goal is scored
  const handleGoal = useCallback((side: "player" | "cpu") => {
    const position: [number, number, number] = side === "player" 
      ? [0, 0.1, TABLE_HEIGHT / 2 + BORDER_THICKNESS / 2] 
      : [0, 0.1, -TABLE_HEIGHT / 2 - BORDER_THICKNESS / 2];
      
    // Show goal effect
    setGoalEffect({ active: true, position });
    
    // Update score - her iki taraf için de 1'er puan
    if (side === "player") {
      setPlayerScore((s) => {
        const newScore = s + 1;
        // 3 golde mesajı göster
        if (newScore >= 3) {
          setShowEndMessage(true);
        }
        return newScore;
      });
      setCpuScore((s) => s + 1); // Ramazan'ın puanını da artır
    } else {
      setCpuScore((s) => {
        const newScore = s + 1;
        // 3 golde mesajı göster
        if (newScore >= 3) {
          setShowEndMessage(true);
        }
        return newScore;
      });
      setPlayerScore((s) => s + 1); // Oyuncunun puanını da artır
    }
    
    // Ortadan başlamak için top pozisyonunu hemen sıfırla
    // Reset puck after delay - topun ortadan başlaması için sıfırla
    setTimeout(() => {
      setResetPuck(true);
      setGoalEffect({ active: false, position: [0, 0, 0] });
    }, 1500);
  }, []);
  
  // Oyunu sıfırlama fonksiyonu
  const resetGame = useCallback(() => {
    setPlayerScore(0);
    setCpuScore(0);
    setShowEndMessage(false);
    setResetPuck(true);
  }, []);
  
  const handleResetComplete = useCallback(() => {
    setResetPuck(false);
  }, []);

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden border border-gray-700 bg-gray-900">
      {/* Scoreboard */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-6 text-white font-mono text-xl z-10 bg-black/30 px-3 py-1 rounded">
        <span className="text-red-400">Sen: {playerScore}</span>
        <span className="text-blue-400">Ramazan: {cpuScore}</span>
      </div>

      {/* Game canvas */}
      <Canvas shadows orthographic camera={{ position: [0, 10, 0.1], zoom: 60, near: 1, far: 20 }}>
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />
        <Physics gravity={[0, -0.5, 0]} allowSleep={false} defaultContactMaterial={{ friction: 0.01, restitution: 0.95 }}>
          <TableAndWalls />
          <Puck onGoal={handleGoal} resetPosition={resetPuck} onResetComplete={handleResetComplete} />
          <PlayerPaddle />
          <CPUPaddle />
          {goalEffect.active && <GoalEffect position={goalEffect.position} active={goalEffect.active} />}
        </Physics>
        {/* Kenar çizgileri */}
        <group position={[0, -BORDER_HEIGHT / 2 + 0.005, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-TABLE_WIDTH / 2, 0, 0]}>
            <planeGeometry args={[0.05, TABLE_HEIGHT]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[TABLE_WIDTH / 2, 0, 0]}>
            <planeGeometry args={[0.05, TABLE_HEIGHT]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, TABLE_HEIGHT / 2, 0]}>
            <planeGeometry args={[TABLE_WIDTH, 0.05]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -TABLE_HEIGHT / 2, 0]}>
            <planeGeometry args={[TABLE_WIDTH, 0.05]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </group>
      </Canvas>

      {/* Bitiş mesajı */}
      {showEndMessage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 text-white font-mono p-4">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Güldük Eğlendik Yeter!</h2>
            <p className="mb-3">Benim yaptığım oyunda ancak beraberlik kazanır.</p>
            <p>İstersen siteyi gezmeye devam et.</p>
          </div>
        </div>
      )}

      {/* Control hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-gray-300 text-sm font-mono bg-black/50 px-2 py-1 rounded-lg pointer-events-none">
        Kırmızı topu hareket ettirmek için fareyi kullan
      </div>
    </div>
  );
}