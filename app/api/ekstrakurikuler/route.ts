import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/supabaseClient'

const TABLE = 'Ekstrakurikuler'
const revalidate = 120

export async function GET() {
  try {
    const { data, error } = await supabase.from(TABLE).select('*').order('id', { ascending: true })
    
    if (error) {
      // Hanya log error jika bukan error tabel tidak ditemukan
      if (!error.message.includes('Could not find the table')) {
        console.error('Ekstrakurikuler GET error:', error.message);
      }
      return NextResponse.json([], { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } });
    }
    
    return NextResponse.json(data || [], { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } })
  } catch (err) {
    console.error('Ekstrakurikuler GET exception:', err);
    return NextResponse.json([], { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } });
  }
}

export async function POST(req: NextRequest) {
  const { nama, deskripsi, foto } = await req.json()
  const { data, error } = await supabase.from(TABLE).insert([{ nama, deskripsi, foto }]).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.[0])
}

export async function PUT(req: NextRequest) {
  const { id, nama, deskripsi, foto } = await req.json()
  const { data, error } = await supabase.from(TABLE).update({ nama, deskripsi, foto }).eq('id', id).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.[0])
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
} 