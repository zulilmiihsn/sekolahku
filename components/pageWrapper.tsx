import { ReactNode } from 'react'

interface PageWrapperProps {
  children: ReactNode
  className?: string
}

export default function PageWrapper({ children, className = "" }: PageWrapperProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-primary/5 ${className}`}>
      {children}
    </div>
  )
}
