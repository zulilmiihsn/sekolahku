# 🗄️ Panduan Migrasi Database ke Supabase Baru

## 📋 **Overview**
File `database-schema.sql` ini berisi semua query SQL yang diperlukan untuk membuat database lengkap di Supabase baru berdasarkan struktur project Sekolah Modern.

## 🚀 **Cara Menggunakan**

### **1. Persiapan Supabase Baru**
1. Buat project baru di [Supabase Dashboard](https://supabase.com/dashboard)
2. Catat URL dan API keys dari project baru
3. Update file `.env.local` dengan credentials baru:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_new_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_new_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_new_service_role_key
   ```

### **2. Eksekusi SQL Schema**
1. Buka Supabase Dashboard → SQL Editor
2. Copy seluruh isi file `database-schema.sql`
3. Paste ke SQL Editor
4. Klik **Run** untuk mengeksekusi

### **3. Verifikasi Setup**
Setelah eksekusi selesai, periksa:
- ✅ Semua tabel terbuat
- ✅ Data default ter-insert
- ✅ Storage buckets terbuat
- ✅ RLS policies aktif

## 📊 **Struktur Database**

### **Tabel Utama:**

#### **1. Setting** - Konfigurasi Aplikasi
```sql
- id (SERIAL PRIMARY KEY)
- key (VARCHAR(255) UNIQUE)
- value (TEXT)
- created_at, updated_at
```

#### **2. User** - Admin Authentication
```sql
- id (SERIAL PRIMARY KEY)
- username (VARCHAR(100) UNIQUE)
- password (VARCHAR(255)) -- bcrypt hashed
- role (VARCHAR(50))
- is_active (BOOLEAN)
- created_at, updated_at
```

#### **3. ProfilSekolah** - Konten Profil Sekolah
```sql
- id (SERIAL PRIMARY KEY)
- section (VARCHAR(100) UNIQUE) -- 'profil', 'program', 'tentang', 'guru'
- judul (VARCHAR(255))
- deskripsi (TEXT)
- konten (TEXT) -- JSON format
- created_at, updated_at
```

#### **4. Berita** - Artikel Berita
```sql
- id (SERIAL PRIMARY KEY)
- judul (VARCHAR(255))
- deskripsi (TEXT)
- konten (TEXT)
- gambar (VARCHAR(500))
- tanggal (TIMESTAMP)
- created_at, updated_at
```

#### **5. Fasilitas** - Data Fasilitas Sekolah
```sql
- id (SERIAL PRIMARY KEY)
- nama (VARCHAR(255))
- deskripsi (TEXT)
- foto (TEXT[]) -- Array of URLs
- created_at, updated_at
```

#### **6. Prestasi** - Data Prestasi Siswa
```sql
- id (SERIAL PRIMARY KEY)
- nama/judul (VARCHAR(255))
- peraih/siswa (VARCHAR(255))
- tahun (INTEGER)
- foto (TEXT[]) -- Array of URLs
- created_at, updated_at
```

#### **7. Galeri** - Galeri Foto
```sql
- id (SERIAL PRIMARY KEY)
- judul (VARCHAR(255))
- deskripsi (TEXT)
- foto (TEXT[]) -- Array of URLs
- kategori (VARCHAR(100))
- tanggal (TIMESTAMP)
- created_at, updated_at
```

#### **8. Ekstrakurikuler** - Data Ekstrakurikuler
```sql
- id (SERIAL PRIMARY KEY)
- nama (VARCHAR(255))
- deskripsi (TEXT)
- foto (TEXT[]) -- Array of URLs
- created_at, updated_at
```

#### **9. KategoriGuru** - Kategori Guru/Staff
```sql
- id (SERIAL PRIMARY KEY)
- key (VARCHAR(100) UNIQUE)
- label (VARCHAR(255))
- created_at, updated_at
```

## 🗂️ **Storage Buckets**

### **Bucket yang Dibuat:**
- `galeri` - Foto galeri sekolah
- `berita` - Gambar artikel berita
- `fasilitas` - Foto fasilitas sekolah
- `prestasi` - Foto prestasi siswa
- `ekstrakurikuler` - Foto kegiatan ekstrakurikuler
- `guru` - Foto profil guru dan staff

### **Konfigurasi:**
- ✅ Public access untuk read
- ✅ Admin-only untuk write
- ✅ RLS policies aktif

## 🔐 **Keamanan (RLS Policies)**

### **Public Read Access:**
- Semua tabel konten dapat dibaca publik
- Storage buckets dapat diakses publik untuk read

### **Admin Write Access:**
- Hanya admin yang dapat menulis/edit data
- User table hanya bisa diakses admin
- Storage write access terbatas admin

## 📝 **Data Default yang Di-insert**

### **Admin User:**
- Username: `admin`
- Password: `admin123` (bcrypt hashed)
- Role: `admin`
- Status: `active`

### **Site Settings:**
- Site name: "Sekolah Modern"
- Contact info (alamat, email, telepon)
- Location coordinates
- Social media links
- School statistics (jumlah siswa, guru, staff)

### **Sample Content:**
- Sample berita (2 artikel)
- Sample fasilitas (3 fasilitas)
- Sample prestasi (3 prestasi)
- Sample galeri (3 album)
- Sample ekstrakurikuler (3 kegiatan)

## 🔧 **Fitur Tambahan**

### **Indexes:**
- Index pada kolom yang sering di-query
- Optimasi performa untuk pencarian

### **Triggers:**
- Auto-update `updated_at` timestamp
- Trigger pada semua tabel

### **Functions:**
- `update_updated_at_column()` - Update timestamp otomatis

## ⚠️ **Catatan Penting**

### **Password Admin:**
- Default password: `admin123`
- **WAJIB** diubah setelah setup pertama
- Gunakan bcrypt untuk hash password baru

### **RLS Policies:**
- Policies menggunakan `false` untuk admin write access
- Perlu implementasi JWT verification di aplikasi
- Update policies sesuai kebutuhan authentication

### **Storage:**
- Semua bucket dibuat dengan public read access
- Implementasi upload melalui admin panel
- Pastikan file validation di aplikasi

## 🚀 **Langkah Selanjutnya**

1. **Update Environment Variables**
   ```bash
   # Update .env.local dengan credentials baru
   NEXT_PUBLIC_SUPABASE_URL=your_new_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_new_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_new_service_key
   ```

2. **Test Connection**
   ```bash
   npm run dev
   # Test login admin dan semua fitur
   ```

3. **Upload Data Existing (Optional)**
   - Export data dari database lama
   - Import ke database baru
   - Upload file ke storage buckets

4. **Update Admin Password**
   - Login dengan admin/admin123
   - Ganti password di admin panel
   - Atau update langsung di database

## 📞 **Troubleshooting**

### **Error: Table already exists**
- Normal jika menjalankan script berulang
- Script menggunakan `IF NOT EXISTS`

### **Error: Permission denied**
- Pastikan menggunakan Service Role Key
- Check RLS policies

### **Error: Storage bucket exists**
- Normal jika bucket sudah ada
- Script menggunakan `ON CONFLICT DO NOTHING`

### **Login tidak berfungsi**
- Check password hash di database
- Pastikan JWT secret sama dengan aplikasi
- Verify user is_active = true

---

**🎉 Database migration selesai! Project siap digunakan dengan Supabase baru.**
