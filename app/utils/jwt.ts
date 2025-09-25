import jwt from 'jsonwebtoken'
import { env } from './env'

export interface JWTPayload {
  userId: string
  username: string
  role: string
  iat?: number
  exp?: number
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

// Generate access token (short-lived)
export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '15m', // Short-lived for security
    issuer: 'sekolah-modern',
    audience: 'sekolah-modern-users'
  })
}

// Generate refresh token (long-lived)
export function generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d', // Use string literal instead of env variable
    issuer: 'sekolah-modern',
    audience: 'sekolah-modern-users'
  })
}

// Generate token pair
export function generateTokenPair(payload: Omit<JWTPayload, 'iat' | 'exp'>): TokenPair {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload)
  }
}

// Verify token
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: 'sekolah-modern',
      audience: 'sekolah-modern-users'
    }) as JWTPayload
    
    return decoded
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  return authHeader.substring(7) // Remove 'Bearer ' prefix
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JWTPayload
    if (!decoded || !decoded.exp) return true
    
    return Date.now() >= decoded.exp * 1000
  } catch {
    return true
  }
}
