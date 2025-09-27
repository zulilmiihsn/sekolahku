'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Trash2, Edit, Plus } from 'lucide-react'

interface Berita {
  id: number
  judul: string
  deskripsi: string
  gambar?: string
  tanggal: string
  konten: string
}

interface AdminBeritaProps {
  siteName: string
  onNotif: (message: string) => void
}

export default function AdminBerita({ siteName, onNotif }: AdminBeritaProps) {
  const [berita, setBerita] = useState<Berita[]>([])
  const [loading, setLoading] = useState(true)
  const [formBerita, setFormBerita] = useState({ judul: "", deskripsi: "", gambar: "", konten: "" })
  const [kontenBerita, setKontenBerita] = useState("")
  const [editIdBerita, setEditIdBerita] = useState<number | null>(null)
  const [notifBerita, setNotifBerita] = useState("")
  const [showModalBerita, setShowModalBerita] = useState(false)
  const [showConfirmBerita, setShowConfirmBerita] = useState<{ id: number, judul: string } | null>(null)
  const [deleteLoadingBerita, setDeleteLoadingBerita] = useState(false)

  useEffect(() => {
    fetchBerita()
  }, [])

  const fetchBerita = async () => {
    try {
      const res = await fetch('/api/berita')
      if (res.ok) {
        const data = await res.json()
        setBerita(Array.isArray(data) ? data : [])
      } else {
        setBerita([])
      }
    } catch (error) {
      console.error('Error fetching berita:', error)
      setBerita([])
    } finally {
      setLoading(false)
    }
  }

  const handleSaveBerita = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotifBerita("")
    
    if (!formBerita.judul || !formBerita.deskripsi || !kontenBerita) {
      setNotifBerita("Judul, deskripsi, dan konten wajib diisi!")
      return
    }

    try {
      const res = await fetch('/api/berita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formBerita,
          konten: kontenBerita,
          id: editIdBerita
        })
      })

      if (res.ok) {
        setFormBerita({ judul: "", deskripsi: "", gambar: "", konten: "" })
        setKontenBerita("")
        setEditIdBerita(null)
        setShowModalBerita(false)
        setNotifBerita(editIdBerita ? 'Berita berhasil diupdate!' : 'Berita berhasil ditambahkan!')
        fetchBerita()
        onNotif(editIdBerita ? 'Berita berhasil diupdate!' : 'Berita berhasil ditambahkan!')
      } else {
        setNotifBerita('Gagal menyimpan berita!')
      }
    } catch (error) {
      setNotifBerita('Gagal menyimpan berita!')
    }
  }

  const handleEditBerita = (item: Berita) => {
    setFormBerita({
      judul: item.judul,
      deskripsi: item.deskripsi,
      gambar: item.gambar || "",
      konten: ""
    })
    setKontenBerita(item.konten)
    setEditIdBerita(item.id)
    setShowModalBerita(true)
  }

  const handleDeleteBerita = async (id: number) => {
    setDeleteLoadingBerita(true)
    try {
      const res = await fetch(`/api/berita/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setNotifBerita('Berita berhasil dihapus!')
        onNotif('Berita berhasil dihapus!')
        fetchBerita()
        setShowConfirmBerita(null)
      } else {
        setNotifBerita('Gagal menghapus berita!')
      }
    } catch (error) {
      setNotifBerita('Gagal menghapus berita!')
    } finally {
      setDeleteLoadingBerita(false)
    }
  }

  const handleCancelEdit = () => {
    setFormBerita({ judul: "", deskripsi: "", gambar: "", konten: "" })
    setKontenBerita("")
    setEditIdBerita(null)
    setShowModalBerita(false)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-primary">Kelola Berita</h2>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data berita...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-primary">Kelola Berita</h2>
        <button
          onClick={() => setShowModalBerita(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Berita
        </button>
      </div>

      {notifBerita && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {notifBerita}
        </div>
      )}

      <div className="space-y-4">
        {Array.isArray(berita) && berita.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-primary mb-2">{item.judul}</h3>
                <p className="text-gray-600 mb-2">{item.deskripsi}</p>
                <p className="text-sm text-gray-500">
                  {new Date(item.tanggal).toLocaleDateString('id-ID')}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEditBerita(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowConfirmBerita({ id: item.id, judul: item.judul })}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {item.gambar && (
              <div className="mt-3">
                <Image
                  src={item.gambar}
                  alt={item.judul}
                  width={200}
                  height={120}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Form Berita */}
      {showModalBerita && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-primary mb-4">
              {editIdBerita ? 'Edit Berita' : 'Tambah Berita Baru'}
            </h3>
            <form onSubmit={handleSaveBerita} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                <input
                  type="text"
                  value={formBerita.judul}
                  onChange={(e) => setFormBerita({ ...formBerita, judul: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={formBerita.deskripsi}
                  onChange={(e) => setFormBerita({ ...formBerita, deskripsi: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar URL (opsional)</label>
                <input
                  type="url"
                  value={formBerita.gambar}
                  onChange={(e) => setFormBerita({ ...formBerita, gambar: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konten</label>
                <textarea
                  value={kontenBerita}
                  onChange={(e) => setKontenBerita(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={10}
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
                >
                  {editIdBerita ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showConfirmBerita && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-primary mb-4">Hapus Berita?</h3>
            <p className="text-gray-600 mb-6">
              Yakin ingin menghapus berita <strong>&quot;{showConfirmBerita.judul}&quot;</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmBerita(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteBerita(showConfirmBerita.id)}
                disabled={deleteLoadingBerita}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleteLoadingBerita ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
