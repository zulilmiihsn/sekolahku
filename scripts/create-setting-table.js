const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY harus diatur di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createSettingTable() {
  console.log('🚀 Membuat tabel Setting...');
  
  try {
    // Coba insert data untuk membuat tabel jika belum ada
    const { data, error } = await supabase
      .from('Setting')
      .insert([
        { key: 'site_name', value: 'Sekolah Modern' },
        { key: 'deskripsi', value: 'Deskripsi singkat tentang sekolah, visi, misi, dan keunggulan utama.' },
        { key: 'jumlah_siswa', value: '320' },
        { key: 'jumlah_guru', value: '18' },
        { key: 'jumlah_staff', value: '6' },
        { key: 'alamat', value: 'Jl. Pendidikan No. 123, Jakarta' },
        { key: 'email_kontak', value: 'info@sekolahmodern.com' },
        { key: 'telepon', value: '021-12345678' },
        { key: 'lat_sekolah', value: '-6.2' },
        { key: 'lng_sekolah', value: '106.816666' }
      ])
      .select();

    if (error) {
      if (error.message.includes('Could not find the table')) {
        console.log('❌ Tabel Setting belum ada. Silakan buat tabel Setting di Supabase Dashboard dengan struktur:');
        console.log(`
CREATE TABLE Setting (
  key TEXT PRIMARY KEY,
  value TEXT
);

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
      } else {
        console.error('❌ Error:', error.message);
      }
    } else {
      console.log('✅ Tabel Setting berhasil dibuat dan data awal dimasukkan!');
      console.log('📊 Data yang dimasukkan:', data.length, 'records');
    }
  } catch (err) {
    console.error('❌ Exception:', err.message);
  }
}

createSettingTable();
