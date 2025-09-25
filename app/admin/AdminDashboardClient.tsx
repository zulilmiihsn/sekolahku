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
    <div className="min-h-screen flex bg-gradient-to-tr from-primary/5 via-accent/5 to-white">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-primary/90 text-white min-h-screen sticky top-0 left-0 shadow-xl z-20">
        <div className="flex items-center gap-2 px-6 py-6 border-b border-white/10">
          <span className="font-extrabold text-xl tracking-wide">{siteName || "Sekolah Modern"}</span>
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-1">
          {menu.map(item => (
            <button key={item.key} onClick={() => setActiveTab(item.key)} className={`flex items-center gap-3 px-6 py-3 text-base font-medium rounded-l-full transition-all ${activeTab === item.key ? "bg-white/20" : "hover:bg-white/10"}`}>{item.icon}{item.label}</button>
          ))}
        </nav>
        <div className="mt-auto px-6 py-6 border-t border-white/10">
          <button className="flex items-center gap-2 text-white/80 hover:text-white font-semibold"><LogOut className="w-5 h-5" />Logout</button>
        </div>
      </aside>
      
      {/* Sidebar mobile */}
      <aside className="md:hidden fixed top-0 left-0 w-full bg-primary/95 text-white flex items-center justify-between px-4 py-3 z-30 shadow-lg">
        <span className="font-extrabold text-lg">{siteName || "Sekolah Modern"}</span>
      </aside>
      
      {/* Konten utama */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-primary/10 shadow-sm flex items-center justify-between px-8 py-4">
          <h1 className="text-xl md:text-2xl font-bold text-primary">{menu.find(m => m.key === activeTab)?.label || "Dashboard"}</h1>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-primary/80">Admin</span>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-8 bg-transparent">
          <div className="max-w-3xl mx-auto">
            {/* Tab content */}
            {activeTab === "dashboard" && (
              <div className="grid gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4">
                  <h2 className="text-lg font-bold text-primary mb-2">Selamat datang di Dashboard Admin</h2>
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