import { useCallback } from 'react'
import { useGame } from '../../context/GameContext'
import { checkRule } from '../../utils/ruleChecker'
import type { GameData } from '../../types/game'
import { formatPrice } from '../../utils/format'
import { DiscountBadge } from '../shared/DiscountBadge'

interface PriceInfoProps {
  game: GameData
}

export function PriceInfo({ game }: PriceInfoProps) {
  const { selectedRule, makeConnection, connection } = useGame()

  const canConnect = selectedRule?.type === 'price_cap' && connection === null

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!canConnect || !selectedRule) return
    const result = checkRule(selectedRule, game)
    const rect = e.currentTarget.getBoundingClientRect()
    makeConnection(rect, result)
  }, [canConnect, selectedRule, game, makeConnection])
  return (
    <div className="bg-steam-card rounded-sm p-4 border border-steam-border">
      <div className="flex items-end justify-between">
        <div
          onClick={handleClick}
          className={canConnect ? 'rounded-sm p-2 -m-2 border border-dashed border-steam-accent cursor-pointer hover:bg-steam-accent/10 transition-all duration-200' : ''}
        >
          <div className="text-xs text-steam-text-dim mb-1">当前价格</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-steam-text">
              {game.originalPrice > 0 ? formatPrice(game.currentPrice) : '免费'}
            </span>
            {game.originalPrice > 0 && (
              <span className="text-sm text-steam-text-dim line-through">
                {formatPrice(game.originalPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            {game.originalPrice > 0 && (
              <DiscountBadge discountPercent={game.discountPercent} />
            )}
            {game.isHistoricalLow && (
              <span className="text-xs px-2 py-0.5 rounded bg-steam-green/15 text-steam-green font-bold">
                历史最低价
              </span>
            )}
            {!game.isHistoricalLow && game.originalPrice > 0 && (
              <span className="text-xs px-2 py-0.5 rounded bg-steam-accent/15 text-steam-accent">
                史低 ¥{game.historicalLow}
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-steam-text-dim mb-1">为你节省</div>
          <div className="text-lg font-bold text-steam-positive">
            {game.originalPrice > 0
              ? formatPrice(game.originalPrice - game.currentPrice)
              : '—'}
          </div>
          {game.willDropFurther !== undefined && (
            <div className="text-[10px] text-steam-text-dim mt-1">
              史低记录: {formatPrice(game.historicalLow)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
