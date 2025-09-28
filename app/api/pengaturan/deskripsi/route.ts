import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Setting')
      .select('value')
      .eq('key', 'deskripsi')
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('Setting deskripsi GET error:', error.message);
      return NextResponse.json({ deskripsi: 'Deskripsi singkat tentang sekolah, visi, misi, dan keunggulan utama.' });
    }
    
    return NextResponse.json({ deskripsi: data?.value || 'Deskripsi singkat tentang sekolah, visi, misi, dan keunggulan utama.' });
  } catch (err) {
    console.error('Setting deskripsi GET exception:', err);
    return NextResponse.json({ deskripsi: 'Deskripsi singkat tentang sekolah, visi, misi, dan keunggulan utama.' });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { deskripsi } = await req.json();
    if (!deskripsi || typeof deskripsi !== 'string') {
      return NextResponse.json({ error: 'Deskripsi wajib diisi' }, { status: 400 });
    }
    
    // Cek apakah record sudah ada
    const { data: existingData } = await supabase
      .from('Setting')
      .select('id')
      .eq('key', 'deskripsi')
      .maybeSingle();
    
    if (existingData) {
      // Update existing record
      const { error } = await supabase
        .from('Setting')
        .update({ value: deskripsi.trim(), updated_at: new Date().toISOString() })
        .eq('key', 'deskripsi');
      
      if (error) {
        console.error('Setting UPDATE error:', error);
        return NextResponse.json({ error: 'Gagal mengupdate deskripsi' }, { status: 500 });
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from('Setting')
        .insert([{ key: 'deskripsi', value: deskripsi.trim() }]);
      
      if (error) {
        console.error('Setting INSERT error:', error);
        return NextResponse.json({ error: 'Gagal menyimpan deskripsi' }, { status: 500 });
      }
    }
    
    return NextResponse.json({ success: true, deskripsi: deskripsi.trim() });
  } catch (err) {
    console.error('Setting PUT exception:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
} 