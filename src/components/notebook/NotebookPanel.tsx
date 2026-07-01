import { useState, useCallback } from 'react'
import { useGame } from '../../context/GameContext'

export function NotebookPanel() {
  const { notebookRules, selectedRule, connection, selectRule, cancelRule } = useGame()
  const [open, setOpen] = useState(false)

  const handleRuleClick = useCallback((rule: typeof notebookRules[number]) => {
    if (selectedRule?.id === rule.id) {
      cancelRule()
    } else {
      selectRule(rule)
    }
  }, [selectedRule, selectRule, cancelRule])

  if (notebookRules.length === 0) return null

  return (
    <>
      {/* Persistent book icon — hidden when panel is open */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-steam-card border-2 border-steam-border rounded-md flex items-center justify-center text-2xl hover:border-steam-accent hover:bg-steam-bg-hover transition-all shadow-lg hover:scale-105"
          title="情报分析师记事本"
        >
          {'📓'}
        </button>
      )}

      {/* Side panel — no backdrop */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-steam-card border-l border-steam-border z-40 shadow-2xl transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-steam-border shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{'📓'}</span>
            <h2 className="text-sm font-bold text-steam-text uppercase tracking-wider">情报分析师记事本</h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-steam-text-dim hover:text-steam-text w-7 h-7 flex items-center justify-center rounded-sm hover:bg-steam-bg-hover transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto" style={{ height: 'calc(100% - 57px)' }}>
          {selectedRule ? (
            <p className="text-xs text-steam-accent mb-3 bg-steam-accent/10 p-2 rounded-sm">
              {'\u{1F449}'} 点击详情页中对应信息可连线比对
            </p>
          ) : (
            <p className="text-xs text-steam-text-dim mb-3">
              我在本局的游戏偏向，在每局游戏中固定不变。点击规则可连线对比。
            </p>
          )}

          {notebookRules.map(rule => {
            const isSelected = selectedRule?.id === rule.id
            const hasResult = isSelected && connection !== null
            const resultColor = connection?.result === 'match' ? '#6dc849' : '#d9414e'
            const borderStyle = hasResult
              ? { borderColor: resultColor, boxShadow: `0 0 12px ${resultColor}40` }
              : isSelected
              ? { borderColor: '#c29843', boxShadow: '0 0 12px #c2984340' }
              : undefined

            return (
              <div
                key={rule.id}
                id={`rule-${rule.id}`}
                onClick={() => handleRuleClick(rule)}
                className={`p-3 rounded-sm border bg-steam-panel cursor-pointer transition-all duration-200 hover:border-steam-accent ${isSelected ? '' : 'border-steam-border'}`}
                style={borderStyle}
              >
                <div className="text-sm text-steam-text leading-snug">{rule.label}</div>
                <div className="text-[10px] text-steam-text-dim mt-0.5">
                  规则 #{rule.id + 1}
                </div>
              </div>
            )
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-steam-border bg-steam-card">
          <button
            onClick={() => setOpen(false)}
            className="w-full text-xs text-steam-accent hover:text-steam-text py-1 rounded-sm hover:bg-steam-bg-hover transition-colors"
          >
            关闭记事本
          </button>
        </div>
      </div>
    </>
  )
}
