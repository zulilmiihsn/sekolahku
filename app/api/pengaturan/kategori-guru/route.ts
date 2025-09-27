import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Data default kategori guru
    const kategoriGuru = [
      {
        key: 'guru',
        label: 'Guru'
      },
      {
        key: 'staff',
        label: 'Staff'
      }
    ]

    return NextResponse.json(kategoriGuru)
  } catch (error) {
    console.error('Error fetching kategori guru:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}