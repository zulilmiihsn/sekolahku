import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/supabaseClient'

export async function GET() {
  try {
    const keys = ['alamat', 'email_kontak', 'telepon', 'lat_sekolah', 'lng_sekolah']
    const { data, error } = await supabase
      .from('Setting')
      .select('*')
      .in('key', keys)
    
    if (error) {
      // Hanya log error jika bukan error tabel tidak ditemukan
      if (!error.message.includes('Could not find the table')) {
        console.error('Setting kontak GET error:', error.message);
      }
      return NextResponse.json({
        alamat: '',
        email: '',
        telepon: '',
        lat: '',
        lng: ''
      })
    }
    
    const result = Object.fromEntries(keys.map(k => [k, data?.find(s => s.key === k)?.value || '']))
    return NextResponse.json({
      alamat: result.alamat || 'Jl. Pendidikan No. 123, Jakarta',
      email: result.email_kontak || 'info@sekolahmodern.com',
      telepon: result.telepon || '021-12345678',
      lat: result.lat_sekolah || '-6.2',
      lng: result.lng_sekolah || '106.816666'
    })
  } catch (err) {
    console.error('Setting kontak GET exception:', err);
    return NextResponse.json({
      alamat: '',
      email: '',
      telepon: '',
      lat: '',
      lng: ''
    })
  }
}

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get('admin_session')
  if (!cookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { alamat, email, telepon, lat, lng } = await req.json()
  const upserts = [
    { key: 'alamat', value: alamat },
    { key: 'email_kontak', value: email },
    { key: 'telepon', value: telepon },
    { key: 'lat_sekolah', value: lat },
    { key: 'lng_sekolah', value: lng }
  ]
  for (const s of upserts) {
    const { data: exist } = await supabase.from('Setting').select('*').eq('key', s.key).single()
    if (exist) {
      await supabase.from('Setting').update({ value: s.value }).eq('key', s.key)
    } else {
      await supabase.from('Setting').insert([{ key: s.key, value: s.value }])
    }
  }
  return NextResponse.json({ success: true })
} 