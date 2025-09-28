# 🚀 Setup Supabase untuk Website Sekolah

## ❌ Masalah yang Ditemukan

Error 500 pada API routes disebabkan oleh:
1. **Row Level Security (RLS)** aktif di tabel Setting
2. **Tabel Setting** belum memiliki data awal

## 🔧 Solusi

### 1. Matikan Row Level Security (RLS)

1. Buka **Supabase Dashboard**
2. Pilih project Anda
3. Pergi ke **Table Editor**
4. Pilih tabel **Setting**
5. Pergi ke **Settings** → **Row Level Security**
6. **Matikan RLS** untuk tabel Setting

### 2. Buat Tabel Setting (jika belum ada)

Jalankan query berikut di **SQL Editor** di Supabase Dashboard:

```sql
CREATE TABLE Setting (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Matikan RLS
ALTER TABLE Setting DISABLE ROW LEVEL SECURITY;

-- Insert data awal
INSERT INTO Setting (key, value) VALUES 
('site_name', 'Sekolah Modern'),
('deskripsi', 'Deskripsi singkat tentang sekolah, visi, misi, dan keunggulan utama.'),
('jumlah_siswa', '320'),
('jumlah_guru', '18'),
('jumlah_staff', '6'),
('alamat', 'Jl. Pendidikan No. 123, Jakarta'),
('email_kontak', 'info@sekolahmodern.com'),
('telepon', '021-12345678'),
('lat_sekolah', '-6.2'),
('lng_sekolah', '106.816666');
```

### 3. Buat Tabel Lainnya (jika belum ada)

```sql
-- Tabel Program
CREATE TABLE Program (
  id SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  kategori TEXT NOT NULL,
  durasi TEXT,
  target TEXT,
  manfaat TEXT[] DEFAULT '{}',
  persyaratan TEXT[] DEFAULT '{}',
  biaya NUMERIC,
  aktif BOOLEAN DEFAULT TRUE
);

-- Tabel Guru
CREATE TABLE Guru (
  id SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  jabatan TEXT NOT NULL,
  foto TEXT,
  kategori TEXT NOT NULL DEFAULT 'guru'
);

-- Tabel Fasilitas
CREATE TABLE Fasilitas (
  id SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  kategori TEXT NOT NULL,
  kapasitas INTEGER,
  status TEXT NOT NULL DEFAULT 'tersedia',
  foto TEXT
);

-- Tabel Prestasi
CREATE TABLE Prestasi (
  id SERIAL PRIMARY KEY,
  judul TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  kategori TEXT NOT NULL,
  tingkat TEXT NOT NULL,
  tahun TEXT NOT NULL,
  pencapaian TEXT NOT NULL,
  foto TEXT
);

-- Tabel Galeri
CREATE TABLE Galeri (
  id SERIAL PRIMARY KEY,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  foto TEXT[] DEFAULT '{}',
  kategori TEXT,
  tanggal TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'published'
);

-- Tabel Berita
CREATE TABLE Berita (
  id SERIAL PRIMARY KEY,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  gambar TEXT,
  tanggal TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  konten TEXT NOT NULL,
  slug TEXT UNIQUE,
  views INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  featured BOOLEAN DEFAULT FALSE
);
```

### 4. Matikan RLS untuk Semua Tabel

```sql
-- Matikan RLS untuk semua tabel
ALTER TABLE Setting DISABLE ROW LEVEL SECURITY;
ALTER TABLE Program DISABLE ROW LEVEL SECURITY;
ALTER TABLE Guru DISABLE ROW LEVEL SECURITY;
ALTER TABLE Fasilitas DISABLE ROW LEVEL SECURITY;
ALTER TABLE Prestasi DISABLE ROW LEVEL SECURITY;
ALTER TABLE Galeri DISABLE ROW LEVEL SECURITY;
ALTER TABLE Berita DISABLE ROW LEVEL SECURITY;
```

## ✅ Setelah Setup

1. Restart development server: `npm run dev`
2. Buka admin dashboard: `http://localhost:3000/admin`
3. Login dengan: `admin` / `admin123`
4. Semua fitur CMS akan berfungsi normal

## 🔍 Troubleshooting

Jika masih ada error:
1. Pastikan file `.env` sudah ada dengan konfigurasi Supabase yang benar
2. Pastikan RLS sudah dimatikan untuk semua tabel
3. Cek console browser untuk error detail
4. Cek terminal untuk error server

## 📞 Bantuan

Jika masih ada masalah, periksa:
- Konfigurasi Supabase di `.env`
- Status RLS di Supabase Dashboard
- Log error di browser console
- Log error di terminal server
