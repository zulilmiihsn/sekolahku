"use client"

import { motion, useAnimation } from 'framer-motion'
import { ArrowRight, School } from 'lucide-react'
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
    <section className="relative flex flex-col items-center justify-center min-h-[90vh] overflow-hidden">
      {/* Aurora Gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        aria-hidden
        className="absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/3 w-[600px] h-[400px] -translate-x-1/2 rounded-full blur-3xl opacity-60 bg-gradient-to-tr from-primary via-accent to-purple-400 animate-aurora" />
        <div className="absolute right-1/4 top-1/2 w-[300px] h-[200px] rounded-full blur-2xl opacity-40 bg-gradient-to-tr from-accent via-primary to-blue-300 animate-aurora2" />
      </motion.div>
      <div className="transform -translate-y-10">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-5xl md:text-6xl font-extrabold text-center tracking-tight leading-tight mb-4 drop-shadow-xl"
          style={{ fontVariationSettings: '"wght" 800' }}
        >
          Selamat Datang di{' '}
          <span className="bg-gradient-to-tr from-primary via-accent to-primary bg-clip-text text-transparent">
            {siteName}
          </span>
        </motion.h1>
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-6 text-lg md:text-xl text-center text-text/80 max-w-md md:max-w-2xl px-4 md:px-0 mx-auto"
        >
          Website profil sekolah dengan desain elegan, animasi modern, dan pengalaman pengguna terbaik.
        </motion.p>
        <div className="flex justify-center mt-10">
          <motion.a
            href="#profil"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-accent transition-colors duration-200 relative inline-flex items-center"
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
          >
          Lihat Profil Sekolah
            <motion.span
              className="absolute -top-2 -right-2 bg-white/90 rounded-full shadow-lg p-1 flex items-center justify-center z-10"
              animate={controls}
              initial={{ y: 0, rotate: 0 }}
              style={{ originX: 0.5, originY: 0.5 }}
            >
              <School className="w-6 h-6 text-primary" />
            </motion.span>
          </motion.a>
        </div>
      </div>
    </section>
  )
} 