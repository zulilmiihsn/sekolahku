"use client"

import { useEffect, useState, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, Trophy, Award, Calendar } from 'lucide-react'
import Image from 'next/image'
import AnimasiHalaman from '../../components/animasiHalaman'
import AnimasiSection from '../../components/animasiSection'

interface PrestasiItem {
  id: number
  judul: string
  deskripsi: string
  gambar?: string
  tanggal: string
  kategori: string
  tingkat: string
}

export default function Prestasi() {
  const [prestasi, setPrestasi] = useState<PrestasiItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPrestasi, setSelectedPrestasi] = useState<PrestasiItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchPrestasi = async () => {
      try {
        const res = await fetch('/api/prestasi')
        if (res.ok) {
          const data = await res.json()
          setPrestasi(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error('Error fetching prestasi:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPrestasi()
  }, [])

  const openModal = (prestasi: PrestasiItem, index: number) => {
    setSelectedPrestasi(prestasi)
    setCurrentIndex(index)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPrestasi(null)
  }

  const nextPrestasi = () => {
    if (selectedPrestasi) {
      const nextIndex = (currentIndex + 1) % prestasi.length
      setSelectedPrestasi(prestasi[nextIndex])
      setCurrentIndex(nextIndex)
    }
  }

  const prevPrestasi = () => {
    if (selectedPrestasi) {
      const prevIndex = currentIndex === 0 ? prestasi.length - 1 : currentIndex - 1
      setSelectedPrestasi(prestasi[prevIndex])
      setCurrentIndex(prevIndex)
    }
  }

  const getKategoriIcon = (kategori: string) => {
    switch (kategori.toLowerCase()) {
      case 'akademik':
        return <Trophy className="w-5 h-5" />
      case 'non-akademik':
        return <Award className="w-5 h-5" />
      default:
        return <Trophy className="w-5 h-5" />
    }
  }

  const getTingkatColor = (tingkat: string) => {
    switch (tingkat.toLowerCase()) {
      case 'nasional':
        return 'bg-yellow-100 text-yellow-800'
      case 'provinsi':
        return 'bg-blue-100 text-blue-800'
      case 'kabupaten':
        return 'bg-green-100 text-green-800'
      case 'sekolah':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-primary/10 text-primary'
    }
  }

  if (loading) {
    return (
      <AnimasiHalaman>
        <main className="pt-16 min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-text/60">Memuat data prestasi...</p>
            </div>
          </div>
        </main>
      </AnimasiHalaman>
    )
  }

  return (
    <AnimasiHalaman>
      <main className="pt-16 min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-primary mb-4">Prestasi Sekolah</h1>
            <p className="text-text/70 text-lg">Pencapaian dan prestasi yang membanggakan</p>
          </div>
          
          {prestasi.length > 0 ? (
            <AnimasiSection>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prestasi.map((item, index) => (
                  <div 
                    key={item.id}
                    className="bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/40 group cursor-pointer"
                    onClick={() => openModal(item, index)}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      {item.gambar ? (
                        <Image
                          src={item.gambar}
                          alt={item.judul}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <Trophy className="w-12 h-12 text-primary/60" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTingkatColor(item.tingkat)}`}>
                          {item.tingkat}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        {getKategoriIcon(item.kategori)}
                        <span className="text-sm text-text/60 capitalize">{item.kategori}</span>
                      </div>
                      <h3 className="font-bold text-lg text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                        {item.judul}
                      </h3>
                      <p className="text-text/70 text-sm line-clamp-3 mb-4">
                        {item.deskripsi}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-text/50">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(item.tanggal).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimasiSection>
          ) : (
            <AnimasiSection>
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-primary/60" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Belum ada prestasi</h3>
                <p className="text-text/60">Prestasi akan ditampilkan di sini</p>
              </div>
            </AnimasiSection>
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && selectedPrestasi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex">
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getKategoriIcon(selectedPrestasi.kategori)}
                    <span className="text-sm text-text/60 capitalize">{selectedPrestasi.kategori}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTingkatColor(selectedPrestasi.tingkat)}`}>
                      {selectedPrestasi.tingkat}
                    </span>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <h2 className="text-2xl font-bold text-primary mb-4">{selectedPrestasi.judul}</h2>
                <p className="text-text/70 mb-6">{selectedPrestasi.deskripsi}</p>
                
                <div className="flex items-center gap-2 text-sm text-text/50">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(selectedPrestasi.tanggal).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
              
              {selectedPrestasi.gambar && (
                <div className="w-80 h-80 relative">
                  <Image
                    src={selectedPrestasi.gambar}
                    alt={selectedPrestasi.judul}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            
            {prestasi.length > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <button
                  onClick={prevPrestasi}
                  className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Sebelumnya
                </button>
                <span className="text-sm text-text/60">
                  {currentIndex + 1} dari {prestasi.length}
                </span>
                <button
                  onClick={nextPrestasi}
                  className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  Selanjutnya
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </AnimasiHalaman>
  )
}