'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import AnimasiSection from '../../components/animasiSection'

interface EkstraItem {
  id: number
  nama: string
  deskripsi: string
  foto: string
  pembina: string
  jadwal: string
  kuota: number
  aktif: boolean
  kategori?: string
}

interface EkstraClientProps {
  ekstrakurikuler: EkstraItem[]
}

export default function EkstraClient({ ekstrakurikuler }: EkstraClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('semua')

  const categories = ['semua', 'olahraga', 'seni', 'akademik', 'teknologi', 'lainnya']
  
  const filteredEkstrakurikuler = selectedCategory === 'semua' 
    ? ekstrakurikuler.filter(item => item.aktif)
    : ekstrakurikuler.filter(item => item.aktif && item.kategori === selectedCategory)

  return (
    <div className="space-y-8">
      {/* Filter Kategori */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid Ekstrakurikuler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEkstrakurikuler.map((item, index) => (
          <AnimasiSection key={item.id} delay={index * 0.1}>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/80 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {item.foto && (
                <div className="aspect-video relative">
                  <Image
                    src={item.foto}
                    alt={item.nama}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                      Aktif
                    </span>
                  </div>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">{item.nama}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{item.deskripsi}</p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Pembina:</span>
                    <span>{item.pembina}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Jadwal:</span>
                    <span>{item.jadwal}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Kuota:</span>
                    <span>{item.kuota} siswa</span>
                  </div>
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors">
                  Daftar Sekarang
                </button>
              </div>
            </motion.div>
          </AnimasiSection>
        ))}
      </div>

      {filteredEkstrakurikuler.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Belum ada ekstrakurikuler yang tersedia.</p>
        </div>
      )}
    </div>
  )
}
