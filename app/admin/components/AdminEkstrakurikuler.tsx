import { useState, useRef, useEffect } from "react"
import Image from 'next/image'
import { supabase } from "../../utils/SupabaseClient"
import NoPhotoPlaceholder from "@/components/PenggantiTanpaFoto"
import { Trash2, UploadCloud } from "lucide-react"

interface Ekstrakurikuler {
  id: number
  nama: string
  deskripsi: string
  foto: string[]
}

export default function AdminEkstrakurikuler() {
  const [list, setList] = useState<Ekstrakurikuler[]>([])
  const [loading, setLoading] = useState(true)
  const [notif, setNotif] = useState("")
  const [input, setInput] = useState({ nama: "", deskripsi: "", foto: [] as string[] })
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [editInput, setEditInput] = useState({ nama: "", deskripsi: "", foto: [] as string[] })
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileEditInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchList() }, [])

  async function fetchList() {
    setLoading(true)
    const res = await fetch("/api/ekstrakurikuler")
    const data = await res.json()
    setList(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  async function handleSave(e: any) {
    e.preventDefault()
    if (!input.nama) return setNotif("Nama wajib diisi")
    const res = await fetch("/api/ekstrakurikuler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    })
    if (res.ok) {
      setNotif("Berhasil menambah ekstrakurikuler!")
      setInput({ nama: "", deskripsi: "", foto: [] })
      fetchList()
    } else {
      setNotif("Gagal menambah ekstrakurikuler")
    }
  }

  function handleEdit(idx: number) {
    setEditIdx(idx)
    setEditInput({ ...list[idx] })
  }

  async function handleUpdate(e: any, id: number) {
    e.preventDefault()
    const res = await fetch("/api/ekstrakurikuler", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editInput, id })
    })
    if (res.ok) {
      setNotif("Berhasil update ekstrakurikuler!")
      setEditIdx(null)
      fetchList()
    } else {
      setNotif("Gagal update ekstrakurikuler")
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus ekstrakurikuler ini?")) return
    const res = await fetch("/api/ekstrakurikuler", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
    if (res.ok) {
      setNotif("Berhasil menghapus!")
      fetchList()
    } else {
      setNotif("Gagal menghapus")
    }
  }

  async function handleUploadFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    const uploaded: string[] = []
    for (const file of files) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 8)}.${fileExt}`
      const { error } = await supabase.storage.from('ekstrakurikuler').upload(fileName, file, { upsert: false })
      if (!error) {
        const { data } = supabase.storage.from('ekstrakurikuler').getPublicUrl(fileName)
        uploaded.push(data.publicUrl)
      }
    }
    setInput(v => ({ ...v, foto: [...v.foto, ...uploaded] }))
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleUploadFotoEdit(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    const uploaded: string[] = []
    for (const file of files) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 8)}.${fileExt}`
      const { error } = await supabase.storage.from('ekstrakurikuler').upload(fileName, file, { upsert: false })
      if (!error) {
        const { data } = supabase.storage.from('ekstrakurikuler').getPublicUrl(fileName)
        uploaded.push(data.publicUrl)
      }
    }
    setEditInput(v => ({ ...v, foto: [...v.foto, ...uploaded] }))
    setUploading(false)
    if (fileEditInputRef.current) fileEditInputRef.current.value = ''
  }

  function handleRemoveFoto(idx: number) {
    setInput(v => ({ ...v, foto: v.foto.filter((_, i) => i !== idx) }))
  }
  function handleRemoveFotoEdit(idx: number) {
    setEditInput(v => ({ ...v, foto: v.foto.filter((_, i) => i !== idx) }))
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
      <h2 className="text-lg font-bold text-primary mb-4">Kelola Ekstrakurikuler</h2>
      {notif && <div className="text-green-600 text-sm mb-2">{notif}</div>}
      {/* Form tambah */}
      <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-6 items-start mb-8">
        <div className="flex-1 space-y-2">
          <input type="text" className="w-full p-2 border rounded" placeholder="Nama ekstrakurikuler" value={input.nama} onChange={e => setInput(v => ({ ...v, nama: e.target.value }))} />
          <textarea className="w-full p-2 border rounded" placeholder="Deskripsi" value={input.deskripsi} onChange={e => setInput(v => ({ ...v, deskripsi: e.target.value }))} />
        </div>
        <div className="flex flex-col gap-2 items-center">
          <label className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-accent transition-colors cursor-pointer">
            <UploadCloud className="w-5 h-5" />
            {uploading ? 'Mengupload...' : 'Upload Foto'}
            <input type="file" accept="image/*" multiple hidden ref={fileInputRef} onChange={handleUploadFoto} disabled={uploading} />
          </label>
          <div className="flex gap-2 flex-wrap mt-2">
            {input.foto.map((url, i) => (
              <div key={url} className="relative group w-20 h-20 rounded overflow-hidden border">
                <Image src={url} alt="foto" width={80} height={80} className="object-cover w-full h-full" />
                <button type="button" className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-500 opacity-0 group-hover:opacity-100 transition" onClick={() => handleRemoveFoto(i)}><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="px-6 py-2 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-accent transition-colors">Tambah</button>
      </form>
      {/* List ekstrakurikuler */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-xl overflow-hidden">
          <thead className="bg-primary/10">
            <tr>
              <th className="px-4 py-2 text-left">Nama</th>
              <th className="px-4 py-2 text-left">Deskripsi</th>
              <th className="px-4 py-2 text-left">Foto</th>
              <th className="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, idx) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2 font-semibold text-primary w-48">{item.nama}</td>
                <td className="px-4 py-2 text-text/70 w-64">{item.deskripsi}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2 flex-wrap">
                    {item.foto && item.foto.length > 0 ? item.foto.map((url, i) => (
                      <Image key={i} src={url} alt="foto" width={48} height={48} className="w-12 h-12 object-cover rounded" />
                    )) : <NoPhotoPlaceholder className="w-12 h-12" />}
                  </div>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => handleEdit(idx)} className="px-4 py-1 rounded bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="px-4 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600 transition-colors">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal edit */}
      {editIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative border border-white/60">
            <button className="absolute top-4 right-4 text-xl text-primary hover:text-accent" onClick={() => setEditIdx(null)}>×</button>
            <h2 className="text-2xl font-bold mb-4 text-primary">Edit Ekstrakurikuler</h2>
            <form onSubmit={e => handleUpdate(e, list[editIdx].id)} className="flex flex-col gap-4">
              <input type="text" className="w-full p-2 border rounded" placeholder="Nama ekstrakurikuler" value={editInput.nama} onChange={e => setEditInput(v => ({ ...v, nama: e.target.value }))} />
              <textarea className="w-full p-2 border rounded" placeholder="Deskripsi" value={editInput.deskripsi} onChange={e => setEditInput(v => ({ ...v, deskripsi: e.target.value }))} />
              <div className="flex flex-col gap-2 items-start">
                <label className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-accent transition-colors cursor-pointer">
                  <UploadCloud className="w-5 h-5" />
                  {uploading ? 'Mengupload...' : 'Upload Foto'}
                  <input type="file" accept="image/*" multiple hidden ref={fileEditInputRef} onChange={handleUploadFotoEdit} disabled={uploading} />
                </label>
                <div className="flex gap-2 flex-wrap mt-2">
                  {editInput.foto.map((url, i) => (
                    <div key={url} className="relative group w-20 h-20 rounded overflow-hidden border">
                      <Image src={url} alt="foto" width={80} height={80} className="object-cover w-full h-full" />
                      <button type="button" className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-500 opacity-0 group-hover:opacity-100 transition" onClick={() => handleRemoveFotoEdit(i)}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit" className="px-6 py-2 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-accent transition">Update</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 