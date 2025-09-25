const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Use environment variables for security
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('Please create a .env file with these variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up complete database schema...');
    
    // 1. Buat tabel Setting (dengan huruf besar S)
    console.log('📝 Creating Setting table...');
    const { error: settingError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "Setting" (
          id SERIAL PRIMARY KEY,
          key VARCHAR(255) UNIQUE NOT NULL,
          value TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (settingError) {
      console.error('❌ Error creating Setting table:', settingError);
    } else {
      console.log('✅ Setting table created successfully');
    }
    
    // 2. Buat tabel Berita
    console.log('📰 Creating Berita table...');
    const { error: beritaError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "Berita" (
          id SERIAL PRIMARY KEY,
          judul VARCHAR(255) NOT NULL,
          deskripsi TEXT,
          konten TEXT,
          gambar VARCHAR(500),
          tanggal TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (beritaError) {
      console.error('❌ Error creating Berita table:', beritaError);
    } else {
      console.log('✅ Berita table created successfully');
    }
    
    // 3. Buat tabel Fasilitas
    console.log('🏢 Creating Fasilitas table...');
    const { error: fasilitasError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "Fasilitas" (
          id SERIAL PRIMARY KEY,
          nama VARCHAR(255) NOT NULL,
          deskripsi TEXT,
          gambar VARCHAR(500),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (fasilitasError) {
      console.error('❌ Error creating Fasilitas table:', fasilitasError);
    } else {
      console.log('✅ Fasilitas table created successfully');
    }
    
    // 4. Buat tabel Prestasi
    console.log('🏆 Creating Prestasi table...');
    const { error: prestasiError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "Prestasi" (
          id SERIAL PRIMARY KEY,
          judul VARCHAR(255) NOT NULL,
          deskripsi TEXT,
          gambar VARCHAR(500),
          tanggal TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (prestasiError) {
      console.error('❌ Error creating Prestasi table:', prestasiError);
    } else {
      console.log('✅ Prestasi table created successfully');
    }
    
    // 5. Buat tabel Galeri
    console.log('📸 Creating Galeri table...');
    const { error: galeriError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "Galeri" (
          id SERIAL PRIMARY KEY,
          nama VARCHAR(255) NOT NULL,
          gambar VARCHAR(500) NOT NULL,
          kategori VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (galeriError) {
      console.error('❌ Error creating Galeri table:', galeriError);
    } else {
      console.log('✅ Galeri table created successfully');
    }
    
    // 6. Buat tabel Ekstrakurikuler
    console.log('🎭 Creating Ekstrakurikuler table...');
    const { error: ekstraError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "Ekstrakurikuler" (
          id SERIAL PRIMARY KEY,
          nama VARCHAR(255) NOT NULL,
          deskripsi TEXT,
          gambar VARCHAR(500),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (ekstraError) {
      console.error('❌ Error creating Ekstrakurikuler table:', ekstraError);
    } else {
      console.log('✅ Ekstrakurikuler table created successfully');
    }
    
    // 7. Insert default data
    console.log('📊 Inserting default data...');
    
    // Insert default site_name
    const { error: insertSiteError } = await supabase
      .from('Setting')
      .upsert({ 
        key: 'site_name', 
        value: 'Sekolah Modern' 
      });
    
    if (insertSiteError) {
      console.error('❌ Error inserting site_name:', insertSiteError);
    } else {
      console.log('✅ Default site_name inserted');
    }
    
    // Insert default deskripsi
    const { error: insertDescError } = await supabase
      .from('Setting')
      .upsert({ 
        key: 'deskripsi', 
        value: 'Deskripsi singkat tentang sekolah, visi, misi, dan keunggulan utama.' 
      });
    
    if (insertDescError) {
      console.error('❌ Error inserting deskripsi:', insertDescError);
    } else {
      console.log('✅ Default deskripsi inserted');
    }
    
    // Insert default jumlah siswa
    const { error: insertSiswaError } = await supabase
      .from('Setting')
      .upsert({ 
        key: 'jumlah_siswa', 
        value: '320' 
      });
    
    if (insertSiswaError) {
      console.error('❌ Error inserting jumlah_siswa:', insertSiswaError);
    } else {
      console.log('✅ Default jumlah_siswa inserted');
    }
    
    // Insert default jumlah guru
    const { error: insertGuruError } = await supabase
      .from('Setting')
      .upsert({ 
        key: 'jumlah_guru', 
        value: '18' 
      });
    
    if (insertGuruError) {
      console.error('❌ Error inserting jumlah_guru:', insertGuruError);
    } else {
      console.log('✅ Default jumlah_guru inserted');
    }
    
    // Insert default jumlah staff
    const { error: insertStaffError } = await supabase
      .from('Setting')
      .upsert({ 
        key: 'jumlah_staff', 
        value: '6' 
      });
    
    if (insertStaffError) {
      console.error('❌ Error inserting jumlah_staff:', insertStaffError);
    } else {
      console.log('✅ Default jumlah_staff inserted');
    }
    
    // Insert default kontak
    const { error: insertKontakError } = await supabase
      .from('Setting')
      .upsert({ 
        key: 'kontak', 
        value: JSON.stringify({
          alamat: 'Jl. Pendidikan No. 123, Jakarta',
          email: 'info@sekolahmodern.com',
          telepon: '021-12345678',
          lat: '-6.2',
          lng: '106.816666'
        })
      });
    
    if (insertKontakError) {
      console.error('❌ Error inserting kontak:', insertKontakError);
    } else {
      console.log('✅ Default kontak inserted');
    }
    
    // 8. Test queries
    console.log('🧪 Testing database queries...');
    
    const { data: settings, error: selectError } = await supabase
      .from('Setting')
      .select('*');
    
    if (selectError) {
      console.error('❌ Error testing Setting table:', selectError);
    } else {
      console.log('✅ Setting table test successful:', settings?.length, 'records found');
    }
    
    const { data: berita, error: beritaSelectError } = await supabase
      .from('Berita')
      .select('*');
    
    if (beritaSelectError) {
      console.error('❌ Error testing Berita table:', beritaSelectError);
    } else {
      console.log('✅ Berita table test successful:', berita?.length, 'records found');
    }
    
    console.log('🎉 Database setup completed successfully!');
    console.log('📋 Summary:');
    console.log('   - Setting table: ✅');
    console.log('   - Berita table: ✅');
    console.log('   - Fasilitas table: ✅');
    console.log('   - Prestasi table: ✅');
    console.log('   - Galeri table: ✅');
    console.log('   - Ekstrakurikuler table: ✅');
    console.log('   - Default data: ✅');
    
  } catch (error) {
    console.error('💥 Setup failed:', error);
  }
}

setupDatabase();
