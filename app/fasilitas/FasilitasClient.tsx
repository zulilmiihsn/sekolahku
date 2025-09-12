"use client"

import { useState, useRef } from 'react'
import SectionReveal from '../../components/SectionReveal'
import NoPhotoPlaceholder from "@/components/NoPhotoPlaceholder"
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface FasilitasItem {
  id: number
  nama: string
  deskripsi: string
  foto: string[]
}

export default function FasilitasClient({ fasilitas }: { fasilitas: FasilitasItem[] }) {
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
    <>
      {fasilitas.length === 0 ? (
        <div className="text-center text-text/60 py-16">Belum ada fasilitas.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <SectionReveal stagger as="fragment">
            {fasilitas.map((item) => (
              <div key={item.id} className="bg-background rounded-2xl shadow-lg p-8 flex flex-col gap-4">
                <div className="font-bold text-accent text-xl mb-1">{item.nama}</div>
                <div className="text-text/80 mb-2">{item.deskripsi}</div>
                {item.foto && item.foto.length > 0 ? (
                  <FasilitasSlider foto={item.foto} onClick={idx => openGaleri(item.foto, idx)} />
                ) : (
                  <NoPhotoPlaceholder />
                )}
              </div>
            ))}
          </SectionReveal>
        </div>
      )}

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
                alt={`Galeri Fasilitas ${galeriIdx+1}`}
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
    </>
  )
}

function FasilitasSlider({ foto, onClick }: { foto: string[], onClick: (idx: number) => void }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToIdx = (idx: number) => {
    setActiveIdx(idx)
    const node = scrollRef.current?.children[idx] as HTMLElement
    node?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  return (
    <div className="relative">
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
            <Image src={url} alt={`Foto fasilitas ${i+1}`} width={600} height={340} sizes="(max-width: 768px) 100vw, 600px" className="object-cover w-full h-full" />
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


