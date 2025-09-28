import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/supabaseClient'

export async function GET() {
  try {
    const keys = ['alamat', 'email_kontak', 'telepon', 'lat_sekolah', 'lng_sekolah']
    const { data, error } = await supabase
      .from('Setting')
      .select('*')
      .in('key', keys)
    
    if (error) {
      // Hanya log error jika bukan error tabel tidak ditemukan
      if (!error.message.includes('Could not find the table')) {
        console.error('Setting kontak GET error:', error.message);
      }
      return NextResponse.json({
        alamat: '',
        email: '',
        telepon: '',
        lat: '',
        lng: ''
      })
    }
    
    const result = Object.fromEntries(keys.map(k => [k, data?.find(s => s.key === k)?.value || '']))
    return NextResponse.json({
      alamat: result.alamat || 'Jl. Pendidikan No. 123, Jakarta',
      email: result.email_kontak || 'info@sekolahmodern.com',
      telepon: result.telepon || '021-12345678',
      lat: result.lat_sekolah || '-6.2',
      lng: result.lng_sekolah || '106.816666'
    })
  } catch (err) {
    console.error('Setting kontak GET exception:', err);
    return NextResponse.json({
      alamat: '',
      email: '',
      telepon: '',
      lat: '',
      lng: ''
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { alamat, email, telepon, lat, lng } = await req.json()
    
    // Update atau insert setiap setting satu per satu
    const settings = [
      { key: 'alamat', value: alamat },
      { key: 'email_kontak', value: email },
      { key: 'telepon', value: telepon },
      { key: 'lat_sekolah', value: lat },
      { key: 'lng_sekolah', value: lng }
    ]
    
    for (const setting of settings) {
      // Cek apakah record sudah ada
      const { data: existingData } = await supabase
        .from('Setting')
        .select('id')
        .eq('key', setting.key)
        .maybeSingle();
      
      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('Setting')
          .update({ 
            value: setting.value, 
            updated_at: new Date().toISOString() 
          })
          .eq('key', setting.key);
        
        if (error) {
          console.error(`Setting UPDATE error for ${setting.key}:`, error);
          return NextResponse.json({ error: `Gagal mengupdate ${setting.key}` }, { status: 500 });
        }
      } else {
        // Insert new record
        const { error } = await supabase
          .from('Setting')
          .insert([setting]);
        
        if (error) {
          console.error(`Setting INSERT error for ${setting.key}:`, error);
          return NextResponse.json({ error: `Gagal menyimpan ${setting.key}` }, { status: 500 });
        }
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Setting POST exception:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
} 