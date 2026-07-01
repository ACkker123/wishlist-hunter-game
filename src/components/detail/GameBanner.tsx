import type { GameData } from '../../types/game'

interface GameBannerProps {
  game: GameData
}

export function GameBanner({ game }: GameBannerProps) {
  return (
    <div className="w-full h-[280px] rounded-sm relative overflow-hidden flex items-end">
      {game.bannerImage ? (
        <img
          src={game.bannerImage}
          alt={game.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: game.bannerGradient }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="relative z-10 p-6 w-full flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{game.name}</h1>
          <p className="text-sm text-steam-text/80 mt-1 max-w-xl">{game.description}</p>
        </div>
        <div className="text-6xl font-black text-white/15 select-none">
          {game.name.charAt(0)}
        </div>
      </div>
    </div>
  )
}
