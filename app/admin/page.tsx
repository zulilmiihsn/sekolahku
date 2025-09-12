import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './AdminDashboardClient'

export default function AdminDashboardPage() {
  const session = cookies().get('admin_session')
  if (!session) {
    redirect('/admin/masuk')
  }
  return (
    <main>
      <AdminDashboardClient />
    </main>
  )
} 