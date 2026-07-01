interface ProgressBarProps {
  value: number
  max: number
  label?: string
  color?: string
}

export function ProgressBar({ value, max, label, color = '#6dc849' }: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0

  return (
    <div className="w-full">
      {label && <div className="text-xs text-steam-text-dim mb-1">{label}</div>}
      <div className="h-2 bg-steam-nav rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
