// src/components/games/Soccer.tsx
"use client";
import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, usePlane, useSphere, useBox } from '@react-three/cannon';
import { OrbitControls, Text } from '@react-three/drei';

// Zemin
function Ground() {
  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0], 
    position: [0, 0, 0], 
    userData: { id: 'ground' }
  }));
  
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#2e8b57" />
    </mesh>
  );
}

// Futbol topu
function Ball({ position = [0, 1, 10], onGoal, onMiss }) {
  const [ballRef, api] = useSphere(() => ({
    mass: 1,
    position,
    args: [0.4],
    userData: { id: 'ball' },
    onCollide: (e) => {
      // Topun kale veya hedef dışında bir şeye çarpmasını kontrol et
      const targetBody = e.body;
      if (targetBody) {
        const userData = targetBody.userData;
        if (userData && userData.id === 'goalpost') {
          // Top kale direğine çarptı
          console.log("Kale direğine çarptı!");
        } else if (userData && userData.id === 'goalnet') {
          // Gol!
          console.log("GOL!");
          onGoal();
          resetBall();
        } else if (userData && userData.id === 'ground') {
          // Top yere çarptı - ıska
          console.log("Top yerle buluştu :(");
          onMiss();
          resetBall();
        }
      }
    }
  }));
  
  const resetBall = () => {
    // Topu başlangıç pozisyonuna getir
    api.position.set(0, 1, 10);
    api.velocity.set(0, 0, 0);
    api.angularVelocity.set(0, 0, 0);
  };
  
  // Mouse ile şut kontrolü
  const ballPosition = useRef([0, 0, 0]);
  const isDragging = useRef(false);
  const dragStart = useRef([0, 0, 0]);
  const { viewport } = useThree();
  
  useEffect(() => {
    api.position.subscribe(p => ballPosition.current = p);
  }, [api]);
  
  // Mouse eventleri
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (ballPosition.current[2] > 9) {  // Sadece başlangıç pozisyonundayken
        isDragging.current = true;
        dragStart.current = [e.clientX, e.clientY];
      }
    };
    
    const handleMouseUp = (e) => {
      if (isDragging.current) {
        const dragEnd = [e.clientX, e.clientY];
        const dragVector = [
          (dragStart.current[0] - dragEnd[0]) / 100,
          0.5,  // Yukarı kuvvet
          (dragStart.current[1] - dragEnd[1]) / 100
        ];
        
        // Şut kuvvetini sınırla
        const maxForce = 15;
        const force = Math.min(
          Math.sqrt(dragVector[0] ** 2 + dragVector[2] ** 2) * 10, 
          maxForce
        );
        
        const normalizedVector = [
          (dragVector[0] / Math.sqrt(dragVector[0] ** 2 + dragVector[2] ** 2)) * force,
          dragVector[1] * force,
          (dragVector[2] / Math.sqrt(dragVector[0] ** 2 + dragVector[2] ** 2)) * force
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

  return (
    <mesh ref={ballRef} castShadow>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial color="white" />
      
      {/* Futbol topu çizgileri */}
      <group>
        <mesh>
          <torusGeometry args={[0.4, 0.015, 16, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.4, 0.015, 16, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.4, 0.015, 16, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>
    </mesh>
  );
}

// Futbol kalesi
function Goal() {
  // Kale boyutları
  const width = 7;
  const height = 3;
  const depth = 2;
  const postThickness = 0.2;
  
  // Kale direkleri
  const [leftPost] = useBox(() => ({
    args: [postThickness, height, postThickness],
    position: [-width/2, height/2, 0],
    type: 'Static',
    userData: { id: 'goalpost' }
  }));
  
  const [rightPost] = useBox(() => ({
    args: [postThickness, height, postThickness],
    position: [width/2, height/2, 0],
    type: 'Static',
    userData: { id: 'goalpost' }
  }));
  
  const [crossbar] = useBox(() => ({
    args: [width + postThickness, postThickness, postThickness],
    position: [0, height, 0],
    type: 'Static',
    userData: { id: 'goalpost' }
  }));
  
  // Kale ağı
  const [backNet] = useBox(() => ({
    args: [width, height, postThickness],
    position: [0, height/2, -depth],
    type: 'Static',
    userData: { id: 'goalnet' }
  }));
  
  const [leftNet] = useBox(() => ({
    args: [postThickness, height, depth],
    position: [-width/2, height/2, -depth/2],
    type: 'Static',
    userData: { id: 'goalnet' }
  }));
  
  const [rightNet] = useBox(() => ({
    args: [postThickness, height, depth],
    position: [width/2, height/2, -depth/2],
    type: 'Static',
    userData: { id: 'goalnet' }
  }));
  
  const [topNet] = useBox(() => ({
    args: [width, postThickness, depth],
    position: [0, height, -depth/2],
    type: 'Static',
    userData: { id: 'goalnet' }
  }));

  return (
    <group position={[0, 0, 0]}>
      {/* Sol direk */}
      <mesh ref={leftPost} castShadow>
        <boxGeometry args={[postThickness, height, postThickness]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Sağ direk */}
      <mesh ref={rightPost} castShadow>
        <boxGeometry args={[postThickness, height, postThickness]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Üst direk */}
      <mesh ref={crossbar} castShadow>
        <boxGeometry args={[width + postThickness, postThickness, postThickness]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Kale ağları - yarı saydam beyaz */}
      <mesh ref={backNet} receiveShadow>
        <boxGeometry args={[width, height, postThickness]} />
        <meshStandardMaterial color="white" transparent opacity={0.2} wireframe />
      </mesh>
      
      <mesh ref={leftNet} receiveShadow>
        <boxGeometry args={[postThickness, height, depth]} />
        <meshStandardMaterial color="white" transparent opacity={0.2} wireframe />
      </mesh>
      
      <mesh ref={rightNet} receiveShadow>
        <boxGeometry args={[postThickness, height, depth]} />
        <meshStandardMaterial color="white" transparent opacity={0.2} wireframe />
      </mesh>
      
      <mesh ref={topNet} receiveShadow>
        <boxGeometry args={[width, postThickness, depth]} />
        <meshStandardMaterial color="white" transparent opacity={0.2} wireframe />
      </mesh>
    </group>
  );
}

// Skor paneli
function ScoreDisplay({ score, attempts }) {
  return (
    <group position={[0, 6, 0]}>
      <Text 
        position={[0, 0, 0]}
        fontSize={1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {`Skor: ${score}/${attempts}`}
      </Text>
    </group>
  );
}

// Talimatlar
function Instructions({ isDragging }) {
  return (
    <group position={[0, 4, 10]}>
      <Text
        position={[0, 0, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {isDragging ? "Bırak ve şut çek!" : "Topu tutup sürükle ve bırak"}
      </Text>
    </group>
  );
}

// Ana oyun bileşeni
export default function SoccerGame() {
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleGoal = () => {
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
      <Canvas shadows camera={{ position: [0, 5, 15], fov: 50 }}>
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
            restitution: 0.5,
          }}
        >
          <Ground />
          <Goal />
          <Ball onGoal={handleGoal} onMiss={handleMiss} />
        </Physics>
        
        <ScoreDisplay score={score} attempts={attempts} />
        <Instructions isDragging={isDragging} />
        
        <OrbitControls enableRotate={false} enablePan={false} enableZoom={false} />
      </Canvas>
      
      <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
        Topu tutup sürükleyin ve bırakarak şut çekin
      </div>
    </div>
  );
}