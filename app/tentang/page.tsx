import PageEnter from '../../components/masukHalaman'

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
    <PageEnter>
      <main className="max-w-4xl mx-auto py-24 px-4 min-h-screen">
        <h1 className="text-4xl font-extrabold text-primary mb-8 text-center">{tentang?.judul || 'Tentang Kami'}</h1>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Sejarah Singkat</h2>
          <p className="text-text/80 text-justify">{konten.sejarah || '-'}</p>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Visi</h2>
          <p className="italic text-primary">{konten.visi || '-'}</p>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Misi</h2>
          <ul className="list-disc pl-6 text-text/80 space-y-2">
            {Array.isArray(konten.misi) && konten.misi.length > 0 ? konten.misi.map((m: string, i: number) => (
              <li key={i}>{m}</li>
            )) : <li>-</li>}
          </ul>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Nilai-Nilai Sekolah</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {Array.isArray(konten.nilai) && konten.nilai.length > 0 ? konten.nilai.map((n: string, i: number) => (
              <div key={i} className="bg-background rounded-xl p-6 shadow text-center">
                <span className="font-bold text-accent text-lg">{n}</span>
              </div>
            )) : <div className="text-text/60">-</div>}
          </div>
        </section>
      </main>
    </PageEnter>
  )
} 