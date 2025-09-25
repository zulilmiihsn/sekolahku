"use client"

import { motion } from 'framer-motion'
import MasukHalaman from '../../components/masukHalaman'
import SectionReveal from '../../components/sectionReveal'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { User } from 'lucide-react'

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
  // Note: dijalankan di client; fetch data via efek
  const [dataGuru, setDataGuru] = useState<any>({})
  const [kategoriGuru, setKategoriGuru] = useState<any[]>([])
  useEffect(() => {
    getGuru().then((d) => setDataGuru(d || {}))
    getKategoriGuru().then((k) => setKategoriGuru(k || []))
  }, [])
  // Filter data kosong
  const filterValid = (arr: any[]) => (arr || []).filter(item => item.nama?.trim() || item.jabatan?.trim())
  return (
    <MasukHalaman>
      <main className="max-w-5xl mx-auto py-24 px-4 min-h-screen">
        <h1 className="text-4xl font-extrabold text-primary mb-8 text-center">Guru & Staff</h1>
        <div className="space-y-12">
          {kategoriGuru.map((kat: any) => (
            <SectionHierarki key={kat.key} title={kat.label} data={filterValid(dataGuru[kat.key] || [])} />
          ))}
        </div>
      </main>
    </MasukHalaman>
  )
}

function SectionHierarki({ title, data }: { title: string, data: { nama: string, jabatan: string, foto?: string }[] }) {
  const isFew = !data || data.length < 3;
  return (
    <section>
      <h2 className="text-2xl font-bold text-accent mb-4">{title}</h2>
      {data && data.length > 0 ? (
        isFew ? (
          <div className="flex justify-center gap-6 flex-wrap w-full items-stretch">
            {data.map((item, i) => (
              <SectionReveal key={i} delay={i * 0.08}>
                <div className="bg-white/80 rounded-2xl shadow-lg p-6 flex flex-col justify-between items-center w-80 h-full">
                  {item.foto ? (
                    <Image src={item.foto} alt={item.nama} width={80} height={80} className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-primary/30 bg-background" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary/30 to-accent/30 mb-3 flex items-center justify-center text-2xl font-bold text-primary">
                      {item.nama?.split(' ')[0][0] || '?'}
                    </div>
                  )}
                  <div className="font-semibold text-primary text-lg mb-1 text-center">{item.nama}</div>
                  <div className="text-sm text-text/70 text-center">{item.jabatan}</div>
                </div>
              </SectionReveal>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
            <SectionReveal stagger as="fragment">
              {data.map((item, i) => (
                <div key={i} className="bg-white/80 rounded-2xl shadow-lg p-6 flex flex-col justify-between items-center w-80 h-full">
                  {item.foto ? (
                    <Image src={item.foto} alt={item.nama} width={80} height={80} className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-primary/30 bg-background" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary/30 to-accent/30 mb-3 flex items-center justify-center text-2xl font-bold text-primary">
                      {item.nama?.split(' ')[0][0] || '?'}
                    </div>
                  )}
                  <div className="font-semibold text-primary text-lg mb-1 text-center">{item.nama}</div>
                  <div className="text-sm text-text/70 text-center">{item.jabatan}</div>
                </div>
              ))}
            </SectionReveal>
          </div>
        )
      ) : (
        <div className="w-full flex justify-center">
          <div className="text-text/60 italic text-center py-8">Belum ada data {title.toLowerCase()}.</div>
        </div>
      )}
    </section>
  )
} 