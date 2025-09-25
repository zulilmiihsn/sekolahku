import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/utils/supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Setting')
      .select('value')
      .eq('key', 'site_name')
      .limit(1)
      .maybeSingle();
    if (error) {
      // Hanya log error jika bukan error tabel tidak ditemukan
      if (!error.message.includes('Could not find the table')) {
        console.error('Setting GET error:', error.message);
      }
      return NextResponse.json({ site_name: 'Sekolah Modern' });
    }
    return NextResponse.json({ site_name: data?.value || 'Sekolah Modern' });
  } catch (err) {
    console.error('Setting GET exception:', err);
    return NextResponse.json({ site_name: 'Sekolah Modern' });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { site_name } = await req.json();
    if (!site_name || typeof site_name !== 'string') {
      return NextResponse.json({ error: 'Nama sekolah wajib diisi' }, { status: 400 });
    }
    const { error } = await supabase
      .from('Setting')
      .upsert([{ key: 'site_name', value: site_name.trim() }]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, site_name: site_name.trim() });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
} 