import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/SupabaseClient'

// GET: Ambil semua berita
export const revalidate = 60

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Berita')
      .select('*')
      .order('tanggal', { ascending: false })
    if (error) {
      console.error('Berita GET error:', error.message)
      return NextResponse.json([], { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } })
    }
    return NextResponse.json(data || [], { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } })
  } catch (e: any) {
    console.error('Berita GET exception:', e?.message || e)
    return NextResponse.json([], { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } })
  }
}

// POST: Tambah berita baru
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { judul, deskripsi, gambar, tanggal, konten } = body
  const { data, error } = await supabase
    .from('Berita')
    .insert([{ judul, deskripsi, gambar, tanggal: tanggal || new Date().toISOString(), konten }])
    .select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.[0] || {})
} 