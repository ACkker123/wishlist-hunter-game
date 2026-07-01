import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose?: () => void
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, children, className = '' }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/85"
        onClick={onClose}
      />
      <div
        className={`relative bg-steam-card border border-steam-border rounded-sm shadow-lg max-w-lg w-full mx-4 animate-[fadeInUp_0.3s_ease-out] ${className}`}
      >
        {children}
      </div>
    </div>
  )
}
