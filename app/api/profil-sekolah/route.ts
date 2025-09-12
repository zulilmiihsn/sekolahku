import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/SupabaseClient'
const revalidate = 300

export async function GET() {
  const { data, error } = await supabase
    .from('ProfilSekolah')
    .select('*')
    .order('id', { ascending: true })
  // Jika error, balas array kosong agar tidak 500
  if (error) {
    return NextResponse.json([], { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } })
  }
  return NextResponse.json(data, { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } })
}

export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get('admin_session')
    if (!cookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { section, judul, deskripsi, konten } = await req.json()
    const now = new Date().toISOString();
    // Cek apakah sudah ada
    const { data: existing, error: errFind } = await supabase
      .from('ProfilSekolah')
      .select('*')
      .eq('section', section)
      .single()
    if (errFind && errFind.code !== 'PGRST116') {
      return NextResponse.json({ error: errFind.message }, { status: 500 })
    }
    let result
    if (existing) {
      // Update
      const { data, error } = await supabase
        .from('ProfilSekolah')
        .update({ judul, deskripsi, konten, updatedAt: now })
        .eq('section', section)
        .select()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      result = data?.[0]
    } else {
      // Insert
      const { data, error } = await supabase
        .from('ProfilSekolah')
        .insert([{ section, judul, deskripsi, konten, updatedAt: now }])
        .select()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      result = data?.[0]
    }
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
} 