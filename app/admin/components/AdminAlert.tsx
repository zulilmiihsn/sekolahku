"use client"

import { ReactNode } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

interface AdminAlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  children: ReactNode
  onClose?: () => void
  className?: string
}

export default function AdminAlert({ type, children, onClose, className = "" }: AdminAlertProps) {
  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      iconColor: 'text-green-500'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-500'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-500'
    }
  }

  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${config.bgColor} ${config.borderColor} ${config.textColor} ${className}`}>
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
      <div className="flex-1">
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`p-1 hover:bg-black/10 rounded transition-colors ${config.textColor}`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
