"use client"

import Navbar from '../../components/Navbar'
import { motion } from 'framer-motion'
import PageEnter from '../../components/PageEnter'
import SectionReveal from '../../components/SectionReveal'
import { useEffect, useState, useRef } from 'react'
import NoPhotoPlaceholder from '../../components/NoPhotoPlaceholder'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Prestasi() {
  const { data: prestasi = [], error, isLoading } = useSWR('/api/prestasi', fetcher)
  const [galeriOpen, setGaleriOpen] = useState(false)
  const [galeriFoto, setGaleriFoto] = useState<string[]>([])
  const [galeriIdx, setGaleriIdx] = useState(0)

  function openGaleri(foto: string[], idx: number) {
    setGaleriFoto(foto)
    setGaleriIdx(idx)
    setGaleriOpen(true)
  }
  function closeGaleri() {
    setGaleriOpen(false)
    setGaleriFoto([])
    setGaleriIdx(0)
  }

  return (
    <PageEnter>
      <Navbar />
      <main className="max-w-4xl mx-auto py-24 px-4">
        <h1 className="text-4xl font-extrabold text-primary mb-8 text-center">Prestasi</h1>
        {isLoading ? (
          <div className="text-center text-text/60 py-16">Memuat data prestasi...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-16">Gagal memuat data prestasi</div>
        ) : prestasi.length === 0 ? (
          <div className="text-center text-text/60 py-16">Belum ada data prestasi.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <SectionReveal stagger as="fragment">
              {prestasi.map((item: { nama?: string; judul?: string; peraih?: string; siswa?: string; tahun: number | string; foto?: string[] }, i: number) => (
                <div key={i} className="bg-white/80 rounded-2xl shadow-lg p-6">
                  {Array.isArray(item.foto) && item.foto.length > 0 ? (
                    <PrestasiSlider foto={item.foto as string[]} onClick={idx => openGaleri(item.foto as string[], idx)} />
                  ) : (
                    <NoPhotoPlaceholder />
                  )}
                  <div className="font-bold text-accent text-lg mb-1">{item.nama || item.judul}</div>
                  <div className="text-text/80 mb-1">{item.peraih || item.siswa}</div>
                  <div className="text-xs text-text/60 mb-2">Tahun {item.tahun}</div>
                </div>
              ))}
            </SectionReveal>
          </div>
        )}
        {/* Modal galeri */}
        {galeriOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="relative bg-white rounded-2xl shadow-2xl p-4 md:p-8 flex flex-col items-center max-w-2xl w-full">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500" onClick={closeGaleri}><X className="w-7 h-7" /></button>
              <div className="flex items-center gap-4 w-full">
                <button
                  className="p-2 rounded-full bg-primary/10 hover:bg-accent/10 text-primary disabled:opacity-30"
                  onClick={() => setGaleriIdx(idx => (idx === 0 ? galeriFoto.length - 1 : idx - 1))}
                  disabled={galeriFoto.length <= 1}
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <Image
                  src={galeriFoto[galeriIdx]}
                  alt={`Galeri Prestasi ${galeriIdx+1}`}
                  width={900}
                  height={600}
                  sizes="(max-width: 768px) 90vw, 900px"
                  className="max-h-[60vh] max-w-[60vw] rounded-xl object-contain mx-auto"
                  style={{ boxShadow: '0 4px 32px 0 rgba(0,0,0,0.10)' }}
                />
                <button
                  className="p-2 rounded-full bg-primary/10 hover:bg-accent/10 text-primary disabled:opacity-30"
                  onClick={() => setGaleriIdx(idx => (idx === galeriFoto.length - 1 ? 0 : idx + 1))}
                  disabled={galeriFoto.length <= 1}
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </div>
              <div className="mt-4 text-center text-text/70 text-sm">
                Foto {galeriIdx + 1} dari {galeriFoto.length}
              </div>
            </div>
          </div>
        )}
      </main>
    </PageEnter>
  )
}

// Komponen slider prestasi
function PrestasiSlider({ foto, onClick }: { foto: string[], onClick: (idx: number) => void }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToIdx = (idx: number) => {
    setActiveIdx(idx)
    const node = scrollRef.current?.children[idx] as HTMLElement
    node?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  return (
    <div className="relative mb-3">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-2 scroll-snap-x scroll-smooth rounded-lg aspect-video"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {foto.map((url, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full aspect-video rounded-lg overflow-hidden bg-gray-100 cursor-pointer scroll-snap-align-center"
            style={{ scrollSnapAlign: 'center', minWidth: '100%' }}
            onClick={() => onClick(i)}
          >
            <Image src={url} alt={`Foto prestasi ${i+1}`} width={600} height={340} sizes="(max-width: 768px) 100vw, 600px" className="object-cover w-full h-full" />
          </div>
        ))}
      </div>
      {foto.length > 1 && (
        <>
          <button
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-primary/20 text-primary rounded-full p-1 shadow"
            onClick={() => scrollToIdx(activeIdx === 0 ? foto.length - 1 : activeIdx - 1)}
            style={{ zIndex: 2 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-primary/20 text-primary rounded-full p-1 shadow"
            onClick={() => scrollToIdx(activeIdx === foto.length - 1 ? 0 : activeIdx + 1)}
            style={{ zIndex: 2 }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  )
} 