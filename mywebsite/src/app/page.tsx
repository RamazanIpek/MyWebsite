/* ──────────────────────────────────────────── */
/* src/app/page.tsx                           */
/* ──────────────────────────────────────────── */
"use client";

// Gerekli tüm importlar
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  MutableRefObject,
} from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import throttle from "lodash/throttle";

/* ---------- Alt bileşenler ---------- */
import Header             from "@/components/Header";
import About              from "@/components/About";
import Skills             from "@/components/Skills";
import Projects           from "@/components/Projects";
import Blog               from "@/components/Blog";
import YouTube            from "@/components/YouTube";
import Contact            from "@/components/Contact";
import AnimatedBackground from "@/components/AnimatedBackground"; // Bu bileşenin isActive prop'unu aldığını varsayıyoruz
import FloatingGameSection from "@/components/FloatingGameSection";

/* ---------- Lazy-load mini oyunlar ---------- */
const Spinner = (c: string) => (
  <div className="flex justify-center items-center min-h-[300px] aspect-video">
    <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${c}`} />
  </div>
);
const AirHockeyGame  = dynamic(() => import("@/components/games/AirHockey"),  { ssr:false, loading:() => Spinner("border-purple-500") });
const SoccerGame     = dynamic(() => import("@/components/games/Soccer"),     { ssr:false, loading:() => Spinner("border-blue-500")   });
const BasketballGame = dynamic(() => import("@/components/games/Basketball"), { ssr:false, loading:() => Spinner("border-orange-500") });
const CarGame        = dynamic(() => import("@/components/games/CarGame"),    { ssr:false, loading:() => Spinner("border-red-500")    });

/* ---------- Tipler ---------- */
type SectionName = 'home' | 'about' | 'skills' | 'projects' | 'blog' | 'youtube' | 'contact';
type SectionRefs = { [K in SectionName]: MutableRefObject<HTMLDivElement | null> };

/* ---------- Ortak Section Bileşeni ---------- */
const Section = React.forwardRef<
  HTMLDivElement,
  { id: SectionName; className?: string; children: React.ReactNode }
>(({ id, className = "", children }, ref) => (
  <motion.section
    ref={ref} id={id}
    className={`min-h-[85vh] py-20 px-4 md:px-8 flex flex-col items-center justify-center relative overflow-hidden snap-start ${className}`}
    initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.6 }}
  >
    <div className="w-full max-w-5xl">{children}</div>
  </motion.section>
));
Section.displayName = "Section";

/* ──────────────────────────────────────────── */
/* Ana Sayfa Bileşeni                           */
/* ──────────────────────────────────────────── */
export default function HomePage() {
  /* State */
  const [activeSection, setActiveSection] = useState<SectionName>("home");
  const [isBackgroundActive, setIsBackgroundActive] = useState(true);

  /* Refs */
  const refs: SectionRefs = { home: useRef(null), about: useRef(null), skills: useRef(null), projects: useRef(null), blog: useRef(null), youtube: useRef(null), contact: useRef(null), };

  /* Aktif bölüm tespiti ve Arka Plan kontrolü */
  const handleScroll = useCallback(() => {
    const pos = window.scrollY + window.innerHeight * 0.35;
    let currentSection: SectionName = "home";
    for (const key in refs) {
        const sectionName = key as SectionName; const ref = refs[sectionName]; const el = ref.current; if (!el) continue;
        if (sectionName === 'home' && pos < el.offsetTop + el.offsetHeight * 0.5) { currentSection = 'home'; break; }
        if (pos >= el.offsetTop - window.innerHeight * 0.4 && pos < el.offsetTop + el.offsetHeight - window.innerHeight * 0.4) { currentSection = sectionName; break; }
    }
    if (currentSection === 'home' && refs.home.current && window.scrollY > refs.home.current.offsetHeight * 0.5) { currentSection = 'about'; }
    setActiveSection(currentSection);

    const homeElement = refs.home.current;
    if (homeElement) { const rect = homeElement.getBoundingClientRect(); const shouldBeActive = rect.bottom > window.innerHeight * 0.1; setIsBackgroundActive(shouldBeActive); }
    else { setIsBackgroundActive(true); }
  }, [refs]);

  const throttledScrollHandler = useMemo(() => throttle(handleScroll, 150), [handleScroll]);

  /* Scroll listener */
  useEffect(() => {
    handleScroll(); window.addEventListener("scroll", throttledScrollHandler, { passive: true });
    return () => { window.removeEventListener("scroll", throttledScrollHandler); throttledScrollHandler.cancel(); }
  }, [throttledScrollHandler, handleScroll]);

  /* Smooth scroll fonksiyonu */
  const scrollToSection = (sectionName: SectionName) => { refs[sectionName].current?.scrollIntoView({ behavior: "smooth", block: "start" }); }

  /* ───────────────────────── JSX ───────────────────────── */
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white overflow-x-hidden antialiased">
      <Header activeSection={activeSection} scrollToSection={scrollToSection} />

      {/* AnimatePresence ile Arka Plan Geçişi */}
      {/* *** DÜZELTME BURADA: AnimatedBackground sadece isBackgroundActive true ise render edilecek *** */}
      <AnimatePresence mode="wait">
        {isBackgroundActive && (
          // AnimatedBackground'un kendisi zaten bir motion.div ise
          // dış sarmalayıcıya gerek yok. Değilse, önceki gibi
          // bir motion.div ile sarmalanabilir.
          // AnimatedBackground'un 'isActive' prop'unu alıp
          // kendi animasyonlarını/render döngüsünü yönettiğini varsayıyoruz.
          <AnimatedBackground key="animated-background" isActive={isBackgroundActive} />
        )}
      </AnimatePresence>

      {/* Ana İçerik */}
      <main className="relative z-[5]">
        {/* HOME Bölümü */}
        <section ref={refs.home} id="home" className="min-h-screen h-screen flex flex-col items-center justify-center relative overflow-hidden snap-start">
          <motion.div className="z-10 text-center px-4 md:px-8 max-w-5xl" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text"> Ramazan İpek </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"> VR & Mobil Uygulama Geliştirici | İçerik Üreticisi </p>
            <motion.button onClick={() => scrollToSection("about")} className="px-8 py-3 border border-purple-500 rounded-full hover:bg-purple-500 transition-colors duration-300" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}> Keşfet </motion.button>
          </motion.div>
        </section>

        {/* ABOUT Bölümü */}
        <Section ref={refs.about} id="about"><About /></Section>

        {/* Oyun 1: Hava Hokeyi */}
        <FloatingGameSection title="Hava Hokeyi Challenge" description="Hızlı reflekslerinizi test edin..." color="purple" gameComponent={<AirHockeyGame />} align="left" placeholderImageUrl="/images/air-hockey-photo.jpg" />

        {/* SKILLS Bölümü */}
        <Section ref={refs.skills} id="skills" className="bg-black/30"> <Skills /> </Section>

        {/* Oyun 2: Futbol */}
        <FloatingGameSection title="Kaleye Şut Challenge" description="Açı ve güç kontrolüyle..." color="blue" gameComponent={<SoccerGame />} align="right" placeholderImageUrl="/images/soccer-photo.jpg" />

        {/* PROJECTS Bölümü */}
        <Section ref={refs.projects} id="projects"><Projects /></Section>

        {/* Oyun 3: Basketbol */}
        <FloatingGameSection title="Basket Atma Challenge" description="Doğru zamanlama ve isabetli atışlarla..." color="orange" gameComponent={<BasketballGame />} align="left" placeholderImageUrl="/images/basketball-photo.jpg" />

        {/* BLOG Bölümü */}
        <Section ref={refs.blog} id="blog"><Blog /></Section>

        {/* Oyun 4: Araba */}
        <FloatingGameSection title="Araba Sürme Simülasyonu" description="Engellere çarpmadan en yüksek skoru..." color="red" gameComponent={<CarGame />} align="right" placeholderImageUrl="/images/car-game-photo.jpg" />

        {/* YOUTUBE Bölümü */}
        <Section ref={refs.youtube} id="youtube" className="bg-black/30"> <YouTube /> </Section>

        {/* CONTACT Bölümü */}
        <Section ref={refs.contact} id="contact"><Contact /></Section>
      </main>
    </div>
  );
}