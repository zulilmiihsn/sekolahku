// Standardized cache configuration
export const CACHE_TIMES = {
  // Static content that rarely changes
  STATIC: 3600, // 1 hour
  
  // Dynamic content that changes occasionally
  DYNAMIC: 300, // 5 minutes
  
  // Real-time content that changes frequently
  REALTIME: 60, // 1 minute
  
  // User-specific content
  USER: 0, // No cache
} as const

// Cache headers for different content types
export const CACHE_HEADERS = {
  STATIC: `public, s-maxage=${CACHE_TIMES.STATIC}, stale-while-revalidate=${CACHE_TIMES.STATIC}`,
  DYNAMIC: `public, s-maxage=${CACHE_TIMES.DYNAMIC}, stale-while-revalidate=${CACHE_TIMES.DYNAMIC}`,
  REALTIME: `public, s-maxage=${CACHE_TIMES.REALTIME}, stale-while-revalidate=${CACHE_TIMES.REALTIME}`,
  USER: 'private, no-cache, no-store, must-revalidate',
} as const

// Content type to cache strategy mapping
export const CONTENT_CACHE_STRATEGY = {
  // Static content
  'site-settings': CACHE_TIMES.STATIC,
  'profil-sekolah': CACHE_TIMES.STATIC,
  'fasilitas': CACHE_TIMES.STATIC,
  'prestasi': CACHE_TIMES.STATIC,
  'ekstrakurikuler': CACHE_TIMES.STATIC,
  
  // Dynamic content
  'berita': CACHE_TIMES.DYNAMIC,
  'galeri': CACHE_TIMES.DYNAMIC,
  
  // Real-time content
  'kontak': CACHE_TIMES.REALTIME,
  'pengaturan': CACHE_TIMES.REALTIME,
} as const

// Helper function to get cache time for content type
export function getCacheTime(contentType: keyof typeof CONTENT_CACHE_STRATEGY): number {
  return CONTENT_CACHE_STRATEGY[contentType] || CACHE_TIMES.DYNAMIC
}

// Helper function to get cache headers for content type
export function getCacheHeaders(contentType: keyof typeof CONTENT_CACHE_STRATEGY): string {
  const cacheTime = getCacheTime(contentType)
  
  if (cacheTime === CACHE_TIMES.STATIC) return CACHE_HEADERS.STATIC
  if (cacheTime === CACHE_TIMES.DYNAMIC) return CACHE_HEADERS.DYNAMIC
  if (cacheTime === CACHE_TIMES.REALTIME) return CACHE_HEADERS.REALTIME
  
  return CACHE_HEADERS.USER
}
