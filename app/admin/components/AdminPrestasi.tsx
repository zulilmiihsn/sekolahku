"use client"

import { useState, useEffect } from 'react'
import { Award, Plus, Edit, Trash2, Trophy, Medal, Star, Calendar } from 'lucide-react'
import { AdminCard, AdminFormField, AdminInput, AdminTextarea, AdminSelect, AdminButton } from './komponenForm'
import { AdminModal, AdminAlert } from './komponen-ui'
import { LoadingSpinner } from '../../../components/loadingSpinner'

interface Prestasi {
  id: number
  judul: string
  deskripsi: string
  kategori: string
  tingkat: string
  tahun: string
  pencapaian: string
  foto?: string
}

const kategoriOptions = [
  { value: 'akademik', label: 'Akademik' },
  { value: 'olahraga', label: 'Olahraga' },
  { value: 'seni', label: 'Seni & Budaya' },
  { value: 'teknologi', label: 'Teknologi' },
  { value: 'sosial', label: 'Sosial' },
  { value: 'lainnya', label: 'Lainnya' }
]

const tingkatOptions = [
  { value: 'sekolah', label: 'Sekolah' },
  { value: 'kecamatan', label: 'Kecamatan' },
  { value: 'kabupaten', label: 'Kabupaten/Kota' },
  { value: 'provinsi', label: 'Provinsi' },
  { value: 'nasional', label: 'Nasional' },
  { value: 'internasional', label: 'Internasional' }
]

const pencapaianOptions = [
  { value: 'juara_1', label: 'Juara 1' },
  { value: 'juara_2', label: 'Juara 2' },
  { value: 'juara_3', label: 'Juara 3' },
  { value: 'harapan_1', label: 'Harapan 1' },
  { value: 'harapan_2', label: 'Harapan 2' },
  { value: 'harapan_3', label: 'Harapan 3' },
  { value: 'finalis', label: 'Finalis' },
  { value: 'peserta', label: 'Peserta' }
]

export default function AdminPrestasi() {
  const [prestasi, setPrestasi] = useState<Prestasi[]>([])
  const [loading, setLoading] = useState(true)
  const [formPrestasi, setFormPrestasi] = useState({
    judul: '',
    deskripsi: '',
    kategori: '',
    tingkat: '',
    tahun: new Date().getFullYear().toString(),
    pencapaian: '',
    foto: ''
  })
  const [notif, setNotif] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState<{ id: number, judul: string } | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    fetchPrestasi()
  }, [])

  const fetchPrestasi = async () => {
    try {
      const res = await fetch('/api/prestasi')
      if (res.ok) {
        const data = await res.json()
        setPrestasi(Array.isArray(data) ? data : [])
      } else {
        setPrestasi([])
      }
    } catch (error) {
      console.error('Error fetching prestasi:', error)
      setPrestasi([])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotif('')
    
    if (!formPrestasi.judul || !formPrestasi.deskripsi || !formPrestasi.kategori || !formPrestasi.tingkat || !formPrestasi.pencapaian) {
      setNotif('Judul, deskripsi, kategori, tingkat, dan pencapaian wajib diisi!')
      return
    }

    try {
      const res = await fetch('/api/prestasi', {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editId ? { id: editId, ...formPrestasi } : formPrestasi)
      })

      if (res.ok) {
        setNotif(editId ? 'Prestasi berhasil diupdate!' : 'Prestasi berhasil ditambahkan!')
        fetchPrestasi()
        setFormPrestasi({
          judul: '',
          deskripsi: '',
          kategori: '',
          tingkat: '',
          tahun: new Date().getFullYear().toString(),
          pencapaian: '',
          foto: ''
        })
        setEditId(null)
        setShowModal(false)
      } else {
        setNotif('Gagal menyimpan prestasi!')
      }
    } catch (error) {
      setNotif('Gagal menyimpan prestasi!')
    }
  }

  const handleEdit = (item: Prestasi) => {
    setFormPrestasi({
      judul: item.judul,
      deskripsi: item.deskripsi,
      kategori: item.kategori,
      tingkat: item.tingkat,
      tahun: item.tahun,
      pencapaian: item.pencapaian,
      foto: item.foto || ''
    })
    setEditId(item.id)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/prestasi?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setNotif('Prestasi berhasil dihapus!')
        fetchPrestasi()
        setShowConfirm(null)
      } else {
        setNotif('Gagal menghapus prestasi!')
      }
    } catch (error) {
      setNotif('Gagal menghapus prestasi!')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCancel = () => {
    setFormPrestasi({
      judul: '',
      deskripsi: '',
      kategori: '',
      tingkat: '',
      tahun: new Date().getFullYear().toString(),
      pencapaian: '',
      foto: ''
    })
    setEditId(null)
    setShowModal(false)
  }

  const getPencapaianColor = (pencapaian: string) => {
    switch (pencapaian) {
      case 'juara_1': return 'bg-yellow-100 text-yellow-700'
      case 'juara_2': return 'bg-gray-100 text-gray-700'
      case 'juara_3': return 'bg-orange-100 text-orange-700'
      case 'harapan_1':
      case 'harapan_2':
      case 'harapan_3': return 'bg-blue-100 text-blue-700'
      case 'finalis': return 'bg-green-100 text-green-700'
      case 'peserta': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTingkatIcon = (tingkat: string) => {
    switch (tingkat) {
      case 'sekolah': return Star
      case 'kecamatan': return Medal
      case 'kabupaten': return Trophy
      case 'provinsi': return Award
      case 'nasional': return Award
      case 'internasional': return Award
      default: return Award
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminCard
          title="Kelola Prestasi"
          description="Tambah, edit, dan hapus prestasi sekolah"
          icon={Award}
        >
          <LoadingSpinner message="Memuat data prestasi..." />
        </AdminCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {notif && (
        <AdminAlert 
          type={notif.includes('berhasil') ? 'success' : 'error'}
          onClose={() => setNotif('')}
        >
          {notif}
        </AdminAlert>
      )}

      <AdminCard
        title="Kelola Prestasi"
        description="Tambah, edit, dan hapus prestasi sekolah"
        icon={Award}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Daftar Prestasi</h3>
            <p className="text-sm text-gray-600">Total {prestasi.length} prestasi</p>
          </div>
          <AdminButton
            onClick={() => setShowModal(true)}
            icon={Plus}
          >
            Tambah Prestasi
          </AdminButton>
        </div>

        <div className="space-y-4">
          {prestasi.map((item) => {
            const TingkatIcon = getTingkatIcon(item.tingkat)
            return (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <TingkatIcon className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{item.judul}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.deskripsi}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.tahun}
                        </span>
                        <span className="capitalize">{item.tingkat}</span>
                        <span className="capitalize">{item.kategori}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowConfirm({ id: item.id, judul: item.judul })}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPencapaianColor(item.pencapaian)}`}>
                    {pencapaianOptions.find(p => p.value === item.pencapaian)?.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </AdminCard>

      <AdminModal
        isOpen={showModal}
        onClose={handleCancel}
        title={editId ? 'Edit Prestasi' : 'Tambah Prestasi Baru'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <AdminFormField label="Judul Prestasi" required>
            <AdminInput
              value={formPrestasi.judul}
              onChange={(val) => setFormPrestasi(prev => ({ ...prev, judul: val }))}
              placeholder="Masukkan judul prestasi"
            />
          </AdminFormField>

          <AdminFormField label="Deskripsi" required>
            <AdminTextarea
              value={formPrestasi.deskripsi}
              onChange={(val) => setFormPrestasi(prev => ({ ...prev, deskripsi: val }))}
              placeholder="Deskripsi lengkap prestasi"
              rows={3}
            />
          </AdminFormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminFormField label="Kategori" required>
              <AdminSelect
                value={formPrestasi.kategori}
                onChange={(val) => setFormPrestasi(prev => ({ ...prev, kategori: val }))}
                options={kategoriOptions}
                placeholder="Pilih kategori"
              />
            </AdminFormField>

            <AdminFormField label="Tingkat" required>
              <AdminSelect
                value={formPrestasi.tingkat}
                onChange={(val) => setFormPrestasi(prev => ({ ...prev, tingkat: val }))}
                options={tingkatOptions}
                placeholder="Pilih tingkat"
              />
            </AdminFormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminFormField label="Tahun" required>
              <AdminInput
                type="number"
                value={formPrestasi.tahun}
                onChange={(val) => setFormPrestasi(prev => ({ ...prev, tahun: val }))}
                placeholder="2024"
                min={2000}
                max={new Date().getFullYear()}
              />
            </AdminFormField>

            <AdminFormField label="Pencapaian" required>
              <AdminSelect
                value={formPrestasi.pencapaian}
                onChange={(val) => setFormPrestasi(prev => ({ ...prev, pencapaian: val }))}
                options={pencapaianOptions}
                placeholder="Pilih pencapaian"
              />
            </AdminFormField>
          </div>

          <div className="flex gap-3 justify-end">
            <AdminButton
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Batal
            </AdminButton>
            <AdminButton type="submit">
              {editId ? 'Update' : 'Simpan'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      <AdminModal
        isOpen={!!showConfirm}
        onClose={() => setShowConfirm(null)}
        title="Hapus Prestasi?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Yakin ingin menghapus prestasi <strong>&quot;{showConfirm?.judul}&quot;</strong>?
          </p>
          <div className="flex gap-3 justify-end">
            <AdminButton
              variant="outline"
              onClick={() => setShowConfirm(null)}
            >
              Batal
            </AdminButton>
            <AdminButton
              variant="danger"
              onClick={() => showConfirm && handleDelete(showConfirm.id)}
              loading={deleteLoading}
            >
              {deleteLoading ? 'Menghapus...' : 'Hapus'}
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </div>
  )
} 