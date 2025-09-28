import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabaseClient';

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
    
    // Cek apakah record sudah ada
    const { data: existingData } = await supabase
      .from('Setting')
      .select('id')
      .eq('key', 'jumlah_guru')
      .maybeSingle();
    
    if (existingData) {
      // Update existing record
      const { error } = await supabase
        .from('Setting')
        .update({ value: jumlah_guru.toString(), updated_at: new Date().toISOString() })
        .eq('key', 'jumlah_guru');
      
      if (error) {
        console.error('Setting UPDATE error:', error);
        return NextResponse.json({ error: 'Gagal mengupdate jumlah guru' }, { status: 500 });
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from('Setting')
        .insert([{ key: 'jumlah_guru', value: jumlah_guru.toString() }]);
      
      if (error) {
        console.error('Setting INSERT error:', error);
        return NextResponse.json({ error: 'Gagal menyimpan jumlah guru' }, { status: 500 });
      }
    }
    
    return NextResponse.json({ success: true, jumlah_guru });
  } catch (err) {
    console.error('Setting PUT exception:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
} 