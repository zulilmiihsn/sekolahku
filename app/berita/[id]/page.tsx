'use client';
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import MasukHalaman from '@/components/MasukHalaman'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import ReactMarkdown from 'react-markdown'

interface Berita {
  id: number
  judul: string
  deskripsi: string
  gambar?: string
  tanggal: string
  konten: string
}

export default function DetailBerita({ params }: { params: { id: string } }) {
  const [berita, setBerita] = useState<Berita | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/berita/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Berita tidak ditemukan')
        return res.json()
      })
      .then(data => {
        setBerita(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Berita tidak ditemukan')
        setLoading(false)
      })
  }, [params.id])

  return (
    <MasukHalaman>
      <Navbar />
      {berita && (
        <Head>
          <title>{berita.judul} | Berita Sekolah</title>
          <meta name="description" content={berita.deskripsi} />
          {berita.gambar && <meta property="og:image" content={berita.gambar} />}
        </Head>
      )}
      <main className="max-w-2xl mx-auto py-24 px-4">
        {loading ? <div>Loading...</div> : error ? (
          <div className="text-center text-red-500 py-16">{error}</div>
        ) : berita && (
          <article>
            <h1 className="text-3xl font-bold text-primary mb-2">{berita.judul}</h1>
            <div className="text-sm text-text/70 mb-4">{new Date(berita.tanggal).toLocaleString()}</div>
            {berita.gambar && (
              <div className="mb-6">
                <Image src={berita.gambar} alt={berita.judul} width={600} height={400} className="rounded-xl shadow max-h-80 object-cover w-full" />
              </div>
            )}
            <div className="prose prose-blue max-w-none text-lg">
              <ReactMarkdown>{berita.konten}</ReactMarkdown>
            </div>
          </article>
        )}
      </main>
    </MasukHalaman>
  )
} 