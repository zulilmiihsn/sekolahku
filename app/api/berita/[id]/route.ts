import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/supabaseClient'

// GET: Detail berita by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  
  try {
    // Get berita detail
    const { data, error } = await supabase
      .from('Berita')
      .select('id, judul, deskripsi, konten, gambar, tanggal, slug, views')
      .eq('id', id)
      .eq('status', 'published')
      .single()
    
    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    
    // Increment view count (async, don't wait for it)
    supabase.rpc('increment_view_count', { table_name: 'Berita', record_id: parseInt(id) }).catch(console.error)
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT: Edit berita by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const body = await req.json()
  const { judul, deskripsi, gambar, konten } = body
  const { data, error } = await supabase.from('Berita').update({ judul, deskripsi, gambar, konten }).eq('id', id).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.[0] || {})
}

// DELETE: Hapus berita by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const { error } = await supabase.from('Berita').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
} 