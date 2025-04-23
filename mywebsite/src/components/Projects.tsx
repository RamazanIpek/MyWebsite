// src/components/Projects.tsx
"use client";
import { useState, useRef } from 'react';
import Image from 'next/image';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  links: {
    demo?: string;
    github?: string;
    appStore?: string;
    playStore?: string;
  };
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  
  // Projeler listesi
  const projects: Project[] = [
    {
      id: 1,
      title: "VR Training Simulator",
      description: "Endüstriyel makine operatörleri için sanal gerçeklik eğitim simülatörü. Oculus Quest 2 ve PC VR platformları için geliştirilmiştir.",
      image: "/projects/vr-simulator.jpg", // Placeholder - gerçek bir resimle değiştirilecek
      tags: ["Unity", "C#", "VR", "Oculus SDK"],
      category: "vr",
      links: {
        demo: "https://example.com/demo"
      }
    },
    {
      id: 2,
      title: "AR Museum Guide",
      description: "Müze ziyaretçileri için artırılmış gerçeklik deneyimi. Eserler hakkında interaktif bilgiler sunar.",
      image: "/projects/ar-museum.jpg", // Placeholder
      tags: ["ARKit", "ARCore", "Unity", "Mobile"],
      category: "ar",
      links: {
        appStore: "https://apps.apple.com/example",
        playStore: "https://play.google.com/store/apps/example"
      }
    },
    {
      id: 3,
      title: "Fitness Tracker App",
      description: "Kullanıcıların fitness hedeflerini takip etmelerine ve sağlıklı alışkanlıklar geliştirmelerine yardımcı olan mobil uygulama.",
      image: "/projects/fitness-app.jpg", // Placeholder
      tags: ["React Native", "Firebase", "Mobile"],
      category: "mobile",
      links: {
        appStore: "https://apps.apple.com/example",
        playStore: "https://play.google.com/store/apps/example"
      }
    },
    {
      id: 4,
      title: "3D Portfolio Website",
      description: "Three.js kullanarak oluşturulmuş interaktif 3D web sitesi. Kullanıcılara benzersiz bir gezinme deneyimi sunar.",
      image: "/projects/3d-website.jpg", // Placeholder
      tags: ["Three.js", "React", "WebGL", "3D"],
      category: "web",
      links: {
        demo: "https://example.com",
        github: "https://github.com/username/repo"
      }
    },
    {
      id: 5,
      title: "VR Meditation Space",
      description: "Stres azaltma ve rahatlama için tasarlanmış sanal gerçeklik meditasyon uygulaması.",
      image: "/projects/vr-meditation.jpg", // Placeholder
      tags: ["Unity", "C#", "VR", "3D Audio"],
      category: "vr",
      links: {
        demo: "https://example.com/demo"
      }
    },
    {
      id: 6,
      title: "Mobile Game: Space Adventure",
      description: "Uzay temalı mobil platform oyunu. Farklı gezegenler ve zorluklar içeren eğlenceli bir macera.",
      image: "/projects/space-game.jpg", // Placeholder
      tags: ["Unity", "C#", "Mobile", "Game"],
      category: "game",
      links: {
        appStore: "https://apps.apple.com/example",
        playStore: "https://play.google.com/store/apps/example"
      }
    },
  ];

  // Filtrelenen projeleri alın
  const filteredProjects = activeCategory === "all"
    ? projects
    : projects.filter(project => project.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
        <span className="text-purple-500">Projelerim</span>
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
          onClick={() => setActiveCategory("ar")}
          className={`px-5 py-2 rounded-full transition duration-300 ${
            activeCategory === "ar"
              ? "bg-purple-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          AR
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
          onClick={() => setActiveCategory("web")}
          className={`px-5 py-2 rounded-full transition duration-300 ${
            activeCategory === "web"
              ? "bg-purple-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Web
        </button>
        <button
          onClick={() => setActiveCategory("game")}
          className={`px-5 py-2 rounded-full transition duration-300 ${
            activeCategory === "game"
              ? "bg-purple-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Oyun
        </button>
      </div>
      
      {/* Projeler Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-gray-800/40 rounded-lg overflow-hidden shadow-lg transition duration-300 hover:shadow-purple-500/20 hover:transform hover:scale-105"
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            <div className="h-48 w-full relative bg-gray-700 overflow-hidden">
              {/* Burada gerçek resimler olacaktır */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/60 to-pink-900/60">
                <div className="text-3xl">{project.tags[0][0]}{project.tags[1][0]}</div>
              </div>
              
              {/* Hover overlay */}
              {hoveredProject === project.id && (
                <div className="absolute inset-0 bg-purple-600/80 flex items-center justify-center">
                  <div className="p-4">
                    <div className="flex space-x-4 justify-center">
                      {project.links.demo && (
                        <a
                          href={project.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-purple-600 rounded-full p-2 transform transition-all hover:scale-110"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </a>
                      )}

                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-purple-600 rounded-full p-2 transform transition-all hover:scale-110"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </a>
                      )}
                      
                      {project.links.appStore && (
                        <a
                          href={project.links.appStore}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-purple-600 rounded-full p-2 transform transition-all hover:scale-110"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.286 14.996h-6.572c-.542 0-.714-.383-.714-.851v-8.29c0-.467.172-.855.714-.855h6.572c.542 0 .714.388.714.855v8.29c0 .468-.172.851-.714.851z" />
                          </svg>
                        </a>
                      )}
                      
                      {project.links.playStore && (
                        <a
                          href={project.links.playStore}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-purple-600 rounded-full p-2 transform transition-all hover:scale-110"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 3l.65 1.55L12 12 5.65 19.45 5 21l7-7-7-7zm7 7l7 7V3l-7 7z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
              <p className="text-gray-400 mb-4">{project.description}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 bg-gray-700 text-xs text-gray-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Daha Fazla Proje Görüntüle Butonu */}
      <div className="text-center mt-12">
        <button className="px-8 py-3 border border-purple-500 rounded-full text-white hover:bg-purple-500 transition duration-300">
          Tüm Projeleri Görüntüle
        </button>
      </div>
    </div>
  );
}