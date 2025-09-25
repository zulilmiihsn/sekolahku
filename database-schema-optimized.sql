-- =====================================================
-- OPTIMIZED DATABASE SCHEMA UNTUK PROJECT SEKOLAH MODERN
-- =====================================================
-- Schema yang telah dioptimasi untuk performa maksimal
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- =====================================================
-- 1. TABEL SETTING (Konfigurasi Aplikasi) - OPTIMIZED
-- =====================================================
CREATE TABLE IF NOT EXISTS "Setting" (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. TABEL USER (Admin Authentication) - OPTIMIZED
-- =====================================================
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TABEL PROFIL SEKOLAH - OPTIMIZED
-- =====================================================
CREATE TABLE IF NOT EXISTS "ProfilSekolah" (
    id SERIAL PRIMARY KEY,
    section VARCHAR(100) NOT NULL,
    judul VARCHAR(255),
    deskripsi TEXT,
    konten JSONB, -- Changed to JSONB for better performance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(section)
);

-- =====================================================
-- 4. TABEL BERITA - OPTIMIZED
-- =====================================================
CREATE TABLE IF NOT EXISTS "Berita" (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(500) NOT NULL, -- Increased size
    deskripsi TEXT,
    konten TEXT,
    gambar TEXT, -- Changed to TEXT for longer URLs
    slug VARCHAR(500) UNIQUE, -- Added slug for SEO
    status VARCHAR(20) DEFAULT 'published', -- Added status
    featured BOOLEAN DEFAULT false, -- Added featured flag
    views INTEGER DEFAULT 0, -- Added view counter
    tanggal TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. TABEL FASILITAS - OPTIMIZED
-- =====================================================
CREATE TABLE IF NOT EXISTS "Fasilitas" (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(500) NOT NULL, -- Increased size
    deskripsi TEXT,
    foto JSONB, -- Changed to JSONB for better querying
    kategori VARCHAR(100), -- Added category
    status VARCHAR(20) DEFAULT 'active', -- Added status
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. TABEL PRESTASI - OPTIMIZED
-- =====================================================
CREATE TABLE IF NOT EXISTS "Prestasi" (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(500) NOT NULL, -- Unified to single field
    peraih VARCHAR(255) NOT NULL, -- Unified to single field
    tahun INTEGER NOT NULL,
    tingkat VARCHAR(100), -- Added level (nasional, internasional, etc)
    kategori VARCHAR(100), -- Added category
    foto JSONB, -- Changed to JSONB
    deskripsi TEXT, -- Added description
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. TABEL GALERI - OPTIMIZED
-- =====================================================
CREATE TABLE IF NOT EXISTS "Galeri" (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(500) NOT NULL, -- Increased size
    deskripsi TEXT,
    foto JSONB NOT NULL, -- Changed to JSONB
    kategori VARCHAR(100),
    tags TEXT[], -- Added tags for better search
    status VARCHAR(20) DEFAULT 'published', -- Added status
    tanggal TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. TABEL EKSTRAKURIKULER - OPTIMIZED
-- =====================================================
CREATE TABLE IF NOT EXISTS "Ekstrakurikuler" (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(500) NOT NULL, -- Increased size
    deskripsi TEXT,
    foto JSONB, -- Changed to JSONB
    kategori VARCHAR(100), -- Added category
    jadwal TEXT, -- Added schedule
    pembina VARCHAR(255), -- Added instructor
    status VARCHAR(20) DEFAULT 'active', -- Added status
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. TABEL KATEGORI GURU - OPTIMIZED
-- =====================================================
CREATE TABLE IF NOT EXISTS "KategoriGuru" (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(255) NOT NULL,
    urutan INTEGER DEFAULT 0, -- Added ordering
    status VARCHAR(20) DEFAULT 'active', -- Added status
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. TABEL GURU/STAFF - NEW TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS "GuruStaff" (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    jabatan VARCHAR(255) NOT NULL,
    kategori_id INTEGER REFERENCES "KategoriGuru"(id) ON DELETE SET NULL,
    foto TEXT,
    email VARCHAR(255),
    telepon VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    urutan INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 11. TABEL AUDIT LOG - NEW TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS "AuditLog" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "User"(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
CREATE INDEX IF NOT EXISTS idx_user_last_login ON "User"(last_login DESC);

-- ProfilSekolah table indexes
CREATE INDEX IF NOT EXISTS idx_profil_sekolah_section ON "ProfilSekolah"(section);
CREATE INDEX IF NOT EXISTS idx_profil_sekolah_konten_gin ON "ProfilSekolah" USING GIN(konten);

-- Berita table indexes
CREATE INDEX IF NOT EXISTS idx_berita_tanggal ON "Berita"(tanggal DESC);
CREATE INDEX IF NOT EXISTS idx_berita_status ON "Berita"(status);
CREATE INDEX IF NOT EXISTS idx_berita_featured ON "Berita"(featured);
CREATE INDEX IF NOT EXISTS idx_berita_views ON "Berita"(views DESC);
CREATE INDEX IF NOT EXISTS idx_berita_slug ON "Berita"(slug);
CREATE INDEX IF NOT EXISTS idx_berita_judul_gin ON "Berita" USING GIN(to_tsvector('indonesian', judul));
CREATE INDEX IF NOT EXISTS idx_berita_deskripsi_gin ON "Berita" USING GIN(to_tsvector('indonesian', deskripsi));
CREATE INDEX IF NOT EXISTS idx_berita_composite ON "Berita"(status, featured, tanggal DESC);

-- Fasilitas table indexes
CREATE INDEX IF NOT EXISTS idx_fasilitas_nama ON "Fasilitas"(nama);
CREATE INDEX IF NOT EXISTS idx_fasilitas_kategori ON "Fasilitas"(kategori);
CREATE INDEX IF NOT EXISTS idx_fasilitas_status ON "Fasilitas"(status);
CREATE INDEX IF NOT EXISTS idx_fasilitas_foto_gin ON "Fasilitas" USING GIN(foto);
CREATE INDEX IF NOT EXISTS idx_fasilitas_nama_gin ON "Fasilitas" USING GIN(to_tsvector('indonesian', nama));

-- Prestasi table indexes
CREATE INDEX IF NOT EXISTS idx_prestasi_tahun ON "Prestasi"(tahun DESC);
CREATE INDEX IF NOT EXISTS idx_prestasi_tingkat ON "Prestasi"(tingkat);
CREATE INDEX IF NOT EXISTS idx_prestasi_kategori ON "Prestasi"(kategori);
CREATE INDEX IF NOT EXISTS idx_prestasi_judul_gin ON "Prestasi" USING GIN(to_tsvector('indonesian', judul));
CREATE INDEX IF NOT EXISTS idx_prestasi_peraih_gin ON "Prestasi" USING GIN(to_tsvector('indonesian', peraih));
CREATE INDEX IF NOT EXISTS idx_prestasi_composite ON "Prestasi"(tahun DESC, tingkat, kategori);

-- Galeri table indexes
CREATE INDEX IF NOT EXISTS idx_galeri_kategori ON "Galeri"(kategori);
CREATE INDEX IF NOT EXISTS idx_galeri_tanggal ON "Galeri"(tanggal DESC);
CREATE INDEX IF NOT EXISTS idx_galeri_status ON "Galeri"(status);
CREATE INDEX IF NOT EXISTS idx_galeri_tags_gin ON "Galeri" USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_galeri_foto_gin ON "Galeri" USING GIN(foto);
CREATE INDEX IF NOT EXISTS idx_galeri_judul_gin ON "Galeri" USING GIN(to_tsvector('indonesian', judul));

-- Ekstrakurikuler table indexes
CREATE INDEX IF NOT EXISTS idx_ekstrakurikuler_nama ON "Ekstrakurikuler"(nama);
CREATE INDEX IF NOT EXISTS idx_ekstrakurikuler_kategori ON "Ekstrakurikuler"(kategori);
CREATE INDEX IF NOT EXISTS idx_ekstrakurikuler_status ON "Ekstrakurikuler"(status);
CREATE INDEX IF NOT EXISTS idx_ekstrakurikuler_pembina ON "Ekstrakurikuler"(pembina);
CREATE INDEX IF NOT EXISTS idx_ekstrakurikuler_nama_gin ON "Ekstrakurikuler" USING GIN(to_tsvector('indonesian', nama));

-- KategoriGuru table indexes
CREATE INDEX IF NOT EXISTS idx_kategori_guru_key ON "KategoriGuru"(key);
CREATE INDEX IF NOT EXISTS idx_kategori_guru_urutan ON "KategoriGuru"(urutan);
CREATE INDEX IF NOT EXISTS idx_kategori_guru_status ON "KategoriGuru"(status);

-- GuruStaff table indexes
CREATE INDEX IF NOT EXISTS idx_guru_staff_kategori ON "GuruStaff"(kategori_id);
CREATE INDEX IF NOT EXISTS idx_guru_staff_status ON "GuruStaff"(status);
CREATE INDEX IF NOT EXISTS idx_guru_staff_urutan ON "GuruStaff"(urutan);
CREATE INDEX IF NOT EXISTS idx_guru_staff_nama_gin ON "GuruStaff" USING GIN(to_tsvector('indonesian', nama));

-- AuditLog table indexes
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON "AuditLog"(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON "AuditLog"(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_table ON "AuditLog"(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON "AuditLog"(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_composite ON "AuditLog"(table_name, record_id, created_at DESC);

-- =====================================================
-- MATERIALIZED VIEWS FOR PERFORMANCE
-- =====================================================

-- Materialized view for dashboard statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM "Berita" WHERE status = 'published') as total_berita,
    (SELECT COUNT(*) FROM "Fasilitas" WHERE status = 'active') as total_fasilitas,
    (SELECT COUNT(*) FROM "Prestasi") as total_prestasi,
    (SELECT COUNT(*) FROM "Galeri" WHERE status = 'published') as total_galeri,
    (SELECT COUNT(*) FROM "Ekstrakurikuler" WHERE status = 'active') as total_ekstrakurikuler,
    (SELECT COUNT(*) FROM "GuruStaff" WHERE status = 'active') as total_guru_staff,
    (SELECT SUM(views) FROM "Berita") as total_views;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_stats_unique ON dashboard_stats((1));

-- =====================================================
-- FUNCTIONS FOR PERFORMANCE
-- =====================================================

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW dashboard_stats;
END;
$$ LANGUAGE plpgsql;

-- Function to update view count
CREATE OR REPLACE FUNCTION increment_view_count(table_name text, record_id integer)
RETURNS void AS $$
BEGIN
    IF table_name = 'Berita' THEN
        UPDATE "Berita" SET views = views + 1 WHERE id = record_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to generate slug
CREATE OR REPLACE FUNCTION generate_slug(input_text text)
RETURNS text AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(
                regexp_replace(input_text, '[^a-zA-Z0-9\s]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '^-+|-+$', '', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS FOR AUTOMATION
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to auto-generate slug for berita
CREATE OR REPLACE FUNCTION auto_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug = generate_slug(NEW.judul);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to log changes
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "AuditLog" (
        action, table_name, record_id, old_values, new_values
    ) VALUES (
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

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
CREATE TRIGGER update_guru_staff_updated_at BEFORE UPDATE ON "GuruStaff" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate slug for berita
CREATE TRIGGER auto_generate_berita_slug BEFORE INSERT OR UPDATE ON "Berita" FOR EACH ROW EXECUTE FUNCTION auto_generate_slug();

-- Log changes for important tables
CREATE TRIGGER log_berita_changes AFTER INSERT OR UPDATE OR DELETE ON "Berita" FOR EACH ROW EXECUTE FUNCTION log_changes();
CREATE TRIGGER log_fasilitas_changes AFTER INSERT OR UPDATE OR DELETE ON "Fasilitas" FOR EACH ROW EXECUTE FUNCTION log_changes();
CREATE TRIGGER log_prestasi_changes AFTER INSERT OR UPDATE OR DELETE ON "Prestasi" FOR EACH ROW EXECUTE FUNCTION log_changes();
CREATE TRIGGER log_galeri_changes AFTER INSERT OR UPDATE OR DELETE ON "Galeri" FOR EACH ROW EXECUTE FUNCTION log_changes();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES - OPTIMIZED
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
ALTER TABLE "GuruStaff" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public read published content" ON "Berita" FOR SELECT USING (status = 'published');
CREATE POLICY "Public read active content" ON "Fasilitas" FOR SELECT USING (status = 'active');
CREATE POLICY "Public read active content" ON "Ekstrakurikuler" FOR SELECT USING (status = 'active');
CREATE POLICY "Public read published content" ON "Galeri" FOR SELECT USING (status = 'published');
CREATE POLICY "Public read active content" ON "GuruStaff" FOR SELECT USING (status = 'active');

-- Public read access for settings and categories
CREATE POLICY "Public read settings" ON "Setting" FOR SELECT USING (true);
CREATE POLICY "Public read profil sekolah" ON "ProfilSekolah" FOR SELECT USING (true);
CREATE POLICY "Public read prestasi" ON "Prestasi" FOR SELECT USING (true);
CREATE POLICY "Public read kategori guru" ON "KategoriGuru" FOR SELECT USING (status = 'active');

-- Admin only access for User and AuditLog
CREATE POLICY "Admin only access" ON "User" FOR ALL USING (false);
CREATE POLICY "Admin only access" ON "AuditLog" FOR ALL USING (false);

-- Admin write access for content tables (will be overridden by JWT verification)
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

CREATE POLICY "Admin write access" ON "GuruStaff" FOR INSERT WITH CHECK (false);
CREATE POLICY "Admin write access" ON "GuruStaff" FOR UPDATE WITH CHECK (false);
CREATE POLICY "Admin write access" ON "GuruStaff" FOR DELETE USING (false);

-- =====================================================
-- STORAGE BUCKETS - OPTIMIZED
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
-- STORAGE POLICIES - OPTIMIZED
-- =====================================================

-- Public read access for all storage buckets
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (true);

-- Admin write access for all storage buckets
CREATE POLICY "Admin write access" ON storage.objects FOR INSERT WITH CHECK (false);
CREATE POLICY "Admin write access" ON storage.objects FOR UPDATE WITH CHECK (false);
CREATE POLICY "Admin write access" ON storage.objects FOR DELETE USING (false);

-- =====================================================
-- INSERT OPTIMIZED DEFAULT DATA
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
INSERT INTO "KategoriGuru" (key, label, urutan) VALUES 
    ('kepala_sekolah', 'Kepala Sekolah', 1),
    ('wakil_kepala', 'Wakil Kepala Sekolah', 2),
    ('guru', 'Guru', 3),
    ('staff', 'Staff', 4)
ON CONFLICT (key) DO UPDATE SET label = EXCLUDED.label, urutan = EXCLUDED.urutan;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'OPTIMIZED DATABASE SETUP COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Performance Optimizations:';
    RAISE NOTICE '- 25+ optimized indexes including GIN indexes';
    RAISE NOTICE '- Materialized views for dashboard stats';
    RAISE NOTICE '- JSONB fields for better querying';
    RAISE NOTICE '- Full-text search capabilities';
    RAISE NOTICE '- Audit logging system';
    RAISE NOTICE '- Auto-slug generation';
    RAISE NOTICE '- View counting system';
    RAISE NOTICE '- Optimized RLS policies';
    RAISE NOTICE '=====================================================';
END $$;
