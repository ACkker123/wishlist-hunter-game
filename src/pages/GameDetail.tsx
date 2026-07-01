import { useEffect, useRef, useState } from 'react'
import { TopNav } from '../components/store/TopNav'
import { GameBanner } from '../components/detail/GameBanner'
import { PriceInfo } from '../components/detail/PriceInfo'
import { PriceChart } from '../components/detail/PriceChart'
import { ReviewSection } from '../components/detail/ReviewSection'
import { TagCloud } from '../components/detail/TagCloud'
import { DeveloperCard } from '../components/detail/DeveloperCard'
import { GameDimensions } from '../components/detail/GameDimensions'
import { SteamButton } from '../components/shared/SteamButton'
import { ConnectorOverlay } from '../components/connector/ConnectorOverlay'
import { useGame } from '../context/GameContext'
import { formatCombo } from '../utils/format'

function diffLabel(d: string) {
  if (d === 'easy') return { text: '新手', color: '#6dc849' }
  if (d === 'medium') return { text: '进阶级', color: '#c29843' }
  return { text: '噩梦', color: '#d9414e' }
}

export function GameDetail() {
  const { currentGame, makeDecision, autoPass, player, difficulty, detailTime } = useGame()
  const [timeLeft, setTimeLeft] = useState(detailTime)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasAutoPassed = useRef(false)

  useEffect(() => {
    setTimeLeft(detailTime)
    hasAutoPassed.current = false

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          if (!hasAutoPassed.current) {
            hasAutoPassed.current = true
            setTimeout(() => autoPass(), 50)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [currentGame?.id, detailTime, autoPass])

  if (!currentGame) return null

  const canAfford = player.wallet >= currentGame.currentPrice
  const isFree = currentGame.originalPrice === 0
  const pct = detailTime > 0 ? (timeLeft / detailTime) * 100 : 0
  const isUrgent = timeLeft <= 5
  const dl = diffLabel(difficulty)

  return (
    <div className="min-h-screen bg-steam-bg animate-[fadeIn_0.3s_ease-out]">
      <TopNav />

      {/* Timer bar */}
      <div className="h-1.5 bg-steam-nav">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${isUrgent ? 'bg-steam-negative animate-pulse' : pct > 50 ? 'bg-steam-positive' : pct > 25 ? 'bg-steam-mixed' : 'bg-steam-negative'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="max-w-[940px] mx-auto px-6 pt-3 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-steam-text-dim flex items-center gap-1">
            <span>所有游戏</span>
            <span className="mx-1">&gt;</span>
            <span className="text-steam-accent">{currentGame.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-0.5 rounded" style={{ color: dl.color, background: `${dl.color}15` }}>
              {dl.text}
            </span>
            <span className={`text-xs font-bold ${isUrgent ? 'text-steam-negative animate-pulse' : 'text-steam-text-dim'}`}>
              {'\u23F1'} {timeLeft}s
            </span>
            {player.combo >= 3 && (
              <span className="text-orange-400 text-xs font-bold animate-[comboFire_1s_ease-in-out_infinite]">
                {formatCombo(player.combo)} {player.combo}x
              </span>
            )}
          </div>
        </div>

        <GameBanner game={currentGame} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-steam-card rounded-sm p-4 border border-steam-border">
              <h3 className="text-xs font-bold text-steam-text-dim uppercase tracking-wider mb-3">关于此游戏</h3>
              <p className="text-sm text-steam-text leading-relaxed">{currentGame.description}</p>
            </div>

            {/* Dimensions */}
            <GameDimensions game={currentGame} />

            <PriceChart
              priceHistory={currentGame.priceHistory}
              historicalLow={currentGame.historicalLow}
              originalPrice={currentGame.originalPrice}
              currentPrice={currentGame.currentPrice}
            />

            <ReviewSection game={currentGame} />
          </div>

          <div className="space-y-4">
            <PriceInfo game={currentGame} />

            <div className="bg-steam-card rounded-sm p-3 border border-steam-border">
              <h4 className="text-xs text-steam-text-dim mb-2 uppercase tracking-wider">用户标签</h4>
              <TagCloud tags={currentGame.tags} />
            </div>

            <DeveloperCard
              developer={currentGame.developer}
              developerRating={currentGame.developerRating}
              game={currentGame}
            />
          </div>
        </div>
      </div>

      {/* Bottom action */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-steam-nav via-steam-nav/95 to-transparent p-4 z-20">
        <div className="max-w-[900px] mx-auto flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-steam-text-dim">要买吗？</div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-steam-text">
                余额: <span className="font-bold text-steam-positive">{'\u00A5'}{player.wallet.toLocaleString()}</span>
              </span>
            </div>
          </div>

          {isFree ? (
            <>
              <SteamButton variant="secondary" size="lg" onClick={() => makeDecision('pass')} className="min-w-[120px]">
                跳过此游戏
              </SteamButton>
              <SteamButton variant="green" size="lg" onClick={() => makeDecision('buy')} className="min-w-[160px]">
                免费入库
              </SteamButton>
            </>
          ) : (
            <>
              <SteamButton variant="secondary" size="lg" onClick={() => makeDecision('pass')} className="min-w-[120px]">
                放弃此游戏
              </SteamButton>
              <SteamButton
                variant="green" size="lg" onClick={() => makeDecision('buy')}
                disabled={!canAfford}
                className="min-w-[160px]"
              >
                {canAfford ? `\u00A5${currentGame.currentPrice} 立即购买` : '余额不足'}
              </SteamButton>
            </>
          )}
        </div>
      </div>

      <ConnectorOverlay />
    </div>
  )
}
