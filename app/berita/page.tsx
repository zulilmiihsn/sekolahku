import Image from 'next/image'
import Link from 'next/link'
import { Newspaper, Calendar, ArrowRight } from 'lucide-react'
import AnimasiHalaman from '../../components/animasiHalaman'
import AnimasiSection from '../../components/animasiSection'

export const revalidate = 120

interface BeritaItem {
  id: number
  judul: string
  deskripsi: string
  gambar?: string
  tanggal: string
  konten: string
}

async function getBerita() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/berita`, {
      next: { revalidate: 120 }
    })
    if (res.ok) {
      return await res.json()
    }
  } catch (error) {
    console.error('Error fetching berita:', error)
  }
  return []
}

export default async function Berita() {
  const berita = await getBerita()

  return (
    <AnimasiHalaman>
      <main className="pt-16 min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-primary mb-4">Berita & Artikel</h1>
            <p className="text-text/70 text-lg">Informasi terbaru dan artikel menarik dari sekolah kami</p>
          </div>
          
          {berita.length > 0 ? (
            <AnimasiSection>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {berita.map((item: BeritaItem) => (
                  <article 
                    key={item.id}
                    className="bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/40 group"
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
                          <Newspaper className="w-12 h-12 text-primary/60" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm text-text/60">
                          {new Date(item.tanggal).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <h2 className="font-bold text-lg text-primary mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                        {item.judul}
                      </h2>
                      <p className="text-text/70 text-sm line-clamp-3 mb-4">
                        {item.deskripsi}
                      </p>
                      <Link 
                        href={`/berita/${item.id}`}
                        className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors text-sm font-medium"
                      >
                        Baca selengkapnya
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </AnimasiSection>
          ) : (
            <AnimasiSection>
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Newspaper className="w-8 h-8 text-primary/60" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Belum ada berita</h3>
                <p className="text-text/60">Berita akan ditampilkan di sini</p>
              </div>
            </AnimasiSection>
          )}
        </div>
      </main>
    </AnimasiHalaman>
  )
}