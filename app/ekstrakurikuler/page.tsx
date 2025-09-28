import AnimasiHalaman from '../../components/animasiHalaman'
import AnimasiSection from '../../components/animasiSection'
import EkstraClient from './ekstraClient'

export const revalidate = 300

interface EkstraItem {
  id: number
  nama: string
  deskripsi: string
  foto: string
  pembina: string
  jadwal: string
  kuota: number
  aktif: boolean
  kategori?: string
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
    <AnimasiHalaman>
      <main className="max-w-5xl mx-auto py-24 px-4 min-h-screen">
        <h1 className="text-4xl font-extrabold text-primary mb-8 text-center">Ekstrakurikuler</h1>
        <EkstraClient ekstrakurikuler={ekstrakurikuler} />
      </main>
    </AnimasiHalaman>
  )
}
