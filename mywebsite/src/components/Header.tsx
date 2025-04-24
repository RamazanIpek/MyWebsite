/* ───────────────────────────────────────────── */
/*  src/components/Header.tsx                    */
/* ───────────────────────────────────────────── */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// SectionName tipini ortak types dosyasından import edelim
import type { SectionName } from "@/types";

interface HeaderProps {
  activeSection: SectionName;
  scrollToSection: (section: SectionName) => void;
}

export default function Header({ activeSection, scrollToSection }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Mobil cihaz kontrolü
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // İlk yüklemede kontrol et
    checkIfMobile();
    
    // Pencere boyutu değiştiğinde kontrol et
    window.addEventListener("resize", checkIfMobile);
    
    // Scroll kontrolü
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Navbar menü öğeleri
  const navItems: {id: SectionName; label: string}[] = [
    { id: "home", label: "Ana Sayfa" },
    { id: "about", label: "Hakkımda" },
    { id: "skills", label: "Yetenekler" },
    { id: "projects", label: "Projeler" },
    { id: "blog", label: "Blog" },
    { id: "youtube", label: "YouTube" },
    { id: "contact", label: "İletişim" },
  ];

  // Mobil menü geçiş animasyonları
  const menuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05,
        staggerDirection: 1,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900/85 backdrop-blur-md py-3 shadow-lg shadow-black/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center z-20">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
              R
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Ramazan İpek
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === item.id
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute inset-0 bg-gray-800/60 -z-10 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* CTA Button (only on desktop) */}
          <div className="hidden md:block">
            <motion.button
              onClick={() => scrollToSection("contact")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                        text-white px-5 py-2 rounded-full shadow-lg shadow-purple-900/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Bana Ulaşın
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden z-20 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            <div className="w-6 flex flex-col items-end justify-center gap-1.5">
              <motion.span
                animate={{
                  rotate: isMenuOpen ? 45 : 0,
                  y: isMenuOpen ? 8 : 0,
                  width: isMenuOpen ? "24px" : "24px",
                }}
                className="h-0.5 bg-white block"
              />
              <motion.span
                animate={{
                  opacity: isMenuOpen ? 0 : 1,
                  width: "16px",
                }}
                className="h-0.5 bg-white block"
              />
              <motion.span
                animate={{
                  rotate: isMenuOpen ? -45 : 0,
                  y: isMenuOpen ? -8 : 0,
                  width: isMenuOpen ? "24px" : "20px",
                }}
                className="h-0.5 bg-white block"
              />
            </div>
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && isMobile && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="container mx-auto px-4 py-2">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  variants={itemVariants}
                  onClick={() => {
                    scrollToSection(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left py-4 border-b border-gray-800 ${
                    activeSection === item.id
                      ? "text-white font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
              
              <motion.div
                variants={itemVariants}
                className="py-5"
              >
                <button
                  onClick={() => {
                    scrollToSection("contact");
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg"
                >
                  Bana Ulaşın
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}