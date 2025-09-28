import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../utils/supabaseClient';

// GET: List semua galeri dengan pagination dan filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const offset = (page - 1) * limit

    let query = supabase
      .from('Galeri')
      .select('id, judul, deskripsi, foto, kategori, tanggal', { count: 'exact' })
      .eq('status', 'published')
      .order('tanggal', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq('kategori', category)
    }

    if (search) {
      query = query.textSearch('judul', search, { type: 'websearch' })
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Galeri GET error:', error.message);
      return NextResponse.json([], { 
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300' } 
      });
    }

    const revalidate = search || category ? 60 : 300 // Shorter cache for filtered results

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }, { 
      headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } 
    });
  } catch (err) {
    console.error('Galeri GET exception:', err);
    return NextResponse.json([], { 
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300' } 
    });
  }
}

// DELETE: Hapus gambar dari bucket 'galeri' (body: { path: string })
export async function DELETE(req: NextRequest) {
  const { path } = await req.json();
  if (!path) return NextResponse.json({ error: 'Path gambar wajib diisi' }, { status: 400 });
  const { error } = await supabase.storage.from('galeri').remove([path]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
} 