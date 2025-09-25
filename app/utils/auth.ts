import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader, JWTPayload } from './jwt'
import { supabase } from './supabaseClient'

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload
}

// Middleware untuk memverifikasi JWT token
export async function authenticateToken(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader || undefined)
    
    if (!token) {
      return null
    }
    
    const payload = verifyToken(token)
    if (!payload) {
      return null
    }
    
    // Optional: Verify user still exists in database
    const { data: user, error } = await supabase
      .from('User')
      .select('id, username, role, is_active')
      .eq('id', payload.userId)
      .single()
    
    if (error || !user || !user.is_active) {
      return null
    }
    
    return payload
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

// Middleware untuk protect admin routes
export async function requireAdmin(request: NextRequest): Promise<JWTPayload | null> {
  const user = await authenticateToken(request)
  
  if (!user || user.role !== 'admin') {
    return null
  }
  
  return user
}

// Helper untuk create unauthorized response
export function createUnauthorizedResponse(message: string = 'Unauthorized') {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  )
}

// Helper untuk create forbidden response
export function createForbiddenResponse(message: string = 'Forbidden') {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  )
}

// Helper untuk create error response
export function createErrorResponse(message: string, status: number = 500) {
  return NextResponse.json(
    { error: message },
    { status }
  )
}
