"use client"

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface AdminCardProps {
  title: string
  description: string
  icon: LucideIcon
  children: ReactNode
  className?: string
}

export default function AdminCard({ title, description, icon: Icon, children, className = "" }: AdminCardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-primary">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
