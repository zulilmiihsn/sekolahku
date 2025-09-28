import './globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { ProviderAnimasiHalaman } from '../components/animasiHalaman'
import { fetchSiteName } from './utils/api'
import { ErrorBoundary } from '../components/errorBoundary.tsx'
import AppShell from '../components/appShell.tsx'

const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })

export async function generateMetadata() {
  // Ambil nama sekolah dari database dengan fallback
  try {
    const siteName = await fetchSiteName(600)
    return {
      title: siteName,
      description: `Website profil ${siteName} yang elegan dan profesional`,
    }
  } catch (error) {
    // Fallback jika fetch gagal
    return {
      title: 'Sekolah Modern',
      description: 'Website profil sekolah yang elegan dan profesional',
    }
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full">
      <body className={`${plusJakarta.className} bg-background text-text min-h-screen flex flex-col`}>
        <ErrorBoundary>
          <ProviderAnimasiHalaman>
            <AppShell>
              {children}
            </AppShell>
          </ProviderAnimasiHalaman>
        </ErrorBoundary>
      </body>
    </html>
  )
} 