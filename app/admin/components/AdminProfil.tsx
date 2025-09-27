"use client";
import { useState, useEffect } from 'react';
import { School, Users, User, BookOpen, MapPin, Mail, Phone, Calendar, Award, Building2 } from 'lucide-react';
import AdminCard from './AdminCard';
import AdminFormField from './AdminFormField';
import AdminInput from './AdminInput';
import AdminTextarea from './AdminTextarea';
import AdminButton from './AdminButton';
import AdminAlert from './AdminAlert';

export default function AdminProfil() {
  const [siteName, setSiteName] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [jumlahSiswa, setJumlahSiswa] = useState(0);
  const [jumlahGuru, setJumlahGuru] = useState(0);
  const [jumlahStaff, setJumlahStaff] = useState(0);
  const [alamat, setAlamat] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [tahunBerdiri, setTahunBerdiri] = useState('');
  const [akreditasi, setAkreditasi] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [siteNameRes, deskripsiRes, siswaRes, guruRes, staffRes, kontakRes] = await Promise.all([
        fetch('/api/pengaturan/nama-situs').then(r => r.json()),
        fetch('/api/pengaturan/deskripsi').then(r => r.json()),
        fetch('/api/pengaturan/jumlah-siswa').then(r => r.json()),
        fetch('/api/pengaturan/jumlah-guru').then(r => r.json()),
        fetch('/api/pengaturan/jumlah-staff').then(r => r.json()),
        fetch('/api/pengaturan/kontak').then(r => r.json()),
      ]);
      setSiteName(siteNameRes.site_name || 'Sekolah Modern');
      setDeskripsi(deskripsiRes.deskripsi || '');
      setJumlahSiswa(siswaRes.jumlah_siswa || 0);
      setJumlahGuru(guruRes.jumlah_guru || 0);
      setJumlahStaff(staffRes.jumlah_staff || 0);
      setAlamat(kontakRes.alamat || '');
      setEmail(kontakRes.email || '');
      setTelepon(kontakRes.telepon || '');
      setTahunBerdiri('2010'); // Default value
      setAkreditasi('A'); // Default value
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
      const [siteNameRes, deskripsiRes, siswaRes, guruRes, staffRes, kontakRes] = await Promise.all([
        fetch('/api/pengaturan/nama-situs', {
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
        fetch('/api/pengaturan/kontak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            alamat: alamat.trim(),
            email: email.trim(),
            telepon: telepon.trim(),
            lat: '-6.2',
            lng: '106.816666'
          })
        }).then(r => r.json()),
      ]);
      if (siteNameRes.error || deskripsiRes.error || siswaRes.error || guruRes.error || staffRes.error || kontakRes.error) {
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
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <AdminAlert 
          type={message.includes('berhasil') ? 'success' : 'error'}
          onClose={() => setMessage('')}
        >
          {message}
        </AdminAlert>
      )}

      <AdminCard
        title="Informasi Dasar"
        description="Kelola nama sekolah, deskripsi, dan informasi umum"
        icon={School}
      >
        <div className="space-y-6">
          <AdminFormField label="Nama Sekolah" required>
            <AdminInput
              value={siteName}
              onChange={setSiteName}
              placeholder="Masukkan nama sekolah"
            />
          </AdminFormField>

          <AdminFormField label="Deskripsi Singkat" required>
            <AdminTextarea
              value={deskripsi}
              onChange={setDeskripsi}
              placeholder="Deskripsi singkat tentang sekolah, visi, misi, atau keunggulan utama."
              rows={4}
            />
          </AdminFormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminFormField label="Tahun Berdiri">
              <AdminInput
                type="number"
                value={tahunBerdiri}
                onChange={setTahunBerdiri}
                placeholder="Contoh: 2010"
                min={1900}
                max={new Date().getFullYear()}
              />
            </AdminFormField>

            <AdminFormField label="Akreditasi">
              <AdminInput
                value={akreditasi}
                onChange={setAkreditasi}
                placeholder="Contoh: A, B, C"
              />
            </AdminFormField>
          </div>
        </div>
      </AdminCard>

      <AdminCard
        title="Statistik Sekolah"
        description="Kelola jumlah siswa, guru, dan staff"
        icon={Users}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminFormField label="Jumlah Siswa" required>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <AdminInput
                type="number"
                value={jumlahSiswa}
                onChange={(val) => setJumlahSiswa(Math.max(0, parseInt(val) || 0))}
                placeholder="0"
                min={0}
              />
            </div>
          </AdminFormField>

          <AdminFormField label="Jumlah Guru" required>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <AdminInput
                type="number"
                value={jumlahGuru}
                onChange={(val) => setJumlahGuru(Math.max(0, parseInt(val) || 0))}
                placeholder="0"
                min={0}
              />
            </div>
          </AdminFormField>

          <AdminFormField label="Jumlah Staff" required>
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <AdminInput
                type="number"
                value={jumlahStaff}
                onChange={(val) => setJumlahStaff(Math.max(0, parseInt(val) || 0))}
                placeholder="0"
                min={0}
              />
            </div>
          </AdminFormField>
        </div>
      </AdminCard>

      <AdminCard
        title="Kontak & Lokasi"
        description="Kelola informasi kontak dan alamat sekolah"
        icon={MapPin}
      >
        <div className="space-y-6">
          <AdminFormField label="Alamat Lengkap" required>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-2" />
              <AdminTextarea
                value={alamat}
                onChange={setAlamat}
                placeholder="Masukkan alamat lengkap sekolah"
                rows={3}
              />
            </div>
          </AdminFormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminFormField label="Email Kontak" required>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <AdminInput
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="info@sekolahmodern.com"
                />
              </div>
            </AdminFormField>

            <AdminFormField label="Nomor Telepon" required>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <AdminInput
                  type="tel"
                  value={telepon}
                  onChange={setTelepon}
                  placeholder="021-12345678"
                />
              </div>
            </AdminFormField>
          </div>
        </div>
      </AdminCard>

      <div className="flex justify-end">
        <AdminButton
          onClick={handleSave}
          disabled={saving}
          loading={saving}
          size="lg"
        >
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </AdminButton>
      </div>
    </div>
  );
} 