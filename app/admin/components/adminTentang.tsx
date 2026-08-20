"use client"

import { useState, useEffect } from 'react'
import { BookOpen, Save, Target, Heart, Users } from 'lucide-react'
import { AdminCard, AdminFormField, AdminInput, AdminTextarea, AdminButton } from './komponenForm'
import { AdminAlert } from './komponen-ui'
import { LoadingSpinner } from '../../../components/loadingSpinner'

interface TentangData {
  sejarah: string
  visi: string
  misi: string[]
  nilai: string[]
}

export default function AdminTentang() {
  const [data, setData] = useState<TentangData>({
    sejarah: '',
    visi: '',
    misi: [],
    nilai: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Simulasi data default
      const defaultData: TentangData = {
        sejarah: 'Sekolah Modern didirikan pada tahun 2010 dengan visi menjadi lembaga pendidikan yang unggul dalam membentuk generasi yang berkarakter, berprestasi, dan berakhlak mulia. Sejak berdiri, sekolah kami telah berkomitmen untuk memberikan pendidikan berkualitas tinggi dengan pendekatan modern dan inovatif.',
        visi: 'Menjadi sekolah unggulan yang menghasilkan lulusan berkarakter, berprestasi, dan siap menghadapi tantangan masa depan',
        misi: [
          'Menyelenggarakan pendidikan berkualitas tinggi dengan kurikulum yang relevan dan inovatif',
          'Mengembangkan karakter dan akhlak mulia pada setiap peserta didik',
          'Menyediakan fasilitas pembelajaran yang modern dan mendukung',
          'Membangun kerjasama yang baik dengan orang tua dan masyarakat',
          'Mengembangkan potensi peserta didik secara optimal melalui berbagai program unggulan'
        ],
        nilai: [
          'Integritas',
          'Kreativitas',
          'Kerjasama',
          'Disiplin',
          'Respek',
          'Excellence'
        ]
      }
      setData(defaultData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    
    try {
      // Simulasi save
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Data tentang sekolah berhasil diperbarui!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Gagal menyimpan data!')
    } finally {
      setSaving(false)
    }
  }

  const handleMisiChange = (index: number, value: string) => {
    const newMisi = [...data.misi]
    newMisi[index] = value
    setData(prev => ({ ...prev, misi: newMisi }))
  }

  const addMisi = () => {
    setData(prev => ({ ...prev, misi: [...prev.misi, ''] }))
  }

  const removeMisi = (index: number) => {
    setData(prev => ({ ...prev, misi: prev.misi.filter((_, i) => i !== index) }))
  }

  const handleNilaiChange = (index: number, value: string) => {
    const newNilai = [...data.nilai]
    newNilai[index] = value
    setData(prev => ({ ...prev, nilai: newNilai }))
  }

  const addNilai = () => {
    setData(prev => ({ ...prev, nilai: [...prev.nilai, ''] }))
  }

  const removeNilai = (index: number) => {
    setData(prev => ({ ...prev, nilai: prev.nilai.filter((_, i) => i !== index) }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminCard
          title="Kelola Tentang Sekolah"
          description="Edit informasi sejarah, visi, misi, dan nilai-nilai sekolah"
          icon={BookOpen}
        >
          <LoadingSpinner message="Memuat data tentang sekolah..." />
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

      <AdminCard
        title="Sejarah Sekolah"
        description="Edit sejarah dan latar belakang sekolah"
        icon={BookOpen}
      >
        <AdminFormField label="Sejarah Singkat" required>
          <AdminTextarea
            value={data.sejarah}
            onChange={(val) => setData(prev => ({ ...prev, sejarah: val }))}
            placeholder="Tuliskan sejarah dan latar belakang sekolah"
            rows={6}
          />
        </AdminFormField>
      </AdminCard>

      <AdminCard
        title="Visi Sekolah"
        description="Edit visi sekolah"
        icon={Target}
      >
        <AdminFormField label="Visi" required>
          <AdminTextarea
            value={data.visi}
            onChange={(val) => setData(prev => ({ ...prev, visi: val }))}
            placeholder="Tuliskan visi sekolah"
            rows={3}
          />
        </AdminFormField>
      </AdminCard>

      <AdminCard
        title="Misi Sekolah"
        description="Edit misi-misi sekolah"
        icon={Users}
      >
        <div className="space-y-4">
          {data.misi.map((misi, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm mt-1">
                {index + 1}
              </div>
              <div className="flex-1">
                <AdminTextarea
                  value={misi}
                  onChange={(val) => handleMisiChange(index, val)}
                  placeholder={`Misi ${index + 1}`}
                  rows={2}
                />
              </div>
              <button
                onClick={() => removeMisi(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
              >
                ×
              </button>
            </div>
          ))}
          <AdminButton
            onClick={addMisi}
            variant="outline"
            icon={Users}
          >
            Tambah Misi
          </AdminButton>
        </div>
      </AdminCard>

      <AdminCard
        title="Nilai-Nilai Sekolah"
        description="Edit nilai-nilai yang dianut sekolah"
        icon={Heart}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.nilai.map((nilai, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <AdminInput
                    value={nilai}
                    onChange={(val) => handleNilaiChange(index, val)}
                    placeholder={`Nilai ${index + 1}`}
                  />
                </div>
                <button
                  onClick={() => removeNilai(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <AdminButton
            onClick={addNilai}
            variant="outline"
            icon={Heart}
          >
            Tambah Nilai
          </AdminButton>
        </div>
      </AdminCard>

      <div className="flex justify-end">
        <AdminButton
          onClick={handleSave}
          disabled={saving}
          loading={saving}
          size="lg"
          icon={Save}
        >
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </AdminButton>
      </div>
    </div>
  )
}
