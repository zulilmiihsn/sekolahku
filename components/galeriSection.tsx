'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { LoadingSpinner, CardSkeleton } from '@/components/loadingSpinner'

interface GaleriItem {
  id: number
  judul: string
  deskripsi: string
  foto: string[]
  kategori: string
  tanggal: string
}

export default function GaleriSection() {
  const [galeri, setGaleri] = useState<GaleriItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<{ item: GaleriItem; index: number } | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetchGaleri()
  }, [])

  const fetchGaleri = async () => {
    try {
      const res = await fetch('/api/galeri?limit=6')
      if (res.ok) {
        const response = await res.json()
        // Handle both old format (response.data) and new format (direct array)
        const data = Array.isArray(response) ? response : (response.data || [])
        setGaleri(data)
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
    <div className="space-y-4 sm:space-y-6">
      {/* Grid Galeri */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {galeri.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white/80 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
            onClick={() => openLightbox(item, 0)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openLightbox(item, 0)
              }
            }}
            aria-label={`Lihat galeri: ${item.judul}`}
          >
            {item.foto.length > 0 && (
              <div className="aspect-video relative">
                <Image
                  src={item.foto[0]}
                  alt={item.judul}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {item.foto.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium">
                    +{item.foto.length - 1}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 rounded-full p-2">
                      <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-sm sm:text-base text-primary mb-2 line-clamp-2">
                {item.judul}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">{item.deskripsi}</p>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Empty State */}
      {galeri.length === 0 && (
        <div className="text-center py-6 sm:py-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" aria-hidden="true" />
          </div>
          <p className="text-gray-500 text-sm sm:text-base">Belum ada galeri yang tersedia.</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Galeri foto"
        >
          <div className="relative max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-white/20 text-white rounded-full p-2 hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Tutup galeri"
            >
              <X className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>

            {/* Navigation Buttons */}
            {selectedImage.item.foto.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 text-white rounded-full p-2 hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 text-white rounded-full p-2 hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Foto selanjutnya"
                >
                  <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
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
                sizes="100vw"
              />
            </div>

            {/* Image Info */}
            <div className="mt-3 sm:mt-4 text-center text-white px-2">
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 line-clamp-2">{selectedImage.item.judul}</h3>
              <p className="text-gray-300 text-sm sm:text-base line-clamp-2">{selectedImage.item.deskripsi}</p>
              {selectedImage.item.foto.length > 1 && (
                <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">
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
