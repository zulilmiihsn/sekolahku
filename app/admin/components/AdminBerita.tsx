import { useState, useEffect, useRef } from "react"
import Image from 'next/image'
import dynamic from "next/dynamic"
import { supabase } from "../../utils/supabaseClient"
import ReactMde from "react-mde"
import Showdown from "showdown"
import ReactMarkdown from "react-markdown"
import { createPortal } from "react-dom"

interface Berita {
  id: number
  judul: string
  deskripsi: string
  gambar?: string
  tanggal: string
  konten: string
}

export default function AdminBerita({ siteName, onNotif }: { siteName?: string, onNotif?: (msg: string) => void }) {
  const [berita, setBerita] = useState<Berita[]>([])
  const [loadingBerita, setLoadingBerita] = useState(true)
  const [formBerita, setFormBerita] = useState({ judul: "", deskripsi: "", gambar: "", konten: "" })
  const [kontenBerita, setKontenBerita] = useState("")
  const [editIdBerita, setEditIdBerita] = useState<number | null>(null)
  const [notifBerita, setNotifBerita] = useState("")
  const [showModalBerita, setShowModalBerita] = useState(false)
  const [showConfirmBerita, setShowConfirmBerita] = useState<{ id: number, judul: string } | null>(null)
  const [deleteLoadingBerita, setDeleteLoadingBerita] = useState(false)
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write")
  const converter = new Showdown.Converter({ tables: true, simplifiedAutoLink: true })
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const fetchBerita = async () => {
    setLoadingBerita(true)
    const res = await fetch("/api/berita")
    if (!res.ok) {
      setBerita([])
      setLoadingBerita(false)
      return
    }
    const data = await res.json()
    setBerita(data)
    setLoadingBerita(false)
  }

  useEffect(() => {
    fetchBerita()
  }, [])

  const handleOpenModalBerita = () => {
    setShowModalBerita(true)
    setEditIdBerita(null)
    setFormBerita({ judul: "", deskripsi: "", gambar: "", konten: "" })
    setKontenBerita("")
  }

  const handleEditBerita = (b: Berita) => {
    setShowModalBerita(true)
    setEditIdBerita(b.id)
    setFormBerita({ judul: b.judul, deskripsi: b.deskripsi, gambar: b.gambar || "", konten: b.konten })
    setKontenBerita(b.konten)
  }

  const handleSubmitBerita = async (e: any) => {
    e.preventDefault()
    if (!formBerita.judul || !kontenBerita) return setNotifBerita("Judul & isi artikel wajib diisi!")
    let deskripsi = formBerita.deskripsi
    if (!deskripsi) {
      deskripsi = kontenBerita.split(/\n|\r|\r\n/)[0].slice(0, 200)
    }
    const body = { ...formBerita, deskripsi, konten: kontenBerita }
    let url = "/api/berita"
    let method = "POST"
    if (editIdBerita) {
      url = `/api/berita/${editIdBerita}`
      method = "PUT"
    }
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
    if (res.ok) {
      setNotifBerita(editIdBerita ? "Artikel berhasil diupdate!" : "Artikel berhasil ditambahkan!")
      setShowModalBerita(false)
      setEditIdBerita(null)
      setFormBerita({ judul: "", deskripsi: "", gambar: "", konten: "" })
      setKontenBerita("")
      fetchBerita()
    } else {
      setNotifBerita("Gagal menyimpan artikel!")
    }
  }

  const handleDeleteBerita = async (id: number) => {
    setDeleteLoadingBerita(true)
    const res = await fetch(`/api/berita/${id}`, { method: "DELETE" })
    if (res.ok) {
      setNotifBerita("Artikel berhasil dihapus!")
      setShowConfirmBerita(null)
      fetchBerita()
    } else {
      setNotifBerita("Gagal menghapus artikel!")
    }
    setDeleteLoadingBerita(false)
  }

  // Handler upload gambar ke bucket 'berita'
  const handleUploadGambar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 8)}.${fileExt}`;
    const { error } = await supabase.storage.from('berita').upload(fileName, file, { upsert: false });
    if (error) {
      alert('Gagal upload: ' + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('berita').getPublicUrl(fileName);
    setFormBerita(f => ({ ...f, gambar: data.publicUrl }));
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-primary">Kelola Berita / Artikel</h2>
        <button onClick={handleOpenModalBerita} className="px-6 py-2 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-accent transition-colors duration-200">Tambah Artikel</button>
      </div>
      {notifBerita && <div className="text-green-600 text-sm mb-2">{notifBerita}</div>}
      {loadingBerita ? (
        <div className="text-center text-text/60 py-8">Memuat data...</div>
      ) : berita.length === 0 ? (
        <div className="text-center text-text/60 py-8">Belum ada artikel.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-xl overflow-hidden">
            <thead className="bg-primary/10">
              <tr>
                <th className="px-4 py-2 text-left">Judul</th>
                <th className="px-4 py-2 text-left">Tanggal</th>
                <th className="px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {berita.map(b => (
                <tr key={b.id} className="border-b">
                  <td className="px-4 py-2 font-semibold text-primary">{b.judul}</td>
                  <td className="px-4 py-2 text-text/70">{new Date(b.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button onClick={() => handleEditBerita(b)} className="px-4 py-1 rounded bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors">Edit</button>
                    <button onClick={() => setShowConfirmBerita({ id: b.id, judul: b.judul })} className="px-4 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600 transition-colors">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal tambah/edit */}
      {showModalBerita && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-6xl relative border border-white/60 max-h-screen flex flex-col overflow-y-auto">
            <button className="absolute top-4 right-4 text-xl text-primary hover:text-accent" onClick={() => { setShowModalBerita(false); setEditIdBerita(null); setFormBerita({ judul: "", deskripsi: "", gambar: "", konten: "" }); setKontenBerita("") }}>×</button>
            <h2 className="text-2xl font-bold mb-4 text-primary">{editIdBerita ? "Edit Artikel" : "Tambah Artikel"}</h2>
            <form onSubmit={handleSubmitBerita} className="grid md:grid-cols-[320px_1fr] gap-10 flex-1 overflow-y-auto h-full">
              <div className="space-y-3 flex flex-col md:min-w-[260px] md:max-w-[320px]">
                <label className="block text-sm font-medium text-primary">Judul</label>
                <input type="text" placeholder="Judul" className="w-full p-2 border rounded" value={formBerita.judul} onChange={e => setFormBerita(f => ({ ...f, judul: e.target.value }))} />
                <label className="block text-sm font-medium text-primary">Gambar Berita</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleUploadGambar}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  {uploading && <span className="text-xs text-accent">Mengupload...</span>}
                </div>
                {formBerita.gambar && (
                  <Image src={formBerita.gambar} alt="Preview Gambar" width={640} height={240} sizes="(max-width:768px) 100vw, 640px" className="w-full rounded-lg mt-2 border object-cover max-h-40" />
                )}
                <label className="block text-sm font-medium text-primary">Deskripsi</label>
                <textarea className="w-full p-2 border rounded min-h-[60px]" value={formBerita.deskripsi} onChange={e => setFormBerita(f => ({ ...f, deskripsi: e.target.value }))} />
                <button type="submit" className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded shadow hover:bg-accent transition">{editIdBerita ? "Update" : "Tambah"}</button>
              </div>
              <div className="space-y-3 flex flex-col h-full flex-1 min-w-[400px] md:min-w-[600px] lg:min-w-[700px]">
                <label className="block text-sm font-medium text-primary">Isi</label>
                <div className="flex-1 min-h-[180px] h-full overflow-y-auto">
                  <div className="h-full">
                    <ReactMde
                      value={kontenBerita}
                      onChange={setKontenBerita}
                      selectedTab={selectedTab}
                      onTabChange={setSelectedTab}
                      generateMarkdownPreview={markdown => Promise.resolve(converter.makeHtml(markdown))}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>,
        typeof window !== 'undefined' ? document.body : document.createElement('div')
      )}
      {/* Modal konfirmasi hapus */}
      {showConfirmBerita && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-white/60 text-center">
            <h3 className="text-xl font-bold mb-4 text-primary">Hapus Artikel?</h3>
            <p className="mb-6">Yakin ingin menghapus artikel <span className="font-semibold text-accent">{showConfirmBerita.judul}</span>?</p>
            <div className="flex gap-4 justify-center">
              <button className="px-6 py-2 bg-gray-200 rounded shadow" onClick={() => setShowConfirmBerita(null)}>Batal</button>
              <button className="px-6 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition" onClick={() => handleDeleteBerita(showConfirmBerita.id)} disabled={deleteLoadingBerita}>{deleteLoadingBerita ? 'Menghapus...' : 'Hapus'}</button>
            </div>
          </div>
        </div>,
        typeof window !== 'undefined' ? document.body : document.createElement('div')
      )}
    </div>
  )
} 