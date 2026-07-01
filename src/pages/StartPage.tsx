import { useState } from 'react'
import { SteamButton } from '../components/shared/SteamButton'
import { useGame } from '../context/GameContext'
import type { PlayStyle } from '../types/game'

const PREFERENCES: { key: PlayStyle; emoji: string; label: string; desc: string; tags: string }[] = [
  { key: 'story', emoji: '🎭', label: '剧情党', desc: 'RPG/叙事类游戏', tags: '价值 +25%' },
  { key: 'competitive', emoji: '⚔️', label: '竞技党', desc: 'PVP/射击类游戏', tags: '价值 +25%' },
  { key: 'casual', emoji: '🌿', label: '休闲党', desc: '模拟/休闲类游戏', tags: '价值 +25%' },
  { key: 'collector', emoji: '🎴', label: '收集党', desc: '卡牌/刷宝类游戏', tags: '价值 +25%' },
]

export function StartPage() {
  const { startGame } = useGame()
  const [selected, setSelected] = useState<PlayStyle | null>(null)
  const [showIntro, setShowIntro] = useState(true)

  const handleStart = () => {
    if (!selected) return
    startGame(selected)
  }

  if (showIntro) {
    return (
      <div className="min-h-screen bg-steam-bg flex flex-col items-center justify-center p-4">
        <div className="animate-[fadeInUp_0.5s_ease-out] text-center max-w-md w-full">
          <div className="bg-steam-card rounded-sm p-6 border border-steam-border">
            <div className="text-5xl mb-4">🎮</div>
            <h1 className="text-2xl font-bold text-steam-text mb-4">愿望单猎人</h1>
            <p className="text-sm text-steam-text-dim leading-relaxed mb-6 text-left">
              今天是2026年7月10日00:50，你刚刚意识到10分钟后夏促就会停止，购物车中的游戏即将全部回归于原价！点击开始并通过右上角的今日新闻和之后右下角推送中的玩家评价、历史价格以及厂商口碑等要素了解你心愿单中的游戏是否值得购买！祝你好运
            </p>
            <SteamButton
              variant="green"
              size="lg"
              onClick={() => setShowIntro(false)}
              className="w-full py-3 text-sm font-bold"
            >
              开始夏促最后十分钟
            </SteamButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-steam-bg flex flex-col items-center justify-center p-4">
      <div className="animate-[fadeInUp_0.6s_ease-out] text-center max-w-lg w-full">
        <div className="text-6xl mb-6">🎯</div>

        <h1 className="text-3xl font-bold text-steam-text mb-1">愿望单猎人</h1>
        <p className="text-sm text-steam-accent mb-6">Steam 情报分析师模拟器</p>

        {/* Rules */}
        <div className="bg-steam-card rounded-sm p-4 border border-steam-border mb-4 text-left">
          <h3 className="text-xs font-bold text-steam-text uppercase tracking-wider mb-2">📋 游戏规则</h3>
          <ul className="space-y-1.5 text-[11px] text-steam-text-dim">
            <li className="flex items-start gap-2">
              <span className="text-steam-positive mt-0.5">{'\u25B9'}</span>
              <span><strong className="text-steam-text">20秒新闻简报</strong> — 每轮开始前查看3页情报，密切关注与你愿望单相关的开发商和品类</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-steam-positive mt-0.5">{'\u25B9'}</span>
              <span><strong className="text-steam-text">15秒决策窗口</strong> — 分析4维度评分、干扰信号、玩家评价</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-steam-positive mt-0.5">{'\u25B9'}</span>
              <span><strong className="text-steam-mixed">📓 记事本守则</strong> — 你在本局的购买倾向，违反任何一条即为失误，务必对照检查</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-steam-positive mt-0.5">{'\u25B9'}</span>
              <span><strong className="text-steam-text">¥5,000</strong> 初始资金，<strong className="text-steam-negative">20轮</strong>挑战</span>
            </li>
          </ul>
        </div>

        {/* Preference */}
        <div className="bg-steam-card rounded-sm p-4 border border-steam-border mb-4">
          <h3 className="text-xs font-bold text-steam-text uppercase tracking-wider mb-3">
            选择你的玩家类型
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {PREFERENCES.map(pref => (
              <button
                key={pref.key}
                onClick={() => setSelected(pref.key)}
                className={`text-left p-2.5 rounded-sm border transition-all ${
                  selected === pref.key
                    ? 'border-steam-accent bg-steam-accent/10'
                    : 'border-steam-border bg-steam-nav hover:border-steam-border/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{pref.emoji}</span>
                  <div>
                    <div className="text-xs font-bold text-steam-text">{pref.label}</div>
                    <div className="text-[10px] text-steam-text-dim">{pref.desc}</div>
                  </div>
                </div>
                <div className="text-[9px] text-steam-positive mt-1">{pref.tags}</div>
              </button>
            ))}
          </div>
        </div>

        <SteamButton
          variant="green"
          size="lg"
          onClick={handleStart}
          disabled={!selected}
          className={`w-full text-sm font-bold py-3 ${!selected ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          {selected ? '开始情报分析' : '请先选择玩家类型'}
        </SteamButton>
      </div>
    </div>
  )
}
