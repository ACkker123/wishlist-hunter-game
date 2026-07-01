import { useEffect, useRef, useState } from 'react'
import { useGame } from '../../context/GameContext'

export function ConnectorOverlay() {
  const { connection, clearConnection } = useGame()
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (connection) {
      setVisible(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setVisible(false)
        setTimeout(() => clearConnection(), 300)
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [connection, clearConnection])

  if (!connection || !visible) return null

  const { ruleRect, targetRect, result } = connection
  const isMatch = result === 'match'

  const x1 = ruleRect.left - 6
  const y1 = ruleRect.top + ruleRect.height / 2
  const x2 = targetRect.left - 4
  const y2 = targetRect.top + targetRect.height / 2

  const midX = (x1 + x2) / 2
  const ox = midX + 40

  const points = `${x1},${y1} ${ox},${y1} ${ox},${y2} ${x2},${y2}`
  const pathLen = Math.abs(ox - x1) + Math.abs(y2 - y1) + Math.abs(x2 - ox)
  const corners = [
    { cx: x1, cy: y1 },
    { cx: ox, cy: y1 },
    { cx: ox, cy: y2 },
    { cx: x2, cy: y2 },
  ]

  const midY = (y1 + y2) / 2
  const labelX = ox > x2 ? ox - 16 : ox + 16
  const labelY = midY - 8

  const lineColor = isMatch ? '#6dc849' : '#d9414e'
  const flashValues = isMatch
    ? '#ffffff;#6dc849;#ffffff;#6dc849;#6dc849'
    : '#ffffff;#d9414e;#ffffff;#d9414e;#d9414e'

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Main polyline: fade in + flash */}
        <polyline
          points={points}
          fill="none"
          stroke={lineColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="8,4"
          strokeDashoffset={pathLen}
        >
          <animate attributeName="opacity" from="0" to="1" dur="0.1s" fill="freeze" />
          <animate
            attributeName="strokeDashoffset"
            from={pathLen}
            to="0"
            dur="0.25s"
            fill="freeze"
          />
          <animate
            attributeName="stroke"
            values={flashValues}
            keyTimes="0;0.17;0.33;0.5;1"
            dur="1s"
            fill="freeze"
          />
        </polyline>

        {/* Corner junction dots */}
        {corners.map((c, i) => (
          <circle
            key={i}
            cx={c.cx}
            cy={c.cy}
            r={i === 3 ? 5 : 3}
            fill={i === 3 ? lineColor : 'rgba(255,255,255,0.6)'}
            stroke={lineColor}
            strokeWidth="1.5"
          >
            <animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" />
            <animate
              attributeName="fill"
              values={i === 3 ? `rgba(255,255,255,0.6);${lineColor};rgba(255,255,255,0.6);${lineColor};${lineColor}` : 'rgba(255,255,255,0.6);rgba(255,255,255,0.6);rgba(255,255,255,0.6);rgba(255,255,255,0.6);rgba(255,255,255,0.6)'}
              keyTimes="0;0.17;0.33;0.5;1"
              dur="1s"
              fill="freeze"
            />
          </circle>
        ))}

        {/* Label text */}
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          fill={lineColor}
          fontSize="13"
          fontWeight="bold"
          style={{ textShadow: '0 0 6px rgba(0,0,0,0.8)' }}
        >
          <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0.6s" fill="freeze" />
          {isMatch ? '该项目匹配' : '违反规则'}
        </text>
      </svg>
    </div>
  )
}
