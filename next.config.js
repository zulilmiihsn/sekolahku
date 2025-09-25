module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'ljwgusovgbjgksywiisf.supabase.co',
      // tambahkan domain lain jika perlu
    ],
  },
  // Optimisasi bundle
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // Kompresi
  compress: true,
} 