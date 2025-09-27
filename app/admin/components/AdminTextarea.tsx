"use client"

interface AdminTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  rows?: number
  className?: string
}

export default function AdminTextarea({ 
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
