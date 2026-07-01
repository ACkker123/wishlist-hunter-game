import { useCallback } from 'react'
import { useGame } from '../../context/GameContext'
import { checkRule } from '../../utils/ruleChecker'
import type { GameData } from '../../types/game'
import { formatReviewScore, formatReviewScoreColor, formatNumber } from '../../utils/format'

interface ReviewSectionProps {
  game: GameData
}

export function ReviewSection({ game }: ReviewSectionProps) {
  const { selectedRule, makeConnection, connection } = useGame()

  const canConnect = selectedRule?.type === 'review_floor' && connection === null

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!canConnect || !selectedRule) return
    const result = checkRule(selectedRule, game)
    const rect = e.currentTarget.getBoundingClientRect()
    makeConnection(rect, result)
  }, [canConnect, selectedRule, game, makeConnection])
  return (
    <div className="bg-steam-card rounded-sm p-4 border border-steam-border">
      <h3 className="text-sm font-bold text-steam-text-dim uppercase tracking-wider mb-3">玩家评价</h3>

      <div className="flex items-center gap-3 mb-4">
        <span
          onClick={handleClick}
          className={`inline-flex items-center gap-3 ${canConnect ? 'rounded-sm px-3 py-1.5 -mx-3 -my-1.5 border border-dashed border-steam-accent cursor-pointer hover:bg-steam-accent/10 transition-all duration-200' : ''}`}
        >
          <span className={`text-3xl font-bold ${formatReviewScoreColor(game.reviewScore)}`}>
            {formatReviewScore(game.reviewScore)}
          </span>
          <span className="text-sm text-steam-text-dim">
            ({game.reviewScore}%)
          </span>
        </span>
        <span className="text-sm text-steam-text-dim">
          {formatNumber(game.reviewCount)} 篇评价
        </span>
      </div>

      <div className="mb-4 bg-steam-nav rounded-full h-2 overflow-hidden flex">
        <div
          className="h-full rounded-full transition-all bg-steam-positive"
          style={{ width: `${game.reviewScore}%` }}
        />
        <div
          className="h-full flex-1 bg-steam-negative"
          style={{ opacity: 0.3 }}
        />
      </div>

      <div className="flex gap-3">
        <div
          className="flex-1 bg-steam-panel rounded-sm p-3 border-l-2 border-steam-positive"
        >
          <div className="flex items-center gap-1 mb-1.5">
            <span className="text-xs text-steam-positive font-bold">👍 推荐</span>
          </div>
          <p className="text-xs text-steam-text leading-relaxed">
            {game.reviews[0]?.text || '值得一试'}
          </p>
          {game.reviews[0] && (
            <div className="text-[10px] text-steam-text-dim mt-1">
              {formatNumber(game.reviews[0].votes)} 人觉得有帮助
            </div>
          )}
        </div>

        <div
          className="flex-1 bg-steam-panel rounded-sm p-3 border-l-2 border-steam-negative"
        >
          <div className="flex items-center gap-1 mb-1.5">
            <span className="text-xs text-steam-negative font-bold">👎 不推荐</span>
          </div>
          <p className="text-xs text-steam-text leading-relaxed">
            {game.reviews[1]?.text || '需要考虑'}
          </p>
          {game.reviews[1] && (
            <div className="text-[10px] text-steam-text-dim mt-1">
              {formatNumber(game.reviews[1].votes)} 人觉得有帮助
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
