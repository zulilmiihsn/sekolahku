import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/utils/SupabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Setting')
      .select('value')
      .eq('key', 'jumlah_siswa')
      .single();
    if (error) {
      return NextResponse.json({ jumlah_siswa: 0, error: error.message });
    }
    return NextResponse.json({ jumlah_siswa: parseInt(data?.value) || 0 });
  } catch (err) {
    return NextResponse.json({ jumlah_siswa: 0, error: String(err) });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { jumlah_siswa } = await req.json();
    if (typeof jumlah_siswa !== 'number' || isNaN(jumlah_siswa)) {
      return NextResponse.json({ error: 'Jumlah siswa wajib diisi' }, { status: 400 });
    }
    const { error } = await supabase
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