import { useGame } from '../../context/GameContext'
import { formatPrice } from '../../utils/format'

export function Inventory() {
  const { player } = useGame()

  if (player.inventory.length === 0) return null

  return (
    <div className="bg-steam-panel border border-steam-border rounded-sm p-4">
      <h3 className="text-xs font-bold text-steam-text-dim uppercase tracking-wider mb-3">
        游戏库存 ({player.inventory.length})
      </h3>
      <div className="flex flex-wrap gap-2">
        {player.inventory.map(game => (
          <div
            key={game.id}
            className="flex items-center gap-2 bg-steam-nav rounded-sm p-1.5 pr-3 hover:bg-steam-bg-hover transition-colors cursor-default"
          >
            <div className="w-8 h-8 rounded-sm shrink-0 overflow-hidden">
              {game.bannerImage ? (
                <img src={game.bannerImage} alt={game.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" style={{ background: game.bannerGradient }} />
              )}
            </div>
            <div>
              <div className="text-xs text-steam-text truncate max-w-[100px]">{game.name}</div>
              <div className="text-[10px] text-steam-text-dim">{formatPrice(game.currentPrice)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
