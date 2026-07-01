import { useGame } from '../../context/GameContext'
import { formatPrice } from '../../utils/format'
import { DiscountBadge } from '../shared/DiscountBadge'
import { getNotificationTitle } from '../../engine/roundManager'

export function Notification() {
  const { visibleNotification, player, showDetail } = useGame()

  const notifiedGame = player.wishlist.find(w => w.status === 'notified')

  if (!visibleNotification || !notifiedGame) return null

  return (
    <div className="fixed bottom-4 right-4 z-30 animate-[slideInRight_0.4s_ease-out]">
      <div
        onClick={() => showDetail(notifiedGame.game)}
        className="bg-steam-card border border-steam-border rounded-sm shadow-lg cursor-pointer hover:border-steam-accent/50 transition-colors overflow-hidden"
      >
        <div className="flex">
          <div className="w-[120px] h-[80px] shrink-0 overflow-hidden relative">
            {notifiedGame.game.bannerImage ? (
              <img src={notifiedGame.game.bannerImage} alt={notifiedGame.game.name} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white/20" style={{ background: notifiedGame.game.bannerGradient }}>
                {notifiedGame.game.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="p-3 min-w-[200px]">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5 text-steam-accent">
              {getNotificationTitle(notifiedGame.game)}
            </div>
            <div className="text-sm text-steam-text font-bold truncate">{notifiedGame.game.name}</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-bold text-steam-green">
                {formatPrice(notifiedGame.game.currentPrice)}
              </span>
              <span className="text-xs text-steam-text-dim line-through">
                {formatPrice(notifiedGame.game.originalPrice)}
              </span>
              <DiscountBadge discountPercent={notifiedGame.game.discountPercent} />
            </div>
            <div className="text-[10px] text-steam-accent mt-1">
              点击查看详情 →
            </div>
          </div>
        </div>

        <div className="h-0.5 bg-steam-accent animate-pulse" />
      </div>
    </div>
  )
}
