import { ReactNode } from 'react'

interface SectionWrapperProps {
  children: ReactNode
  className?: string
}

export default function SectionWrapper({ children, className = "" }: SectionWrapperProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}
