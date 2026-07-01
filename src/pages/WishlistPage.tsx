import { useState } from 'react'
import { TopNav } from '../components/store/TopNav'
import { Notification } from '../components/store/Notification'
import { Inventory } from '../components/store/Inventory'
import { NewsBriefing } from '../components/news/NewsBriefing'
import { DiscountBadge } from '../components/shared/DiscountBadge'
import { useGame } from '../context/GameContext'

type SortKey = 'name' | 'discount' | 'price'

export function WishlistPage() {
  const { player, showDetail, newsOpen } = useGame()
  const [sort, setSort] = useState<SortKey>('discount')
  const [showDiscountOnly, setShowDiscountOnly] = useState(false)

  let list = [...player.wishlist]

  if (showDiscountOnly) {
    list = list.filter(w => w.game.originalPrice > 0)
  }

  list.sort((a, b) => {
    switch (sort) {
      case 'name':
        return a.game.name.localeCompare(b.game.name)
      case 'discount':
        return b.game.discountPercent - a.game.discountPercent
      case 'price':
        return a.game.currentPrice - b.game.currentPrice
      default:
        return 0
    }
  })

  const sortBtns: { key: SortKey; label: string }[] = [
    { key: 'discount', label: '折扣' },
    { key: 'price', label: '价格' },
    { key: 'name', label: '名称' },
  ]

  return (
    <div className="h-screen flex flex-col bg-steam-bg">
      <TopNav />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[940px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-steam-text">愿望单</h1>
            <span className="text-sm text-steam-text-dim">{player.wishlist.length} 款游戏</span>
          </div>

          <div className="flex items-center justify-between mb-4 pb-3 border-b border-steam-border">
            <div className="flex items-center gap-1">
              <span className="text-xs text-steam-text-dim mr-2">排序:</span>
              {sortBtns.map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setSort(btn.key)}
                  className={`px-3 py-1 rounded-sm text-xs transition-colors ${
                    sort === btn.key
                      ? 'bg-steam-accent/20 text-steam-accent font-bold'
                      : 'text-steam-text-dim hover:text-steam-text hover:bg-steam-bg-hover'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowDiscountOnly(!showDiscountOnly)}
              className={`px-3 py-1 rounded-sm text-xs transition-colors border ${
                showDiscountOnly
                  ? 'bg-steam-accent/10 text-steam-accent border-steam-accent/30'
                  : 'text-steam-text-dim border-steam-border hover:text-steam-text hover:border-steam-text-dim'
              }`}
            >
              {showDiscountOnly ? '✓ 仅打折' : '仅打折'}
            </button>
          </div>

          {list.length === 0 ? (
            <div className="text-center py-12 text-steam-text-dim">
              <div className="text-5xl mb-4">📋</div>
              <p>愿望单是空的</p>
            </div>
          ) : (
            <div className="space-y-1">
              {list.map((item) => (
                <div
                  key={item.game.id}
                  onClick={() => item.status === 'notified' && showDetail(item.game)}
                  className={`flex items-center gap-3 p-2 rounded-sm border transition-colors ${
                    item.status === 'notified'
                      ? 'bg-steam-accent/5 border-steam-accent/20 cursor-pointer hover:bg-steam-accent/10'
                      : item.status === 'bought'
                      ? 'bg-steam-bg border-steam-border cursor-default'
                      : item.status === 'passed'
                      ? 'bg-steam-bg border-steam-border cursor-default opacity-60'
                      : 'bg-steam-bg border-steam-border cursor-default'
                  }`}
                >
                  <div className="w-[120px] h-[60px] rounded-sm shrink-0 overflow-hidden relative">
                    {item.game.bannerImage ? (
                      <img src={item.game.bannerImage} alt={item.game.name} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white/20" style={{ background: item.game.bannerGradient }}>
                        {item.game.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-steam-text font-bold truncate">{item.game.name}</div>
                    <div className="text-[11px] text-steam-text-dim mt-0.5">
                      {item.game.tags.slice(0, 3).join(' · ')}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {item.status === 'notified' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-steam-accent/15 text-steam-accent animate-pulse">
                          通知
                        </span>
                      )}
                      {item.status === 'bought' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-steam-positive/20 text-steam-positive">
                          已购
                        </span>
                      )}
                      {item.status === 'passed' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-steam-negative/20 text-steam-negative">
                          已过
                        </span>
                      )}
                      {item.status === 'pending' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-steam-text-dim/10 text-steam-text-dim">
                          等待
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-3">
                    <div>
                      {item.game.originalPrice > 0 ? (
                        <>
                          <DiscountBadge discountPercent={item.game.discountPercent} />
                          <div className="text-sm font-bold text-steam-text mt-1">¥{item.game.currentPrice}</div>
                          <div className="text-[10px] text-steam-text-dim line-through">¥{item.game.originalPrice}</div>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-steam-green">免费</span>
                      )}
                    </div>
                    {item.status === 'notified' && (
                      <span className="text-steam-positive text-lg">&#9654;</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {player.inventory.length > 0 && (
            <div className="mt-6">
              <Inventory />
            </div>
          )}
        </div>
      </div>

      <Notification />

      {newsOpen && <NewsBriefing />}
    </div>
  )
}
