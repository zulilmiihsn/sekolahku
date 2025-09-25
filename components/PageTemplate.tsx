"use client"

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import PageEnter from './masukHalaman'
import SectionReveal from './sectionReveal'

interface PageTemplateProps {
  title: string
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl' | '6xl' | '7xl'
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl'
}

export default function PageTemplate({ 
  title, 
  children, 
  className = '', 
  maxWidth = '5xl' 
}: PageTemplateProps) {
  return (
    <PageEnter>
      <main className={`min-h-[90vh] flex flex-col justify-center ${className}`}>
        <div className={`${maxWidthClasses[maxWidth]} mx-auto py-24 px-4 md:px-6 lg:px-8`}>
          {/* Hero Section */}
          <SectionReveal>
            <div className="text-center mb-16">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-6"
              >
                {title}
              </motion.h1>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"
              />
            </div>
          </SectionReveal>

          {/* Content */}
          <SectionReveal delay={0.2}>
            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 p-8 md:p-12">
              {children}
            </div>
          </SectionReveal>
        </div>
      </main>
    </PageEnter>
  )
}

// Komponen untuk section dalam halaman
export function PageSection({ 
  title, 
  children, 
  className = '' 
}: { 
  title?: string
  children: ReactNode
  className?: string 
}) {
  return (
    <section className={`mb-12 ${className}`}>
      {title && (
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
          {title}
        </h2>
      )}
      <div className="text-text/80 leading-relaxed">
        {children}
      </div>
    </section>
  )
}

// Komponen untuk card
export function PageCard({ 
  children, 
  className = '',
  hover = true 
}: { 
  children: ReactNode
  className?: string
  hover?: boolean 
}) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
      className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 p-6 transition-all duration-300 ${hover ? 'hover:shadow-xl' : ''} ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Komponen untuk grid
export function PageGrid({ 
  children, 
  cols = 3,
  gap = 6,
  className = '' 
}: { 
  children: ReactNode
  cols?: 1 | 2 | 3 | 4
  gap?: 4 | 6 | 8
  className?: string 
}) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }
  
  const gapClasses = {
    4: 'gap-4',
    6: 'gap-6', 
    8: 'gap-8'
  }

  return (
    <div className={`grid ${gridCols[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  )
}

// Komponen untuk empty state
export function EmptyState({ 
  message = "Belum ada data yang tersedia.",
  icon,
  className = '' 
}: { 
  message?: string
  icon?: ReactNode
  className?: string 
}) {
  return (
    <div className={`text-center py-16 ${className}`}>
      {icon && (
        <div className="mb-4 flex justify-center">
          {icon}
        </div>
      )}
      <p className="text-text/60 text-lg">{message}</p>
    </div>
  )
}
