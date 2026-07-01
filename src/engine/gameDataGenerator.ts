import type { GameSeed } from '../types/game'

const ADJECTIVES = ['暗影', '黎明', '星辰', '深渊', '烈焰', '冰霜', '雷霆', '虚空', '幻影', '永恒',
  '失落', '觉醒', '破晓', '天启', '混沌', '希望', '梦魇', '时空', '极光', '末日']

const NOUNS = ['传说', '远征', '遗迹', '契约', '编年史', '起源', '归宿', '守望', '征途', '狂潮',
  '迷宫', '猎手', '守护者', '开拓者', '幸存者', '流浪者', '骑士团', '暗影会', '神谕', '启示录']

const STUDIOS = ['Moonlight Studios', 'Crimson Forge', 'Iron Gate Studios', 'Digital Phoenix',
  'Nova Games', 'Eclipse Interactive', 'Aurora Lab', 'Gravity Well', 'Pixel Foundry', 'Void Works',
  'Blaze Entertainment', 'Hollow Interactive', 'Neon Arcade', 'Thunderhead Games', 'Whisper Press']

export function generateRandomGame(): GameSeed {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  const developer = STUDIOS[Math.floor(Math.random() * STUDIOS.length)]
  const isGood = Math.random() > 0.45

  const tags = pickRandomTags()
  const originalPrice = [18, 28, 48, 58, 68, 98, 138, 168, 198, 258, 298, 398][Math.floor(Math.random() * 12)]
  const reviewScore = isGood
    ? 75 + Math.floor(Math.random() * 21)
    : 15 + Math.floor(Math.random() * 41)
  const devRating = isGood
    ? 60 + Math.floor(Math.random() * 36)
    : 5 + Math.floor(Math.random() * 41)

  return {
    name: `${adj}${noun}`,
    developer,
    developerRating: devRating,
    tags,
    description: generateDescription(tags),
    reviewScore,
    reviewCount: Math.floor(1000 + Math.random() * 200000),
    originalPrice,
    historicalLow: Math.round(originalPrice * (0.1 + Math.random() * 0.4)),
    discountPercent: Math.floor(50 + Math.random() * 41),
    worthBuying: isGood,
    reviews: generateReviews(isGood),
  }
}

function pickRandomTags(): string[] {
  const allTags = ['动作', '冒险', 'RPG', '策略', '模拟', '独立', '开放世界', '生存',
    '多人', '单机', '抢先体验', '休闲', '像素风', 'Rogue-like', '恐怖', '科幻',
    '奇幻', 'FPS', '剧情丰富', '建造', '竞速', '体育', '音乐', '教育',
    '卡牌', '解谜', '潜行', '射击', '回合制']
  const count = 3 + Math.floor(Math.random() * 4)
  const shuffled = allTags.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function generateDescription(tags: string[]): string {
  const templates = [
    `在这个${tags[0]}世界里展开一段难忘的冒险旅程。`,
    `融合了${tags.slice(0, 2).join('与')}元素的独特体验。`,
    `${tags[0]}类游戏的集大成之作，不容错过。`,
    `一款精心打造的${tags[0]}游戏，带给你前所未有的沉浸感。`,
    `在这款${tags[0]}游戏中探索无尽的可能。`,
  ]
  return templates[Math.floor(Math.random() * templates.length)]
}

function generateReviews(isGood: boolean): { positive: string; negative: string } {
  const goodPositive = [
    '玩了300小时了，每次打开都有新发现。这个价格闭眼入！',
    '年度最佳，没有之一。游戏性、美术、音乐都是顶级水准。',
    '等了两年终于史低了，这个价格太值了，赶紧买！',
    '游戏内容充实到爆炸，这个价格简直是白送。',
    '一口气通关后意犹未尽，DLC也都买齐了，强烈推荐。',
  ]
  const goodNegative = [
    '优化还有进步空间，高配偶尔掉帧。',
    '中文本地化有些地方翻得不太到位。',
    '后期内容稍微有点重复，但整体瑕不掩瑜。',
  ]
  const badPositive = [
    '还行吧，打发时间可以，毕竟便宜。',
    '画面还不错，其他就不好说了。',
    '对得起这个价位吧，别期望太高。',
  ]
  const badNegative = [
    '纯纯的换皮游戏，新瓶装旧酒，毫无诚意。',
    'BUG多到玩不下去，开发者已经几个月没更新了。',
    '不要被画面骗了，内容空洞得要命，两个小时就想退款。',
    '开发商的历史全是烂尾作品，千万别信他们的承诺。',
    '服务器烂到无法联机，单人模式也无聊透顶。',
  ]

  return {
    positive: goodPositive[Math.floor(Math.random() * goodPositive.length)],
    negative: isGood
      ? goodNegative[Math.floor(Math.random() * goodNegative.length)]
      : badNegative[Math.floor(Math.random() * badNegative.length)],
  }
}
