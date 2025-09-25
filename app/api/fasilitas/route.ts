import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/supabaseClient'
const revalidate = 120

// GET: List fasilitas dengan pagination dan filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const offset = (page - 1) * limit

    let query = supabase
      .from('Fasilitas')
      .select('id, nama, deskripsi, foto, kategori', { count: 'exact' })
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
        console.error('Fasilitas GET error:', error.message);
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
    console.error('Fasilitas GET exception:', err);
    return NextResponse.json([], { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } });
  }
}

// POST: Tambah atau edit fasilitas
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { id, nama, deskripsi, foto } = body
  if (!nama) return NextResponse.json({ error: 'Nama wajib diisi' }, { status: 400 })
  if (!Array.isArray(foto)) return NextResponse.json({ error: 'Foto harus array' }, { status: 400 })

  if (id) {
    // Update
    const { error } = await supabase.from('Fasilitas').update({ nama, deskripsi, foto }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, updated: true })
  } else {
    // Insert
    const { data, error } = await supabase.from('Fasilitas').insert([{ nama, deskripsi, foto }]).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, fasilitas: data })
  }
}

// DELETE: Hapus fasilitas berdasarkan id
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID wajib' }, { status: 400 })
  const { error } = await supabase.from('Fasilitas').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
} 