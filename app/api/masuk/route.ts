import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/SupabaseClient'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  const { data: user, error } = await supabase.from('User').select('*').eq('username', username).single()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // Session sederhana: set cookie
  const session = Buffer.from(`${user.id}:${user.username}:${user.role}`).toString('base64')
  const res = NextResponse.json({ success: true })
  res.cookies.set('admin_session', session, { httpOnly: true, path: '/', maxAge: 60 * 60 * 8 })
  return res
} 