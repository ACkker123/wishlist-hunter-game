import { useState } from 'react'
import { useGame } from '../../context/GameContext'

function newsGradient(item: { icon: string; title: string }): string {
  const hash = item.title.split('').reduce((s, c) => s + c.charCodeAt(0), 0)
  const h1 = hash % 360
  const h2 = (h1 + 40) % 360
  return `linear-gradient(135deg, hsl(${h1},40%,18%), hsl(${h2},30%,12%))`
}

function RedactedBars() {
  const widths = ['90%', '72%', '85%', '60%', '78%', '45%', '92%', '55%']
  return (
    <div className="space-y-3 py-2">
      {widths.map((w, i) => (
        <div
          key={i}
          className="h-2.5 rounded-sm bg-white/10"
          style={{ width: w }}
        />
      ))}
    </div>
  )
}

export function NewsBriefing() {
  const { newsItems, closeNews } = useGame()
  const [page, setPage] = useState(0)

  const total = newsItems.length
  if (total === 0) return null

  const item = newsItems[page]

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/85">
      <div className="bg-steam-card border border-steam-border rounded-sm shadow-lg w-full max-w-2xl mx-4 animate-[fadeInUp_0.3s_ease-out]">
        <div className="flex items-center justify-between p-3 border-b border-steam-border">
          <div className="flex items-center gap-1">
            <span className="text-xs text-steam-text-dim font-bold uppercase tracking-wider">
              Steam 新闻简报
            </span>
            <span className="text-xs text-steam-text-dim">
              {page + 1}/{total}
            </span>
          </div>
          <button
            onClick={closeNews}
            className="text-xs px-2 py-1 rounded-sm text-steam-text-dim hover:text-steam-text hover:bg-steam-bg-hover transition-colors"
          >
            关闭 ✕
          </button>
        </div>

        <div
          className="p-6 flex flex-col items-center justify-center min-h-[160px] select-none"
          style={{ background: newsGradient(item) }}
        >
          <span className="text-5xl mb-2">{item.icon}</span>
          <span className="text-[10px] text-white/40 uppercase tracking-wider">
            Steam News Network
          </span>
        </div>

        <div className="p-5">
          <h2 className="text-base font-bold text-steam-text leading-snug mb-4">
            {item.title}
          </h2>
          <RedactedBars />
        </div>

        <div className="flex items-center justify-between p-3 border-t border-steam-border">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className={`text-xs px-3 py-1.5 rounded-sm transition-colors ${
              page === 0
                ? 'text-steam-text-dim/30 cursor-not-allowed'
                : 'text-steam-accent hover:bg-steam-bg-hover'
            }`}
          >
            {'\u25C2'} 上一条
          </button>

          <button
            onClick={closeNews}
            className="text-xs px-3 py-1.5 rounded-sm bg-steam-accent/15 text-steam-accent hover:bg-steam-accent/25 transition-colors font-bold"
          >
            关闭并继续
          </button>

          <button
            onClick={() => setPage(p => Math.min(total - 1, p + 1))}
            disabled={page === total - 1}
            className={`text-xs px-3 py-1.5 rounded-sm transition-colors ${
              page === total - 1
                ? 'text-steam-text-dim/30 cursor-not-allowed'
                : 'text-steam-accent hover:bg-steam-bg-hover'
            }`}
          >
            下一条 {'\u25B8'}
          </button>
        </div>
      </div>
    </div>
  )
}
