import { useEffect, useState } from 'react'

interface ScorePopupProps {
  value: number
  isPositive: boolean
  combo: number
}

export function ScorePopup({ value, isPositive, combo }: ScorePopupProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] flex items-center justify-center">
      <div className={`text-2xl font-bold animate-[scoreFloat_1.5s_ease-out_forwards] ${isPositive ? 'text-steam-positive' : 'text-steam-negative'}`}>
        {isPositive ? '+' : ''}{value > 0 ? value : Math.abs(value)}
        {combo >= 3 && (
          <span className="text-lg ml-2 animate-[comboFire_0.8s_ease-in-out_infinite] text-orange-400">
            x{combo}
          </span>
        )}
      </div>
    </div>
  )
}
