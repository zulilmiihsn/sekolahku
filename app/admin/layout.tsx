import '../globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google'

const font = Plus_Jakarta_Sans({ subsets: ['latin'] })

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen bg-gray-50">
      {children}
    </div>
  )
}


