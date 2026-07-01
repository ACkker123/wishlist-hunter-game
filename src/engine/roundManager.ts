import type { GameData } from '../types/game'

export function canNotifyGame(game: GameData): boolean {
  return game.isHistoricalLow && game.discountPercent >= 30
}

export function getNotificationTitle(game: GameData): string {
  if (game.discountPercent >= 90) return '💎 历史最低价！'
  if (game.discountPercent >= 75) return '🔥 大幅折扣！'
  if (game.discountPercent >= 50) return '📉 史低中！'
  return '📢 愿望单游戏打折'
}

