import type { ReactNode } from 'react'

interface SteamCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function SteamCard({ children, className = '', onClick }: SteamCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-steam-card rounded-sm border border-[#2a475e] ${onClick ? 'cursor-pointer hover:border-steam-accent/40' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
