import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/utils/SupabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Setting')
      .select('value')
      .eq('key', 'deskripsi')
      .single();
    if (error) {
      return NextResponse.json({ deskripsi: '', error: error.message });
    }
    return NextResponse.json({ deskripsi: data?.value || '' });
  } catch (err) {
    return NextResponse.json({ deskripsi: '', error: String(err) });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { deskripsi } = await req.json();
    if (!deskripsi || typeof deskripsi !== 'string') {
      return NextResponse.json({ error: 'Deskripsi wajib diisi' }, { status: 400 });
    }
    const { error } = await supabase
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