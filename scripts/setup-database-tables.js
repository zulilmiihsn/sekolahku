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

async function setupDatabaseTables() {
  try {
    console.log('🚀 Setting up database tables...');
    
    // 1. Tabel Program
    console.log('📚 Creating Program table...');
    const { error: programTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "Program" (
          id SERIAL PRIMARY KEY,
          nama VARCHAR(255) NOT NULL,
          deskripsi TEXT NOT NULL,
          kategori VARCHAR(100) NOT NULL,
          durasi VARCHAR(100),
          target VARCHAR(255),
          manfaat TEXT[],
          persyaratan TEXT[],
          biaya INTEGER DEFAULT 0,
          aktif BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (programTableError) {
      console.error('❌ Error creating Program table:', programTableError);
    } else {
      console.log('✅ Program table created successfully');
    }
    
    // 2. Tabel Guru
    console.log('👨‍🏫 Creating Guru table...');
    const { error: guruTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "Guru" (
          id SERIAL PRIMARY KEY,
          nama VARCHAR(255) NOT NULL,
          jabatan VARCHAR(255) NOT NULL,
          foto TEXT,
          kategori VARCHAR(50) DEFAULT 'guru',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (guruTableError) {
      console.error('❌ Error creating Guru table:', guruTableError);
    } else {
      console.log('✅ Guru table created successfully');
    }
    
    // 3. Tabel Fasilitas
    console.log('🏢 Creating Fasilitas table...');
    const { error: fasilitasTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "Fasilitas" (
          id SERIAL PRIMARY KEY,
          nama VARCHAR(255) NOT NULL,
          deskripsi TEXT NOT NULL,
          kategori VARCHAR(100) NOT NULL,
          kapasitas INTEGER DEFAULT 0,
          status VARCHAR(50) DEFAULT 'tersedia',
          foto TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (fasilitasTableError) {
      console.error('❌ Error creating Fasilitas table:', fasilitasTableError);
    } else {
      console.log('✅ Fasilitas table created successfully');
    }
    
    // 4. Tabel Prestasi
    console.log('🏆 Creating Prestasi table...');
    const { error: prestasiTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "Prestasi" (
          id SERIAL PRIMARY KEY,
          judul VARCHAR(255) NOT NULL,
          deskripsi TEXT NOT NULL,
          kategori VARCHAR(100) NOT NULL,
          tingkat VARCHAR(100) NOT NULL,
          tahun INTEGER NOT NULL,
          pencapaian VARCHAR(100) NOT NULL,
          foto TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (prestasiTableError) {
      console.error('❌ Error creating Prestasi table:', prestasiTableError);
    } else {
      console.log('✅ Prestasi table created successfully');
    }
    
    // 5. Tabel Galeri
    console.log('📸 Creating Galeri table...');
    const { error: galeriTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "Galeri" (
          id SERIAL PRIMARY KEY,
          judul VARCHAR(255) NOT NULL,
          deskripsi TEXT,
          foto TEXT[],
          kategori VARCHAR(100) NOT NULL,
          tanggal TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          status VARCHAR(50) DEFAULT 'published',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (galeriTableError) {
      console.error('❌ Error creating Galeri table:', galeriTableError);
    } else {
      console.log('✅ Galeri table created successfully');
    }
    
    // 6. Tabel Berita
    console.log('📰 Creating Berita table...');
    const { error: beritaTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "Berita" (
          id SERIAL PRIMARY KEY,
          judul VARCHAR(255) NOT NULL,
          deskripsi TEXT NOT NULL,
          konten TEXT NOT NULL,
          gambar TEXT,
          tanggal TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          slug VARCHAR(255) UNIQUE,
          status VARCHAR(50) DEFAULT 'published',
          featured BOOLEAN DEFAULT false,
          views INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (beritaTableError) {
      console.error('❌ Error creating Berita table:', beritaTableError);
    } else {
      console.log('✅ Berita table created successfully');
    }
    
    // 7. Tabel Setting
    console.log('⚙️ Creating Setting table...');
    const { error: settingTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "Setting" (
          id SERIAL PRIMARY KEY,
          key VARCHAR(255) UNIQUE NOT NULL,
          value TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (settingTableError) {
      console.error('❌ Error creating Setting table:', settingTableError);
    } else {
      console.log('✅ Setting table created successfully');
    }
    
    console.log('🎉 Database tables setup completed successfully!');
    console.log('');
    console.log('📋 Tables created:');
    console.log('   - Program (untuk program sekolah)');
    console.log('   - Guru (untuk data guru dan staff)');
    console.log('   - Fasilitas (untuk fasilitas sekolah)');
    console.log('   - Prestasi (untuk prestasi sekolah)');
    console.log('   - Galeri (untuk galeri foto)');
    console.log('   - Berita (untuk berita sekolah)');
    console.log('   - Setting (untuk pengaturan umum)');
    console.log('');
    console.log('🔗 You can now use the admin dashboard to manage content!');
    
  } catch (error) {
    console.error('💥 Setup failed:', error);
  }
}

setupDatabaseTables();
