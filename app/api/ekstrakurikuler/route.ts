import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/supabaseClient'

const TABLE = 'Ekstrakurikuler'
const revalidate = 120

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const offset = (page - 1) * limit

    let query = supabase
      .from(TABLE)
      .select('id, nama, deskripsi, foto, kategori, jadwal, pembina', { count: 'exact' })
      .eq('status', 'active')
      .order('id', { ascending: true })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq('kategori', category)
    }

    if (search) {
      query = query.textSearch('nama', search, { type: 'websearch' })
    }

    const { data, error, count } = await query
    
    if (error) {
      // Hanya log error jika bukan error tabel tidak ditemukan
      if (!error.message.includes('Could not find the table')) {
        console.error('Ekstrakurikuler GET error:', error.message);
      }
      return NextResponse.json([], { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } });
    }

    const cacheTime = search || category ? 60 : revalidate // Shorter cache for filtered results

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }, { headers: { 'Cache-Control': `public, s-maxage=${cacheTime}, stale-while-revalidate=${cacheTime}` } })
  } catch (err) {
    console.error('Ekstrakurikuler GET exception:', err);
    return NextResponse.json([], { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } });
  }
}

export async function POST(req: NextRequest) {
  const { nama, deskripsi, foto } = await req.json()
  const { data, error } = await supabase.from(TABLE).insert([{ nama, deskripsi, foto }]).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.[0])
}

export async function PUT(req: NextRequest) {
  const { id, nama, deskripsi, foto } = await req.json()
  const { data, error } = await supabase.from(TABLE).update({ nama, deskripsi, foto }).eq('id', id).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.[0])
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
} 