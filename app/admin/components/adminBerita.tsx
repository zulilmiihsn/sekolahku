'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon } from 'lucide-react'
import { AdminCard, AdminFormField, AdminInput, AdminTextarea, AdminButton } from './komponenForm'
import { AdminAlert, AdminModal } from './komponenUI'

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
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingBerita, setEditingBerita] = useState<Berita | null>(null)
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    gambar: '',
    konten: ''
  })

  useEffect(() => {
    fetchBerita()
  }, [])

  const fetchBerita = async () => {
    try {
      const res = await fetch('/api/berita')
      if (res.ok) {
        const data = await res.json()
        setBerita(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching berita:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.judul.trim() || !formData.deskripsi.trim() || !formData.konten.trim()) {
      setMessage('Judul, deskripsi, dan konten wajib diisi!')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/berita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: editingBerita?.id
        })
      })

      if (res.ok) {
        setMessage(editingBerita ? 'Berita berhasil diupdate!' : 'Berita berhasil ditambahkan!')
        onNotif(editingBerita ? 'Berita berhasil diupdate!' : 'Berita berhasil ditambahkan!')
        fetchBerita()
        handleCloseModal()
      } else {
        setMessage('Gagal menyimpan berita!')
      }
    } catch (error) {
      setMessage('Gagal menyimpan berita!')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (berita: Berita) => {
    setEditingBerita(berita)
    setFormData({
      judul: berita.judul,
      deskripsi: berita.deskripsi,
      gambar: berita.gambar || '',
      konten: berita.konten
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus berita ini?')) return

    try {
      const res = await fetch(`/api/berita/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessage('Berita berhasil dihapus!')
        onNotif('Berita berhasil dihapus!')
        fetchBerita()
      } else {
        setMessage('Gagal menghapus berita!')
      }
    } catch (error) {
      setMessage('Gagal menghapus berita!')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingBerita(null)
    setFormData({ judul: '', deskripsi: '', gambar: '', konten: '' })
    setMessage('')
  }

  const handleOpenModal = () => {
    setEditingBerita(null)
    setFormData({ judul: '', deskripsi: '', gambar: '', konten: '' })
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminCard title="Kelola Berita" description="Tambah, edit, dan hapus berita sekolah" icon={Plus}>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Memuat data berita...</p>
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
      <AdminCard title="Kelola Berita" description="Tambah, edit, dan hapus berita sekolah" icon={Plus}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Daftar Berita</h3>
            <p className="text-sm text-gray-500">Total {berita.length} berita</p>
          </div>
          <AdminButton onClick={handleOpenModal} icon={Plus}>
            Tambah Berita
          </AdminButton>
        </div>
      </AdminCard>

      {/* Daftar Berita */}
      <div className="space-y-4">
        {berita.length === 0 ? (
          <AdminCard title="Data Kosong" description="Belum ada berita" icon={ImageIcon}>
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada berita</h3>
              <p className="text-gray-500 mb-4">Mulai dengan menambahkan berita pertama Anda</p>
              <AdminButton onClick={handleOpenModal} icon={Plus}>
                Tambah Berita Pertama
              </AdminButton>
            </div>
          </AdminCard>
        ) : (
          berita.map((item) => (
            <AdminCard key={item.id} title={item.judul} description={item.deskripsi} icon={ImageIcon}>
              <div className="flex items-start gap-4">
                {item.gambar && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.gambar}
                      alt={item.judul}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.judul}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {item.deskripsi}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{new Date(item.tanggal).toLocaleDateString('id-ID')}</span>
                    <span>{item.konten.length} karakter</span>
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
        title={editingBerita ? 'Edit Berita' : 'Tambah Berita Baru'}
      >
        <div className="space-y-6">
          <AdminFormField label="Judul Berita" required>
            <AdminInput
              value={formData.judul}
              onChange={(val) => setFormData(prev => ({ ...prev, judul: val }))}
              placeholder="Masukkan judul berita"
            />
          </AdminFormField>

          <AdminFormField label="Deskripsi Singkat" required>
            <AdminTextarea
              value={formData.deskripsi}
              onChange={(val) => setFormData(prev => ({ ...prev, deskripsi: val }))}
              placeholder="Deskripsi singkat berita"
              rows={3}
            />
          </AdminFormField>

          <AdminFormField label="URL Gambar">
            <AdminInput
              value={formData.gambar}
              onChange={(val) => setFormData(prev => ({ ...prev, gambar: val }))}
              placeholder="https://example.com/gambar.jpg"
            />
          </AdminFormField>

          <AdminFormField label="Konten Berita" required>
            <AdminTextarea
              value={formData.konten}
              onChange={(val) => setFormData(prev => ({ ...prev, konten: val }))}
              placeholder="Tulis konten berita lengkap di sini..."
              rows={8}
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
              {editingBerita ? 'Update Berita' : 'Simpan Berita'}
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </div>
  )
}
