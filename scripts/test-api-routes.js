const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testApiRoute(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();

    if (response.ok) {
      console.log(`✅ ${method} ${endpoint} - OK`);
      return result;
    } else {
      console.log(`❌ ${method} ${endpoint} - ${response.status}: ${result.error || 'Unknown error'}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ ${method} ${endpoint} - Error: ${error.message}`);
    return null;
  }
}

async function testAllApiRoutes() {
  console.log('🧪 Menguji semua API routes...\n');

  // Test GET routes
  console.log('📖 Testing GET routes:');
  await testApiRoute('/api/pengaturan/nama-situs');
  await testApiRoute('/api/pengaturan/deskripsi');
  await testApiRoute('/api/pengaturan/jumlah-siswa');
  await testApiRoute('/api/pengaturan/jumlah-guru');
  await testApiRoute('/api/pengaturan/jumlah-staff');
  await testApiRoute('/api/pengaturan/kontak');
  await testApiRoute('/api/program');
  await testApiRoute('/api/guru');
  await testApiRoute('/api/fasilitas');
  await testApiRoute('/api/prestasi');
  await testApiRoute('/api/galeri');
  await testApiRoute('/api/berita');

  console.log('\n📝 Testing PUT routes:');
  await testApiRoute('/api/pengaturan/nama-situs', 'PUT', { site_name: 'Sekolah Modern Test' });
  await testApiRoute('/api/pengaturan/deskripsi', 'PUT', { deskripsi: 'Deskripsi test' });
  await testApiRoute('/api/pengaturan/jumlah-siswa', 'PUT', { jumlah_siswa: 350 });
  await testApiRoute('/api/pengaturan/jumlah-guru', 'PUT', { jumlah_guru: 20 });
  await testApiRoute('/api/pengaturan/jumlah-staff', 'PUT', { jumlah_staff: 8 });

  console.log('\n📝 Testing POST routes:');
  await testApiRoute('/api/pengaturan/kontak', 'POST', {
    alamat: 'Jl. Test No. 123',
    email: 'test@sekolahmodern.com',
    telepon: '021-87654321',
    lat: '-6.3',
    lng: '106.9'
  });

  console.log('\n🎉 Testing selesai!');
}

// Jalankan test jika script dipanggil langsung
if (require.main === module) {
  testAllApiRoutes();
}

module.exports = { testApiRoute, testAllApiRoutes };
