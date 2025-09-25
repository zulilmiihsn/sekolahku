import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/app/utils/supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Setting')
      .select('value')
      .eq('key', 'jumlah_siswa')
      .limit(1)
      .maybeSingle();
    if (error) {
      // Hanya log error jika bukan error tabel tidak ditemukan
      if (!error.message.includes('Could not find the table')) {
        console.error('Setting jumlah_siswa GET error:', error.message);
      }
      return NextResponse.json({ jumlah_siswa: 0 });
    }
    return NextResponse.json({ jumlah_siswa: parseInt(data?.value) || 320 });
  } catch (err) {
    console.error('Setting jumlah_siswa GET exception:', err);
    return NextResponse.json({ jumlah_siswa: 0 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { jumlah_siswa } = await req.json();
    if (typeof jumlah_siswa !== 'number' || isNaN(jumlah_siswa)) {
      return NextResponse.json({ error: 'Jumlah siswa wajib diisi' }, { status: 400 });
    }
    const { error } = await supabaseAdmin
      .from('Setting')
      .upsert([{ key: 'jumlah_siswa', value: jumlah_siswa.toString() }]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, jumlah_siswa });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
} 