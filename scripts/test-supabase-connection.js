const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Memeriksa konfigurasi Supabase...');
console.log('URL:', supabaseUrl ? '✅ Ada' : '❌ Tidak ada');
console.log('Anon Key:', supabaseAnonKey ? '✅ Ada' : '❌ Tidak ada');

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('\n❌ Konfigurasi Supabase tidak lengkap!');
  console.log('📝 Buat file .env dengan konfigurasi berikut:');
  console.log(`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
  `);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('\n🧪 Menguji koneksi ke Supabase...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('Setting')
      .select('*')
      .limit(1);

    if (error) {
      if (error.message.includes('Could not find the table')) {
        console.log('❌ Tabel Setting belum ada.');
        console.log('\n📋 Buat tabel Setting di Supabase Dashboard:');
        console.log(`
1. Buka Supabase Dashboard
2. Pilih project Anda
3. Pergi ke SQL Editor
4. Jalankan query berikut:

CREATE TABLE Setting (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Matikan RLS untuk tabel Setting (opsional)
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
        `);
      } else if (error.message.includes('row-level security policy')) {
        console.log('❌ Row Level Security (RLS) aktif di tabel Setting.');
        console.log('\n🔓 Matikan RLS untuk tabel Setting:');
        console.log(`
1. Buka Supabase Dashboard
2. Pilih project Anda
3. Pergi ke Table Editor
4. Pilih tabel Setting
5. Pergi ke Settings > Row Level Security
6. Matikan RLS untuk tabel Setting
        `);
      } else {
        console.log('❌ Error:', error.message);
      }
    } else {
      console.log('✅ Koneksi berhasil! Tabel Setting sudah ada.');
      console.log('📊 Data yang ditemukan:', data.length, 'records');
    }
  } catch (err) {
    console.log('❌ Exception:', err.message);
  }
}

testConnection();
