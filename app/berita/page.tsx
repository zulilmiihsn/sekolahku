import Navbar from '../../components/Navbar'
import PageEnter from '../../components/PageEnter'
import SectionReveal from '../../components/SectionReveal'
import Image from 'next/image'
import Link from 'next/link'
import NoPhotoPlaceholder from '../../components/NoPhotoPlaceholder'

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
    const res = await fetch(`/api/berita`, { next: { revalidate } })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function Berita() {
  const berita = await getBerita()

  return (
    <PageEnter>
      <Navbar />
      <main className="pt-16">
        <h1 className="text-4xl font-extrabold text-primary mb-8 text-center">Berita & Artikel</h1>
        <div className="space-y-8">
          {Array.isArray(berita) && berita.length > 0 ? (
            <SectionReveal stagger as="fragment">
              {berita.map((item) => (
                <div key={item.id} className="bg-background rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-48 aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-tr from-primary/20 to-accent/20 flex items-center justify-center mb-4 md:mb-0">
                    {item.gambar ? (
                      <Image
                        src={item.gambar}
                        alt={item.judul}
                        width={400}
                        height={300}
                        sizes="(max-width: 768px) 100vw, 12rem"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <NoPhotoPlaceholder className="w-full h-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Link href={`/berita/${item.id}`} className="font-bold text-lg text-primary mb-1 hover:underline hover:text-accent transition-colors">{item.judul}</Link>
                    <div className="text-xs text-text/60 mb-2">{new Date(item.tanggal).toLocaleString()}</div>
                    <div className="text-text/80">{item.deskripsi}</div>
                  </div>
                </div>
              ))}
            </SectionReveal>
          ) : (
            <div className="text-center text-text/60 py-8">Belum ada berita.</div>
          )}
        </div>
      </main>
    </PageEnter>
  )
} 