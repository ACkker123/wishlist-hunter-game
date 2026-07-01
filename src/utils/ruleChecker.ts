import type { NotebookRule } from '../types/notebook'
import type { GameData } from '../types/game'

export type MatchResult = 'match' | 'violation'

export function checkRule(rule: NotebookRule, game: GameData): MatchResult {
  switch (rule.type) {
    case 'developer_ban':
      return game.developer === rule.developer ? 'violation' : 'match'

    case 'price_cap':
      return game.currentPrice <= (rule.maxPrice ?? Infinity) ? 'match' : 'violation'

    case 'review_floor':
      return game.reviewScore >= (rule.minReviewScore ?? 0) ? 'match' : 'violation'

    case 'dimension_min': {
      const dims = game.dimensions
      if (!dims || !rule.dimension) return 'match'
      const dimValue = dims[rule.dimension as keyof typeof dims] as number | undefined
      return (dimValue ?? 0) >= (rule.minValue ?? 0) ? 'match' : 'violation'
    }

    default:
      return 'match'
  }
}

export function checkAllRules(rules: NotebookRule[], game: GameData): {
  violated: NotebookRule[]
} {
  const violated: NotebookRule[] = []
  for (const rule of rules) {
    if (checkRule(rule, game) === 'violation') {
      violated.push(rule)
    }
  }
  return { violated }
}
