import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/app/utils/supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Setting')
      .select('value')
      .eq('key', 'deskripsi')
      .limit(1)
      .maybeSingle();
    if (error) {
      // Hanya log error jika bukan error tabel tidak ditemukan
      if (!error.message.includes('Could not find the table')) {
        console.error('Setting deskripsi GET error:', error.message);
      }
      return NextResponse.json({ deskripsi: '' });
    }
    return NextResponse.json({ deskripsi: data?.value || 'Deskripsi singkat tentang sekolah, visi, misi, dan keunggulan utama.' });
  } catch (err) {
    console.error('Setting deskripsi GET exception:', err);
    return NextResponse.json({ deskripsi: '' });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { deskripsi } = await req.json();
    if (!deskripsi || typeof deskripsi !== 'string') {
      return NextResponse.json({ error: 'Deskripsi wajib diisi' }, { status: 400 });
    }
    const { error } = await supabaseAdmin
      .from('Setting')
      .upsert([{ key: 'deskripsi', value: deskripsi.trim() }]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, deskripsi: deskripsi.trim() });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
} 