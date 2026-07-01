import type { GameData } from '../../types/game'
import { DiscountBadge } from '../shared/DiscountBadge'

interface GameCardProps {
  game: GameData
  onClick?: () => void
  statusBadge?: React.ReactNode
}

export function GameCard({ game, onClick, statusBadge }: GameCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-steam-card rounded-sm border border-steam-border overflow-hidden shrink-0 transition-colors ${onClick ? 'cursor-pointer hover:border-steam-accent/50 hover:bg-steam-bg-hover' : ''}`}
      style={{ width: 160 }}
    >
      <div className="h-[120px] relative overflow-hidden">
        {game.bannerImage ? (
          <img src={game.bannerImage} alt={game.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white/20" style={{ background: game.bannerGradient }}>
            {game.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-2">
        <div className="text-xs text-steam-text truncate font-bold">{game.name}</div>
        <div className="text-[10px] text-steam-text-dim mt-0.5 truncate">
          {game.tags.slice(0, 2).join(' · ')}
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          {game.originalPrice > 0 && <DiscountBadge discountPercent={game.discountPercent} />}
          <span className="text-xs text-steam-text-dim">
            {game.originalPrice > 0 ? `¥${game.currentPrice}` : '免费'}
          </span>
        </div>
        {statusBadge && <div className="mt-1">{statusBadge}</div>}
      </div>
    </div>
  )
}
