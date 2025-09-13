import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/supabaseClient'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Setting')
      .select('*')
      .eq('key', 'kategori_guru')
      .single()

    if (error) {
      // Hanya log error jika bukan error tabel tidak ditemukan
      if (!error.message.includes('Could not find the table')) {
        console.error('Setting kategori_guru GET error:', error.message);
      }
      return NextResponse.json([])
    }

    let value = [] as any[]
    try {
      value = data?.value ? JSON.parse(data.value) : []
    } catch {
      value = []
    }
    return NextResponse.json(value)
  } catch (err) {
    console.error('Setting kategori_guru GET exception:', err);
    return NextResponse.json([])
  }
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