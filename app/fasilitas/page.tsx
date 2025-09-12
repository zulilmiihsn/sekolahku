import Navbar from '../../components/navbar'
import PageEnter from '../../components/masukHalaman'
import SectionReveal from '../../components/sectionReveal'
import FasilitasClient from './fasilitasClient'

export const revalidate = 300

interface FasilitasItem {
  id: number
  nama: string
  deskripsi: string
  foto: string[]
}

async function getFasilitas(): Promise<FasilitasItem[]> {
  try {
    const res = await fetch(`/api/fasilitas`, { next: { revalidate } })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function Fasilitas() {
  const fasilitas = await getFasilitas()
  return (
    <PageEnter>
      <Navbar />
      <main className="max-w-5xl mx-auto py-24 px-4">
        <h1 className="text-4xl font-extrabold text-primary mb-8 text-center">Fasilitas</h1>
        <FasilitasClient fasilitas={fasilitas} />
      </main>
    </PageEnter>
  )
}