import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabaseClient';

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
    
    // Cek apakah record sudah ada
    const { data: existingData } = await supabase
      .from('Setting')
      .select('id')
      .eq('key', 'site_name')
      .maybeSingle();
    
    if (existingData) {
      // Update existing record
      const { error } = await supabase
        .from('Setting')
        .update({ value: site_name.trim(), updated_at: new Date().toISOString() })
        .eq('key', 'site_name');
      
      if (error) {
        console.error('Setting UPDATE error:', error);
        return NextResponse.json({ error: 'Gagal mengupdate nama sekolah' }, { status: 500 });
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from('Setting')
        .insert([{ key: 'site_name', value: site_name.trim() }]);
      
      if (error) {
        console.error('Setting INSERT error:', error);
        return NextResponse.json({ error: 'Gagal menyimpan nama sekolah' }, { status: 500 });
      }
    }
    
    return NextResponse.json({ success: true, site_name: site_name.trim() });
  } catch (err) {
    console.error('Setting PUT exception:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
} 