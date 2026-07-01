import type { SaleEvent } from '../types/game'

const EVENTS: SaleEvent[] = [
  {
    type: 'summer',
    name: '夏日特卖',
    icon: '☀️',
    description: 'Steam夏促来袭！全场额外8.5折，所有愿望单游戏同时降价',
  },
  {
    type: 'winter',
    name: '冬季特卖',
    icon: '❄️',
    description: 'Steam冬促开启！全场额外8折，快来囤过冬游戏',
  },
  {
    type: 'weekend',
    name: '周末特惠',
    icon: '🎮',
    description: '周末限时闪购！随机品类游戏额外降价，手慢无',
  },
  {
    type: 'weekend',
    name: '发行商周末',
    icon: '🏢',
    description: '某发行商全线折上折！旗下所有游戏额外立减',
  },
  {
    type: 'summer',
    name: '夏促倒计时',
    icon: '⏰',
    description: '夏促最后48小时！所有折扣即将恢复原价',
  },
]

let lastEventIndex = -1

export function generateSaleEvent(): SaleEvent {
  let index: number
  do {
    index = Math.floor(Math.random() * EVENTS.length)
  } while (index === lastEventIndex)
  lastEventIndex = index
  return EVENTS[index]
}
