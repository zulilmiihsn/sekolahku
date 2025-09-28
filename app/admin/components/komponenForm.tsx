"use client"

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

// ===== ADMIN BUTTON =====
interface AdminButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'success'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: LucideIcon
  className?: string
}

export function AdminButton({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  className = ""
}: AdminButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 focus:ring-primary disabled:bg-gray-300 shadow-lg hover:shadow-xl transform hover:scale-105",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 disabled:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 disabled:bg-gray-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 disabled:bg-gray-50",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-green-500 shadow-lg hover:shadow-xl transform hover:scale-105"
  }
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  )
}

// ===== ADMIN CARD =====
interface AdminCardProps {
  title: string
  description: string
  icon: LucideIcon
  children: ReactNode
  className?: string
}

export function AdminCard({ title, description, icon: Icon, children, className = "" }: AdminCardProps) {
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

// ===== ADMIN INPUT =====
interface AdminInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel'
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  min?: number
  max?: number
  step?: number
  className?: string
}

export function AdminInput({ 
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  min,
  max,
  step,
  className = ""
}: AdminInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      min={min}
      max={max}
      step={step}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 ${className}`}
    />
  )
}

// ===== ADMIN TEXTAREA =====
interface AdminTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  rows?: number
  className?: string
}

export function AdminTextarea({ 
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  rows = 3,
  className = ""
}: AdminTextareaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      rows={rows}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-vertical ${className}`}
    />
  )
}

// ===== ADMIN SELECT =====
interface AdminSelectOption {
  value: string
  label: string
}

interface AdminSelectProps {
  value: string
  onChange: (value: string) => void
  options: AdminSelectOption[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

export function AdminSelect({ 
  value,
  onChange,
  options,
  placeholder = "Pilih opsi",
  disabled = false,
  required = false,
  className = ""
}: AdminSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required={required}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

// ===== ADMIN FORM FIELD =====
interface AdminFormFieldProps {
  label: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function AdminFormField({ label, required = false, children, className = "" }: AdminFormFieldProps) {
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
