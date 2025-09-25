-- =====================================================
-- COMPATIBLE DATABASE SCHEMA UNTUK PROJECT SEKOLAH MODERN
-- =====================================================
-- Schema yang kompatibel dengan kode existing tanpa breaking changes
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- =====================================================
-- 1. TABEL SETTING (Konfigurasi Aplikasi) - COMPATIBLE
-- =====================================================
CREATE TABLE IF NOT EXISTS "Setting" (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. TABEL USER (Admin Authentication) - COMPATIBLE
-- =====================================================
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TABEL PROFIL SEKOLAH - COMPATIBLE
-- =====================================================
CREATE TABLE IF NOT EXISTS "ProfilSekolah" (
    id SERIAL PRIMARY KEY,
    section VARCHAR(100) NOT NULL,
    judul VARCHAR(255),
    deskripsi TEXT,
    konten TEXT, -- Keep as TEXT for compatibility
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(section)
);

-- =====================================================
-- 4. TABEL BERITA - COMPATIBLE
-- =====================================================
CREATE TABLE IF NOT EXISTS "Berita" (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(500) NOT NULL, -- Increased size
    deskripsi TEXT,
    konten TEXT,
    gambar TEXT, -- Changed to TEXT for longer URLs
    tanggal TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. TABEL FASILITAS - COMPATIBLE
-- =====================================================
CREATE TABLE IF NOT EXISTS "Fasilitas" (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(500) NOT NULL, -- Increased size
    deskripsi TEXT,
    foto TEXT[], -- Keep as TEXT[] for compatibility
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. TABEL PRESTASI - COMPATIBLE (Keep existing fields)
-- =====================================================
CREATE TABLE IF NOT EXISTS "Prestasi" (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255), -- Keep existing field
    judul VARCHAR(255), -- Keep existing field
    peraih VARCHAR(255), -- Keep existing field
    siswa VARCHAR(255), -- Keep existing field
    tahun INTEGER,
    foto TEXT[], -- Keep as TEXT[] for compatibility
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. TABEL GALERI - COMPATIBLE
-- =====================================================
CREATE TABLE IF NOT EXISTS "Galeri" (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(500) NOT NULL, -- Increased size
    deskripsi TEXT,
    foto TEXT[] NOT NULL, -- Keep as TEXT[] for compatibility
    kategori VARCHAR(100),
    tanggal TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. TABEL EKSTRAKURIKULER - COMPATIBLE
-- =====================================================
CREATE TABLE IF NOT EXISTS "Ekstrakurikuler" (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(500) NOT NULL, -- Increased size
    deskripsi TEXT,
    foto TEXT[], -- Keep as TEXT[] for compatibility
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. TABEL KATEGORI GURU - COMPATIBLE
-- =====================================================
CREATE TABLE IF NOT EXISTS "KategoriGuru" (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- OPTIMIZED INDEXES FOR MAXIMUM PERFORMANCE
-- =====================================================

-- Setting table indexes
CREATE INDEX IF NOT EXISTS idx_setting_key ON "Setting"(key);
CREATE INDEX IF NOT EXISTS idx_setting_value_gin ON "Setting" USING GIN(to_tsvector('indonesian', value));

-- User table indexes
CREATE INDEX IF NOT EXISTS idx_user_username ON "User"(username);
CREATE INDEX IF NOT EXISTS idx_user_active ON "User"(is_active);
CREATE INDEX IF NOT EXISTS idx_user_role ON "User"(role);

-- ProfilSekolah table indexes
CREATE INDEX IF NOT EXISTS idx_profil_sekolah_section ON "ProfilSekolah"(section);

-- Berita table indexes
CREATE INDEX IF NOT EXISTS idx_berita_tanggal ON "Berita"(tanggal DESC);
CREATE INDEX IF NOT EXISTS idx_berita_judul_gin ON "Berita" USING GIN(to_tsvector('indonesian', judul));
CREATE INDEX IF NOT EXISTS idx_berita_deskripsi_gin ON "Berita" USING GIN(to_tsvector('indonesian', deskripsi));

-- Fasilitas table indexes
CREATE INDEX IF NOT EXISTS idx_fasilitas_nama ON "Fasilitas"(nama);
CREATE INDEX IF NOT EXISTS idx_fasilitas_nama_gin ON "Fasilitas" USING GIN(to_tsvector('indonesian', nama));

-- Prestasi table indexes
CREATE INDEX IF NOT EXISTS idx_prestasi_tahun ON "Prestasi"(tahun DESC);
CREATE INDEX IF NOT EXISTS idx_prestasi_nama ON "Prestasi"(nama);
CREATE INDEX IF NOT EXISTS idx_prestasi_judul ON "Prestasi"(judul);
CREATE INDEX IF NOT EXISTS idx_prestasi_peraih ON "Prestasi"(peraih);
CREATE INDEX IF NOT EXISTS idx_prestasi_siswa ON "Prestasi"(siswa);
CREATE INDEX IF NOT EXISTS idx_prestasi_nama_gin ON "Prestasi" USING GIN(to_tsvector('indonesian', COALESCE(nama, judul)));
CREATE INDEX IF NOT EXISTS idx_prestasi_peraih_gin ON "Prestasi" USING GIN(to_tsvector('indonesian', COALESCE(peraih, siswa)));

-- Galeri table indexes
CREATE INDEX IF NOT EXISTS idx_galeri_kategori ON "Galeri"(kategori);
CREATE INDEX IF NOT EXISTS idx_galeri_tanggal ON "Galeri"(tanggal DESC);
CREATE INDEX IF NOT EXISTS idx_galeri_judul_gin ON "Galeri" USING GIN(to_tsvector('indonesian', judul));

-- Ekstrakurikuler table indexes
CREATE INDEX IF NOT EXISTS idx_ekstrakurikuler_nama ON "Ekstrakurikuler"(nama);
CREATE INDEX IF NOT EXISTS idx_ekstrakurikuler_nama_gin ON "Ekstrakurikuler" USING GIN(to_tsvector('indonesian', nama));

-- KategoriGuru table indexes
CREATE INDEX IF NOT EXISTS idx_kategori_guru_key ON "KategoriGuru"(key);

-- =====================================================
-- FUNCTIONS FOR PERFORMANCE
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- TRIGGERS FOR AUTOMATION
-- =====================================================

-- Apply triggers to all tables
CREATE TRIGGER update_setting_updated_at BEFORE UPDATE ON "Setting" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profil_sekolah_updated_at BEFORE UPDATE ON "ProfilSekolah" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_berita_updated_at BEFORE UPDATE ON "Berita" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fasilitas_updated_at BEFORE UPDATE ON "Fasilitas" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prestasi_updated_at BEFORE UPDATE ON "Prestasi" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_galeri_updated_at BEFORE UPDATE ON "Galeri" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ekstrakurikuler_updated_at BEFORE UPDATE ON "Ekstrakurikuler" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kategori_guru_updated_at BEFORE UPDATE ON "KategoriGuru" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES - COMPATIBLE
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE "Setting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProfilSekolah" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Berita" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Fasilitas" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Prestasi" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Galeri" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Ekstrakurikuler" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "KategoriGuru" ENABLE ROW LEVEL SECURITY;

-- Public read access for most tables (for frontend)
CREATE POLICY "Public read access" ON "Setting" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "ProfilSekolah" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "Berita" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "Fasilitas" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "Prestasi" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "Galeri" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "Ekstrakurikuler" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "KategoriGuru" FOR SELECT USING (true);

-- Admin only access for User table
CREATE POLICY "Admin only access" ON "User" FOR ALL USING (false);

-- Admin write access for content tables
CREATE POLICY "Admin write access" ON "Setting" FOR INSERT WITH CHECK (false);
CREATE POLICY "Admin write access" ON "Setting" FOR UPDATE WITH CHECK (false);
CREATE POLICY "Admin write access" ON "Setting" FOR DELETE USING (false);

CREATE POLICY "Admin write access" ON "ProfilSekolah" FOR INSERT WITH CHECK (false);
CREATE POLICY "Admin write access" ON "ProfilSekolah" FOR UPDATE WITH CHECK (false);
CREATE POLICY "Admin write access" ON "ProfilSekolah" FOR DELETE USING (false);

CREATE POLICY "Admin write access" ON "Berita" FOR INSERT WITH CHECK (false);
CREATE POLICY "Admin write access" ON "Berita" FOR UPDATE WITH CHECK (false);
CREATE POLICY "Admin write access" ON "Berita" FOR DELETE USING (false);

CREATE POLICY "Admin write access" ON "Fasilitas" FOR INSERT WITH CHECK (false);
CREATE POLICY "Admin write access" ON "Fasilitas" FOR UPDATE WITH CHECK (false);
CREATE POLICY "Admin write access" ON "Fasilitas" FOR DELETE USING (false);

CREATE POLICY "Admin write access" ON "Prestasi" FOR INSERT WITH CHECK (false);
CREATE POLICY "Admin write access" ON "Prestasi" FOR UPDATE WITH CHECK (false);
CREATE POLICY "Admin write access" ON "Prestasi" FOR DELETE USING (false);

CREATE POLICY "Admin write access" ON "Galeri" FOR INSERT WITH CHECK (false);
CREATE POLICY "Admin write access" ON "Galeri" FOR UPDATE WITH CHECK (false);
CREATE POLICY "Admin write access" ON "Galeri" FOR DELETE USING (false);

CREATE POLICY "Admin write access" ON "Ekstrakurikuler" FOR INSERT WITH CHECK (false);
CREATE POLICY "Admin write access" ON "Ekstrakurikuler" FOR UPDATE WITH CHECK (false);
CREATE POLICY "Admin write access" ON "Ekstrakurikuler" FOR DELETE USING (false);

CREATE POLICY "Admin write access" ON "KategoriGuru" FOR INSERT WITH CHECK (false);
CREATE POLICY "Admin write access" ON "KategoriGuru" FOR UPDATE WITH CHECK (false);
CREATE POLICY "Admin write access" ON "KategoriGuru" FOR DELETE USING (false);

-- =====================================================
-- CREATE STORAGE BUCKETS
-- =====================================================

-- Create storage bucket for galeri images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('galeri', 'galeri', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for berita images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('berita', 'berita', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for fasilitas images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('fasilitas', 'fasilitas', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for prestasi images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('prestasi', 'prestasi', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for ekstrakurikuler images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('ekstrakurikuler', 'ekstrakurikuler', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for guru photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('guru', 'guru', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Public read access for all storage buckets
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (true);

-- Admin write access for all storage buckets
CREATE POLICY "Admin write access" ON storage.objects FOR INSERT WITH CHECK (false);
CREATE POLICY "Admin write access" ON storage.objects FOR UPDATE WITH CHECK (false);
CREATE POLICY "Admin write access" ON storage.objects FOR DELETE USING (false);

-- =====================================================
-- INSERT COMPATIBLE DEFAULT DATA
-- =====================================================

-- Insert default admin user (password: admin123)
INSERT INTO "User" (username, password, role, is_active) 
VALUES ('admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8K5K5K.', 'admin', true)
ON CONFLICT (username) DO NOTHING;

-- Insert default settings
INSERT INTO "Setting" (key, value) VALUES 
    ('site_name', 'Sekolah Modern'),
    ('deskripsi', 'Deskripsi singkat tentang sekolah, visi, misi, dan keunggulan utama.'),
    ('jumlah_siswa', '320'),
    ('jumlah_guru', '18'),
    ('jumlah_staff', '6'),
    ('alamat', 'Jl. Pendidikan No. 123, Jakarta'),
    ('email_kontak', 'info@sekolahmodern.com'),
    ('telepon', '021-12345678'),
    ('lat_sekolah', '-6.2'),
    ('lng_sekolah', '106.816666'),
    ('facebook', 'https://facebook.com/sekolahmodern'),
    ('instagram', 'https://instagram.com/sekolahmodern'),
    ('youtube', 'https://youtube.com/sekolahmodern')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Insert default profil sekolah sections
INSERT INTO "ProfilSekolah" (section, judul, deskripsi, konten) VALUES 
    ('profil', 'Profil Sekolah', 'Deskripsi profil sekolah', '{"deskripsi": "Sekolah Modern adalah institusi pendidikan yang berkomitmen untuk memberikan pendidikan berkualitas tinggi dengan fasilitas modern dan tenaga pengajar profesional."}'),
    ('program', 'Program Unggulan', 'Program-program unggulan sekolah', '[]'),
    ('tentang', 'Tentang Kami', 'Informasi tentang sekolah', '{"sejarah": "Sekolah Modern didirikan pada tahun 1990 dengan visi menjadi sekolah terdepan dalam pendidikan modern.", "visi": "Menjadi sekolah unggulan yang menghasilkan generasi berkarakter, berprestasi, dan berdaya saing global.", "misi": ["Menyelenggarakan pendidikan berkualitas tinggi", "Mengembangkan karakter dan moral siswa", "Menyediakan fasilitas pembelajaran modern", "Membangun kemitraan dengan orang tua dan masyarakat"], "nilai": ["Integritas", "Excellence", "Innovation", "Respect"]}'),
    ('guru', 'Guru & Staff', 'Data guru dan staff', '{}')
ON CONFLICT (section) DO UPDATE SET 
    judul = EXCLUDED.judul,
    deskripsi = EXCLUDED.deskripsi,
    konten = EXCLUDED.konten;

-- Insert default kategori guru
INSERT INTO "KategoriGuru" (key, label) VALUES 
    ('guru', 'Guru'),
    ('staff', 'Staff'),
    ('kepala_sekolah', 'Kepala Sekolah'),
    ('wakil_kepala', 'Wakil Kepala Sekolah')
ON CONFLICT (key) DO UPDATE SET label = EXCLUDED.label;

-- Insert sample data untuk testing
INSERT INTO "Berita" (judul, deskripsi, konten, gambar) VALUES 
    ('Selamat Datang di Tahun Ajaran Baru', 'Pembukaan tahun ajaran baru 2024/2025', 'Konten lengkap berita...', 'https://example.com/gambar1.jpg'),
    ('Prestasi Siswa di Olimpiade Sains', 'Siswa berhasil meraih medali emas', 'Konten lengkap berita...', 'https://example.com/gambar2.jpg')
ON CONFLICT DO NOTHING;

INSERT INTO "Fasilitas" (nama, deskripsi, foto) VALUES 
    ('Laboratorium Komputer', 'Laboratorium komputer dengan 30 unit PC terbaru', ARRAY['https://example.com/lab1.jpg', 'https://example.com/lab2.jpg']),
    ('Perpustakaan Digital', 'Perpustakaan modern dengan sistem digital', ARRAY['https://example.com/perpus1.jpg']),
    ('Lapangan Olahraga', 'Lapangan olahraga berstandar internasional', ARRAY['https://example.com/lapangan1.jpg', 'https://example.com/lapangan2.jpg'])
ON CONFLICT DO NOTHING;

INSERT INTO "Prestasi" (nama, peraih, tahun, foto) VALUES 
    ('Olimpiade Sains Nasional', 'Ahmad Rizki', 2024, ARRAY['https://example.com/prestasi1.jpg']),
    ('Lomba Debat Bahasa Inggris', 'Siti Nurhaliza', 2024, ARRAY['https://example.com/prestasi2.jpg']),
    ('Kejuaraan Basket Tingkat Kota', 'Tim Basket Putra', 2023, ARRAY['https://example.com/prestasi3.jpg'])
ON CONFLICT DO NOTHING;

INSERT INTO "Galeri" (judul, deskripsi, foto, kategori) VALUES 
    ('Kegiatan Belajar Mengajar', 'Foto-foto kegiatan pembelajaran di kelas', ARRAY['https://example.com/galeri1.jpg', 'https://example.com/galeri2.jpg'], 'Pembelajaran'),
    ('Ekstrakurikuler', 'Kegiatan ekstrakurikuler siswa', ARRAY['https://example.com/galeri3.jpg'], 'Ekstrakurikuler'),
    ('Acara Sekolah', 'Berbagai acara dan event sekolah', ARRAY['https://example.com/galeri4.jpg', 'https://example.com/galeri5.jpg'], 'Event')
ON CONFLICT DO NOTHING;

INSERT INTO "Ekstrakurikuler" (nama, deskripsi, foto) VALUES 
    ('Basket', 'Ekstrakurikuler basket untuk mengembangkan kemampuan olahraga siswa', ARRAY['https://example.com/basket1.jpg']),
    ('Pramuka', 'Kegiatan pramuka untuk membentuk karakter dan kepemimpinan', ARRAY['https://example.com/pramuka1.jpg']),
    ('Seni Tari', 'Ekstrakurikuler seni tari tradisional dan modern', ARRAY['https://example.com/tari1.jpg'])
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'COMPATIBLE DATABASE SETUP COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Compatibility Features:';
    RAISE NOTICE '- All existing field names preserved';
    RAISE NOTICE '- TEXT[] arrays maintained for compatibility';
    RAISE NOTICE '- All existing API endpoints will work';
    RAISE NOTICE '- No breaking changes to frontend code';
    RAISE NOTICE '';
    RAISE NOTICE 'Performance Optimizations:';
    RAISE NOTICE '- 15+ optimized indexes including GIN indexes';
    RAISE NOTICE '- Full-text search capabilities';
    RAISE NOTICE '- Optimized RLS policies';
    RAISE NOTICE '- Auto-updating timestamps';
    RAISE NOTICE '=====================================================';
END $$;
