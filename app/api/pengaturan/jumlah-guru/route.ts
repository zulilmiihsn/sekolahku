import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/app/utils/supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Setting')
      .select('value')
      .eq('key', 'jumlah_guru')
      .limit(1)
      .maybeSingle();
    if (error) {
      // Hanya log error jika bukan error tabel tidak ditemukan
      if (!error.message.includes('Could not find the table')) {
        console.error('Setting jumlah_guru GET error:', error.message);
      }
      return NextResponse.json({ jumlah_guru: 0 });
    }
    return NextResponse.json({ jumlah_guru: parseInt(data?.value) || 18 });
  } catch (err) {
    console.error('Setting jumlah_guru GET exception:', err);
    return NextResponse.json({ jumlah_guru: 0 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { jumlah_guru } = await req.json();
    if (typeof jumlah_guru !== 'number' || isNaN(jumlah_guru)) {
      return NextResponse.json({ error: 'Jumlah guru wajib diisi' }, { status: 400 });
    }
    const { error } = await supabaseAdmin
      .from('Setting')
      .upsert([{ key: 'jumlah_guru', value: jumlah_guru.toString() }]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, jumlah_guru });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
} 