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
  // CSS optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Force CSS to be loaded properly
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        test: /\.(css|scss)$/,
        chunks: 'all',
        enforce: true,
      }
    }
    return config
  },
  // Force CSS to be loaded on every page
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
  // Force CSS to be loaded properly
  async rewrites() {
    return [
      {
        source: '/_next/static/css/:path*',
        destination: '/_next/static/css/:path*',
      },
    ]
  },
} 