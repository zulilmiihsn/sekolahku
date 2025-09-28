import Hero from '../components/sampul'
import PageWrapper from '../components/pageWrapper'
import dynamic from 'next/dynamic'
import SectionWrapper from '../components/sectionWrapper'

export const revalidate = 60

const BeritaSection = dynamic(() => import('../components/beritaSection'), { ssr: false })
const GaleriSection = dynamic(() => import('../components/galeriSection'), { ssr: false })
const PetaSekolah = dynamic(() => import('../components/petaSekolah'), { ssr: false })

type SectionProps = { id: string; title: string; children: React.ReactNode }
function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="min-h-[80vh] sm:min-h-[90vh] flex flex-col justify-center max-w-6xl mx-auto py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6 sm:mb-8 text-center drop-shadow-sm">{title}</h2>
      <div className="bg-white/70 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 backdrop-blur-md border border-white/40 flex-1 flex flex-col justify-center">
        {children}
      </div>
    </section>
  )
}

// Server-side data fetching
async function getServerData() {
  // Fallback data untuk build time
  const fallbackData = {
    profil: { deskripsi: 'Belum ada deskripsi sekolah yang tersedia.' },
    program: [],
    berita: [],
    kontak: { alamat: '', email: '', telepon: '', lat: '', lng: '' }
  }

  // Skip fetch saat build time untuk menghindari ECONNREFUSED
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL && !process.env.NEXT_PUBLIC_BASE_URL) {
    return fallbackData
  }

  try {
    // Gunakan path relatif untuk menghindari masalah build
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
    
    // Timeout untuk fetch agar tidak hang saat build
    const fetchWithTimeout = (url: string, timeout = 5000) => {
      return Promise.race([
        fetch(url, { next: { revalidate: 60 } }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Fetch timeout')), timeout)
        )
      ])
    }

    const [profilRes, beritaRes, programRes, kontakRes] = await Promise.allSettled([
      fetchWithTimeout(`${baseUrl}/api/pengaturan/deskripsi`),
      fetchWithTimeout(`${baseUrl}/api/berita?limit=3`),
      fetchWithTimeout(`${baseUrl}/api/program`),
      fetchWithTimeout(`${baseUrl}/api/pengaturan/kontak`)
    ])
    
    const profilData = profilRes.status === 'fulfilled' ? await profilRes.value.json() : fallbackData.profil
    const beritaDataRaw = beritaRes.status === 'fulfilled' ? await beritaRes.value.json() : fallbackData.berita
    const programDataRaw = programRes.status === 'fulfilled' ? await programRes.value.json() : fallbackData.program
    const kontakData = kontakRes.status === 'fulfilled' ? await kontakRes.value.json() : fallbackData.kontak
    
    const beritaData: any[] = Array.isArray(beritaDataRaw) ? beritaDataRaw : (beritaDataRaw.data || [])
    const programData: any[] = Array.isArray(programDataRaw) ? programDataRaw : []
    
    return {
      profil: profilData,
      program: programData.filter((item: any) => item.aktif).slice(0, 4),
      berita: beritaData.slice(0, 3),
      kontak: kontakData
    }
  } catch (error) {
    // Return fallback data tanpa log error
    return fallbackData
  }
}

export default async function Home() {
  const serverData = await getServerData()
  const profil = serverData.profil ? {
    deskripsi: serverData.profil.deskripsi || 'Belum ada deskripsi sekolah yang tersedia.'
  } : {
    deskripsi: 'Belum ada deskripsi sekolah yang tersedia.'
  }
  const programs = serverData.program || []
  const kontak = serverData.kontak || { alamat: '', email: '', telepon: '', lat: '', lng: '' }

  return (
    <PageWrapper>
      <main className="pt-16">
        <Hero />
        <SectionWrapper>
          <Section id="profil" title="Profil Sekolah">
            {profil.deskripsi && profil.deskripsi !== 'Belum ada deskripsi sekolah yang tersedia.' ? (
              <p className="text-lg text-text/80 text-justify">{profil.deskripsi}</p>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Belum ada deskripsi sekolah yang tersedia.</p>
              </div>
            )}
          </Section>
        </SectionWrapper>
        <SectionWrapper>
          <Section id="program" title="Program Unggulan">
            {programs.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {programs.map((program: any, i: number) => (
                  <div key={i} className="p-6 rounded-xl bg-background shadow transition hover:scale-105">
                    <h3 className="font-bold text-lg text-primary mb-2">{program.nama}</h3>
                    <p className="text-text/70 text-sm leading-relaxed">{program.deskripsi}</p>
                    {program.durasi && (
                      <div className="mt-3 text-xs text-text/50">
                        Durasi: {program.durasi}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Belum ada program unggulan yang tersedia.</p>
              </div>
            )}
          </Section>
        </SectionWrapper>
        <SectionWrapper>
          <Section id="galeri" title="Galeri">
            <GaleriSection />
          </Section>
        </SectionWrapper>
        <SectionWrapper>
          <Section id="berita" title="Berita & Artikel">
            <BeritaSection initialBerita={serverData.berita} />
          </Section>
        </SectionWrapper>
        <SectionWrapper>
          <Section id="kontak" title="Kontak">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {/* Informasi Kontak */}
              <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
                <div className="text-center lg:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3 sm:mb-4">Hubungi Kami</h3>
                  <p className="text-text/70 text-base sm:text-lg leading-relaxed">
                    Ada pertanyaan atau ingin mengetahui lebih lanjut tentang sekolah kami? 
                    Jangan ragu untuk menghubungi kami melalui informasi di bawah ini.
                  </p>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  {kontak.alamat && (
                    <div className="flex items-start space-x-3 p-3 sm:p-4 bg-white/50 rounded-xl border border-white/40">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-primary mb-1 text-sm sm:text-base">Alamat</h4>
                        <p className="text-text/70 text-xs sm:text-sm leading-relaxed">{kontak.alamat}</p>
                      </div>
                    </div>
                  )}
                  
                  {kontak.telepon && (
                    <div className="flex items-start space-x-3 p-3 sm:p-4 bg-white/50 rounded-xl border border-white/40">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-primary mb-1 text-sm sm:text-base">Telepon</h4>
                        <a href={`tel:${kontak.telepon}`} className="text-text/70 text-xs sm:text-sm hover:text-primary transition-colors">
                          {kontak.telepon}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {kontak.email && (
                    <div className="flex items-start space-x-3 p-3 sm:p-4 bg-white/50 rounded-xl border border-white/40">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-primary mb-1 text-sm sm:text-base">Email</h4>
                        <a href={`mailto:${kontak.email}`} className="text-text/70 text-xs sm:text-sm hover:text-primary transition-colors break-all">
                          {kontak.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Kontak */}
              <div className="bg-white/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/40 order-1 lg:order-2">
                <h3 className="text-lg sm:text-xl font-bold text-primary mb-4 text-center">Kirim Pesan</h3>
                {kontak.email ? (
                  <form className="space-y-3 sm:space-y-4" action={`mailto:${kontak.email}`} method="POST" encType="text/plain">
                    <div>
                      <label htmlFor="nama" className="block text-sm font-medium text-text/80 mb-2">Nama Lengkap</label>
                      <input 
                        type="text" 
                        id="nama"
                        name="nama" 
                        placeholder="Masukkan nama lengkap Anda" 
                        className="w-full p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors duration-200 bg-white/70 text-sm sm:text-base" 
                        required 
                        aria-describedby="nama-help"
                      />
                      <div id="nama-help" className="sr-only">Masukkan nama lengkap Anda</div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text/80 mb-2">Email</label>
                      <input 
                        type="email" 
                        id="email"
                        name="email" 
                        placeholder="contoh@email.com" 
                        className="w-full p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors duration-200 bg-white/70 text-sm sm:text-base" 
                        required 
                        aria-describedby="email-help"
                      />
                      <div id="email-help" className="sr-only">Masukkan alamat email yang valid</div>
                    </div>
                    <div>
                      <label htmlFor="pesan" className="block text-sm font-medium text-text/80 mb-2">Pesan</label>
                      <textarea 
                        id="pesan"
                        name="pesan" 
                        placeholder="Tuliskan pesan Anda di sini..." 
                        rows={4} 
                        className="w-full p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors duration-200 bg-white/70 resize-none text-sm sm:text-base" 
                        required 
                        aria-describedby="pesan-help"
                      />
                      <div id="pesan-help" className="sr-only">Tuliskan pesan atau pertanyaan Anda</div>
                    </div>
                    <button 
                      type="submit" 
                      className="w-full px-6 py-3 rounded-lg bg-primary text-white font-semibold shadow-lg hover:bg-accent hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px] text-sm sm:text-base"
                    >
                      Kirim Pesan
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm sm:text-base">Form kontak tidak tersedia karena email belum dikonfigurasi.</p>
                  </div>
                )}
              </div>
            </div>
          </Section>
        </SectionWrapper>
        <SectionWrapper>
          <Section id="lokasi" title="Lokasi Sekolah">
            {kontak.lat && kontak.lng ? (
              <div className="flex flex-col items-center">
                <PetaSekolah
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
        </SectionWrapper>
      </main>
    </PageWrapper>
  )
} 