"use client"

import { motion } from 'framer-motion'

interface AdminLoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function AdminLoadingSpinner({ 
  message = "Memuat...", 
  size = 'md',
  className = "" 
}: AdminLoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-3 border-primary/20 border-t-primary rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {message && (
        <motion.p
          className={`mt-4 text-gray-600 ${textSizeClasses[size]} font-medium`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}
