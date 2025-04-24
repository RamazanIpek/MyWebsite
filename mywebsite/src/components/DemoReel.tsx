// src/components/DemoReel.tsx
"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Oyunları dinamik olarak yükleyelim - sadece istendiğinde
const AirHockeyGame = dynamic(() => import('@/components/games/AirHockey'), { 
  ssr: false,
  loading: () => <div className="flex justify-center items-center min-h-[300px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  </div>
});

const SoccerGame = dynamic(() => import('@/components/games/Soccer'), { 
  ssr: false,
  loading: () => <div className="flex justify-center items-center min-h-[300px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
});

const BasketballGame = dynamic(() => import('@/components/games/Basketball'), { 
  ssr: false,
  loading: () => <div className="flex justify-center items-center min-h-[300px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
  </div>
});

const CarGame = dynamic(() => import('@/components/games/CarGame'), { 
  ssr: false,
  loading: () => <div className="flex justify-center items-center min-h-[300px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
  </div> 
});

// Demo Reel için oyun türlerini tanımlayalım
interface GameOption {
  id: string;
  name: string;
  description: string;
  component: React.ReactNode;
  color: string;
  icon: string;
}

export default function DemoReel() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  
  // Oyun seçenekleri
  const gameOptions: GameOption[] = [
    {
      id: 'air-hockey',
      name: 'Hava Hokeyi',
      description: 'Bilgisayara karşı hızlı reflekslerinizi test edin',
      component: <AirHockeyGame />,
      color: 'bg-gradient-to-r from-purple-600 to-indigo-600',
      icon: '🏒'
    },
    {
      id: 'soccer',
      name: 'Kaleye Şut',
      description: 'Futbol şut çekme becerinizi gösterin',
      component: <SoccerGame />,
      color: 'bg-gradient-to-r from-blue-600 to-sky-600',
      icon: '⚽'
    },
    {
      id: 'basketball',
      name: 'Basket Atma',
      description: 'Basket atma yeteneğinizi sergileyip skor yapın',
      component: <BasketballGame />,
      color: 'bg-gradient-to-r from-orange-600 to-amber-600',
      icon: '🏀'
    },
    {
      id: 'car-game',
      name: 'Araba Sürme',
      description: 'Engelli parkurda en yüksek skoru elde edin',
      component: <CarGame />,
      color: 'bg-gradient-to-r from-red-600 to-rose-600',
      icon: '🚗'
    }
  ];
  
  // Aktif oyunu al
  const currentGame = gameOptions.find(game => game.id === activeGame);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
        <span className="text-purple-500">İnteraktif </span>
        <span className="text-white">Demo Reel</span>
      </h2>
      
      {activeGame ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl overflow-hidden shadow-2xl mb-8"
        >
          <div className="relative h-[500px]">
            {currentGame?.component}
            
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={() => setActiveGame(null)}
                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gameOptions.map((game) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: gameOptions.indexOf(game) * 0.1 }}
              className={`${game.color} rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105`}
              onClick={() => setActiveGame(game.id)}
            >
              <div className="p-6 text-center">
                <span className="text-5xl block mb-4">{game.icon}</span>
                <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                <p className="text-white/80 text-sm">{game.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {!activeGame && (
        <div className="text-center mt-8 text-gray-400">
          Deneyimlemek istediğiniz oyunu seçin!
        </div>
      )}
    </div>
  );
}