// Utility functions untuk API calls yang aman
import { logError } from './logger'

export async function fetchSiteName(revalidateSeconds: number = 300) {
  try {
    // Di server component, gunakan URL absolut
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/pengaturan/nama-situs`, { 
      next: { revalidate: revalidateSeconds },
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const data = await res.json()
    return data.site_name || 'Sekolah Modern'
  } catch (error) {
    logError('Error fetching site name', error, 'API')
    return 'Sekolah Modern'
  }
}

export async function fetchBerita() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/berita`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    return await res.json()
  } catch (error) {
    console.error('Error fetching berita:', error)
    return []
  }
}

// Fungsi untuk mengambil nama sekolah
export async function getSiteName(): Promise<string> {
  try {
    const response = await fetch('/api/pengaturan/nama-situs');
    const data = await response.json();
    return data.site_name || 'Sekolah Modern';
  } catch (error) {
    console.error('Error fetching site name:', error);
    return 'Sekolah Modern';
  }
}

// Fungsi untuk client-side fetch nama sekolah
export async function clientFetchSiteName(): Promise<string> {
  try {
    // Skip fetch saat build time untuk menghindari ECONNREFUSED
    if (typeof window === 'undefined') {
      return 'Sekolah Modern';
    }
    
    const response = await fetch('/api/pengaturan/nama-situs');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.site_name || 'Sekolah Modern';
  } catch (error) {
    // Tidak log error untuk menghindari spam di console
    return 'Sekolah Modern';
  }
}

export async function clientFetchBerita() {
  try {
    const res = await fetch('/api/berita')
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    return await res.json()
  } catch (error) {
    console.error('Error fetching berita:', error)
    return []
  }
} 