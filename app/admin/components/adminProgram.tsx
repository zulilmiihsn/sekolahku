'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, BookOpen } from 'lucide-react'
import { AdminCard, AdminFormField, AdminInput, AdminTextarea, AdminSelect, AdminButton } from './komponenForm'
import { AdminAlert, AdminModal } from './komponenUI'

interface Program {
  id: number
  nama: string
  deskripsi: string
  kategori: string
  durasi: string
  target: string
  manfaat: string[]
  persyaratan: string[]
  biaya: number
  aktif: boolean
}

export default function AdminProgram() {
  const [program, setProgram] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [formData, setFormData] = useState({
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

  const kategoriOptions = [
    { value: 'akademik', label: 'Akademik' },
    { value: 'non_akademik', label: 'Non-Akademik' },
    { value: 'ekstrakurikuler', label: 'Ekstrakurikuler' },
    { value: 'pendidikan_karakter', label: 'Pendidikan Karakter' },
    { value: 'keterampilan', label: 'Keterampilan' }
  ]

  useEffect(() => {
    fetchProgram()
  }, [])

  const fetchProgram = async () => {
    try {
      const res = await fetch('/api/program')
      if (res.ok) {
        const data = await res.json()
        setProgram(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching program:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.nama.trim() || !formData.deskripsi.trim() || !formData.kategori) {
      setMessage('Nama, deskripsi, dan kategori wajib diisi!')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      const programData = {
        ...formData,
        manfaat: formData.manfaat.split('\n').filter(m => m.trim()),
        persyaratan: formData.persyaratan.split('\n').filter(p => p.trim())
      }

      const res = await fetch('/api/program', {
        method: editingProgram ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProgram ? { id: editingProgram.id, ...programData } : programData)
      })

      if (res.ok) {
        setMessage(editingProgram ? 'Program berhasil diupdate!' : 'Program berhasil ditambahkan!')
        fetchProgram()
        handleCloseModal()
      } else {
        setMessage('Gagal menyimpan program!')
      }
    } catch (error) {
      setMessage('Gagal menyimpan program!')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (program: Program) => {
    setEditingProgram(program)
    setFormData({
      nama: program.nama,
      deskripsi: program.deskripsi,
      kategori: program.kategori,
      durasi: program.durasi,
      target: program.target,
      manfaat: program.manfaat.join('\n'),
      persyaratan: program.persyaratan.join('\n'),
      biaya: program.biaya,
      aktif: program.aktif
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus program ini?')) return

    try {
      const res = await fetch(`/api/program?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessage('Program berhasil dihapus!')
        fetchProgram()
      } else {
        setMessage('Gagal menghapus program!')
      }
    } catch (error) {
      setMessage('Gagal menghapus program!')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProgram(null)
    setFormData({
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
    setMessage('')
  }

  const handleOpenModal = () => {
    setEditingProgram(null)
    setFormData({
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
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminCard title="Kelola Program" description="Tambah, edit, dan hapus program sekolah" icon={BookOpen}>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Memuat data program...</p>
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
      <AdminCard title="Kelola Program" description="Tambah, edit, dan hapus program sekolah" icon={BookOpen}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Daftar Program</h3>
            <p className="text-sm text-gray-500">Total {program.length} program</p>
          </div>
          <AdminButton onClick={handleOpenModal} icon={Plus}>
            Tambah Program
          </AdminButton>
        </div>
      </AdminCard>

      {/* Daftar Program */}
      <div className="space-y-4">
        {program.length === 0 ? (
          <AdminCard>
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada program</h3>
              <p className="text-gray-500 mb-4">Mulai dengan menambahkan program pertama Anda</p>
              <AdminButton onClick={handleOpenModal} icon={Plus}>
                Tambah Program Pertama
              </AdminButton>
            </div>
          </AdminCard>
        ) : (
          program.map((item) => (
            <AdminCard key={item.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {item.nama}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.aktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.aktif ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {item.deskripsi}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="capitalize">{item.kategori}</span>
                    {item.durasi && <span>• {item.durasi}</span>}
                    {item.biaya > 0 && <span>• Rp {item.biaya.toLocaleString()}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AdminButton
                    onClick={() => handleEdit(item)}
                    size="sm"
                    variant="outline"
                    icon={Edit}
                  >
                    Edit
                  </AdminButton>
                  <AdminButton
                    onClick={() => handleDelete(item.id)}
                    size="sm"
                    variant="danger"
                    icon={Trash2}
                  >
                    Hapus
                  </AdminButton>
                </div>
              </div>
            </AdminCard>
          ))
        )}
      </div>

      {/* Modal Form */}
      <AdminModal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingProgram ? 'Edit Program' : 'Tambah Program Baru'}
      >
        <div className="space-y-6">
          <AdminFormField label="Nama Program" required>
            <AdminInput
              value={formData.nama}
              onChange={(val) => setFormData(prev => ({ ...prev, nama: val }))}
              placeholder="Masukkan nama program"
            />
          </AdminFormField>

          <AdminFormField label="Deskripsi" required>
            <AdminTextarea
              value={formData.deskripsi}
              onChange={(val) => setFormData(prev => ({ ...prev, deskripsi: val }))}
              placeholder="Deskripsi program"
              rows={3}
            />
          </AdminFormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormField label="Kategori" required>
              <AdminSelect
                value={formData.kategori}
                onChange={(val) => setFormData(prev => ({ ...prev, kategori: val }))}
                options={kategoriOptions}
                placeholder="Pilih kategori"
              />
            </AdminFormField>

            <AdminFormField label="Durasi">
              <AdminInput
                value={formData.durasi}
                onChange={(val) => setFormData(prev => ({ ...prev, durasi: val }))}
                placeholder="Contoh: 1 tahun"
              />
            </AdminFormField>
          </div>

          <AdminFormField label="Target Peserta">
            <AdminInput
              value={formData.target}
              onChange={(val) => setFormData(prev => ({ ...prev, target: val }))}
              placeholder="Contoh: Siswa kelas 10-12"
            />
          </AdminFormField>

          <AdminFormField label="Biaya (Rp)">
            <AdminInput
              type="number"
              value={formData.biaya}
              onChange={(val) => setFormData(prev => ({ ...prev, biaya: Number(val) || 0 }))}
              placeholder="0"
              min={0}
            />
          </AdminFormField>

          <AdminFormField label="Manfaat (satu per baris)">
            <AdminTextarea
              value={formData.manfaat}
              onChange={(val) => setFormData(prev => ({ ...prev, manfaat: val }))}
              placeholder="Manfaat 1&#10;Manfaat 2&#10;Manfaat 3"
              rows={4}
            />
          </AdminFormField>

          <AdminFormField label="Persyaratan (satu per baris)">
            <AdminTextarea
              value={formData.persyaratan}
              onChange={(val) => setFormData(prev => ({ ...prev, persyaratan: val }))}
              placeholder="Persyaratan 1&#10;Persyaratan 2&#10;Persyaratan 3"
              rows={4}
            />
          </AdminFormField>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="aktif"
              checked={formData.aktif}
              onChange={(e) => setFormData(prev => ({ ...prev, aktif: e.target.checked }))}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="aktif" className="text-sm font-medium text-gray-700">
              Program aktif
            </label>
          </div>

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
              {editingProgram ? 'Update Program' : 'Simpan Program'}
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </div>
  )
}
