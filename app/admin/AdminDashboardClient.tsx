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
import Cropper from 'react-easy-crop'
import { DragDropContext, Droppable, Draggable } from './components/dndClient'
const ReactMde = dynamic(() => import("react-mde"), { ssr: false })
import "react-mde/lib/styles/css/react-mde-all.css"
import Showdown from "showdown"
import adminBerita from "./components/adminBerita"
import adminFasilitas from "./components/adminFasilitas"
import adminPrestasi from "./components/adminPrestasi"
import adminGaleri from "./components/adminGaleri"
import adminEkstrakurikuler from "./components/adminEkstrakurikuler"
import adminProfil from "./components/adminProfil"

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

  // State untuk profil sekolah
  const [profil, setProfil] = useState({ 
    deskripsi: '',
    jumlahSiswa: 320,
    jumlahGuru: 18,
    jumlahStaff: 6
  })
  const [profilInput, setProfilInput] = useState({ 
    deskripsi: '',
    jumlahSiswa: 320,
    jumlahGuru: 18,
    jumlahStaff: 6
  })
  const [loadingProfil, setLoadingProfil] = useState(false)
  const [notifProfil, setNotifProfil] = useState("")

  // State untuk program unggulan
  const [programs, setPrograms] = useState<any[]>([])
  const [programInput, setProgramInput] = useState({ judul: '', deskripsi: '' })
  const [loadingProgram, setLoadingProgram] = useState(false)
  const [notifProgram, setNotifProgram] = useState("")
  const [editingProgram, setEditingProgram] = useState<number | null>(null)

  // State untuk kontak
  const [kontak, setKontak] = useState({ alamat: '', email: '', telepon: '', lat: '', lng: '' })
  const [kontakInput, setKontakInput] = useState({ alamat: '', email: '', telepon: '', lat: '', lng: '' })
  const [loadingKontak, setLoadingKontak] = useState(false)
  const [notifKontak, setNotifKontak] = useState("")

  // Tambah state lat/lng
  const [mapReady, setMapReady] = useState(false)
  const [markerPos, setMarkerPos] = useState<{lat: number, lng: number}>({ lat: -2.5489, lng: 118.0149 })

  // Tambah state dan logic berita
  const [berita, setBerita] = useState<Berita[]>([])
  const [loadingBerita, setLoadingBerita] = useState(true)
  const [formBerita, setFormBerita] = useState({ judul: "", deskripsi: "", gambar: "", konten: "" })
  const [kontenBerita, setKontenBerita] = useState("")
  const [editIdBerita, setEditIdBerita] = useState<number | null>(null)
  const [notifBerita, setNotifBerita] = useState("")
  const [showModalBerita, setShowModalBerita] = useState(false)
  const [showConfirmBerita, setShowConfirmBerita] = useState<{ id: number, judul: string } | null>(null)
  const [deleteLoadingBerita, setDeleteLoadingBerita] = useState(false)
  const [editorKeyBerita, setEditorKeyBerita] = useState(0)

  // Dynamic import Map agar hanya di client
  const Map = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false })
  const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false })
  const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false })
  // Note: hooks like useMapEvents should not be dynamically imported; remove unless needed

  const [activeTab, setActiveTab] = useState("dashboard")

  const [tentang, setTentang] = useState({
    judul: 'Tentang Kami',
    sejarah: '',
    visi: '',
    misi: [''],
    nilai: ['']
  })
  const [loadingTentang, setLoadingTentang] = useState(false)
  const [notifTentang, setNotifTentang] = useState("")

  const [guru, setGuru] = useState({
    kepala: [{ nama: '', jabatan: '', foto: '' }],
    wakil: [{ nama: '', jabatan: '', foto: '' }],
    guru: [{ nama: '', jabatan: '', foto: '' }],
    bk: [{ nama: '', jabatan: '', foto: '' }],
    tu: [{ nama: '', jabatan: '', foto: '' }],
    staff: [{ nama: '', jabatan: '', foto: '' }],
  })
  const [loadingGuru, setLoadingGuru] = useState(false)
  const [notifGuru, setNotifGuru] = useState("")

  // Tambahkan state untuk preview foto sementara
  const [fotoPreview, setFotoPreview] = useState<{ [key: string]: string }>({})

  // Tambahkan state untuk cropper
  const [cropModal, setCropModal] = useState<{ open: boolean, kategori?: string, index?: number, file?: File, src?: string }>({ open: false })
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  // Tambahkan state dan logic kelola kategori guru
  type KategoriGuru = { key: string, label: string, fixed?: boolean }
  const [kategoriGuru, setKategoriGuru] = useState<KategoriGuru[]>([])
  const [loadingKategori, setLoadingKategori] = useState(false)
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [showConfirmHapus, setShowConfirmHapus] = useState<{ idx: number, label: string } | null>(null)

  // Tambahkan state untuk fasilitas
  const [fasilitasInput, setFasilitasInput] = useState<{ nama: string; deskripsi: string; foto: string[] }>({ nama: '', deskripsi: '', foto: [] })
  const [fasilitasList, setFasilitasList] = useState<{ id: number; nama: string; deskripsi: string; foto: string[] }[]>([])
  const [loadingFasilitas, setLoadingFasilitas] = useState(false)
  const [notifFasilitas, setNotifFasilitas] = useState("")
  const [editIdxFasilitas, setEditIdxFasilitas] = useState<number | null>(null)
  const [editFasilitas, setEditFasilitas] = useState<{ nama: string; deskripsi: string; foto: string[] }>({ nama: '', deskripsi: '', foto: [] })
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileEditInputRef = useRef<HTMLInputElement>(null)

  // Tambahkan state untuk prestasi
  type Prestasi = { id?: number; nama: string; peraih: string; tahun: number | ""; foto: string[] }
  const [prestasiInput, setPrestasiInput] = useState<Prestasi>({ nama: '', peraih: '', tahun: '', foto: [] })
  const [prestasiList, setPrestasiList] = useState<Prestasi[]>([])
  const [loadingPrestasi, setLoadingPrestasi] = useState(false)
  const [notifPrestasi, setNotifPrestasi] = useState("")
  const [editIdxPrestasi, setEditIdxPrestasi] = useState<number | null>(null)
  const [editPrestasi, setEditPrestasi] = useState<Prestasi>({ nama: '', peraih: '', tahun: '', foto: [] })
  const [uploadingPrestasiFoto, setUploadingPrestasiFoto] = useState(false)
  const prestasiFileInputRef = useRef<HTMLInputElement>(null)
  const prestasiFileEditInputRef = useRef<HTMLInputElement>(null)

  // Fungsi upload foto ke Supabase Storage
  async function uploadGuruPhoto(file: File, nama: string) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${nama.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.${fileExt}`
    const { data, error } = await supabase.storage.from('guru').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })
    if (error) throw error
    const { data: publicUrl } = supabase.storage.from('guru').getPublicUrl(fileName)
    return publicUrl.publicUrl
  }

  // Fungsi untuk dapatkan hasil crop sebagai blob
  const getCroppedImg = useCallback(async (imageSrc: string, croppedAreaPixels: any) => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const size = Math.max(croppedAreaPixels.width, croppedAreaPixels.height)
    canvas.width = size
    canvas.height = size
    if (!ctx) return null
    ctx.beginPath()
    ctx.arc(size/2, size/2, size/2, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      size,
      size
    )
    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/jpeg')
    })
  }, [])

  // Helper untuk load image
  function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new window.Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', error => reject(error))
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = url
    })
  }

  useEffect(() => {
    clientFetchSiteName().then(name => {
      setSiteName(name)
      setInput(name)
    })
    // Fetch profil sekolah
    fetch('/api/profil-sekolah')
      .then(res => res.json())
      .then(data => {
        // Ambil section 'profil' saja
        const profilData = Array.isArray(data) ? data.find((item: any) => item.section === 'profil') : null
        if (profilData) {
          const konten = profilData.konten ? JSON.parse(profilData.konten) : {}
          setProfil({ 
            deskripsi: profilData.deskripsi,
            jumlahSiswa: konten.jumlahSiswa || 320,
            jumlahGuru: konten.jumlahGuru || 18,
            jumlahStaff: konten.jumlahStaff || 6
          })
          setProfilInput({ 
            deskripsi: profilData.deskripsi,
            jumlahSiswa: konten.jumlahSiswa || 320,
            jumlahGuru: konten.jumlahGuru || 18,
            jumlahStaff: konten.jumlahStaff || 6
          })
        }
      })
    // Fetch program unggulan
    fetch('/api/profil-sekolah')
      .then(res => res.json())
      .then(data => {
        const programData = Array.isArray(data) ? data.find((item: any) => item.section === 'program') : null
        if (programData && programData.konten) {
          setPrograms(JSON.parse(programData.konten))
        }
      })
    // Fetch kontak
    fetch('/api/pengaturan/kontak')
      .then(res => res.json())
      .then(data => {
        setKontak(data)
        setKontakInput(data)
      })
    // Fetch tentang
    fetch('/api/profil-sekolah')
      .then(res => res.json())
      .then(data => {
        const t = Array.isArray(data) ? data.find((item: any) => item.section === 'tentang') : null
        if (t && t.konten) {
          try {
            const konten = JSON.parse(t.konten)
            setTentang({
              judul: t.judul || 'Tentang Kami',
              sejarah: konten.sejarah || '',
              visi: konten.visi || '',
              misi: konten.misi && konten.misi.length ? konten.misi : [''],
              nilai: konten.nilai && konten.nilai.length ? konten.nilai : ['']
            })
          } catch {
            setTentang({
              judul: t.judul || 'Tentang Kami',
              sejarah: '', visi: '', misi: [''], nilai: ['']
            })
          }
        }
      })
    // Fetch guru
    fetch('/api/profil-sekolah')
      .then(res => res.json())
      .then(data => {
        const g = Array.isArray(data) ? data.find((item: any) => item.section === 'guru') : null
        if (g && g.konten) {
          try {
            const konten = JSON.parse(g.konten)
            setGuru({
              kepala: konten.kepala && konten.kepala.length ? konten.kepala : [{ nama: '', jabatan: '', foto: '' }],
              wakil: konten.wakil && konten.wakil.length ? konten.wakil : [{ nama: '', jabatan: '', foto: '' }],
              guru: konten.guru && konten.guru.length ? konten.guru : [{ nama: '', jabatan: '', foto: '' }],
              bk: konten.bk && konten.bk.length ? konten.bk : [{ nama: '', jabatan: '', foto: '' }],
              tu: konten.tu && konten.tu.length ? konten.tu : [{ nama: '', jabatan: '', foto: '' }],
              staff: konten.staff && konten.staff.length ? konten.staff : [{ nama: '', jabatan: '', foto: '' }],
            })
          } catch {
            setGuru({
              kepala: [{ nama: '', jabatan: '', foto: '' }], wakil: [{ nama: '', jabatan: '', foto: '' }], guru: [{ nama: '', jabatan: '', foto: '' }], bk: [{ nama: '', jabatan: '', foto: '' }], tu: [{ nama: '', jabatan: '', foto: '' }], staff: [{ nama: '', jabatan: '', foto: '' }]
            })
          }
        }
      })
    // Fetch prestasi
    fetchPrestasi()
  }, [])

  // Update kontakInput jika lat/lng dari API
  useEffect(() => {
    if (kontak.lat && kontak.lng) {
      setMarkerPos({ lat: parseFloat(kontak.lat), lng: parseFloat(kontak.lng) })
      setKontakInput(v => ({ ...v, lat: kontak.lat, lng: kontak.lng }))
    }
  }, [kontak.lat, kontak.lng])

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

  const handleSaveProfil = async (e: any) => {
    e.preventDefault()
    setLoadingProfil(true)
    setNotifProfil("")
    const res = await fetch('/api/profil-sekolah', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: 'profil',
        judul: 'Profil Sekolah', // Judul tetap statis
        deskripsi: profilInput.deskripsi,
        konten: JSON.stringify({
          jumlahSiswa: profilInput.jumlahSiswa,
          jumlahGuru: profilInput.jumlahGuru,
          jumlahStaff: profilInput.jumlahStaff
        })
      })
    })
    if (res.ok) {
      setProfil({ ...profilInput })
      setNotifProfil('Profil sekolah berhasil diupdate!')
    } else {
      setNotifProfil('Gagal update profil sekolah!')
    }
    setLoadingProfil(false)
  }

  const handleSaveProgram = async (e: any) => {
    e.preventDefault()
    setLoadingProgram(true)
    setNotifProgram("")
    
    let updatedPrograms = [...programs]
    if (editingProgram !== null) {
      // Edit program yang ada
      updatedPrograms[editingProgram] = { ...programInput }
    } else {
      // Tambah program baru
      updatedPrograms.push({ ...programInput })
    }
    
    const res = await fetch('/api/profil-sekolah', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: 'program',
        judul: 'Program Unggulan',
        deskripsi: `${updatedPrograms.length} program unggulan`,
        konten: JSON.stringify(updatedPrograms)
      })
    })
    if (res.ok) {
      setPrograms(updatedPrograms)
      setProgramInput({ judul: '', deskripsi: '' })
      setEditingProgram(null)
      setNotifProgram(editingProgram !== null ? 'Program berhasil diupdate!' : 'Program berhasil ditambahkan!')
    } else {
      setNotifProgram('Gagal menyimpan program!')
    }
    setLoadingProgram(false)
  }

  const handleEditProgram = (index: number) => {
    setEditingProgram(index)
    setProgramInput(programs[index])
  }

  const handleDeleteProgram = async (index: number) => {
    const updatedPrograms = programs.filter((_, i) => i !== index)
    const res = await fetch('/api/profil-sekolah', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: 'program',
        judul: 'Program Unggulan',
        deskripsi: `${updatedPrograms.length} program unggulan`,
        konten: JSON.stringify(updatedPrograms)
      })
    })
    if (res.ok) {
      setPrograms(updatedPrograms)
      setNotifProgram('Program berhasil dihapus!')
    } else {
      setNotifProgram('Gagal menghapus program!')
    }
  }

  const handleCancelEdit = () => {
    setEditingProgram(null)
    setProgramInput({ judul: '', deskripsi: '' })
  }

  const handleSaveKontak = async (e: any) => {
    e.preventDefault()
    setLoadingKontak(true)
    setNotifKontak("")
    const res = await fetch('/api/pengaturan/kontak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(kontakInput)
    })
    if (res.ok) {
      setKontak({ ...kontakInput })
      setNotifKontak('Kontak berhasil diupdate!')
    } else {
      setNotifKontak('Gagal update kontak!')
    }
    setLoadingKontak(false)
  }

  const handleChangeMisi = (i: number, v: string) => {
    setTentang(t => ({ ...t, misi: t.misi.map((m, idx) => idx === i ? v : m) }))
  }
  const handleAddMisi = () => {
    setTentang(t => ({ ...t, misi: [...t.misi, ''] }))
  }
  const handleRemoveMisi = (i: number) => {
    setTentang(t => ({ ...t, misi: t.misi.filter((_, idx) => idx !== i) }))
  }
  const handleChangeNilai = (i: number, v: string) => {
    setTentang(t => ({ ...t, nilai: t.nilai.map((n, idx) => idx === i ? v : n) }))
  }
  const handleAddNilai = () => {
    setTentang(t => ({ ...t, nilai: [...t.nilai, ''] }))
  }
  const handleRemoveNilai = (i: number) => {
    setTentang(t => ({ ...t, nilai: t.nilai.filter((_, idx) => idx !== i) }))
  }
  const handleSaveTentang = async (e: any) => {
    e.preventDefault()
    setLoadingTentang(true)
    setNotifTentang("")
    const konten = JSON.stringify({
      sejarah: tentang.sejarah,
      visi: tentang.visi,
      misi: tentang.misi.filter(m => m.trim()),
      nilai: tentang.nilai.filter(n => n.trim())
    })
    const res = await fetch('/api/profil-sekolah', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: 'tentang',
        judul: tentang.judul,
        deskripsi: tentang.sejarah.slice(0, 200),
        konten
      })
    })
    if (res.ok) {
      setNotifTentang('Halaman Tentang berhasil diupdate!')
    } else {
      setNotifTentang('Gagal update halaman Tentang!')
    }
    setLoadingTentang(false)
  }

  const handleChangeGuru = (kategori: keyof typeof guru, i: number, field: 'nama' | 'jabatan' | 'foto', v: string) => {
    setGuru(g => ({ ...g, [kategori]: g[kategori].map((item, idx) => idx === i ? { ...item, [field]: v } : item) }))
  }
  const handleAddGuru = (kategori: keyof typeof guru) => {
    setGuru(g => ({ ...g, [kategori]: [...g[kategori], { nama: '', jabatan: '', foto: '' }] }))
  }
  const handleRemoveGuru = (kategori: keyof typeof guru, i: number) => {
    setGuru(g => ({ ...g, [kategori]: g[kategori].filter((_, idx) => idx !== i) }))
  }
  const handleSaveGuru = async (e: any) => {
    e.preventDefault()
    setLoadingGuru(true)
    setNotifGuru("")
    const konten = JSON.stringify(guru)
    const res = await fetch('/api/profil-sekolah', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: 'guru',
        judul: 'Guru & Staff',
        deskripsi: guru.kepala[0]?.nama || '',
        konten
      })
    })
    if (res.ok) {
      setNotifGuru('Data Guru & Staff berhasil diupdate!')
    } else {
      setNotifGuru('Gagal update data Guru & Staff!')
    }
    setLoadingGuru(false)
  }

  // Fetch kategori guru dari API saat mount
  useEffect(() => {
    fetch('/api/pengaturan/kategori-guru')
      .then(res => res.json())
      .then(data => setKategoriGuru(data))
  }, [])

  // Handler drag & drop
  function handleDragEnd(result: any) {
    if (!result.destination) return
    const items = Array.from(kategoriGuru)
    const [reordered] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reordered)
    setKategoriGuru(items)
  }

  // Handler edit label
  function handleEditLabel(idx: number) {
    setEditIdx(idx)
    setEditLabel(kategoriGuru[idx].label)
  }
  function handleSaveLabel(idx: number) {
    const newKategori = [...kategoriGuru]
    newKategori[idx].label = editLabel
    setKategoriGuru(newKategori)
    setEditIdx(null)
  }

  // Handler tambah kategori
  function handleTambahKategori() {
    const newKey = `custom_${Date.now()}`
    setKategoriGuru([...kategoriGuru, { key: newKey, label: 'Kategori Baru' }])
  }

  // Handler hapus kategori
  function handleHapusKategori(idx: number) {
    setShowConfirmHapus({ idx, label: kategoriGuru[idx].label })
  }
  function handleConfirmHapus() {
    if (showConfirmHapus) {
      const newKategori = kategoriGuru.filter((_, i) => i !== showConfirmHapus.idx)
      setKategoriGuru(newKategori)
      setShowConfirmHapus(null)
    }
  }

  // Handler simpan ke API
  async function handleSimpanKategori() {
    setLoadingKategori(true)
    await fetch('/api/pengaturan/kategori-guru', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(kategoriGuru)
    })
    setLoadingKategori(false)
  }

  // Tambahkan fungsi untuk fasilitas
  const handleSaveFasilitas = async (e: any) => {
    e.preventDefault()
    setLoadingFasilitas(true)
    setNotifFasilitas("")
    const res = await fetch('/api/fasilitas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fasilitasInput)
    })
    if (res.ok) {
      setFasilitasList([...fasilitasList, { ...fasilitasInput, id: Date.now() }])
      setFasilitasInput({ nama: '', deskripsi: '', foto: [] })
      setNotifFasilitas('Fasilitas berhasil ditambahkan!')
      fetchFasilitas()
    } else {
      setNotifFasilitas('Gagal menambahkan fasilitas!')
    }
    setLoadingFasilitas(false)
  }

  const handleRemoveFotoInput = (index: number) => {
    const newFoto = fasilitasInput.foto.filter((_, i) => i !== index)
    setFasilitasInput(v => ({ ...v, foto: newFoto }))
  }

  const handleUploadFotoInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    setUploadingFoto(true)
    const newFotos = await Promise.all(files.map(async (file) => {
      const url = await uploadGuruPhoto(file, fasilitasInput.nama)
      return url
    }))
    setFasilitasInput(v => ({ ...v, foto: [...v.foto, ...newFotos] }))
    setUploadingFoto(false)
  }

  const handleEditFasilitas = (index: number) => {
    setEditIdxFasilitas(index)
    setEditFasilitas(fasilitasList[index])
  }

  const handleUpdateFasilitas = async (e: any, id: number) => {
    e.preventDefault()
    setLoadingFasilitas(true)
    setNotifFasilitas("")
    const res = await fetch(`/api/fasilitas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editFasilitas)
    })
    if (res.ok) {
      const updatedFasilitasList = fasilitasList.map((f) =>
        f.id === id ? { ...f, ...editFasilitas } : f
      )
      setFasilitasList(updatedFasilitasList)
      setNotifFasilitas('Fasilitas berhasil diupdate!')
      fetchFasilitas()
    } else {
      setNotifFasilitas('Gagal update fasilitas!')
    }
    setLoadingFasilitas(false)
    setEditIdxFasilitas(null)
  }

  const handleDeleteFasilitas = async (id: number) => {
    setLoadingFasilitas(true)
    const res = await fetch(`/api/fasilitas/${id}`, { method: 'DELETE' })
    if (res.ok) {
      const updatedFasilitasList = fasilitasList.filter((f) => f.id !== id)
      setFasilitasList(updatedFasilitasList)
      setNotifFasilitas('Fasilitas berhasil dihapus!')
      fetchFasilitas()
    } else {
      setNotifFasilitas('Gagal menghapus fasilitas!')
    }
    setLoadingFasilitas(false)
  }

  const handleCancelEditFasilitas = () => {
    setEditIdxFasilitas(null)
    setEditFasilitas({ nama: '', deskripsi: '', foto: [] })
  }

  const handleRemoveFotoEdit = (index: number) => {
    const newFoto = editFasilitas.foto.filter((_, i) => i !== index)
    setEditFasilitas(v => ({ ...v, foto: newFoto }))
  }

  const handleUploadFotoEdit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    setUploadingFoto(true)
    const newFotos = await Promise.all(files.map(async (file) => {
      const url = await uploadGuruPhoto(file, editFasilitas.nama)
      return url
    }))
    setEditFasilitas(v => ({ ...v, foto: [...v.foto, ...newFotos] }))
    setUploadingFoto(false)
  }

  // Tambahkan fungsi fetchFasilitas
  const fetchFasilitas = async () => {
    const res = await fetch('/api/fasilitas');
    if (res.ok) {
      const data = await res.json();
      setFasilitasList(Array.isArray(data) ? data : []);
    }
  };
  useEffect(() => { fetchFasilitas(); }, []);

  // Fetch prestasi dari API
  const fetchPrestasi = async () => {
    const res = await fetch('/api/prestasi');
    if (res.ok) {
      const data = await res.json();
      setPrestasiList(Array.isArray(data) ? data : []);
    }
  };
  useEffect(() => { fetchPrestasi(); }, []);

  // Upload foto ke Supabase Storage (bucket: 'prestasi')
  async function uploadPrestasiPhoto(file: File, nama: string) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${nama.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.${fileExt}`
    const { data, error } = await supabase.storage.from('prestasi').upload(fileName, file, { cacheControl: '3600', upsert: false })
    if (error) throw error
    const { data: publicUrl } = supabase.storage.from('prestasi').getPublicUrl(fileName)
    return publicUrl.publicUrl
  }

  // Handler tambah prestasi
  const handleSavePrestasi = async (e: any) => {
    e.preventDefault()
    setLoadingPrestasi(true)
    setNotifPrestasi("")
    if (!prestasiInput.nama || !prestasiInput.peraih || !prestasiInput.tahun || String(prestasiInput.tahun).length !== 4) {
      setNotifPrestasi('Nama, Peraih, dan Tahun (4 digit) wajib diisi!')
      setLoadingPrestasi(false)
      return
    }
    const res = await fetch('/api/prestasi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...prestasiInput, tahun: Number(prestasiInput.tahun) })
    })
    if (res.ok) {
      setPrestasiInput({ nama: '', peraih: '', tahun: '', foto: [] })
      setNotifPrestasi('Prestasi berhasil ditambahkan!')
      fetchPrestasi()
    } else {
      setNotifPrestasi('Gagal menambahkan prestasi!')
    }
    setLoadingPrestasi(false)
  }

  // Handler upload foto tambah
  const handleUploadPrestasiFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    setUploadingPrestasiFoto(true)
    const newFotos = await Promise.all(files.map(async (file) => {
      const url = await uploadPrestasiPhoto(file, prestasiInput.nama)
      return url
    }))
    setPrestasiInput(v => ({ ...v, foto: [...v.foto, ...newFotos] }))
    setUploadingPrestasiFoto(false)
  }
  const handleRemovePrestasiFoto = (index: number) => {
    setPrestasiInput(v => ({ ...v, foto: v.foto.filter((_, i) => i !== index) }))
  }

  // Handler edit prestasi
  const handleEditPrestasi = (index: number) => {
    setEditIdxPrestasi(index)
    setEditPrestasi(prestasiList[index])
  }
  const handleUpdatePrestasi = async (e: any, id: number) => {
    e.preventDefault()
    setLoadingPrestasi(true)
    setNotifPrestasi("")
    if (!editPrestasi.nama || !editPrestasi.peraih || !editPrestasi.tahun || String(editPrestasi.tahun).length !== 4) {
      setNotifPrestasi('Nama, Peraih, dan Tahun (4 digit) wajib diisi!')
      setLoadingPrestasi(false)
      return
    }
    const res = await fetch('/api/prestasi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editPrestasi, id, tahun: Number(editPrestasi.tahun) })
    })
    if (res.ok) {
      setEditIdxPrestasi(null)
      setEditPrestasi({ nama: '', peraih: '', tahun: '', foto: [] })
      setNotifPrestasi('Prestasi berhasil diupdate!')
      fetchPrestasi()
    } else {
      setNotifPrestasi('Gagal update prestasi!')
    }
    setLoadingPrestasi(false)
  }
  const handleRemovePrestasiFotoEdit = (index: number) => {
    setEditPrestasi(v => ({ ...v, foto: v.foto.filter((_, i) => i !== index) }))
  }
  const handleUploadPrestasiFotoEdit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    setUploadingPrestasiFoto(true)
    const newFotos = await Promise.all(files.map(async (file) => {
      const url = await uploadPrestasiPhoto(file, editPrestasi.nama)
      return url
    }))
    setEditPrestasi(v => ({ ...v, foto: [...v.foto, ...newFotos] }))
    setUploadingPrestasiFoto(false)
  }
  const handleDeletePrestasi = async (id: number) => {
    setLoadingPrestasi(true)
    const res = await fetch('/api/prestasi', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (res.ok) {
      setNotifPrestasi('Prestasi berhasil dihapus!')
      fetchPrestasi()
    } else {
      setNotifPrestasi('Gagal menghapus prestasi!')
    }
    setLoadingPrestasi(false)
  }
  const handleCancelEditPrestasi = () => {
    setEditIdxPrestasi(null)
    setEditPrestasi({ nama: '', peraih: '', tahun: '', foto: [] })
  }

  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write")
  const converter = new Showdown.Converter({ tables: true, simplifiedAutoLink: true })

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
        {/* Hamburger menu bisa diimplementasikan selanjutnya */}
      </aside>
      {/* Konten utama */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-primary/10 shadow-sm flex items-center justify-between px-8 py-4">
          <h1 className="text-xl md:text-2xl font-bold text-primary">{menu.find(m => m.key === activeTab)?.label || "Dashboard"}</h1>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-primary/80">Admin</span>
            {/* Avatar bisa ditambah */}
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
            {activeTab === "profil" && <adminProfil />}
            {activeTab === "program" && (
              <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
                <h2 className="text-lg font-bold text-primary mb-2">Program Unggulan</h2>
                <form onSubmit={handleSaveProgram} className="flex flex-col gap-4">
                  <input type="text" className="p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none" placeholder="Judul Program" value={programInput.judul} onChange={e => setProgramInput(v => ({ ...v, judul: e.target.value }))} />
                  <textarea className="p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none min-h-[80px]" placeholder="Deskripsi Program" value={programInput.deskripsi} onChange={e => setProgramInput(v => ({ ...v, deskripsi: e.target.value }))} />
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-accent transition-colors duration-200" disabled={loadingProgram}>
                      {loadingProgram ? "Menyimpan..." : (editingProgram !== null ? "Update" : "Tambah")}
                    </button>
                    {editingProgram !== null && (
                      <button type="button" onClick={handleCancelEdit} className="px-6 py-2 rounded-full bg-gray-500 text-white font-semibold shadow-lg hover:bg-gray-600 transition-colors duration-200">
                        Batal
                      </button>
                    )}
                  </div>
                  {notifProgram && <div className="text-green-600 text-sm mt-2">{notifProgram}</div>}
                </form>
                {/* List program yang sudah ada */}
                {programs.length > 0 && (
                  <div className="">
                    <h3 className="font-semibold text-primary mb-4">Program yang Sudah Ada:</h3>
                    <div className="space-y-3">
                      {programs.map((program, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                          <h4 className="font-semibold text-primary mb-2">{program.judul}</h4>
                          <p className="text-sm text-text/70 mb-3">{program.deskripsi}</p>
                          <div className="flex gap-2">
                            <button onClick={() => handleEditProgram(index)} className="px-4 py-1 rounded bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors">
                              Edit
                            </button>
                            <button onClick={() => handleDeleteProgram(index)} className="px-4 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600 transition-colors">
                              Hapus
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "berita" && <adminBerita siteName={siteName} onNotif={setNotif} />}
            {activeTab === "tentang" && (
              <form onSubmit={handleSaveTentang} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4 max-w-2xl mx-auto">
                <h2 className="text-lg font-bold text-primary mb-2">Edit Halaman Tentang</h2>
                <label className="text-sm font-medium text-text/70 mb-1">Judul</label>
                <input type="text" className="p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none" value={tentang.judul} onChange={e => setTentang(v => ({ ...v, judul: e.target.value }))} />
                <label className="text-sm font-medium text-text/70 mb-1">Sejarah Singkat</label>
                <textarea className="p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none min-h-[60px]" value={tentang.sejarah} onChange={e => setTentang(v => ({ ...v, sejarah: e.target.value }))} />
                <label className="text-sm font-medium text-text/70 mb-1">Visi</label>
                <textarea className="p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none min-h-[40px]" value={tentang.visi} onChange={e => setTentang(v => ({ ...v, visi: e.target.value }))} />
                <label className="text-sm font-medium text-text/70 mb-1">Misi</label>
                <div className="flex flex-col gap-2">
                  {tentang.misi.map((m, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input type="text" className="flex-1 p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none" value={m} onChange={e => handleChangeMisi(i, e.target.value)} />
                      {tentang.misi.length > 1 && <button type="button" onClick={() => handleRemoveMisi(i)} className="text-red-500 font-bold text-xl">×</button>}
                    </div>
                  ))}
                  <button type="button" onClick={handleAddMisi} className="px-4 py-1 rounded bg-primary/10 text-primary font-semibold w-fit mt-1">+ Tambah Misi</button>
                </div>
                <label className="text-sm font-medium text-text/70 mb-1">Nilai-Nilai Sekolah</label>
                <div className="flex flex-col gap-2">
                  {tentang.nilai.map((n, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input type="text" className="flex-1 p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none" value={n} onChange={e => handleChangeNilai(i, e.target.value)} />
                      {tentang.nilai.length > 1 && <button type="button" onClick={() => handleRemoveNilai(i)} className="text-red-500 font-bold text-xl">×</button>}
                    </div>
                  ))}
                  <button type="button" onClick={handleAddNilai} className="px-4 py-1 rounded bg-primary/10 text-primary font-semibold w-fit mt-1">+ Tambah Nilai</button>
                </div>
                <button type="submit" className="px-6 py-2 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-accent transition-colors duration-200 w-fit self-end" disabled={loadingTentang}>{loadingTentang ? "Menyimpan..." : "Simpan"}</button>
                {notifTentang && <div className="text-green-600 text-sm mt-2">{notifTentang}</div>}
              </form>
            )}
            {activeTab === "guru" && (
              <form onSubmit={handleSaveGuru} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-8 max-w-4xl mx-auto">
                <h2 className="text-lg font-bold text-primary mb-2">Edit Guru & Staff</h2>
                {kategoriGuru.map((kat, idx) => (
                  <div key={kat.key} className="mb-8">
                    <label className="text-base font-semibold text-accent mb-4 block capitalize">{kat.label}</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {guru[kat.key as keyof typeof guru]?.map((item, i) => (
                        <div key={i} className="relative bg-white rounded-xl border border-primary/10 p-6 flex flex-col items-center shadow-sm max-w-xs mx-auto">
                          {/* Tombol hapus */}
                          {guru[kat.key as keyof typeof guru].length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveGuru(kat.key as keyof typeof guru, i)}
                              className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow hover:bg-red-50 z-10"
                              style={{ padding: 0 }}
                            >
                              <span className="text-lg text-red-500 leading-none flex items-center justify-center mt-[-1px]" style={{ lineHeight: 1 }}>
                                ×
                              </span>
                            </button>
                          )}
                          {/* Avatar */}
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent bg-white flex items-center justify-center">
                              {fotoPreview[`${kat.key}_${i}`] ? (
                                <Image src={fotoPreview[`${kat.key}_${i}`]} alt="Preview" width={80} height={80} className="object-cover w-full h-full rounded-full" />
                              ) : item.foto ? (
                                <Image src={item.foto} alt="Foto" width={80} height={80} className="object-cover w-full h-full rounded-full" />
                              ) : (
                                <span className="text-xs text-gray-400">No Foto</span>
                              )}
                            </div>
                            <label className="block mt-2">
                              <span className="sr-only">Upload Foto</span>
                              <input type="file" accept="image/*" className="hidden" onChange={async e => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                const reader = new FileReader()
                                reader.onload = ev => {
                                  setCropModal({ open: true, kategori: kat.key, index: i, file, src: ev.target?.result as string })
                                }
                                reader.readAsDataURL(file)
                              }} />
                              <span className="px-3 py-1 bg-primary text-white rounded-full text-xs font-semibold cursor-pointer hover:bg-accent transition">Upload Foto</span>
                            </label>
                          </div>
                          {/* Input nama & jabatan */}
                          <div className="flex flex-col gap-2 w-full mt-4">
                            <input type="text" className="p-2 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none font-semibold text-base text-center" placeholder="Nama" value={item.nama} onChange={e => handleChangeGuru(kat.key as keyof typeof guru, i, 'nama', e.target.value)} />
                            <input type="text" className="p-2 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none text-center" placeholder="Jabatan" value={item.jabatan} onChange={e => handleChangeGuru(kat.key as keyof typeof guru, i, 'jabatan', e.target.value)} />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Tombol tambah card */}
                    <button type="button" onClick={() => handleAddGuru(kat.key as keyof typeof guru)} className="mt-4 px-4 py-1 rounded-full bg-primary/10 text-primary font-semibold w-fit flex items-center gap-2 hover:bg-accent/10 transition text-sm"><span className="text-lg">+</span> Tambah {kat.label}</button>
                  </div>
                ))}
                <button type="submit" className="px-6 py-2 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-accent transition-colors duration-200 w-fit self-end" disabled={loadingGuru}>{loadingGuru ? "Menyimpan..." : "Simpan"}</button>
                {notifGuru && <div className="text-green-600 text-sm mt-2">{notifGuru}</div>}
              </form>
            )}
            {activeTab === "fasilitas" && <adminFasilitas />}
            {activeTab === "prestasi" && <adminPrestasi />}
            {activeTab === "kontak" && (
              <form onSubmit={handleSaveKontak} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4">
                <h2 className="text-lg font-bold text-primary mb-2">Kontak & Lokasi Sekolah</h2>
                <input type="text" className="p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none" placeholder="Alamat" value={kontakInput.alamat} onChange={e => setKontakInput(v => ({ ...v, alamat: e.target.value }))} />
                <input type="email" className="p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none" placeholder="Email" value={kontakInput.email} onChange={e => setKontakInput(v => ({ ...v, email: e.target.value }))} />
                <input type="text" className="p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none" placeholder="Nomor Telepon" value={kontakInput.telepon} onChange={e => setKontakInput(v => ({ ...v, telepon: e.target.value }))} />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text/70 mb-1 block">Latitude</label>
                    <input type="number" step="any" className="p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none w-full" value={kontakInput.lat || markerPos.lat} onChange={e => {
                      setKontakInput(v => ({ ...v, lat: e.target.value }))
                      setMarkerPos(pos => ({ ...pos, lat: parseFloat(e.target.value) }))
                    }} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text/70 mb-1 block">Longitude</label>
                    <input type="number" step="any" className="p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none w-full" value={kontakInput.lng || markerPos.lng} onChange={e => {
                      setKontakInput(v => ({ ...v, lng: e.target.value }))
                      setMarkerPos(pos => ({ ...pos, lng: parseFloat(e.target.value) }))
                    }} />
                  </div>
                </div>
                <div className="h-64 w-full rounded-lg overflow-hidden border border-primary/20">
                  {typeof window !== 'undefined' && (
                    <Map
                      center={[markerPos.lat, markerPos.lng]}
                      zoom={15}
                      style={{ height: '100%', width: '100%' }}
                      whenReady={() => setMapReady(true)}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker
                        position={[markerPos.lat, markerPos.lng]}
                        draggable={true}
                        eventHandlers={{
                          dragend: (e: any) => {
                            const lat = e.target.getLatLng().lat
                            const lng = e.target.getLatLng().lng
                            setMarkerPos({ lat, lng })
                            setKontakInput(v => ({ ...v, lat: lat.toString(), lng: lng.toString() }))
                          }
                        }}
                      />
                    </Map>
                  )}
                </div>
                <button type="submit" className="px-6 py-2 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-accent transition-colors duration-200 w-fit self-end" disabled={loadingKontak}>{loadingKontak ? "Menyimpan..." : "Simpan"}</button>
                {notifKontak && <div className="text-green-600 text-sm mt-2">{notifKontak}</div>}
              </form>
            )}
            {activeTab === "kategori_guru" && (
              <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 max-w-2xl mx-auto">
                <h2 className="text-lg font-bold text-primary mb-2">Kelola Kategori Guru</h2>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="kategoriGuruList">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-3">
                        {kategoriGuru.map((kat, idx) => (
                          <Draggable key={kat.key} draggableId={kat.key} index={idx} isDragDisabled={!!kat.fixed}>
                            {(prov, snapshot) => (
                              <div ref={prov.innerRef} {...prov.draggableProps} className={`flex items-center gap-3 bg-gray-50 rounded-lg border border-primary/10 px-4 py-2 shadow-sm ${snapshot.isDragging ? 'ring-2 ring-accent' : ''}`}> 
                                <span {...prov.dragHandleProps} className="cursor-move text-primary/60">☰</span>
                                {editIdx === idx ? (
                                  <input className="flex-1 p-2 rounded border border-primary/20" value={editLabel} onChange={e => setEditLabel(e.target.value)} onBlur={() => handleSaveLabel(idx)} autoFocus />
                                ) : (
                                  <span className="flex-1 font-semibold text-primary text-base" onClick={() => !kat.fixed && handleEditLabel(idx)}>{kat.label}</span>
                                )}
                                {!kat.fixed && (
                                  <button className="text-red-500 hover:bg-red-50 rounded-full w-7 h-7 flex items-center justify-center" onClick={() => handleHapusKategori(idx)}><span className="text-lg leading-none">×</span></button>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <div className="flex gap-2 mt-2">
                  <button onClick={handleTambahKategori} className="px-4 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm hover:bg-accent/10 transition">+ Tambah Kategori</button>
                  <button onClick={handleSimpanKategori} className="px-4 py-1 rounded-full bg-primary text-white font-semibold text-sm hover:bg-accent transition disabled:opacity-60" disabled={loadingKategori}>{loadingKategori ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
                </div>
                {/* Modal konfirmasi hapus */}
                {showConfirmHapus && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-white/60 text-center">
                      <h3 className="text-xl font-bold mb-4 text-primary">Hapus Kategori?</h3>
                      <p className="mb-6">Yakin ingin menghapus kategori <span className="font-semibold text-accent">{showConfirmHapus.label}</span>?</p>
                      <div className="flex gap-4 justify-center">
                        <button className="px-6 py-2 bg-gray-200 rounded shadow" onClick={() => setShowConfirmHapus(null)}>Batal</button>
                        <button className="px-6 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition" onClick={handleConfirmHapus}>Hapus</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "galeri" && <adminGaleri />}
            {activeTab === "ekstrakurikuler" && <adminEkstrakurikuler />}
          </div>
        </main>
      </div>
      {/* Modal cropper */}
      {cropModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative flex flex-col items-center">
            <h2 className="font-bold text-lg mb-2">Crop Foto Guru</h2>
            <div className="relative w-64 h-64 bg-gray-100 rounded-full overflow-hidden">
              <Cropper
                image={cropModal.src}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
              />
            </div>
            <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={e => setZoom(Number(e.target.value))} className="w-full my-4" />
            <div className="flex gap-4 mt-2">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setCropModal({ open: false })}>Batal</button>
              <button className="px-4 py-2 bg-primary text-white rounded" onClick={async () => {
                if (!cropModal.src || !cropModal.file || cropModal.kategori === undefined || cropModal.index === undefined) return
                if (!guru[cropModal.kategori as keyof typeof guru][cropModal.index].nama) {
                  alert('Isi nama guru sebelum upload foto!')
                  return
                }
                const blob = await getCroppedImg(cropModal.src, croppedAreaPixels)
                if (!blob) {
                  alert('Crop gagal, silakan ulangi!')
                  return
                }
                // Validasi size (misal 5MB)
                if (blob.size > 5 * 1024 * 1024) {
                  alert('Ukuran foto terlalu besar (maks 5MB)!')
                  return
                }
                // Preview hasil crop
                const previewUrl = URL.createObjectURL(blob)
                setFotoPreview(prev => ({ ...prev, [`${cropModal.kategori}_${cropModal.index}`]: previewUrl }))
                // Upload ke Supabase Storage
                try {
                  const fileName = `${guru[cropModal.kategori as keyof typeof guru][cropModal.index].nama.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.jpg`
                  const { data, error } = await supabase.storage.from('guru').upload(fileName, blob, { cacheControl: '3600', upsert: false })
                  if (error) {
                    if (error.message && error.message.toLowerCase().includes('file size')) {
                      alert('Ukuran foto terlalu besar (maks 5MB)!')
                    } else {
                      alert('Gagal upload foto: ' + error.message)
                    }
                    return
                  }
                  const { data: publicUrl } = supabase.storage.from('guru').getPublicUrl(fileName)
                  handleChangeGuru(cropModal.kategori as keyof typeof guru, cropModal.index, 'foto', publicUrl.publicUrl)
                } catch (err: any) {
                  alert('Gagal upload foto: ' + (err?.message || err))
                }
                setCropModal({ open: false })
              }}>Crop & Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 