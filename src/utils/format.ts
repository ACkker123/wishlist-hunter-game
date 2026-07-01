export function formatPrice(price: number): string {
  if (price === 0) return '免费'
  return `¥${price}`
}

export function formatDiscount(percent: number): string {
  return `-${percent}%`
}

export function formatReviewScore(score: number): string {
  if (score >= 95) return '好评如潮'
  if (score >= 85) return '特别好评'
  if (score >= 80) return '好评'
  if (score >= 70) return '多半好评'
  if (score >= 50) return '褒贬不一'
  if (score >= 30) return '多半差评'
  return '差评如潮'
}

export function formatReviewScoreColor(score: number): string {
  if (score >= 80) return 'text-steam-positive'
  if (score >= 50) return 'text-steam-mixed'
  return 'text-steam-negative'
}

export function formatNumber(n: number): string {
  if (n >= 10000) {
    return (n / 10000).toFixed(1) + '万'
  }
  return n.toLocaleString()
}

export function formatCombo(n: number): string {
  if (n < 3) return ''
  if (n < 5) return '小火'
  if (n < 8) return '连击!'
  if (n < 12) return '超神!!'
  return '无敌!!!'
}
