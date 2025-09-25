import PageTemplate, { PageCard, PageGrid, EmptyState } from '../../components/PageTemplate'
import FasilitasClient from './fasilitasClient'
import { Building2 } from 'lucide-react'

export const revalidate = 300

interface FasilitasItem {
  id: number
  nama: string
  deskripsi: string
  foto: string[]
}

async function getFasilitas(): Promise<FasilitasItem[]> {
  try {
    const res = await fetch(`/api/fasilitas?limit=50`, { next: { revalidate } })
    if (!res.ok) return []
    const response = await res.json()
    return response.data || []
  } catch {
    return []
  }
}

export default async function Fasilitas() {
  const fasilitas = await getFasilitas()
  
  return (
    <PageTemplate title="Fasilitas" maxWidth="6xl">
      {fasilitas.length > 0 ? (
        <FasilitasClient fasilitas={fasilitas} />
      ) : (
        <EmptyState 
          message="Belum ada fasilitas yang tersedia."
          icon={
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          }
        />
      )}
    </PageTemplate>
  )
}