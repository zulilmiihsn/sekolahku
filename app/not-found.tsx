export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-7xl font-extrabold text-primary mb-4">404</h1>
      <p className="text-xl text-text/80 mb-8">Halaman tidak ditemukan.</p>
      <a href="/" className="px-6 py-3 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-accent transition-colors duration-200">Kembali ke Beranda</a>
    </main>
  )
} 