import type { GameSeed, PricePoint, GameData } from '../types/game'
import { randomFloat, chance } from '../utils/random'
import { generateDimensions } from './dimensionEngine'

const BANNER_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  'linear-gradient(135deg, #2af598 0%, #009efd 100%)',
  'linear-gradient(135deg, #09203f 0%, #537895 100%)',
  'linear-gradient(135deg, #667eea 0%, #2c3e50 100%)',
  'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)',
]

export function generatePriceHistory(game: GameSeed): PricePoint[] {
  const totalDays = 180
  const step = 3
  const fluctuateInterval = 25
  const original = game.originalPrice
  const points: PricePoint[] = []

  let currentPrice = original
  let lastChangeDay = 0

  for (let i = 0; i < totalDays; i += step) {
    if (i - lastChangeDay >= fluctuateInterval) {
      const ratio = i / totalDays

      if (ratio < 0.33) {
        if (chance(0.15)) currentPrice = original * (0.7 + randomFloat(0, 0.15))
        else currentPrice = original
      } else if (ratio < 0.66) {
        currentPrice = original * (0.45 + randomFloat(0.05, 0.25))
      } else {
        currentPrice = game.historicalLow + (original - game.historicalLow) * randomFloat(0.02, 0.12)
      }

      lastChangeDay = i
    }

    const noise = Math.sin(i * 0.12) * original * 0.005
    const price = Math.max(game.historicalLow * 0.85, currentPrice + noise)
    points.push({ day: i + 1, price: Math.round(price) })
  }

  const currentPriceFinal = Math.round(game.historicalLow * (1 + randomFloat(0, 0.05)))
  points[points.length - 1].price = currentPriceFinal

  return points
}

export function generateCurrentPrice(game: GameSeed): number {
  return Math.round(game.historicalLow * (1 + randomFloat(0, 0.05)))
}

export function simulateFuture(game: GameSeed): { futurePrice: number; dropsFurther: boolean } {
  if (game.worthBuying) {
    const rebound = chance(0.8)
    const futurePrice = rebound
      ? Math.round(game.originalPrice * (0.65 + randomFloat(0.05, 0.2)))
      : Math.round(game.historicalLow * randomFloat(0.6, 0.85))
    return { futurePrice, dropsFurther: !rebound }
  } else {
    const drops = chance(0.6)
    const futurePrice = drops
      ? Math.round(game.historicalLow * randomFloat(0.25, 0.55))
      : Math.round(game.historicalLow * (1 + randomFloat(0.1, 0.3)))
    return { futurePrice, dropsFurther: drops }
  }
}

export function seedToGameData(seed: GameSeed, index: number): GameData {
  const currentPrice = generateCurrentPrice(seed)
  const { futurePrice, dropsFurther } = simulateFuture(seed)
  const isHistoricalLow = currentPrice <= seed.historicalLow * 1.02

  return {
    id: `game-${index}`,
    name: seed.name,
    developer: seed.developer,
    developerRating: seed.developerRating,
    tags: seed.tags,
    description: seed.description,
    reviewScore: seed.reviewScore,
    reviewCount: seed.reviewCount,
    reviews: [
      { type: 'positive', text: seed.reviews.positive, votes: Math.floor(seed.reviewCount * 0.3) },
      { type: 'negative', text: seed.reviews.negative, votes: Math.floor(seed.reviewCount * 0.15) },
    ],
    originalPrice: seed.originalPrice,
    priceHistory: generatePriceHistory(seed),
    currentPrice,
    discountPercent: seed.originalPrice > 0
      ? Math.round((1 - currentPrice / seed.originalPrice) * 100)
      : 0,
    historicalLow: seed.historicalLow,
    isHistoricalLow,
    worthBuying: seed.worthBuying,
    willDropFurther: dropsFurther,
    futurePrice,
    bannerGradient: seed.bannerGradient || randomPick(BANNER_GRADIENTS),
    bannerImage: seed.bannerImage,
    playStyleTags: seed.playStyleTags || [],
    dimensions: generateDimensions(seed) || { gameplay: 50, contentDepth: 50, polish: 50, valueForMoney: 50 },
  }
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
