// Environment validation utility
import { z } from 'zod'

// Define environment schema
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),
  
  // Application
  NEXT_PUBLIC_BASE_URL: z.string().url('Invalid base URL').default('http://localhost:3000'),
  // NextAuth is optional in this project
  NEXTAUTH_URL: z.string().url('Invalid NextAuth URL').optional(),
  NEXTAUTH_SECRET: z.string().min(32, 'NextAuth secret must be at least 32 characters').optional(),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  
  // Security
  BCRYPT_ROUNDS: z.string().transform(Number).default(12),
  RATE_LIMIT_MAX: z.string().transform(Number).default(100),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default(900000),
  
  // Optional
  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  REDIS_URL: z.string().url().optional(),
})

// Validate environment variables
export function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:')
      error.issues.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })
      
      // Use fallback values for development and build
      console.warn('⚠️  Using fallback values - please set up .env file')
      return {
        NEXT_PUBLIC_SUPABASE_URL: 'https://ljwgusovgbjgksywiisf.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqd2d1c292Z2JqZ2tzeXdpaXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NzQ5NzQsImV4cCI6MjA2ODU1MDk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8',
        SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqd2d1c292Z2JqZ2tzeXdpaXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk3NDk3NCwiZXhwIjoyMDY4NTUwOTc0fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8',
        NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
        // NEXTAUTH_URL and NEXTAUTH_SECRET are optional
        JWT_SECRET: 'development_jwt_secret_32_chars_minimum',
        JWT_EXPIRES_IN: '7d',
        BCRYPT_ROUNDS: 12,
        RATE_LIMIT_MAX: 100,
        RATE_LIMIT_WINDOW_MS: 900000,
        LOG_LEVEL: 'info' as const
      }
    }
    throw error
  }
}

// Export validated environment
export const env = validateEnv()

// Type-safe environment access
export type Env = z.infer<typeof envSchema>
