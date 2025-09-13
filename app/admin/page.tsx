import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function AdminDashboardPage() {
  const session = cookies().get('admin_session')
  if (!session) {
    redirect('/admin/masuk')
  }
  return (
    <main>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Dashboard admin sedang dalam pengembangan.</p>
        </div>
      </div>
    </main>
  )
} 