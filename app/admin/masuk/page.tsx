"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch("/api/masuk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    if (res.ok) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAdmin', 'true')
      }
      router.push("/admin")
    } else {
      setError("Username atau password salah!")
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm flex flex-col gap-5 border border-white/60">
        <h1 className="text-2xl font-bold text-primary mb-2 text-center">Login Admin</h1>
        <input type="text" placeholder="Username" className="p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" className="p-3 rounded-lg border border-primary/30 focus:ring-2 focus:ring-accent outline-none" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button type="submit" className="mt-2 px-6 py-3 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-accent transition-colors duration-200" disabled={loading}>{loading ? "Memproses..." : "Login"}</button>
      </form>
    </main>
  )
} 