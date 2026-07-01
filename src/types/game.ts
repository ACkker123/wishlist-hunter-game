export interface PricePoint {
  day: number
  price: number
}

export interface Review {
  type: 'positive' | 'negative'
  text: string
  votes: number
}

export type PlayStyle = 'story' | 'competitive' | 'casual' | 'collector'

export interface GameSeed {
  name: string
  developer: string
  developerRating: number
  tags: string[]
  description: string
  reviewScore: number
  reviewCount: number
  originalPrice: number
  historicalLow: number
  discountPercent: number
  worthBuying: boolean
  reviews: {
    positive: string
    negative: string
  }
  bannerGradient?: string
  bannerImage?: string
  playStyleTags?: PlayStyle[]
}

export interface GameData {
  id: string
  name: string
  developer: string
  developerRating: number
  tags: string[]
  description: string
  reviewScore: number
  reviewCount: number
  reviews: Review[]
  originalPrice: number
  priceHistory: PricePoint[]
  currentPrice: number
  discountPercent: number
  historicalLow: number
  isHistoricalLow: boolean
  worthBuying: boolean
  willDropFurther: boolean
  futurePrice: number
  bannerGradient: string
  bannerImage?: string
  playStyleTags: PlayStyle[]
  dimensions: GameDimensions
}

export interface GameDimensions {
  gameplay: number
  contentDepth: number
  polish: number
  valueForMoney: number
}

export interface GameDimensionsDisplay {
  gameplay: number
  contentDepth: number
  polish: number
  valueForMoney: number
}

export interface WishlistItem {
  game: GameData
  addedAt: number
  status: 'pending' | 'notified' | 'bought' | 'passed'
}

export interface PlayerState {
  wallet: number
  inventory: GameData[]
  wishlist: WishlistItem[]
  totalSaved: number
  totalWasted: number
  combo: number
  maxCombo: number
  missCount: number
  preference: PlayStyle | null
  correctDecisions: number
  wrongDecisions: number
  greyZoneHits: number
}

export interface RoundResult {
  game: GameData
  decision: 'buy' | 'pass'
  isCorrect: boolean
  isGreyZone: boolean
  moneyDelta: number
  comboAdded: number
  message: string
  futureInfo: string
  truthReveal: TruthReveal
}

export interface TruthReveal {
}

export type GamePhase = 'start' | 'idle' | 'news' | 'notified' | 'detail' | 'result' | 'end'

export interface SaleEvent {
  type: 'summer' | 'winter' | 'weekend' | 'return'
  name: string
  icon: string
  description: string
}

export interface NewsItem {
  id: number
  page: number
  icon: string
  title: string
  summary: string
  affectsDeveloper: string | null
  affectsTag: string | null
  isGlobal: boolean
}

export type Difficulty = 'easy' | 'medium' | 'hard'

export function getDifficulty(round: number): Difficulty {
  if (round < 5) return 'easy'
  if (round < 15) return 'medium'
  return 'hard'
}

export function getDetailTime(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy': return 15
    case 'medium': return 15
    case 'hard': return 15
  }
}

export function canSeeDeveloperRating(_: Difficulty): boolean {
  return true
}

export function canSeeReviewText(_: Difficulty): boolean {
  return true
}

export function canSeeDimensions(difficulty: Difficulty): boolean {
  return true
}

export function canSeePollutedDimensions(difficulty: Difficulty): boolean {
  return difficulty !== 'hard'
}

export function getPreferenceMultiplier(pref: PlayStyle, tags: string[], playStyleTags: PlayStyle[]): number {
  if (playStyleTags.includes(pref)) return 1.25
  const tagMap: Record<PlayStyle, string[]> = {
    story: ['剧情丰富', '角色扮演', 'RPG', 'JRPG', '动作RPG', '叙事', '侦探', '单机'],
    competitive: ['FPS', '射击', '多人', 'PVP', '竞技', '战术射击', '大逃杀', '体育', '格斗'],
    casual: ['休闲', '模拟', '模拟经营', '农场模拟', '治愈', '猫咪', '音乐', '建造', '卡通'],
    collector: ['卡牌', '刷宝', 'Rogue-like', '动作 RPG', '暗黑风', '回合制', '策略', '收集'],
  }
  const matchTags = tagMap[pref] || []
  if (tags.some(t => matchTags.includes(t))) return 1.25
  return 1.0
}
