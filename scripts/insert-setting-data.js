const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertSettingData() {
  console.log('🚀 Mengisi data awal ke tabel Setting...');
  
  const settingData = [
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
  ];

  try {
    const { data, error } = await supabase
      .from('Setting')
      .upsert(settingData)
      .select();

    if (error) {
      console.log('❌ Error:', error.message);
      if (error.message.includes('row-level security policy')) {
        console.log('\n🔓 Matikan Row Level Security (RLS) untuk tabel Setting di Supabase Dashboard');
      }
    } else {
      console.log('✅ Data berhasil dimasukkan!');
      console.log('📊 Data yang dimasukkan:', data.length, 'records');
    }
  } catch (err) {
    console.log('❌ Exception:', err.message);
  }
}

insertSettingData();
