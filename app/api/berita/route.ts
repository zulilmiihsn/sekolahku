import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/supabaseClient'
import { getCacheHeaders, getCacheTime } from '@/app/utils/cache'
import { logError } from '@/app/utils/logger'

// GET: Ambil berita dengan pagination dan filtering
export const revalidate = getCacheTime('berita')

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const offset = (page - 1) * limit

    let query = supabase
      .from('Berita')
      .select('id, judul, deskripsi, gambar, tanggal, slug, views', { count: 'exact' })
      .eq('status', 'published')
      .order('tanggal', { ascending: false })
      .range(offset, offset + limit - 1)

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    if (search) {
      query = query.textSearch('judul', search, { type: 'websearch' })
    }

    const { data, error, count } = await query

    if (error) {
      // Hanya log error jika bukan error tabel tidak ditemukan
      if (!error.message.includes('Could not find the table')) {
        logError('Berita GET error', error.message, 'API')
      }
      return NextResponse.json([], { headers: { 'Cache-Control': getCacheHeaders('berita') } })
    }

    const revalidate = search || featured ? 60 : 300 // Shorter cache for filtered results

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }, { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } })
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