import Hero from '../components/sampul'
import PageEnter from '../components/masukHalaman'
import dynamic from 'next/dynamic'
import SectionReveal from '../components/sectionReveal'

export const revalidate = 60

const BeritaSection = dynamic(() => import('../components/beritaSection'), { ssr: false })
const GaleriSection = dynamic(() => import('../components/bagianGaleri'), { ssr: false })
const MapSekolah = dynamic(() => import('../components/mapSekolah'), { ssr: false })

type SectionProps = { id: string; title: string; children: React.ReactNode }
function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="min-h-[90vh] flex flex-col justify-center max-w-5xl mx-auto py-24 px-4 md:px-0">
      <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center drop-shadow-sm">{title}</h2>
      <div className="bg-white/70 rounded-2xl shadow-lg p-8 backdrop-blur-md border border-white/40 flex-1 flex flex-col justify-center">
        {children}
      </div>
    </section>
  )
}

// Server-side data fetching
async function getServerData() {
  try {
    // Gunakan path relatif untuk menghindari masalah build
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
    const profilRes = await fetch(`${baseUrl}/api/profil-sekolah`, { 
      next: { revalidate: 60 }
    })
    const profilDataRaw = await profilRes.json()
    const profilData: any[] = Array.isArray(profilDataRaw) ? profilDataRaw : []
    
    const beritaRes = await fetch(`${baseUrl}/api/berita`, { 
      next: { revalidate: 60 }
    })
    const beritaDataRaw = await beritaRes.json()
    const beritaData: any[] = Array.isArray(beritaDataRaw) ? beritaDataRaw : []
    
    const kontakRes = await fetch(`${baseUrl}/api/pengaturan/kontak`, { 
      next: { revalidate: 300 }
    })
    const kontakDataRaw = await kontakRes.json()
    const kontakData: any = (kontakDataRaw && typeof kontakDataRaw === 'object') ? kontakDataRaw : {}
    
    return {
      profil: (profilData as any[]).find((item: any) => item.section === 'profil'),
      program: (profilData as any[]).find((item: any) => item.section === 'program'),
      berita: beritaData.slice(0, 3),
      kontak: kontakData
    }
  } catch (error) {
    // Tidak log error saat build untuk menghindari spam
    return { profil: null, program: null, berita: [], kontak: { alamat: '', email: '', telepon: '' } }
  }
}

export default async function Home() {
  const serverData = await getServerData()
  const profil = serverData.profil ? {
    deskripsi: serverData.profil.deskripsi || 'Belum ada deskripsi sekolah yang tersedia.',
    jumlahSiswa: serverData.profil.konten ? JSON.parse(serverData.profil.konten).jumlahSiswa || 0 : 0,
    jumlahGuru: serverData.profil.konten ? JSON.parse(serverData.profil.konten).jumlahGuru || 0 : 0,
    jumlahStaff: serverData.profil.konten ? JSON.parse(serverData.profil.konten).jumlahStaff || 0 : 0
  } : {
    deskripsi: 'Belum ada deskripsi sekolah yang tersedia.',
    jumlahSiswa: 0,
    jumlahGuru: 0,
    jumlahStaff: 0
  }
  const programs: { judul: string; deskripsi: string }[] = serverData.program && serverData.program.konten
    ? (JSON.parse(serverData.program.konten) as { judul: string; deskripsi: string }[])
    : []
  const kontak = serverData.kontak || { alamat: '', email: '', telepon: '', lat: '', lng: '' }

  return (
    <PageEnter>
      <main className="pt-16">
        <Hero />
        <SectionReveal>
          <Section id="profil" title="Profil Sekolah">
            {profil.deskripsi && profil.deskripsi !== 'Belum ada deskripsi sekolah yang tersedia.' ? (
              <p className="text-lg text-text/80 text-justify">{profil.deskripsi}</p>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Belum ada deskripsi sekolah yang tersedia.</p>
              </div>
            )}
          </Section>
        </SectionReveal>
        <SectionReveal delay={0.08}>
          <Section id="program" title="Program Unggulan">
            {programs.length > 0 ? (
              <ul className="grid md:grid-cols-2 gap-6">
                {programs.map((program: { judul: string; deskripsi: string }, i: number) => (
                  <li key={i} className="p-4 rounded-xl bg-background shadow transition hover:scale-105">
                    <p className="text-text/70 text-sm">{program.deskripsi}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Belum ada program unggulan yang tersedia.</p>
              </div>
            )}
          </Section>
        </SectionReveal>
        <SectionReveal delay={0.16}>
          <Section id="galeri" title="Galeri">
            <GaleriSection />
          </Section>
        </SectionReveal>
        <SectionReveal delay={0.20}>
          <Section id="berita" title="Berita & Artikel">
            <BeritaSection initialBerita={serverData.berita} />
          </Section>
        </SectionReveal>
        <SectionReveal delay={0.24}>
          <Section id="kontak" title="Kontak">
            {kontak.email ? (
              <form className="grid gap-4 max-w-md mx-auto" action={`mailto:${kontak.email}`} method="POST" encType="text/plain">
                <input type="text" name="nama" placeholder="Nama" className="p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none" required />
                <input type="email" name="email" placeholder="Email" className="p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none" required />
                <textarea name="pesan" placeholder="Pesan" rows={4} className="p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none" required />
                <button type="submit" className="mt-2 px-6 py-3 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-accent transition-colors duration-200">Kirim Pesan</button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Informasi kontak belum tersedia.</p>
              </div>
            )}
          </Section>
        </SectionReveal>
        <SectionReveal delay={0.32}>
          <Section id="lokasi" title="Lokasi Sekolah">
            {kontak.lat && kontak.lng ? (
              <div className="flex flex-col items-center">
                <MapSekolah
                  lat={parseFloat(kontak.lat)}
                  lng={parseFloat(kontak.lng)}
                  alamat={kontak.alamat}
                />
                <div className="mt-4 text-center text-text/70 text-sm">{kontak.alamat}</div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Informasi lokasi sekolah belum tersedia.</p>
              </div>
            )}
          </Section>
        </SectionReveal>
      </main>
    </PageEnter>
  )
} 