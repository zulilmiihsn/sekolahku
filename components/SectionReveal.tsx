"use client"
import React, { useRef, useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface SectionRevealProps {
  children: React.ReactNode
  delay?: number
  stagger?: boolean
  as?: keyof JSX.IntrinsicElements | 'fragment'
  className?: string
}

export default function SectionReveal({ children, delay = 0, stagger = false, as = 'div', className }: SectionRevealProps) {
  const controls = useAnimation()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768)
    }
  }, [])

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  // Jika mobile, tampilkan langsung tanpa animasi
  if (isMobile) {
    if (Array.isArray(children)) {
      return <>{children}</>
    }
    return <>{children}</>
  }

  if (stagger && Array.isArray(children)) {
    if (as === 'fragment') {
      return (
        <>
          {children.map((child, i) => (
            <motion.div
              key={i}
              ref={i === 0 ? ref : undefined}
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 32 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.13 + delay } },
              }}
            >
              {child}
            </motion.div>
          ))}
        </>
      )
    }
    const MotionTag: any = (motion as any)[as as keyof typeof motion] || motion.div
    return (
      <MotionTag
        ref={ref}
        initial="hidden"
        animate={controls}
        className={className}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.13,
              delayChildren: delay,
            },
          },
        }}
      >
        {children.map((child, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 32 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
          >
            {child}
          </motion.div>
        ))}
      </MotionTag>
    )
  }

  const MotionTag: any = as === 'fragment' ? React.Fragment : ((motion as any)[as as keyof typeof motion] || motion.div)
  return (
    <MotionTag
      {...(as !== 'fragment' ? { ref, initial: 'hidden', animate: controls, className, variants: { hidden: { opacity: 0, y: 48 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay } } }, transition: { type: 'spring', stiffness: 60 } } : {})}
    >
      {children}
    </MotionTag>
  )
} 