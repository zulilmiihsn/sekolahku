'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import { LoadingSpinner, CardSkeleton } from '@/components/LoadingSpinner'

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
            setBerita(response.data || [])
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
    <div className="space-y-6">
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
            <div className="p-4">
              <p className="text-gray-600 text-sm">{item.deskripsi}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
          <LoadingSpinner />
        </div>
      )}

      {/* Empty State */}
      {berita.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Belum ada berita yang tersedia.</p>
        </div>
      )}
    </div>
  )
}
