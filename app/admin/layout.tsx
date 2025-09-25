import '../globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google'

const font = Plus_Jakarta_Sans({ subsets: ['latin'] })

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full">
      <body className={`${font.className} bg-gradient-to-b from-primary/5 via-accent/5 to-white min-h-screen text-text`}> 
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}


