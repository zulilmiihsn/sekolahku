"use client"

import { ReactNode, createContext, useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PageTransitionContextProps {
  showOverlay: () => void
}

const PageTransitionContext = createContext<PageTransitionContextProps>({ showOverlay: () => {} })

export function usePageTransition() {
  return useContext(PageTransitionContext)
}

export default function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState(false)

  const showOverlay = () => {
    setOverlay(true)
    setTimeout(() => setOverlay(false), 400)
  }

  return (
    <PageTransitionContext.Provider value={{ showOverlay }}>
      <AnimatePresence>
        {overlay && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'linear' }}
            className="fixed inset-0 z-[99999] bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>
      {children}
    </PageTransitionContext.Provider>
  )
} 