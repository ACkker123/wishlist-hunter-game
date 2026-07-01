import type { RoundResult, GameData, TruthReveal, PlayStyle, NewsItem } from '../types/game'
import type { NotebookRule } from '../types/notebook'
import { getVerdict, calcRealValue } from './valueCalculator'
import { checkAllRules } from '../utils/ruleChecker'

export function calcScore(
  game: GameData,
  decision: 'buy' | 'pass',
  preference: PlayStyle | null = null,
  news: NewsItem[] = [],
  notebookRules: NotebookRule[] = [],
): RoundResult {
  const truthReveal: TruthReveal = {}

  // Price check: buying at non-lowest price with significant gap is a fail
  if (decision === 'buy' && game.priceHistory.length > 0) {
    const lowestChartPrice = Math.min(...game.priceHistory.map(p => p.price))
    const isLowestInChart = game.currentPrice <= lowestChartPrice * 1.02
    const gapLarge = (game.currentPrice - lowestChartPrice) >= 40
    if (!isLowestInChart && gapLarge) {
      return {
        game, decision, isCorrect: false, isGreyZone: false,
        moneyDelta: -game.currentPrice, comboAdded: -1,
        message: `当前价格 ¥${game.currentPrice} 并非近期最低！图表最低曾至 ¥${lowestChartPrice}，再等一等`,
        futureInfo: `近期最低价为 ¥${lowestChartPrice}，买入时机不对`,
        truthReveal,
      }
    }
  }

  // Notebook rule check: boss orders are absolute
  if (notebookRules.length > 0) {
    const { violated } = checkAllRules(notebookRules, game)
    if (violated.length > 0) {
      const ruleLabels = violated.map(r => r.label).join('；')
      if (decision === 'buy') {
        return {
          game, decision, isCorrect: false, isGreyZone: false,
          moneyDelta: -game.currentPrice, comboAdded: -1,
          message: `违反购买准则！该游戏触发了以下规则：${ruleLabels}`,
          futureInfo: `你的购买准则禁止此类游戏，买下必定亏损`,
          truthReveal,
        }
      }
      return {
        game, decision, isCorrect: true, isGreyZone: false,
        moneyDelta: Math.round((game.originalPrice - game.currentPrice) * 0.5), comboAdded: 1,
        message: `遵循购买准则！该游戏触发了规则：${ruleLabels}，放弃是正确的`,
        futureInfo: `遵守购买准则避免了不必要的损失`,
        truthReveal,
      }
    }
  }

  // Value-based scoring
  const rawValue = game.dimensions
    ? calcRealValue(game.dimensions, preference, game.tags, game.playStyleTags, news, game.developer)
    : game.worthBuying ? 70 : 30

  const safeValue = Number.isNaN(rawValue) ? (game.worthBuying ? 70 : 30) : rawValue
  const { verdict } = getVerdict(safeValue)
  const saved = game.originalPrice - game.currentPrice
  const wasted = game.currentPrice

  if (verdict === 'grey') {
    return {
      game, decision, isCorrect: true, isGreyZone: true,
      moneyDelta: 0, comboAdded: 0,
      message: '灰色地带——买或不买都不亏',
      futureInfo: '这款游戏处于边界值，两种选择都合理',
      truthReveal,
    }
  }

  if (verdict === 'buy' && decision === 'buy') {
    return {
      game, decision, isCorrect: true, isGreyZone: false,
      moneyDelta: Math.max(saved, 10), comboAdded: 1,
      message: '明智之选！根据分析这款游戏的综合价值值得入手',
      futureInfo: `价格现已反弹至 ¥${game.futurePrice}`,
      truthReveal,
    }
  }

  if (verdict === 'buy' && decision === 'pass') {
    return {
      game, decision, isCorrect: false, isGreyZone: false,
      moneyDelta: 0, comboAdded: -1,
      message: '错失良机！这款游戏的综合价值实际上是值得的',
      futureInfo: `价格现已反弹至 ¥${game.futurePrice}`,
      truthReveal,
    }
  }

  if (verdict === 'skip' && decision === 'buy') {
    return {
      game, decision, isCorrect: false, isGreyZone: false,
      moneyDelta: -wasted, comboAdded: -1,
      message: '踩雷了！分析显示这款游戏综合价值不达标',
      futureInfo: `价格继续跌至 ¥${game.futurePrice}，你多花了 ¥${Math.max(0, wasted - game.futurePrice)}`,
      truthReveal,
    }
  }

  return {
    game, decision, isCorrect: true, isGreyZone: false,
    moneyDelta: Math.round(saved * 0.5), comboAdded: 1,
    message: '火眼金睛！成功识别出这款游戏价值过低',
    futureInfo: `价格继续跌至 ¥${game.futurePrice}，幸好没买`,
    truthReveal,
  }
}
