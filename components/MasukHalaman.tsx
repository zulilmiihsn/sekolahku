"use client"

export default function PageEnter({ children }: { children: React.ReactNode }) {
  return (
    <div className="opacity-0 animate-page-enter">
      {children}
    </div>
  );
} 