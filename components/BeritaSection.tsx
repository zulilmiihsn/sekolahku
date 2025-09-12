"use client"

import { useState, useEffect } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import NoPhotoPlaceholder from './penggantiTanpaFoto'

interface BeritaSectionProps {
  initialBerita: any[]
}

export default function BeritaSection({ initialBerita }: BeritaSectionProps) {
  const [berita, setBerita] = useState<any[]>(initialBerita)
  const [loadingBerita, setLoadingBerita] = useState(false)
  const [notif, setNotif] = useState<string | null>(null)

  useEffect(() => {
    // Jika initialBerita kosong, fetch dari API
    if (initialBerita.length === 0) {
      setLoadingBerita(true)
      fetch('/api/berita')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setBerita(data.slice(0, 3))
          } else if (data && data.error) {
            setNotif('Gagal memuat berita: ' + data.error)
            setBerita([])
          } else {
            setBerita([])
          }
          setLoadingBerita(false)
        })
    }
  }, [initialBerita])

  return (
    <div className="space-y-6 mb-6">
      {loadingBerita ? (
        <div className="space-y-6 mb-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-background rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6 items-start animate-pulse">
              <div className="w-full md:w-48 aspect-[4/3] rounded-xl bg-gray-200" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : berita.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 bg-white/70 rounded-xl shadow">
          <svg className="w-12 h-12 text-accent mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 6v12a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 18V6A2.25 2.25 0 016.75 3.75h10.5A2.25 2.25 0 0119.5 6z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.75h7.5M8.25 12.75h7.5M8.25 15.75h4.5" />
          </svg>
          <div className="text-text/70">Belum ada berita yang dipublikasikan.</div>
        </div>
      ) : berita.map((item, i) => (
        <div key={item.id} className="bg-background rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-48 aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-tr from-primary/20 to-accent/20 flex items-center justify-center mb-4 md:mb-0">
            {item.gambar ? (
              <Image
                src={item.gambar}
                alt={item.judul}
                width={400}
                height={300}
                className="object-cover w-full h-full"
              />
            ) : (
              <NoPhotoPlaceholder className="w-full h-full" />
            )}
          </div>
          <div className="flex-1">
            <Link href={`/berita/${item.id}`} className="font-bold text-lg text-primary mb-1 hover:underline hover:text-accent transition-colors">{item.judul}</Link>
            <div className="text-xs text-text/60 mb-2">{new Date(item.tanggal).toLocaleString()}</div>
            <div className="text-text/80 line-clamp-3">{item.deskripsi}</div>
          </div>
        </div>
      ))}
      <div className="text-center">
        <Link href="/berita" className="inline-block px-6 py-3 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-accent transition-colors duration-200">Lihat Semua Berita</Link>
      </div>
    </div>
  )
} 