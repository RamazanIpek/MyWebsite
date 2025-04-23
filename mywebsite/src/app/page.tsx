// src/app/page.tsx
"use client";
import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Blog from '@/components/Blog';
import YouTube from '@/components/YouTube';
import Contact from '@/components/Contact';


// 3D oyunları dinamik olarak yükleyelim
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

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('home');
  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    skills: useRef(null),
    projects: useRef(null),
    games: useRef(null),
    blog: useRef(null),
    youtube: useRef(null),
    contact: useRef(null)
  };

  // Scroll pozisyonuna göre aktif bölümü belirleyelim
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section in sectionRefs) {
        const element = sectionRefs[section].current;
        if (!element) continue;

        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;

        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white">
      <Header activeSection={activeSection} sectionRefs={sectionRefs} />
      
      {/* Hero Section */}
      <section 
        ref={sectionRefs.home} 
        id="home" 
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      >
        <div className="z-10 text-center px-4 md:px-8 max-w-6xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Ramazan İpek
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            VR & Mobil Uygulama Geliştirici | İçerik Üreticisi
          </p>
          <button 
            onClick={() => sectionRefs.about.current.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 border border-purple-500 rounded-full text-white hover:bg-purple-500 transition duration-300"
          >
            Keşfet
          </button>
        </div>
        <div className="absolute inset-0 z-0">
          {/* Arka plan animasyonu buraya gelecek */}
        </div>
      </section>

      {/* About Section */}
      <section 
        ref={sectionRefs.about} 
        id="about" 
        className="min-h-screen py-20 px-4 md:px-8"
      >
        <About />
      </section>

      {/* Skills Section */}
      <section 
        ref={sectionRefs.skills} 
        id="skills" 
        className="min-h-screen py-20 px-4 md:px-8 bg-black/30"
      >
        <Skills />
      </section>

      {/* Projects Section */}
      <section 
        ref={sectionRefs.projects} 
        id="projects" 
        className="min-h-screen py-20 px-4 md:px-8"
      >
        <Projects />
      </section>

      {/* Interactive Games Section */}
      <section 
        ref={sectionRefs.games} 
        id="games" 
        className="py-20 px-4 md:px-8 bg-black/30"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
          İnteraktif <span className="text-purple-500">Oyunlar</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          <div className="bg-gray-900/60 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 mb-4">
              <h3 className="text-2xl font-bold text-purple-400">Hava Hokeyi</h3>
              <p className="text-gray-400">Hadi bir hava hokeyi maçı yapalım!</p>
            </div>
            <div className="h-[400px] relative">
              <AirHockeyGame />
            </div>
          </div>
          
          <div className="bg-gray-900/60 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 mb-4">
              <h3 className="text-2xl font-bold text-blue-400">Kaleye Şut</h3>
              <p className="text-gray-400">Kaleye şut çekme becerinizi test edin!</p>
            </div>
            <div className="h-[400px] relative">
              <SoccerGame />
            </div>
          </div>
          
          <div className="bg-gray-900/60 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 mb-4">
              <h3 className="text-2xl font-bold text-orange-400">Basket Atma</h3>
              <p className="text-gray-400">Ne kadar basketbolcu olduğunuzu görelim!</p>
            </div>
            <div className="h-[400px] relative">
              <BasketballGame />
            </div>
          </div>
          
          <div className="bg-gray-900/60 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 mb-4">
              <h3 className="text-2xl font-bold text-red-400">Araba Sürme</h3>
              <p className="text-gray-400">3D dünyada araba sürme deneyimi</p>
            </div>
            <div className="h-[400px] relative">
              <CarGame />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section 
        ref={sectionRefs.blog} 
        id="blog" 
        className="min-h-screen py-20 px-4 md:px-8"
      >
        <Blog />
      </section>

      {/* YouTube Section */}
      <section 
        ref={sectionRefs.youtube} 
        id="youtube" 
        className="min-h-screen py-20 px-4 md:px-8 bg-black/30"
      >
        <YouTube />
      </section>

      {/* Contact Section */}
      <section 
        ref={sectionRefs.contact} 
        id="contact" 
        className="min-h-screen py-20 px-4 md:px-8"
      >
        <Contact />
      </section>
    </div>
  );
}