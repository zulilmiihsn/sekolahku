'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import SectionReveal from '../../components/sectionReveal'

interface FasilitasItem {
  id: number
  nama: string
  deskripsi: string
  foto: string[]
}

interface FasilitasClientProps {
  fasilitas: FasilitasItem[]
}

export default function FasilitasClient({ fasilitas }: FasilitasClientProps) {
  const [selectedFasilitas, setSelectedFasilitas] = useState<FasilitasItem | null>(null)

  return (
    <div className="space-y-8">
      {/* Grid Fasilitas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fasilitas.map((item, index) => (
          <SectionReveal key={item.id} delay={index * 0.1}>
            <motion.div
              whileHover={{ y: -5 }}
              onClick={() => setSelectedFasilitas(item)}
              className="bg-white/80 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            >
              {item.foto.length > 0 && (
                <div className="aspect-video relative">
                  <Image
                    src={item.foto[0]}
                    alt={item.nama}
                    fill
                    className="object-cover"
                  />
                  {item.foto.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      +{item.foto.length - 1}
                    </div>
                  )}
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">{item.nama}</h3>
                <p className="text-gray-600 line-clamp-3">{item.deskripsi}</p>
                <button className="mt-4 text-primary font-medium hover:text-accent transition-colors">
                  Lihat Detail →
                </button>
              </div>
            </motion.div>
          </SectionReveal>
        ))}
      </div>

      {fasilitas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Belum ada fasilitas yang tersedia.</p>
        </div>
      )}

      {/* Modal Detail Fasilitas */}
      {selectedFasilitas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-primary">{selectedFasilitas.nama}</h2>
                <button
                  onClick={() => setSelectedFasilitas(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">{selectedFasilitas.deskripsi}</p>
              
              {selectedFasilitas.foto.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedFasilitas.foto.map((foto, index) => (
                    <div key={index} className="aspect-video relative rounded-lg overflow-hidden">
                      <Image
                        src={foto}
                        alt={`${selectedFasilitas.nama} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
