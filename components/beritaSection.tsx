'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'

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
          const res = await fetch('/api/berita')
          if (res.ok) {
            const data = await res.json()
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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Berita & Artikel Terbaru</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Dapatkan informasi terbaru tentang kegiatan, prestasi, dan perkembangan sekolah kami.
        </p>
      </div>

      {/* Grid Berita */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {berita.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white/80 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {item.gambar && (
              <div className="aspect-video relative">
                <Image
                  src={item.gambar}
                  alt={item.judul}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2">
                {item.judul}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {item.deskripsi}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(item.tanggal).toLocaleDateString('id-ID')}
                </div>
                <Link
                  href={`/berita/${item.id}`}
                  className="flex items-center text-primary font-medium hover:text-accent transition-colors"
                >
                  Baca Selengkapnya
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-500">Memuat berita...</p>
        </div>
      )}

      {/* Empty State */}
      {berita.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Belum ada berita yang tersedia.</p>
        </div>
      )}

      {/* View All Button */}
      {berita.length > 0 && (
        <div className="text-center">
          <Link
            href="/berita"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
          >
            Lihat Semua Berita
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      )}
    </div>
  )
}
