// src/components/Blog.tsx
"use client";
import { useState } from 'react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image?: string;
  readTime: string;
}

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Blog yazıları
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "VR'da Kullanıcı Deneyimi Tasarımı: İpuçları ve Best Practices",
      excerpt: "Sanal gerçeklik uygulamalarında etkili kullanıcı deneyimi oluşturmak için kritik noktalar ve stratejileri ele alıyorum.",
      date: "15 Nisan 2025",
      category: "vr",
      readTime: "6 dk okuma"
    },
    {
      id: 2,
      title: "Mobil Uygulama Geliştirmede Firebase Kullanımı",
      excerpt: "Firebase'in sunduğu hizmetleri kullanarak mobil uygulamaların nasıl hızla geliştirilebileceğini anlatıyorum.",
      date: "2 Mart 2025",
      category: "mobile",
      readTime: "8 dk okuma"
    },
    {
      id: 3,
      title: "Three.js ile İnteraktif Web Deneyimleri Oluşturma",
      excerpt: "Web tarayıcılarında etkileyici 3D deneyimler oluşturmak için Three.js kütüphanesinin kullanımını inceliyorum.",
      date: "18 Şubat 2025",
      category: "web",
      readTime: "5 dk okuma"
    },
    {
      id: 4,
      title: "Unity vs Unreal: VR Geliştirme için Hangi Motor Doğru Seçim?",
      excerpt: "İki popüler oyun motorunun VR geliştirme perspektifinden karşılaştırmalı analizi.",
      date: "5 Ocak 2025",
      category: "vr",
      readTime: "10 dk okuma"
    },
    {
      id: 5,
      title: "ARKit ile iOS Uygulamalarında Artırılmış Gerçeklik",
      excerpt: "Apple'ın ARKit'ini kullanarak etkileyici AR deneyimleri oluşturmanın temelleri.",
      date: "10 Aralık 2024",
      category: "ar",
      readTime: "7 dk okuma"
    },
    {
      id: 6,
      title: "React Native ile Cross-Platform Uygulama Geliştirme",
      excerpt: "Tek kod tabanıyla hem iOS hem de Android için uygulama geliştirmenin avantajları ve zorlukları.",
      date: "25 Kasım 2024",
      category: "mobile",
      readTime: "9 dk okuma"
    }
  ];

  // Filtrelenen blog yazıları
  const filteredPosts = activeCategory === "all"
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
        <span className="text-purple-500">Blog</span>
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
      </div>
      
      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-800/40 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:translate-y-[-5px]"
          >
            {/* Blog post cover image veya renkli bir arka plan */}
            <div className="h-40 w-full relative overflow-hidden">
              <div className={`w-full h-full flex items-center justify-center bg-gradient-to-r ${
                post.category === 'vr' 
                  ? 'from-purple-900/60 to-purple-600/60' 
                  : post.category === 'ar' 
                  ? 'from-blue-900/60 to-blue-600/60'
                  : post.category === 'mobile'
                  ? 'from-green-900/60 to-green-600/60'
                  : 'from-pink-900/60 to-pink-600/60'
              }`}>
                <span className="text-4xl opacity-70">
                  {post.category === 'vr' && '🥽'}
                  {post.category === 'ar' && '📱'}
                  {post.category === 'mobile' && '📱'}
                  {post.category === 'web' && '🌐'}
                </span>
              </div>
              
              {/* Category badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  post.category === 'vr' 
                    ? 'bg-purple-500/80 text-white' 
                    : post.category === 'ar' 
                    ? 'bg-blue-500/80 text-white'
                    : post.category === 'mobile'
                    ? 'bg-green-500/80 text-white'
                    : 'bg-pink-500/80 text-white'
                }`}>
                  {post.category.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-white hover:text-purple-400 transition duration-300">
                <a href="#">{post.title}</a>
              </h3>
              
              <p className="text-gray-400 mb-4">{post.excerpt}</p>
              
              <a 
                href="#" 
                className="inline-flex items-center text-purple-400 hover:text-purple-300"
              >
                Devamını Oku
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {/* Daha Fazla Blog Yazısı Butonu */}
      <div className="text-center mt-12">
        <button className="px-8 py-3 border border-purple-500 rounded-full text-white hover:bg-purple-500 transition duration-300">
          Tüm Yazıları Görüntüle
        </button>
      </div>
    </div>
  );
}