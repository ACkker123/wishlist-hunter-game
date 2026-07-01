import { SteamButton } from '../components/shared/SteamButton'
import { FinalScore } from '../components/results/FinalScore'
import { useGame } from '../context/GameContext'

export function EndPage() {
  const { player, restartGame } = useGame()

  return (
    <div className="min-h-screen bg-steam-bg flex flex-col items-center justify-center p-4">
      <div className="animate-[fadeInUp_0.6s_ease-out] max-w-md w-full">
        <div className="bg-steam-card rounded-sm p-6 border border-steam-border">
          <FinalScore player={player} />
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <SteamButton variant="green" size="lg" onClick={restartGame} className="w-full py-3 text-base font-bold">
            再来一局
          </SteamButton>
          <p className="text-center text-[10px] text-steam-text-dim">
            每次游玩愿望单和价格都会随机变化
          </p>
        </div>
      </div>
    </div>
  )
}
