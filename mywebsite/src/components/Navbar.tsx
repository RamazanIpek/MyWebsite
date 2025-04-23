"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-md text-white px-8 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">Ramazan İpek</Link>
      <div className="space-x-6">
        <Link href="/about">Hakkımda</Link>
        <Link href="/projects">Projeler</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/contact">İletişim</Link>
      </div>
    </nav>
  );
}
