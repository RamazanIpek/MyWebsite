// src/components/YouTube.tsx
"use client";
import { useState, useRef, useEffect } from 'react';

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
  views: string;
  category: string;
  duration: string;
}

export default function YouTube() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Scroll animasyonu için
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && isPlaying) {
          setIsPlaying(false);
          setCurrentVideo(null);
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isPlaying]);
  
  // Video listesi
  const videos: VideoItem[] = [
    {
      id: "video1",
      title: "Unity ile VR Uygulama Geliştirme - Başlangıç Eğitimi",
      thumbnail: "/videos/vr-tutorial-thumbnail.jpg", // Placeholder
      date: "15 Nisan 2025",
      views: "45K görüntülenme",
      category: "vr",
      duration: "18:42"
    },
    {
      id: "video2",
      title: "React Native ile Mobil Uygulama Nasıl Yapılır?",
      thumbnail: "/videos/react-native-thumbnail.jpg", // Placeholder
      date: "2 Mart 2025",
      views: "32K görüntülenme",
      category: "mobile",
      duration: "22:15"
    },
    {
      id: "video3",
      title: "Three.js ile Web'de 3D Modeller Oluşturma",
      thumbnail: "/videos/threejs-thumbnail.jpg", // Placeholder
      date: "18 Şubat 2025",
      views: "28K görüntülenme",
      category: "web",
      duration: "15:30"
    },
    {
      id: "video4",
      title: "VR/AR Endüstrisinde Kariyer Fırsatları",
      thumbnail: "/videos/vr-career-thumbnail.jpg", // Placeholder
      date: "5 Ocak 2025",
      views: "38K görüntülenme",
      category: "vr",
      duration: "25:18"
    },
    {
      id: "video5",
      title: "ARKit ile İlk AR Uygulamanızı Geliştirin",
      thumbnail: "/videos/arkit-thumbnail.jpg", // Placeholder
      date: "10 Aralık 2024",
      views: "19K görüntülenme",
      category: "ar",
      duration: "20:45"
    },
    {
      id: "video6",
      title: "Unity vs Unreal Engine: Hangi Oyun Motoru Sizin İçin Doğru?",
      thumbnail: "/videos/unity-unreal-thumbnail.jpg", // Placeholder
      date: "25 Kasım 2024",
      views: "52K görüntülenme",
      category: "game",
      duration: "30:22"
    },
  ];

  // Filtrelenen videolar
  const filteredVideos = activeCategory === "all"
    ? videos
    : videos.filter(video => video.category === activeCategory);

  const playVideo = (videoId: string) => {
    setCurrentVideo(videoId);
    setIsPlaying(true);
  };

  return (
    <div ref={sectionRef} className="max-w-6xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
        <span className="text-purple-500">YouTube</span>
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
      
      {/* Video Player */}
      {isPlaying && currentVideo && (
        <div className="mb-12 bg-black rounded-lg overflow-hidden shadow-lg">
          <div className="relative pb-[56.25%] h-0">
            <iframe
              ref={videoRef}
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${currentVideo}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      
      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-gray-800/40 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/20 transition duration-300 cursor-pointer"
            onClick={() => playVideo(video.id)}
          >
            {/* Video Thumbnail */}
            <div className="relative">
              {/* Placeholder thumbnail background */}
              <div className={`aspect-video w-full relative overflow-hidden bg-gradient-to-r ${
                video.category === 'vr' 
                  ? 'from-purple-900 to-indigo-800' 
                  : video.category === 'ar' 
                  ? 'from-blue-900 to-sky-800'
                  : video.category === 'mobile'
                  ? 'from-green-900 to-emerald-800'
                  : video.category === 'web'
                  ? 'from-pink-900 to-rose-800'
                  : 'from-yellow-900 to-amber-800'
              }`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <span className="text-4xl mb-2">
                      {video.category === 'vr' && '🥽'}
                      {video.category === 'ar' && '📱'}
                      {video.category === 'mobile' && '📱'}
                      {video.category === 'web' && '🌐'}
                      {video.category === 'game' && '🎮'}
                    </span>
                    <div className="text-white/70 text-sm">{video.category.toUpperCase()} VİDEO</div>
                  </div>
                </div>
              </div>
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-purple-600/80 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              
              {/* Duration badge */}
              <div className="absolute bottom-4 right-4 bg-black/70 px-2 py-1 rounded text-white text-xs">
                {video.duration}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-white">{video.title}</h3>
              <div className="flex justify-between text-sm text-gray-400">
                <span>{video.date}</span>
                <span>{video.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Kanal Bağlantı Butonu */}
      <div className="text-center mt-12">
        <a 
          href="https://www.youtube.com/channel/YourChannelID" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
          </svg>
          YouTube Kanalıma Abone Ol
        </a>
      </div>
    </div>
  );
}