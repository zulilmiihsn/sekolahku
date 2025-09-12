import { useEffect, useState, useRef } from "react";
import Image from 'next/image'
import { supabase } from "../../utils/supabaseClient";
import NoPhotoPlaceholder from "@/components/NoPhotoPlaceholder";
import { Trash2, UploadCloud } from "lucide-react";

export default function AdminGaleri() {
  const [galeri, setGaleri] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ambil daftar gambar galeri
  const fetchGaleri = async () => {
    setLoading(true);
    const res = await fetch("/api/galeri");
    if (res.ok) {
      const data = await res.json();
      setGaleri(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGaleri();
  }, []);

  // Upload gambar ke Supabase Storage
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 8)}.${fileExt}`;
      const { error } = await supabase.storage.from('galeri').upload(fileName, file, { upsert: false });
      if (error) {
        alert('Gagal upload: ' + error.message);
      }
    }
    setUploading(false);
    fetchGaleri();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Hapus gambar dari galeri
  const handleDelete = async (url: string) => {
    if (!confirm('Hapus gambar ini dari galeri?')) return;
    // Path = nama file setelah .../object/public/galeri/
    const path = url.split('/galeri/')[1];
    if (!path) return alert('Path gambar tidak valid');
    setLoading(true);
    const res = await fetch('/api/galeri', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    });
    if (!res.ok) {
      const err = await res.json();
      alert('Gagal hapus: ' + err.error);
    }
    setLoading(false);
    fetchGaleri();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-primary">Kelola Galeri Sekolah</h2>
        <label className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-accent transition-colors cursor-pointer">
          <UploadCloud className="w-5 h-5" />
          {uploading ? 'Mengupload...' : 'Upload Foto'}
          <input type="file" accept="image/*" multiple hidden ref={fileInputRef} onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      {loading ? (
        <div className="text-center text-text/60 py-8">Memuat data...</div>
      ) : galeri.length === 0 ? (
        <NoPhotoPlaceholder />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galeri.map((url, i) => (
            <div key={url} className="relative group border rounded-lg overflow-hidden bg-gray-50">
              <Image src={url} alt={`Galeri ${i+1}`} width={400} height={160} className="object-cover w-full h-40" />
              <button
                className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-red-500 opacity-0 group-hover:opacity-100 transition"
                onClick={() => handleDelete(url)}
                title="Hapus foto"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 