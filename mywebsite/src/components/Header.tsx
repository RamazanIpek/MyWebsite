// src/components/Header.tsx
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HeaderProps {
  activeSection: string;
  sectionRefs: {
    [key: string]: React.RefObject<HTMLElement>;
  };
}

export default function Header({ activeSection, sectionRefs }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navbar'ın scroll'a göre stilini değiştirelim
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bölümlere smooth scroll için
  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    sectionRefs[sectionId].current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-lg py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <a 
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}
          className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text"
        >
          Ramazan İpek
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {[
              { id: 'about', label: 'Hakkımda' },
              { id: 'skills', label: 'Yetenekler' },
              { id: 'projects', label: 'Projeler' },
              { id: 'games', label: 'Oyunlar' },
              { id: 'blog', label: 'Blog' },
              { id: 'youtube', label: 'YouTube' },
              { id: 'contact', label: 'İletişim' },
            ].map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={`${
                    activeSection === item.id
                      ? 'text-purple-400 font-medium'
                      : 'text-gray-300 hover:text-white'
                  } transition-colors duration-300`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-gray-900/95 backdrop-blur-lg">
          <ul className="py-4 px-4">
            {[
              { id: 'about', label: 'Hakkımda' },
              { id: 'skills', label: 'Yetenekler' },
              { id: 'projects', label: 'Projeler' },
              { id: 'games', label: 'Oyunlar' },
              { id: 'blog', label: 'Blog' },
              { id: 'youtube', label: 'YouTube' },
              { id: 'contact', label: 'İletişim' },
            ].map((item) => (
              <li key={item.id} className="mb-4">
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={`block py-2 ${
                    activeSection === item.id
                      ? 'text-purple-400 font-medium'
                      : 'text-gray-300'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}