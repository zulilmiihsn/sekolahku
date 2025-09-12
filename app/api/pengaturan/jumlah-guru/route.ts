import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/utils/supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Setting')
      .select('value')
      .eq('key', 'jumlah_guru')
      .single();
    if (error) {
      return NextResponse.json({ jumlah_guru: 0, error: error.message });
    }
    return NextResponse.json({ jumlah_guru: parseInt(data?.value) || 0 });
  } catch (err) {
    return NextResponse.json({ jumlah_guru: 0, error: String(err) });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { jumlah_guru } = await req.json();
    if (typeof jumlah_guru !== 'number' || isNaN(jumlah_guru)) {
      return NextResponse.json({ error: 'Jumlah guru wajib diisi' }, { status: 400 });
    }
    const { error } = await supabase
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