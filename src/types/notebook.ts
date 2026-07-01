export type RuleType = 'developer_ban' | 'price_cap' | 'dimension_min' | 'review_floor'

export interface NotebookRule {
  id: number
  type: RuleType
  label: string
  developer?: string
  maxPrice?: number
  dimension?: string
  dimLabel?: string
  minValue?: number
  minReviewScore?: number
}
