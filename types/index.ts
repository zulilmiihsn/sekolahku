// Core data types for the application

export interface Berita {
  id: number
  judul: string
  deskripsi: string
  gambar?: string
  tanggal: string
  konten: string
  created_at?: string
  updated_at?: string
}

export interface GaleriItem {
  id: number
  judul: string
  deskripsi: string
  foto: string[]
  kategori: string
  tanggal: string
  created_at?: string
  updated_at?: string
}

export interface ProfilSekolah {
  id: number
  nama_sekolah: string
  deskripsi: string
  visi: string
  misi: string
  sejarah: string
  alamat: string
  telepon: string
  email: string
  website?: string
  logo?: string
  foto_sekolah?: string[]
  created_at?: string
  updated_at?: string
}

export interface ProgramUnggulan {
  id: number
  judul: string
  deskripsi: string
  icon?: string
  created_at?: string
  updated_at?: string
}

export interface Fasilitas {
  id: number
  nama: string
  deskripsi: string
  foto?: string
  kategori: string
  created_at?: string
  updated_at?: string
}

export interface Prestasi {
  id: number
  judul: string
  deskripsi: string
  foto?: string
  kategori: string
  tahun: number
  created_at?: string
  updated_at?: string
}

export interface Ekstrakurikuler {
  id: number
  nama: string
  deskripsi: string
  foto?: string
  pembina?: string
  jadwal?: string
  created_at?: string
  updated_at?: string
}

export interface Kontak {
  id: number
  nama: string
  email?: string
  telepon?: string
  alamat?: string
  created_at?: string
  updated_at?: string
}

export interface Setting {
  id: number
  key: string
  value: string
  description?: string
  created_at?: string
  updated_at?: string
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface BeritaForm {
  judul: string
  deskripsi: string
  konten: string
  gambar?: File
}

export interface GaleriForm {
  judul: string
  deskripsi: string
  foto: File[]
  kategori: string
}

// User types
export interface User {
  id: string
  email: string
  name?: string
  role: 'admin' | 'user'
  created_at?: string
  updated_at?: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

// Component props types
export interface SectionProps {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: any) => void
}

// Utility types
export type ContentType = keyof typeof import('../app/utils/cache').CONTENT_CACHE_STRATEGY

export type SortOrder = 'asc' | 'desc'

export interface SortConfig {
  field: string
  order: SortOrder
}

export interface FilterConfig {
  field: string
  value: string | number | boolean
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'like' | 'in'
}
