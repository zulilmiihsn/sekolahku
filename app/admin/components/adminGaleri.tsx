'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Trash2, Plus, Upload, Edit } from 'lucide-react'
import { supabase } from '../../utils/supabaseClient'

interface GaleriItem {
  id: number
  judul: string
  deskripsi: string
  foto: string[]
  kategori: string
  tanggal: string
}

export default function AdminGaleri() {
  const [galeri, setGaleri] = useState<GaleriItem[]>([])
  const [loading, setLoading] = useState(true)
  const [formGaleri, setFormGaleri] = useState({ judul: "", deskripsi: "", kategori: "", foto: [] as string[] })
  const [notifGaleri, setNotifGaleri] = useState("")
  const [showModalGaleri, setShowModalGaleri] = useState(false)
  const [showConfirmGaleri, setShowConfirmGaleri] = useState<{ id: number, judul: string } | null>(null)
  const [deleteLoadingGaleri, setDeleteLoadingGaleri] = useState(false)
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const [editIdGaleri, setEditIdGaleri] = useState<number | null>(null)

  useEffect(() => {
    fetchGaleri()
  }, [])

  const fetchGaleri = async () => {
    try {
      const res = await fetch('/api/galeri')
      if (res.ok) {
        const data = await res.json()
        setGaleri(data)
      }
    } catch (error) {
      console.error('Error fetching galeri:', error)
    } finally {
      setLoading(false)
    }
  }

  const uploadGaleriPhoto = async (file: File, judul: string) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${judul.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.${fileExt}`
    const { data, error } = await supabase.storage.from('galeri').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })
    if (error) throw error
    const { data: publicUrl } = supabase.storage.from('galeri').getPublicUrl(fileName)
    return publicUrl.publicUrl
  }

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    setUploadingFoto(true)
    
    try {
      const newFotos = await Promise.all(files.map(async (file) => {
        const url = await uploadGaleriPhoto(file, formGaleri.judul || 'galeri')
        return url
      }))
      setFormGaleri(prev => ({ ...prev, foto: [...prev.foto, ...newFotos] }))
    } catch (error) {
      setNotifGaleri('Gagal upload foto!')
    } finally {
      setUploadingFoto(false)
    }
  }

  const handleRemoveFoto = (index: number) => {
    setFormGaleri(prev => ({
      ...prev,
      foto: prev.foto.filter((_, i) => i !== index)
    }))
  }

  const handleSaveGaleri = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotifGaleri("")
    
    if (!formGaleri.judul || !formGaleri.kategori) {
      setNotifGaleri("Judul dan kategori wajib diisi!")
      return
    }

    try {
      const res = await fetch('/api/galeri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formGaleri,
          id: editIdGaleri,
          tanggal: new Date().toISOString()
        })
      })

      if (res.ok) {
        setFormGaleri({ judul: "", deskripsi: "", kategori: "", foto: [] })
        setEditIdGaleri(null)
        setShowModalGaleri(false)
        setNotifGaleri(editIdGaleri ? 'Galeri berhasil diupdate!' : 'Galeri berhasil ditambahkan!')
        fetchGaleri()
      } else {
        setNotifGaleri('Gagal menyimpan galeri!')
      }
    } catch (error) {
      setNotifGaleri('Gagal menyimpan galeri!')
    }
  }

  const handleEditGaleri = (item: GaleriItem) => {
    setFormGaleri({
      judul: item.judul,
      deskripsi: item.deskripsi,
      kategori: item.kategori,
      foto: item.foto
    })
    setEditIdGaleri(item.id)
    setShowModalGaleri(true)
  }

  const handleDeleteGaleri = async (id: number) => {
    setDeleteLoadingGaleri(true)
    try {
      const res = await fetch(`/api/galeri/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setNotifGaleri('Galeri berhasil dihapus!')
        fetchGaleri()
        setShowConfirmGaleri(null)
      } else {
        setNotifGaleri('Gagal menghapus galeri!')
      }
    } catch (error) {
      setNotifGaleri('Gagal menghapus galeri!')
    } finally {
      setDeleteLoadingGaleri(false)
    }
  }

  const handleCancelEdit = () => {
    setFormGaleri({ judul: "", deskripsi: "", kategori: "", foto: [] })
    setEditIdGaleri(null)
    setShowModalGaleri(false)
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-primary">Kelola Galeri</h2>
        <button
          onClick={() => setShowModalGaleri(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Galeri
        </button>
      </div>

      {notifGaleri && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {notifGaleri}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galeri.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {item.foto.length > 0 && (
              <div className="aspect-video relative">
                <Image
                  src={item.foto[0]}
                  alt={item.judul}
                  fill
                  className="object-cover"
                />
                {item.foto.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    +{item.foto.length - 1}
                  </div>
                )}
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg text-primary mb-2">{item.judul}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.deskripsi}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {item.kategori}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditGaleri(item)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowConfirmGaleri({ id: item.id, judul: item.judul })}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form Galeri */}
      {showModalGaleri && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-primary mb-4">
              {editIdGaleri ? 'Edit Galeri' : 'Tambah Galeri Baru'}
            </h3>
            <form onSubmit={handleSaveGaleri} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                <input
                  type="text"
                  value={formGaleri.judul}
                  onChange={(e) => setFormGaleri({ ...formGaleri, judul: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  value={formGaleri.kategori}
                  onChange={(e) => setFormGaleri({ ...formGaleri, kategori: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  <option value="acara">Acara</option>
                  <option value="kegiatan">Kegiatan</option>
                  <option value="prestasi">Prestasi</option>
                  <option value="fasilitas">Fasilitas</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={formGaleri.deskripsi}
                  onChange={(e) => setFormGaleri({ ...formGaleri, deskripsi: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleUploadFoto}
                    className="hidden"
                    id="foto-upload"
                  />
                  <label
                    htmlFor="foto-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {uploadingFoto ? 'Mengupload...' : 'Klik untuk upload foto'}
                    </span>
                  </label>
                </div>
                {formGaleri.foto.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {formGaleri.foto.map((foto, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={foto}
                          alt={`Foto ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                  {editIdGaleri ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showConfirmGaleri && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-primary mb-4">Hapus Galeri?</h3>
            <p className="text-gray-600 mb-6">
              Yakin ingin menghapus galeri <strong>&quot;{showConfirmGaleri.judul}&quot;</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmGaleri(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteGaleri(showConfirmGaleri.id)}
                disabled={deleteLoadingGaleri}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleteLoadingGaleri ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
