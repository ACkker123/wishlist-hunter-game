import { useGame } from '../../context/GameContext'

export function TopNav() {
  const { player, openNews, bellShaking, newsLocked, storePage, setStorePage } = useGame()

  return (
    <nav className="bg-steam-nav border-b border-steam-border shrink-0">
      {/* Row 1: App menu bar */}
      <div className="h-[28px] flex items-center px-3">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-[#e5e4dc] cursor-pointer hover:text-white select-none">
            STEAM
          </span>
          <span className="text-[11px] text-[#7a7a7a] cursor-pointer hover:text-[#c5c3c0] select-none">
            查看
          </span>
          <span className="text-[11px] text-[#7a7a7a] cursor-pointer hover:text-[#c5c3c0] select-none">
            好友
          </span>
          <span className="text-[11px] text-[#7a7a7a] cursor-pointer hover:text-[#c5c3c0] select-none">
            游戏
          </span>
          <span className="text-[11px] text-[#7a7a7a] cursor-pointer hover:text-[#c5c3c0] select-none">
            帮助
          </span>
        </div>

        <div className="ml-auto flex items-center gap-1">
          {/* 新闻简报 */}
          <button
            onClick={bellShaking ? openNews : undefined}
            className={`p-1.5 rounded-sm transition-colors relative ${
              bellShaking
                ? 'text-[#c5c3c0] hover:text-white hover:bg-[#3a3f47] animate-shake cursor-pointer'
                : newsLocked
                  ? 'text-[#4a4a4a] cursor-not-allowed'
                  : 'text-[#c5c3c0] hover:text-white hover:bg-[#3a3f47] cursor-pointer'
            }`}
            title={bellShaking ? '查看 Steam 新闻简报' : newsLocked ? '今日新闻已阅读' : '暂无新闻'}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M7 2a3 3 0 00-3 3v2l-1 2h8l-1-2V5a3 3 0 00-3-3z" />
              <path d="M5.5 10a1.5 1.5 0 002.5 0H5.5z" />
            </svg>
            {bellShaking && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-steam-green rounded-full animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Row 2: Navigation bar */}
      <div className="h-[40px] flex items-center px-3 bg-gradient-to-b from-[#1b2838] to-steam-nav">
        {/* Back / Forward */}
        <div className="flex items-center gap-0.5">
          <button className="w-6 h-6 flex items-center justify-center rounded-sm text-[#7a7a7a] hover:text-[#c5c3c0] hover:bg-[#3a3f47] transition-colors">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M7 1L3 5l4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </button>
          <button className="w-6 h-6 flex items-center justify-center rounded-sm text-[#7a7a7a] hover:text-[#c5c3c0] hover:bg-[#3a3f47] transition-colors">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M3 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </button>
        </div>

        {/* Main nav tabs */}
        <div className="flex items-center ml-2">
          <span
            onClick={() => setStorePage('store')}
            className={`px-3 py-2 text-[13px] cursor-pointer border-b-2 select-none transition-colors ${storePage === 'store' ? 'text-[#c5c3c0] border-steam-accent' : 'text-[#7a7a7a] border-transparent hover:text-[#c5c3c0]'}`}
          >
            商店
          </span>
          <span
            className="px-3 py-2 text-[13px] text-[#7a7a7a] cursor-pointer hover:text-[#c5c3c0] select-none"
          >
            库
          </span>
          <span
            className="px-3 py-2 text-[13px] text-[#7a7a7a] cursor-pointer hover:text-[#c5c3c0] select-none"
          >
            社区
          </span>
          <span
            onClick={() => setStorePage('wishlist')}
            className={`px-3 py-2 text-[13px] cursor-pointer border-b-2 select-none transition-colors ${storePage === 'wishlist' ? 'text-[#c5c3c0] border-steam-accent' : 'text-[#7a7a7a] border-transparent hover:text-[#c5c3c0]'}`}
          >
            愿望单
          </span>
        </div>

        {/* Right: wallet + user */}
        <div className="ml-auto flex items-center gap-3">
          <Wallet />
          <div className="flex items-center gap-1.5 cursor-pointer hover:brightness-110 select-none">
            <div className="w-6 h-6 rounded-sm bg-[#2a6fba] flex items-center justify-center text-white text-[10px] font-bold">
              W
            </div>
            <span className="text-[12px] text-[#7a7a7a]">WishlistHunter</span>
            <svg width="8" height="6" viewBox="0 0 8 6" fill="currentColor" className="text-[#7a7a7a]">
              <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  )
}

function Wallet() {
  const { player } = useGame()
  const walletColor = player.wallet >= 1000 ? 'text-steam-positive' : player.wallet >= 100 ? 'text-steam-mixed' : 'text-steam-negative'

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[12px] text-[#7a7a7a]">余额</span>
      <span className={`text-[12px] font-bold ${walletColor}`}>¥{player.wallet.toLocaleString()}</span>
    </div>
  )
}
