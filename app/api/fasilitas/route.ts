import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../utils/supabaseClient'
import { logError } from '../../utils/logger'

// GET: Ambil semua fasilitas
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Fasilitas')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      if (!error.message.includes('Could not find the table')) {
        logError('Fasilitas GET error', error.message, 'API')
      }
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('Unknown error')
    logError('Fasilitas GET exception', error.message, 'API')
    return NextResponse.json([])
  }
}

// POST: Tambah fasilitas baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nama, deskripsi, kategori, kapasitas, status, foto } = body

    const { data, error } = await supabase
      .from('Fasilitas')
      .insert([{
        nama,
        deskripsi,
        kategori,
        kapasitas: kapasitas || 0,
        status: status || 'tersedia',
        foto: foto || ''
      }])
      .select()

    if (error) {
      logError('Fasilitas POST error', error.message, 'API')
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data?.[0] || {})
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('Unknown error')
    logError('Fasilitas POST exception', error.message, 'API')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT: Update fasilitas
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updateData } = body

    const { data, error } = await supabase
      .from('Fasilitas')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      logError('Fasilitas PUT error', error.message, 'API')
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data?.[0] || {})
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('Unknown error')
    logError('Fasilitas PUT exception', error.message, 'API')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Hapus fasilitas
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID fasilitas wajib diisi' }, { status: 400 })
    }

    const { error } = await supabase
      .from('Fasilitas')
      .delete()
      .eq('id', id)

    if (error) {
      logError('Fasilitas DELETE error', error.message, 'API')
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('Unknown error')
    logError('Fasilitas DELETE exception', error.message, 'API')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}