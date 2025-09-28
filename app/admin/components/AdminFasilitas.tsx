"use client"

import { useState, useEffect } from 'react'
import { Building2, Plus, Edit, Trash2, Wifi, Car, BookOpen, Users, Camera, Monitor } from 'lucide-react'
import { AdminCard, AdminFormField, AdminInput, AdminTextarea, AdminSelect, AdminButton } from './komponenForm'
import { AdminModal, AdminAlert } from './komponenUI'
import { LoadingSpinner, SkeletonLoader } from '../../../components/loadingSpinner'

interface Fasilitas {
  id: number
  nama: string
  deskripsi: string
  kategori: string
  kapasitas?: number
  status: 'tersedia' | 'maintenance' | 'tidak_tersedia'
  foto?: string
}

const kategoriOptions = [
  { value: 'akademik', label: 'Akademik' },
  { value: 'olahraga', label: 'Olahraga' },
  { value: 'teknologi', label: 'Teknologi' },
  { value: 'kesehatan', label: 'Kesehatan' },
  { value: 'ibadah', label: 'Ibadah' },
  { value: 'lainnya', label: 'Lainnya' }
]

const statusOptions = [
  { value: 'tersedia', label: 'Tersedia' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'tidak_tersedia', label: 'Tidak Tersedia' }
]

export default function AdminFasilitas() {
  const [fasilitas, setFasilitas] = useState<Fasilitas[]>([])
  const [loading, setLoading] = useState(true)
  const [formFasilitas, setFormFasilitas] = useState({
    nama: '',
    deskripsi: '',
    kategori: '',
    kapasitas: 0,
    status: 'tersedia' as const,
    foto: ''
  })
  const [notif, setNotif] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState<{ id: number, nama: string } | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    fetchFasilitas()
  }, [])

  const fetchFasilitas = async () => {
    try {
      const res = await fetch('/api/fasilitas')
      if (res.ok) {
        const data = await res.json()
        setFasilitas(Array.isArray(data) ? data : [])
      } else {
        setFasilitas([])
      }
    } catch (error) {
      console.error('Error fetching fasilitas:', error)
      setFasilitas([])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotif('')
    
    if (!formFasilitas.nama || !formFasilitas.deskripsi || !formFasilitas.kategori) {
      setNotif('Nama, deskripsi, dan kategori wajib diisi!')
      return
    }

    try {
      const res = await fetch('/api/fasilitas', {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editId ? { id: editId, ...formFasilitas } : formFasilitas)
      })

      if (res.ok) {
        setNotif(editId ? 'Fasilitas berhasil diupdate!' : 'Fasilitas berhasil ditambahkan!')
        fetchFasilitas()
        setFormFasilitas({
          nama: '',
          deskripsi: '',
          kategori: '',
          kapasitas: 0,
          status: 'tersedia',
          foto: ''
        })
        setEditId(null)
        setShowModal(false)
      } else {
        setNotif('Gagal menyimpan fasilitas!')
      }
    } catch (error) {
      setNotif('Gagal menyimpan fasilitas!')
    }
  }

  const handleEdit = (item: Fasilitas) => {
    setFormFasilitas({
      nama: item.nama,
      deskripsi: item.deskripsi,
      kategori: item.kategori,
      kapasitas: item.kapasitas || 0,
      status: item.status,
      foto: item.foto || ''
    })
    setEditId(item.id)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/fasilitas?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setNotif('Fasilitas berhasil dihapus!')
        fetchFasilitas()
        setShowConfirm(null)
      } else {
        setNotif('Gagal menghapus fasilitas!')
      }
    } catch (error) {
      setNotif('Gagal menghapus fasilitas!')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCancel = () => {
    setFormFasilitas({
      nama: '',
      deskripsi: '',
      kategori: '',
      kapasitas: 0,
      status: 'tersedia',
      foto: ''
    })
    setEditId(null)
    setShowModal(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'tersedia': return 'bg-green-100 text-green-700'
      case 'maintenance': return 'bg-yellow-100 text-yellow-700'
      case 'tidak_tersedia': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getKategoriIcon = (kategori: string) => {
    switch (kategori) {
      case 'teknologi': return Monitor
      case 'akademik': return BookOpen
      case 'olahraga': return Users
      case 'kesehatan': return Users
      case 'ibadah': return Users
      default: return Building2
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminCard
          title="Kelola Fasilitas"
          description="Tambah, edit, dan hapus fasilitas sekolah"
          icon={Building2}
        >
          <LoadingSpinner message="Memuat data fasilitas..." />
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
        title="Kelola Fasilitas"
        description="Tambah, edit, dan hapus fasilitas sekolah"
        icon={Building2}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Daftar Fasilitas</h3>
            <p className="text-sm text-gray-600">Total {fasilitas.length} fasilitas</p>
          </div>
          <AdminButton
            onClick={() => setShowModal(true)}
            icon={Plus}
          >
            Tambah Fasilitas
          </AdminButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fasilitas.map((item) => {
            const KategoriIcon = getKategoriIcon(item.kategori)
            return (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <KategoriIcon className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-gray-900">{item.nama}</h4>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowConfirm({ id: item.id, nama: item.nama })}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.deskripsi}</p>
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {statusOptions.find(s => s.value === item.status)?.label}
                  </span>
                  {item.kapasitas && (
                    <span className="text-xs text-gray-500">
                      Kapasitas: {item.kapasitas}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </AdminCard>

      <AdminModal
        isOpen={showModal}
        onClose={handleCancel}
        title={editId ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <AdminFormField label="Nama Fasilitas" required>
            <AdminInput
              value={formFasilitas.nama}
              onChange={(val) => setFormFasilitas(prev => ({ ...prev, nama: val }))}
              placeholder="Masukkan nama fasilitas"
            />
          </AdminFormField>

          <AdminFormField label="Deskripsi" required>
            <AdminTextarea
              value={formFasilitas.deskripsi}
              onChange={(val) => setFormFasilitas(prev => ({ ...prev, deskripsi: val }))}
              placeholder="Deskripsi lengkap fasilitas"
              rows={3}
            />
          </AdminFormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminFormField label="Kategori" required>
              <AdminSelect
                value={formFasilitas.kategori}
                onChange={(val) => setFormFasilitas(prev => ({ ...prev, kategori: val }))}
                options={kategoriOptions}
                placeholder="Pilih kategori"
              />
            </AdminFormField>

            <AdminFormField label="Status">
              <AdminSelect
                value={formFasilitas.status}
                onChange={(val) => setFormFasilitas(prev => ({ ...prev, status: val as any }))}
                options={statusOptions}
              />
            </AdminFormField>
          </div>

          <AdminFormField label="Kapasitas (opsional)">
            <AdminInput
              type="number"
              value={formFasilitas.kapasitas}
              onChange={(val) => setFormFasilitas(prev => ({ ...prev, kapasitas: parseInt(val) || 0 }))}
              placeholder="Jumlah kapasitas"
              min={0}
            />
          </AdminFormField>

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
        title="Hapus Fasilitas?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Yakin ingin menghapus fasilitas <strong>"{showConfirm?.nama}"</strong>?
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