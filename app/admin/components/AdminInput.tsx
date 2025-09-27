"use client"

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

export default function AdminInput({ 
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
