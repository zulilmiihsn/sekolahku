'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import { LoadingSpinner, CardSkeleton } from './loadingSpinner'

interface Berita {
  id: number
  judul: string
  deskripsi: string
  gambar?: string
  tanggal: string
  konten: string
}

interface BeritaSectionProps {
  initialBerita?: Berita[]
}

export default function BeritaSection({ initialBerita = [] }: BeritaSectionProps) {
  const [berita, setBerita] = useState<Berita[]>(initialBerita)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Hanya fetch sekali jika initialBerita kosong
    if (initialBerita.length === 0) {
      const fetchBerita = async () => {
        setLoading(true)
        try {
          const res = await fetch('/api/berita?limit=3')
          if (res.ok) {
            const response = await res.json()
            // Handle both old format (response.data) and new format (direct array)
            const data = Array.isArray(response) ? response : (response.data || [])
            setBerita(data)
          }
        } catch (error) {
          console.error('Error fetching berita:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchBerita()
    }
  }, []) // Hanya jalankan sekali saat mount

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Grid Berita */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {berita.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white/80 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
          >
            {item.gambar && (
              <div className="aspect-video relative">
                <Image
                  src={item.gambar}
                  alt={item.judul}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="p-3 sm:p-4">
              <h3 className="font-bold text-base sm:text-lg text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                {item.judul}
              </h3>
              <div className="flex items-center gap-2 text-text/60 text-xs sm:text-sm mb-3">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" aria-hidden="true" />
                <time dateTime={item.tanggal}>
                  {new Date(item.tanggal).toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </time>
              </div>
              <p className="text-text/70 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3 sm:mb-4">
                {item.deskripsi}
              </p>
              <Link 
                href={`/berita/${item.id}`}
                className="inline-flex items-center gap-2 text-primary hover:text-accent font-medium transition-colors group/link text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1 py-1"
                aria-label={`Baca artikel: ${item.judul}`}
              >
                Baca Selengkapnya
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/link:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
          <LoadingSpinner />
        </div>
      )}

      {/* Empty State */}
      {berita.length === 0 && !loading && (
        <div className="text-center py-6 sm:py-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" aria-hidden="true" />
          </div>
          <p className="text-gray-500 text-sm sm:text-base">Belum ada berita yang tersedia.</p>
        </div>
      )}
    </div>
  )
}
