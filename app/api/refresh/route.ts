import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, generateAccessToken } from '../../utils/jwt'
import { supabase } from '../../utils/supabaseClient'

export async function POST(req: NextRequest) {
  try {
    // Get refresh token from cookies
    const refreshToken = req.cookies.get('refresh_token')?.value
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not found' },
        { status: 401 }
      )
    }
    
    // Verify refresh token
    const payload = verifyToken(refreshToken)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      )
    }
    
    // Verify user still exists and is active
    const { data: user, error } = await supabase
      .from('User')
      .select('id, username, role, is_active')
      .eq('id', payload.userId)
      .single()
    
    if (error || !user || !user.is_active) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      )
    }
    
    // Generate new access token
    const newAccessToken = generateAccessToken({
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
    
    // Set new access token cookie
    response.cookies.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60 // 15 minutes
    })
    
    return response
    
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
