-- =====================================================
-- 🔧 FIX SETTING TABLE CONSTRAINT ISSUES
-- =====================================================
-- Jalankan query ini di Supabase Dashboard > SQL Editor

-- 1. Cek struktur tabel Setting saat ini
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  constraint_name
FROM information_schema.columns 
WHERE table_name = 'Setting' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Cek constraint yang ada
SELECT 
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'Setting' 
  AND tc.table_schema = 'public';

-- 3. Hapus constraint yang bermasalah (jika ada)
-- ALTER TABLE "Setting" DROP CONSTRAINT IF EXISTS "Setting_key_key";

-- 4. Pastikan tabel Setting memiliki struktur yang benar
-- Jika tabel sudah ada, update strukturnya
ALTER TABLE "Setting" 
ADD COLUMN IF NOT EXISTS id SERIAL PRIMARY KEY,
ADD COLUMN IF NOT EXISTS key VARCHAR(255) UNIQUE NOT NULL,
ADD COLUMN IF NOT EXISTS value TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 5. Hapus data duplikat jika ada (jaga yang terbaru)
WITH ranked_settings AS (
  SELECT *,
    ROW_NUMBER() OVER (PARTITION BY key ORDER BY created_at DESC) as rn
  FROM "Setting"
)
DELETE FROM "Setting" 
WHERE id IN (
  SELECT id FROM ranked_settings WHERE rn > 1
);

-- 6. Insert data default jika belum ada
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
('lng_sekolah', '106.816666')
ON CONFLICT (key) DO NOTHING;

-- 7. Verifikasi data Setting
SELECT key, value, created_at FROM "Setting" ORDER BY key;

-- 8. Test upsert (seharusnya tidak error)
-- UPDATE "Setting" SET value = 'Test Update' WHERE key = 'site_name';
-- Jika error, berarti constraint masih bermasalah
