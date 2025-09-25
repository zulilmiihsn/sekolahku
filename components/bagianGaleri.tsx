'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface GaleriItem {
  id: number
  judul: string
  deskripsi: string
  foto: string[]
  kategori: string
  tanggal: string
}

export default function BagianGaleri() {
  const [galeri, setGaleri] = useState<GaleriItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<{ item: GaleriItem; index: number } | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetchGaleri()
  }, [])

  const fetchGaleri = async () => {
    try {
      const res = await fetch('/api/galeri')
      if (res.ok) {
        const data = await res.json()
        setGaleri(data.slice(0, 6)) // Ambil 6 item terbaru
      }
    } catch (error) {
      console.error('Error fetching galeri:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    if (selectedImage) {
      const totalImages = selectedImage.item.foto.length
      setCurrentSlide((prev) => (prev + 1) % totalImages)
    }
  }

  const prevSlide = () => {
    if (selectedImage) {
      const totalImages = selectedImage.item.foto.length
      setCurrentSlide((prev) => (prev - 1 + totalImages) % totalImages)
    }
  }

  const openLightbox = (item: GaleriItem, index: number) => {
    setSelectedImage({ item, index })
    setCurrentSlide(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    setCurrentSlide(0)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-gray-500">Memuat galeri...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Grid Galeri */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galeri.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white/80 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => openLightbox(item, 0)}
          >
            {item.foto.length > 0 && (
              <div className="aspect-video relative">
                <Image
                  src={item.foto[0]}
                  alt={item.judul}
                  fill
                  className="object-cover"
                />
                {item.foto.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    +{item.foto.length - 1}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 rounded-full p-2">
                      <ChevronRight className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="p-4">
              <p className="text-gray-600 text-sm">{item.deskripsi}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {galeri.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Belum ada galeri yang tersedia.</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white/20 text-white rounded-full p-2 hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {selectedImage.item.foto.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 text-white rounded-full p-2 hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 text-white rounded-full p-2 hover:bg-white/30 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src={selectedImage.item.foto[currentSlide]}
                alt={selectedImage.item.judul}
                fill
                className="object-contain"
              />
            </div>

            {/* Image Info */}
            <div className="mt-4 text-center text-white">
              <h3 className="text-xl font-bold mb-2">{selectedImage.item.judul}</h3>
              <p className="text-gray-300">{selectedImage.item.deskripsi}</p>
              {selectedImage.item.foto.length > 1 && (
                <p className="text-sm text-gray-400 mt-2">
                  {currentSlide + 1} dari {selectedImage.item.foto.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
