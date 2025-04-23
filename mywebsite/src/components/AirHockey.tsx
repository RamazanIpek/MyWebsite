// src/components/games/AirHockey.tsx
"use client";
import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { OrbitControls, Text } from '@react-three/drei';

// Sınır duvarları
function Walls() {
  // Zemin
  const [floor] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0], 
    position: [0, -0.1, 0],
    userData: { name: 'floor' }
  }));
  
  // Duvarlar
  const size = [10, 0.5, 0.5]; // duvar boyutu
  const tableWidth = 5;
  const tableHeight = 7;
  
  // Üst duvar
  const [topWall] = useBox(() => ({ 
    args: [tableWidth, 0.5, 0.5], 
    position: [0, 0, -tableHeight/2], 
    userData: { name: 'wall' }
  }));
  
  // Alt duvar
  const [bottomWall] = useBox(() => ({ 
    args: [tableWidth, 0.5, 0.5], 
    position: [0, 0, tableHeight/2], 
    userData: { name: 'wall' }
  }));
  
  // Sol duvar
  const [leftWall] = useBox(() => ({ 
    args: [0.5, 0.5, tableHeight], 
    position: [-tableWidth/2, 0, 0], 
    userData: { name: 'wall' }
  }));
  
  // Sağ duvar
  const [rightWall] = useBox(() => ({ 
    args: [0.5, 0.5, tableHeight], 
    position: [tableWidth/2, 0, 0], 
    userData: { name: 'wall' }
  }));

  return (
    <>
      <mesh ref={floor} receiveShadow>
        <planeGeometry args={[tableWidth, tableHeight]} />
        <meshStandardMaterial color="#3b5998" />
      </mesh>
      
      <mesh ref={topWall} receiveShadow>
        <boxGeometry args={[tableWidth, 0.5, 0.5]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      
      <mesh ref={bottomWall} receiveShadow>
        <boxGeometry args={[tableWidth, 0.5, 0.5]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      
      <mesh ref={leftWall} receiveShadow>
        <boxGeometry args={[0.5, 0.5, tableHeight]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      
      <mesh ref={rightWall} receiveShadow>
        <boxGeometry args={[0.5, 0.5, tableHeight]} />
        <meshStandardMaterial color="#444" />
      </mesh>
    </>
  );
}

// Hava hokeyi topu
function Puck({ onScore }) {
  const [puckRef, api] = useSphere(() => ({
    mass: 1,
    position: [0, 0.2, 0],
    args: [0.3],
    linearDamping: 0.3,
    userData: { name: 'puck' }
  }));
  
  const velocity = useRef([0, 0, 0]);
  const position = useRef([0, 0, 0]);
  
  // Fizik hesaplamaları
  useEffect(() => {
    api.velocity.subscribe((v) => (velocity.current = v));
    api.position.subscribe((p) => {
      position.current = p;
      
      // Kaleler
      if (p[0] > -0.5 && p[0] < 0.5) {
        if (p[2] < -3.4) {
          // Oyuncu kalesine gol
          onScore('cpu');
          resetPuck();
        } else if (p[2] > 3.4) {
          // CPU kalesine gol
          onScore('player');
          resetPuck();
        }
      }
    });
  }, [api, onScore]);
  
  // Topu sıfırla
  const resetPuck = () => {
    api.position.set(0, 0.2, 0);
    api.velocity.set(0, 0, 0);
    api.angularVelocity.set(0, 0, 0);
  };

  return (
    <mesh ref={puckRef} castShadow receiveShadow>
      <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
      <meshStandardMaterial color="black" />
    </mesh>
  );
}

// Oyuncu vurucu
function PlayerPaddle({ position = [0, 0, 3] }) {
  const { viewport } = useThree();
  const [paddleRef, api] = useSphere(() => ({
    mass: 1,
    position,
    args: [0.5],
    type: "Kinematic",
    userData: { name: 'playerPaddle' }
  }));
  
  // Mouse takibi
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Ekran koordinatlarını [-halfWidth, halfWidth] ve [-halfHeight, halfHeight] aralığına çevir
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      
      const worldX = x * viewport.width / 2;
      const worldZ = y * viewport.height / 2;
      
      // Sınırları kontrol et
      const clampedX = Math.max(-2, Math.min(2, worldX));
      const clampedZ = Math.max(0, Math.min(3, -worldZ + 3));
      
      api.position.set(clampedX, 0.2, clampedZ);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [api, viewport]);

  return (
    <mesh ref={paddleRef} castShadow receiveShadow>
      <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />
      <meshStandardMaterial color="#ff4500" />
    </mesh>
  );
}

// CPU vurucu
function CPUPaddle({ puckPosition }) {
  const [paddleRef, api] = useSphere(() => ({
    mass: 1,
    position: [0, 0.2, -3],
    args: [0.5],
    type: "Kinematic",
    userData: { name: 'cpuPaddle' }
  }));
  
  // CPU yapay zekası
  useFrame(() => {
    if (puckPosition.current) {
      const [puckX, _, puckZ] = puckPosition.current;
      
      // Eğer top CPU yarı sahasındaysa, takip et
      if (puckZ < 0) {
        const targetX = Math.max(-2, Math.min(2, puckX));
        const targetZ = Math.max(-3, Math.min(-0.5, puckZ));
        
        // Yavaş hareket için bir easing fonksiyonu
        api.position.set(
          targetX,
          0.2,
          targetZ
        );
      } else {
        // Kaleyi korumaya çalış
        api.position.set(
          0,
          0.2,
          -3
        );
      }
    }
  });

  return (
    <mesh ref={paddleRef} castShadow receiveShadow>
      <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />
      <meshStandardMaterial color="#4169e1" />
    </mesh>
  );
}

// Kaleler
function Goals() {
  return (
    <>
      {/* Oyuncu kalesi */}
      <mesh position={[0, 0.05, 3.5]} receiveShadow>
        <boxGeometry args={[1, 0.1, 0.2]} />
        <meshStandardMaterial color="#ff4500" />
      </mesh>
      
      {/* CPU kalesi */}
      <mesh position={[0, 0.05, -3.5]} receiveShadow>
        <boxGeometry args={[1, 0.1, 0.2]} />
        <meshStandardMaterial color="#4169e1" />
      </mesh>
    </>
  );
}

// Skor paneli
function ScoreBoard({ playerScore, cpuScore }) {
  return (
    <group position={[0, 2, 0]}>
      <Text
        position={[-1, 0, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {playerScore}
      </Text>
      
      <Text
        position={[0, 0, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        -
      </Text>
      
      <Text
        position={[1, 0, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {cpuScore}
      </Text>
    </group>
  );
}

// Ana oyun bileşeni
export default function AirHockey() {
  const [playerScore, setPlayerScore] = useState(0);
  const [cpuScore, setCPUScore] = useState(0);
  const puckPositionRef = useRef([0, 0, 0]);
  
  const handleScore = (scorer) => {
    if (scorer === 'player') {
      setPlayerScore(prev => prev + 1);
    } else {
      setCPUScore(prev => prev + 1);
    }
  };

  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [0, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} castShadow />
        <pointLight position={[-10, 10, -10]} intensity={0.5} castShadow />
        
        <Physics
          gravity={[0, -9.8, 0]}
          defaultContactMaterial={{
            friction: 0.1,
            restitution: 0.7,
          }}
        >
          <Walls />
          <Goals />
          <Puck onScore={handleScore} ref={puckPositionRef} />
          <PlayerPaddle />
          <CPUPaddle puckPosition={puckPositionRef} />
        </Physics>
        
        <ScoreBoard playerScore={playerScore} cpuScore={cpuScore} />
        
        <OrbitControls enableRotate={false} enablePan={false} enableZoom={false} />
      </Canvas>
      
      <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
        Fareyi hareket ettirerek oynayın
      </div>
    </div>
  );
}