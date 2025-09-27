import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../utils/supabaseClient'

export async function GET() {
  try {
    // Data default untuk profil sekolah
    const defaultData = [
      {
        id: 1,
        section: 'tentang',
        konten: JSON.stringify({
          sejarah: 'Sekolah Modern didirikan pada tahun 2010 dengan visi menjadi lembaga pendidikan yang unggul dalam membentuk generasi yang berkarakter, berprestasi, dan berakhlak mulia. Sejak berdiri, sekolah kami telah berkomitmen untuk memberikan pendidikan berkualitas tinggi dengan pendekatan modern dan inovatif.',
          visi: 'Menjadi sekolah unggulan yang menghasilkan lulusan berkarakter, berprestasi, dan siap menghadapi tantangan masa depan',
          misi: [
            'Menyelenggarakan pendidikan berkualitas tinggi dengan kurikulum yang relevan dan inovatif',
            'Mengembangkan karakter dan akhlak mulia pada setiap peserta didik',
            'Menyediakan fasilitas pembelajaran yang modern dan mendukung',
            'Membangun kerjasama yang baik dengan orang tua dan masyarakat',
            'Mengembangkan potensi peserta didik secara optimal melalui berbagai program unggulan'
          ],
          nilai: [
            'Integritas',
            'Kreativitas',
            'Kerjasama',
            'Disiplin',
            'Respek',
            'Excellence'
          ]
        })
      },
      {
        id: 2,
        section: 'guru',
        konten: JSON.stringify({
          guru: [
            {
              nama: 'Dr. Ahmad Wijaya, M.Pd',
              jabatan: 'Kepala Sekolah',
              foto: ''
            },
            {
              nama: 'Siti Nurhaliza, S.Pd',
              jabatan: 'Wakil Kepala Sekolah',
              foto: ''
            },
            {
              nama: 'Budi Santoso, S.Pd',
              jabatan: 'Guru Matematika',
              foto: ''
            },
            {
              nama: 'Dewi Kartika, S.Pd',
              jabatan: 'Guru Bahasa Indonesia',
              foto: ''
            },
            {
              nama: 'Eko Prasetyo, S.Pd',
              jabatan: 'Guru IPA',
              foto: ''
            },
            {
              nama: 'Fitriani, S.Pd',
              jabatan: 'Guru Bahasa Inggris',
              foto: ''
            }
          ],
          staff: [
            {
              nama: 'Rina Sari, S.E',
              jabatan: 'Bendahara',
              foto: ''
            },
            {
              nama: 'Joko Susilo, S.Kom',
              jabatan: 'Staff IT',
              foto: ''
            },
            {
              nama: 'Maya Indira, S.Pd',
              jabatan: 'Staff Administrasi',
              foto: ''
            }
          ]
        })
      }
    ]

    // Coba ambil data dari database
    const { data, error } = await supabaseAdmin
      .from('ProfilSekolah')
      .select('*')
      .order('id', { ascending: true })

    if (error || !data || data.length === 0) {
      // Jika tidak ada data, return data default
      return NextResponse.json(defaultData)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching profil sekolah:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}