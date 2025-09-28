'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { clientFetchSiteName } from '../app/utils/api'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [siteName, setSiteName] = useState('Sekolah Modern')

  useEffect(() => {
    clientFetchSiteName()
      .then(setSiteName)
      .catch(() => {
        // Fallback ke default jika fetch gagal
        setSiteName('Sekolah Modern')
      })
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('nav')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/tentang', label: 'Tentang' },
    { href: '/guru', label: 'Guru & Staff' },
    { href: '/fasilitas', label: 'Fasilitas' },
    { href: '/program', label: 'Program' },
    { href: '/prestasi', label: 'Prestasi' },
    { href: '/berita', label: 'Berita' },
    { href: '/galeri', label: 'Galeri' },
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:from-accent hover:to-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-1"
              aria-label="Beranda - Sekolah Modern"
            >
              {siteName}
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <div className="ml-8 flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="relative text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
                  aria-label={`Navigasi ke halaman ${link.label}`}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center">
            <Link 
              href="/pendaftaran" 
              className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-full text-sm font-semibold hover:from-accent hover:to-primary hover:shadow-lg hover:scale-105 transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Daftar sekarang - Pendaftaran siswa baru"
            >
              Daftar Sekarang
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary focus:outline-none focus:text-primary p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div 
          id="mobile-menu"
          className="lg:hidden bg-white/98 backdrop-blur-xl border-t border-gray-100 fixed inset-x-0 top-16 sm:top-20 bottom-0 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi mobile"
        >
          <div className="px-4 pt-6 pb-8 space-y-1">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="block text-gray-600 hover:text-primary px-4 py-3 rounded-xl text-base font-medium hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px] flex items-center"
                onClick={() => setIsOpen(false)}
                aria-label={`Navigasi ke halaman ${link.label}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-6 mt-6 border-t border-gray-100">
              <Link 
                href="/pendaftaran" 
                className="block bg-gradient-to-r from-primary to-accent text-white px-4 py-3 rounded-xl text-base font-semibold text-center hover:from-accent hover:to-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px] flex items-center justify-center"
                onClick={() => setIsOpen(false)}
                aria-label="Daftar sekarang - Pendaftaran siswa baru"
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
