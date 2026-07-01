import type { NotebookRule } from '../types/notebook'
import type { GameData } from '../types/game'
import { TEMPLATES } from '../data/notebookRuleTemplates'

export function generateNotebook(games: GameData[]): NotebookRule[] {
  const pool = [...games].sort(() => Math.random() - 0.5)
  const targetCount = 3

  const developers = [...new Set(pool.map(g => g.developer))]
  const prices = pool.map(g => g.currentPrice).filter(p => p > 0)
  const tagSet = new Set<string>()
  pool.forEach(g => g.tags.forEach(t => tagSet.add(t)))
  const tags = [...tagSet]
  const reviewScores = pool.map(g => g.reviewScore)

  const avgDimensions = {
    gameplay: Math.round(pool.reduce((s, g) => s + (g.dimensions?.gameplay ?? 50), 0) / pool.length),
    contentDepth: Math.round(pool.reduce((s, g) => s + (g.dimensions?.contentDepth ?? 50), 0) / pool.length),
    polish: Math.round(pool.reduce((s, g) => s + (g.dimensions?.polish ?? 50), 0) / pool.length),
    valueForMoney: Math.round(pool.reduce((s, g) => s + (g.dimensions?.valueForMoney ?? 50), 0) / pool.length),
  }

  const params = { developers, prices, dimensions: avgDimensions, tags, reviewScores }
  const shuffledTemplates = [...TEMPLATES].sort(() => Math.random() - 0.5)
  const rules: NotebookRule[] = []

  for (const t of shuffledTemplates) {
    if (rules.length >= targetCount) break
    const rule = t.generate(params)
    if (rule) {
      rules.push({ ...rule, id: rules.length })
    }
  }

  return rules
}
