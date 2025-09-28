import { Building2, Users, Wifi, Car, BookOpen, Monitor } from 'lucide-react'
import AnimasiHalaman from '../../components/animasiHalaman'
import AnimasiSection from '../../components/animasiSection'

export const revalidate = 300

interface FasilitasItem {
  id: number
  nama: string
  deskripsi: string
  kategori: string
  foto?: string
  kapasitas?: number
  status: 'tersedia' | 'maintenance' | 'tidak_tersedia'
}

async function getFasilitas(): Promise<FasilitasItem[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/fasilitas`, { 
      next: { revalidate } 
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

const getKategoriIcon = (kategori: string) => {
  switch (kategori.toLowerCase()) {
    case 'ruang kelas':
      return <BookOpen className="w-6 h-6" />
    case 'laboratorium':
      return <Monitor className="w-6 h-6" />
    case 'perpus':
      return <BookOpen className="w-6 h-6" />
    case 'aula':
      return <Users className="w-6 h-6" />
    case 'lapangan':
      return <Car className="w-6 h-6" />
    case 'kantin':
      return <Building2 className="w-6 h-6" />
    case 'wifi':
      return <Wifi className="w-6 h-6" />
    default:
      return <Building2 className="w-6 h-6" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'tersedia':
      return 'bg-green-100 text-green-800'
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800'
    case 'tidak_tersedia':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'tersedia':
      return 'Tersedia'
    case 'maintenance':
      return 'Maintenance'
    case 'tidak_tersedia':
      return 'Tidak Tersedia'
    default:
      return 'Unknown'
  }
}

export default async function Fasilitas() {
  const fasilitas = await getFasilitas()

  // Group fasilitas by kategori
  const groupedFasilitas = fasilitas.reduce((acc, item) => {
    if (!acc[item.kategori]) {
      acc[item.kategori] = []
    }
    acc[item.kategori].push(item)
    return acc
  }, {} as Record<string, FasilitasItem[]>)

  return (
    <AnimasiHalaman>
      <main className="pt-16 min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-primary mb-4">Fasilitas Sekolah</h1>
            <p className="text-text/70 text-lg">Sarana dan prasarana yang mendukung proses pembelajaran</p>
          </div>
          
          {Object.keys(groupedFasilitas).length > 0 ? (
            <div className="space-y-16">
              {Object.entries(groupedFasilitas).map(([kategori, data]) => (
                <AnimasiSection key={kategori}>
                  <section className="mb-16">
                    <div className="text-center mb-12">
                      <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white">
                          {getKategoriIcon(kategori)}
                        </div>
                        <h2 className="text-3xl font-bold text-primary">{kategori}</h2>
                      </div>
                      <p className="text-text/60">Total {data.length} fasilitas</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {data.map((item) => (
                        <div 
                          key={item.id}
                          className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/40"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                              {getKategoriIcon(item.kategori)}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {getStatusLabel(item.status)}
                            </span>
                          </div>
                          
                          <h3 className="font-bold text-lg text-primary mb-2">{item.nama}</h3>
                          <p className="text-text/70 text-sm mb-4 line-clamp-3">{item.deskripsi}</p>
                          
                          {item.kapasitas && (
                            <div className="flex items-center gap-2 text-sm text-text/60">
                              <Users className="w-4 h-4" />
                              <span>Kapasitas: {item.kapasitas} orang</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                </AnimasiSection>
              ))}
            </div>
          ) : (
            <AnimasiSection>
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-primary/60" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Belum ada fasilitas</h3>
                <p className="text-text/60">Fasilitas akan ditampilkan di sini</p>
              </div>
            </AnimasiSection>
          )}
        </div>
      </main>
    </AnimasiHalaman>
  )
}