import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/supabaseClient'

export async function GET() {
  const keys = ['alamat', 'email_kontak', 'telepon', 'lat_sekolah', 'lng_sekolah']
  const { data, error } = await supabase
    .from('Setting')
    .select('*')
    .in('key', keys)
  // Jika error, balas data kosong agar tidak 500
  if (error) {
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
    alamat: result.alamat,
    email: result.email_kontak,
    telepon: result.telepon,
    lat: result.lat_sekolah,
    lng: result.lng_sekolah
  })
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