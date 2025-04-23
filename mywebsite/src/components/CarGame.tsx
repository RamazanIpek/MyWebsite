// src/components/games/CarGame.tsx
"use client";
import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';

// Zemin ve Yol
function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    userData: { id: 'ground' }
  }));

  // Yol bölümleri
  const roadSegments = [];
  const roadLength = 100;
  const roadWidth = 10;
  
  // Ana düz yol
  roadSegments.push(
    <mesh key="mainRoad" position={[0, 0.01, -roadLength / 2]} receiveShadow>
      <boxGeometry args={[roadWidth, 0.1, roadLength]} />
      <meshStandardMaterial color="#333" />
    </mesh>
  );
  
  // Yoldaki şeritler
  const stripesCount = 20;
  const stripesSpacing = roadLength / stripesCount;
  for (let i = 0; i < stripesCount; i++) {
    roadSegments.push(
      <mesh
        key={`stripe-${i}`}
        position={[0, 0.02, -roadLength + i * stripesSpacing]}
        receiveShadow
      >
        <boxGeometry args={[0.5, 0.05, 2]} />
        <meshStandardMaterial color="white" />
      </mesh>
    );
  }

  return (
    <>
      {/* Zemin */}
      <mesh ref={ref} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#4a7729" />
      </mesh>
      
      {/* Yol ve şeritler */}
      {roadSegments}
    </>
  );
}

// Engeller
function Obstacles({ onCollision }) {
  const obstacles = [];
  const obstacleCount = 15;
  
  // Engelleri rastgele konumlarda oluştur
  for (let i = 0; i < obstacleCount; i++) {
    const xPosition = Math.random() * 8 - 4; // -4 ile 4 arasında
    const zPosition = -10 - i * 6; // Yolun ilerisinde, aralıklarla
    
    // Rastgele engel türü (kutu veya silindir)
    const isBox = Math.random() > 0.5;
    
    if (isBox) {
      // Kutu engel
      const [boxRef] = useBox(() => ({
        mass: 1,
        position: [xPosition, 0.5, zPosition],
        args: [1, 1, 1],
        userData: { id: 'obstacle' },
        onCollide: onCollision
      }));
      
      obstacles.push(
        <mesh key={`box-${i}`} ref={boxRef} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#e63946" />
        </mesh>
      );
    } else {
      // Silindir engel (variller)
      const [cylinderRef] = useBox(() => ({
        mass: 1,
        position: [xPosition, 0.5, zPosition],
        args: [1, 1, 1],
        userData: { id: 'obstacle' },
        onCollide: onCollision
      }));
      
      obstacles.push(
        <mesh key={`cylinder-${i}`} ref={cylinderRef} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 1, 16]} />
          <meshStandardMaterial color="#f1c453" />
        </mesh>
      );
    }
  }

  return <>{obstacles}</>;
}

// Araba
function Car({ controls }) {
  const [carRef, api] = useBox(() => ({
    mass: 500,
    position: [0, 0.5, 0],
    args: [2, 1, 4],
    userData: { id: 'car' },
  }));
  
  const speed = useRef(0);
  const position = useRef([0, 0.5, 0]);
  const rotation = useRef([0, 0, 0]);
  
  // Fizik güncellemeleri
  useEffect(() => {
    const unsubPosition = api.position.subscribe(v => position.current = v);
    const unsubRotation = api.rotation.subscribe(v => rotation.current = v);
    
    return () => {
      unsubPosition();
      unsubRotation();
    };
  }, [api]);
  
  // Kontrollere göre aracı hareket ettir
  useFrame(() => {
    // Hızlanma ve yavaşlama
    if (controls.forward) {
      speed.current = Math.min(speed.current + 0.01, 0.5);
    } else if (controls.backward) {
      speed.current = Math.max(speed.current - 0.01, -0.2);
    } else {
      // Sürtünme
      speed.current *= 0.98;
      if (Math.abs(speed.current) < 0.01) speed.current = 0;
    }
    
    // Dönüş
    let rotationY = rotation.current[1];
    
    if (Math.abs(speed.current) > 0.01) {
      if (controls.left) rotationY += 0.03;
      if (controls.right) rotationY -= 0.03;
    }
    
    // Pozisyon güncelleme
    const direction = [
      Math.sin(rotationY) * speed.current,
      0,
      Math.cos(rotationY) * speed.current
    ];
    
    api.position.set(
      position.current[0] + direction[0],
      position.current[1],
      position.current[2] - direction[2]
    );
    
    api.rotation.set(0, rotationY, 0);
  });

  return (
    <group ref={carRef}>
      {/* Araba gövdesi */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 0.75, 4]} />
        <meshStandardMaterial color="#4361ee" />
      </mesh>
      
      {/* Araba kabini */}
      <mesh castShadow position={[0, 1.1, 0]}>
        <boxGeometry args={[1.5, 0.6, 2]} />
        <meshStandardMaterial color="#4cc9f0" />
      </mesh>
      
      {/* Farlar */}
      <mesh castShadow position={[0.5, 0.5, 1.9]}>
        <boxGeometry args={[0.4, 0.2, 0.1]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
      <mesh castShadow position={[-0.5, 0.5, 1.9]}>
        <boxGeometry args={[0.4, 0.2, 0.1]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
      
      {/* Tekerlekler */}
      <mesh castShadow position={[1, 0.3, 1.5]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh castShadow position={[-1, 0.3, 1.5]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh castShadow position={[1, 0.3, -1.5]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh castShadow position={[-1, 0.3, -1.5]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}

// Takip kamerası
function FollowCamera({ position }) {
  const cameraRef = useRef();
  const { camera } = useThree();
  
  useFrame(() => {
    if (position.current) {
      const [x, y, z] = position.current;
      camera.position.set(x, y + 5, z + 10);
      camera.lookAt(x, y, z);
    }
  });
  
  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 5, 10]} />;
}

// Oyun arayüzü
function GameInterface({ score, gameOver }) {
  return (
    <group position={[0, 0, -5]}>
      {gameOver ? (
        <Text
          position={[0, 4, 0]}
          fontSize={1.5}
          color="red"
          anchorX="center"
          anchorY="middle"
        >
          Oyun Bitti!
        </Text>
      ) : (
        <Text
          position={[0, 6, 0]}
          fontSize={1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {`Puan: ${score}`}
        </Text>
      )}
      
      {/* Kontrol Talimatları */}
      <Text
        position={[0, 4, 10]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        WASD veya Ok Tuşları ile Kontrol Edin
      </Text>
    </group>
  );
}

// Ana oyun bileşeni
export default function CarGame() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [controls, setControls] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false
  });
  
  const carPosition = useRef([0, 0.5, 0]);
  
  // Skor artırma
  useEffect(() => {
    if (gameOver) return;
    
    const timer = setInterval(() => {
      setScore(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameOver]);
  
  // Çarpışma kontrolü
  const handleCollision = () => {
    if (!gameOver) {
      setGameOver(true);
    }
  };
  
  // Klavye kontrolleri
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          setControls(prev => ({ ...prev, forward: true }));
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          setControls(prev => ({ ...prev, backward: true }));
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setControls(prev => ({ ...prev, left: true }));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setControls(prev => ({ ...prev, right: true }));
          break;
        case 'r':
        case 'R':
          // Oyunu yeniden başlat
          if (gameOver) {
            setGameOver(false);
            setScore(0);
          }
          break;
        default:
          break;
      }
    };
    
    const handleKeyUp = (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          setControls(prev => ({ ...prev, forward: false }));
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          setControls(prev => ({ ...prev, backward: false }));
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setControls(prev => ({ ...prev, left: false }));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setControls(prev => ({ ...prev, right: false }));
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver]);

  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        <Physics
          gravity={[0, -9.8, 0]}
          defaultContactMaterial={{
            friction: 0.1,
            restitution: 0.2,
          }}
        >
          <Ground />
          <Car controls={controls} ref={carPosition} />
          {!gameOver && <Obstacles onCollision={handleCollision} />}
        </Physics>
        
        <FollowCamera position={carPosition} />
        <GameInterface score={score} gameOver={gameOver} />
        
        <fog attach="fog" args={['#b9d5ff', 30, 100]} />
      </Canvas>
      
      <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
        WASD veya Ok Tuşları ile kontrol edin, R tuşu ile yeniden başlatın
      </div>
    </div>
  );
}