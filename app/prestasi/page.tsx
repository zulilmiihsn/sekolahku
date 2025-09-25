"use client"

import PageTemplate, { PageCard, PageGrid, EmptyState } from '../../components/PageTemplate'
import { useEffect, useState, useRef } from 'react'
import NoPhotoPlaceholder from '../../components/penggantiTanpaFoto'
import { X, ChevronLeft, ChevronRight, Trophy, Award } from 'lucide-react'
import Image from 'next/image'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Prestasi() {
  const { data: prestasi = [], error, isLoading } = useSWR('/api/prestasi', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 60000,
  })
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

  if (isLoading) {
    return (
      <PageTemplate title="Prestasi">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text/60">Memuat data prestasi...</p>
        </div>
      </PageTemplate>
    )
  }

  if (error) {
    return (
      <PageTemplate title="Prestasi">
        <EmptyState 
          message="Gagal memuat data prestasi"
          icon={
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
              <X className="w-8 h-8 text-red-500" />
            </div>
          }
        />
      </PageTemplate>
    )
  }

  return (
    <PageTemplate title="Prestasi" maxWidth="6xl">
      {prestasi.length > 0 ? (
        <PageGrid cols={2} gap={8}>
          {prestasi.map((item: { nama?: string; judul?: string; peraih?: string; siswa?: string; tahun: number | string; foto?: string[] }, i: number) => (
            <PageCard key={i} className="group">
              <div className="relative mb-4">
                {Array.isArray(item.foto) && item.foto.length > 0 ? (
                  <PrestasiSlider foto={item.foto as string[]} onClick={idx => openGaleri(item.foto as string[], idx)} />
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center">
                    <NoPhotoPlaceholder />
                  </div>
                )}
                <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-xl text-primary group-hover:text-accent transition-colors">
                  {item.nama || item.judul}
                </h3>
                <div className="flex items-center gap-2 text-text/70">
                  <Award className="w-4 h-4" />
                  <span>{item.peraih || item.siswa}</span>
                </div>
                <div className="text-sm text-text/60 bg-primary/5 px-3 py-1 rounded-full inline-block">
                  Tahun {item.tahun}
                </div>
              </div>
            </PageCard>
          ))}
        </PageGrid>
      ) : (
        <EmptyState 
          message="Belum ada data prestasi."
          icon={
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
          }
        />
      )}

      {/* Modal galeri */}
      {galeriOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl p-4 md:p-8 flex flex-col items-center max-w-2xl w-full">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors" onClick={closeGaleri}>
              <X className="w-7 h-7" />
            </button>
            <div className="flex items-center gap-4 w-full">
              <button
                className="p-2 rounded-full bg-primary/10 hover:bg-accent/10 text-primary disabled:opacity-30 transition-colors"
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
                className="p-2 rounded-full bg-primary/10 hover:bg-accent/10 text-primary disabled:opacity-30 transition-colors"
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
    </PageTemplate>
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