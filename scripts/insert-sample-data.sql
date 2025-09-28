-- Query SQL untuk mengisi database dengan data sample
-- Jalankan query ini di Supabase SQL Editor

-- 1. Insert data KategoriGuru
INSERT INTO "KategoriGuru" (key, label, urutan, status) VALUES
('kepala_sekolah', 'Kepala Sekolah', 1, 'active'),
('wakil_kepala', 'Wakil Kepala Sekolah', 2, 'active'),
('guru_mata_pelajaran', 'Guru Mata Pelajaran', 3, 'active'),
('guru_kelas', 'Guru Kelas', 4, 'active'),
('guru_bk', 'Guru Bimbingan Konseling', 5, 'active'),
('staff_tu', 'Staff Tata Usaha', 6, 'active'),
('staff_kebersihan', 'Staff Kebersihan', 7, 'active'),
('satpam', 'Satpam', 8, 'active')
ON CONFLICT (key) DO NOTHING;

-- 2. Insert data GuruStaff
INSERT INTO "GuruStaff" (nama, jabatan, kategori_id, email, telepon, status, urutan) VALUES
('Dr. Ahmad Wijaya, M.Pd', 'Kepala Sekolah', (SELECT id FROM "KategoriGuru" WHERE key = 'kepala_sekolah'), 'kepala@sekolahmodern.com', '081234567890', 'active', 1),
('Siti Nurhaliza, S.Pd', 'Wakil Kepala Sekolah', (SELECT id FROM "KategoriGuru" WHERE key = 'wakil_kepala'), 'wakil@sekolahmodern.com', '081234567891', 'active', 2),
('Budi Santoso, S.Pd', 'Guru Matematika', (SELECT id FROM "KategoriGuru" WHERE key = 'guru_mata_pelajaran'), 'budi@sekolahmodern.com', '081234567892', 'active', 3),
('Dewi Kartika, S.Pd', 'Guru Bahasa Indonesia', (SELECT id FROM "KategoriGuru" WHERE key = 'guru_mata_pelajaran'), 'dewi@sekolahmodern.com', '081234567893', 'active', 4),
('Eko Prasetyo, S.Pd', 'Guru IPA', (SELECT id FROM "KategoriGuru" WHERE key = 'guru_mata_pelajaran'), 'eko@sekolahmodern.com', '081234567894', 'active', 5),
('Fitri Rahayu, S.Pd', 'Guru Bahasa Inggris', (SELECT id FROM "KategoriGuru" WHERE key = 'guru_mata_pelajaran'), 'fitri@sekolahmodern.com', '081234567895', 'active', 6),
('Gunawan, S.Pd', 'Guru IPS', (SELECT id FROM "KategoriGuru" WHERE key = 'guru_mata_pelajaran'), 'gunawan@sekolahmodern.com', '081234567896', 'active', 7),
('Hani Sari, S.Pd', 'Guru Kelas 1A', (SELECT id FROM "KategoriGuru" WHERE key = 'guru_kelas'), 'hani@sekolahmodern.com', '081234567897', 'active', 8),
('Indra Kurniawan, S.Pd', 'Guru Kelas 2A', (SELECT id FROM "KategoriGuru" WHERE key = 'guru_kelas'), 'indra@sekolahmodern.com', '081234567898', 'active', 9),
('Joko Widodo, S.Pd', 'Guru BK', (SELECT id FROM "KategoriGuru" WHERE key = 'guru_bk'), 'joko@sekolahmodern.com', '081234567899', 'active', 10),
('Kartika Sari, S.Pd', 'Staff TU', (SELECT id FROM "KategoriGuru" WHERE key = 'staff_tu'), 'kartika@sekolahmodern.com', '081234567900', 'active', 11),
('Lina Marlina, S.Pd', 'Staff Kebersihan', (SELECT id FROM "KategoriGuru" WHERE key = 'staff_kebersihan'), 'lina@sekolahmodern.com', '081234567901', 'active', 12),
('Maman Suparman', 'Satpam', (SELECT id FROM "KategoriGuru" WHERE key = 'satpam'), 'maman@sekolahmodern.com', '081234567902', 'active', 13);

-- 3. Insert data Setting
INSERT INTO "Setting" (key, value) VALUES
('site_name', 'Sekolah Modern Indonesia'),
('deskripsi', 'Sekolah Modern Indonesia adalah lembaga pendidikan yang berkomitmen untuk memberikan pendidikan berkualitas tinggi dengan pendekatan modern dan inovatif. Kami mengutamakan pengembangan karakter, kreativitas, dan kecerdasan intelektual siswa.'),
('jumlah_siswa', '450'),
('jumlah_guru', '25'),
('jumlah_staff', '15'),
('alamat', 'Jl. Pendidikan No. 123, Jakarta Selatan 12345'),
('email_kontak', 'info@sekolahmodern.com'),
('telepon', '021-12345678'),
('lat_sekolah', '-6.261493'),
('lng_sekolah', '106.810600')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 4. Insert data ProfilSekolah
INSERT INTO "ProfilSekolah" (section, judul, deskripsi, konten) VALUES
('visi', 'Visi Sekolah', 'Menjadi sekolah unggulan yang menghasilkan generasi berkarakter, cerdas, dan berdaya saing global', '{"content": "Menjadi sekolah unggulan yang menghasilkan generasi berkarakter, cerdas, dan berdaya saing global"}'),
('misi', 'Misi Sekolah', 'Menyelenggarakan pendidikan berkualitas dengan pendekatan modern', '{"content": "1. Menyelenggarakan pendidikan berkualitas dengan pendekatan modern dan inovatif\n2. Mengembangkan karakter siswa yang berakhlak mulia dan mandiri\n3. Meningkatkan prestasi akademik dan non-akademik siswa\n4. Menciptakan lingkungan belajar yang kondusif dan menyenangkan\n5. Membangun kerjasama yang harmonis dengan orang tua dan masyarakat"}'),
('sejarah', 'Sejarah Sekolah', 'Sekolah Modern Indonesia didirikan pada tahun 2010', '{"content": "Sekolah Modern Indonesia didirikan pada tahun 2010 dengan visi menjadi lembaga pendidikan unggulan. Sejak berdiri, sekolah ini telah mengalami perkembangan yang pesat dan berhasil mencetak banyak prestasi di berbagai bidang."}'),
('fasilitas', 'Fasilitas Sekolah', 'Sekolah dilengkapi dengan berbagai fasilitas modern', '{"content": "Sekolah dilengkapi dengan berbagai fasilitas modern seperti laboratorium komputer, laboratorium IPA, perpustakaan digital, lapangan olahraga, dan ruang kelas yang nyaman."}')
ON CONFLICT (section) DO UPDATE SET 
  judul = EXCLUDED.judul,
  deskripsi = EXCLUDED.deskripsi,
  konten = EXCLUDED.konten;

-- 5. Insert data Program
INSERT INTO "Program" (nama, deskripsi, kategori, durasi, target, manfaat, persyaratan, biaya, aktif) VALUES
('Program Unggulan', 'Program pembelajaran dengan pendekatan modern dan inovatif', 'Akademik', '1 tahun', 'Siswa kelas 1-6', '{"Meningkatkan prestasi akademik", "Mengembangkan kreativitas", "Membangun karakter"}', '{"Siswa aktif", "Mendapat izin orang tua"}', 5000000, true),
('Program Bahasa Inggris', 'Program intensif bahasa Inggris untuk semua level', 'Bahasa', '6 bulan', 'Siswa dan masyarakat umum', '{"Menguasai bahasa Inggris", "Meningkatkan kepercayaan diri", "Mempersiapkan masa depan"}', '{"Usia minimal 5 tahun", "Mendaftar sesuai jadwal"}', 2000000, true),
('Program Olahraga', 'Program pengembangan bakat olahraga siswa', 'Non-Akademik', '1 semester', 'Siswa yang berminat olahraga', '{"Mengembangkan bakat olahraga", "Meningkatkan kesehatan", "Membangun teamwork"}', '{"Siswa aktif", "Surat keterangan sehat"}', 1500000, true),
('Program Seni dan Budaya', 'Program pengembangan seni dan budaya Indonesia', 'Seni', '1 semester', 'Siswa yang berminat seni', '{"Mengembangkan bakat seni", "Melestarikan budaya", "Meningkatkan kreativitas"}', '{"Siswa aktif", "Mendaftar sesuai jadwal"}', 1000000, true);

-- 6. Insert data Ekstrakurikuler
INSERT INTO "Ekstrakurikuler" (nama, deskripsi, foto, kategori, jadwal, pembina, status) VALUES
('Pramuka', 'Kegiatan kepramukaan untuk membangun karakter dan kepemimpinan', '{"url": "https://via.placeholder.com/800x600/DC2626/FFFFFF?text=Pramuka", "alt": "Kegiatan Pramuka"}', 'Kepramukaan', 'Sabtu 08.00-10.00', 'Budi Santoso, S.Pd', 'active'),
('Futsal', 'Latihan futsal untuk mengembangkan bakat olahraga', '{"url": "https://via.placeholder.com/800x600/16A34A/FFFFFF?text=Futsal", "alt": "Latihan Futsal"}', 'Olahraga', 'Selasa & Kamis 15.00-17.00', 'Eko Prasetyo, S.Pd', 'active'),
('Tari Tradisional', 'Latihan tari tradisional Indonesia', '{"url": "https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Tari+Tradisional", "alt": "Tari Tradisional"}', 'Seni', 'Rabu 15.00-17.00', 'Dewi Kartika, S.Pd', 'active'),
('Paduan Suara', 'Latihan paduan suara untuk mengembangkan bakat musik', '{"url": "https://via.placeholder.com/800x600/0891B2/FFFFFF?text=Paduan+Suara", "alt": "Paduan Suara"}', 'Musik', 'Jumat 15.00-17.00', 'Fitri Rahayu, S.Pd', 'active'),
('Robotik', 'Pembelajaran robotik dan teknologi', '{"url": "https://via.placeholder.com/800x600/EA580C/FFFFFF?text=Robotik", "alt": "Kegiatan Robotik"}', 'Teknologi', 'Senin 15.00-17.00', 'Gunawan, S.Pd', 'active'),
('Basket', 'Latihan basket untuk mengembangkan bakat olahraga', '{"url": "https://via.placeholder.com/800x600/1E40AF/FFFFFF?text=Basket", "alt": "Latihan Basket"}', 'Olahraga', 'Selasa & Kamis 15.00-17.00', 'Hani Sari, S.Pd', 'active');

-- 7. Insert data Fasilitas
INSERT INTO "Fasilitas" (nama, deskripsi, foto, kategori, status) VALUES
('Laboratorium Komputer', 'Laboratorium komputer dengan 30 unit komputer modern', '{"url": "https://via.placeholder.com/800x600/1E40AF/FFFFFF?text=Lab+Komputer", "alt": "Laboratorium Komputer"}', 'Laboratorium', 'active'),
('Laboratorium IPA', 'Laboratorium IPA dilengkapi dengan alat-alat praktikum', '{"url": "https://via.placeholder.com/800x600/059669/FFFFFF?text=Lab+IPA", "alt": "Laboratorium IPA"}', 'Laboratorium', 'active'),
('Perpustakaan Digital', 'Perpustakaan dengan koleksi buku digital dan fisik', '{"url": "https://via.placeholder.com/800x600/7C2D12/FFFFFF?text=Perpustakaan", "alt": "Perpustakaan Digital"}', 'Perpustakaan', 'active'),
('Lapangan Olahraga', 'Lapangan olahraga multifungsi untuk berbagai kegiatan', '{"url": "https://via.placeholder.com/800x600/16A34A/FFFFFF?text=Lapangan+Olahraga", "alt": "Lapangan Olahraga"}', 'Olahraga', 'active'),
('Ruang Kelas', 'Ruang kelas yang nyaman dan dilengkapi AC', '{"url": "https://via.placeholder.com/800x600/9333EA/FFFFFF?text=Ruang+Kelas", "alt": "Ruang Kelas"}', 'Kelas', 'active'),
('Kantin Sekolah', 'Kantin yang menyediakan makanan sehat dan bergizi', '{"url": "https://via.placeholder.com/800x600/EA580C/FFFFFF?text=Kantin+Sekolah", "alt": "Kantin Sekolah"}', 'Fasilitas Umum', 'active'),
('Musholla', 'Tempat ibadah untuk siswa dan guru', '{"url": "https://via.placeholder.com/800x600/0891B2/FFFFFF?text=Musholla", "alt": "Musholla"}', 'Fasilitas Umum', 'active'),
('Ruang BK', 'Ruang bimbingan konseling untuk konsultasi siswa', '{"url": "https://via.placeholder.com/800x600/DC2626/FFFFFF?text=Ruang+BK", "alt": "Ruang BK"}', 'Fasilitas Umum', 'active');

-- 8. Insert data Prestasi
INSERT INTO "Prestasi" (judul, peraih, tahun, tingkat, kategori, foto, deskripsi) VALUES
('Juara 1 Lomba Matematika', 'Ahmad Rizki', 2023, 'Kota', 'Akademik', '{"url": "https://via.placeholder.com/800x600/1E40AF/FFFFFF?text=Juara+Matematika", "alt": "Juara 1 Lomba Matematika"}', 'Meraih juara 1 dalam lomba matematika tingkat kota'),
('Juara 2 Lomba Bahasa Inggris', 'Siti Nurhaliza', 2023, 'Provinsi', 'Bahasa', '{"url": "https://via.placeholder.com/800x600/059669/FFFFFF?text=Juara+Bahasa+Inggris", "alt": "Juara 2 Lomba Bahasa Inggris"}', 'Meraih juara 2 dalam lomba bahasa Inggris tingkat provinsi'),
('Juara 1 Lomba Futsal', 'Tim Futsal Sekolah', 2023, 'Kecamatan', 'Olahraga', '{"url": "https://via.placeholder.com/800x600/16A34A/FFFFFF?text=Juara+Futsal", "alt": "Juara 1 Lomba Futsal"}', 'Meraih juara 1 dalam lomba futsal tingkat kecamatan'),
('Juara 3 Lomba Tari', 'Tim Tari Sekolah', 2023, 'Kota', 'Seni', '{"url": "https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Juara+Tari", "alt": "Juara 3 Lomba Tari"}', 'Meraih juara 3 dalam lomba tari tradisional tingkat kota'),
('Juara 1 Lomba Robotik', 'Tim Robotik Sekolah', 2023, 'Nasional', 'Teknologi', '{"url": "https://via.placeholder.com/800x600/EA580C/FFFFFF?text=Juara+Robotik", "alt": "Juara 1 Lomba Robotik"}', 'Meraih juara 1 dalam lomba robotik tingkat nasional'),
('Juara 2 Lomba Paduan Suara', 'Paduan Suara Sekolah', 2023, 'Provinsi', 'Musik', '{"url": "https://via.placeholder.com/800x600/0891B2/FFFFFF?text=Juara+Paduan+Suara", "alt": "Juara 2 Lomba Paduan Suara"}', 'Meraih juara 2 dalam lomba paduan suara tingkat provinsi');

-- 9. Insert data Galeri
INSERT INTO "Galeri" (judul, deskripsi, foto, kategori, tags, status) VALUES
('Kegiatan Belajar Mengajar', 'Foto kegiatan belajar mengajar di kelas', '{"url": "https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Kegiatan+Belajar", "alt": "Kegiatan Belajar Mengajar"}', 'Pendidikan', '{"belajar", "kelas", "guru", "siswa"}', 'published'),
('Lomba Matematika', 'Foto kegiatan lomba matematika tingkat sekolah', '{"url": "https://via.placeholder.com/800x600/059669/FFFFFF?text=Lomba+Matematika", "alt": "Lomba Matematika"}', 'Lomba', '{"lomba", "matematika", "prestasi"}', 'published'),
('Kegiatan Pramuka', 'Foto kegiatan pramuka di lapangan sekolah', '{"url": "https://via.placeholder.com/800x600/DC2626/FFFFFF?text=Kegiatan+Pramuka", "alt": "Kegiatan Pramuka"}', 'Ekstrakurikuler', '{"pramuka", "kegiatan", "lapangan"}', 'published'),
('Lomba Futsal', 'Foto lomba futsal antar sekolah', '{"url": "https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Lomba+Futsal", "alt": "Lomba Futsal"}', 'Olahraga', '{"futsal", "olahraga", "lomba"}', 'published'),
('Pentas Seni', 'Foto pentas seni tahunan sekolah', '{"url": "https://via.placeholder.com/800x600/EA580C/FFFFFF?text=Pentas+Seni", "alt": "Pentas Seni"}', 'Seni', '{"pentas", "seni", "tahunan"}', 'published'),
('Kegiatan Outbound', 'Foto kegiatan outbound siswa', '{"url": "https://via.placeholder.com/800x600/0891B2/FFFFFF?text=Kegiatan+Outbound", "alt": "Kegiatan Outbound"}', 'Kegiatan', '{"outbound", "siswa", "kegiatan"}', 'published');

-- 10. Insert data Berita
INSERT INTO "Berita" (judul, deskripsi, konten, slug, status, featured) VALUES
('Sekolah Modern Raih Prestasi di Lomba Robotik Nasional', 'Tim robotik Sekolah Modern berhasil meraih juara 1 dalam lomba robotik tingkat nasional', 'Tim robotik Sekolah Modern Indonesia berhasil meraih prestasi membanggakan dengan menjadi juara 1 dalam lomba robotik tingkat nasional yang diselenggarakan di Jakarta. Prestasi ini merupakan hasil dari kerja keras dan dedikasi tinggi dari para siswa dan pembimbing.', 'sekolah-modern-raih-prestasi-lomba-robotik-nasional', 'published', true),
('Pembukaan Program Unggulan Tahun Ajaran 2024', 'Sekolah Modern membuka program unggulan untuk tahun ajaran 2024', 'Sekolah Modern Indonesia membuka pendaftaran program unggulan untuk tahun ajaran 2024. Program ini dirancang khusus untuk memberikan pendidikan berkualitas tinggi dengan pendekatan modern dan inovatif.', 'pembukaan-program-unggulan-tahun-ajaran-2024', 'published', true),
('Kegiatan Outbound Siswa Kelas 5', 'Siswa kelas 5 mengikuti kegiatan outbound di Taman Mini Indonesia Indah', 'Siswa kelas 5 Sekolah Modern Indonesia mengikuti kegiatan outbound yang diselenggarakan di Taman Mini Indonesia Indah. Kegiatan ini bertujuan untuk mengembangkan karakter dan kerja sama tim siswa.', 'kegiatan-outbound-siswa-kelas-5', 'published', false),
('Pentas Seni Tahunan Sekolah Modern', 'Pentas seni tahunan menampilkan berbagai pertunjukan dari siswa', 'Pentas seni tahunan Sekolah Modern Indonesia berlangsung meriah dengan menampilkan berbagai pertunjukan seni dari siswa. Acara ini dihadiri oleh orang tua siswa dan masyarakat sekitar.', 'pentas-seni-tahunan-sekolah-modern', 'published', false),
('Workshop Teknologi untuk Guru', 'Guru mengikuti workshop teknologi untuk meningkatkan kompetensi', 'Para guru Sekolah Modern Indonesia mengikuti workshop teknologi yang diselenggarakan untuk meningkatkan kompetensi dalam penggunaan teknologi dalam pembelajaran.', 'workshop-teknologi-untuk-guru', 'published', false);

-- 11. Insert data User (Admin)
INSERT INTO "User" (username, password, role, is_active) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', true)
ON CONFLICT (username) DO NOTHING;

-- 12. Insert data AuditLog (Sample)
INSERT INTO "AuditLog" (user_id, action, table_name, record_id, ip_address, user_agent) VALUES
((SELECT id FROM "User" WHERE username = 'admin'), 'CREATE', 'Setting', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
((SELECT id FROM "User" WHERE username = 'admin'), 'UPDATE', 'Setting', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
((SELECT id FROM "User" WHERE username = 'admin'), 'CREATE', 'GuruStaff', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

-- Pesan konfirmasi
SELECT 'Data sample berhasil dimasukkan ke database!' as status;
