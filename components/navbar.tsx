'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:from-accent hover:to-primary transition-all duration-300">
              Sekolah Modern
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <div className="ml-8 flex items-center space-x-6">
              <Link 
                href="/" 
                className="relative text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-all duration-200 group"
              >
                Beranda
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/tentang" 
                className="relative text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-all duration-200 group"
              >
                Tentang
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/guru" 
                className="relative text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-all duration-200 group"
              >
                Guru
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/fasilitas" 
                className="relative text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-all duration-200 group"
              >
                Fasilitas
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/prestasi" 
                className="relative text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-all duration-200 group"
              >
                Prestasi
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/berita" 
                className="relative text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-all duration-200 group"
              >
                Berita
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center">
            <Link 
              href="/pendaftaran" 
              className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-full text-sm font-semibold hover:from-accent hover:to-primary hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
            >
              Daftar Sekarang
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary focus:outline-none focus:text-primary p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-t border-gray-100">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link 
              href="/" 
              className="block text-gray-600 hover:text-primary px-4 py-3 rounded-xl text-base font-medium hover:bg-gray-50 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Beranda
            </Link>
            <Link 
              href="/tentang" 
              className="block text-gray-600 hover:text-primary px-4 py-3 rounded-xl text-base font-medium hover:bg-gray-50 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Tentang
            </Link>
            <Link 
              href="/guru" 
              className="block text-gray-600 hover:text-primary px-4 py-3 rounded-xl text-base font-medium hover:bg-gray-50 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Guru & Staff
            </Link>
            <Link 
              href="/fasilitas" 
              className="block text-gray-600 hover:text-primary px-4 py-3 rounded-xl text-base font-medium hover:bg-gray-50 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Fasilitas
            </Link>
            <Link 
              href="/prestasi" 
              className="block text-gray-600 hover:text-primary px-4 py-3 rounded-xl text-base font-medium hover:bg-gray-50 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Prestasi
            </Link>
            <Link 
              href="/berita" 
              className="block text-gray-600 hover:text-primary px-4 py-3 rounded-xl text-base font-medium hover:bg-gray-50 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Berita
            </Link>
            <div className="pt-4 mt-4 border-t border-gray-100">
              <Link 
                href="/pendaftaran" 
                className="block bg-gradient-to-r from-primary to-accent text-white px-4 py-3 rounded-xl text-base font-semibold text-center hover:from-accent hover:to-primary transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
