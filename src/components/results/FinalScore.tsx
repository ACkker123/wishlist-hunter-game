import type { PlayerState, PlayStyle } from '../../types/game'
import { formatPrice } from '../../utils/format'

interface FinalScoreProps {
  player: PlayerState
}

function getPrefLabel(pref: PlayStyle | null): string | null {
  if (!pref) return null
  const map: Record<PlayStyle, string> = {
    story: '玩家类型: 🎭 剧情党',
    competitive: '玩家类型: ⚔️ 竞技党',
    casual: '玩家类型: 🌿 休闲党',
    collector: '玩家类型: 🎴 收集党',
  }
  return map[pref]
}

export function FinalScore({ player }: FinalScoreProps) {
  const netWorth = player.wallet + player.inventory.reduce((sum, g) => sum + g.originalPrice, 0)
  const rating = getRating(netWorth - 5000)
  const prefLabel = getPrefLabel(player.preference)

  return (
    <div className="text-center">
      <div className="text-6xl mb-4">{rating.emoji}</div>
      <h2 className="text-2xl font-bold text-steam-text mb-1">{rating.title}</h2>
      <p className="text-sm text-steam-text-dim mb-1">{rating.subtitle}</p>
      {prefLabel && (
        <p className="text-xs text-steam-accent mb-4">{prefLabel}</p>
      )}

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="省下金额" value={`+${formatPrice(player.totalSaved)}`} color="#6dc849" />
        <StatCard label="浪费金额" value={`-${formatPrice(player.totalWasted)}`} color="#d9414e" />
        <StatCard label="正确决策" value={`${player.correctDecisions} 次`} color="#6dc849" />
        <StatCard label="错误决策" value={`${player.wrongDecisions} 次`} color="#d9414e" />
        <StatCard label="灰色地带" value={`${player.greyZoneHits} 次`} color="#c29843" />
        <StatCard label="最大连击" value={`${player.maxCombo}x`} color="#ff8c00" />
        <StatCard label="库存游戏" value={`${player.inventory.length} 款`} color="#66c0f4" />
        <StatCard label="遗漏好游戏" value={`${player.missCount} 款`} color="#d9414e" />
      </div>

      {player.inventory.length > 0 && (
        <div className="text-left bg-steam-panel rounded-sm p-3 border border-steam-border mb-4">
          <h4 className="text-xs text-steam-text-dim mb-2 uppercase tracking-wider">购入游戏</h4>
          <div className="flex flex-wrap gap-1.5">
            {player.inventory.map(g => (
              <span
                key={g.id}
                className="text-xs px-2 py-1 rounded bg-steam-green-btn/20 text-steam-green"
              >
                {g.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-steam-card rounded-sm p-3 border border-steam-border text-center">
      <div className="text-lg font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] text-steam-text-dim">{label}</div>
    </div>
  )
}

function getRating(netGain: number) {
  if (netGain >= 3000) return { emoji: '🏆', title: '神级猎手', subtitle: '你的判断近乎完美，Steam夏促总监看了都想挖你' }
  if (netGain >= 1500) return { emoji: '🌟', title: '老练买家', subtitle: '眼力极佳，愿望单被你拿捏得死死的' }
  if (netGain >= 500) return { emoji: '👍', title: '精明玩家', subtitle: '大部分决策都是对的，再接再厉' }
  if (netGain >= 0) return { emoji: '🤔', title: '普通玩家', subtitle: '中规中矩，和大部分Steam玩家一样' }
  if (netGain >= -500) return { emoji: '😅', title: '冲动型买家', subtitle: '看到打折就冲，当了太多次冤大头' }
  if (netGain >= -2000) return { emoji: '💸', title: '剁手党', subtitle: '你的钱包在哭泣，G胖笑出了声' }
  return { emoji: '🤡', title: '慈善家', subtitle: '你在Steam上花的每一分钱都是善款' }
}
