import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/SupabaseClient'

export async function GET() {
  const { data, error } = await supabase
    .from('Setting')
    .select('*')
    .eq('key', 'kategori_guru')
    .single()

  // Jika terjadi error apa pun, balas array kosong agar tidak 500
  if (error) {
    return NextResponse.json([])
  }

  let value = [] as any[]
  try {
    value = data?.value ? JSON.parse(data.value) : []
  } catch {
    value = []
  }
  return NextResponse.json(value)
}

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get('admin_session')
  if (!cookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const kategori = await req.json()
  const { data: exist } = await supabase.from('Setting').select('*').eq('key', 'kategori_guru').single()
  if (exist) {
    await supabase.from('Setting').update({ value: JSON.stringify(kategori) }).eq('key', 'kategori_guru')
  } else {
    await supabase.from('Setting').insert([{ key: 'kategori_guru', value: JSON.stringify(kategori) }])
  }
  return NextResponse.json({ success: true })
} 