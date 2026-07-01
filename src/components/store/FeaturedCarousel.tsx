import { useState, useEffect, useCallback } from 'react'
import type { GameData } from '../../types/game'
import { DiscountBadge } from '../shared/DiscountBadge'

interface FeaturedCarouselProps {
  games: GameData[]
  onGameClick?: (game: GameData) => void
}

export function FeaturedCarousel({ games, onGameClick }: FeaturedCarouselProps) {
  const [idx, setIdx] = useState(0)

  const items = games.slice(0, 3)
  const max = items.length

  const next = useCallback(() => setIdx(p => (p + 1) % max), [max])
  const prev = useCallback(() => setIdx(p => (p - 1 + max) % max), [max])

  useEffect(() => {
    if (max <= 1) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next, max])

  if (max === 0) return null

  const game = items[idx]

  return (
    <div className="relative rounded-sm overflow-hidden border border-steam-border" style={{ height: 280 }}>
      {game.bannerImage ? (
        <img src={game.bannerImage} alt={game.name} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0" style={{ background: game.bannerGradient }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h2 className="text-xl font-bold text-white mb-1">{game.name}</h2>
        <p className="text-sm text-white/70 mb-3 line-clamp-2">{game.description}</p>
        <div className="flex items-center gap-3">
          {game.originalPrice > 0 && <DiscountBadge discountPercent={game.discountPercent} />}
          <span className="text-lg font-bold text-[#d2efa9]">
            {game.originalPrice > 0 ? `¥${game.currentPrice}` : '免费'}
          </span>
          {onGameClick && (
            <button
              onClick={() => onGameClick(game)}
              className="ml-auto px-4 py-1.5 rounded-sm bg-steam-accent/20 text-steam-accent text-sm font-bold hover:bg-steam-accent/30 transition-colors border border-steam-accent/40"
            >
              查看详情
            </button>
          )}
        </div>
      </div>

      {max > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-sm bg-black/50 hover:bg-black/80 flex items-center justify-center text-white text-lg transition-colors"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-sm bg-black/50 hover:bg-black/80 flex items-center justify-center text-white text-lg transition-colors"
          >
            ›
          </button>
          <div className="absolute bottom-4 right-6 flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-steam-accent' : 'bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
