"use client"

import { useState, useEffect } from 'react'
import { MapPin, Save, Phone, Mail, Clock, Globe } from 'lucide-react'
import { AdminCard, AdminFormField, AdminInput, AdminTextarea, AdminButton } from './komponenForm'
import { AdminAlert } from './komponenUI'
import { LoadingSpinner } from '../../../components/loadingSpinner'

interface KontakData {
  alamat: string
  email: string
  telepon: string
  fax?: string
  website?: string
  jamOperasional: {
    senin: string
    selasa: string
    rabu: string
    kamis: string
    jumat: string
    sabtu: string
    minggu: string
  }
  koordinat: {
    lat: string
    lng: string
  }
  mediaSosial: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
  }
}

export default function AdminKontak() {
  const [data, setData] = useState<KontakData>({
    alamat: '',
    email: '',
    telepon: '',
    fax: '',
    website: '',
    jamOperasional: {
      senin: '07:00 - 15:00',
      selasa: '07:00 - 15:00',
      rabu: '07:00 - 15:00',
      kamis: '07:00 - 15:00',
      jumat: '07:00 - 15:00',
      sabtu: '07:00 - 12:00',
      minggu: 'Libur'
    },
    koordinat: {
      lat: '-6.2088',
      lng: '106.8456'
    },
    mediaSosial: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: ''
    }
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
      const defaultData: KontakData = {
        alamat: 'Jl. Pendidikan No. 123, Jakarta Selatan 12345',
        email: 'info@sekolahmodern.com',
        telepon: '021-12345678',
        fax: '021-12345679',
        website: 'www.sekolahmodern.com',
        jamOperasional: {
          senin: '07:00 - 15:00',
          selasa: '07:00 - 15:00',
          rabu: '07:00 - 15:00',
          kamis: '07:00 - 15:00',
          jumat: '07:00 - 15:00',
          sabtu: '07:00 - 12:00',
          minggu: 'Libur'
        },
        koordinat: {
          lat: '-6.2088',
          lng: '106.8456'
        },
        mediaSosial: {
          facebook: 'https://facebook.com/sekolahmodern',
          instagram: 'https://instagram.com/sekolahmodern',
          twitter: 'https://twitter.com/sekolahmodern',
          youtube: 'https://youtube.com/sekolahmodern'
        }
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
      setMessage('Data kontak dan lokasi berhasil diperbarui!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Gagal menyimpan data!')
    } finally {
      setSaving(false)
    }
  }

  const handleJamOperasionalChange = (hari: string, value: string) => {
    setData(prev => ({
      ...prev,
      jamOperasional: {
        ...prev.jamOperasional,
        [hari]: value
      }
    }))
  }

  const handleKoordinatChange = (field: 'lat' | 'lng', value: string) => {
    setData(prev => ({
      ...prev,
      koordinat: {
        ...prev.koordinat,
        [field]: value
      }
    }))
  }

  const handleMediaSosialChange = (platform: string, value: string) => {
    setData(prev => ({
      ...prev,
      mediaSosial: {
        ...prev.mediaSosial,
        [platform]: value
      }
    }))
  }

  const hariOptions = [
    { key: 'senin', label: 'Senin' },
    { key: 'selasa', label: 'Selasa' },
    { key: 'rabu', label: 'Rabu' },
    { key: 'kamis', label: 'Kamis' },
    { key: 'jumat', label: 'Jumat' },
    { key: 'sabtu', label: 'Sabtu' },
    { key: 'minggu', label: 'Minggu' }
  ]

  const mediaSosialOptions = [
    { key: 'facebook', label: 'Facebook', icon: '📘' },
    { key: 'instagram', label: 'Instagram', icon: '📷' },
    { key: 'twitter', label: 'Twitter', icon: '🐦' },
    { key: 'youtube', label: 'YouTube', icon: '📺' }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminCard
          title="Kelola Kontak & Lokasi"
          description="Edit informasi kontak dan lokasi sekolah"
          icon={MapPin}
        >
          <LoadingSpinner message="Memuat data kontak dan lokasi..." />
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
        title="Informasi Kontak"
        description="Edit informasi kontak sekolah"
        icon={Phone}
      >
        <div className="space-y-6">
          <AdminFormField label="Alamat Lengkap" required>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-2" />
              <AdminTextarea
                value={data.alamat}
                onChange={(val) => setData(prev => ({ ...prev, alamat: val }))}
                placeholder="Masukkan alamat lengkap sekolah"
                rows={3}
              />
            </div>
          </AdminFormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminFormField label="Email" required>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <AdminInput
                  type="email"
                  value={data.email}
                  onChange={(val) => setData(prev => ({ ...prev, email: val }))}
                  placeholder="info@sekolahmodern.com"
                />
              </div>
            </AdminFormField>

            <AdminFormField label="Telepon" required>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <AdminInput
                  type="tel"
                  value={data.telepon}
                  onChange={(val) => setData(prev => ({ ...prev, telepon: val }))}
                  placeholder="021-12345678"
                />
              </div>
            </AdminFormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminFormField label="Fax">
              <AdminInput
                type="tel"
                value={data.fax || ''}
                onChange={(val) => setData(prev => ({ ...prev, fax: val }))}
                placeholder="021-12345679"
              />
            </AdminFormField>

            <AdminFormField label="Website">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <AdminInput
                  value={data.website || ''}
                  onChange={(val) => setData(prev => ({ ...prev, website: val }))}
                  placeholder="www.sekolahmodern.com"
                />
              </div>
            </AdminFormField>
          </div>
        </div>
      </AdminCard>

      <AdminCard
        title="Jam Operasional"
        description="Edit jam operasional sekolah"
        icon={Clock}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hariOptions.map((hari) => (
            <AdminFormField key={hari.key} label={hari.label}>
              <AdminInput
                value={data.jamOperasional[hari.key as keyof typeof data.jamOperasional]}
                onChange={(val) => handleJamOperasionalChange(hari.key, val)}
                placeholder="07:00 - 15:00"
              />
            </AdminFormField>
          ))}
        </div>
      </AdminCard>

      <AdminCard
        title="Koordinat Lokasi"
        description="Edit koordinat GPS untuk peta"
        icon={MapPin}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminFormField label="Latitude">
            <AdminInput
              value={data.koordinat.lat}
              onChange={(val) => handleKoordinatChange('lat', val)}
              placeholder="-6.2088"
            />
          </AdminFormField>

          <AdminFormField label="Longitude">
            <AdminInput
              value={data.koordinat.lng}
              onChange={(val) => handleKoordinatChange('lng', val)}
              placeholder="106.8456"
            />
          </AdminFormField>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Koordinat ini digunakan untuk menampilkan lokasi sekolah di peta
        </p>
      </AdminCard>

      <AdminCard
        title="Media Sosial"
        description="Edit link media sosial sekolah"
        icon={Globe}
      >
        <div className="space-y-4">
          {mediaSosialOptions.map((media) => (
            <AdminFormField key={media.key} label={`${media.icon} ${media.label}`}>
              <AdminInput
                value={data.mediaSosial[media.key as keyof typeof data.mediaSosial] || ''}
                onChange={(val) => handleMediaSosialChange(media.key, val)}
                placeholder={`https://${media.key}.com/sekolahmodern`}
              />
            </AdminFormField>
          ))}
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
