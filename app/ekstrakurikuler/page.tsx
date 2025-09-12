import Navbar from '@/components/navbar'
import PageEnter from '@/components/masukHalaman'
import SectionReveal from '@/components/sectionReveal'
import EkstraClient from './ekstraClient'

export const revalidate = 300

interface EkstraItem {
  id: number
  nama: string
  deskripsi: string
  foto: string[]
}

async function getEkstra(): Promise<EkstraItem[]> {
  try {
    const res = await fetch(`/api/ekstrakurikuler`, { next: { revalidate } })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function Ekstrakurikuler() {
  const ekstrakurikuler = await getEkstra()
  return (
    <PageEnter>
      <Navbar />
      <main className="max-w-5xl mx-auto py-24 px-4">
        <h1 className="text-4xl font-extrabold text-primary mb-8 text-center">Ekstrakurikuler</h1>
        <EkstraClient ekstrakurikuler={ekstrakurikuler} />
      </main>
    </PageEnter>
  )
}
