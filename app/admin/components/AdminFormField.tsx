"use client"

import { ReactNode } from 'react'

interface AdminFormFieldProps {
  label: string
  required?: boolean
  children: ReactNode
  className?: string
}

export default function AdminFormField({ label, required = false, children, className = "" }: AdminFormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}
