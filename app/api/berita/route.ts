import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/supabaseClient'
import { getCacheHeaders, getCacheTime } from '@/app/utils/cache'
import { logError } from '@/app/utils/logger'

// GET: Ambil semua berita
export const revalidate = getCacheTime('berita')

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Berita')
      .select('*')
      .order('tanggal', { ascending: false })
    if (error) {
      // Hanya log error jika bukan error tabel tidak ditemukan
      if (!error.message.includes('Could not find the table')) {
        logError('Berita GET error', error.message, 'API')
      }
      return NextResponse.json([], { headers: { 'Cache-Control': getCacheHeaders('berita') } })
    }
    return NextResponse.json(data || [], { headers: { 'Cache-Control': getCacheHeaders('berita') } })
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('Unknown error')
    logError('Berita GET exception', error.message, 'API')
    return NextResponse.json([], { headers: { 'Cache-Control': getCacheHeaders('berita') } })
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