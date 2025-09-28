"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { User, Users, GraduationCap, Briefcase } from 'lucide-react'
import PageWrapper from '../../components/pageWrapper'
import AnimasiSection from '../../components/animasiSection'

interface GuruItem {
  id: number
  nama: string
  jabatan: string
  foto?: string
  kategori: 'guru' | 'staff'
}

export default function GuruStaff() {
  const [guru, setGuru] = useState<GuruItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    fetchGuru()
  }, [])

  const getIconForCategory = (kategori: string) => {
    switch (kategori) {
      case 'guru':
        return <GraduationCap className="w-6 h-6" />
      case 'staff':
        return <Briefcase className="w-6 h-6" />
      default:
        return <Users className="w-6 h-6" />
    }
  }

  const getKategoriLabel = (kategori: string) => {
    switch (kategori) {
      case 'guru':
        return 'Guru'
      case 'staff':
        return 'Staff'
      default:
        return 'Lainnya'
    }
  }

  // Group guru by kategori
  const groupedGuru = guru.reduce((acc, item) => {
    if (!acc[item.kategori]) {
      acc[item.kategori] = []
    }
    acc[item.kategori].push(item)
    return acc
  }, {} as Record<string, GuruItem[]>)

  if (loading) {
    return (
      <PageWrapper>
        <main className="pt-16">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-text/60">Memuat data guru dan staff...</p>
            </div>
          </div>
        </main>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <main className="pt-16">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-primary mb-4">Guru & Staff</h1>
            <p className="text-text/70 text-lg">Kenali tim pengajar dan staff sekolah kami</p>
          </div>
          
          <div className="space-y-16">
            {Object.entries(groupedGuru).map(([kategori, data]) => (
              <GuruSection 
                key={kategori} 
                title={getKategoriLabel(kategori)} 
                data={data}
                icon={getIconForCategory(kategori)}
              />
            ))}
          </div>
        </div>
      </main>
    </PageWrapper>
  )
}

function GuruSection({ 
  title, 
  data, 
  icon 
}: { 
  title: string
  data: GuruItem[]
  icon: React.ReactNode
}) {
  return (
    <AnimasiSection>
      <section className="mb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white">
              {icon}
            </div>
            <h2 className="text-3xl font-bold text-primary">{title}</h2>
          </div>
          <p className="text-text/60">Total {data.length} {title.toLowerCase()}</p>
        </div>
        
        {data && data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 text-center group hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/40">
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {icon}
            </div>
            <p className="text-text/60">Belum ada data {title.toLowerCase()}.</p>
          </div>
        )}
      </section>
    </AnimasiSection>
  )
}