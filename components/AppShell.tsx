"use client"

import { usePathname } from 'next/navigation'
import Navbar from './navbar'
import Footer from './footer'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1 min-h-screen" role="main">
        <div className="min-h-screen">
          {children}
        </div>
        <Footer />
      </main>
    </>
  )
}