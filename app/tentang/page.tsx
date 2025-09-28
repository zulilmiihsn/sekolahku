import { BookOpen, Target, Users, Heart } from 'lucide-react'
import AnimasiHalaman from '../../components/animasiHalaman'
import AnimasiSection from '../../components/animasiSection'

async function getTentang() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/profil-sekolah`, { cache: 'no-store' })
    const data = await res.json()
    return data.find((item: any) => item.section === 'tentang')
  } catch {
    return null
  }
}

export default async function Tentang() {
  const tentang = await getTentang()

  return (
    <AnimasiHalaman>
      <main className="pt-16 min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-primary mb-4">Tentang Sekolah</h1>
            <p className="text-text/70 text-lg">Mengenal lebih dekat visi, misi, dan sejarah sekolah kami</p>
          </div>
          
          {tentang ? (
            <div className="space-y-16">
              {/* Sejarah */}
              {tentang.sejarah && (
                <AnimasiSection>
                  <section className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/40">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold text-primary">Sejarah</h2>
                    </div>
                    <p className="text-text/70 leading-relaxed">{tentang.sejarah}</p>
                  </section>
                </AnimasiSection>
              )}

              {/* Visi Misi */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visi */}
                {tentang.visi && (
                  <AnimasiSection>
                    <section className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/40">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white">
                          <Target className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary">Visi</h2>
                      </div>
                      <p className="text-text/70 leading-relaxed text-lg font-medium">{tentang.visi}</p>
                    </section>
                  </AnimasiSection>
                )}

                {/* Misi */}
                {tentang.misi && tentang.misi.length > 0 && (
                  <AnimasiSection>
                    <section className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/40">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white">
                          <Heart className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary">Misi</h2>
                      </div>
                      <ul className="space-y-3">
                        {tentang.misi.map((misi: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-primary text-sm font-bold">{index + 1}</span>
                            </div>
                            <p className="text-text/70 leading-relaxed">{misi}</p>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </AnimasiSection>
                )}
              </div>

              {/* Nilai-nilai */}
              <AnimasiSection>
                <section className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/40">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white">
                      <Users className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">Nilai-nilai Kami</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { title: 'Integritas', desc: 'Menjunjung tinggi kejujuran dan transparansi dalam setiap tindakan' },
                      { title: 'Inovasi', desc: 'Terus berinovasi dalam metode pembelajaran dan pengembangan diri' },
                      { title: 'Kolaborasi', desc: 'Membangun kerja sama yang solid antara siswa, guru, dan orang tua' },
                      { title: 'Excellence', desc: 'Berusaha mencapai keunggulan dalam setiap aspek pendidikan' },
                      { title: 'Respect', desc: 'Menghargai perbedaan dan menghormati setiap individu' },
                      { title: 'Responsibility', desc: 'Bertanggung jawab atas tindakan dan keputusan yang diambil' }
                    ].map((nilai, index) => (
                      <div key={index} className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Heart className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg text-primary mb-2">{nilai.title}</h3>
                        <p className="text-text/70 text-sm leading-relaxed">{nilai.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </AnimasiSection>
            </div>
          ) : (
            <AnimasiSection>
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary/60" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Informasi belum tersedia</h3>
                <p className="text-text/60">Informasi tentang sekolah akan ditampilkan di sini</p>
              </div>
            </AnimasiSection>
          )}
        </div>
      </main>
    </AnimasiHalaman>
  )
}