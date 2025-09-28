import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../utils/supabaseClient'
import { generateTokenPair } from '../../utils/jwt'
import { rateLimits } from '../../utils/rateLimit'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Validation schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
})

export async function POST(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = rateLimits.login(req)
  if (rateLimitResponse) {
    return rateLimitResponse
  }
  
  try {
    const body = await req.json()
    
    // Validate input
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }
    
    const { username, password } = validationResult.data
    
    // Find user (use service role to bypass RLS for credential check)
    const { data: user, error } = await supabaseAdmin
      .from('User')
      .select('id, username, password, role, is_active')
      .eq('username', username)
      .single()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json({ error: 'Account is disabled' }, { status: 401 })
    }
    
    // Verify password
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    // Generate JWT tokens
    const tokens = generateTokenPair({
      userId: user.id,
      username: user.username,
      role: user.role
    })
    
    // Create response
    const response = NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    })
    
    // Set HTTP-only cookies for security
    response.cookies.set('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60 // 15 minutes
    })
    
    response.cookies.set('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
    
    return response
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 