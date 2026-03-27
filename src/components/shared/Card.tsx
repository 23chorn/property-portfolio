import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-stone-800 rounded-xl p-6 shadow-lg ${className}`}>
      {children}
    </div>
  )
}
