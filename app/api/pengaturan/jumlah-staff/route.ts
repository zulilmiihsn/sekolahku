import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/app/utils/supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Setting')
      .select('value')
      .eq('key', 'jumlah_staff')
      .limit(1)
      .maybeSingle();
    if (error) {
      // Hanya log error jika bukan error tabel tidak ditemukan
      if (!error.message.includes('Could not find the table')) {
        console.error('Setting jumlah_staff GET error:', error.message);
      }
      return NextResponse.json({ jumlah_staff: 0 });
    }
    return NextResponse.json({ jumlah_staff: parseInt(data?.value) || 6 });
  } catch (err) {
    console.error('Setting jumlah_staff GET exception:', err);
    return NextResponse.json({ jumlah_staff: 0 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { jumlah_staff } = await req.json();
    if (typeof jumlah_staff !== 'number' || isNaN(jumlah_staff)) {
      return NextResponse.json({ error: 'Jumlah staff wajib diisi' }, { status: 400 });
    }
    const { error } = await supabaseAdmin
      .from('Setting')
      .upsert([{ key: 'jumlah_staff', value: jumlah_staff.toString() }]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, jumlah_staff });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
} 