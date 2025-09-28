import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/supabaseClient'
import { logError } from '@/app/utils/logger'

// GET: Ambil semua guru dan staff
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Guru')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      if (!error.message.includes('Could not find the table')) {
        logError('Guru GET error', error.message, 'API')
      }
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('Unknown error')
    logError('Guru GET exception', error.message, 'API')
    return NextResponse.json([])
  }
}

// POST: Tambah guru/staff baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nama, jabatan, foto, kategori } = body

    const { data, error } = await supabase
      .from('Guru')
      .insert([{
        nama,
        jabatan,
        foto: foto || '',
        kategori: kategori || 'guru'
      }])
      .select()

    if (error) {
      logError('Guru POST error', error.message, 'API')
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data?.[0] || {})
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('Unknown error')
    logError('Guru POST exception', error.message, 'API')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT: Update guru/staff
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updateData } = body

    const { data, error } = await supabase
      .from('Guru')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      logError('Guru PUT error', error.message, 'API')
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data?.[0] || {})
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('Unknown error')
    logError('Guru PUT exception', error.message, 'API')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Hapus guru/staff
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID guru/staff wajib diisi' }, { status: 400 })
    }

    const { error } = await supabase
      .from('Guru')
      .delete()
      .eq('id', id)

    if (error) {
      logError('Guru DELETE error', error.message, 'API')
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('Unknown error')
    logError('Guru DELETE exception', error.message, 'API')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
