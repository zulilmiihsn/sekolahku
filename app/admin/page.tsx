import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './adminDashboardClient'

export default function AdminDashboardPage() {
  const session = cookies().get('access_token')
  if (!session) {
    redirect('/admin/masuk')
  }
  return <AdminDashboardClient />
} 