'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, User, Users, GraduationCap, Briefcase } from 'lucide-react'
import { AdminCard, AdminFormField, AdminInput, AdminSelect, AdminButton } from './komponenForm'
import { AdminAlert, AdminModal } from './komponenUI'

interface Guru {
  id: number
  nama: string
  jabatan: string
  foto: string
  kategori: 'guru' | 'staff'
}

export default function AdminGuru() {
  const [guru, setGuru] = useState<Guru[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingGuru, setEditingGuru] = useState<Guru | null>(null)
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: '',
    foto: '',
    kategori: 'guru' as 'guru' | 'staff'
  })

  const kategoriOptions = [
    { value: 'guru', label: 'Guru' },
    { value: 'staff', label: 'Staff' }
  ]

  useEffect(() => {
    fetchGuru()
  }, [])

  const fetchGuru = async () => {
    try {
      const res = await fetch('/api/guru')
      if (res.ok) {
        const data = await res.json()
        setGuru(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching guru:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.nama.trim() || !formData.jabatan.trim()) {
      setMessage('Nama dan jabatan wajib diisi!')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/guru', {
        method: editingGuru ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGuru ? { id: editingGuru.id, ...formData } : formData)
      })

      if (res.ok) {
        setMessage(editingGuru ? 'Data guru/staff berhasil diupdate!' : 'Data guru/staff berhasil ditambahkan!')
        fetchGuru()
        handleCloseModal()
      } else {
        setMessage('Gagal menyimpan data!')
      }
    } catch (error) {
      setMessage('Gagal menyimpan data!')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (guru: Guru) => {
    setEditingGuru(guru)
    setFormData({
      nama: guru.nama,
      jabatan: guru.jabatan,
      foto: guru.foto,
      kategori: guru.kategori
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return

    try {
      const res = await fetch(`/api/guru?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessage('Data guru/staff berhasil dihapus!')
        fetchGuru()
      } else {
        setMessage('Gagal menghapus data!')
      }
    } catch (error) {
      setMessage('Gagal menghapus data!')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingGuru(null)
    setFormData({ nama: '', jabatan: '', foto: '', kategori: 'guru' })
    setMessage('')
  }

  const handleOpenModal = () => {
    setEditingGuru(null)
    setFormData({ nama: '', jabatan: '', foto: '', kategori: 'guru' })
    setShowModal(true)
  }

  const getKategoriIcon = (kategori: string) => {
    switch (kategori) {
      case 'guru': return GraduationCap
      case 'staff': return Briefcase
      default: return User
    }
  }

  const getKategoriLabel = (kategori: string) => {
    switch (kategori) {
      case 'guru': return 'Guru'
      case 'staff': return 'Staff'
      default: return 'Lainnya'
    }
  }

  // Group guru by kategori
  const groupedGuru = guru.reduce((acc, item) => {
    if (!acc[item.kategori]) {
      acc[item.kategori] = []
    }
    acc[item.kategori].push(item)
    return acc
  }, {} as Record<string, Guru[]>)

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminCard title="Kelola Guru & Staff" description="Tambah, edit, dan hapus data guru dan staff" icon={Users}>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Memuat data guru & staff...</p>
          </div>
        </AdminCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <AdminAlert 
          type={message.includes('berhasil') ? 'success' : 'error'}
          onClose={() => setMessage('')}
        >
          {message}
        </AdminAlert>
      )}

      {/* Header */}
      <AdminCard title="Kelola Guru & Staff" description="Tambah, edit, dan hapus data guru dan staff" icon={Users}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Daftar Guru & Staff</h3>
            <p className="text-sm text-gray-500">Total {guru.length} orang</p>
          </div>
          <AdminButton onClick={handleOpenModal} icon={Plus}>
            Tambah Data
          </AdminButton>
        </div>
      </AdminCard>

      {/* Daftar Guru & Staff */}
      <div className="space-y-6">
        {Object.keys(groupedGuru).length === 0 ? (
          <AdminCard title="Data Kosong" description="Belum ada data guru & staff" icon={Users}>
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada data guru & staff</h3>
              <p className="text-gray-500 mb-4">Mulai dengan menambahkan data pertama</p>
              <AdminButton onClick={handleOpenModal} icon={Plus}>
                Tambah Data Pertama
              </AdminButton>
            </div>
          </AdminCard>
        ) : (
          Object.entries(groupedGuru).map(([kategori, data]) => {
            const KategoriIcon = getKategoriIcon(kategori)
            return (
              <AdminCard key={kategori} title={getKategoriLabel(kategori)} description={`${data.length} orang`} icon={KategoriIcon}>
                <div className="mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                          {item.foto ? (
                            <img
                              src={item.foto}
                              alt={item.nama}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                            {item.nama}
                          </h4>
                          <p className="text-gray-600 text-xs line-clamp-2">
                            {item.jabatan}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <AdminButton
                            onClick={() => handleEdit(item)}
                            size="sm"
                            variant="outline"
                            icon={Edit}
                          />
                          <AdminButton
                            onClick={() => handleDelete(item.id)}
                            size="sm"
                            variant="danger"
                            icon={Trash2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              </AdminCard>
            )
          })
        )}
      </div>

      {/* Modal Form */}
      <AdminModal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingGuru ? 'Edit Data' : 'Tambah Data Baru'}
      >
        <div className="space-y-6">
          <AdminFormField label="Nama Lengkap" required>
            <AdminInput
              value={formData.nama}
              onChange={(val) => setFormData(prev => ({ ...prev, nama: val }))}
              placeholder="Masukkan nama lengkap"
            />
          </AdminFormField>

          <AdminFormField label="Jabatan" required>
            <AdminInput
              value={formData.jabatan}
              onChange={(val) => setFormData(prev => ({ ...prev, jabatan: val }))}
              placeholder="Contoh: Guru Matematika, Kepala Sekolah"
            />
          </AdminFormField>

          <AdminFormField label="Kategori">
            <AdminSelect
              value={formData.kategori}
              onChange={(val) => setFormData(prev => ({ ...prev, kategori: val as 'guru' | 'staff' }))}
              options={kategoriOptions}
              placeholder="Pilih kategori"
            />
          </AdminFormField>

          <AdminFormField label="URL Foto">
            <AdminInput
              value={formData.foto}
              onChange={(val) => setFormData(prev => ({ ...prev, foto: val }))}
              placeholder="https://example.com/foto.jpg"
            />
          </AdminFormField>

          <div className="flex justify-end gap-3">
            <AdminButton
              onClick={handleCloseModal}
              variant="secondary"
              icon={X}
            >
              Batal
            </AdminButton>
            <AdminButton
              onClick={handleSave}
              disabled={saving}
              loading={saving}
              icon={Save}
            >
              {editingGuru ? 'Update Data' : 'Simpan Data'}
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </div>
  )
}
