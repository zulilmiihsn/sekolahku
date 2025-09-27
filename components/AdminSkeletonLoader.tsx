"use client"

import { motion } from 'framer-motion'

interface AdminSkeletonLoaderProps {
  lines?: number
  className?: string
}

export default function AdminSkeletonLoader({ 
  lines = 3, 
  className = "" 
}: AdminSkeletonLoaderProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className="h-4 bg-gray-200 rounded"
          style={{ width: `${100 - index * 10}%` }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  )
}
