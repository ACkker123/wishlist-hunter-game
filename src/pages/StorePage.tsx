import { TopNav } from '../components/store/TopNav'
import { Notification } from '../components/store/Notification'
import { Inventory } from '../components/store/Inventory'
import { GameRow } from '../components/store/GameRow'
import { FeaturedCarousel } from '../components/store/FeaturedCarousel'
import { NewsBriefing } from '../components/news/NewsBriefing'
import { ProgressBar } from '../components/shared/ProgressBar'
import { DiscountBadge } from '../components/shared/DiscountBadge'
import { useGame } from '../context/GameContext'
import { formatCombo } from '../utils/format'

export function StorePage() {
  const { round, maxRounds, player, showDetail, visibleNotification, saleEvent, difficulty, newsOpen } = useGame()

  const notifiedGame = player.wishlist.find(w => w.status === 'notified')
  const pendingGames = player.wishlist
    .filter(w => w.status === 'pending')
    .map(w => w.game)

  const dl = difficulty === 'easy' ? { text: '新手', color: '#6dc849' }
    : difficulty === 'medium' ? { text: '进阶级', color: '#c29843' }
    : { text: '噩梦', color: '#d9414e' }

  return (
    <div className="h-screen flex flex-col bg-steam-bg">
      <TopNav />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[940px] mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-steam-text">商店</h1>
                <p className="text-sm text-steam-text-dim">愿望单猎人 · 模拟 Steam 商店</p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="text-steam-text-dim">
                  第 <span className="text-steam-text font-bold">{round + 1}</span>/{maxRounds} 轮
                </div>
                {player.combo >= 3 && (
                  <span className="text-orange-400 font-bold animate-[comboFire_1s_ease-in-out_infinite]">
                    {formatCombo(player.combo)} {player.combo}x
                  </span>
                )}
              </div>
            </div>

            <ProgressBar
              value={round + 1}
              max={maxRounds}
              color="#66c0f4"
              label={`进度 ${round + 1}/${maxRounds}`}
            />

            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded" style={{ color: dl.color, background: `${dl.color}15` }}>
                难度: {dl.text}
              </span>
            </div>

            {saleEvent && (
              <div className="animate-[slideDown_0.4s_ease-out] bg-gradient-to-r from-steam-card to-steam-bg border border-steam-border rounded-sm p-4 flex items-center gap-3">
                <span className="text-2xl">{saleEvent.icon}</span>
                <div>
                  <div className="text-sm font-bold text-steam-text">{saleEvent.name}</div>
                  <div className="text-xs text-steam-text-dim">{saleEvent.description}</div>
                </div>
              </div>
            )}

            <div className="max-w-[400px] mx-auto">
              <div className="bg-steam-panel border border-steam-border rounded-sm flex items-center px-3 py-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="text-steam-text-dim shrink-0">
                  <path d="M9.5 5.5a4 4 0 11-8 0 4 4 0 018 0zm-.79 4.5l2.64 2.65a.5.5 0 01-.7.7L8 10.71A5 5 0 119.5 5.5a5 5 0 01-.79 4.5z" />
                </svg>
                <input
                  type="text"
                  placeholder="搜索愿望单游戏..."
                  className="ml-2 flex-1 bg-transparent border-0 outline-none text-sm text-steam-text placeholder-steam-text-dim/60"
                  readOnly
                />
              </div>
            </div>

            <FeaturedCarousel
              games={player.wishlist.map(w => w.game)}
              onGameClick={(game) => {
                const item = player.wishlist.find(w => w.game.id === game.id)
                if (item?.status === 'notified') showDetail(game)
              }}
            />

            <GameRow
              title="目前在售"
              games={pendingGames}
            />

            {player.wishlist.filter(w => w.status !== 'pending').length > 0 && (
              <GameRow
                title="已处理"
                games={player.wishlist.filter(w => w.status !== 'pending').map(w => w.game)}
              />
            )}

            {notifiedGame && visibleNotification && (
              <div className="animate-[fadeIn_0.4s_ease-out] bg-steam-card rounded-sm p-6 border border-steam-border text-center">
                <div className="text-4xl mb-3">🔔</div>
                <h2 className="text-lg font-bold text-steam-text mb-2">愿望单游戏达到史低！</h2>
                <p className="text-sm text-steam-text-dim mb-4">点击右下角通知查看详情并做出决策</p>
                <div
                  onClick={() => showDetail(notifiedGame.game)}
                  className="inline-block cursor-pointer bg-steam-card hover:bg-steam-bg-hover border border-steam-border rounded-sm p-4 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-20 rounded-sm shrink-0 overflow-hidden relative">
                      {notifiedGame.game.bannerImage ? (
                        <img src={notifiedGame.game.bannerImage} alt={notifiedGame.game.name} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white/20" style={{ background: notifiedGame.game.bannerGradient }}>
                          {notifiedGame.game.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-steam-text">{notifiedGame.game.name}</div>
                      <div className="text-xs font-bold mt-1 flex items-center gap-2">
                        <span className="text-steam-green">¥{notifiedGame.game.currentPrice}</span>
                        <DiscountBadge discountPercent={notifiedGame.game.discountPercent} />
                      </div>
                      <div className="text-[10px] text-steam-accent mt-1">点击查看详情 →</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!notifiedGame && pendingGames.length === 0 && (
              <div className="animate-[fadeIn_0.4s_ease-out] bg-steam-card rounded-sm p-8 border border-steam-border text-center">
                <div className="text-5xl mb-4">⏳</div>
                <p className="text-steam-text-dim">为你添加新的愿望单游戏...</p>
              </div>
            )}

            {player.inventory.length > 0 && <Inventory />}
          </div>
        </div>
      </div>

      <Notification />

      {newsOpen && <NewsBriefing />}
    </div>
  )
}
