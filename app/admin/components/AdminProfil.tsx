"use client";
import { useState, useEffect } from 'react';
import { Save, School, Users, User, BookOpen } from 'lucide-react';

export default function AdminProfil() {
  const [siteName, setSiteName] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [jumlahSiswa, setJumlahSiswa] = useState(0);
  const [jumlahGuru, setJumlahGuru] = useState(0);
  const [jumlahStaff, setJumlahStaff] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [siteNameRes, deskripsiRes, siswaRes, guruRes, staffRes] = await Promise.all([
        fetch('/api/pengaturan/site-name').then(r => r.json()),
        fetch('/api/pengaturan/deskripsi').then(r => r.json()),
        fetch('/api/pengaturan/jumlah-siswa').then(r => r.json()),
        fetch('/api/pengaturan/jumlah-guru').then(r => r.json()),
        fetch('/api/pengaturan/jumlah-staff').then(r => r.json()),
      ]);
      setSiteName(siteNameRes.site_name || 'Sekolah Modern');
      setDeskripsi(deskripsiRes.deskripsi || '');
      setJumlahSiswa(siswaRes.jumlah_siswa || 0);
      setJumlahGuru(guruRes.jumlah_guru || 0);
      setJumlahStaff(staffRes.jumlah_staff || 0);
    } catch (err) {
      setMessage('Gagal memuat data profil');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const [siteNameRes, deskripsiRes, siswaRes, guruRes, staffRes] = await Promise.all([
        fetch('/api/pengaturan/site-name', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ site_name: siteName.trim() })
        }).then(r => r.json()),
        fetch('/api/pengaturan/deskripsi', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deskripsi: deskripsi.trim() })
        }).then(r => r.json()),
        fetch('/api/pengaturan/jumlah-siswa', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jumlah_siswa: Number(jumlahSiswa) })
        }).then(r => r.json()),
        fetch('/api/pengaturan/jumlah-guru', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jumlah_guru: Number(jumlahGuru) })
        }).then(r => r.json()),
        fetch('/api/pengaturan/jumlah-staff', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jumlah_staff: Number(jumlahStaff) })
        }).then(r => r.json()),
      ]);
      if (siteNameRes.error || deskripsiRes.error || siswaRes.error || guruRes.error || staffRes.error) {
        setMessage('Gagal menyimpan profil. Pastikan semua field terisi dengan benar.');
      } else {
        setMessage('Profil sekolah berhasil diperbarui!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary/10 rounded-lg">
          <School className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-primary">Profil Sekolah</h3>
          <p className="text-sm text-text/60">Kelola nama sekolah, deskripsi, dan statistik utama</p>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <label htmlFor="siteName" className="block text-sm font-medium text-text mb-2">Nama Sekolah</label>
          <input
            type="text"
            id="siteName"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="Masukkan nama sekolah"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="deskripsi" className="block text-sm font-medium text-text mb-2">Deskripsi Singkat</label>
          <textarea
            id="deskripsi"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Deskripsi singkat tentang sekolah, visi, misi, atau keunggulan utama."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent min-h-[80px]"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="jumlahSiswa" className="block text-sm font-medium text-text mb-2">Jumlah Siswa</label>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              <input
                type="number"
                id="jumlahSiswa"
                value={jumlahSiswa}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) setJumlahSiswa(val === '' ? 0 : Math.max(0, parseInt(val)));
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min={0}
                step={1}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
          </div>
          <div>
            <label htmlFor="jumlahGuru" className="block text-sm font-medium text-text mb-2">Jumlah Guru</label>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-accent" />
              <input
                type="number"
                id="jumlahGuru"
                value={jumlahGuru}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) setJumlahGuru(val === '' ? 0 : Math.max(0, parseInt(val)));
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min={0}
                step={1}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
          </div>
          <div>
            <label htmlFor="jumlahStaff" className="block text-sm font-medium text-text mb-2">Jumlah Staff</label>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              <input
                type="number"
                id="jumlahStaff"
                value={jumlahStaff}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) setJumlahStaff(val === '' ? 0 : Math.max(0, parseInt(val)));
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min={0}
                step={1}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
          </div>
        </div>
        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.includes('berhasil') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors disabled:opacity-50 w-full md:w-fit md:self-end"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  );
} 