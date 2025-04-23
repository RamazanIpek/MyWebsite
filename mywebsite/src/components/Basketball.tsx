// src/components/games/Basketball.tsx
"use client";
import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, usePlane, useSphere, useBox, useCylinder } from '@react-three/cannon';
import { OrbitControls, Text } from '@react-three/drei';

// Zemin
function Floor() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    userData: { id: 'floor' }
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#312e2b" />
    </mesh>
  );
}

// Basket topu
function Ball({ position = [0, 1, 6], onScore, onMiss }) {
  const [ballRef, api] = useSphere(() => ({
    mass: 1,
    position,
    args: [0.5],
    userData: { id: 'ball' },
    onCollide: (e) => {
      const targetBody = e.body;
      if (targetBody) {
        const userData = targetBody.userData;
        if (userData && userData.id === 'hoop-sensor') {
          // Top çemberden geçti - basket!
          onScore();
          setTimeout(() => resetBall(), 1500); // Topun düşmesini bekle
        } else if (userData && userData.id === 'floor') {
          // Top yere değdi ve çemberden geçmediyse
          if (!scoreDetected.current) {
            onMiss();
            setTimeout(() => resetBall(), 500);
          } else {
            // Basket olmuştu, skoru sıfırlama
            scoreDetected.current = false;
          }
        }
      }
    }
  }));

  const ballPosition = useRef([0, 0, 0]);
  const isDragging = useRef(false);
  const dragStart = useRef([0, 0, 0]);
  const scoreDetected = useRef(false);
  const { viewport } = useThree();

  useEffect(() => {
    api.position.subscribe(p => ballPosition.current = p);
  }, [api]);

  const resetBall = () => {
    // Topu başlangıç pozisyonuna getir
    api.position.set(0, 1, 6);
    api.velocity.set(0, 0, 0);
    api.angularVelocity.set(0, 0, 0);
    scoreDetected.current = false;
  };

  // Mouse eventleri
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (ballPosition.current[2] > 5) {  // Sadece başlangıç pozisyonundayken
        isDragging.current = true;
        dragStart.current = [e.clientX, e.clientY];
      }
    };

    const handleMouseUp = (e) => {
      if (isDragging.current) {
        const dragEnd = [e.clientX, e.clientY];
        const dragVector = [
          (dragStart.current[0] - dragEnd[0]) / 100,
          1,  // Yukarı kuvvet
          (dragStart.current[1] - dragEnd[1]) / 50
        ];

        // Atış kuvvetini sınırla
        const maxForce = 15;
        const force = Math.min(
          Math.sqrt(dragVector[0] ** 2 + dragVector[2] ** 2) * 5,
          maxForce
        );

        const normalizedVector = [
          (dragVector[0] / Math.sqrt(dragVector[0] ** 2 + dragVector[2] ** 2)) * force,
          dragVector[1] * force,
          (dragVector[2] / Math.sqrt(dragVector[0] ** 2 + dragVector[2] ** 2)) * -force
        ];

        // Şut at
        api.velocity.set(...normalizedVector);
        isDragging.current = false;
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [api, viewport]);

  // Basketbol deseni
  const createLines = () => {
    const lines = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      lines.push(
        <mesh key={i} position={[0, 0, 0]} rotation={[0, angle, 0]}>
          <torusGeometry args={[0.5, 0.02, 16, 32, Math.PI]} />
          <meshStandardMaterial color="black" />
        </mesh>
      );
    }
    return lines;
  };

  return (
    <mesh ref={ballRef} castShadow>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#e25822" />
      {createLines()}
    </mesh>
  );
}

// Basket potası
function Hoop({ position = [0, 5, 0], onBasket }) {
  // Basket panosu
  const [backboard] = useBox(() => ({
    args: [3, 2, 0.2],
    position: [0, 5, -0.8],
    type: 'Static',
    userData: { id: 'backboard' }
  }));

  // Basket çemberi
  const [rim] = useCylinder(() => ({
    args: [0.7, 0.7, 0.1, 16],
    position: [0, 4, 0],
    rotation: [Math.PI / 2, 0, 0],
    type: 'Static',
    userData: { id: 'rim' }
  }));

  // Çember sensörü (topun geçişini algılamak için)
  const [hoopSensor] = useCylinder(() => ({
    args: [0.6, 0.6, 0.02, 16],
    position: [0, 3.9, 0],  // Çemberin biraz altında
    rotation: [Math.PI / 2, 0, 0],
    isTrigger: true,
    type: 'Static',
    userData: { id: 'hoop-sensor' }
  }));

  // Basket direği
  const [pole] = useBox(() => ({
    args: [0.2, 6, 0.2],
    position: [0, 2, -1],
    type: 'Static',
    userData: { id: 'pole' }
  }));

  return (
    <group position={position}>
      {/* Basket panosu */}
      <mesh ref={backboard} receiveShadow castShadow>
        <boxGeometry args={[3, 2, 0.2]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Hedef işareti */}
      <mesh position={[0, 5, -0.7]} receiveShadow>
        <boxGeometry args={[0.6, 0.6, 0.05]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* Basket çemberi */}
      <mesh ref={rim} castShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.1, 32]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* Çember sensörü (görünmez) */}
      <mesh ref={hoopSensor} visible={false}>
        <cylinderGeometry args={[0.6, 0.6, 0.02, 32]} />
        <meshStandardMaterial color="red" transparent opacity={0.2} />
      </mesh>

      {/* Basket filesi - silindir şeklinde basit bir file temsili */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.4, 1, 16, 1, true]} />
        <meshStandardMaterial color="white" transparent opacity={0.3} wireframe />
      </mesh>

      {/* Basket direği */}
      <mesh ref={pole} castShadow>
        <boxGeometry args={[0.2, 6, 0.2]} />
        <meshStandardMaterial color="#444" />
      </mesh>
    </group>
  );
}

// Skor gösterimi
function ScoreDisplay({ score, attempts }) {
  return (
    <group position={[0, 8, 0]}>
      <Text
        position={[0, 0, 0]}
        fontSize={1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {`Basket: ${score}/${attempts}`}
      </Text>
    </group>
  );
}

// Talimatlar
function Instructions({ isDragging }) {
  return (
    <group position={[0, 2, 6]}>
      <Text
        position={[0, 0, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {isDragging ? "Bırak ve şut at!" : "Topu tutup sürükle ve bırak"}
      </Text>
    </group>
  );
}

// Ana oyun bileşeni
export default function BasketballGame() {
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleScore = () => {
    setScore(score + 1);
    setAttempts(attempts + 1);
  };

  const handleMiss = () => {
    setAttempts(attempts + 1);
  };

  useEffect(() => {
    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <Physics
          gravity={[0, -9.8, 0]}
          defaultContactMaterial={{
            friction: 0.5,
            restitution: 0.7,
          }}
        >
          <Floor />
          <Hoop />
          <Ball onScore={handleScore} onMiss={handleMiss} />
        </Physics>

        <ScoreDisplay score={score} attempts={attempts} />
        <Instructions isDragging={isDragging} />

        <OrbitControls enableRotate={false} enablePan={false} enableZoom={false} />
      </Canvas>

      <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
        Topu tutup sürükleyin ve bırakarak basket atın
      </div>
    </div>
  );
}