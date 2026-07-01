import { useCallback } from 'react'
import { useGame } from '../../context/GameContext'
import { checkRule } from '../../utils/ruleChecker'
import type { GameData } from '../../types/game'

interface DeveloperCardProps {
  developer: string
  developerRating: number
  game: GameData
}

export function DeveloperCard({ developer, developerRating, game }: DeveloperCardProps) {
  const { selectedRule, makeConnection, connection } = useGame()

  const canConnect = selectedRule?.type === 'developer_ban' && connection === null

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!canConnect || !selectedRule) return
    const result = checkRule(selectedRule, game)
    const rect = e.currentTarget.getBoundingClientRect()
    makeConnection(rect, result)
  }, [canConnect, selectedRule, game, makeConnection])
  const getColor = (rating: number) => {
    if (rating >= 80) return 'text-steam-positive'
    if (rating >= 50) return 'text-steam-mixed'
    return 'text-steam-negative'
  }

  const getLabel = (rating: number) => {
    if (rating >= 90) return '顶级开发商'
    if (rating >= 80) return '优秀开发商'
    if (rating >= 60) return '良好开发商'
    if (rating >= 40) return '一般开发商'
    return '差评开发商'
  }

  return (
    <div
      onClick={handleClick}
      className={`bg-steam-card rounded-sm p-3 border flex items-center gap-3 transition-all duration-200 ${canConnect ? 'border-steam-accent border-dashed cursor-pointer hover:bg-steam-accent/10 hover:shadow-[0_0_12px_rgba(102,192,244,0.3)]' : 'border-steam-border'}`}
    >
      <div className="w-10 h-10 rounded-sm bg-steam-panel flex items-center justify-center text-steam-text-dim font-bold text-lg">
        🏢
      </div>
      <div>
        <div className="text-sm text-steam-text font-bold">{developer}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="w-20 h-1.5 bg-steam-nav rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${developerRating}%`,
                background: developerRating >= 80
                  ? '#6dc849'
                  : developerRating >= 50
                  ? '#c29843'
                  : '#d9414e',
              }}
            />
          </div>
          <span className={`text-xs ${getColor(developerRating)}`}>
            {developerRating}/100 · {getLabel(developerRating)}
          </span>
        </div>
      </div>
    </div>
  )
}
