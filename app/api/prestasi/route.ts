import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../utils/supabaseClient'
import { logError } from '../../utils/logger'

// GET: Ambil semua prestasi
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Prestasi')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      if (!error.message.includes('Could not find the table')) {
        logError('Prestasi GET error', error.message, 'API')
      }
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('Unknown error')
    logError('Prestasi GET exception', error.message, 'API')
    return NextResponse.json([])
  }
}

// POST: Tambah prestasi baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { judul, deskripsi, kategori, tingkat, tahun, pencapaian, foto } = body

    const { data, error } = await supabase
      .from('Prestasi')
      .insert([{
        judul,
        deskripsi,
        kategori,
        tingkat,
        tahun: parseInt(tahun) || new Date().getFullYear(),
        pencapaian,
        foto: foto || ''
      }])
      .select()

    if (error) {
      logError('Prestasi POST error', error.message, 'API')
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data?.[0] || {})
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('Unknown error')
    logError('Prestasi POST exception', error.message, 'API')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT: Update prestasi
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updateData } = body

    const { data, error } = await supabase
      .from('Prestasi')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      logError('Prestasi PUT error', error.message, 'API')
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data?.[0] || {})
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('Unknown error')
    logError('Prestasi PUT exception', error.message, 'API')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Hapus prestasi
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID prestasi wajib diisi' }, { status: 400 })
    }

    const { error } = await supabase
      .from('Prestasi')
      .delete()
      .eq('id', id)

    if (error) {
      logError('Prestasi DELETE error', error.message, 'API')
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('Unknown error')
    logError('Prestasi DELETE exception', error.message, 'API')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}