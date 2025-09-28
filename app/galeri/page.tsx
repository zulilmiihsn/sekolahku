import { Camera, Calendar } from 'lucide-react'
import Image from 'next/image'
import AnimasiHalaman from '../../components/animasiHalaman'
import AnimasiSection from '../../components/animasiSection'

export const revalidate = 300

interface GaleriItem {
  id: number
  judul: string
  deskripsi: string
  foto: string
  tanggal: string
  kategori?: string
}

async function getGaleri(): Promise<GaleriItem[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/galeri`, { 
      next: { revalidate } 
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function Galeri() {
  const galeri = await getGaleri()

  return (
    <AnimasiHalaman>
      <main className="pt-16 min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-primary mb-4">Galeri Sekolah</h1>
            <p className="text-text/70 text-lg">Momen-momen berharga dan aktivitas sekolah</p>
          </div>
          
          {galeri.length > 0 ? (
            <AnimasiSection>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galeri.map((item) => (
                  <article 
                    key={item.id}
                    className="bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/40 group"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={item.foto}
                        alt={item.judul}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm text-text/60">
                          {new Date(item.tanggal).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <h2 className="font-bold text-lg text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                        {item.judul}
                      </h2>
                      <p className="text-text/70 text-sm line-clamp-3">
                        {item.deskripsi}
                      </p>
                      {item.kategori && (
                        <div className="mt-3">
                          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                            {item.kategori}
                          </span>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </AnimasiSection>
          ) : (
            <AnimasiSection>
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-primary/60" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Belum ada galeri</h3>
                <p className="text-text/60">Galeri akan ditampilkan di sini</p>
              </div>
            </AnimasiSection>
          )}
        </div>
      </main>
    </AnimasiHalaman>
  )
}