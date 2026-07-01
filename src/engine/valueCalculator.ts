import type { GameDimensions, PlayStyle, NewsItem } from '../types/game'
import { getPreferenceMultiplier } from '../types/game'

export function calcRealValue(
  dims: GameDimensions,
  pref: PlayStyle | null,
  tags: string[],
  playStyleTags: PlayStyle[],
  news: NewsItem[],
  developer: string,
): number {
  let raw = dims.gameplay * 0.3 + dims.contentDepth * 0.2 + dims.polish * 0.25 + dims.valueForMoney * 0.25

  let mod = 1.0
  if (pref) {
    mod *= getPreferenceMultiplier(pref, tags, playStyleTags)
  }

  for (const n of news) {
    if (n.affectsDeveloper === developer) mod *= 1.12
    if (n.affectsTag && tags.includes(n.affectsTag)) mod *= 1.08
    if (n.isGlobal) mod *= n.title.includes('严查') || n.title.includes('利好') ? 1.03 : n.title.includes('退款') ? 0.96 : 1.0
  }

  return Math.round(raw * mod)
}

export function getVerdict(rawValue: number): { verdict: 'buy' | 'grey' | 'skip'; label: string } {
  if (rawValue >= 65) return { verdict: 'buy', label: '值得购买' }
  if (rawValue >= 55) return { verdict: 'grey', label: '可买可不买' }
  return { verdict: 'skip', label: '不值得买' }
}
