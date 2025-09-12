"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { School, Menu, X, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePageTransition } from './transisiHalaman'
import { useRouter } from 'next/navigation'
import { clientFetchSiteName } from '../app/utils/api'

const mainLinks = [
  { href: '/', label: 'Beranda' },
  { label: 'Profil', dropdown: [
    { href: '/tentang', label: 'Tentang' },
    { href: '/guru', label: 'Guru' },
    { href: '/fasilitas', label: 'Fasilitas' },
    { href: '/prestasi', label: 'Prestasi' },
    { href: '/ekstrakurikuler', label: 'Ekstrakurikuler' },
  ]},
  { href: '/#program', label: 'Program' },
  { href: '/#galeri', label: 'Galeri' },
  { href: '/#kontak', label: 'Kontak' },
  { label: 'Lainnya', dropdown: [
    { href: '/berita', label: 'Berita' },
    { href: '/tanya-jawab', label: 'Tanya Jawab' },
    { href: '/pendaftaran', label: 'Pendaftaran' },
    { divider: true },
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/masuk', label: 'Masuk' },
  ]},
]

function AnimatedLink({ href, children, className }: any) {
  const { showOverlay } = usePageTransition()
  const router = useRouter()
  const handleClick = (e: any) => {
    if (href.startsWith('#')) {
      // Jika sudah di halaman utama, scroll manual tanpa overlay
      if (typeof window !== 'undefined' && window.location.pathname === '/') {
        e.preventDefault()
        const el = document.getElementById(href.replace('#', ''))
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
          window.history.replaceState(null, '', href)
        } else {
          window.location.hash = href
        }
        return
      }
      // Jika bukan di halaman utama, biarkan overlay dan navigasi
    }
    // Untuk mailto/tel, biarkan default
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return
    // Untuk navigasi antar halaman, biarkan Link Next.js yang handle
  }
  return (
    <Link href={href} className={className} prefetch={false} onClick={handleClick}>
      {children}
    </Link>
  )
}

function LogoBrand() {
  const [siteName, setSiteName] = useState('Sekolah Modern')
  useEffect(() => {
    clientFetchSiteName().then(setSiteName)
  }, [])
  return (
    <div className="flex items-center gap-2">
      <School className="text-primary w-7 h-7" />
      <span className="font-bold text-lg tracking-tight text-primary">{siteName}</span>
    </div>
  )
}

function DropdownMenu({ items }: { items: any[] }) {
  return (
    <>
      {items.map((item, idx) =>
        item.divider ? (
          <div key={idx} className="my-2 border-t border-slate-200" />
        ) : (
          <AnimatedLink
            key={item.href}
            href={item.href}
            className="block px-4 py-2 text-left text-primary hover:bg-accent/10 rounded-lg transition-colors"
          >
            {item.label}
          </AnimatedLink>
        )
      )}
    </>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdmin(localStorage.getItem('isAdmin') === 'true')
    }
  }, [])

  const handleDropdown = (label: string | null) => setDropdown(label)

  // Ubah mainLinks agar dropdown 'Lainnya' dinamis
  const dynamicLinks = mainLinks.map(link => {
    if (link.label === 'Lainnya') {
      return {
        ...link,
        dropdown: [
          { href: '/berita', label: 'Berita' },
          { href: '/tanya-jawab', label: 'Tanya Jawab' },
          { href: '/pendaftaran', label: 'Pendaftaran' },
          { divider: true },
          isAdmin
            ? { href: '/admin', label: 'Dashboard' }
            : { href: '/admin/masuk', label: 'Masuk' },
        ]
      }
    }
    return link
  })

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/60 border-b border-white/30 shadow-sm"
      style={{ WebkitBackdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-6 py-3">
        <LogoBrand />
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-4 text-sm font-medium relative ml-auto">
          {dynamicLinks.map((link) =>
            link.dropdown ? (
              <div
                key={link.label}
                className="relative group"
                onMouseEnter={() => handleDropdown(link.label!)}
                onMouseLeave={() => handleDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-accent/10 transition-colors">
                  {link.label} <ChevronDown className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {dropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 mt-2 min-w-[160px] bg-white rounded-xl shadow-lg border border-white/40 py-2 z-50"
                    >
                      <DropdownMenu items={link.dropdown} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <AnimatedLink
                key={link.href}
                href={link.href!}
                className="hover:text-accent transition-colors px-3 py-1 rounded-lg hover:bg-accent/10"
              >
                {link.label}
              </AnimatedLink>
            )
          )}
        </div>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-accent/10 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
        >
          {open ? <X className="w-7 h-7 text-primary" /> : <Menu className="w-7 h-7 text-primary" />}
        </button>
      </div>
      {/* Mobile Menu Overlay (tanpa portal) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 min-h-screen z-[99999] bg-white flex flex-col h-full overflow-y-auto"
            style={{ WebkitBackdropFilter: 'blur(0px)' }}
          >
            {/* Header di overlay */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/40">
              <LogoBrand />
              <button
                className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
                onClick={() => setOpen(false)}
                aria-label="Tutup menu"
              >
                <X className="w-7 h-7 text-primary" />
              </button>
            </div>
            {/* Link navigasi mobile */}
            <div className="flex flex-col justify-center items-center gap-2 py-8 w-full">
              {dynamicLinks.map((link, idx) =>
                link.dropdown ? (
                  <div key={link.label} className="w-full flex flex-col items-center gap-1">
                    <span className="text-lg font-bold text-primary uppercase tracking-wide mb-1 mt-2">{link.label}</span>
                    <DropdownMenu items={link.dropdown.map(item => item.divider ? item : { ...item, className: "text-base text-primary hover:text-accent transition-colors pl-2 py-1", onClick: () => setOpen(false) })} />
                    <div className="w-2/3 h-px bg-slate-200 my-1" />
                  </div>
                ) : (
                  <>
                    <AnimatedLink
                      key={link.href}
                      href={link.href!}
                      className="text-xl font-bold text-primary hover:text-accent transition-colors py-1"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </AnimatedLink>
                    {idx !== dynamicLinks.length - 1 && <div className="w-2/3 h-px bg-slate-200 my-1" />}
                  </>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
} 