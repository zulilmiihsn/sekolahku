"use client"

import { useState, useEffect } from 'react'
import { BookOpen, Plus, Edit, Trash2, Calendar, Clock, Users } from 'lucide-react'
import AdminCard from './AdminCard'
import AdminFormField from './AdminFormField'
import AdminInput from './AdminInput'
import AdminTextarea from './AdminTextarea'
import AdminSelect from './AdminSelect'
import AdminButton from './AdminButton'
import AdminModal from './AdminModal'
import AdminAlert from './AdminAlert'
import AdminLoadingSpinner from '../../../components/AdminLoadingSpinner'

interface Program {
  id: number
  nama: string
  deskripsi: string
  kategori: string
  durasi: string
  target: string
  manfaat: string[]
  persyaratan: string[]
  biaya?: number
  aktif: boolean
}

const kategoriOptions = [
  { value: 'akademik', label: 'Akademik' },
  { value: 'non_akademik', label: 'Non-Akademik' },
  { value: 'ekstrakurikuler', label: 'Ekstrakurikuler' },
  { value: 'pendidikan_karakter', label: 'Pendidikan Karakter' },
  { value: 'keterampilan', label: 'Keterampilan' }
]

export default function AdminProgram() {
  const [program, setProgram] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [formProgram, setFormProgram] = useState({
    nama: '',
    deskripsi: '',
    kategori: '',
    durasi: '',
    target: '',
    manfaat: '',
    persyaratan: '',
    biaya: 0,
    aktif: true
  })
  const [notif, setNotif] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState<{ id: number, nama: string } | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    fetchProgram()
  }, [])

  const fetchProgram = async () => {
    try {
      // Simulasi data untuk demo
      const mockData: Program[] = [
        {
          id: 1,
          nama: 'Program Bilingual',
          deskripsi: 'Program pembelajaran dengan bahasa Inggris sebagai bahasa pengantar untuk mata pelajaran tertentu',
          kategori: 'akademik',
          durasi: '1 tahun',
          target: 'Siswa kelas 7-9',
          manfaat: ['Meningkatkan kemampuan bahasa Inggris', 'Mempersiapkan siswa untuk studi internasional', 'Meningkatkan kepercayaan diri'],
          persyaratan: ['Nilai bahasa Inggris minimal 80', 'Motivasi tinggi untuk belajar', 'Dukungan orang tua'],
          biaya: 500000,
          aktif: true
        },
        {
          id: 2,
          nama: 'Program Robotik',
          deskripsi: 'Program pembelajaran robotik dan programming untuk mengembangkan kemampuan STEM siswa',
          kategori: 'keterampilan',
          durasi: '6 bulan',
          target: 'Siswa kelas 8-9',
          manfaat: ['Mengembangkan logika berpikir', 'Meningkatkan kreativitas', 'Mempersiapkan karir di bidang teknologi'],
          persyaratan: ['Minat terhadap teknologi', 'Kemampuan matematika dasar', 'Komitmen mengikuti program'],
          biaya: 300000,
          aktif: true
        },
        {
          id: 3,
          nama: 'Program Leadership',
          deskripsi: 'Program pengembangan kepemimpinan dan karakter untuk membentuk siswa yang berkarakter',
          kategori: 'pendidikan_karakter',
          durasi: '3 bulan',
          target: 'Siswa kelas 7-9',
          manfaat: ['Mengembangkan kemampuan kepemimpinan', 'Meningkatkan kepercayaan diri', 'Membentuk karakter yang baik'],
          persyaratan: ['Motivasi tinggi', 'Kemampuan komunikasi dasar', 'Dukungan dari guru'],
          aktif: true
        }
      ]
      setProgram(mockData)
    } catch (error) {
      console.error('Error fetching program:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotif('')
    
    if (!formProgram.nama || !formProgram.deskripsi || !formProgram.kategori) {
      setNotif('Nama, deskripsi, dan kategori wajib diisi!')
      return
    }

    try {
      const newProgram: Program = {
        id: editId || Date.now(),
        ...formProgram,
        manfaat: formProgram.manfaat.split('\n').filter(m => m.trim()),
        persyaratan: formProgram.persyaratan.split('\n').filter(p => p.trim())
      }

      if (editId) {
        setProgram(prev => prev.map(p => p.id === editId ? newProgram : p))
        setNotif('Program berhasil diupdate!')
      } else {
        setProgram(prev => [...prev, newProgram])
        setNotif('Program berhasil ditambahkan!')
      }

      setFormProgram({
        nama: '',
        deskripsi: '',
        kategori: '',
        durasi: '',
        target: '',
        manfaat: '',
        persyaratan: '',
        biaya: 0,
        aktif: true
      })
      setEditId(null)
      setShowModal(false)
    } catch (error) {
      setNotif('Gagal menyimpan program!')
    }
  }

  const handleEdit = (item: Program) => {
    setFormProgram({
      nama: item.nama,
      deskripsi: item.deskripsi,
      kategori: item.kategori,
      durasi: item.durasi,
      target: item.target,
      manfaat: item.manfaat.join('\n'),
      persyaratan: item.persyaratan.join('\n'),
      biaya: item.biaya || 0,
      aktif: item.aktif
    })
    setEditId(item.id)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    setDeleteLoading(true)
    try {
      setProgram(prev => prev.filter(p => p.id !== id))
      setNotif('Program berhasil dihapus!')
      setShowConfirm(null)
    } catch (error) {
      setNotif('Gagal menghapus program!')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCancel = () => {
    setFormProgram({
      nama: '',
      deskripsi: '',
      kategori: '',
      durasi: '',
      target: '',
      manfaat: '',
      persyaratan: '',
      biaya: 0,
      aktif: true
    })
    setEditId(null)
    setShowModal(false)
  }

  const getKategoriColor = (kategori: string) => {
    switch (kategori) {
      case 'akademik': return 'bg-blue-100 text-blue-700'
      case 'non_akademik': return 'bg-green-100 text-green-700'
      case 'ekstrakurikuler': return 'bg-purple-100 text-purple-700'
      case 'pendidikan_karakter': return 'bg-orange-100 text-orange-700'
      case 'keterampilan': return 'bg-pink-100 text-pink-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminCard
          title="Kelola Program"
          description="Tambah, edit, dan hapus program sekolah"
          icon={BookOpen}
        >
          <AdminLoadingSpinner message="Memuat data program..." />
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
        title="Kelola Program"
        description="Tambah, edit, dan hapus program sekolah"
        icon={BookOpen}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Daftar Program</h3>
            <p className="text-sm text-gray-600">Total {program.length} program</p>
          </div>
          <AdminButton
            onClick={() => setShowModal(true)}
            icon={Plus}
          >
            Tambah Program
          </AdminButton>
        </div>

        <div className="space-y-6">
          {program.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-xl text-gray-900">{item.nama}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getKategoriColor(item.kategori)}`}>
                      {kategoriOptions.find(k => k.value === item.kategori)?.label}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.aktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.aktif ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{item.deskripsi}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Durasi: {item.durasi}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Target: {item.target}</span>
                    </div>
                    {item.biaya && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Biaya: Rp {item.biaya.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Manfaat:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {item.manfaat.map((manfaat, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{manfaat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Persyaratan:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {item.persyaratan.map((persyaratan, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{persyaratan}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowConfirm({ id: item.id, nama: item.nama })}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminModal
        isOpen={showModal}
        onClose={handleCancel}
        title={editId ? 'Edit Program' : 'Tambah Program Baru'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <AdminFormField label="Nama Program" required>
            <AdminInput
              value={formProgram.nama}
              onChange={(val) => setFormProgram(prev => ({ ...prev, nama: val }))}
              placeholder="Masukkan nama program"
            />
          </AdminFormField>

          <AdminFormField label="Deskripsi" required>
            <AdminTextarea
              value={formProgram.deskripsi}
              onChange={(val) => setFormProgram(prev => ({ ...prev, deskripsi: val }))}
              placeholder="Deskripsi lengkap program"
              rows={3}
            />
          </AdminFormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminFormField label="Kategori" required>
              <AdminSelect
                value={formProgram.kategori}
                onChange={(val) => setFormProgram(prev => ({ ...prev, kategori: val }))}
                options={kategoriOptions}
                placeholder="Pilih kategori"
              />
            </AdminFormField>

            <AdminFormField label="Durasi">
              <AdminInput
                value={formProgram.durasi}
                onChange={(val) => setFormProgram(prev => ({ ...prev, durasi: val }))}
                placeholder="Contoh: 6 bulan, 1 tahun"
              />
            </AdminFormField>
          </div>

          <AdminFormField label="Target Peserta">
            <AdminInput
              value={formProgram.target}
              onChange={(val) => setFormProgram(prev => ({ ...prev, target: val }))}
              placeholder="Contoh: Siswa kelas 7-9"
            />
          </AdminFormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminFormField label="Manfaat (satu per baris)">
              <AdminTextarea
                value={formProgram.manfaat}
                onChange={(val) => setFormProgram(prev => ({ ...prev, manfaat: val }))}
                placeholder="Meningkatkan kemampuan bahasa Inggris&#10;Mempersiapkan siswa untuk studi internasional"
                rows={4}
              />
            </AdminFormField>

            <AdminFormField label="Persyaratan (satu per baris)">
              <AdminTextarea
                value={formProgram.persyaratan}
                onChange={(val) => setFormProgram(prev => ({ ...prev, persyaratan: val }))}
                placeholder="Nilai bahasa Inggris minimal 80&#10;Motivasi tinggi untuk belajar"
                rows={4}
              />
            </AdminFormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminFormField label="Biaya (opsional)">
              <AdminInput
                type="number"
                value={formProgram.biaya}
                onChange={(val) => setFormProgram(prev => ({ ...prev, biaya: parseInt(val) || 0 }))}
                placeholder="0"
                min={0}
              />
            </AdminFormField>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formProgram.aktif}
                  onChange={(e) => setFormProgram(prev => ({ ...prev, aktif: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Program Aktif</span>
              </label>
            </div>
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
        title="Hapus Program?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Yakin ingin menghapus program <strong>"{showConfirm?.nama}"</strong>?
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
