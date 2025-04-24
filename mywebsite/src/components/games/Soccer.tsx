"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, usePlane, useSphere, useBox } from '@react-three/cannon';
import { Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// TypeScript Interface Tanımlamaları
interface BallProps {
  position?: [number, number, number];
  onGoal: () => void;
  onMiss: () => void;
}

// Skor panel arayüzü artık kullanılmıyor

// Basitleştirilmiş oyun sabitleri
const BALL_RADIUS = 0.3; // Topu büyüttüm
const FIELD_WIDTH = 30;
const FIELD_LENGTH = 30;
const GOAL_WIDTH = 5.5;
const GOAL_HEIGHT = 2.5;
const GOAL_DEPTH = 1.5;
const POST_THICKNESS = 0.15;
const MAX_SHOT_POWER = 15;
const CAMERA_FOV = 45; // Kamera açısını düşürdüm

// Kamera başlangıç pozisyonu
const CAMERA_INITIAL_POSITION: [number, number, number] = [0, 3, 14]; // Topun arkasına yerleştirdik

// Kamera kontrolü
function CameraControl() {
  const { camera } = useThree();
  const ballPosition = useRef<[number, number, number]>([0, BALL_RADIUS, 8]);
  
  // Kamerayı topun arkasında tutmak için
  useFrame(() => {
    // Topun X pozisyonuna göre kamera X pozisyonunu ayarla
    camera.position.x = ballPosition.current[0];
    // Kameranın topun arkasında kalmasını sağla
    camera.lookAt(0, BALL_RADIUS, 0);
  });
  
  return null;
}

// Futbol sahası
function Field() {
  const [fieldRef] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0], 
    position: [0, 0, 0], 
    userData: { id: 'field' }
  }));
  
  return (
    <group>
      {/* Ana saha */}
      <mesh ref={fieldRef} receiveShadow>
        <planeGeometry args={[FIELD_WIDTH, FIELD_LENGTH]} />
        <meshStandardMaterial color="#2d801f" />
      </mesh>
      
      {/* Saha çizgileri - basitleştirildi */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8, 8.1, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

// Futbol topu
function Ball({ position = [0, BALL_RADIUS, 8], onGoal, onMiss }: BallProps) {
  const [ballRef, api] = useSphere(() => ({
    mass: 1,
    position,
    args: [BALL_RADIUS],
    userData: { id: 'ball' },
    material: { restitution: 0.8, friction: 0.5 },
    onCollide: (e) => {
      // Topun kaleye çarpmasını kontrol et
      const targetBody = e.body;
      
      if (targetBody && !shotProcessed.current) {
        const userData = targetBody.userData;
        
        if (userData && userData.id === 'goalnet') {
          // Gol!
          shotProcessed.current = true;
          onGoal();
          // Topun tekrar atılmasına gerek yok - tek atış
        } 
        else if (userData && userData.id === 'field' && ballInMotion.current) {
          // Top sahaya değdiyse
          if (!groundHitProcessed.current) {
            groundHitProcessed.current = true;
            
            setTimeout(() => {
              api.velocity.subscribe((v) => {
                // Top durduğunda işlem yap
                if (Math.abs(v[0]) < 0.1 && Math.abs(v[1]) < 0.1 && Math.abs(v[2]) < 0.1) {
                  if (!shotProcessed.current) {
                    shotProcessed.current = true;
                    onMiss();
                    // Topun tekrar atılmasına gerek yok - tek atış
                  }
                }
              });
            }, 500);
          }
        }
      }
    }
  }));
  
  // Referanslar
  const ballPosition = useRef<[number, number, number]>([0, 0, 0]);
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<[number, number, number]>([0, 0, 0]);
  const dragForce = useRef<[number, number, number]>([0, 0, 0]);
  const ballInMotion = useRef(false);
  const shotProcessed = useRef(false);
  const groundHitProcessed = useRef(false);
  
  const { viewport } = useThree();
  
  // Top pozisyonu dinleme
  useEffect(() => {
    const unsubscribe = api.position.subscribe((p) => {
      ballPosition.current = [p[0], p[1], p[2]];
    });
    return unsubscribe;
  }, [api]);
  
  // Topu daha görünür yapma
  const ballMaterial = new THREE.MeshStandardMaterial({
    color: 'white',
    emissive: 'white',
    emissiveIntensity: 0.2,
    metalness: 0.1,
    roughness: 0.2,
  });
  
  // Topu sıfırla fonksiyonu - tek atış için kaldırıldı
  // Bu fonksiyon artık kullanılmıyor çünkü tek atıştan sonra yeniden atılmayacak
  
  // Mouse eventleri
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!ballInMotion.current && ballPosition.current[2] > 2) {
        isDragging.current = true;
        dragStart.current = [e.clientX, e.clientY, 0];
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const dragEnd: [number, number, number] = [e.clientX, e.clientY, 0];
        const dragVector: [number, number, number] = [
          (dragStart.current[0] - dragEnd[0]),
          0,
          (dragStart.current[1] - dragEnd[1])
        ];
        
        // Şut yönünü ve gücünü hesapla
        const distance = Math.sqrt(dragVector[0] ** 2 + dragVector[2] ** 2);
        
        // Şut vektörünü güncelle
        const normalizedVectorX = dragVector[0] / (distance || 1);
        const normalizedVectorZ = dragVector[2] / (distance || 1);
        
        const forceFactor = Math.min(distance / 15, MAX_SHOT_POWER);
        
        dragForce.current = [
          normalizedVectorX * forceFactor,
          Math.min(forceFactor * 0.5, 10),  // Yukarı kuvvet
          normalizedVectorZ * forceFactor
        ];
      }
    };
    
    const handleMouseUp = (_e: MouseEvent) => {
      if (isDragging.current) {
        isDragging.current = false;
        
        // Şut at
        if (Math.abs(dragForce.current[0]) > 0.5 || Math.abs(dragForce.current[2]) > 0.5) {
          api.velocity.set(
            dragForce.current[0], 
            dragForce.current[1], 
            dragForce.current[2]
          );
          
          ballInMotion.current = true;
        }
      }
    };
    
    // Dokunmatik olayları
    const handleTouchStart = (e: TouchEvent) => {
      if (!ballInMotion.current && ballPosition.current[2] > 2) {
        isDragging.current = true;
        dragStart.current = [e.touches[0].clientX, e.touches[0].clientY, 0];
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.current) {
        const dragEnd: [number, number, number] = [e.touches[0].clientX, e.touches[0].clientY, 0];
        const dragVector: [number, number, number] = [
          (dragStart.current[0] - dragEnd[0]),
          0,
          (dragStart.current[1] - dragEnd[1])
        ];
        
        // Şut yönünü ve gücünü hesapla
        const distance = Math.sqrt(dragVector[0] ** 2 + dragVector[2] ** 2);
        
        // Şut vektörünü güncelle
        const normalizedVectorX = dragVector[0] / (distance || 1);
        const normalizedVectorZ = dragVector[2] / (distance || 1);
        
        const forceFactor = Math.min(distance / 10, MAX_SHOT_POWER);
        
        dragForce.current = [
          normalizedVectorX * forceFactor,
          Math.min(forceFactor * 0.5, 10),  // Yukarı kuvvet
          normalizedVectorZ * forceFactor
        ];
        
        // Dokunmatik olaylarda sayfanın kaymasını engelle
        e.preventDefault();
      }
    };
    
    const handleTouchEnd = (_e: TouchEvent) => {
      if (isDragging.current) {
        isDragging.current = false;
        
        // Şut at
        if (Math.abs(dragForce.current[0]) > 0.5 || Math.abs(dragForce.current[2]) > 0.5) {
          api.velocity.set(
            dragForce.current[0], 
            dragForce.current[1], 
            dragForce.current[2]
          );
          
          ballInMotion.current = true;
        }
      }
    };
    
    // Olay dinleyicilerini ekle
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      // Olay dinleyicilerini kaldır
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [api, viewport]);

  // Top rotasyonu
  useFrame(() => {
    if (ballRef.current && ballInMotion.current) {
      api.angularVelocity.subscribe((v) => {
        if (ballRef.current) {
          ballRef.current.rotation.x += v[0] * 0.01;
          ballRef.current.rotation.y += v[1] * 0.01;
          ballRef.current.rotation.z += v[2] * 0.01;
        }
      });
    }
  });

  return (
    <group>
      <mesh ref={ballRef} castShadow>
        {/* Topu büyüttüm ve desenini belirginleştirdim */}
        <sphereGeometry args={[BALL_RADIUS, 32, 32]} />
        <primitive object={ballMaterial} attach="material" />
        
        {/* Futbol topu deseni - belirginleştirildi ve kontrastı arttırıldı */}
        <group>
          <mesh>
            <torusGeometry args={[BALL_RADIUS, 0.07, 16, 32]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[BALL_RADIUS, 0.07, 16, 32]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[BALL_RADIUS, 0.07, 16, 32]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </group>
      </mesh>
      
      {/* Şut çizgisi göstergesi */}
      {isDragging.current && (
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.1, 0.05, 10]} />
          <meshStandardMaterial color="red" />
        </mesh>
      )}
    </group>
  );
}

// Futbol kalesi
function Goal() {
  // Kale direkleri
  const [leftPost] = useBox(() => ({
    args: [POST_THICKNESS, GOAL_HEIGHT, POST_THICKNESS],
    position: [-GOAL_WIDTH/2, GOAL_HEIGHT/2, 0],
    type: 'Static',
    userData: { id: 'goalpost' }
  }));
  
  const [rightPost] = useBox(() => ({
    args: [POST_THICKNESS, GOAL_HEIGHT, POST_THICKNESS],
    position: [GOAL_WIDTH/2, GOAL_HEIGHT/2, 0],
    type: 'Static',
    userData: { id: 'goalpost' }
  }));
  
  const [crossbar] = useBox(() => ({
    args: [GOAL_WIDTH + POST_THICKNESS, POST_THICKNESS, POST_THICKNESS],
    position: [0, GOAL_HEIGHT, 0],
    type: 'Static',
    userData: { id: 'goalpost' }
  }));
  
  // Kale ağı - fizik gövdeleri
  const [backNet] = useBox(() => ({
    args: [GOAL_WIDTH, GOAL_HEIGHT, POST_THICKNESS],
    position: [0, GOAL_HEIGHT/2, -GOAL_DEPTH],
    type: 'Static',
    userData: { id: 'goalnet' }
  }));
  
  const [leftNet] = useBox(() => ({
    args: [POST_THICKNESS, GOAL_HEIGHT, GOAL_DEPTH],
    position: [-GOAL_WIDTH/2, GOAL_HEIGHT/2, -GOAL_DEPTH/2],
    type: 'Static',
    userData: { id: 'goalnet' }
  }));
  
  const [rightNet] = useBox(() => ({
    args: [POST_THICKNESS, GOAL_HEIGHT, GOAL_DEPTH],
    position: [GOAL_WIDTH/2, GOAL_HEIGHT/2, -GOAL_DEPTH/2],
    type: 'Static',
    userData: { id: 'goalnet' }
  }));
  
  const [topNet] = useBox(() => ({
    args: [GOAL_WIDTH, POST_THICKNESS, GOAL_DEPTH],
    position: [0, GOAL_HEIGHT, -GOAL_DEPTH/2],
    type: 'Static',
    userData: { id: 'goalnet' }
  }));

  return (
    <group position={[0, 0, 0]}>
      {/* Kale direkleri */}
      <mesh ref={leftPost} castShadow>
        <boxGeometry args={[POST_THICKNESS, GOAL_HEIGHT, POST_THICKNESS]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      <mesh ref={rightPost} castShadow>
        <boxGeometry args={[POST_THICKNESS, GOAL_HEIGHT, POST_THICKNESS]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      <mesh ref={crossbar} castShadow>
        <boxGeometry args={[GOAL_WIDTH + POST_THICKNESS, POST_THICKNESS, POST_THICKNESS]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Ağlar - görsel meshler */}
      <mesh position={[0, GOAL_HEIGHT/2, -GOAL_DEPTH]} receiveShadow>
        <planeGeometry args={[GOAL_WIDTH, GOAL_HEIGHT]} />
        <meshStandardMaterial color="white" transparent opacity={0.3} wireframe side={THREE.DoubleSide} />
      </mesh>
      
      <mesh position={[-GOAL_WIDTH/2, GOAL_HEIGHT/2, -GOAL_DEPTH/2]} rotation={[0, Math.PI/2, 0]} receiveShadow>
        <planeGeometry args={[GOAL_DEPTH, GOAL_HEIGHT]} />
        <meshStandardMaterial color="white" transparent opacity={0.3} wireframe side={THREE.DoubleSide} />
      </mesh>
      
      <mesh position={[GOAL_WIDTH/2, GOAL_HEIGHT/2, -GOAL_DEPTH/2]} rotation={[0, Math.PI/2, 0]} receiveShadow>
        <planeGeometry args={[GOAL_DEPTH, GOAL_HEIGHT]} />
        <meshStandardMaterial color="white" transparent opacity={0.3} wireframe side={THREE.DoubleSide} />
      </mesh>
      
      <mesh position={[0, GOAL_HEIGHT, -GOAL_DEPTH/2]} rotation={[Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[GOAL_WIDTH, GOAL_DEPTH]} />
        <meshStandardMaterial color="white" transparent opacity={0.3} wireframe side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Basitleştirilmiş kaleci
function Goalkeeper() {
  const [position, setPosition] = useState<[number, number, number]>([0, 1.1, 0.3]);
  const [targetPosition, setTargetPosition] = useState<number>(0);
  const speed = 0.05;
  
  // Kalecinin pozisyonunu rastgele değiştir
  useEffect(() => {
    const interval = setInterval(() => {
      const newX = (Math.random() * 3) - 1.5;
      setTargetPosition(newX);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Kalecinin hareketi
  useFrame(() => {
    const newX = position[0] + (targetPosition - position[0]) * speed;
    setPosition([newX, position[1], position[2]]);
  });
  
  return (
    <group position={position}>
      {/* Kaleci vücudu - daha belirgin renk */}
      <mesh castShadow>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
        <meshStandardMaterial color="red" />
      </mesh>
      
      {/* Kafa */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
    </group>
  );
}

// Skor paneli - artık kullanılmıyor, tek atış için basitleştirildi

// Ana oyun bileşeni
export default function SoccerGame() {
  const [score, setScore] = useState<number>(0);
  const [hasTakenShot, setHasTakenShot] = useState<boolean>(false);
  
  const handleGoal = useCallback(() => {
    if (!hasTakenShot) {
      setScore(1);
      setHasTakenShot(true);
    }
  }, [hasTakenShot]);
  
  const handleMiss = useCallback(() => {
    if (!hasTakenShot) {
      setScore(0);
      setHasTakenShot(true);
    }
  }, [hasTakenShot]);

  return (
    <div className="w-full h-full relative" style={{ touchAction: 'none', overflow: 'hidden' }}>
      <Canvas shadows style={{ width: '100%', height: '100%', background: '#87CEEB' }}>
        {/* Arkaplan rengi değiştirildi - gökyüzü mavi */}
        
        {/* Kamera, topun arkasına yerleştirildi ve sabit pozisyonda */}
        <PerspectiveCamera makeDefault position={CAMERA_INITIAL_POSITION} fov={CAMERA_FOV} near={0.1} far={1000} />
        
        <ambientLight intensity={0.8} /> {/* Işık daha da artırıldı */}
        <directionalLight
          position={[8, 12, 8]}
          intensity={1.4} /* Işık artırıldı */
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
        />
        
        {/* Top için ek ışık - topun daha iyi görünmesi için */}
        <pointLight position={[0, 3, 10]} intensity={0.8} distance={20} />
        
        {/* Kamera kontrolü */}
        <CameraControl />
        
        <Physics
          gravity={[0, -9.8, 0]}
          defaultContactMaterial={{
            friction: 0.2,
            restitution: 0.7,
          }}
        >
          <Field />
          <Goal />
          <Goalkeeper />
          <Ball 
            onGoal={handleGoal} 
            onMiss={handleMiss} 
          />
        </Physics>
        
        {hasTakenShot && (
          <Html
            position={[0, 5, 0]}
            center
            style={{
              width: '300px',
              background: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '6px',
              padding: '10px',
              color: 'white',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center'
            }}
          >
            <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
              {score === 1 ? "Sağlam bileklerin var!" : "Tek hakkın var!"}
            </h2>
            <h2 
              style={{
                background: '#4CAF50',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: '16px',
                margin: '4px 2px',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
              >
              Siteye Devam Et
            </h2>
          </Html>
        )}
      </Canvas>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white text-sm bg-black/70 p-2 rounded-md">
        <p>Topu sürükle ve bırak</p>
      </div>
      
      {/* Top konumunu belirten yardımcı metin */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center text-white text-sm bg-black/70 p-2 rounded-md">
        <p>Top sahanın ortasındadır (mavi zeminde beyaz)</p>
      </div>
    </div>
  );
}