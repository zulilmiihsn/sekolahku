import React from "react";

export default function NoPhotoPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full aspect-video rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-100 via-green-50 to-green-100 border border-gray-200 ${className}`}
    >
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="16" width="48" height="32" rx="6" fill="#e5e7eb" />
        <rect x="8" y="16" width="48" height="32" rx="6" stroke="#6ee7b7" strokeWidth="2" />
        <circle cx="22" cy="32" r="5" fill="#a7f3d0" />
        <path d="M16 44L28 32L40 44H16Z" fill="#d1fae5" />
        <path d="M32 28L44 40" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
} 