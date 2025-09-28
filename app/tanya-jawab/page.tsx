import { motion } from 'framer-motion'
import AnimasiHalaman from '../../components/animasiHalaman'

const faq = [
  { q: 'Bagaimana cara mendaftar?', a: 'Silakan kunjungi halaman Pendaftaran dan isi formulir yang tersedia.' },
  { q: 'Apakah ada beasiswa?', a: 'Ya, tersedia program beasiswa untuk siswa berprestasi dan kurang mampu.' },
  { q: 'Dimana lokasi sekolah?', a: 'Sekolah Modern berlokasi di pusat kota dengan akses mudah.' },
]

export default function FAQ() {
  return (
    <AnimasiHalaman>
      <main className="max-w-2xl mx-auto py-24 px-4 min-h-screen flex flex-col justify-center">
        <h1 className="text-4xl font-extrabold text-primary mb-8 text-center">FAQ</h1>
        <div className="space-y-6">
          {faq.map((item, i) => (
            <div key={i} className="bg-background rounded-xl shadow p-5">
              <div className="font-semibold text-primary mb-1">Q: {item.q}</div>
              <div className="text-text/80">A: {item.a}</div>
            </div>
          ))}
        </div>
      </main>
    </AnimasiHalaman>
  )
} 