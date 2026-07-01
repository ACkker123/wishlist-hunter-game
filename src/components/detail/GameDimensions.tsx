import { useCallback } from 'react'
import { useGame } from '../../context/GameContext'
import { checkRule } from '../../utils/ruleChecker'
import type { GameData } from '../../types/game'

interface GameDimensionsProps {
  game: GameData
}

export function GameDimensions({ game }: GameDimensionsProps) {
  const dims = game.dimensions
  if (!dims) return null

  return (
    <div className="bg-steam-card rounded-sm p-4 border border-steam-border">
      <h3 className="text-sm font-bold text-steam-text-dim uppercase tracking-wider mb-3">
        {'\u{1F4CA}'} 维度分析
      </h3>

      <div className="space-y-3">
        <DimBar label="游戏性" dimKey="gameplay" value={dims.gameplay} suffix={`${dims.gameplay}/100`} color="#66c0f4" game={game} />
        <DimBar label="内容丰富度" dimKey="contentDepth" value={dims.contentDepth} suffix={`${dims.contentDepth}/100`} color="#a4d007" game={game} />
        <DimBar label="完成度" dimKey="polish" value={dims.polish} suffix={`${dims.polish}/100`} color="#6dc849" game={game} />
        <DimBar label="性价比" dimKey="valueForMoney" value={dims.valueForMoney} suffix={`${dims.valueForMoney}/100`} color="#c29843" game={game} />
      </div>
    </div>
  )
}

function DimBar({ label, dimKey, value, suffix, color, game }: {
  label: string
  dimKey: string
  value: number
  suffix: string
  color: string
  game: GameData
}) {
  const { selectedRule, makeConnection, connection } = useGame()

  const canConnect =
    selectedRule?.type === 'dimension_min' &&
    selectedRule.dimension === dimKey &&
    connection === null

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!canConnect || !selectedRule) return
    const result = checkRule(selectedRule, game)
    const rect = e.currentTarget.getBoundingClientRect()
    makeConnection(rect, result)
  }, [canConnect, selectedRule, game, makeConnection])
  return (
    <div
      onClick={handleClick}
      className={canConnect ? 'rounded-sm p-2 -m-2 border border-dashed border-steam-accent cursor-pointer hover:bg-steam-accent/10 transition-all duration-200' : ''}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-steam-text">{label}</span>
        <span className="text-xs text-steam-text-dim font-mono">{suffix}</span>
      </div>
      <div className="h-1.5 bg-steam-nav rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, value)}%`, background: color }}
        />
      </div>
    </div>
  )
}
