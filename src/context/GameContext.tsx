import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react'
import type {
  GamePhase, PlayerState, GameData, RoundResult, WishlistItem,
  SaleEvent, Difficulty, NewsItem, PlayStyle,
} from '../types/game'
import type { NotebookRule } from '../types/notebook'
import type { MatchResult } from '../utils/ruleChecker'
import { getDifficulty, getDetailTime } from '../types/game'
import { presetGames } from '../data/presetGames'
import { seedToGameData } from '../engine/priceEngine'
import { calcScore } from '../engine/scoringSystem'
import { shuffle } from '../utils/random'
import { generateRandomGame } from '../engine/gameDataGenerator'
import { generateSaleEvent } from '../engine/saleEvents'
import { generateNews } from '../engine/newsGenerator'
import { generateNotebook } from '../engine/notebookGenerator'

const MAX_ROUNDS = 20
const INITIAL_WALLET = 5000
const RETURN_CHANCE = 0.1

function createInitialPlayer(): PlayerState {
  return {
    wallet: INITIAL_WALLET,
    inventory: [],
    wishlist: [],
    totalSaved: 0,
    totalWasted: 0,
    combo: 0,
    maxCombo: 0,
    missCount: 0,
    preference: null,
    correctDecisions: 0,
    wrongDecisions: 0,
    greyZoneHits: 0,
  }
}

function generateAllGames(): GameData[] {
  const shuffled = shuffle([...presetGames])
  const all: GameData[] = shuffled.map((seed, i) => seedToGameData(seed, i))
  while (all.length < MAX_ROUNDS * 2) {
    const randomSeed = generateRandomGame()
    all.push(seedToGameData(randomSeed, all.length))
  }
  return all
}

function pickUnnotified(pending: WishlistItem[], notified: Set<string>): WishlistItem | null {
  if (pending.length === 0) return null
  const fresh = pending.filter(g => !notified.has(g.game.id))
  if (fresh.length > 0) {
    return fresh[Math.floor(Math.random() * fresh.length)]
  }
  notified.clear()
  return pending[Math.floor(Math.random() * pending.length)]
}

interface GameContextValue {
  phase: GamePhase
  player: PlayerState
  allGames: GameData[]
  currentGame: GameData | null
  currentResult: RoundResult | null
  round: number
  maxRounds: number
  visibleNotification: boolean
  saleEvent: SaleEvent | null
  difficulty: Difficulty
  detailTime: number
  newsItems: NewsItem[]
  newsOpen: boolean
  bellShaking: boolean
  newsLocked: boolean
  notebookRules: NotebookRule[]

  storePage: 'store' | 'wishlist'
  setStorePage: (page: 'store' | 'wishlist') => void

  selectedRule: NotebookRule | null
  connection: { ruleRect: DOMRect; targetRect: DOMRect; result: MatchResult } | null

  selectRule: (rule: NotebookRule) => void
  cancelRule: () => void
  makeConnection: (targetRect: DOMRect, result: MatchResult) => void
  clearConnection: () => void
  setPreference: (p: PlayStyle) => void
  startGame: (pref?: PlayStyle) => void
  openNews: () => void
  closeNews: () => void
  showDetail: (game: GameData) => void
  makeDecision: (decision: 'buy' | 'pass') => void
  dismissResult: () => void
  restartGame: () => void
  autoPass: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<GamePhase>('start')
  const [player, setPlayer] = useState<PlayerState>(createInitialPlayer())
  const playerRef = useRef<PlayerState>(createInitialPlayer())
  const [allGames, setAllGames] = useState<GameData[]>(() => generateAllGames())
  const [currentGame, setCurrentGame] = useState<GameData | null>(null)
  const [currentResult, setCurrentResult] = useState<RoundResult | null>(null)
  const [round, setRound] = useState(0)
  const [usedGameIds, setUsedGameIds] = useState<Set<string>>(new Set())
  const [visibleNotification, setVisibleNotification] = useState(false)
  const [saleEvent, setSaleEvent] = useState<SaleEvent | null>(null)
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [newsOpen, setNewsOpen] = useState(false)
  const [newsLocked, setNewsLocked] = useState(false)
  const [bellShaking, setBellShaking] = useState(false)
  const [notebookRules, setNotebookRules] = useState<NotebookRule[]>([])
  const [storePage, setStorePage] = useState<'store' | 'wishlist'>('store')
  const [selectedRule, setSelectedRule] = useState<NotebookRule | null>(null)
  const [connection, setConnection] = useState<{
    ruleRect: DOMRect; targetRect: DOMRect; result: MatchResult
  } | null>(null)
  const decisionMadeRef = useRef(false)
  const notifiedGameIds = useRef<Set<string>>(new Set())

  const maxRounds = MAX_ROUNDS
  const difficulty = getDifficulty(round)
  const detailTime = getDetailTime(difficulty)

  const setPreference = useCallback((p: PlayStyle) => {
    setPlayer(prev => ({ ...prev, preference: p }))
  }, [])

  const selectRule = useCallback((rule: NotebookRule) => {
    setSelectedRule(rule)
    setConnection(null)
  }, [])

  const cancelRule = useCallback(() => {
    setSelectedRule(null)
    setConnection(null)
  }, [])

  const makeConnection = useCallback((targetRect: DOMRect, result: MatchResult) => {
    if (!selectedRule) return
    const ruleEl = document.getElementById(`rule-${selectedRule.id}`)
    if (!ruleEl) return
    const ruleRect = ruleEl.getBoundingClientRect()
    setConnection({ ruleRect, targetRect, result })
  }, [selectedRule])

  const clearConnection = useCallback(() => {
    setConnection(null)
    setSelectedRule(null)
  }, [])

  const ensureWishlistFull = useCallback((roundNum: number) => {
    setPlayer(prev => {
      const pendingCount = prev.wishlist.filter(w => w.status === 'pending').length
      if (pendingCount >= 2) return prev
      const need = 3 - pendingCount
      const newGames: WishlistItem[] = []
      for (const g of allGames) {
        if (newGames.length >= need) break
        if (usedGameIds.has(g.id)) continue
        if (notifiedGameIds.current.has(g.id)) continue
        const alreadyInWishlist = prev.wishlist.some(w => w.game.id === g.id)
        if (alreadyInWishlist) continue
        setUsedGameIds(prevIds => new Set(prevIds).add(g.id))
        newGames.push({ game: g, addedAt: roundNum, status: 'pending' as const })
      }
      if (newGames.length === 0) return prev
      return { ...prev, wishlist: [...prev.wishlist, ...newGames] }
    })
  }, [allGames, usedGameIds])

  const startGame = useCallback((pref?: PlayStyle) => {
    const games = generateAllGames()
    const wishlistGames = shuffle([...games]).slice(0, 10)
    const newUsedIds = new Set<string>()
    wishlistGames.forEach(g => newUsedIds.add(g.id))
    const freshNews = generateNews(wishlistGames)
    const freshNotebook = generateNotebook(wishlistGames)
    setAllGames(games)
    setUsedGameIds(newUsedIds)
    setRound(0)
    setSaleEvent(null)
    setNewsItems(freshNews)
    setNotebookRules(freshNotebook)
    setNewsOpen(false)
    setNewsLocked(false)
    const initPlayer: PlayerState = {
      ...createInitialPlayer(),
      preference: pref ?? player.preference,
      wishlist: wishlistGames.map(g => ({
        game: g,
        addedAt: 0,
        status: 'pending' as const,
      })),
    }
    playerRef.current = initPlayer
    setPlayer(initPlayer)
    setCurrentGame(null)
    setCurrentResult(null)
    setVisibleNotification(false)
    setPhase('idle')
    setBellShaking(true)
    notifiedGameIds.current = new Set()

  }, [player.preference])

  const openNews = useCallback(() => {
    if (newsLocked) return
    setBellShaking(false)
    setNewsOpen(true)
    setPhase('news')
  }, [newsLocked])

  const closeNews = useCallback(() => {
    setNewsOpen(false)
    setNewsLocked(true)
    setPhase('idle')
    setTimeout(() => {
      setPlayer(prev => {
        const pending = prev.wishlist.filter(w => w.status === 'pending') as WishlistItem[]
        if (pending.length === 0) return prev
        const picked = pickUnnotified(pending, notifiedGameIds.current)
        if (!picked) return prev
        notifiedGameIds.current.add(picked.game.id)
        const updated = {
          ...prev,
          wishlist: prev.wishlist.map(w =>
            w.game.id === picked.game.id ? { ...w, status: 'notified' as const } : w
          ),
        }
        playerRef.current = updated
        return updated
      })
      setTimeout(() => {
        setVisibleNotification(true)
      }, 400)
    }, 600)
  }, [])

  const showDetail = useCallback((game: GameData) => {
    decisionMadeRef.current = false
    setCurrentGame(game)
    setVisibleNotification(false)
    setPhase('detail')
  }, [])

  const autoPass = useCallback(() => {
    try {
      if (decisionMadeRef.current) return
      if (!currentGame) { console.error('[autoPass] currentGame is null'); return }
    const latestPlayer = playerRef.current
    const result = calcScore(currentGame, 'pass', latestPlayer.preference || undefined, newsItems, notebookRules)
    setCurrentResult(result)
    setPlayer(prev => {
      const np = { ...prev }
      np.wishlist = prev.wishlist.map(w =>
        w.game.id === currentGame.id ? { ...w, status: 'passed' as const } : w
      )
      if (result.isGreyZone) {
        np.greyZoneHits += 1
      } else if (result.isCorrect) {
        np.totalSaved += Math.max(result.moneyDelta, 0)
        np.combo += 1
        np.maxCombo = Math.max(np.maxCombo, np.combo)
        np.correctDecisions += 1
      } else {
        np.totalWasted += Math.abs(Math.min(result.moneyDelta, 0))
        np.combo = 0
        np.wrongDecisions += 1
        if (currentGame.worthBuying) np.missCount += 1
      }
      playerRef.current = np
      return np
    })
      setPhase('result')
    } catch (e) {
      console.error('[autoPass] error:', e)
    }
  }, [currentGame, newsItems, notebookRules])

  const makeDecision = useCallback((decision: 'buy' | 'pass') => {
    try {
      if (!currentGame) { console.error('[makeDecision] currentGame is null'); return }
      decisionMadeRef.current = true
      const latestPlayer = playerRef.current
      const pref = latestPlayer.preference || undefined
      const result = calcScore(currentGame, decision, pref, newsItems, notebookRules)
      setCurrentResult(result)
      setPlayer(prev => {
        const np = { ...prev }
        if (decision === 'buy' && prev.wallet >= currentGame.currentPrice) {
          np.wallet = prev.wallet - currentGame.currentPrice
          np.inventory = [...prev.inventory, currentGame]
          np.wishlist = prev.wishlist.map(w =>
            w.game.id === currentGame.id ? { ...w, status: 'bought' as const } : w
          )
        } else if (decision === 'buy') {
          np.wishlist = prev.wishlist.map(w =>
            w.game.id === currentGame.id ? { ...w, status: 'passed' as const } : w
          )
        } else {
          np.wishlist = prev.wishlist.map(w =>
            w.game.id === currentGame.id ? { ...w, status: 'passed' as const } : w
          )
        }
        if (result.isGreyZone) {
          np.greyZoneHits += 1
        } else if (result.isCorrect) {
          np.totalSaved += Math.max(result.moneyDelta, 0)
          np.combo += 1
          np.maxCombo = Math.max(np.maxCombo, np.combo)
          np.correctDecisions += 1
        } else {
          np.totalWasted += Math.abs(Math.min(result.moneyDelta, 0))
          np.combo = 0
          np.wrongDecisions += 1
          if (decision === 'pass' && currentGame.worthBuying) np.missCount += 1
        }
        playerRef.current = np
        return np
      })
      setPhase('result')
    } catch (e) {
      console.error('[makeDecision] error:', e)
    }
  }, [currentGame, newsItems, notebookRules])

  const dismissResult = useCallback(() => {
    const nextRound = round + 1
    setRound(nextRound)
    setCurrentResult(null)
    setCurrentGame(null)
    setVisibleNotification(false)
    setSaleEvent(null)
    decisionMadeRef.current = false

    if (nextRound >= maxRounds) {
      setPhase('end')
      return
    }

    setPhase('idle')

    setPlayer(prev => {
      const passedGames = prev.wishlist.filter(w => w.status === 'passed')
      if (passedGames.length > 0 && Math.random() < RETURN_CHANCE) {
        const returned = passedGames[Math.floor(Math.random() * passedGames.length)]
        returned.game.discountPercent = Math.min(95, returned.game.discountPercent + Math.floor(Math.random() * 10) + 5)
        returned.game.currentPrice = Math.round(returned.game.originalPrice * (1 - returned.game.discountPercent / 100))
        setSaleEvent({
          type: 'return',
          name: '限时回归',
          icon: '🔄',
          description: `${returned.game.name} 再次史低！折扣加码至 ${returned.game.discountPercent}%`,
        })
        return {
          ...prev,
          wishlist: prev.wishlist.map(w =>
            w.game.id === returned.game.id
              ? { ...w, status: 'pending' as const, game: returned.game }
              : w
          ),
        }
      }
      return prev
    })

    if ((nextRound + 1) % 3 === 0 || (nextRound + 1) % 4 === 0) {
      const event = generateSaleEvent()
      setSaleEvent(event)
      if (event.type === 'summer' || event.type === 'winter') {
        const extraOff = event.type === 'summer' ? 0.85 : 0.8
        setPlayer(prev => ({
          ...prev,
          wishlist: prev.wishlist.map(w => ({
            ...w,
            game: {
              ...w.game,
              currentPrice: Math.round(w.game.currentPrice * extraOff),
              discountPercent: Math.min(95, Math.round((1 - (w.game.currentPrice * extraOff) / w.game.originalPrice) * 100)),
            },
          })),
        }))
      }
    }

    ensureWishlistFull(nextRound)

    setTimeout(() => {
      setPlayer(prev => {
        const pendingGames = prev.wishlist.filter(w => w.status === 'pending') as WishlistItem[]
        if (pendingGames.length === 0) return prev
        const picked = pickUnnotified(pendingGames, notifiedGameIds.current)
        if (!picked) return prev
        notifiedGameIds.current.add(picked.game.id)
        const updated = {
          ...prev,
          wishlist: prev.wishlist.map(w =>
            w.game.id === picked.game.id ? { ...w, status: 'notified' as const } : w
          ),
        }
        playerRef.current = updated
        return updated
      })
      setTimeout(() => {
        setVisibleNotification(true)
      }, 500)
    }, 1000)
  }, [round, maxRounds, ensureWishlistFull, allGames])

  const restartGame = useCallback(() => {
    setPhase('start')
    setCurrentGame(null)
    setCurrentResult(null)
    setRound(0)
    setUsedGameIds(new Set())
    setVisibleNotification(false)
    setSaleEvent(null)
    setNewsLocked(false)
    setNewsOpen(false)
  }, [])

  return (
    <GameContext.Provider value={{
      phase, player, allGames, currentGame, currentResult,
      round, maxRounds, visibleNotification, saleEvent,
      difficulty, detailTime, newsItems, newsOpen, bellShaking, newsLocked,
      notebookRules,
      storePage,
      setStorePage,
      selectedRule,
      connection,
      selectRule, cancelRule, makeConnection, clearConnection,
      setPreference, startGame, openNews, closeNews,
      showDetail, makeDecision, dismissResult, restartGame, autoPass,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
