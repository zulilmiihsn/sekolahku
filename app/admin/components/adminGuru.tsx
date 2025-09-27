"use client"

import { useState, useEffect } from 'react'
import { Users, Plus, Edit, Trash2, GraduationCap, Briefcase, Upload, User } from 'lucide-react'
import AdminCard from './AdminCard'
import AdminFormField from './AdminFormField'
import AdminInput from './AdminInput'
import AdminSelect from './AdminSelect'
import AdminButton from './AdminButton'
import AdminModal from './AdminModal'
import AdminAlert from './AdminAlert'
import AdminLoadingSpinner from '../../../components/AdminLoadingSpinner'

interface Guru {
  id: number
  nama: string
  jabatan: string
  foto?: string
  kategori: 'guru' | 'staff'
}

const kategoriOptions = [
  { value: 'guru', label: 'Guru' },
  { value: 'staff', label: 'Staff' }
]

export default function AdminGuru() {
  const [guru, setGuru] = useState<Guru[]>([])
  const [loading, setLoading] = useState(true)
  const [formGuru, setFormGuru] = useState({
    nama: '',
    jabatan: '',
    foto: '',
    kategori: 'guru' as 'guru' | 'staff'
  })
  const [notif, setNotif] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState<{ id: number, nama: string } | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    fetchGuru()
  }, [])

  const fetchGuru = async () => {
    try {
      // Simulasi data untuk demo
      const mockData: Guru[] = [
        {
          id: 1,
          nama: 'Dr. Ahmad Wijaya, M.Pd',
          jabatan: 'Kepala Sekolah',
          foto: '',
          kategori: 'guru'
        },
        {
          id: 2,
          nama: 'Siti Nurhaliza, S.Pd',
          jabatan: 'Wakil Kepala Sekolah',
          foto: '',
          kategori: 'guru'
        },
        {
          id: 3,
          nama: 'Budi Santoso, S.Pd',
          jabatan: 'Guru Matematika',
          foto: '',
          kategori: 'guru'
        },
        {
          id: 4,
          nama: 'Dewi Kartika, S.Pd',
          jabatan: 'Guru Bahasa Indonesia',
          foto: '',
          kategori: 'guru'
        },
        {
          id: 5,
          nama: 'Eko Prasetyo, S.Pd',
          jabatan: 'Guru IPA',
          foto: '',
          kategori: 'guru'
        },
        {
          id: 6,
          nama: 'Fitriani, S.Pd',
          jabatan: 'Guru Bahasa Inggris',
          foto: '',
          kategori: 'guru'
        },
        {
          id: 7,
          nama: 'Rina Sari, S.E',
          jabatan: 'Bendahara',
          foto: '',
          kategori: 'staff'
        },
        {
          id: 8,
          nama: 'Joko Susilo, S.Kom',
          jabatan: 'Staff IT',
          foto: '',
          kategori: 'staff'
        },
        {
          id: 9,
          nama: 'Maya Indira, S.Pd',
          jabatan: 'Staff Administrasi',
          foto: '',
          kategori: 'staff'
        }
      ]
      setGuru(mockData)
    } catch (error) {
      console.error('Error fetching guru:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotif('')
    
    if (!formGuru.nama || !formGuru.jabatan) {
      setNotif('Nama dan jabatan wajib diisi!')
      return
    }

    try {
      const newGuru: Guru = {
        id: editId || Date.now(),
        ...formGuru
      }

      if (editId) {
        setGuru(prev => prev.map(g => g.id === editId ? newGuru : g))
        setNotif('Data guru/staff berhasil diupdate!')
      } else {
        setGuru(prev => [...prev, newGuru])
        setNotif('Data guru/staff berhasil ditambahkan!')
      }

      setFormGuru({
        nama: '',
        jabatan: '',
        foto: '',
        kategori: 'guru'
      })
      setEditId(null)
      setShowModal(false)
    } catch (error) {
      setNotif('Gagal menyimpan data!')
    }
  }

  const handleEdit = (item: Guru) => {
    setFormGuru({
      nama: item.nama,
      jabatan: item.jabatan,
      foto: item.foto || '',
      kategori: item.kategori
    })
    setEditId(item.id)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    setDeleteLoading(true)
    try {
      setGuru(prev => prev.filter(g => g.id !== id))
      setNotif('Data guru/staff berhasil dihapus!')
      setShowConfirm(null)
    } catch (error) {
      setNotif('Gagal menghapus data!')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCancel = () => {
    setFormGuru({
      nama: '',
      jabatan: '',
      foto: '',
      kategori: 'guru'
    })
    setEditId(null)
    setShowModal(false)
  }

  const getKategoriIcon = (kategori: string) => {
    switch (kategori) {
      case 'guru': return GraduationCap
      case 'staff': return Briefcase
      default: return Users
    }
  }

  const getKategoriColor = (kategori: string) => {
    switch (kategori) {
      case 'guru': return 'bg-blue-100 text-blue-700'
      case 'staff': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

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
        <AdminCard
          title="Kelola Guru & Staff"
          description="Tambah, edit, dan hapus data guru dan staff"
          icon={Users}
        >
          <AdminLoadingSpinner message="Memuat data guru dan staff..." />
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
        title="Kelola Guru & Staff"
        description="Tambah, edit, dan hapus data guru dan staff"
        icon={Users}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Daftar Guru & Staff</h3>
            <p className="text-sm text-gray-600">Total {guru.length} orang</p>
          </div>
          <AdminButton
            onClick={() => setShowModal(true)}
            icon={Plus}
          >
            Tambah Guru/Staff
          </AdminButton>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedGuru).map(([kategori, items]) => {
            const KategoriIcon = getKategoriIcon(kategori)
            return (
              <div key={kategori}>
                <div className="flex items-center gap-3 mb-4">
                  <KategoriIcon className="w-6 h-6 text-primary" />
                  <h4 className="text-lg font-semibold text-gray-900 capitalize">
                    {kategoriOptions.find(k => k.value === kategori)?.label}
                  </h4>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    {items.length} orang
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
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
                          <h5 className="font-semibold text-gray-900 truncate">{item.nama}</h5>
                          <p className="text-sm text-gray-600 truncate">{item.jabatan}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getKategoriColor(item.kategori)}`}>
                          {kategoriOptions.find(k => k.value === item.kategori)?.label}
                        </span>
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
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </AdminCard>

      <AdminModal
        isOpen={showModal}
        onClose={handleCancel}
        title={editId ? 'Edit Guru/Staff' : 'Tambah Guru/Staff Baru'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <AdminFormField label="Nama Lengkap" required>
            <AdminInput
              value={formGuru.nama}
              onChange={(val) => setFormGuru(prev => ({ ...prev, nama: val }))}
              placeholder="Masukkan nama lengkap"
            />
          </AdminFormField>

          <AdminFormField label="Jabatan" required>
            <AdminInput
              value={formGuru.jabatan}
              onChange={(val) => setFormGuru(prev => ({ ...prev, jabatan: val }))}
              placeholder="Masukkan jabatan"
            />
          </AdminFormField>

          <AdminFormField label="Kategori">
            <AdminSelect
              value={formGuru.kategori}
              onChange={(val) => setFormGuru(prev => ({ ...prev, kategori: val as 'guru' | 'staff' }))}
              options={kategoriOptions}
            />
          </AdminFormField>

          <AdminFormField label="URL Foto (opsional)">
            <AdminInput
              value={formGuru.foto}
              onChange={(val) => setFormGuru(prev => ({ ...prev, foto: val }))}
              placeholder="https://example.com/foto.jpg"
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
        title="Hapus Guru/Staff?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Yakin ingin menghapus <strong>"{showConfirm?.nama}"</strong>?
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
