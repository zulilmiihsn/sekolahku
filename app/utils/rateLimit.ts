import { NextRequest, NextResponse } from 'next/server'
import { env } from './env'

// Simple in-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  maxRequests: number = env.RATE_LIMIT_MAX,
  windowMs: number = env.RATE_LIMIT_WINDOW_MS
) {
  return (req: NextRequest): NextResponse | null => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const windowStart = now - windowMs
    
    // Clean up expired entries
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key)
      }
    }
    
    // Get current rate limit data
    const current = rateLimitMap.get(ip)
    
    if (!current) {
      // First request from this IP
      rateLimitMap.set(ip, {
        count: 1,
        resetTime: now + windowMs
      })
      return null
    }
    
    if (current.resetTime < now) {
      // Window expired, reset
      rateLimitMap.set(ip, {
        count: 1,
        resetTime: now + windowMs
      })
      return null
    }
    
    if (current.count >= maxRequests) {
      // Rate limit exceeded
      const resetTime = new Date(current.resetTime)
      return NextResponse.json(
        {
          error: 'Too many requests',
          retryAfter: Math.ceil((current.resetTime - now) / 1000)
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((current.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetTime.toISOString()
          }
        }
      )
    }
    
    // Increment count
    current.count++
    return null
  }
}

// Rate limiting for different endpoints
export const rateLimits = {
  // General API rate limit
  api: rateLimit(100, 15 * 60 * 1000), // 100 requests per 15 minutes
  
  // Login rate limit (stricter)
  login: rateLimit(5, 15 * 60 * 1000), // 5 login attempts per 15 minutes
  
  // Admin operations rate limit
  admin: rateLimit(50, 5 * 60 * 1000), // 50 admin operations per 5 minutes
}
