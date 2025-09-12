// Utility functions untuk API calls yang aman

export async function fetchSiteName(revalidateSeconds: number = 300) {
  try {
    // Di server component, gunakan URL absolut
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/pengaturan/site-name`, { 
      next: { revalidate: revalidateSeconds },
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const data = await res.json()
    return data.value || data.site_name || 'Sekolah Modern'
  } catch (error) {
    console.error('Error fetching site name:', error)
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
    const response = await fetch('/api/pengaturan/site-name');
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
    const response = await fetch('/api/pengaturan/site-name');
    const data = await response.json();
    return data.site_name || 'Sekolah Modern';
  } catch (error) {
    console.error('Error fetching site name:', error);
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