import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/utils/supabaseClient';

// GET: List semua gambar di bucket 'galeri'
export async function GET() {
  try {
    const { data, error } = await supabase.storage.from('galeri').list('', { limit: 100 });
    
    if (error) {
      // Hanya log error jika bukan error storage tidak ditemukan
      if (!error.message.includes('Could not find') && !error.message.includes('Invalid API key')) {
        console.error('Galeri storage error:', error.message);
      }
      const revalidate = 300;
      return NextResponse.json([], { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } });
    }
    
    // Kembalikan array URL gambar
    const urls = (data || [])
      .filter(item => item.name && !item.name.endsWith('/'))
      .map(item => supabase.storage.from('galeri').getPublicUrl(item.name).data.publicUrl);
    
    const revalidate = 300
    return NextResponse.json(urls, { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } });
  } catch (err) {
    console.error('Galeri GET exception:', err);
    const revalidate = 300;
    return NextResponse.json([], { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } });
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