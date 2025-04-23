// src/components/Skills.tsx
"use client";
import { useState, useEffect, useRef } from 'react';

interface Skill {
  name: string;
  level: number;
  category: string;
  icon: string;
}

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Scroll animasyonu için
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  // Yetenekler listesi
  const skills: Skill[] = [
    // VR Teknolojileri
    { name: "Unity", level: 90, category: "vr", icon: "🎮" },
    { name: "Unreal Engine", level: 85, category: "vr", icon: "🎲" },
    { name: "VR Interaction Design", level: 95, category: "vr", icon: "👆" },
    { name: "ARKit/ARCore", level: 80, category: "vr", icon: "📱" },
    { name: "Oculus SDK", level: 92, category: "vr", icon: "🥽" },
    
    // Mobil Teknolojiler
    { name: "Swift", level: 88, category: "mobile", icon: "🍎" },
    { name: "Kotlin", level: 85, category: "mobile", icon: "🤖" },
    { name: "React Native", level: 90, category: "mobile", icon: "⚛️" },
    { name: "Flutter", level: 82, category: "mobile", icon: "📱" },
    { name: "Firebase", level: 92, category: "mobile", icon: "🔥" },
    
    // 3D Teknolojiler
    { name: "Three.js", level: 88, category: "3d", icon: "🌐" },
    { name: "Blender", level: 75, category: "3d", icon: "🎨" },
    { name: "WebGL", level: 78, category: "3d", icon: "🖥️" },
    { name: "3D Modeling", level: 70, category: "3d", icon: "🗿" },
    { name: "Animation", level: 68, category: "3d", icon: "🎬" },
    
    // Programlama Dilleri
    { name: "C#", level: 92, category: "programming", icon: "📊" },
    { name: "JavaScript", level: 95, category: "programming", icon: "🟨" },
    { name: "TypeScript", level: 90, category: "programming", icon: "🔷" },
    { name: "Python", level: 82, category: "programming", icon: "🐍" },
    { name: "C++", level: 78, category: "programming", icon: "⚙️" },
  ];

  // Filtreleme fonksiyonu
  const filteredSkills = skills.filter(
    (skill) => activeCategory === "all" || skill.category === activeCategory
  );

  return (
    <div ref={sectionRef} className="max-w-6xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
        <span className="text-purple-500">Yeteneklerim</span>
      </h2>
      
      {/* Kategori Filtreleme */}
      <div className="flex flex-wrap justify-center mb-12 gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-5 py-2 rounded-full transition duration-300 ${
            activeCategory === "all"
              ? "bg-purple-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Tümü
        </button>
        <button
          onClick={() => setActiveCategory("vr")}
          className={`px-5 py-2 rounded-full transition duration-300 ${
            activeCategory === "vr"
              ? "bg-purple-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          VR
        </button>
        <button
          onClick={() => setActiveCategory("mobile")}
          className={`px-5 py-2 rounded-full transition duration-300 ${
            activeCategory === "mobile"
              ? "bg-purple-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Mobil
        </button>
        <button
          onClick={() => setActiveCategory("3d")}
          className={`px-5 py-2 rounded-full transition duration-300 ${
            activeCategory === "3d"
              ? "bg-purple-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          3D
        </button>
        <button
          onClick={() => setActiveCategory("programming")}
          className={`px-5 py-2 rounded-full transition duration-300 ${
            activeCategory === "programming"
              ? "bg-purple-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Programlama
        </button>
      </div>
      
      {/* Yetenekler Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill, index) => (
          <div
            key={skill.name}
            className={`bg-gray-800/50 rounded-lg p-6 transform transition-all duration-500 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">{skill.icon}</span>
              <h3 className="text-xl font-bold">{skill.name}</h3>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full"
                style={{ width: `${skill.level}%`, transition: "width 1s ease-in-out" }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Başlangıç</span>
              <span>Uzman</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* İstatistikler */}
      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/30 rounded-lg p-6 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text mb-2">
            5+
          </div>
          <div className="text-gray-400">Yıl Deneyim</div>
        </div>
        
        <div className="bg-gray-800/30 rounded-lg p-6 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text mb-2">
            25+
          </div>
          <div className="text-gray-400">Tamamlanan Proje</div>
        </div>
        
        <div className="bg-gray-800/30 rounded-lg p-6 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text mb-2">
            12+
          </div>
          <div className="text-gray-400">VR Uygulama</div>
        </div>
        
        <div className="bg-gray-800/30 rounded-lg p-6 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text mb-2">
            10+
          </div>
          <div className="text-gray-400">Mobil Uygulama</div>
        </div>
      </div>
    </div>
  );
}