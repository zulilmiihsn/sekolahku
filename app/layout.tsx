import './globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Footer from '../components/Footer'
import PageTransitionProvider from '../components/PageTransition'
import { fetchSiteName } from './utils/api'
import Navbar from '@/components/Navbar'

const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })

export async function generateMetadata() {
  // Ambil nama sekolah dari database
  const siteName = await fetchSiteName(600)
  return {
    title: siteName,
    description: `Website profil ${siteName} yang elegan dan profesional`,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${plusJakarta.className} bg-background text-text`}>
        <Navbar />
        <PageTransitionProvider>
          <main>
            {children}
            <Footer />
          </main>
        </PageTransitionProvider>
      </body>
    </html>
  )
} 