'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Trash2, Edit, Plus, Upload } from 'lucide-react'
import { supabase } from '../../utils/supabaseClient'

interface Ekstrakurikuler {
  id: number
  nama: string
  deskripsi: string
  foto: string
  pembina: string
  jadwal: string
  kuota: number
  aktif: boolean
}

export default function AdminEkstrakurikuler() {
  const [ekstrakurikuler, setEkstrakurikuler] = useState<Ekstrakurikuler[]>([])
  const [loading, setLoading] = useState(true)
  const [formEkstrakurikuler, setFormEkstrakurikuler] = useState({
    nama: "",
    deskripsi: "",
    foto: "",
    pembina: "",
    jadwal: "",
    kuota: 0,
    aktif: true
  })
  const [notifEkstrakurikuler, setNotifEkstrakurikuler] = useState("")
  const [showModalEkstrakurikuler, setShowModalEkstrakurikuler] = useState(false)
  const [showConfirmEkstrakurikuler, setShowConfirmEkstrakurikuler] = useState<{ id: number, nama: string } | null>(null)
  const [deleteLoadingEkstrakurikuler, setDeleteLoadingEkstrakurikuler] = useState(false)
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const [editIdEkstrakurikuler, setEditIdEkstrakurikuler] = useState<number | null>(null)

  useEffect(() => {
    fetchEkstrakurikuler()
  }, [])

  const fetchEkstrakurikuler = async () => {
    try {
      const res = await fetch('/api/ekstrakurikuler')
      if (res.ok) {
        const data = await res.json()
        setEkstrakurikuler(Array.isArray(data) ? data : [])
      } else {
        setEkstrakurikuler([])
      }
    } catch (error) {
      console.error('Error fetching ekstrakurikuler:', error)
      setEkstrakurikuler([])
    } finally {
      setLoading(false)
    }
  }

  const uploadEkstrakurikulerPhoto = async (file: File, nama: string) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${nama.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.${fileExt}`
    const { data, error } = await supabase.storage.from('ekstrakurikuler').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })
    if (error) throw error
    const { data: publicUrl } = supabase.storage.from('ekstrakurikuler').getPublicUrl(fileName)
    return publicUrl.publicUrl
  }

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    const file = e.target.files[0]
    setUploadingFoto(true)
    
    try {
      const url = await uploadEkstrakurikulerPhoto(file, formEkstrakurikuler.nama || 'ekstrakurikuler')
      setFormEkstrakurikuler(prev => ({ ...prev, foto: url }))
    } catch (error) {
      setNotifEkstrakurikuler('Gagal upload foto!')
    } finally {
      setUploadingFoto(false)
    }
  }

  const handleSaveEkstrakurikuler = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotifEkstrakurikuler("")
    
    if (!formEkstrakurikuler.nama || !formEkstrakurikuler.deskripsi || !formEkstrakurikuler.pembina) {
      setNotifEkstrakurikuler("Nama, deskripsi, dan pembina wajib diisi!")
      return
    }

    try {
      const res = await fetch('/api/ekstrakurikuler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formEkstrakurikuler,
          id: editIdEkstrakurikuler
        })
      })

      if (res.ok) {
        setFormEkstrakurikuler({
          nama: "",
          deskripsi: "",
          foto: "",
          pembina: "",
          jadwal: "",
          kuota: 0,
          aktif: true
        })
        setEditIdEkstrakurikuler(null)
        setShowModalEkstrakurikuler(false)
        setNotifEkstrakurikuler(editIdEkstrakurikuler ? 'Ekstrakurikuler berhasil diupdate!' : 'Ekstrakurikuler berhasil ditambahkan!')
        fetchEkstrakurikuler()
      } else {
        setNotifEkstrakurikuler('Gagal menyimpan ekstrakurikuler!')
      }
    } catch (error) {
      setNotifEkstrakurikuler('Gagal menyimpan ekstrakurikuler!')
    }
  }

  const handleEditEkstrakurikuler = (item: Ekstrakurikuler) => {
    setFormEkstrakurikuler({
      nama: item.nama,
      deskripsi: item.deskripsi,
      foto: item.foto,
      pembina: item.pembina,
      jadwal: item.jadwal,
      kuota: item.kuota,
      aktif: item.aktif
    })
    setEditIdEkstrakurikuler(item.id)
    setShowModalEkstrakurikuler(true)
  }

  const handleDeleteEkstrakurikuler = async (id: number) => {
    setDeleteLoadingEkstrakurikuler(true)
    try {
      const res = await fetch(`/api/ekstrakurikuler/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setNotifEkstrakurikuler('Ekstrakurikuler berhasil dihapus!')
        fetchEkstrakurikuler()
        setShowConfirmEkstrakurikuler(null)
      } else {
        setNotifEkstrakurikuler('Gagal menghapus ekstrakurikuler!')
      }
    } catch (error) {
      setNotifEkstrakurikuler('Gagal menghapus ekstrakurikuler!')
    } finally {
      setDeleteLoadingEkstrakurikuler(false)
    }
  }

  const handleCancelEdit = () => {
    setFormEkstrakurikuler({
      nama: "",
      deskripsi: "",
      foto: "",
      pembina: "",
      jadwal: "",
      kuota: 0,
      aktif: true
    })
    setEditIdEkstrakurikuler(null)
    setShowModalEkstrakurikuler(false)
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-primary">Kelola Ekstrakurikuler</h2>
        <button
          onClick={() => setShowModalEkstrakurikuler(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Ekstrakurikuler
        </button>
      </div>

      {notifEkstrakurikuler && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {notifEkstrakurikuler}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(ekstrakurikuler) && ekstrakurikuler.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {item.foto && (
              <div className="aspect-video relative">
                <Image
                  src={item.foto}
                  alt={item.nama}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.aktif ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}>
                    {item.aktif ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg text-primary mb-2">{item.nama}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.deskripsi}</p>
              <div className="space-y-1 text-xs text-gray-500">
                <p><strong>Pembina:</strong> {item.pembina}</p>
                <p><strong>Jadwal:</strong> {item.jadwal}</p>
                <p><strong>Kuota:</strong> {item.kuota} siswa</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditEkstrakurikuler(item)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowConfirmEkstrakurikuler({ id: item.id, nama: item.nama })}
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

      {/* Modal Form Ekstrakurikuler */}
      {showModalEkstrakurikuler && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-primary mb-4">
              {editIdEkstrakurikuler ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler Baru'}
            </h3>
            <form onSubmit={handleSaveEkstrakurikuler} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ekstrakurikuler</label>
                <input
                  type="text"
                  value={formEkstrakurikuler.nama}
                  onChange={(e) => setFormEkstrakurikuler({ ...formEkstrakurikuler, nama: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={formEkstrakurikuler.deskripsi}
                  onChange={(e) => setFormEkstrakurikuler({ ...formEkstrakurikuler, deskripsi: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pembina</label>
                  <input
                    type="text"
                    value={formEkstrakurikuler.pembina}
                    onChange={(e) => setFormEkstrakurikuler({ ...formEkstrakurikuler, pembina: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jadwal</label>
                  <input
                    type="text"
                    value={formEkstrakurikuler.jadwal}
                    onChange={(e) => setFormEkstrakurikuler({ ...formEkstrakurikuler, jadwal: e.target.value })}
                    placeholder="Contoh: Senin, 15:00-17:00"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kuota Siswa</label>
                  <input
                    type="number"
                    value={formEkstrakurikuler.kuota}
                    onChange={(e) => setFormEkstrakurikuler({ ...formEkstrakurikuler, kuota: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="0"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formEkstrakurikuler.aktif}
                      onChange={(e) => setFormEkstrakurikuler({ ...formEkstrakurikuler, aktif: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Aktif</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
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
                {formEkstrakurikuler.foto && (
                  <div className="mt-4">
                    <Image
                      src={formEkstrakurikuler.foto}
                      alt="Preview"
                      width={200}
                      height={120}
                      className="rounded-lg object-cover"
                    />
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
                  {editIdEkstrakurikuler ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showConfirmEkstrakurikuler && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-primary mb-4">Hapus Ekstrakurikuler?</h3>
            <p className="text-gray-600 mb-6">
              Yakin ingin menghapus ekstrakurikuler <strong>&quot;{showConfirmEkstrakurikuler.nama}&quot;</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmEkstrakurikuler(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteEkstrakurikuler(showConfirmEkstrakurikuler.id)}
                disabled={deleteLoadingEkstrakurikuler}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleteLoadingEkstrakurikuler ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
