import PageTemplate, { PageSection, PageCard, PageGrid, EmptyState } from '../../components/PageTemplate'
import { BookOpen, Target, Users, Heart } from 'lucide-react'

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

export default async function TentangKami() {
  const tentang = await getTentang()
  let konten = { sejarah: '', visi: '', misi: [], nilai: [] }
  if (tentang && tentang.konten) {
    try {
      konten = JSON.parse(tentang.konten)
    } catch {}
  }

  return (
    <PageTemplate title="Tentang Kami" maxWidth="4xl">
      <div className="space-y-12">
        {/* Sejarah */}
        <PageSection title="Sejarah Singkat" className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            {konten.sejarah && konten.sejarah !== '-' ? (
              <p className="text-justify leading-relaxed">{konten.sejarah}</p>
            ) : (
              <EmptyState message="Sejarah sekolah belum tersedia." />
            )}
          </div>
        </PageSection>

        {/* Visi */}
        <PageSection title="Visi" className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
            <Target className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            {konten.visi && konten.visi !== '-' ? (
              <p className="text-xl font-medium text-primary italic leading-relaxed">"{konten.visi}"</p>
            ) : (
              <EmptyState message="Visi sekolah belum tersedia." />
            )}
          </div>
        </PageSection>

        {/* Misi */}
        <PageSection title="Misi">
          {Array.isArray(konten.misi) && konten.misi.length > 0 ? (
            <div className="space-y-4">
              {konten.misi.map((misi: string, i: number) => (
                <PageCard key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                    {i + 1}
                  </div>
                  <p className="flex-1 leading-relaxed">{misi}</p>
                </PageCard>
              ))}
            </div>
          ) : (
            <EmptyState message="Misi sekolah belum tersedia." />
          )}
        </PageSection>

        {/* Nilai-Nilai */}
        <PageSection title="Nilai-Nilai Sekolah">
          {Array.isArray(konten.nilai) && konten.nilai.length > 0 ? (
            <PageGrid cols={3} gap={6}>
              {konten.nilai.map((nilai: string, i: number) => (
                <PageCard key={i} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg text-primary">{nilai}</h3>
                </PageCard>
              ))}
            </PageGrid>
          ) : (
            <EmptyState message="Nilai-nilai sekolah belum tersedia." />
          )}
        </PageSection>
      </div>
    </PageTemplate>
  )
} 