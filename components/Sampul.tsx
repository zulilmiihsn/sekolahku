"use client"

import { motion, useAnimation } from 'framer-motion'
import { School } from 'lucide-react'
import { useState, useEffect } from 'react'
import { clientFetchSiteName } from '../app/utils/api'

export default function Hero() {
  const [hovered, setHovered] = useState(false)
  const [siteName, setSiteName] = useState('Sekolah Modern')
  const controls = useAnimation()

  useEffect(() => {
    clientFetchSiteName().then(setSiteName)
  }, [])

  const handleHoverStart = () => {
    setHovered(true)
    controls.start({
      y: [-4, -36, 0],
      rotate: [0, 360, 0],
      transition: {
        times: [0, 0.6, 1],
        duration: 0.8,
        ease: 'easeInOut',
      },
    })
  }
  const handleHoverEnd = () => {
    setHovered(false)
    controls.stop()
    controls.set({ y: 0, rotate: 0 })
  }

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[85vh] sm:min-h-[90vh] overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Aurora Gradient */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ zIndex: -1 }}
      >
        <div 
          className="absolute left-1/2 top-1/3 w-[400px] sm:w-[600px] h-[250px] sm:h-[400px] -translate-x-1/2 rounded-full blur-3xl opacity-60 bg-gradient-to-tr from-primary via-accent to-purple-400 animate-aurora" 
          style={{ 
            background: 'linear-gradient(to top right, #005A9C, #00C49A, #c084fc)',
            zIndex: -1
          }}
        />
        <div 
          className="absolute right-1/4 top-1/2 w-[200px] sm:w-[300px] h-[120px] sm:h-[200px] rounded-full blur-2xl opacity-40 bg-gradient-to-tr from-accent via-primary to-blue-300 animate-aurora2" 
          style={{ 
            background: 'linear-gradient(to top right, #00C49A, #005A9C, #93c5fd)',
            zIndex: -1
          }}
        />
      </div>
      
      <div className="transform -translate-y-5 sm:-translate-y-10 max-w-6xl mx-auto text-center">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4 sm:mb-6 drop-shadow-xl"
          style={{ fontVariationSettings: '"wght" 800' }}
        >
          <span className="block">Selamat Datang di</span>
          <span className="bg-gradient-to-tr from-primary via-accent to-primary bg-clip-text text-transparent">
            {siteName}
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-center text-text/80 max-w-sm sm:max-w-md md:max-w-2xl mx-auto leading-relaxed"
        >
          Website profil sekolah dengan desain elegan, animasi modern, dan pengalaman pengguna terbaik.
        </motion.p>
        
        <div className="flex justify-center mt-8 sm:mt-10">
          <motion.a
            href="/tentang"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-accent transition-colors duration-200 relative inline-flex items-center text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
            aria-label="Pelajari lebih lanjut tentang sekolah kami"
          >
            Tentang Kami
            <motion.span
              className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-white/90 rounded-full shadow-lg p-1 flex items-center justify-center z-10"
              animate={controls}
              initial={{ y: 0, rotate: 0 }}
              style={{ originX: 0.5, originY: 0.5 }}
              aria-hidden="true"
            >
              <School className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
            </motion.span>
          </motion.a>
        </div>
      </div>
    </section>
  )
} 