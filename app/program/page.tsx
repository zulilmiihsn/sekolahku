import { BookOpen, Clock, Users, DollarSign, CheckCircle } from 'lucide-react'
import AnimasiHalaman from '../../components/animasiHalaman'
import AnimasiSection from '../../components/animasiSection'

export const revalidate = 300

interface ProgramItem {
  id: number
  nama: string
  deskripsi: string
  kategori: string
  durasi?: string
  target?: string
  manfaat: string[]
  persyaratan: string[]
  biaya: number
  aktif: boolean
}

async function getProgram(): Promise<ProgramItem[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/program`, { 
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
    case 'akademik':
      return <BookOpen className="w-6 h-6" />
    case 'non-akademik':
      return <Users className="w-6 h-6" />
    case 'ekstrakurikuler':
      return <Users className="w-6 h-6" />
    case 'pendidikan karakter':
      return <CheckCircle className="w-6 h-6" />
    case 'keterampilan':
      return <BookOpen className="w-6 h-6" />
    default:
      return <BookOpen className="w-6 h-6" />
  }
}

const getKategoriColor = (kategori: string) => {
  switch (kategori.toLowerCase()) {
    case 'akademik':
      return 'from-blue-500 to-blue-600'
    case 'non-akademik':
      return 'from-green-500 to-green-600'
    case 'ekstrakurikuler':
      return 'from-purple-500 to-purple-600'
    case 'pendidikan karakter':
      return 'from-orange-500 to-orange-600'
    case 'keterampilan':
      return 'from-pink-500 to-pink-600'
    default:
      return 'from-primary to-accent'
  }
}

export default async function Program() {
  const program = await getProgram()

  // Filter hanya program yang aktif
  const activeProgram = program.filter(p => p.aktif)

  // Group program by kategori
  const groupedProgram = activeProgram.reduce((acc, item) => {
    if (!acc[item.kategori]) {
      acc[item.kategori] = []
    }
    acc[item.kategori].push(item)
    return acc
  }, {} as Record<string, ProgramItem[]>)

  return (
    <AnimasiHalaman>
      <main className="pt-16 min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-primary mb-4">Program Unggulan</h1>
            <p className="text-text/70 text-lg">Program-program terbaik yang kami tawarkan</p>
          </div>
          
          {Object.keys(groupedProgram).length > 0 ? (
            <div className="space-y-16">
              {Object.entries(groupedProgram).map(([kategori, data]) => (
                <AnimasiSection key={kategori}>
                  <section className="mb-16">
                    <div className="text-center mb-12">
                      <div className="inline-flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${getKategoriColor(kategori)} rounded-xl flex items-center justify-center text-white`}>
                          {getKategoriIcon(kategori)}
                        </div>
                        <h2 className="text-3xl font-bold text-primary">{kategori}</h2>
                      </div>
                      <p className="text-text/60">Total {data.length} program</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {data.map((item) => (
                        <div 
                          key={item.id}
                          className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/40"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${getKategoriColor(item.kategori)} rounded-xl flex items-center justify-center text-white`}>
                              {getKategoriIcon(item.kategori)}
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              Aktif
                            </span>
                          </div>
                          
                          <h3 className="font-bold text-xl text-primary mb-3">{item.nama}</h3>
                          <p className="text-text/70 text-sm mb-4 line-clamp-3">{item.deskripsi}</p>
                          
                          <div className="space-y-3 mb-6">
                            {item.durasi && (
                              <div className="flex items-center gap-2 text-sm text-text/60">
                                <Clock className="w-4 h-4" />
                                <span>Durasi: {item.durasi}</span>
                              </div>
                            )}
                            {item.target && (
                              <div className="flex items-center gap-2 text-sm text-text/60">
                                <Users className="w-4 h-4" />
                                <span>Target: {item.target}</span>
                              </div>
                            )}
                            {item.biaya > 0 && (
                              <div className="flex items-center gap-2 text-sm text-text/60">
                                <DollarSign className="w-4 h-4" />
                                <span>Biaya: Rp {item.biaya.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                          
                          {item.manfaat.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-sm text-primary mb-2">Manfaat:</h4>
                              <ul className="space-y-1">
                                {item.manfaat.slice(0, 3).map((manfaat, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-text/70">
                                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{manfaat}</span>
                                  </li>
                                ))}
                                {item.manfaat.length > 3 && (
                                  <li className="text-xs text-text/50">
                                    +{item.manfaat.length - 3} manfaat lainnya
                                  </li>
                                )}
                              </ul>
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
                  <BookOpen className="w-8 h-8 text-primary/60" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Belum ada program</h3>
                <p className="text-text/60">Program akan ditampilkan di sini</p>
              </div>
            </AnimasiSection>
          )}
        </div>
      </main>
    </AnimasiHalaman>
  )
}