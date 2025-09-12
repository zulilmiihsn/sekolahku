import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/SupabaseClient'
const revalidate = 120

// GET: List semua prestasi
export async function GET() {
  const { data, error } = await supabase.from('Prestasi').select('*').order('id', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { headers: { 'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` } })
}

// POST: Tambah atau edit prestasi
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { id, nama, peraih, tahun, foto } = body
  if (!nama || !peraih || !tahun) return NextResponse.json({ error: 'Field wajib tidak boleh kosong' }, { status: 400 })
  if (!Array.isArray(foto)) return NextResponse.json({ error: 'Foto harus array' }, { status: 400 })

  if (id) {
    // Update
    const { error } = await supabase.from('Prestasi').update({ nama, peraih, tahun, foto }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, updated: true })
  } else {
    // Insert
    const { data, error } = await supabase.from('Prestasi').insert([{ nama, peraih, tahun, foto }]).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, prestasi: data })
  }
}

// DELETE: Hapus prestasi berdasarkan id
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID wajib' }, { status: 400 })
  const { error } = await supabase.from('Prestasi').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
} 