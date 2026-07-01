import { Modal } from '../shared/Modal'
import { SteamButton } from '../shared/SteamButton'
import { useGame } from '../../context/GameContext'
import { formatPrice } from '../../utils/format'
import { ScorePopup } from '../shared/ScorePopup'

export function RoundResultModal() {
  const { currentResult, player, dismissResult, round, maxRounds } = useGame()

  if (!currentResult) return null

  const { game, decision, isCorrect, isGreyZone, moneyDelta, comboAdded, message, futureInfo, truthReveal } = currentResult

  return (
    <Modal open={true}>
      <div className="p-6 relative">
        <ScorePopup value={moneyDelta} isPositive={isCorrect} combo={player.combo} />

        <div className="text-center mb-4">
          <div className="text-3xl mb-2">
            {isGreyZone ? '❓' : isCorrect ? '🎯' : '💀'}
          </div>
          <h2 className={`text-lg font-bold ${isGreyZone ? 'text-steam-mixed' : isCorrect ? 'text-steam-positive' : 'text-steam-negative'}`}>
            {isGreyZone ? '灰色地带' : isCorrect ? '正确决策！' : '判断失误！'}
          </h2>
          <p className="text-sm text-steam-text mt-1">{message}</p>
        </div>

        <div className="bg-steam-panel rounded-sm p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-sm overflow-hidden">
                {game.bannerImage ? (
                  <img src={game.bannerImage} alt={game.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" style={{ background: game.bannerGradient }} />
                )}
              </div>
              <span className="text-sm text-steam-text font-bold">{game.name}</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded ${
              decision === 'buy' ? 'bg-steam-positive/20 text-steam-positive' : 'bg-steam-accent/20 text-steam-accent'
            }`}>
              {decision === 'buy' ? '已购买' : '已放弃'}
            </span>
          </div>
          <div className="text-xs text-steam-text-dim leading-relaxed">{futureInfo}</div>
        </div>

        <div className="flex gap-4 text-center mb-5">
          <div className="flex-1">
            <div className={`text-lg font-bold ${moneyDelta >= 0 ? 'text-steam-positive' : 'text-steam-negative'}`}>
              {moneyDelta >= 0 ? '+' : ''}{moneyDelta > 0 ? formatPrice(moneyDelta) : formatPrice(Math.abs(moneyDelta))}
            </div>
            <div className="text-[10px] text-steam-text-dim">金币变化</div>
          </div>
          <div className="flex-1">
            <div className={`text-lg font-bold ${comboAdded >= 0 ? 'text-steam-positive' : 'text-steam-negative'}`}>
              {comboAdded >= 0 ? '+' : ''}{comboAdded}
            </div>
            <div className="text-[10px] text-steam-text-dim">连击</div>
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold text-orange-400">{player.combo}x</div>
            <div className="text-[10px] text-steam-text-dim">当前连击</div>
          </div>
        </div>

        <SteamButton
          variant="blue"
          size="lg"
          onClick={dismissResult}
          className="w-full text-base font-bold"
        >
          {round + 1 >= maxRounds ? '查看最终成绩' : '下一轮'}
        </SteamButton>

        <div className="text-center mt-2 text-[10px] text-steam-text-dim">
          第 {round + 1}/{maxRounds} 轮
        </div>
      </div>
    </Modal>
  )
}
