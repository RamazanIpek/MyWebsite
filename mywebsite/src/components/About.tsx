// src/components/About.tsx
"use client";
import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function About() {
  // 3D model için ref
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
        <span className="text-purple-500">Hakkımda</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative">
          <div className="aspect-square w-full max-w-md mx-auto relative overflow-hidden rounded-xl">
            {/* Profile Avatar Placeholder - Gerçek fotoğrafınızla değiştirilebilir */}
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 relative overflow-hidden">
              <div 
                className="absolute inset-0 flex items-center justify-center text-white text-8xl font-bold"
                style={{ fontFamily: 'monospace' }}
              >
                RI
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-6 -right-6 bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-purple-500/20">
            <p className="text-sm font-mono text-purple-400">
              const developer = {"{"}
              <br />
              &nbsp;&nbsp;name: "Ramazan İpek",
              <br />
              &nbsp;&nbsp;skills: ["VR", "Mobil", "3D"],
              <br />
              &nbsp;&nbsp;passion: "Creating experiences"
              <br />
              {"}"}
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold mb-4 text-purple-400">Merhaba, Ben Ramazan!</h3>
          <p className="text-gray-300 mb-6">
            Ben bir VR ve mobil uygulama geliştiricisiyim. Kullanıcıları etkileyen ve
            hayatlarına değer katan dijital deneyimler yaratmaktan keyif alıyorum.
            Yaratıcı çözümler geliştirmek ve teknolojinin sınırlarını zorlamak benim tutkum.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <span className="text-purple-500 mr-2">▹</span>
              <p className="text-gray-300">
                <strong>VR Deneyimi:</strong> Sanal gerçeklik uygulamaları geliştirmede uzmanlaştım, kullanıcıları başka dünyalara taşıyan immersive deneyimler tasarlıyorum.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-purple-500 mr-2">▹</span>
              <p className="text-gray-300">
                <strong>Mobil Uygulamalar:</strong> iOS ve Android platformları için yenilikçi ve kullanıcı dostu uygulamalar geliştiriyorum.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-purple-500 mr-2">▹</span>
              <p className="text-gray-300">
                <strong>İçerik Üretimi:</strong> YouTube kanalım ve blog yazılarım aracılığıyla bilgi ve deneyimlerimi paylaşmayı seviyorum.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300">
              Özgeçmiş
            </button>
            <button className="px-6 py-2 border border-purple-500 text-white rounded-full hover:bg-purple-500/20 transition duration-300">
              İletişime Geç
            </button>
          </div>
        </div>
      </div>
      
      {/* Timeline / Experience */}
      <div className="mt-24">
        <h3 className="text-2xl font-bold mb-8 text-center">Deneyimlerim</h3>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-0 md:left-1/2 h-full w-px bg-gradient-to-b from-purple-500/30 via-purple-500 to-purple-500/30 transform md:-translate-x-1/2"></div>
          
          {/* Timeline Items */}
          <div className="space-y-12">
            {/* Experience 1 */}
            <div className="relative pl-8 md:pl-0 md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="md:text-right md:pr-10">
                <div className="hidden md:block absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/4">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                </div>
                <span className="text-gray-400">2023 - Şimdi</span>
                <h4 className="text-xl font-bold text-white">Kıdemli VR Geliştirici</h4>
                <p className="text-purple-400">XYZ Teknoloji</p>
              </div>
              <div className="mt-2 md:mt-0 md:pl-10">
                <div className="md:hidden absolute left-0 top-0">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                </div>
                <p className="text-gray-300">
                  Endüstriyel eğitim ve simülasyon VR uygulamaları geliştirdim.
                  Unity ve Unreal Engine kullanarak yenilikçi sanal gerçeklik deneyimleri tasarladım.
                </p>
              </div>
            </div>
            
            {/* Experience 2 */}
            <div className="relative pl-8 md:pl-0 md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="md:text-right md:pr-10">
                <div className="hidden md:block absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/4">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                </div>
                <span className="text-gray-400">2020 - 2023</span>
                <h4 className="text-xl font-bold text-white">Mobil Uygulama Geliştiricisi</h4>
                <p className="text-purple-400">ABC Yazılım</p>
              </div>
              <div className="mt-2 md:mt-0 md:pl-10">
                <div className="md:hidden absolute left-0 top-0">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                </div>
                <p className="text-gray-300">
                  iOS ve Android platformları için yenilikçi mobil uygulamalar geliştirdim.
                  Kullanıcı deneyimi odaklı çözümler sunarak şirketin mobil stratejisine önemli katkılar sağladım.
                </p>
              </div>
            </div>
            
            {/* Experience 3 */}
            <div className="relative pl-8 md:pl-0 md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="md:text-right md:pr-10">
                <div className="hidden md:block absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/4">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                </div>
                <span className="text-gray-400">2018 - 2020</span>
                <h4 className="text-xl font-bold text-white">Yazılım Geliştirici</h4>
                <p className="text-purple-400">Tech Solutions</p>
              </div>
              <div className="mt-2 md:mt-0 md:pl-10">
                <div className="md:hidden absolute left-0 top-0">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                </div>
                <p className="text-gray-300">
                  Kariyerimin başlangıcında FullStack web geliştirme ve oyun geliştirme projelerinde
                  yer aldım. Bu, bana dijital deneyimler yaratmada geniş bir perspektif kazandırdı.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}