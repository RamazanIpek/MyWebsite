// src/components/FloatingGameSection.tsx
"use client";
import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import GameBackground from './GameBackground';

interface FloatingGameSectionProps {
  title: string;
  description: string;
  color: 'purple' | 'blue' | 'orange' | 'red';
  gameComponent: ReactNode;
  align?: 'left' | 'right';
  placeholderImageUrl?: string;
}

export default function FloatingGameSection({
  title,
  description,
  color,
  gameComponent,
  align = 'left',
  placeholderImageUrl
}: FloatingGameSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Renk temaları
   const colorThemes = {
    purple: { bg: 'from-purple-900/50 to-indigo-900/50', button: 'bg-purple-600 hover:bg-purple-700', text: 'text-purple-300', border: 'border-purple-500/50' },
    blue: { bg: 'from-blue-900/50 to-cyan-900/50', button: 'bg-blue-600 hover:bg-blue-700', text: 'text-blue-300', border: 'border-blue-500/50' },
    orange: { bg: 'from-orange-900/50 to-amber-900/50', button: 'bg-orange-600 hover:bg-orange-700', text: 'text-orange-300', border: 'border-orange-500/50' },
    red: { bg: 'from-red-900/50 to-rose-900/50', button: 'bg-red-600 hover:bg-red-700', text: 'text-red-300', border: 'border-red-500/50' }
   };
  const theme = colorThemes[color] || colorThemes.purple;

  // Animasyon varyantları
  const contentVariants = { /* ... önceki gibi ... */ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } }, exit: { opacity: 0, transition: { duration: 0.3 } } };
  const sectionVariants = { /* ... önceki gibi ... */ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1 } } };

  return (
    <motion.div
      id={`floating-game-${color}`}
      className="relative overflow-hidden py-24 px-4 md:px-8 min-h-[70vh] flex items-center"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Arka plan */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <GameBackground color={color} />
      </div>

      {/* İçerik Alanı */}
      <div className="w-full max-w-7xl mx-auto relative z-10">
         {/* Flex container (align-items-start yapıldı) */}
        <div className={`flex flex-col ${align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-start gap-10 md:gap-16`}> {/* items-start olarak değiştirildi */}

          {/* Sol Taraf: Metin ve Resim */}
           {/* items-center veya items-start hizalaması burada ayarlanabilir */}
          <div className="md:w-2/5 flex flex-col items-center md:items-start">
             {/* Placeholder Resmi (varsa) */}
             {placeholderImageUrl && (
               // Resim container'ı: aspect-square kaldırıldı, h-96 eklendi
               <div className={`relative w-full max-w-sm md:max-w-none h-96 rounded-lg overflow-hidden shadow-lg border ${theme.border} mb-8`}>
                 <Image
                   src={placeholderImageUrl}
                   alt={`${title} - İlgili Fotoğraf`}
                   fill
                   // object-cover yerine object-contain kullanıldı
                   className="object-contain"
                   sizes="(max-width: 768px) 80vw, 30vw"
                 />
               </div>
             )}

             {/* Metin Alanı */}
            <div className="text-center md:text-left w-full"> {/* w-full eklendi */}
                <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme.text}`}>
                {title}
                </h2>
                <p className="text-gray-300 text-lg mb-6">
                {description}
                </p>
                {/* ------ "Hemen Oyna!" Butonu Kaldırıldı ------ */}
            </div>
          </div>

          {/* Sağ Taraf: Oyun Alanı */}
          {/* self-stretch ile yüksekliği sol tarafa uydurmaya çalışabilir veya sabit min-height kalabilir */}
          <div className="w-full md:w-3/5 self-stretch">
            <div className={`relative overflow-hidden rounded-xl shadow-2xl bg-gradient-to-br ${theme.bg} w-full h-full min-h-[450px] md:min-h-[550px]`}> {/* Yükseklik biraz artırıldı */}
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  // Oyun Görünümü
                  <motion.div
                    key="game"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute inset-0"
                  >
                    {gameComponent}
                    <button onClick={() => setIsPlaying(false)} /* ... Kapat Butonu ... */ >
                       <svg /* ... */ />
                    </button>
                  </motion.div>
                ) : (
                  // Oyun Başlamadan Önceki Görünüm
                  <motion.div
                    key="pre-play"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    // Artık sadece oyun alanı üzerine tıklanınca oyun başlar
                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group bg-black/30 hover:bg-black/50 transition-colors"
                    onClick={() => setIsPlaying(true)}
                  >
                    <motion.div initial={{scale:0.8, opacity: 0.7}} whileHover={{scale:1, opacity: 1}}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white/70 group-hover:text-white/90 transition-colors" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /> </svg>
                    </motion.div>
                    <p className="mt-4 text-white/80 group-hover:text-white transition-colors">Oyunu Başlat</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}