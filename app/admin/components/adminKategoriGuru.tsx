"use client"

import { useState, useEffect } from 'react'
import { Settings, Plus, Edit, Trash2, Users } from 'lucide-react'
import { AdminCard, AdminFormField, AdminInput, AdminButton } from './komponenForm'
import { AdminModal, AdminAlert } from './komponen-ui'
import { LoadingSpinner } from '../../../components/loadingSpinner'

interface KategoriGuru {
  id: number
  key: string
  label: string
  deskripsi?: string
  warna?: string
}

export default function AdminKategoriGuru() {
  const [kategori, setKategori] = useState<KategoriGuru[]>([])
  const [loading, setLoading] = useState(true)
  const [formKategori, setFormKategori] = useState({
    key: '',
    label: '',
    deskripsi: '',
    warna: '#3B82F6'
  })
  const [notif, setNotif] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState<{ id: number, label: string } | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    fetchKategori()
  }, [])

  const fetchKategori = async () => {
    try {
      // Simulasi data untuk demo
      const mockData: KategoriGuru[] = [
        {
          id: 1,
          key: 'guru',
          label: 'Guru',
          deskripsi: 'Tenaga pendidik yang mengajar mata pelajaran',
          warna: '#3B82F6'
        },
        {
          id: 2,
          key: 'staff',
          label: 'Staff',
          deskripsi: 'Tenaga kependidikan yang mendukung operasional sekolah',
          warna: '#10B981'
        },
        {
          id: 3,
          key: 'kepala_sekolah',
          label: 'Kepala Sekolah',
          deskripsi: 'Pimpinan tertinggi di sekolah',
          warna: '#F59E0B'
        },
        {
          id: 4,
          key: 'wakil_kepala',
          label: 'Wakil Kepala Sekolah',
          deskripsi: 'Wakil pimpinan sekolah',
          warna: '#8B5CF6'
        }
      ]
      setKategori(mockData)
    } catch (error) {
      console.error('Error fetching kategori:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotif('')
    
    if (!formKategori.key || !formKategori.label) {
      setNotif('Key dan label wajib diisi!')
      return
    }

    // Validasi key unik
    const existingKey = kategori.find(k => k.key === formKategori.key && k.id !== editId)
    if (existingKey) {
      setNotif('Key sudah digunakan!')
      return
    }

    try {
      const newKategori: KategoriGuru = {
        id: editId || Date.now(),
        ...formKategori
      }

      if (editId) {
        setKategori(prev => prev.map(k => k.id === editId ? newKategori : k))
        setNotif('Kategori berhasil diupdate!')
      } else {
        setKategori(prev => [...prev, newKategori])
        setNotif('Kategori berhasil ditambahkan!')
      }

      setFormKategori({
        key: '',
        label: '',
        deskripsi: '',
        warna: '#3B82F6'
      })
      setEditId(null)
      setShowModal(false)
    } catch (error) {
      setNotif('Gagal menyimpan kategori!')
    }
  }

  const handleEdit = (item: KategoriGuru) => {
    setFormKategori({
      key: item.key,
      label: item.label,
      deskripsi: item.deskripsi || '',
      warna: item.warna || '#3B82F6'
    })
    setEditId(item.id)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    setDeleteLoading(true)
    try {
      setKategori(prev => prev.filter(k => k.id !== id))
      setNotif('Kategori berhasil dihapus!')
      setShowConfirm(null)
    } catch (error) {
      setNotif('Gagal menghapus kategori!')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCancel = () => {
    setFormKategori({
      key: '',
      label: '',
      deskripsi: '',
      warna: '#3B82F6'
    })
    setEditId(null)
    setShowModal(false)
  }

  const predefinedColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#EC4899', // Pink
    '#6B7280'  // Gray
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminCard
          title="Kelola Kategori Guru & Staff"
          description="Tambah, edit, dan hapus kategori guru dan staff"
          icon={Settings}
        >
          <LoadingSpinner message="Memuat data kategori..." />
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
        title="Kelola Kategori Guru & Staff"
        description="Tambah, edit, dan hapus kategori guru dan staff"
        icon={Settings}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Daftar Kategori</h3>
            <p className="text-sm text-gray-600">Total {kategori.length} kategori</p>
          </div>
          <AdminButton
            onClick={() => setShowModal(true)}
            icon={Plus}
          >
            Tambah Kategori
          </AdminButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kategori.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: item.warna + '20' }}
                  >
                    <Users 
                      className="w-5 h-5" 
                      style={{ color: item.warna }}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.label}</h4>
                    <p className="text-sm text-gray-500 font-mono">{item.key}</p>
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
                    onClick={() => setShowConfirm({ id: item.id, label: item.label })}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {item.deskripsi && (
                <p className="text-sm text-gray-600">{item.deskripsi}</p>
              )}
              
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-gray-500">Warna:</span>
                <div 
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: item.warna }}
                ></div>
                <span className="text-xs text-gray-500 font-mono">{item.warna}</span>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminModal
        isOpen={showModal}
        onClose={handleCancel}
        title={editId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <AdminFormField label="Key (Identifier)" required>
            <AdminInput
              value={formKategori.key}
              onChange={(val) => setFormKategori(prev => ({ ...prev, key: val.toLowerCase().replace(/\s+/g, '_') }))}
              placeholder="guru, staff, kepala_sekolah"
            />
            <p className="text-xs text-gray-500 mt-1">Key harus unik dan tidak boleh ada spasi</p>
          </AdminFormField>

          <AdminFormField label="Label" required>
            <AdminInput
              value={formKategori.label}
              onChange={(val) => setFormKategori(prev => ({ ...prev, label: val }))}
              placeholder="Guru, Staff, Kepala Sekolah"
            />
          </AdminFormField>

          <AdminFormField label="Deskripsi">
            <AdminInput
              value={formKategori.deskripsi}
              onChange={(val) => setFormKategori(prev => ({ ...prev, deskripsi: val }))}
              placeholder="Deskripsi singkat kategori"
            />
          </AdminFormField>

          <AdminFormField label="Warna">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formKategori.warna}
                  onChange={(e) => setFormKategori(prev => ({ ...prev, warna: e.target.value }))}
                  className="w-12 h-10 rounded border border-gray-300"
                />
                <AdminInput
                  value={formKategori.warna}
                  onChange={(val) => setFormKategori(prev => ({ ...prev, warna: val }))}
                  placeholder="#3B82F6"
                />
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormKategori(prev => ({ ...prev, warna: color }))}
                    className={`w-8 h-8 rounded border-2 ${
                      formKategori.warna === color ? 'border-gray-400' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
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
        title="Hapus Kategori?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Yakin ingin menghapus kategori <strong>&quot;{showConfirm?.label}&quot;</strong>?
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
