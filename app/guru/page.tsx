"use client"

import PageTemplate, { PageSection, PageCard, PageGrid, EmptyState } from '../../components/PageTemplate'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { User, Users, GraduationCap, Briefcase } from 'lucide-react'

async function getGuru() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/profil-sekolah`, { cache: 'no-store' })
    const data = await res.json()
    const g = data.find((item: any) => item.section === 'guru')
    if (g && g.konten) {
      try {
        return JSON.parse(g.konten)
      } catch {}
    }
    return null
  } catch {
    return null
  }
}

async function getKategoriGuru() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/pengaturan/kategori-guru`, { cache: 'no-store' })
    return await res.json()
  } catch {
    return []
  }
}

export default function GuruStaff() {
  const [dataGuru, setDataGuru] = useState<any>({})
  const [kategoriGuru, setKategoriGuru] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [guruData, kategoriData] = await Promise.all([
          getGuru(),
          getKategoriGuru()
        ])
        setDataGuru(guruData || {})
        setKategoriGuru(kategoriData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filterValid = (arr: any[]) => (arr || []).filter(item => item.nama?.trim() || item.jabatan?.trim())

  const getIconForCategory = (key: string) => {
    switch (key.toLowerCase()) {
      case 'guru':
        return <GraduationCap className="w-6 h-6" />
      case 'staff':
        return <Briefcase className="w-6 h-6" />
      default:
        return <Users className="w-6 h-6" />
    }
  }

  if (loading) {
    return (
      <PageTemplate title="Guru & Staff">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text/60">Memuat data guru dan staff...</p>
        </div>
      </PageTemplate>
    )
  }

  return (
    <PageTemplate title="Guru & Staff" maxWidth="6xl">
      <div className="space-y-16">
        {kategoriGuru.map((kat: any) => (
          <GuruSection 
            key={kat.key} 
            title={kat.label} 
            data={filterValid(dataGuru[kat.key] || [])}
            icon={getIconForCategory(kat.key)}
          />
        ))}
      </div>
    </PageTemplate>
  )
}

function GuruSection({ 
  title, 
  data, 
  icon 
}: { 
  title: string
  data: { nama: string, jabatan: string, foto?: string }[]
  icon: React.ReactNode
}) {
  return (
    <PageSection title={title}>
      {data && data.length > 0 ? (
        <PageGrid cols={3} gap={6}>
          {data.map((item, i) => (
            <PageCard key={i} className="text-center group">
              <div className="relative mb-6">
                {item.foto ? (
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Image 
                      src={item.foto} 
                      alt={item.nama} 
                      width={96} 
                      height={96} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                  {icon}
                </div>
              </div>
              <h3 className="font-bold text-lg text-primary mb-2 group-hover:text-accent transition-colors">
                {item.nama}
              </h3>
              <p className="text-text/70 text-sm leading-relaxed">
                {item.jabatan}
              </p>
            </PageCard>
          ))}
        </PageGrid>
      ) : (
        <EmptyState 
          message={`Belum ada data ${title.toLowerCase()}.`}
          icon={
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto">
              {icon}
            </div>
          }
        />
      )}
    </PageSection>
  )
} 