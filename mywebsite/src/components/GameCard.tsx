// src/components/GameCard.tsx
import { useState, ReactNode } from 'react';

interface GameCardProps {
  title: string;
  description: string;
  color: 'purple' | 'blue' | 'orange' | 'red' | 'green';
  gameComponent: ReactNode;
}

export default function GameCard({ title, description, color, gameComponent }: GameCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const getColorClasses = () => {
    switch (color) {
      case 'purple':
        return {
          main: 'from-purple-600 to-indigo-600',
          button: 'bg-purple-600 hover:bg-purple-700',
          border: 'border-purple-400',
          text: 'text-purple-300'
        };
      case 'blue':
        return {
          main: 'from-blue-600 to-cyan-600',
          button: 'bg-blue-600 hover:bg-blue-700',
          border: 'border-blue-400',
          text: 'text-blue-300'
        };
      case 'orange':
        return {
          main: 'from-orange-600 to-amber-600',
          button: 'bg-orange-600 hover:bg-orange-700',
          border: 'border-orange-400',
          text: 'text-orange-300'
        };
      case 'red':
        return {
          main: 'from-red-600 to-rose-600',
          button: 'bg-red-600 hover:bg-red-700',
          border: 'border-red-400',
          text: 'text-red-300'
        };
      case 'green':
        return {
          main: 'from-green-600 to-emerald-600',
          button: 'bg-green-600 hover:bg-green-700',
          border: 'border-green-400',
          text: 'text-green-300'
        };
      default:
        return {
          main: 'from-purple-600 to-indigo-600',
          button: 'bg-purple-600 hover:bg-purple-700',
          border: 'border-purple-400',
          text: 'text-purple-300'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-2xl ${!isPlaying ? 'cursor-pointer' : ''}`}>
      {!isPlaying ? (
        <div 
          className={`bg-gradient-to-br ${colorClasses.main} p-8 text-center`}
          onClick={() => setIsPlaying(true)}
        >
          <div className="mb-6">
            <span className="inline-block text-6xl mb-4">
              {color === 'purple' && '🏒'}
              {color === 'blue' && '⚽'}
              {color === 'orange' && '🏀'}
              {color === 'red' && '🚗'}
              {color === 'green' && '🎮'}
            </span>
            <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
            <p className="text-white/80 mb-6">{description}</p>
          </div>
          <button 
            className={`px-6 py-3 rounded-full text-white font-medium ${colorClasses.button} transform transition hover:scale-105`}
          >
            Oyna!
          </button>
          <div className="mt-4 text-sm text-white/60">
            Bu oyunu oynamak için tıklayın
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="h-[500px] relative">
            {gameComponent}
          </div>
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={() => setIsPlaying(false)}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4`}>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
        </div>
      )}
    </div>
  );
}