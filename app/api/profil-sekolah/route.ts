import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/supabaseClient'
const revalidate = 300

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('ProfilSekolah')
      .select('*')
      .order('id', { ascending: true })
    
    if (error) {
      // Hanya log error jika bukan error tabel tidak ditemukan
      if (!error.message.includes('Could not find the table')) {
        console.error('ProfilSekolah GET error:', error.message);
      }
      return NextResponse.json([], { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } })
    }
    return NextResponse.json(data || [], { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } })
  } catch (err) {
    console.error('ProfilSekolah GET exception:', err);
    return NextResponse.json([], { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } })
  }
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