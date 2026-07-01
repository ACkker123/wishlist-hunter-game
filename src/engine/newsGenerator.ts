import type { NewsItem } from '../types/game'
import type { GameData } from '../types/game'
import { TEMPLATES } from '../data/newsTemplates'

const TOTAL_NEWS = 8

export function generateNews(games: GameData[]): NewsItem[] {
  const pool: NewsItem[] = []
  const usedDevelopers = new Set<string>()
  const usedTags = new Set<string>()

  const devTemplates = TEMPLATES.filter(t => t.affectsDeveloper === 'dynamic')
  const tagTemplates = TEMPLATES.filter(t => t.affectsTag === 'dynamic')
  const globalTemplates = TEMPLATES.filter(t => t.isGlobal)

  const shuffled = [...games].sort(() => Math.random() - 0.5)

  // Phase 1: Generate 2 developer + 2 tag news from pending games (no conflicts)
  for (const game of shuffled) {
    if (usedDevelopers.size >= 2 && usedTags.size >= 2) break
    if (pool.length >= 4) break

    if (usedDevelopers.size < 2 && !usedDevelopers.has(game.developer)) {
      usedDevelopers.add(game.developer)
      const t = devTemplates[usedDevelopers.size % devTemplates.length]
      pool.push({
        id: pool.length,
        page: 0,
        icon: t.icon,
        title: t.title.replace('{developer}', game.developer),
        summary: t.summary,
        affectsDeveloper: game.developer,
        affectsTag: null,
        isGlobal: false,
      })
    }

    if (usedTags.size < 2 && game.tags.length > 0) {
      const availableTags = game.tags.filter(tg => !usedTags.has(tg))
      if (availableTags.length > 0) {
        const tag = availableTags[pool.length % availableTags.length]
        usedTags.add(tag)
        const t = tagTemplates[usedTags.size % tagTemplates.length]
        pool.push({
          id: pool.length,
          page: 0,
          icon: t.icon,
          title: t.title.replace('{tag}', tag),
          summary: t.summary,
          affectsDeveloper: null,
          affectsTag: tag,
          isGlobal: false,
        })
      }
    }
  }

  // Phase 2: Fill remaining slots with more pending-game dev/tag news (no conflicts)
  const extraDevs = shuffled
    .map(g => g.developer)
    .filter(d => !usedDevelopers.has(d))
  const extraDevSet = new Set(extraDevs)
  for (const dev of extraDevSet) {
    if (pool.length >= TOTAL_NEWS - 1) break
    usedDevelopers.add(dev)
    const t = devTemplates[(usedDevelopers.size + 1) % devTemplates.length]
    pool.push({
      id: pool.length,
      page: 0,
      icon: t.icon,
      title: t.title.replace('{developer}', dev),
      summary: t.summary,
      affectsDeveloper: dev,
      affectsTag: null,
      isGlobal: false,
    })
  }

  const extraTags = [...new Set(shuffled.flatMap(g => g.tags))]
    .filter(t => !usedTags.has(t))
  for (const tag of extraTags) {
    if (pool.length >= TOTAL_NEWS - 1) break
    usedTags.add(tag)
    const t = tagTemplates[(usedTags.size + 1) % tagTemplates.length]
    pool.push({
      id: pool.length,
      page: 0,
      icon: t.icon,
      title: t.title.replace('{tag}', tag),
      summary: t.summary,
      affectsDeveloper: null,
      affectsTag: tag,
      isGlobal: false,
    })
  }

  // Phase 3: Fill remaining to TOTAL_NEWS with global news
  const extraGlobals = [...globalTemplates].sort(() => Math.random() - 0.5)
  for (const g of extraGlobals) {
    if (pool.length >= TOTAL_NEWS) break
    pool.push({
      id: pool.length,
      page: 0,
      icon: g.icon,
      title: g.title,
      summary: g.summary,
      affectsDeveloper: null,
      affectsTag: null,
      isGlobal: g.isGlobal,
    })
  }

  // Distribute across pages: 3 items on page 1&2, 2 on page 3
  const result = pool.sort(() => Math.random() - 0.5).slice(0, TOTAL_NEWS)
  return result.map((item, i) => ({
    ...item,
    id: i,
    page: i < 3 ? 1 : i < 6 ? 2 : 3,
  }))
}
