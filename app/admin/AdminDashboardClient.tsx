"use client"

import Link from "next/link"
import { Newspaper, Home, User, BookOpen, Users, Award, Building2, Settings, LogOut, MapPin, Trash2, UploadCloud } from "lucide-react"
import { useEffect, useState, useCallback, useRef } from "react"
import { clientFetchSiteName } from "../utils/api"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import { createPortal } from "react-dom"
import Image from 'next/image'
import { supabase } from "../utils/supabaseClient"
const Cropper = dynamic(() => import('react-easy-crop'), { ssr: false })
import { DragDropContext, Droppable, Draggable } from './components/dndClient'
const ReactMde = dynamic(() => import("react-mde"), { ssr: false })
import "react-mde/lib/styles/css/react-mde-all.css"
import Showdown from "showdown"
const AdminBerita = dynamic(() => import("./components/adminBerita"), { ssr: false })
const AdminFasilitas = dynamic(() => import("./components/adminFasilitas"), { ssr: false })
const AdminPrestasi = dynamic(() => import("./components/adminPrestasi"), { ssr: false })
const AdminGaleri = dynamic(() => import("./components/adminGaleri"), { ssr: false })
const AdminEkstrakurikuler = dynamic(() => import("./components/adminEkstrakurikuler"), { ssr: false })
const AdminProfil = dynamic(() => import("./components/adminProfil"), { ssr: false })

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

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-r border-gray-100 min-h-screen sticky top-0 left-0 shadow-sm z-20">
        <div className="px-6 py-6 border-b border-gray-100">
          <span className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {siteName || "Sekolah Modern"}
          </span>
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-1">
          {menu.map(item => {
            const active = activeTab === item.key
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`group flex items-center gap-3 mx-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'bg-primary/10 text-primary shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}
              >
                <span className={`transition-colors ${active ? 'text-primary' : 'text-gray-500 group-hover:text-primary'}`}>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </nav>
        <div className="mt-auto px-6 py-5 border-t border-gray-100">
          <button className="flex items-center gap-2 text-gray-600 hover:text-primary font-semibold text-sm">
            <LogOut className="w-5 h-5" />Keluar
          </button>
        </div>
      </aside>
      
      {/* Sidebar mobile */}
      <aside className="md:hidden fixed top-0 left-0 w-full bg-white/90 backdrop-blur border-b border-gray-100 text-gray-800 flex items-center justify-between px-4 py-3 z-30 shadow-sm">
        <span className="font-extrabold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{siteName || "Sekolah Modern"}</span>
      </aside>
      
      {/* Konten utama */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100 flex items-center justify-between px-6 md:px-8 py-4">
          <h1 className="text-lg md:text-2xl font-bold text-primary">{menu.find(m => m.key === activeTab)?.label || "Dashboard"}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Online
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-8 bg-gray-50">
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
            {activeTab === "berita" && <AdminBerita siteName={siteName} onNotif={setNotif} />}
            {activeTab === "fasilitas" && <AdminFasilitas />}
            {activeTab === "prestasi" && <AdminPrestasi />}
            {activeTab === "galeri" && <AdminGaleri />}
            {activeTab === "ekstrakurikuler" && <AdminEkstrakurikuler />}
          </div>
        </main>
      </div>
    </div>
  )
}