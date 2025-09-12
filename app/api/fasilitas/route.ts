import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/SupabaseClient'
const revalidate = 120

// GET: List semua fasilitas
export async function GET() {
  const { data, error } = await supabase.from('Fasilitas').select('*').order('id', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } })
}

// POST: Tambah atau edit fasilitas
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { id, nama, deskripsi, foto } = body
  if (!nama) return NextResponse.json({ error: 'Nama wajib diisi' }, { status: 400 })
  if (!Array.isArray(foto)) return NextResponse.json({ error: 'Foto harus array' }, { status: 400 })

  if (id) {
    // Update
    const { error } = await supabase.from('Fasilitas').update({ nama, deskripsi, foto }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, updated: true })
  } else {
    // Insert
    const { data, error } = await supabase.from('Fasilitas').insert([{ nama, deskripsi, foto }]).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, fasilitas: data })
  }
}

// DELETE: Hapus fasilitas berdasarkan id
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID wajib' }, { status: 400 })
  const { error } = await supabase.from('Fasilitas').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
} 