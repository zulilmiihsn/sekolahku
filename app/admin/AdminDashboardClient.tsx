"use client"

import Link from "next/link"
import { Newspaper, Home, User, BookOpen, Users, Award, Building2, Settings, LogOut, MapPin, Trash2, UploadCloud, Menu, X } from "lucide-react"
import { useEffect, useState, useCallback, useRef } from "react"
import { clientFetchSiteName } from "../utils/api"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import { createPortal } from "react-dom"
import Image from 'next/image'
import { supabase } from "../utils/supabaseClient"
const Cropper = dynamic(() => import('react-easy-crop'), { ssr: false })
import { DragDropContext, Droppable, Draggable } from './components/dndClient'
import Showdown from "showdown"
const AdminBerita = dynamic(() => import("./components/adminBerita"), { ssr: false })
const AdminFasilitas = dynamic(() => import("./components/adminFasilitas"), { ssr: false })
const AdminPrestasi = dynamic(() => import("./components/adminPrestasi"), { ssr: false })
const AdminGaleri = dynamic(() => import("./components/adminGaleri"), { ssr: false })
const AdminEkstrakurikuler = dynamic(() => import("./components/adminEkstrakurikuler"), { ssr: false })
const AdminProfil = dynamic(() => import("./components/adminProfil"), { ssr: false })
const AdminProgram = dynamic(() => import("./components/adminProgram"), { ssr: false })
const AdminTentang = dynamic(() => import("./components/adminTentang"), { ssr: false })
const AdminGuru = dynamic(() => import("./components/adminGuru"), { ssr: false })
const AdminKategoriGuru = dynamic(() => import("./components/adminKategoriGuru"), { ssr: false })
const AdminKontak = dynamic(() => import("./components/adminKontak"), { ssr: false })

interface Berita {
  id: number
  judul: string
  deskripsi: string
  gambar?: string
  tanggal: string
  konten: string
}

const menu = [
  { key: "dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
  { key: "profil", label: "Profil", icon: <User className="w-5 h-5" /> },
  { key: "program", label: "Program", icon: <BookOpen className="w-5 h-5" /> },
  { key: "berita", label: "Berita", icon: <Newspaper className="w-5 h-5" /> },
  { key: "tentang", label: "Tentang", icon: <BookOpen className="w-5 h-5" /> },
  { key: "guru", label: "Guru", icon: <Users className="w-5 h-5" /> },
  { key: "kategori_guru", label: "Kategori Guru", icon: <Settings className="w-5 h-5" /> },
  { key: "fasilitas", label: "Fasilitas", icon: <Building2 className="w-5 h-5" /> },
  { key: "prestasi", label: "Prestasi", icon: <Award className="w-5 h-5" /> },
  { key: "kontak", label: "Kontak & Lokasi", icon: <MapPin className="w-5 h-5" /> },
  { key: "galeri", label: "Galeri", icon: <UploadCloud className="w-5 h-5" /> },
  { key: "ekstrakurikuler", label: "Ekstrakurikuler", icon: <BookOpen className="w-5 h-5" /> },
]

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false })

export default function AdminDashboardClient() {
  const [siteName, setSiteName] = useState("")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [notif, setNotif] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  useEffect(() => {
    clientFetchSiteName().then(name => {
      setSiteName(name)
      setInput(name)
    })
  }, [])

  const handleSave = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setNotif("")
    const res = await fetch("/api/pengaturan/nama-situs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: input })
    })
    if (res.ok) {
      setSiteName(input)
      setNotif("Nama sekolah berhasil diupdate!")
    } else {
      setNotif("Gagal update nama sekolah!")
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      if (res.ok) {
        // Clear localStorage
        localStorage.removeItem('isAdmin')
        // Use router for proper navigation
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Clear localStorage anyway
      localStorage.removeItem('isAdmin')
      // Fallback: redirect to homepage anyway
      window.location.href = '/'
    }
  }

  // Handle touch gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && !isMobileMenuOpen) {
      // Swipe left to open menu
      setIsMobileMenuOpen(true)
    }
    if (isRightSwipe && isMobileMenuOpen) {
      // Swipe right to close menu
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <div className="h-screen w-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-r border-gray-100 h-full shadow-sm z-20">
        <div className="px-6 py-6 border-b border-gray-100 flex-shrink-0">
          <span className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {siteName || "Sekolah Modern"}
          </span>
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto scrollbar-hide">
          {menu.map(item => {
            const active = activeTab === item.key
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`group flex items-center gap-3 mx-3 px-4 py-3 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${active ? 'bg-primary/10 text-primary shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}
              >
                <span className={`transition-colors ${active ? 'text-primary' : 'text-gray-500 group-hover:text-primary'}`}>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </nav>
        <div className="mt-auto px-6 py-5 border-t border-gray-100 flex-shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-semibold text-sm transition-colors"
          >
            <LogOut className="w-5 h-5" />Kembali ke Beranda
          </button>
        </div>
      </aside>
      
      {/* Sidebar mobile */}
      <aside className="md:hidden fixed top-0 left-0 w-full bg-white/90 backdrop-blur border-b border-gray-100 text-gray-800 flex items-center justify-between px-4 py-3 z-30 shadow-sm">
        <span className="font-extrabold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{siteName || "Sekolah Modern"}</span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar - Slide from left */}
      <div className={`md:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <span className="font-extrabold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {siteName || "Sekolah Modern"}
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide py-4">
          <div className="px-4 space-y-2">
            {menu.map((item) => {
              const active = activeTab === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}
                >
                  <span className={`transition-colors ${active ? 'text-primary' : 'text-gray-500'}`}>{item.icon}</span>
                  {item.label}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Mobile Sidebar Footer */}
        <div className="border-t border-gray-100 p-4 flex-shrink-0">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Kembali ke Beranda
          </button>
        </div>
      </div>
      
      {/* Konten utama */}
      <div 
        className="flex-1 flex flex-col h-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100 flex items-center justify-between px-6 md:px-8 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg md:text-2xl font-bold text-primary">{menu.find(m => m.key === activeTab)?.label || "Dashboard"}</h1>
            {/* Mobile swipe indicator */}
            <div className="md:hidden flex items-center gap-1 text-xs text-gray-400">
              <span>←</span>
              <span>Swipe</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Online
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-8 bg-gray-50 overflow-y-auto pt-16 md:pt-4">
          <div className="max-w-5xl mx-auto">
            {/* Tab content */}
            {activeTab === "dashboard" && (
              <div className="grid gap-6">
                <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 md:p-8 flex flex-col gap-3">
                  <h2 className="text-lg font-bold text-primary">Selamat datang di Dashboard Admin</h2>
                  <p className="text-text/70">Kelola seluruh konten website sekolah modern Anda dengan mudah dan cepat melalui menu di samping.</p>
                </div>
              </div>
            )}
            {activeTab === "profil" && <AdminProfil />}
            {activeTab === "program" && <AdminProgram />}
            {activeTab === "berita" && <AdminBerita siteName={siteName} onNotif={setNotif} />}
            {activeTab === "tentang" && <AdminTentang />}
            {activeTab === "guru" && <AdminGuru />}
            {activeTab === "kategori_guru" && <AdminKategoriGuru />}
            {activeTab === "fasilitas" && <AdminFasilitas />}
            {activeTab === "prestasi" && <AdminPrestasi />}
            {activeTab === "kontak" && <AdminKontak />}
            {activeTab === "galeri" && <AdminGaleri />}
            {activeTab === "ekstrakurikuler" && <AdminEkstrakurikuler />}
          </div>
        </main>
      </div>
    </div>
  )
}