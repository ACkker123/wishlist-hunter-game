import type { GameDimensions } from '../types/game'
import type { GameSeed } from '../types/game'

export function generateDimensions(seed: GameSeed): GameDimensions {
  const baseGameplay = seed.worthBuying
    ? 65 + Math.floor(Math.random() * 31)
    : 10 + Math.floor(Math.random() * 41)
  const baseContent = seed.worthBuying
    ? 58 + Math.floor(Math.random() * 33)
    : 15 + Math.floor(Math.random() * 36)
  const basePolish = seed.worthBuying
    ? 56 + Math.floor(Math.random() * 30)
    : 10 + Math.floor(Math.random() * 31)
  const baseValue = seed.worthBuying
    ? 60 + Math.floor(Math.random() * 31)
    : 15 + Math.floor(Math.random() * 36)

  return {
    gameplay: baseGameplay,
    contentDepth: baseContent,
    polish: basePolish,
    valueForMoney: baseValue,
  }
}
