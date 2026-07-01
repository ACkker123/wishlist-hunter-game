import type { NotebookRule } from '../types/notebook'

export interface RuleTemplate {
  type: NotebookRule['type']
  generate: (params: {
    developers: string[]
    prices: number[]
    dimensions: { gameplay: number; contentDepth: number; polish: number; valueForMoney: number }
    tags: string[]
    reviewScores: number[]
  }) => NotebookRule | null
}

const TEMPLATES: RuleTemplate[] = [
  {
    type: 'developer_ban',
    generate({ developers }) {
      if (developers.length === 0) return null
      const dev = developers[Math.floor(Math.random() * developers.length)]
      return {
        id: 0,
        type: 'developer_ban',
        label: `不买 ${dev} 厂商的游戏`,
        developer: dev,
      }
    },
  },
  {
    type: 'price_cap',
    generate({ prices }) {
      const sorted = [...prices].sort((a, b) => a - b)
      if (sorted.length < 4) {
        const mid = sorted[Math.floor(sorted.length / 2)]
        if (mid == null || mid <= 0) return null
        return {
          id: 0,
          type: 'price_cap',
          label: `不买价格超过 ¥${mid} 的游戏`,
          maxPrice: mid,
        }
      }
      const pct = 0.35 + Math.random() * 0.3
      const idx = Math.floor((sorted.length - 1) * pct)
      const cap = sorted[Math.min(idx, sorted.length - 1)]
      if (cap <= 0) return null
      return {
        id: 0,
        type: 'price_cap',
        label: `不买价格超过 ¥${cap} 的游戏`,
        maxPrice: cap,
      }
    },
  },
  {
    type: 'dimension_min',
    generate({ dimensions }) {
      const dims = [
        { key: 'gameplay', label: '游戏性', val: dimensions.gameplay },
        { key: 'contentDepth', label: '内容丰富度', val: dimensions.contentDepth },
        { key: 'polish', label: '完成度', val: dimensions.polish },
        { key: 'valueForMoney', label: '性价比', val: dimensions.valueForMoney },
      ]
      const dim = dims[Math.floor(Math.random() * dims.length)]
      const minVal = Math.max(40, dim.val - 15 + Math.floor(Math.random() * 25))
      return {
        id: 0,
        type: 'dimension_min',
        label: `${dim.label}评分低于 ${minVal} 的游戏不买`,
        dimension: dim.key,
        dimLabel: dim.label,
        minValue: minVal,
      }
    },
  },
  {
    type: 'review_floor',
    generate() {
      const pct = 60 + Math.floor(Math.random() * 16)
      return {
        id: 0,
        type: 'review_floor',
        label: `好评率低于 ${pct}% 的游戏不买`,
        minReviewScore: pct,
      }
    },
  },
]

export { TEMPLATES }
