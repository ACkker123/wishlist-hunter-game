import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface SteamButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'green' | 'blue' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function SteamButton({ variant = 'green', size = 'md', children, className = '', ...props }: SteamButtonProps) {
  const base = 'relative font-steam rounded-sm transition-all duration-150 cursor-pointer border-0 outline-none disabled:opacity-50 disabled:cursor-not-allowed'

  const variants: Record<string, string> = {
    green: 'bg-gradient-to-b from-[#a4d007] to-[#5c7e10] hover:from-[#8ab406] hover:to-[#6c9018] text-[#d2efa9] hover:text-white shadow-[0_1px_2px_rgba(0,0,0,0.3)]',
    blue: 'bg-gradient-to-b from-[#47b5f5] to-[#1a5099] hover:from-[#1e7be8] hover:to-[#1e5fba] text-[#87cef5] hover:text-white shadow-[0_1px_2px_rgba(0,0,0,0.3)]',
    secondary: 'bg-[#4a5260] hover:bg-[#3d4450] text-[#c6d4df] hover:text-white border border-[#5b6b7a]',
    danger: 'bg-gradient-to-b from-[#d9414e] to-[#b32d38] hover:from-[#e8525f] hover:to-[#c43542] text-white',
  }

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2 text-sm',
    lg: 'px-8 py-3 text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
