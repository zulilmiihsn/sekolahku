"use client";
import { useState, useEffect } from 'react';
import { School, Users, User, BookOpen, MapPin, Mail, Phone, Calendar, Award, Building2, Save, Check } from 'lucide-react';
import { AdminCard, AdminFormField, AdminInput, AdminTextarea, AdminButton } from './komponenForm';
import { AdminAlert } from './komponenUI';
import { LoadingSpinner } from '@/components/loadingSpinner';
import { SkeletonLoader } from '@/components/loadingSpinner';

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
  const [saving, setSaving] = useState({});
  const [message, setMessage] = useState('');
  const [savedFields, setSavedFields] = useState(new Set());

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

  const handleSaveIndividual = async (field: string, value: any) => {
    setSaving(prev => ({ ...prev, [field]: true }));
    setMessage('');
    
    try {
      let endpoint = '';
      let body = {};
      
      switch (field) {
        case 'siteName':
          endpoint = '/api/pengaturan/nama-situs';
          body = { site_name: value.trim() };
          break;
        case 'deskripsi':
          endpoint = '/api/pengaturan/deskripsi';
          body = { deskripsi: value.trim() };
          break;
        case 'jumlahSiswa':
          endpoint = '/api/pengaturan/jumlah-siswa';
          body = { jumlah_siswa: Number(value) };
          break;
        case 'jumlahGuru':
          endpoint = '/api/pengaturan/jumlah-guru';
          body = { jumlah_guru: Number(value) };
          break;
        case 'jumlahStaff':
          endpoint = '/api/pengaturan/jumlah-staff';
          body = { jumlah_staff: Number(value) };
          break;
        case 'kontak':
          endpoint = '/api/pengaturan/kontak';
          body = {
            alamat: alamat.trim(),
            email: email.trim(),
            telepon: telepon.trim(),
            lat: '-6.2',
            lng: '106.816666'
          };
          break;
        default:
          throw new Error('Field tidak valid');
      }

      const response = await fetch(endpoint, {
        method: field === 'kontak' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const result = await response.json();
      
      if (result.error) {
        setMessage(`Gagal menyimpan ${field}: ${result.error}`);
      } else {
        setMessage(`${field} berhasil disimpan!`);
        setSavedFields(prev => new Set([...prev, field]));
        setTimeout(() => {
          setMessage('');
          setSavedFields(prev => {
            const newSet = new Set(prev);
            newSet.delete(field);
            return newSet;
          });
        }, 2000);
      }
    } catch (err) {
      setMessage(`Terjadi kesalahan saat menyimpan ${field}`);
    } finally {
      setSaving(prev => ({ ...prev, [field]: false }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminCard
          title="Informasi Dasar"
          description="Kelola nama sekolah, deskripsi, dan informasi umum"
          icon={School}
        >
          <SkeletonLoader lines={4} />
        </AdminCard>
        <AdminCard
          title="Statistik Sekolah"
          description="Kelola jumlah siswa, guru, dan staff"
          icon={Users}
        >
          <SkeletonLoader lines={3} />
        </AdminCard>
        <AdminCard
          title="Kontak & Lokasi"
          description="Kelola informasi kontak dan alamat sekolah"
          icon={MapPin}
        >
          <SkeletonLoader lines={3} />
        </AdminCard>
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

      {/* Informasi Dasar */}
      <AdminCard
        title="Informasi Dasar"
        description="Kelola nama sekolah, deskripsi, dan informasi umum"
        icon={School}
      >
        <div className="space-y-6">
          {/* Nama Sekolah */}
          <div className="space-y-3">
            <AdminFormField label="Nama Sekolah" required>
              <div className="flex items-center gap-3">
                <AdminInput
                  value={siteName}
                  onChange={setSiteName}
                  placeholder="Masukkan nama sekolah"
                  className="flex-1"
                />
                <AdminButton
                  onClick={() => handleSaveIndividual('siteName', siteName)}
                  disabled={saving.siteName || !siteName.trim()}
                  loading={saving.siteName}
                  size="sm"
                  variant="outline"
                >
                  {savedFields.has('siteName') ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                </AdminButton>
              </div>
            </AdminFormField>
          </div>

          {/* Deskripsi */}
          <div className="space-y-3">
            <AdminFormField label="Deskripsi Singkat" required>
              <div className="space-y-3">
                <AdminTextarea
                  value={deskripsi}
                  onChange={setDeskripsi}
                  placeholder="Deskripsi singkat tentang sekolah, visi, misi, atau keunggulan utama."
                  rows={4}
                />
                <div className="flex justify-end">
                  <AdminButton
                    onClick={() => handleSaveIndividual('deskripsi', deskripsi)}
                    disabled={saving.deskripsi || !deskripsi.trim()}
                    loading={saving.deskripsi}
                    size="sm"
                    variant="outline"
                  >
                    {savedFields.has('deskripsi') ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  </AdminButton>
                </div>
              </div>
            </AdminFormField>
          </div>

          {/* Tahun Berdiri & Akreditasi */}
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

      {/* Statistik Sekolah */}
      <AdminCard
        title="Statistik Sekolah"
        description="Kelola jumlah siswa, guru, dan staff"
        icon={Users}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Jumlah Siswa */}
            <div className="space-y-3">
              <AdminFormField label="Jumlah Siswa" required>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <AdminInput
                    type="number"
                    value={jumlahSiswa}
                    onChange={(val) => setJumlahSiswa(Math.max(0, parseInt(val) || 0))}
                    placeholder="0"
                    min={0}
                    className="flex-1"
                  />
                  <AdminButton
                    onClick={() => handleSaveIndividual('jumlahSiswa', jumlahSiswa)}
                    disabled={saving.jumlahSiswa}
                    loading={saving.jumlahSiswa}
                    size="sm"
                    variant="outline"
                  >
                    {savedFields.has('jumlahSiswa') ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  </AdminButton>
                </div>
              </AdminFormField>
            </div>

            {/* Jumlah Guru */}
            <div className="space-y-3">
              <AdminFormField label="Jumlah Guru" required>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <AdminInput
                    type="number"
                    value={jumlahGuru}
                    onChange={(val) => setJumlahGuru(Math.max(0, parseInt(val) || 0))}
                    placeholder="0"
                    min={0}
                    className="flex-1"
                  />
                  <AdminButton
                    onClick={() => handleSaveIndividual('jumlahGuru', jumlahGuru)}
                    disabled={saving.jumlahGuru}
                    loading={saving.jumlahGuru}
                    size="sm"
                    variant="outline"
                  >
                    {savedFields.has('jumlahGuru') ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  </AdminButton>
                </div>
              </AdminFormField>
            </div>

            {/* Jumlah Staff */}
            <div className="space-y-3">
              <AdminFormField label="Jumlah Staff" required>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <AdminInput
                    type="number"
                    value={jumlahStaff}
                    onChange={(val) => setJumlahStaff(Math.max(0, parseInt(val) || 0))}
                    placeholder="0"
                    min={0}
                    className="flex-1"
                  />
                  <AdminButton
                    onClick={() => handleSaveIndividual('jumlahStaff', jumlahStaff)}
                    disabled={saving.jumlahStaff}
                    loading={saving.jumlahStaff}
                    size="sm"
                    variant="outline"
                  >
                    {savedFields.has('jumlahStaff') ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  </AdminButton>
                </div>
              </AdminFormField>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Kontak & Lokasi */}
      <AdminCard
        title="Kontak & Lokasi"
        description="Kelola informasi kontak dan alamat sekolah"
        icon={MapPin}
      >
        <div className="space-y-6">
          {/* Alamat */}
          <div className="space-y-3">
            <AdminFormField label="Alamat Lengkap" required>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-2" />
                  <AdminTextarea
                    value={alamat}
                    onChange={setAlamat}
                    placeholder="Masukkan alamat lengkap sekolah"
                    rows={3}
                    className="flex-1"
                  />
                </div>
              </div>
            </AdminFormField>
          </div>

          {/* Email & Telepon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminFormField label="Email Kontak" required>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <AdminInput
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="info@sekolahmodern.com"
                  className="flex-1"
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
                  className="flex-1"
                />
              </div>
            </AdminFormField>
          </div>

          {/* Save Kontak */}
          <div className="flex justify-end">
            <AdminButton
              onClick={() => handleSaveIndividual('kontak', null)}
              disabled={saving.kontak || !alamat.trim() || !email.trim() || !telepon.trim()}
              loading={saving.kontak}
              size="sm"
              variant="outline"
            >
              {savedFields.has('kontak') ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              Simpan Kontak
            </AdminButton>
          </div>
        </div>
      </AdminCard>
    </div>
  );
} 