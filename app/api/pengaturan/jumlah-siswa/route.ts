import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabaseClient';

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
    
    // Cek apakah record sudah ada
    const { data: existingData } = await supabase
      .from('Setting')
      .select('id')
      .eq('key', 'jumlah_siswa')
      .maybeSingle();
    
    if (existingData) {
      // Update existing record
      const { error } = await supabase
        .from('Setting')
        .update({ value: jumlah_siswa.toString(), updated_at: new Date().toISOString() })
        .eq('key', 'jumlah_siswa');
      
      if (error) {
        console.error('Setting UPDATE error:', error);
        return NextResponse.json({ error: 'Gagal mengupdate jumlah siswa' }, { status: 500 });
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from('Setting')
        .insert([{ key: 'jumlah_siswa', value: jumlah_siswa.toString() }]);
      
      if (error) {
        console.error('Setting INSERT error:', error);
        return NextResponse.json({ error: 'Gagal menyimpan jumlah siswa' }, { status: 500 });
      }
    }
    
    return NextResponse.json({ success: true, jumlah_siswa });
  } catch (err) {
    console.error('Setting PUT exception:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
} 