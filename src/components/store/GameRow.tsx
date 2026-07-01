import { useRef, useState, useEffect } from 'react'
import type { GameData } from '../../types/game'
import { GameCard } from './GameCard'

interface GameRowProps {
  title: string
  games: GameData[]
  onGameClick?: (game: GameData) => void
  statusFn?: (game: GameData) => React.ReactNode
}

export function GameRow({ title, games, onGameClick, statusFn }: GameRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    updateScroll()
  }, [games])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' })
  }

  if (games.length === 0) return null

  return (
    <div>
      <h3 className="text-sm font-bold text-steam-text uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="relative group">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-8 bg-black/60 hover:bg-black/80 flex items-center justify-center text-white text-lg transition-opacity opacity-0 group-hover:opacity-100"
          >
            ‹
          </button>
        )}
        <div
          ref={scrollRef}
          onScroll={updateScroll}
          className="flex gap-3 overflow-x-auto pb-1 scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {games.map(game => (
            <GameCard
              key={game.id}
              game={game}
              onClick={onGameClick ? () => onGameClick(game) : undefined}
              statusBadge={statusFn ? statusFn(game) : undefined}
            />
          ))}
        </div>
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 w-8 bg-black/60 hover:bg-black/80 flex items-center justify-center text-white text-lg transition-opacity opacity-0 group-hover:opacity-100"
          >
            ›
          </button>
        )}
      </div>
    </div>
  )
}
