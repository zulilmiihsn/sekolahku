import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/supabaseClient'

// GET: Ambil semua program
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Program')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Program GET error:', error.message)
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Program GET exception:', error)
    return NextResponse.json([])
  }
}

// POST: Tambah program baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nama, deskripsi, kategori, durasi, target, manfaat, persyaratan, biaya, aktif } = body

    const { data, error } = await supabase
      .from('Program')
      .insert([{
        nama,
        deskripsi,
        kategori,
        durasi,
        target,
        manfaat: Array.isArray(manfaat) ? manfaat : [],
        persyaratan: Array.isArray(persyaratan) ? persyaratan : [],
        biaya: biaya || 0,
        aktif: aktif !== false
      }])
      .select()

    if (error) {
      logError('Program POST error', error.message, 'API')
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data?.[0] || {})
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('Unknown error')
    logError('Program POST exception', error.message, 'API')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT: Update program
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updateData } = body

    const { data, error } = await supabase
      .from('Program')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      logError('Program PUT error', error.message, 'API')
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data?.[0] || {})
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('Unknown error')
    logError('Program PUT exception', error.message, 'API')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Hapus program
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID program wajib diisi' }, { status: 400 })
    }

    const { error } = await supabase
      .from('Program')
      .delete()
      .eq('id', id)

    if (error) {
      logError('Program DELETE error', error.message, 'API')
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('Unknown error')
    logError('Program DELETE exception', error.message, 'API')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
