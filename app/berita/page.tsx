import PageTemplate, { PageCard, EmptyState } from '../../components/PageTemplate'
import Image from 'next/image'
import Link from 'next/link'
import PenggantiTanpaFoto from '../../components/penggantiTanpaFoto'
import { Newspaper, Calendar, ArrowRight } from 'lucide-react'

export const revalidate = 120

interface BeritaItem {
  id: number
  judul: string
  deskripsi: string
  gambar?: string
  tanggal: string
}

async function getBerita(): Promise<BeritaItem[]> {
  try {
    const res = await fetch(`/api/berita?limit=20`, { next: { revalidate } })
    if (!res.ok) return []
    const response = await res.json()
    return response.data || []
  } catch {
    return []
  }
}

export default async function Berita() {
  const berita = await getBerita()

  return (
    <PageTemplate title="Berita & Artikel" maxWidth="4xl">
      {Array.isArray(berita) && berita.length > 0 ? (
        <div className="space-y-8">
          {berita.map((item) => (
            <PageCard key={item.id} className="group">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-64 aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                  {item.gambar ? (
                    <Image
                      src={item.gambar}
                      alt={item.judul}
                      width={400}
                      height={300}
                      sizes="(max-width: 768px) 100vw, 16rem"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <PenggantiTanpaFoto className="w-full h-full" />
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <Link 
                      href={`/berita/${item.id}`} 
                      className="font-bold text-xl text-primary mb-2 hover:text-accent transition-colors group-hover:underline block"
                    >
                      {item.judul}
                    </Link>
                    <div className="flex items-center gap-2 text-text/60 text-sm mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(item.tanggal).toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                  <p className="text-text/80 leading-relaxed line-clamp-3">
                    {item.deskripsi}
                  </p>
                  <Link 
                    href={`/berita/${item.id}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-accent font-medium transition-colors group/link"
                  >
                    Baca Selengkapnya
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </PageCard>
          ))}
        </div>
      ) : (
        <EmptyState 
          message="Belum ada berita yang tersedia."
          icon={
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto">
              <Newspaper className="w-8 h-8 text-primary" />
            </div>
          }
        />
      )}
    </PageTemplate>
  )
} 