'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary">
              Sekolah Modern
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Beranda
              </Link>
              <Link href="/tentang" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Tentang
              </Link>
              <Link href="/guru" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Guru & Staff
              </Link>
              <Link href="/fasilitas" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Fasilitas
              </Link>
              <Link href="/prestasi" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Prestasi
              </Link>
              <Link href="/berita" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Berita
              </Link>
              <Link href="/ekstrakurikuler" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Ekstrakurikuler
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Admin
              </Link>
              <Link href="/pendaftaran" className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors">
                Pendaftaran
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary focus:outline-none focus:text-primary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link href="/" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Beranda
            </Link>
            <Link href="/tentang" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Tentang
            </Link>
            <Link href="/guru" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Guru & Staff
            </Link>
            <Link href="/fasilitas" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Fasilitas
            </Link>
            <Link href="/prestasi" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Prestasi
            </Link>
            <Link href="/berita" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Berita
            </Link>
            <Link href="/ekstrakurikuler" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Ekstrakurikuler
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Admin
            </Link>
            <Link href="/pendaftaran" className="bg-primary text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-accent">
              Pendaftaran
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
